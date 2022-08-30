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