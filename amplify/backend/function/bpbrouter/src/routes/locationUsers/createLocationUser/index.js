import mainCall from "/opt/mainCall/index.js";

const query = /* GraphQL */ `
mutation MyMutation($Type: String!, $authType: Int, $locNick: String!, $sub: ID!) {
  createLocationUser2(input: {Type: $Type, authType: $authType, locNick: $locNick, userID: $sub }) {
    Type
    authType
    createdAt
    id
    locNick
    userID
    updatedAt
  }
}
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const createLocationUser = async (event) => {
  console.log("locUserEvent", event)
  
  let response = await mainCall(query, event);
  return response;
};
export default createLocationUser;
