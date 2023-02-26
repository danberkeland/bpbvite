import mainCall from "/opt/mainCall/index.js";

const query = /* GraphQL */ `
mutation MyMutation($Type: String!, $authType: Int, $locNick: String!, $sub: String!) {
  createLocationUser(input: {Type: $Type, authType: $authType, locNick: $locNick, sub: $sub}) {
    Type
    authType
    createdAt
    id
    locNick
    sub
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
