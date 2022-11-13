import mainCall from '/opt/mainCall/index.js';

const query = /* GraphQL */ `
  mutation MyMutation($prodNick: String!) {
    deleteProduct(input: { prodNick: $prodNick }) {
      prodNick
      prodName
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const deleteProduct = async (event) => {
  let response = await mainCall(query, event);
  return response;
};

export default deleteProduct;
