//Load aws module.
require('dotenv').config();
const { AdminUpdateUserAttributesCommand, RespondToAuthChallengeCommand, AdminInitiateAuthCommand, AdminAddUserToGroupCommand, AdminSetUserPasswordCommand, CognitoIdentityProviderClient, AdminConfirmSignUpCommand, SignUpCommand, InitiateAuthCommand } = require("@aws-sdk/client-cognito-identity-provider");

const { generateVerificationCode } = require('../utils/index'); 

// Services
const userAuthentication = require('../services/userAuthentication');
const user = require('./user')

const config = require('config');

// AWS SDK v3 configurations
const cognitoISP = new CognitoIdentityProviderClient({
  region: process.env.REGION
});

const AmazonCognitoId = require('amazon-cognito-identity-js');
const userAttributes = require('../dao/cognitoUsers');


//Set fetch, because aws cognito lib was created for browsers.
global.fetch = require('node-fetch');


const poolData = {
  UserPoolId: process.env.USER_POOL_ID,
  ClientId: process.env.APP_CLIENT_ID,
  region: process.env.REGION
};


//Get user pool.
const userPool = new AmazonCognitoId.CognitoUserPool(poolData);


//Very the registration code.
const verifyCode = (username, code) => {
  return new Promise((resolve, reject) => {

    const userPool = new AmazonCognitoId.CognitoUserPool(poolData);
    const userData = {
      Username: username,
      Pool: userPool
    };

    const cognitoUser = new AmazonCognitoId.CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });

  });

}



// Assign User to a group
const assignUserToAGroup = async(body) => {
  const params = new AdminAddUserToGroupCommand({
    UserPoolId: process.env.USER_POOL_ID,
    Username: body.email,
    GroupName: body.role,
  });

  try {
    const userAddedToGroup = await cognitoISP.send(params);
    return userAddedToGroup;
  } catch (err) {
    throw err;
  }
}

// Confirm User manually
const confirmUser = async(body) => {
  const params = new AdminConfirmSignUpCommand({
    UserPoolId: process.env.USER_POOL_ID,
    Username: body.email,
   });

  try {
    const userConfirmed = await cognitoISP.send(params);
    return userConfirmed;
  } catch (err) {
    throw err;
  }
}

// Manually verify the user's email cognito
const verifyEmail = async (body) => {
  try {
    // Update the user's email verification status
    const updateUserAttributesParams = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: body.email,
      UserAttributes: [
        {
          Name: "email_verified",
          Value: "true",
        },
      ],
    };

    const updateUserAttributesCommand = new AdminUpdateUserAttributesCommand(updateUserAttributesParams);
    await cognitoISP.send(updateUserAttributesCommand);
  } catch (err) {
      console.log('Error in user verify email:', err);
      throw new Error(`Error in user verify email:`+err);
  }
};


// Register a new user and return the data in a promise.
const signUp = (body) => {
  return new Promise(async(resolve, reject) => {
    try {
      const customAttributeList = userAttributes.daoUserAttributes(body);
      const signUpCommand = new SignUpCommand({
        ClientId: process.env.APP_CLIENT_ID,
        Password: body.password,
        Username: body.email,
        UserAttributes: customAttributeList,
        ValidationData: [
          { Name: 'email', Value: body.email },
        ],
      });

      const signUpComplete = await cognitoISP.send(signUpCommand);

      const userConfirmed = await confirmUser(body);
      const userAddedToGroup = await assignUserToAGroup(body);

      // Send email to the user if he is a customer / will be in async
      const userUserLogin = await login(body.email, body.password);

      resolve(userUserLogin);
    } catch (err) {
      reject(err);
    }
  });
};


// Get user Role

//Auth in cognito
const login = (email, password) => {
  return new Promise((resolve, reject) => {
    const initiateAuthCommand = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.APP_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    cognitoISP.send(initiateAuthCommand)
      .then(result => {
        const accessToken = result.AuthenticationResult.AccessToken;
        const idToken = result.AuthenticationResult.IdToken;
        const refreshToken = result.AuthenticationResult.RefreshToken;

        resolve({
          accessToken: accessToken,
          idToken: idToken,
          refreshToken: refreshToken,
        });
      })
      .catch(err => reject(err));
  });
}

// Renew token.
const renew = (token) => {
  return new Promise((resolve, reject) => {
    const initiateAuthCommand = new InitiateAuthCommand({
      ClientId: process.env.APP_CLIENT_ID,
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: {
        REFRESH_TOKEN: token,
      }
    });

    cognitoISP.send(initiateAuthCommand)
      .then(result => {
        const accessToken = result.AuthenticationResult.AccessToken;
        const idToken = result.AuthenticationResult.IdToken;
        const newRefreshToken = result.AuthenticationResult.RefreshToken;

        const retObj = {
          "access_token": accessToken,
          "id_token": idToken,
          "refresh_token": newRefreshToken,
        };
        resolve(retObj);
      })
      .catch(err => reject(err));
  });
};

