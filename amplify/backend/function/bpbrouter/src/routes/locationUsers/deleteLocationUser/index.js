import mainCall from "/opt/mainCall/index.js";

const query = /* GraphQL */ `
  mutation MyMutation($id: ID!) {
    deleteLocationUser2(input: { id: $id }) {
      id
      locNick
      userID
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const deleteLocationUser = async (event) => {
  console.log("locUserEvent", event);
  // grab list of LocUsers where sub and locNick equal.  Take first index.id
  // delete LocUser(id)
  let response = await mainCall(query, event );
  return response;
};
export default deleteLocationUser;
