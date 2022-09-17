import mainCall from '/opt/mainCall/index.js';

const query = /* GraphQL */ `
  mutation MyMutation(
    $locNick: String!
    $locName: String!
    $email: String
    $city: String
  ) {
    createLocation(
      input: {
        locName: $locName
        locNick: $locNick
        city: $city
        email: $email
      }
    ) {
      email
      locName
      locNick
      city
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const createLocation = async (event) => {
  let response = await mainCall(query,event)
  return response
}
export default createLocation;
