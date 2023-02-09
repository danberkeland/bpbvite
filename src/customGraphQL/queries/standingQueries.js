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