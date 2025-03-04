// MARKED FOR DEPRECATION

// import useSWR, { mutate } from "swr"
// import { defaultSwrOptions } from "./_constants"

// import { useMemo } from "react"
// import gqlFetcher from "./_fetchers"
// import { sortBy } from "lodash"

// const listProductsFull = /* GraphQL */ `
//   query ListProducts(
//     $prodNick: String
//     $filter: ModelProductFilterInput
//     $limit: Int
//     $nextToken: String
//     $sortDirection: ModelSortDirection
//   ) {
//     listProducts(
//       prodNick: $prodNick
//       filter: $filter
//       limit: $limit
//       nextToken: $nextToken
//       sortDirection: $sortDirection
//     ) {
//       items {
//         Type
//         prodName
//         prodNick
//         packGroup
//         packSize
//         doughNick
//         freezerThaw
//         packGroupOrder
//         shapeDay
//         shapeNick
//         bakeDay
//         bakeNick
//         guarantee
//         transferStage
//         readyTime
//         bakedWhere
//         wholePrice
//         retailPrice
//         isRetail
//         retailName
//         retailDescrip
//         isWhole
//         isEOD
//         weight
//         descrip
//         picURL
//         squareID
//         forBake
//         bakeExtra
//         batchSize
//         defaultInclude
//         leadTime
//         daysAvailable
//         qbID
//         currentStock
//         whoCountedLast
//         freezerClosing
//         freezerCount
//         freezerNorth
//         freezerNorthClosing
//         freezerNorthFlag
//         prepreshaped
//         preshaped
//         updatePreDate
//         updateFreezerDate
//         backporchbakerypre
//         backporchbakery
//         bpbextrapre
//         bpbextra
//         bpbssetoutpre
//         bpbssetout
//         sheetMake
//         createdAt
//         updatedAt
//         inventoryProductId
//       }
//     }
//   }
// `;

// /**
//  * Lists product objects with full attributes. Sorted by prodName.
//  * @param {boolean} shouldFetch Fetches data only when true.
//  * @returns {{ data: Array<{ locNick: string, locName: string }>, errors: object }} A list of locNick ID's and locName text labels.
//  */
// export const useProductListFull = (shouldFetch) => {
//   const { data, ...otherReturns } = useSWR(
//     shouldFetch ? [listProductsFull, { limit: 1000 }] : null, 
//     gqlFetcher, 
//     defaultSwrOptions
//   )

//   const transformData = () => {
//     if (data) return sortBy(data.data.listProducts.items, ['prodName'])
//   }

//   return({
//     data: useMemo(transformData, [data]),
//     ...otherReturns
//   })

// }

// /** 
//  * Can be called whenever productListFull data is affected by a mutation.
//  * Revalidation can be called anywhere, even when useProductListFull is not present.
//  */
// export const revalidateProductListFull = () => {
//   mutate(
//     [listProductsFull, { limit: 1000 }], 
//     null, 
//     { revalidate: true}
//   )
// }