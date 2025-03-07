import mainCall from "/opt/mainCall/index.js";

const query2 = /* GraphQL */ `
  query MyQuery2 {
    listLocationUser2s {
      items {
        user {
          name
          locs {
            items {
              locNick
              userID
              Type
              authType
              location {
                locName
              }
              id
            }
          }
          email
          username
          authClass
          locNick
          phone
          id
        }
        location {
          locName
          subs2 {
            items {
              userID
              authType
              user {
                name
                locNick
                phone
                request
                subs
                username
                id
                email
              }
            }
          }
        }
      }
    }
  }
`;

const query = /* GraphQL */ `
  query MyQuery {
    listLocationUsers {
      items {
        user {
          name
          locs {
            items {
              locNick
              Type
              sub
              authType
              location {
                locName
              }
              id
            }
          }
          authClass
          username
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
  let response = await mainCall(query2, event);

  let newArray = [];

  console.log("responseCust", response.body.body.listLocationUser2s.items);

  for (let item of response.body.body.listLocationUser2s.items) {
    try {
      let locations = [];
      let customers = [];

      for (let loc of item.user.locs.items) {
        let newLoc = {
          locNick: loc.locNick,
          locName: loc.location.locName,
          authType: loc.authType,
          sub: loc.userID,
          Type: loc.Type,
          id: loc.id,
        };
        locations.push(newLoc);
      }
      for (let sub of item.location.subs2.items) {
        let newSub = {
          sub: sub.userID,
          custName: sub.user.name,
          authType: sub.authType,
          id: sub.id,
        };
        customers.push(newSub);
      }

      let newItem = {
        custName: item.user.name,
        authClass: item.user.authClass,
        username: item.user.username,
        email: item.user.email,
        phone: item.user.phone,
        sub: item.user.id,
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
