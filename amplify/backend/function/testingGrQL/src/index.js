/* Amplify Params - DO NOT EDIT
	API_BPBADMIN2_GRAPHQLAPIENDPOINTOUTPUT
	API_BPBADMIN2_GRAPHQLAPIIDOUTPUT
	API_BPBADMIN2_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import fetch, { Request } from "/opt/nodejs/node_modules/node-fetch/lib/index.mjs";
import moment from "/opt/nodejs/node_modules/moment/moment.js";

const GRAPHQL_ENDPOINT = process.env.API_BPBADMIN2_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_BPBADMIN2_GRAPHQLAPIKEYOUTPUT;

const query = /* GraphQL */ `
  query MyQuery($locNick: String!, $delivDate: String!, $dayOfWeek: String!) {
    getLocation(locNick: $locNick) {
      orders(filter: { delivDate: { eq: $delivDate } }) {
        items {
          product {
            prodName
            wholePrice
          }
          qty
        }
      }
      standing(filter: { dayOfWeek: { eq: $dayOfWeek } }) {
        items {
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

  let finalDate = moment(event.delivDate).format('L')
  let dayOfWeek = moment(event.delivDate).format('ddd')

  const variables = {
    locNick: event.locNick,
    delivDate: finalDate,
    dayOfWeek: dayOfWeek,
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
  let orders = {};
  let standing = {};
  let prods = {};
  let names = [];
  let final = [];

  let response;

  try {
    response = await fetch(request);
    body = await response.json();
    list = body.data.getLocation;
    orders = list.orders.items.map((ord) => ({
      prod: ord.product.prodName,
      qty: ord.qty,
      type: "C",
      rate: ord.product.wholePrice,
    }));
    standing = list.standing.items.map((stand) => ({
      prod: stand.product.prodName,
      qty: stand.qty,
      type: "S",
      rate: stand.product.wholePrice,
    }));
    prods = [...orders, ...standing];
    console.log(prods);
    names = Array.from(new Set(prods.map((pro) => pro.prod)));

    for (let name of names) {
      let first = prods.find((obj) => obj.prod === name);
      final.push(first);
    }
  } catch (error) {
    statusCode = 400;
    final = {
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
    body: final,
  };
};
