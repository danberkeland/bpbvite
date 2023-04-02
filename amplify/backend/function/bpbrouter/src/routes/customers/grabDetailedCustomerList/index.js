import mainCall from '/opt/mainCall/index.js';

const query = /* GraphQL */ `
query MyQuery {
    listUsers {
      items {
        name
        phone
        username
        email
        locNick
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
 const grabDetailedCustomerList = async (event) => {
  let response = await mainCall(query, event);
  
  let newArray = []

  console.log("responseCust", response.body.body.listUsers.items)
  for (let cust of response.body.body.listUsers.items){
    try{
      for (let loc of cust.locs.items){
        let newItem = {
          "custName": cust.name,
          "username": cust.username,
          "authClass": cust.authClass,
          "email": cust.email,
          "phone": cust.phone,
          "sub": cust.sub,
          "defLoc": cust.locNick,
          "locNick": loc.locNick,
          "authType": loc.authType
        };
        newArray.push(newItem);
        
      }
    }catch{}
  }
  response.user = response.body.user
  response.body = { "items": newArray }

  
  
  return response
};

export default grabDetailedCustomerList;
