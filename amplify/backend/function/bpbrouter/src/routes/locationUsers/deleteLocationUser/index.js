import mainCall from "/opt/mainCall/index.js";

const query1 = /* GraphQL */ `
  query MyQuery($locNick: String!, $sub: String!) {
    listLocationUsers(filter: { locNick: { eq: $locNick }, sub: { eq: $sub } }) {
      items {
        id
        locNick
        sub
      }
    }
  }
`;

const query2 = /* GraphQL */ `
 mutation MyMutation($id: ID!) {
  deleteLocationUser(input: {id: $id}) {
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
  let response = await mainCall(query1, event).then(response => mainCall(query2, {body : {"id": response.body.body.listLocationUsers.items[0].id}}));
  return response;
};
export default deleteLocationUser;
