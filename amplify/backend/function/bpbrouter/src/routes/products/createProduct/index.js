import mainCall from '/opt/mainCall/index.js';

const query = /* GraphQL */ `
  mutation MyMutation(
    $prodName: String!
    $prodNick: String!
    $packSize: Int!
    $wholePrice: Float!
  ) {
    createProduct(
      input: {
        prodName: $prodName
        prodNick: $prodNick
        packSize: $packSize
        wholePrice: $wholePrice
      }
    ) {
      prodName
      prodNick
      wholePrice
      packSize
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const createProduct = async (event) => {
  let response = await mainCall(query, event);
  return response
};

export default createProduct;
