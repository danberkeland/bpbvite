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
  query MyQuery($locNick: String!, $delivDate: String!, $dayOfWeek: String!) {
    getLocation(locNick: $locNick) {
      orders(filter: { delivDate: { eq: $delivDate } }) {
        items {
          product {
            prodName
          }
          qty
        }
      }
      standing(filter: { dayOfWeek: { eq: $dayOfWeek } }) {
        items {
          product {
            prodName
          }
          qty
        }
      }
    }
  }
`;

const variables = {
  locNick: "whole",
  dayOfWeek: "Sat",
  delivDate: "08/20/2022",
};

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

    console.log(list);
    if (body.errors) statusCode = 400;
  } catch (error) {
    statusCode = 400;
    body = {
      errors: [
        {
          status: response.status,
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
