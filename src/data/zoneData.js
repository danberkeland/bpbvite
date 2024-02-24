// OK

// import { useMemo } from "react"

// import useSWR from "swr"
// import { defaultSwrOptions } from "./_constants"

// import gqlFetcher from "./_fetchers"

// import { sortBy } from "lodash"

// const listZonesFull = /* GraphQL */ `
//   query ListZones(
//     $zoneNick: String
//     $filter: ModelZoneFilterInput
//     $limit: Int
//     $nextToken: String
//     $sortDirection: ModelSortDirection
//   ) {
//     listZones(
//       zoneNick: $zoneNick
//       filter: $filter
//       limit: $limit
//       nextToken: $nextToken
//       sortDirection: $sortDirection
//     ) {
//       items {
//         zoneNick
//         zoneName
//         description
//         zoneFee
//         # zoneRoute {
//         #   nextToken
//         # }
//         createdAt
//         updatedAt
//       }
//     }
//   }
// `;

// export const useZoneListFull = ({ shouldFetch }) => {
//   const { data, errors, mutate } = useSWR(
//     shouldFetch ? [listZonesFull, { limit: 1000 }] : null, 
//     gqlFetcher, 
//     defaultSwrOptions
//   )
  
//   const transformData = () => {
//     if (data) return sortBy(data.data.listZones.items, ["zoneName"])
//   }

//   return ({
//     data: useMemo(transformData, [data]),
//     errors,
//     mutate
//   })

// }