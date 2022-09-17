import mainCall from '/opt/mainCall/index.js';

const query = /* GraphQL */ `
  mutation MyMutation(
    $locNick: String!
    $locName: String
    $city: String
    $email: String
  ) {
    updateLocation(
      input: {
        locNick: $locNick
        locName: $locName
        city: $city
        email: $email
      }
    ) {
      city
      email
      locName
      locNick
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const updateLocation = async (event) => {
  let response = await mainCall(query, event);
  return response
};

export default updateLocation;
