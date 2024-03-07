// // MARKED FOR DEPRECATION

// import useSWR, { mutate } from "swr"
// import { defaultSwrOptions } from "./_constants"
// import { useMemo } from "react"
// import gqlFetcher from "./_fetchers"
// import { sortBy } from "lodash"


// const listLocationsFull = /* GraphQL */ `
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



// // /******************
// //  * QUERIES/CACHES *
// //  ******************/


// /**
//  * Produces a full list of locNicks/locNames.
//  * @param {boolean} shouldFetch Fetches data only when true.
//  * @returns {{ data: Array<Object>, errors: Object }}
//  */
// export const useLocationListFull = (shouldFetch) => {
//   const { data, ...otherReturns } = useSWR(
//     shouldFetch ? [listLocationsFull, { limit: 1000 }] : null, 
//     gqlFetcher, 
//     defaultSwrOptions
//   )

//   const transformData = () => {
//     if (data) return sortBy(data.data.listLocations.items, ['locName'])
//   }

//   return({
//     data: useMemo(transformData, [data]),
//     ...otherReturns
//   })

// }

// /** 
//  * Can be called whenever locationListSimple data is affected by a mutation.
//  * Revalidation can be called anywhere, even when useLocationListSimple is not present.
//  */
// export const revalidateLocationListFull = () => {
//   mutate(
//     [listLocationsFull, { limit: 1000 }], 
//     null, 
//     { revalidate: true}
//   )
// }

