import mainCall from "/opt/mainCall/index.js";

const query = /* GraphQL */ `
query MyQuery {
    listZones {
      items {
        zoneName
        zoneNick
      }
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
// Update
const grabDetailedZoneList = async (event) => {
  let response = await mainCall(query, event);
  response.user = response.body.user;
  response.body = response.body.body.listZones;

  return response;
};

export default grabDetailedZoneList;
