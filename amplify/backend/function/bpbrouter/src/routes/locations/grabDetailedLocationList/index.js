/* Amplify Params - DO NOT EDIT
	API_BPBADMIN2_GRAPHQLAPIENDPOINTOUTPUT
	API_BPBADMIN2_GRAPHQLAPIIDOUTPUT
	API_BPBADMIN2_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import fetch, {
  Request,
} from "/opt/nodejs/node_modules/node-fetch/lib/index.mjs";

const GRAPHQL_ENDPOINT = process.env.API_BPBADMIN2_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_BPBADMIN2_GRAPHQLAPIKEYOUTPUT;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
};

const query = /* GraphQL */ `
  query MyQuery {
    listLocations {
      items {
        locName
        locNick
        Type
        zoneNick
        addr1
        addr2
        city
        zip
        email
        phone
        toBePrinted
        toBeEmailed
        printDuplicate
        terms
        invoicing
        latestFirstDeliv
        latestFinalDeliv
        webpageURL
        picURL
        gMap
        specialInstructions
        delivOrder
        qbID
        currentBalance
      }
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const grabDetailedLocationList = async (event) => {
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
  let list;

  let response;

  try {
    response = await fetch(request);
    body = await response.json();
    list = body.data.listLocations;
    console.log("list", list);
  } catch (error) {
    statusCode = 400;
  }

  return {
    statusCode: statusCode,
    headers: headers,
    body: list,
  };
};

export default grabDetailedLocationList;
