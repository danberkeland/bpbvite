

/* Amplify Params - DO NOT EDIT
	API_BPBADMIN2_GRAPHQLAPIENDPOINTOUTPUT
	API_BPBADMIN2_GRAPHQLAPIIDOUTPUT
	API_BPBADMIN2_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params -- DO NOT EDIT */

import fetch, { Request } from "/opt/nodejs/node_modules/node-fetch/lib/index.mjs";

const GRAPHQL_ENDPOINT = process.env.API_BPBADMIN2_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_BPBADMIN2_GRAPHQLAPIKEYOUTPUT;

const query = /* GraphQL */ `
  query MyQuery($locNick: String!) {
    getLocation(locNick: $locNick) {
      standing {
        items {
          id
          dayOfWeek
          product {
            prodName
            wholePrice
          }
          qty
        }
      }
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const variables = {
    locNick: event.locNick,
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

  let standing = {};

  let response;

  try {
    response = await fetch(request);
    body = await response.json();
    list = body.data.getLocation;

    standing = list.standing.items.map((stand) => ({
      prod: stand.product.prodName,
      qty: stand.qty,
      dayOfWeek: stand.dayOfWeek,
      type: "S",
      rate: stand.product.wholePrice,
    }));
  } catch (error) {
    statusCode = 400;
  }

  return {
    statusCode,
    body: standing,
  };
};
