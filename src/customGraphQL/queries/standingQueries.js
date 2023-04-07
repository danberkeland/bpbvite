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
            packSize
            leadTime
          } 
          qty
          dayOfWeek
          route
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

export const standingByLocByDayOfWeek = /* GraphQL */ `
  query StandingByLocByDayOfWeek(
    $locNick: String!
    $dayOfWeek: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelStandingFilterInput
    $limit: Int
  ) {
    standingByLocByDayOfWeek(
      locNick: $locNick
      dayOfWeek: $dayOfWeek
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
    ) {
      items {
        id
        product {
          prodNick
          prodName
          wholePrice
          retailPrice
          packSize
          leadTime
        } 
        qty
        dayOfWeek
        route
        ItemNote
        isWhole
        isStand
        startDate
        endDate
      }
    }
  }
`;