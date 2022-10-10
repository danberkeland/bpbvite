import mainCall from "/opt/mainCall/index.js";

const query = /* GraphQL */ `
  mutation MyMutation(
    $Type: String
    $addr1: String
    $addr2: String
    $city: String
    $currentBalance: String
    $delivOrder: Int
    $email: String
    $gMap: String
    $invoicing: String
    $latestFinalDeliv: Float
    $latestFirstDeliv: Float
    $locName: String!
    $locNick: String!
    $phone: String
    $picURL: String
    $printDuplicate: Boolean
    $qbID: String
    $specialInstructions: String
    $terms: String
    $toBeEmailed: Boolean
    $toBePrinted: Boolean
    $webpageURL: String
    $zip: String
    $zoneNick: String
  ) {
    createLocation(
      input: {
        Type: $Type
        addr1: $addr1
        addr2: $addr2
        city: $city
        currentBalance: $currentBalance
        delivOrder: $delivOrder
        email: $email
        gMap: $gMap
        invoicing: $invoicing
        latestFinalDeliv: $latestFinalDeliv
        latestFirstDeliv: $latestFirstDeliv
        locName: $locName
        locNick: $locNick
        phone: $phone
        picURL: $picURL
        printDuplicate: $printDuplicate
        qbID: $qbID
        specialInstructions: $specialInstructions
        terms: $terms
        toBeEmailed: $toBeEmailed
        toBePrinted: $toBePrinted
        webpageURL: $webpageURL
        zip: $zip
        zoneNick: $zoneNick
      }
    ) {
      Type
      addr1
      addr2
      city
      createdAt
      currentBalance
      delivOrder
      email
      gMap
      invoicing
      latestFinalDeliv
      latestFirstDeliv
      locName
      locNick
      phone
      picURL
      printDuplicate
      qbID
      specialInstructions
      terms
      toBeEmailed
      toBePrinted
      updatedAt
      webpageURL
      zip
      zoneNick
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const createLocation = async (event) => {
  let response = await mainCall(query, event);
  return response;
};
export default createLocation;
