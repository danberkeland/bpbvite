import mainCall from '/opt/mainCall/index.js';

const query = /* GraphQL */ `
  mutation MyMutation($locNick: String!) {
    deleteLocation(input: { locNick: $locNick }) {
      locNick
      locName
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const deleteLocation = async (event) => {
  let response = await mainCall(query, event);
  return response
};

export default deleteLocation;
