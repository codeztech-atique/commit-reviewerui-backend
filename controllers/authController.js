//Load cognito wrapper.
const cognito = require('../services/cognito.js');
const exception = require('../exception/index');
const userAuth = require('../services/userAuthentication');
const authentication = require('../authentication');

exports.register = async function (req, res) {
  try {

    //Send to cognito the signup request.
    let result = await cognito.signUp(req.body);
   
    res.status(200).json(result);

  } catch (err) {
    console.log("Error:", err);
    const getException = exception.userException(err.name)
    res.status(400).json(getException);
  }
}

exports.login = async function (req, res) { 
  let {
      email,
      password
  } = req.body;

  try {
    //Send to cognito the signup request.
    let result = await cognito.logIn(email, password);
  
    res.status(200).json(result);
    
  } catch (err) {
    console.log(err);
    const getException = exception.userException(err.name)
    res.status(400).json(getException);
  }
}




exports.verifyEmail = async function (req, res) {
  const {
    body
  } = req;

  //Validate request format.

  try {

    //Send to cognito the signup request.
    let result = await cognito.verifyEmailWithCode(body);
    res.status(200).json(result);

  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}

exports.verifyCode = async function (req, res) {
  const {
    body
  } = req;

  //Validate request format.
  if (body.user && body.code) {
    const {
      user,
      code
    } = body;

    try {

      //Send to cognito the signup request.
      let result = await cognito.verifyCode(user, code);
      res.status(200).json({
        "result": result
      });

    } catch (error) {
      console.log(error);
      res.status(400).json({
        "error": error
      });
    }

  } else {
    res.status(400).json({
      "error": "bad format"
    });
  }
}


exports.changePassword = async function (req, res) {
  const {
    body
  } = req;

  // Validate request format.
  let {
    email,
    password,
    newpassword
  } = body;
  try {
    // Send to cognito the renew token request.
    let result = await cognito.changePwd(email, password, newpassword);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      "error": err
    });
  }
}

exports.verifyToken = async function (req, res) {
  const {
    body
  } = req;

  //Validate request format.
  if (body.token) {
    try {
      //Verify token.
      let result = await authentication.verify(req, res);
      res.status(200).json({
        "result": result
      });

    } catch (e) {
      console.log(e);
      res.status(500).json({
        "error": e
      });
    }
  } else {
    res.status(400).json({
      "error": "bad format"
    });
  }
}

exports.renewToken = async function (req, res) {
  const {
    body
  } = req;
  //Validate request format.
 let {
    token
  } = body;

  try {
    //Send to cognito the renew token request.
    let result = await cognito.renew(token);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      "error": err
    });
  }
}

exports.forgotPassword = async function (req, res) {
  // Validate request format.
  let {
    email
  } = req.body;
  try {
    // Forget password will work only if the user is custom user. 
    // Forget password will not work if the user is loggedin via google, facebook or apple.
    let isUserCustomUser = await userAuth.findUserWithDefaultIds(email);
   
    if(isUserCustomUser.status === true) {
      // Check first the verification code if it exists in the database
      let isUserSendVerificationCode = await userAuth.findActiveUser(isUserCustomUser, email);
      
      req.body.id = isUserCustomUser.userId;
      req.body.name = isUserCustomUser.name;
      req.body.role = isUserCustomUser.role;

      if(isUserSendVerificationCode) {
        res.status(200).send({
          message: "Reset password link already shared with your email id, Please use the same.",
        })
      } else {
        // Send to cognito the renew token request.
        let result = await cognito.forgotPassword(req.body);
        res.status(200).send({
          message: "Please check your email for the verification code !!!",
        })
      }
    } else if(!isUserCustomUser) {
      res.status(400).send({
        message: 'You are not registered with us.'
      })
    } else if(!isUserCustomUser.status) {
      res.status(400).send({
        message: 'You have registered with us using '+isUserCustomUser.source+ ' account, Sorry, we are not able to reset the password at now.'
      })
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      "error": err
    });
  }
}

exports.confirmPassword = async function (req, res) {
  // Validate request format.
  let {
    id,
    email,
    password,
    code
  } = req.body;
  try {
    // Send to cognito the renew token request.
    let validatePassword = await userAuth.validateOTP(id, code);
    if(validatePassword) {
      let result = await cognito.confirmPass(email, password);
      res.status(200).send({
        message: "Password change successfully !!!",
      })
    } else {
      // Send to cognito the renew token request.
      res.status(400).send({
        message: "OTP Expires, Email not verified !!!"
      })
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      "error": err
    });
  }
}