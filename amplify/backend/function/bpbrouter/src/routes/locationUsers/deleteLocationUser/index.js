import mainCall from "/opt/mainCall/index.js";

const query = /* GraphQL */ `
  mutation MyMutation($id: ID!) {
    deleteLocationUser(input: { id: $id }) {
      id
      locNick
      sub
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
