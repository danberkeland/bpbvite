/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider({ region: "us-east-2" });

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const deleteUser = async (sub) => {
  return await new Promise((resolve, reject) => {
    const params = {
      UserPoolId: "us-east-2_hYAKr3SwA",
      Username: sub,
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

  return deleteUser(event.sub);
};
