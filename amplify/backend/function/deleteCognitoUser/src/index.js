/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider({ region: "us-east-2" });

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const deleteUser = async (username) => {
  return await new Promise((resolve, reject) => {
  
    console.log('username', username)
    const params = {
      UserPoolId: "us-east-2_eE0F2fVdp",
      Username: username,
    };

    cognito.adminDeleteUser(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  return deleteUser(event.username);
};
