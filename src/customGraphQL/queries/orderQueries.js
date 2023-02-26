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
            leadTime
          } 
          qty
          qtyUpdatedOn
          sameDayMaxQty
          delivDate
          ItemNote
          isWhole
          SO
          rate
          route
          isLate
          createdOn
          updatedOn
          updatedBy
          ttl
        }
      }
    }
  }
`;

export const transitionOrdersByLocByDelivDate = /* GraphQL */ `
  query OrderByLocByDelivDate(
    $locNick: String!
    $delivDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    orderByLocByDelivDate(
      locNick: $locNick
      delivDate: $delivDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        prodNick
        isWhole
        delivDate
        route
        ItemNote
        # updatedOn
        # updatedBy
      }
      nextToken
    }
  }
`;