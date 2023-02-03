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