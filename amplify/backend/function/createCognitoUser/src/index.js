/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider({ region: "us-east-2" });

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const createUser = async (event) => {
  
  console.log("createevent", event);
  const { email, custName, authClass, defLoc, username } = event;
  return await new Promise((resolve, reject) => {
    const params = {
      UserPoolId: "us-east-2_hYAKr3SwA",
      Username: username,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "custom:name",
          Value: custName,
        },
        {
          Name: "custom:authType",
          Value: authClass,
        },
        {
          Name: "custom:defLoc",
          Value: defLoc,
        },
      ],
      TemporaryPassword: "admin123!",
    };

    cognito.adminCreateUser(params, (err, data) => {
      console.log("returnData", data);

      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

exports.handler = async (event) => {
  let resp
  console.log(`EVENT: ${JSON.stringify(event)}`);
  let response = await createUser(event).then((data) => {
    console.log("returnData", data);

    let newerEvent = {
      sub: data.User.Username,
      name: event.custName,
      authClass: event.authClass,
      email: event.email,
      phone: event.phone,
      locNick: event.defLoc,
    };

    let newLocUser = {
      authType: 3,
      locNick: event.defLoc,
      sub: data.User.Username,
      Type: "LocationUser",
    };

    console.log("newerEvent", newerEvent)
    console.log("newLocUser", newLocUser)
    
    resp = {
      body : {
      newerEvent: newerEvent,
      newLocUser: newLocUser,
    }
    }
  });
  return resp
};
