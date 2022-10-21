import mainCall from "/opt/mainCall/index.js";

const query = /* GraphQL */ `
query MyQuery {
    listLocationUsers {
      items {
        user {
          name
          locs {
            items {
              locNick
              authType
              location {
                locName
              }
              id
            }
          }
          authClass
          email
          locNick
          phone
          sub
        }
        location {
          locName
          subs {
            items {
              sub
              authType
              user {
                name
              }
              id
            }
          }
          locNick
          phone
          addr1
          addr2
          city
          zoneNick
          zip
        }
      }
    }
  }
  
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
// Update
const grabDetailedCustomerList = async (event) => {
  let response = await mainCall(query, event);

  let newArray = [];

  console.log("responseCust", response.body.body.listLocationUsers.items);

  for (let item of response.body.body.listLocationUsers.items) {
    try {
      let locations = [];
      let customers = [];

      for (let loc of item.user.locs.items) {
        let newLoc = {
          locNick: loc.locNick,
          locName: loc.location.locName,
          authType: loc.authType,
          id: loc.id
        };
        locations.push(newLoc);
      }
      for (let sub of item.location.subs.items) {
        let newSub = {
          sub: sub.sub,
          custName: sub.user.name,
          authType: sub.authType,
          id: sub.id
        };
        customers.push(newSub);
      }

      let newItem = {
        custName: item.user.name,
        authClass: item.user.authClass,
        email: item.user.email,
        phone: item.user.phone,
        sub: item.user.sub,
        defLoc: item.user.locNick,
        locName: item.location.locName,
        locNick: item.location.locNick,
        locations: locations,
        customers: customers,
      };

      newArray.push(newItem);
    } catch {}
  }
  response.user = response.body.user;
  response.body = { items: newArray };

  return response;
};

export default grabDetailedCustomerList;
