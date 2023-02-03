/** Get all primary attributes for a product. Does not include attributes of '@connected' types. */
export const getProductDetails = /* GraphQL */ `
  query GetProduct($prodNick: String!) {
    getProduct(prodNick: $prodNick) {
      Type
      prodName
      prodNick
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
      bakedWhere
      wholePrice
      retailPrice
      isRetail
      retailName
      retailDescrip
      isWhole
      isEOD
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
      createdAt
      updatedAt
      inventoryProductId
      createdAt
      updatedAt
    }
  }
`;

export const listProductsSimple = /* GraphQL */ `
  query ListProducts(
    $prodNick: String
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listProducts(
      prodNick: $prodNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        prodName
        prodNick
      }
    }
  }
`;

/** Product list that returns extra attributes to assist with order selection. */
export const listProductsForOrders = /* GraphQL */ `
  query ListProducts(
    $prodNick: String
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listProducts(
      prodNick: $prodNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        prodName
        prodNick
        packSize
        doughNick
        guarantee
        readyTime
        bakedWhere
        isWhole
        descrip
        wholePrice
        isRetail
        retailName
        retailDescrip
        retailPrice
        weight
        picURL
        squareID
        defaultInclude
        leadTime
        # retailLoc {    <-- may want to integrate these attributes in the future...
        #   nextToken
        # }
        # altPricing {
        #   nextToken
        # }
        # templateProd {
        #   nextToken
        # }
        # prodsNotAllowed {
        #   nextToken
        # }
        # productVendor {
        #   nextToken
        # }
        # altLeadTimeByLocation {
        #   nextToken
        # }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;