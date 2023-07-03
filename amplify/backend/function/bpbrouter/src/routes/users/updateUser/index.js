import mainCall from "/opt/mainCall/index.js";

const query = /* GraphQL */ `
  mutation MyMutation(
    $sub: ID!
    $phone: String
    $name: String!
    $locNick: String
    $email: String!
    $authClass: String
  ) {
    updateUser2(
      input: {
        authClass: $authClass
        email: $email
        locNick: $locNick
        name: $name
        phone: $phone
        id: $sub
      }
    ) {
      email
      locNick
      createdAt
      authClass
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
const updateUser = async (event) => {
  let response = await mainCall(query, event);
  return response;
};
export default updateUser;
