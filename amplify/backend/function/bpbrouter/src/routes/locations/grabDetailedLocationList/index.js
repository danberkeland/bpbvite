import mainCall from "/opt/mainCall/index.js";

const query1 = /* GraphQL */ `
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

const query2 = /* GraphQL */ `
  query MyQuery($sub: String!) {
    listLocationUsers(filter: { sub: { eq: $sub } }) {
      items {
        sub
        locNick
        location {
          addr1
          addr2
          city
          createdAt
          currentBalance
          delivOrder
          email
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
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 *
 *
 */
// Update

const grabDetailedLocationList = async (event) => {
  event = event ? event : {};
  let user = {};

  try {
    user = event.requestContext.authorizer.claims;
  } catch {
    console.log("no user");
  }

  if (user["custom:authType"] === "bpbfull") {
    let response = await mainCall(query1, event);

    response.user = user;
    response.body.items = response.body.body.listLocations.items;

    return response;
  } else {
    event.body = { sub: user.sub };
    let response = await mainCall(query2, event);

    let newArray = [];

    for (let item of response.body.body.listLocationUsers.items) {
      newArray.push(item.location);
    }

    response.user = user;
    response.body = { items: newArray };

    return response;
  }
};

export default grabDetailedLocationList;
