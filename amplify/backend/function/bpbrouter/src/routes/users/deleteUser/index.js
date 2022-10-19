import mainCall from "/opt/mainCall/index.js";

const query1 = /* GraphQL */ `
  mutation MyMutation($sub: String!) {
    deleteUser(input: { sub: $sub }) {
      locNick
      sub
    }
  }
`;

const query2 = /* GraphQL */ `
  query MyQuery($sub: String!) {
    listLocationUsers(filter: { sub: { eq: $sub } }) {
      items {
        id
        locNick
        sub
      }
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const deleteUser = async (event) => {
  //let response = await mainCall(query1, event);
  let list = await mainCall(query2, event).then((list) => {
    for (let li in list.data.body.body.listLocationUsers.items){
        console.log('li', li.id)
    }
  })
  return list;
};

export default deleteUser;
