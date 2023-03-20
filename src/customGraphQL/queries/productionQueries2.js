// Approach that exploits table connections fully

const locationObject = `location {
  locNick
  locName
  latestFirstDeliv
  latestFinalDeliv
  delivOrder
  zone {
    zoneNick
    zoneRoute {
      items {
        routeNick
      }
    }
  }
}
`;

const productObject = `product {
  prodName
  prodNick
  readyTime
  bakedWhere
}
`;

const orderQuery = /* GraphQL */ `
  orderByDelivDate(
    delivDate: $delivDate
    limit: $limit
  ) {
    items {
      id
      isWhole
      location {
        locNick
        locName
        latestFirstDeliv
        latestFinalDeliv
        delivOrder
        zone {
          zoneNick
          zoneRoute {
            items {
              routeNick
            }
          }
        }
      }
      product {
        prodName
        prodNick
        readyTime
        bakedWhere
      }
      route
      qty
    }
  }
`;
const standingQuery = /* GraphQL */ `
  standingByDayOfWeek(
    dayOfWeek: $dayOfWeek
    limit: $limit
  ) {
    items {
      id
      isStand
      isWhole
      location {
        locNick
        locName
        latestFirstDeliv
        latestFinalDeliv
        delivOrder
        zone {
          zoneNick
          zoneRoute {
            items {
              routeNick
            }
          }
        }
      }
      product {
        prodName
        prodNick
        readyTime
        bakedWhere
      }
      route
      qty
    }
  }
`;
const routeQuery = /* GraphQL */ `
  listRoutes(
    limit: $limit
  ) {
    items {
      routeNick
      routeName
      routeStart
      routeTime
      RouteDepart
      RouteArrive
      RouteSched
      # printOrder
      # driver
    }
  }
`;

export const getRouteGridData = /* GraphQL */ `
  query GetProductionDataByDate(
    $delivDate: String!
    $dayOfWeek: String!
    $limit: Int
  ) {
    ${orderQuery}
    ${standingQuery}
    ${routeQuery}
  }
`;


// The above query is inefficient because of redundant fetching.
// When we get data through table connections, appsync performs
// a getItem or Query in DDB to fetch the connected item or items.
// In order to reduce redundancy it is much more efficient to
// Set up our retrieval pattern "starting on the one side, and
// connecting to the many side".  Starting with orders and working
// back to locations, and zones as we've done before leads to
// a lot of redundant fetching of the same locations and zones.
// Instead we should start by zone, then connect to locations,
// then connect to orders.

// Orders will connect N-to-1 with products which will cause
// redundant fetches.  

