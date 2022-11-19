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
  
  const query = /* GraphQL */ `
  mutation MyMutation($prodNick: String!, $prodName: String, $wholePrice: Float, $packSize: Int) {
    updateProduct(input: {prodName: $prodName, prodNick: $prodNick, wholePrice: $wholePrice, packSize: $packSize}) {
      prodNick
      prodName
    }
  }
  `;
  
  /**
   * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
   */
  export const handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
  
    const variables = {
      prodNick: event.prodNick,
      prodName: event.prodName,
      packSize: event.packSize,
      wholePrice: event.wholePrice,
    };
  
    /** @type {import('node-fetch').RequestInit} */
    const options = {
      method: "POST",
      headers: {
        "x-api-key": GRAPHQL_API_KEY,
      },
      body: JSON.stringify({ query, variables }),
    };
  
    const request = new Request(GRAPHQL_ENDPOINT, options);
  
    let statusCode = 200;
    let body;
    let list;
  
    let response;
  
    try {
      response = await fetch(request);
      body = await response.json();
      if (body.errors) statusCode = 400;
    } catch (error) {
      statusCode = 400;
      body = {
        errors: [
          {
            message: error.message,
            stack: error.stack,
          },
        ],
      };
    }
    return {
      statusCode,
      body: body,
    };
  };
  