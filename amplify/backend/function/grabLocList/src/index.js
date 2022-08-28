/* Amplify Params - DO NOT EDIT
	API_BPBADMIN2_GRAPHQLAPIENDPOINTOUTPUT
	API_BPBADMIN2_GRAPHQLAPIIDOUTPUT
	API_BPBADMIN2_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */



import { default as fetch, Request } from "node-fetch";

const GRAPHQL_ENDPOINT = process.env.API_BPBADMIN2_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_BPBADMIN2_GRAPHQLAPIKEYOUTPUT;

const query = /* GraphQL */ `
query MyQuery {
  locSortAZ(Type: "Location", limit: 1000) {
    items {
      locName
      locNick
    }
  }
}
 
`;



/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
 


  /** @type {import('node-fetch').RequestInit} */
  const options = {
    method: "POST",
    headers: {
      "x-api-key": GRAPHQL_API_KEY,
    },
    body: JSON.stringify({ query }),
  };

  const request = new Request(GRAPHQL_ENDPOINT, options);

  let statusCode = 200;
  let body;
  let response;
  let final

  try {
    response = await fetch(request);
    body = await response.json();
    final = body.data.locSortAZ.items.map(obj => ({
      label: obj.locName,
      value: obj.locNick
    }))
  } catch (error) {
    statusCode = 400;
  }

  return {
    statusCode,
    body: final
  };
};
