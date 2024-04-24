require('dotenv').config()
const config = require('config');
const { CognitoIdentityProviderClient, ListUsersCommand } = require('@aws-sdk/client-cognito-identity-provider');
const clientCognito = new CognitoIdentityProviderClient({ region: process.env.REGION });

const { DynamoDBClient, PutItemCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { fromUnixTime, addMinutes } = require('date-fns'); // Using date-fns library for date manipulation
const client = new DynamoDBClient({ region: process.env.REGION });
const tableName = process.env.PROD_USER_AUTHENTICATION; // Replace with your actual DynamoDB table name


exports.findActiveUser = async (body) => {
  const params = {
    TableName: tableName,
    Key: {
        id: { S: body.userId }
    }
  };

  try {
      const data = await client.send(new GetItemCommand(params));

      if (data.Item) {
          return true; // User with the provided email exists
      } else {
          return false; // User with the provided email does not exist
      }
  } catch (err) {
      console.error('Error checking user existence:', err);
      throw new Error('Error checking user existence');
  }
};

exports.validateOTP = async (id, verificationCode) => {
  const params = {
    TableName: tableName,
    Key: {
      id: { S: id }
    }
  };

  try {
    const result = await client.send(new GetItemCommand(params));

    if (result.Item) {
      const user = result.Item;
      if (user.verificationCode.S === verificationCode) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log('Error checking user existence:', error);
    throw new Error('Error checking user existence');
  }
};


exports.findUserWithDefaultIds = async (email) => {
  const params = {
    UserPoolId: process.env.USER_POOL_ID,
    Filter: `email = "${email}"`,
    AttributesToGet: ['email', 'custom:name', 'custom:source', 'custom:role'], // Add any other attributes you need
    Limit: 1
  };

  try {
      const data = await clientCognito.send(new ListUsersCommand(params));
      if (data.Users && data.Users.length > 0) {
          const user = data.Users[0];

          // Assuming 'custom' is an attribute in Cognito
          const customSourceAttribute = user.Attributes.find(attr => attr.Name === 'custom:source');
          const customNameAttribute = user.Attributes.find(attr => attr.Name === 'custom:name');
          const customRoleAttribute = user.Attributes.find(attr => attr.Name === 'custom:role');
          if(customSourceAttribute && customSourceAttribute.Value === 'cognito') {
              return {
                source: customSourceAttribute.Value,
                name: customNameAttribute.Value,
                role: customRoleAttribute.Value,
                userId: user.Username,
                status: true
              };
          } else {
            return {
              source: customSourceAttribute.Value,
              userId: user.Username,
              status: false
            };
          }
      } else {
        return false;
      }
  } catch (err) {
      console.error('Error checking user existence:', err);
      throw new Error('Error checking user existence');
  }
};