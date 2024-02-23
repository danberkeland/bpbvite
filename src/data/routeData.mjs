// OK

// import useSWR, { mutate } from "swr";
// import { defaultSwrOptions } from "./_constants.js";

// import gqlFetcher from "./_fetchers.js";

// const listRoutesFull = /* GraphQL */ `
//   query ListRoutes(
//     $routeNick: String
//     $filter: ModelRouteFilterInput
//     $limit: Int
//     $nextToken: String
//     $sortDirection: ModelSortDirection
//   ) {
//     listRoutes(
//       routeNick: $routeNick
//       filter: $filter
//       limit: $limit
//       nextToken: $nextToken
//       sortDirection: $sortDirection
//     ) {
//       items {
//         routeNick
//         routeName
//         routeStart
//         routeTime
//         RouteDepart
//         RouteArrive
//         RouteSched
//         printOrder
//         driver
//         zoneRoute {
//           items {
//             zone {
//               zoneName
//               zoneNick
//             }
//           }
//         }

//         createdAt
//         updatedAt
//       }
//       # nextToken
//     }
//   }
// `;

// const listZoneRoutes = /* GraphQL */ `
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

// // actually joins zoneRoute data to each route item, so the below
// // useZoneRouteListFull hook is not strictly necessary
// export const useRouteListFull = (shouldFetch) => {
//   let query = listRoutesFull;
//   let variables = { limit: 1000 };

//   const { data, ...otherReturns } = useSWR(
//     shouldFetch ? [query, variables] : null,
//     gqlFetcher,
//     defaultSwrOptions
//   );

//   return {
//     data: data?.data.listRoutes.items ?? undefined,
//     ...otherReturns
//   };
// };

// export const revalidateRouteList = () => {
//   let query = listRoutesFull;
//   mutate([query, { limit: 1000 }], null, { revalidate: true });
// };


// export const useZoneRouteListFull = ({ shouldFetch }) => {
//   let query = listZoneRoutes;
//   let variables = { limit: 1000 };

//   const { data, ...otherReturns } = useSWR(
//     shouldFetch ? [query, variables] : null,
//     gqlFetcher,
//     defaultSwrOptions
//   );

//   return {
//     data: data?.data.listZoneRoutes.items ?? undefined,
//     ...otherReturns
//   };
// };

