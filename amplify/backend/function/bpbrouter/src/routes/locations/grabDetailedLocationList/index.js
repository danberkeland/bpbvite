import mainCall from "/opt/mainCall/index.js";

const query = /* GraphQL */ `
  query MyQuery {
    listLocations {
      items {
        Type
        locName
        locNick
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
        subs {
          items {
            sub
          }
        }
      }
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 * 
 * 
 */
// Update

const checkSubs = (item,user) => {
  let subs = item.subs.items.map(sub => sub.sub)
  return subs.includes(user.sub) ? true : false
}

const grabDetailedLocationList = async (event) => {
  let response = await mainCall(query, event);
  response.user = response.body.user;
  response.body = response.body.body.listLocations//.filter(item => checkSubs(item,response.user))
  return response;
};

export default grabDetailedLocationList;
