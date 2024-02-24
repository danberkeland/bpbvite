// export const listZoneRoutes = /* GraphQL */ `
//   query ListZoneRoutes(
//     $filter: ModelZoneRouteFilterInput
//     $limit: Int
//     $nextToken: String
//   ) {
//     listZoneRoutes(filter: $filter, limit: $limit, nextToken: $nextToken) {
//       items {
//         id
//         routeNick
//         # route {
//         #   routeNick
//         #   routeName
//         #   routeStart
//         #   routeTime
//         #   RouteDepart
//         #   RouteArrive
//         #   RouteSched
//         #   printOrder
//         #   driver
//         #   createdAt
//         #   updatedAt
//         # }
//         zoneNick
//         # zone {
//         #   zoneNick
//         #   zoneName
//         #   description
//         #   zoneFee
//         #   createdAt
//         #   updatedAt
//         # }
//         # createdAt
//         # updatedAt
//       }
//       nextToken
//     }
//   }
// `;