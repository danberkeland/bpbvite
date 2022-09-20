import mainCall from '/opt/mainCall/index.js';

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
  let response = await mainCall(query, event);
  response.body = response.body.body.listLocations
  return response
};

export default grabDetailedLocationList;
