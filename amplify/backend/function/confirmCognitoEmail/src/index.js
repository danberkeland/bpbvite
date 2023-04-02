/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider({ region: "us-east-2" });

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const confirmCognitoEmail = async (event) => {
  console.log("sub",event.sub)
  const user = await cognito.adminGetUser({
      UserPoolId: "us-east-2_pOTWtTfNg",
      Username: event.sub
    }).promise()
    
  console.log("user", await user)
   
  
    
    
};

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  let response = await confirmCognitoEmail(event)
  console.log("response",response)

};
