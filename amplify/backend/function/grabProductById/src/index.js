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
  query MyQuery($prodNick: String!) {
    getProduct(prodNick: $prodNick) {
      bakeDay
      bakeExtra
      bakeNick
      bakedWhere
      batchSize
      defaultInclude
      descrip
      doughNick
      forBake
      freezerThaw
      guarantee
      inventoryProductId
      isWhole
      leadTime
      packGroup
      packGroupOrder
      packSize
      picURL
      prodName
      prodNick
      qbID
      readyTime
      retailPrice
      shapeDay
      shapeNick
      squareID
      transferStage
      updatedAt
      weight
      wholePrice
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
      list = body.data.getProduct;
      console.log("list",list)
      
    } catch (error) {
      statusCode = 400;
    }
  
    return {
      statusCode,
      body: list,
    };
  };
  