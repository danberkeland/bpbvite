/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider({ region: "us-east-2" });

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const updateUser = async (event) => {
  const { email, custName, authClass, phone, defLoc, sub } = event;
  return await new Promise((resolve, reject) => {
    const params = {
      UserPoolId: "us-east-2_pOTWtTfNg",
      Username: sub,
      UserAttributes: [
        {
          Name: "custom:name",
          Value: custName,
        },
        {
          Name: "custom:authType",
          Value: authClass,
        },
        {
          Name: "email",
          Value: email,
        },
      ]
     
    };

    cognito.adminUpdateUserAttributes(params, (err, data) => {
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

  return updateUser(event);
};
