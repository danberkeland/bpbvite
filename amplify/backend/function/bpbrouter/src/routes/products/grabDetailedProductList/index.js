import mainCall from '/opt/mainCall/index.js';

const query = /* GraphQL */ `
  query MyQuery {
    listProducts {
      items {
        prodNick
        prodName
        Type
        packGroup
        packSize
        doughNick
        freezerThaw
        packGroupOrder
        shapeDay
        shapeNick
        bakeDay
        bakeNick
        guarantee
        transferStage
        readyTime
        wholePrice
        retailPrice
        isWhole
        weight
        descrip
        picURL
        squareID
        forBake
        bakeExtra
        batchSize
        defaultInclude
        leadTime
        qbID
        inventoryProductId
      }
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

 const grabDetailedProductList = async (event) => {
  let response = await mainCall(query, event);
  response.body = response.body.body.listProducts
  return response
};

export default grabDetailedProductList;