// Forgot Password
const resetPassword = (username) => {
  return new Promise((resolve, reject) => {
    const userData = {
      Username: username,
      Pool: userPool
    };

    const cognitoUser = new AmazonCognitoId.CognitoUser(userData);

    // call forgotPassword on cognitoUser
    cognitoUser.forgotPassword({
      onSuccess: function (result) {
        resolve(result);
      },
      onFailure: function (err) {
        console.log("I am err:", err);
        reject(err)
      },
      // inputVerificationCode() { // this is optional, and likely won't be implemented as in AWS's example (i.e, prompt to get info)
      //   var verificationCode = prompt('Please input verification code ', '');
      //   var newPassword = prompt('Enter new password ', '');
      //   cognitoUser.confirmPassword(verificationCode, newPassword, this);
      // }
    });
  });
};


const authenticateAndGetAccessToken = (username, password) => {
  return new Promise((resolve, reject) => {
    const adminInitiateAuthCommand = new AdminInitiateAuthCommand({
      UserPoolId: process.env.USER_POOL_ID,
      ClientId: process.env.APP_CLIENT_ID,
      AuthFlow: "ADMIN_NO_SRP_AUTH",
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    });

    cognitoISP.send(adminInitiateAuthCommand)
      .then(response => {
        if (response.ChallengeName === "NEW_PASSWORD_REQUIRED") {
          const respondToAuthChallengeCommand = new RespondToAuthChallengeCommand({
            ClientId: process.env.APP_CLIENT_ID,
            ChallengeName: "NEW_PASSWORD_REQUIRED",
            ChallengeResponses: {
              USERNAME: username,
              NEW_PASSWORD: password
            },
            Session: response.Session
          });

          cognitoISP.send(respondToAuthChallengeCommand)
            .then(authResponse => {
              const accessToken = authResponse.AuthenticationResult.AccessToken;
              resolve(accessToken);
            })
            .catch(err => reject(err));
        } else {
          const accessToken = response.AuthenticationResult.AccessToken;
          resolve(accessToken);
        }
      })
      .catch(err => reject(err));
  });
};

const confirmPasswordChange = (username, password) => {
  return new Promise((resolve, reject) => {
    authenticateAndGetAccessToken(username, password)
      .then(accessToken => {
        const adminSetUserPasswordCommand = new AdminSetUserPasswordCommand({
          UserPoolId: process.env.USER_POOL_ID,
          Username: username,
          Password: password,
          Permanent: true
        });

        cognitoISP.send(adminSetUserPasswordCommand)
          .then(() => {
            resolve();
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
};

const confirmPass = (username, newpassword) => {
  return new Promise((resolve, reject) => {
    const changePasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: process.env.USER_POOL_ID,
      Username: username,
      Password: newpassword,
    });

    cognitoISP.send(changePasswordCommand)
      .then(async(result) => {
        await confirmPasswordChange(username, newpassword);
        resolve(result);
      })
      .catch(err => reject(err));
  });
}

//Change password.
const changePwd = (username, password, newPassword) => {
  return new Promise((resolve, reject) => {
    const changePasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: process.env.USER_POOL_ID,
      Username: username,
      Password: password,
    });

    cognitoISP.send(changePasswordCommand)
      .then(async(result) => {
        await confirmPasswordChange(username, newPassword);
        resolve({
          message: 'Password changed successfully.'
        });
      })
      .catch(err => reject(err));
  });
};

const updateUser = (req, res) => {
  // Create / Update User Custom Attributes
  let { body } = req;
  body.token = req.headers['access_token'];
  try {
    return new Promise((resolve, reject) => {

      var customAttributeList = userAttributes.daoUserAttributes(body);
    
      if(customAttributeList.length > 0) {
        let params = {
          UserAttributes: customAttributeList,
          UserPoolId: process.env.USER_POOL_ID,
          Username: body.userDetails.email, // Replace with the username you want to update
        };

        const command = new AdminUpdateUserAttributesCommand(params);
  
        cognitoISP.send(command, (err, data) => {
          if (err) {
            reject(err);
          }
          else {
            resolve("User details successfully updated.");
          }
        });
      } else {
        reject('Error !!! User has not giving any details.')
      }
      
    });
  } catch(err) {
    reject(err);
  }
}

module.exports.verifyCode = verifyCode;
module.exports.signUp = signUp;
module.exports.logIn = login;
module.exports.renew = renew;
module.exports.changePwd = changePwd;
module.exports.resetPassword = resetPassword;
module.exports.confirmPass = confirmPass;
module.exports.updateUser = updateUser;