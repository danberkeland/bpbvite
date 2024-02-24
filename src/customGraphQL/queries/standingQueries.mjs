// export const listStandingByLocation = /* GraphQL */ `
//   query MyQuery(
//     $locNick: String!, 
//     $limit: Int = 1000
//   ) {
//     getLocation(locNick: $locNick) {
//       standing(limit: $limit) {
//         items {
//           id
//           product {
//             prodNick
//             prodName
//             wholePrice
//             retailPrice
//             packSize
//             leadTime
//             daysAvailable
//           } 
//           qty
//           dayOfWeek
//           route
//           ItemNote
//           isWhole
//           isStand
//           startDate
//           endDate
//         }
//       }
//     }
//   }
// `;

// export const standingByLocByDayOfWeek = /* GraphQL */ `
//   query StandingByLocByDayOfWeek(
//     $locNick: String!
//     $dayOfWeek: ModelStringKeyConditionInput
//     $sortDirection: ModelSortDirection
//     $filter: ModelStandingFilterInput
//     $limit: Int
//   ) {
//     standingByLocByDayOfWeek(
//       locNick: $locNick
//       dayOfWeek: $dayOfWeek
//       sortDirection: $sortDirection
//       filter: $filter
//       limit: $limit
//     ) {
//       items {
//         id
//         product {
//           prodNick
//           prodName
//           wholePrice
//           retailPrice
//           packSize
//           leadTime
//           daysAvailable
//         } 
//         qty
//         dayOfWeek
//         route
//         ItemNote
//         isWhole
//         isStand
//         startDate
//         endDate
//       }
//     }
//   }
// `;


// export const listStandingsFull = /* GraphQL */ `
//   query ListStandings(
//     $filter: ModelStandingFilterInput
//     $limit: Int
//     $nextToken: String
//   ) {
//     listStandings(filter: $filter, limit: $limit, nextToken: $nextToken) {
//       items {
//         id
//         locNick
//         isWhole
//         isStand
//         dayOfWeek
//         route
//         prodNick
//         qty
//         ItemNote
//         startDate
//         endDate
//         createdAt
//         updatedAt
//         updatedBy
//       }
//       nextToken
//     }
//   }
// `;