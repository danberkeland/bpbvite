// ***********
// * QUERIES *
// ***********

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
    }
  }
`;

export const getLocationDetails = /* GraphQL */ `
query MyQuery(
    $locNick: String!, 
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

export const listOrdersByLocationByDate = /* GraphQL */ `
  query MyQuery(
    $locNick: String!, 
    $delivDate: String
  ) {
    getLocation(locNick: $locNick) {
      ordersByDate(delivDate: {eq: $delivDate}) {
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
          createdOn
        }
      }
    }
  }
`;

export const listStandingByLocation = /* GraphQL */ `
  query MyQuery(
    $locNick: String!, 
  ) {
    getLocation(locNick: $locNick) {
      standing {
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

// *************
// * MUTATIONS *
// *************

export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
      id
      locNick
      prodNick
      qty
      SO
      isWhole
      delivDate
      rate
      route
      isLate
      ItemNote
      createdOn
    }
  }
`;

export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
      id
      locNick
      prodNick
      qty
      SO
      isWhole
      delivDate
      rate
      route
      isLate
      ItemNote
      createdOn
    }
  }
`;