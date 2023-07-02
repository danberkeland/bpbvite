import mainCall from "/opt/mainCall/index.js";

const query1 = /* GraphQL */ `
  mutation MyMutation($sub: String!) {
    deleteUser2(input: { id: $sub }) {
      locNick
      id
    }
  }
`;

const query2 = /* GraphQL */ `
  query MyQuery($sub: String!) {
    listLocationUser2s(filter: { userID: { eq: $sub } }) {
      items {
        id
        locNick
        userID
      }
    }
  }
`;

const query3 = /* GraphQL */ `
  mutation MyMutation($id: ID!) {
    deleteLocationUser2(input: { id: $id }) {
      id
      locNick
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const deleteLocUser = async (event) => {
  await mainCall(query3, event);
};

const deleteUser = async (event) => {
  let response = await mainCall(query1, event);
  let list = await mainCall(query2, event);
  for (let li of list.body.body.listLocationUser2s.items) {
    let event2 = { id: li.id };
    let delResp = await deleteLocUser({ body: JSON.stringify(event2) });
    console.log("delResp", delResp);
  }

  return response;
};

export default deleteUser;
