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
const updateLocationUsers = async (event) => {
  console.log("locUserEvent", event);
  let response
  let myArray = JSON.parse(event.body)
  for (let item of myArray){
    console.log("item",item)
  response = await mainCall(query, {body: item});
  }
  return response;
};
export default updateLocationUsers;
