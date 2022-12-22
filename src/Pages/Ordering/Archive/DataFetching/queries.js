export const listLocationNames = /* GraphQL */ `
  query ListLocations(
    $locNick: String
    $filter: ModelLocationFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listLocations(
      locNick: $locNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        locNick
        locName
      }
      nextToken
    }
  }
`;

export const listOrdersFromLocation = /* GraphQL */ `
  query MyQuery(
    $locNick: String!, 
    $dayOfWeek: String, 
    $delivDate: String
  ) {
    getLocation(locNick: $locNick) {
      locNick
      locName
      zoneNick
      customProd {
        items {
          prodNick
          wholePrice
        }
      }
      orders(filter: {delivDate: {eq: $delivDate}}) {
        items {
          id
          product {
            prodNick
            prodName
            wholePrice
            retailPrice
          } 
          qty
          delivDate
          ItemNote
          isWhole
          SO
          rate
          route
          isLate
        }
        nextToken
      }
      standing(filter: {dayOfWeek: {eq: $dayOfWeek}}) {
        items {
          id
          product {
            prodNick
            prodName
            wholePrice
            retailPrice
          } 
          qty
          dayOfWeek
          ItemNote
          isWhole
          isStand
          startDate
          endDate
        }
        nextToken
      }
    }
  }
`;

export const listProducts = /* GraphQL */ `
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
        wholePrice
        retailPrice
        isRetail
        retailName
        retailDescrip
        isWhole
        weight
        descrip
        picURL
        squareID
        forBake
        defaultInclude
        leadTime
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listAltPricesforLocation = /* GraphQL */ `
   query MyQuery(
    $locNick: String!, 
  ) {
    getLocation(locNick: $locNick) {
      customProd {
        items {
          prodNick
          wholePrice
        }
      }
    }
  }
`;

export const listProductOverridesForLocation = /* GraphQL */ `
  query MyQuery(
    $locNick: String!, 
  ) {
    getLocation(locNick: $locNick) {
      customProd {
        items {
          prodNick
          wholePrice
        }
      }
      prodsNotAllowed {
        items {
          id
          isAllowed
          prodNick
        }
      }
    }
  }
`