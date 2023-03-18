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