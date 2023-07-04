import mainCall from "/opt/mainCall/index.js";

const query = /* GraphQL */ `
  mutation MyMutation(
    $authClass: String
    $email: String!
    $username: String!
    $locNick: String
    $name: String!
    $phone: String
    $sub: ID!
    
   
  ) {
    createUser2(
      input: {
        authClass: $authClass
        username: $username
        email: $email
        locNick: $locNick
        name: $name
        phone: $phone
        id: $sub
       
      }
    ) {
      authClass
      createdAt
      username
      email
      locNick
      name
      phone
      id
      updatedAt
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const createUser = async (event) => {
  let response = await mainCall(query, event);
  return response;
};
export default createUser;
