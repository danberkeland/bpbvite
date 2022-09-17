import mainCall from '/opt/mainCall/index.js';

const query = /* GraphQL */ `
  mutation MyMutation(
    $prodNick: String!
    $prodName: String
    $wholePrice: Float
    $packSize: Int
  ) {
    updateProduct(
      input: {
        prodName: $prodName
        prodNick: $prodNick
        wholePrice: $wholePrice
        packSize: $packSize
      }
    ) {
      prodNick
      prodName
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const updateProduct = async (event) => {
  let response = await mainCall(query, event);
  return response;
};

export default updateProduct;
