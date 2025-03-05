import mainCall from '/opt/mainCall/index.js';

const query = /* GraphQL */ `
query MyQuery {
  listUser2s {
    items {
      authClass
      email
      name
      username
      phone
      id
      locs {
        items {
          authType
          locNick
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
    response.body = response.body.body.listUser2s;
  
    return response;
};

export default grabSimpleCustomerList;
