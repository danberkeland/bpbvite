import mainCall from "/opt/mainCall/index.js";

const query = /* GraphQL */ `
  query MyQuery {
    listLocations {
      items {
        Type
        addr1
        addr2
        city
        createdAt
        currentBalance
        delivOrder
        email
        firstName
        lastName
        gMap
        invoicing
        latestFinalDeliv
        latestFirstDeliv
        locName
        locNick
        phone
        picURL
        printDuplicate
        qbID
        specialInstructions
        terms
        toBeEmailed
        toBePrinted
        updatedAt
        webpageURL
        zip
        zoneNick
      }
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
// Update
const grabDetailedLocationList = async (event) => {
  let response = await mainCall(query, event);
  response.user = response.body.user;
  response.body = response.body.body.listLocations;

  return response;
};

export default grabDetailedLocationList;
