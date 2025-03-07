import mainCall from "/opt/mainCall/index.js";

const query = /* GraphQL */ `
  mutation MyMutation(
    $Type: String
    $bakeDay: Int
    $bakeExtra: Int
    $bakeNick: String
    $bakedWhere: [String]
    $batchSize: Int
    $defaultInclude: Boolean
    $descrip: String
    $doughNick: String
    $forBake: String
    $freezerThaw: Boolean
    $guarantee: String
    $inventoryProductId: ID
    $isWhole: Boolean
    $isEOD: Boolean
    $leadTime: Int
    $packGroup: String
    $packGroupOrder: Int
    $packSize: Int
    $picURL: String
    $prodName: String!
    $prodNick: String!
    $qbID: String
    $isRetail: Boolean
    $retailName: String
    $retailDescrip: String
    $readyTime: Float
    $retailPrice: Float
    $shapeDay: Int
    $shapeNick: String
    $squareID: String
    $transferStage: String
    $weight: Float
    $wholePrice: Float
  ) {
    updateProduct(
      input: {
        Type: $Type
        bakeDay: $bakeDay
        bakeExtra: $bakeExtra
        bakeNick: $bakeNick
        bakedWhere: $bakedWhere
        batchSize: $batchSize
        defaultInclude: $defaultInclude
        descrip: $descrip
        doughNick: $doughNick
        forBake: $forBake
        freezerThaw: $freezerThaw
        guarantee: $guarantee
        inventoryProductId: $inventoryProductId
        isWhole: $isWhole
        isEOD: $isEOD
        leadTime: $leadTime
        packGroup: $packGroup
        packGroupOrder: $packGroupOrder
        packSize: $packSize
        picURL: $picURL
        isRetail: $isRetail
        retailName: $retailName
        retailDescrip: $retailDescrip
        prodName: $prodName
        prodNick: $prodNick
        qbID: $qbID
        readyTime: $readyTime
        retailPrice: $retailPrice
        shapeDay: $shapeDay
        shapeNick: $shapeNick
        squareID: $squareID
        transferStage: $transferStage
        weight: $weight
        wholePrice: $wholePrice
      }
    ) {
      Type
      bakeDay
      bakeExtra
      bakeNick
      bakedWhere
      batchSize
      createdAt
      defaultInclude
      descrip
      doughNick
      forBake
      freezerThaw
      guarantee
      inventoryProductId
      isWhole
      isEOD
      leadTime
      packGroup
      packGroupOrder
      packSize
      picURL
      prodName
      prodNick
      qbID
      isRetail
      retailName
      retailDescrip
      readyTime
      retailPrice
      shapeDay
      shapeNick
      squareID
      transferStage
      updatedAt
      weight
      wholePrice
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
