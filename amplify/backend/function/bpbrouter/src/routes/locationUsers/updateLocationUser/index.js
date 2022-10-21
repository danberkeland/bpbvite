import mainCall from "/opt/mainCall/index.js";

const query = /* GraphQL */ `
  mutation MyMutation(
    $Type: String!
    $authType: Int
    $id: ID!
    $locNick: String!
    $sub: String!
  ) {
    updateLocationUser(
      input: {
        Type: $Type
        authType: $authType
        id: $id
        locNick: $locNick
        sub: $sub
      }
    ) {
      Type
      authType
      id
      locNick
      sub
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const updateLocationUser = async (event) => {
  console.log("locUserEvent", event);
  let response = await mainCall(query, event);
  return response;
};
export default updateLocationUser;
