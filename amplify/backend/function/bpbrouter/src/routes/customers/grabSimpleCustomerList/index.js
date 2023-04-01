import mainCall from '/opt/mainCall/index.js';

const query = /* GraphQL */ `
query MyQuery {
    listUsers {
      items {
        name
        username
        phone
        authClass
        sub
        locs {
          items {
            locNick
            authType
          }
        }
      }
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
  // Update
 const grabSimpleCustomerList = async (event) => {
    let response = await mainCall(query, event);
    response.user = response.body.user;
    response.body = response.body.body.listUsers;
  
    return response;
};

export default grabSimpleCustomerList;
