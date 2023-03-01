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
  console.log("updateevent", event);
  const { email, custName, authClass, defLoc, sub } = event;
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
        {
          Name: "custom:defLoc",
          Value: defLoc,
        },
      ],
    };

    cognito.adminUpdateUserAttributes(params, (err, data) => {
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
  let resp;
  console.log(`EVENT: ${JSON.stringify(event)}`);
  await updateUser(event).then((data) => {
    console.log("returnData", data);

    let newerEvent = {
      sub: event.sub,
      name: event.custName,
      authClass: event.authClass,
      email: event.email,
      phone: event.phone,
      locNick: event.defLoc,
    };
    let newLocUsers = [];
    if (event['tag']===0)
    {for (let loc of event.locations) {
      const newLocUser = {
        authType: loc.authType,
        locNick: loc.locNick,
        locName: loc.locName,
        sub: event.sub,
        id: loc.id,
        Type: "LocationUser",
      };
      console.log("newLocUser", newLocUser);
      newLocUsers.push(newLocUser);
    }}
    if (event['tag']===1)
    {for (let cust of event.customers) {
      const newLocUser = {
        authType: cust.authType,
        locNick: event.locNick,
        locName: event.locName,
        sub: cust.sub,
        id: cust.id,
        Type: "LocationUser",
      };
      console.log("newLocUser", newLocUser);
      newLocUsers.push(newLocUser);
    }
    }
    

    resp = {
      body: {
        newerEvent: newerEvent,
        newLocUser: newLocUsers,
      },
    };
  });
  return resp;
};
