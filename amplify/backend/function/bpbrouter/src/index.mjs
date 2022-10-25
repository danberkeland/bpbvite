/* Amplify Params - DO NOT EDIT
	API_BPBADMIN2_GRAPHQLAPIENDPOINTOUTPUT
	API_BPBADMIN2_GRAPHQLAPIIDOUTPUT
	API_BPBADMIN2_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
};

// Working on Auth
export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  let user;

  try {
    user = event.requestContext.authorizer.claims;
    event["user"] = {
      sub: user.sub,
      name: user["custom:name"],
      defLoc: user["custom:defLoc"],
      authType: user["custom:authType"],
      access: event.headers.Authorization
    };
  } catch {
    console.log("no user");
  }
  console.log("user", event);

  let statusCode = 200;
  let body = {};

  try {
    const { default: queryFunction } = await import(
      `./routes${event.path}/index.js`
    );
    body = await queryFunction(event ? event : "");
  } catch (error) {
    console.log(error);
    statusCode = 400;
  }

  return {
    statusCode: statusCode,
    headers: headers,
    body: JSON.stringify(body),
  };
};
