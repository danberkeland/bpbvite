// export const listLocationsSimple = /* GraphQL */ `
//   query ListLocations(
//     $locNick: String
//     $filter: ModelLocationFilterInput
//     $limit: Int
//     $nextToken: String
//     $sortDirection: ModelSortDirection
//   ) {
//     listLocations(
//       locNick: $locNick
//       filter: $filter
//       limit: $limit
//       nextToken: $nextToken
//       sortDirection: $sortDirection
//     ) {
//       items {
//         locNick
//         locName
//         ttl
//       }
//     }
//   }
// `;

// export const listLocationsFull = /* GraphQL */ `
//   query ListLocations(
//     $locNick: String
//     $filter: ModelLocationFilterInput
//     $limit: Int
//     $nextToken: String
//     $sortDirection: ModelSortDirection
//   ) {
//     listLocations(
//       locNick: $locNick
//       filter: $filter
//       limit: $limit
//       nextToken: $nextToken
//       sortDirection: $sortDirection
//     ) {
//       items {
//         Type
//         locNick
//         locName
//         subs {
//           items {
//             sub
//           }
//         }
//         zoneNick
//         addr1
//         addr2
//         city
//         zip
//         email
//         phone
//         firstName
//         lastName
//         toBePrinted
//         toBeEmailed
//         printDuplicate
//         terms
//         invoicing
//         latestFirstDeliv
//         latestFinalDeliv
//         webpageURL
//         picURL
//         gMap
//         specialInstructions
//         delivOrder
//         qbID
//         currentBalance
//         isActive
//         createdAt
//         updatedAt
//         locationCreditAppId
//         prodsNotAllowed {
//           items {
//             id
//             isAllowed
//             product {
//               prodNick
//               prodName
//             }
           
//           }
//           nextToken
//         }
//         customProd {
          
//           items {
//             id
//             wholePrice
//             product {
//               prodNick
//               prodName
//             }
//           }
//           nextToken
//         }
//         templateProd {
          
//           items {
//             id
//             product {
//               prodName
//             }
//           }
//           nextToken
//         }
//       }
//       nextToken
//     }
//   }
// `;
// export const getLocationDetails = /* GraphQL */ `
//   query GetLocation($locNick: String!) {
//     getLocation(locNick: $locNick) {
//       Type
//       locNick
//       locName
//       subs {
//         items {
//           id
//           Type
//           authType
//           locNick
//           sub
//           createdAt
//           updatedAt
//         }
//         nextToken
//       }
//       zoneNick
//       zone {
//         zoneNick
//         zoneName
//         description
//         zoneFee
//         zoneRoute {
//           items {
//             routeNick
//           }
//         }
//         createdAt
//         updatedAt
//       }
//       creditApp {
//         id
//         firstName
//         lastName
//         companyName
//         phone
//         email
//         addr1
//         addr2
//         city
//         state
//         zip
//         locAddr1
//         locAddr2
//         locCity
//         locState
//         locZip
//         startDate
//         businessType
//         bankName
//         bankPhone
//         refName
//         refAddr1
//         refAddr2
//         refCity
//         refZip
//         refPhone
//         refEmail
//         refDescrip
//         signture
//         sigDate
//         sigName
//         sigTitle
//         createdAt
//         updatedAt
//       }
//       addr1
//       addr2
//       city
//       zip
//       email
//       orderCnfEmail
//       phone
//       firstName
//       lastName
//       toBePrinted
//       toBeEmailed
//       printDuplicate
//       terms
//       invoicing
//       latestFirstDeliv
//       latestFinalDeliv
//       webpageURL
//       picURL
//       gMap
//       specialInstructions
//       delivOrder
//       qbID
//       currentBalance
//       isActive
//       ttl
//       prodsNotAllowed {
//         items {
//           id
//           isAllowed
//           locNick
//           prodNick
//           createdAt
//           updatedAt
//         }
//         nextToken
//       }
//       customProd {
//         items {
//           id
//           wholePrice
//           locNick
//           prodNick
//           createdAt
//           updatedAt
//         }
//         nextToken
//       }
//       templateProd {
//         items {
//           id
//           locNick
//           prodNick
//           product {
//             prodNick
//             prodName
//             wholePrice
//             retailPrice
//             daysAvailable
//             leadTime
//             packSize
//           }
//           createdAt
//           updatedAt
//         }
//         nextToken
//       }
//       altLeadTimeByProduct {
//         items {
//           id
//           leadTime
//           locNick
//           prodNick
//           createdAt
//           updatedAt
//         }
//         nextToken
//       }
//       createdAt
//       updatedAt
//       locationCreditAppId
//     }
//   }
// `;
