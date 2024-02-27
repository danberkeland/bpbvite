// MARKED FOR DEPRECATION

import { useMemo } from "react"
 
import useSWR from "swr"
import { defaultSwrOptions } from "./_constants"

import gqlFetcher from "./_fetchers"
// import * as queries from "../customGraphQL/queries/productionQueries"

import { buildRouteMatrix, buildRouteMatrix_test } from "../functions/routeFunctions/buildRouteMatrix"
import { 
  assignDelivRoute, 
  calculateValidRoutes, 
  calculateValidRoutes_test
} from "../functions/routeFunctions/assignDelivRoute"

import { useListData } from "./_listData"
import { groupBy, sortBy } from "lodash"

const groupByNAtts = (data, keyAtts) => groupBy(
  data,
  item => keyAtts.map(att => String(item[att])).join("#")
)

const getDuplicates = (objectArray, keyAtts) => {
  const buckets = groupByNAtts(objectArray, keyAtts)
  return Object.values(buckets).filter(group => group.length > 1)

}

/**
 * Convert JS date into capitalized 3 letter weekday,
 * compatible with database entries.
 */

function getWeekday(date) {
  if (!date) return null
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return (weekdays[date.getDay()])
}

const LIMIT = 5000

// const listProductsForProduction = /* GraphQL */ `
//   query ListProducts(
//     # $prodNick: String
//     # $filter: ModelProductFilterInput
//     $limit: Int
//     # $nextToken: String
//     # $sortDirection: ModelSortDirection
//   ) {
//     listProducts(
//       # prodNick: $prodNick
//       # filter: $filter
//       limit: $limit
//       # nextToken: $nextToken
//       # sortDirection: $sortDirection
//     ) {
//       items {
//         prodName
//         prodNick
//         packGroup
//         packSize
//         doughNick # consider querying dough separately to avoid redundant data
//         # doughType {
//         #   doughNick
//         #   doughName
//         #   hydration
//         #   batchSize
//         #   mixedWhere
//         #   isBakeReady
//         #   buffer
//         #   saltInDry
//         #   createdAt
//         #   updatedAt
//         # }
//         # freezerThaw
//         # packGroupOrder
//         # shapeDay
//         # shapeNick
//         # bakeDay
//         bakeNick
//         guarantee
//         # transferStage
//         readyTime
//         bakedWhere
//         # wholePrice
//         # retailPrice
//         # isRetail
//         # retailName
//         # retailDescrip
//         # isWhole
//         # isEOD
//         weight
//         # descrip
//         # picURL
//         # squareID
//         # forBake
//         bakeExtra
//         batchSize
//         # defaultInclude
//         # leadTime
//         # qbID
//         currentStock
//         freezerClosing
//         freezerCount
//         freezerNorth
//         freezerNorthClosing
//         freezerNorthFlag
//         prepreshaped
//         preshaped
//         updatePreDate
//         # retailLoc {
//         #   nextToken
//         # }
//         # standing {
//         #   nextToken
//         # }
//         # orders {
//         #   nextToken
//         # }
//         # depends {
//         #   nextToken
//         # }
//         # altPricing {
//         #   nextToken
//         # }
//         # templateProd {
//         #   nextToken
//         # }
//         # prodsNotAllowed {
//         #   nextToken
//         # }
//         # productVendor {
//         #   nextToken
//         # }
//         # EODCount {
//         #   prodNick
//         #   shelfOrFreezer
//         #   startOrFinish
//         #   location
//         #   qty
//         #   whoCounted
//         #   createdAt
//         #   updatedAt
//         # }
//         # ActualSetOut {
//         #   prodNick
//         #   qty
//         #   location
//         #   whoSetOut
//         #   createdAt
//         #   updatedAt
//         # }
//         # altLeadTimeByLocation {
//         #   nextToken
//         # }
//         # createdAt
//         # updatedAt
//         # inventoryProductId
//       }
//       # nextToken
//     }
//   }
// `;
// const listLocations = /* GraphQL */ `
//   query ListLocations(
//     # $locNick: String
//     # $filter: ModelLocationFilterInput
//     $limit: Int
//     # $nextToken: String
//     # $sortDirection: ModelSortDirection
//   ) {
//     listLocations(
//       # locNick: $locNick
//       # filter: $filter
//       limit: $limit
//       # nextToken: $nextToken
//       # sortDirection: $sortDirection
//     ) {
//       items {
//         # Type
//         locNick
//         locName
//         # subs {
//         #   nextToken
//         # }
//         # standing {
//         #   nextToken
//         # }
//         # orders {
//         #   nextToken
//         # }
//         # ordersByDate {
//         #   nextToken
//         # }
//         # zoneNick
//         zone {
//           zoneNick
//           zoneName
//           # description
//           # zoneFee
//           # createdAt
//           # updatedAt
//         }
//         # creditApp {
//         #   id
//         #   firstName
//         #   lastName
//         #   companyName
//         #   phone
//         #   email
//         #   addr1
//         #   addr2
//         #   city
//         #   state
//         #   zip
//         #   locAddr1
//         #   locAddr2
//         #   locCity
//         #   locState
//         #   locZip
//         #   startDate
//         #   businessType
//         #   bankName
//         #   bankPhone
//         #   refName
//         #   refAddr1
//         #   refAddr2
//         #   refCity
//         #   refZip
//         #   refPhone
//         #   refEmail
//         #   refDescrip
//         #   signture
//         #   sigDate
//         #   sigName
//         #   sigTitle
//         #   createdAt
//         #   updatedAt
//         # }
//         # addr1
//         # addr2
//         # city
//         # zip
//         # email
//         # phone
//         # firstName
//         # lastName
//         # toBePrinted
//         # toBeEmailed
//         # printDuplicate
//         # terms
//         # invoicing
//         latestFirstDeliv
//         latestFinalDeliv
//         # webpageURL
//         # picURL
//         # gMap
//         # specialInstructions
//         delivOrder
//         # qbID
//         # currentBalance
//         # isActive
//         # prodsNotAllowed {
//         #   nextToken
//         # }
//         # customProd {
//         #   nextToken
//         # }
//         # templateProd {
//         #   nextToken
//         # }
//         # altLeadTimeByProduct {
//         #   nextToken
//         # }
//         # createdAt
//         # updatedAt
//         # locationCreditAppId
//       }
//       nextToken
//     }
//   }
// `;
// const listRoutes = /* GraphQL */ `
//   query ListRoutes(
//     # $routeNick: String
//     # $filter: ModelRouteFilterInput
//     $limit: Int
//     # $nextToken: String
//     # $sortDirection: ModelSortDirection
//   ) {
//     listRoutes(
//       # routeNick: $routeNick
//       # filter: $filter
//       limit: $limit
//       # nextToken: $nextToken
//       # sortDirection: $sortDirection
//     ) {
//       items {
//         routeNick
//         routeName
//         routeStart
//         routeTime
//         RouteDepart
//         RouteArrive
//         RouteSched
//         # printOrder
//         # driver
//         # zoneRoute {
//         #   nextToken
//         # }
//         # createdAt
//         # updatedAt
//       }
//       # nextToken
//     }
//   }
// `;
// const listZoneRoutes = /* GraphQL */ `
//   query ListZoneRoutes(
//     # $filter: ModelZoneRouteFilterInput
//     $limit: Int
//     # $nextToken: String
//   ) {
//     listZoneRoutes(
//       # filter: $filter, 
//       limit: $limit, 
//       # nextToken: $nextToken
//     ) {
//       items {
//         # id
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
//       # nextToken
//     }
//   }
// `;
// const orderByLocByDelivDate = /* GraphQL */ `
//   query OrderByDelivDate(
//     $delivDate: String!
//     # $sortDirection: ModelSortDirection
//     # $filter: ModelOrderFilterInput
//     $limit: Int
//     # $nextToken: String
//   ) {
//     orderByLocByDelivDate(
//       # locNick: $locNick
//       delivDate: $delivDate
//       # sortDirection: $sortDirection
//       # filter: $filter
//       limit: $limit
//       # nextToken: $nextToken
//     ) {
//       items {
//         # Type
//         # id
//         qty
//         # qtyUpdatedOn
//         # sameDayMaxQty
//         prodNick
//         # product {
//         #   Type
//         #   prodName
//         #   prodNick
//         #   packGroup
//         #   packSize
//         #   doughNick
//         #   freezerThaw
//         #   packGroupOrder
//         #   shapeDay
//         #   shapeNick
//         #   bakeDay
//         #   bakeNick
//         #   guarantee
//         #   transferStage
//         #   readyTime
//         #   bakedWhere
//         #   wholePrice
//         #   retailPrice
//         #   isRetail
//         #   retailName
//         #   retailDescrip
//         #   isWhole
//         #   isEOD
//         #   weight
//         #   descrip
//         #   picURL
//         #   squareID
//         #   forBake
//         #   bakeExtra
//         #   batchSize
//         #   defaultInclude
//         #   leadTime
//         #   qbID
//         #   currentStock
//         #   freezerClosing
//         #   freezerCount
//         #   freezerNorth
//         #   freezerNorthClosing
//         #   freezerNorthFlag
//         #   prepreshaped
//         #   preshaped
//         #   updatePreDate
//         #   createdAt
//         #   updatedAt
//         #   inventoryProductId
//         # }
//         # locNick
//         # location {
//         #   Type
//         #   locNick
//         #   locName
//         #   zoneNick
//         #   addr1
//         #   addr2
//         #   city
//         #   zip
//         #   email
//         #   phone
//         #   firstName
//         #   lastName
//         #   toBePrinted
//         #   toBeEmailed
//         #   printDuplicate
//         #   terms
//         #   invoicing
//         #   latestFirstDeliv
//         #   latestFinalDeliv
//         #   webpageURL
//         #   picURL
//         #   gMap
//         #   specialInstructions
//         #   delivOrder
//         #   qbID
//         #   currentBalance
//         #   isActive
//         #   createdAt
//         #   updatedAt
//         #   locationCreditAppId
//         # }
//         # ItemNote
//         # SO
//         isWhole
//         # delivDate
//         # rate
//         route
//         # isLate
//         # createdOn
//         # updatedOn
//         # updatedBy
//         # ttl
//       }
//       # nextToken
//     }
//   }
// `;
// const standingByDayOfWeek = /* GraphQL */ `
//   query StandingByDayOfWeek(
//     $dayOfWeek: String!
//     # $sortDirection: ModelSortDirection
//     # $filter: ModelStandingFilterInput
//     $limit: Int
//     # $nextToken: String
//   ) {
//     standingByDayOfWeek(
//       dayOfWeek: $dayOfWeek
//       # sortDirection: $sortDirection
//       # filter: $filter
//       limit: $limit
//       # nextToken: $nextToken
//     ) {
//       items {
//         # id
//         locNick
//         # location {
//         #   Type
//         #   locNick
//         #   locName
//         #   zoneNick
//         #   addr1
//         #   addr2
//         #   city
//         #   zip
//         #   email
//         #   phone
//         #   firstName
//         #   lastName
//         #   toBePrinted
//         #   toBeEmailed
//         #   printDuplicate
//         #   terms
//         #   invoicing
//         #   latestFirstDeliv
//         #   latestFinalDeliv
//         #   webpageURL
//         #   picURL
//         #   gMap
//         #   specialInstructions
//         #   delivOrder
//         #   qbID
//         #   currentBalance
//         #   isActive
//         #   createdAt
//         #   updatedAt
//         #   locationCreditAppId
//         # }
//         isWhole
//         isStand
//         dayOfWeek
//         route
//         prodNick
//         # product {
//         #   Type
//         #   prodName
//         #   prodNick
//         #   packGroup
//         #   packSize
//         #   doughNick
//         #   freezerThaw
//         #   packGroupOrder
//         #   shapeDay
//         #   shapeNick
//         #   bakeDay
//         #   bakeNick
//         #   guarantee
//         #   transferStage
//         #   readyTime
//         #   bakedWhere
//         #   wholePrice
//         #   retailPrice
//         #   isRetail
//         #   retailName
//         #   retailDescrip
//         #   isWhole
//         #   isEOD
//         #   weight
//         #   descrip
//         #   picURL
//         #   squareID
//         #   forBake
//         #   bakeExtra
//         #   batchSize
//         #   defaultInclude
//         #   leadTime
//         #   qbID
//         #   currentStock
//         #   freezerClosing
//         #   freezerCount
//         #   freezerNorth
//         #   freezerNorthClosing
//         #   freezerNorthFlag
//         #   prepreshaped
//         #   preshaped
//         #   updatePreDate
//         #   createdAt
//         #   updatedAt
//         #   inventoryProductId
//         # }
//         qty
//         # ItemNote
//         # startDate
//         # endDate
//         # createdAt
//         # updatedAt
//         # updatedBy
//       }
//       # nextToken
//     }
//   }
// `;


const productQuery = /* GraphQL */ `
  listProducts(limit: $limit) {
    items {
      prodName
      prodNick
      packGroup
      packSize
      doughNick
      bakeNick
      forBake
      guarantee
      readyTime
      bakedWhere
      weight
      bakeExtra
      batchSize
      currentStock
      freezerClosing
      freezerCount
      freezerNorth
      freezerNorthClosing
      freezerNorthFlag
      prepreshaped
      preshaped
      updatePreDate
    }
  }
`;
const locationQuery = /* GraphQL */ `
  listLocations(
    limit: $limit
  ) {
    items {
      locNick
      locName
      zoneNick
      # zone {
      #   zoneNick
      #   zoneName
      # }
      latestFirstDeliv
      latestFinalDeliv
      delivOrder
    }
    nextToken
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
      printOrder
      driver
    }
  }
`;
const zoneQuery = /* GraphQL */ ` 
  listZones(
    limit: $limit
  ) {
    items {
      zoneNick
      zoneName
      description
      zoneFee
      # zoneRoute {
      #   nextToken
      # }
      createdAt
      updatedAt
    }
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
      locNick
      prodNick
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
      locNick
      prodNick
      route
      qty
    }
    nextToken
  }
`;

const zoneRouteQuery = /* GraphQL */ `
    listZoneRoutes(
      limit: $limit
    ) {
      items {
        routeNick
        zoneNick
      }
    }
`;

// const doughQuery = /* GraphQL */ `
//   listDoughs(limit: $limit) {
//     items {
//       doughNick
//       doughName
//       hydration
//       batchSize
//       mixedWhere
//       bucketSets
//       preBucketSets
//       updatePreBucket
//       isBakeReady
//       buffer
//       saltInDry
//       createdAt
//       updatedAt
//     }
//   }
// `;

const doughBackupQuery = /* GraphQL */ `
  listDoughBackups(limit: $limit) {
    items {
      batchSize
      bucketSets
      buffer
      components
      createdAt
      doughName
      hydration
      id
      isBakeReady
      mixedWhere
      oldDough
      preBucketSets
      process
      saltInDry
      updatePreBucket
      updatedAt
    }
  }
`;

const doughComponentQuery = /* GraphQL */ `
  listDoughComponentBackups(limit: $limit) {
    items {
      id
      dough
      componentType
      componentName
      amount
      createdAt
      updatedAt
    }
  }
`;

// *********************
// * Depreciated Query *
// *********************

// const getProductionDataByDate = /* GraphQL */ `
//   query GetProductionDataByDate(
//     $delivDate: String!
//     $dayOfWeek: String!
//     $limit: Int
//   ) {
//     ${productQuery}
//     ${locationQuery}
//     ${routeQuery}
//     ${zoneRouteQuery}
//     ${orderQuery}
//     ${standingQuery}
//     ${doughComponentQuery}
//   }
// `;

// *******************
// * Current Queries *
// *******************

const getAllOrdersByDate = /* GraphQL */ `
  query GetProductionDataByDate(
    $delivDate: String!
    $dayOfWeek: String!
    $limit: Int
  ) {
    ${orderQuery}
    ${standingQuery}
  }
`;

const getDimensionData = /* GraphQL */ `
  query GetZonesAndRoutes(
    $limit: Int
  ) {
    ${productQuery}
    ${locationQuery}
    ${zoneQuery}
    ${routeQuery}
    ${zoneRouteQuery}
    ${doughBackupQuery}
    ${doughComponentQuery}
  }
`;

// **************************
// * Supporting Data Caches *
// **************************

export const useDimensionData = ({ shouldFetch=true }) => {
  const { data:LOC } = useListData({ tableName:"Location", shouldFetch })
  const { data:PRD } = useListData({ tableName:"Product", shouldFetch })
  const { data:ZNE } = useListData({ tableName:"Zone", shouldFetch })
  const { data:RTE } = useListData({ tableName:"Route", shouldFetch })
  const { data:ZRT } = useListData({ tableName:"ZoneRoute", shouldFetch })
  const { data:DGH } = useListData({ tableName:"DoughBackup", shouldFetch})
  const { data:DCP } = useListData({ 
    tableName: "DoughComponentBackup", shouldFetch 
  })

  const composeData = () => {
    if (!PRD || !ZNE || !RTE || !ZRT || !DGH || !DCP || !LOC) return undefined

    const products = Object.fromEntries(PRD.map(P => [P.prodNick, P]))
    const zones = Object.fromEntries(ZNE.map(Z => [Z.zoneNick, Z]))
    const routes =  Object.fromEntries(RTE.map(R => [R.routeNick, R]))
    const zoneRoutes = sortBy(ZRT, ['routeStart'])
    const doughs = Object.fromEntries(DGH.map(D => [D.doughName, D]))
    const doughComponents = Object.fromEntries(DCP.map(D => [D.dough, D]))
    const locations = Object.fromEntries(
      LOC.map(L => {
        const _zoneRoutes = zoneRoutes.filter(zr => 
          zr.zoneNick === L.zoneNick
        ).map(zr => zr.routeNick)
        const newValue = { ...L, zoneRoutes: _zoneRoutes }
        
        return [L.locNick, newValue]
      })
    )

    return({
      products, locations, zones, routes,
      zoneRoutes, doughs, doughComponents,
      routeMatrix: buildRouteMatrix(locations, products, routes)
    })

  } // end composeData

  return ({
    data: useMemo(composeData, [PRD, ZNE, RTE, ZRT, DGH, DCP, LOC])
  })

}

export const useLogisticsDimensionData = (shouldFetch) => {
  const query = getDimensionData
  const variables = { limit: LIMIT }
  const { data } = useSWR(
    shouldFetch ? [query, variables] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  const transformData = () => {
    if (!data) return undefined
    console.warn("Depreciated. consider calling useDimensionData instead")

    const products = Object.fromEntries(data.data.listProducts.items.map(i => [i.prodNick, i]))
    const zones = Object.fromEntries(data.data.listZones.items.map(i => [i.zoneNick, i]))
    const routes = Object.fromEntries(data.data.listRoutes.items.map(i => [i.routeNick, i]))
    const zoneRoutes = data.data.listZoneRoutes.items.sort((zrA, zrB) => routes[zrA.routeNick].routeStart - routes[zrB.routeNick].routeStart)
    const doughs = Object.fromEntries(data.data.listDoughBackups.items.map(i => [i.doughName, i]))
    const doughComponents = groupBy(data.data.listDoughComponentBackups.items, 'dough')

    // zoneRoutes contains all routes that serve the location's zone, ordered by start time.
    const locations = Object.fromEntries(
      data.data.listLocations.items.map(item => {
          let newValue = {
            ...item,
            zoneRoutes: zoneRoutes.filter(zr => zr.zoneNick === item.zoneNick).map(zr => zr.routeNick)
          }
          return [item.locNick, newValue]
        })
    )
      
    return({
      products: products,
      locations: locations,
      zones: zones,
      routes: routes,
      zoneRoutes: zoneRoutes,
      doughs: doughs,
      doughComponents: doughComponents,
      routeMatrix: buildRouteMatrix(locations, products, routes)
    })

  } // end transformData

  const _data = useMemo(transformData, [data])

  return ({
    data: _data
  })

} 

// depreciating for the below 'useCombinedOrdersByDate'
export const useOrderDataByDate = (delivDateISO, dayOfWeek, shouldFetch) => {
  const query = getAllOrdersByDate
  const variables = {
    delivDate: delivDateISO,
    dayOfWeek: dayOfWeek,
    limit: LIMIT
  }
  const { data } = useSWR(
    shouldFetch ? [query, variables] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  const transformData = () => {
    if (!data) return undefined
    return ({
      cartOrders: data.data.orderByDelivDate.items,
      standingOrders: data.data.standingByDayOfWeek.items
    })
  }

  return ({
    data: useMemo(transformData, [data])
  })
}

/** 
 * Most up-to-date hook for gathering and combining orders for production/logistics reports.
 * 
 * Filters to nonzero order qtys.
 */
export const useCombinedOrdersByDate = ({ delivDateJS, includeHolding=true, shouldFetch=false }) => {
  const delivDateISO = delivDateJS.toISOString().split('T')[0]
  const dayOfWeek = getWeekday(delivDateJS)

  const query = getAllOrdersByDate
  const variables = {
    delivDate: delivDateISO,
    dayOfWeek: dayOfWeek,
    limit: LIMIT
  }
  const { data } = useSWR(
    shouldFetch ? [query, variables] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  const transformData = () => {
    if (!data) return undefined

    const cartOrders = data.data.orderByDelivDate.items
    const standingOrders = data.data.standingByDayOfWeek.items
    const standingOnly = standingOrders.filter(order => order.isStand === true)
    const holdingOnly = standingOrders.filter(order => order.isStand === false)

    // Check for standing orders for simultaneous items for a given loc/prod
    // but with different isWhole, isStand values -- currently the UI doesn't
    // guard against this, but we have yet to implement a logic designed to
    // handle this case. In the future we may discard these checks.
    const cDupes = getDuplicates(cartOrders, ['locNick', 'prodNick'])

    let dupes = getDuplicates(standingOrders, ['locNick', 'prodNick'])
    let sDupes = getDuplicates(standingOnly, ['locNick', 'prodNick'])
    let hDupes = getDuplicates(holdingOnly, ['locNick', 'prodNick'])

    if (cDupes.length) console.log("Warning: cart order duplicates:", cDupes)
    if (sDupes.length) console.log("Warning: standing order duplicates:", sDupes)
    if (hDupes.length) console.log("warning: holding order duplicates:", hDupes)

    // duplication of this type is bad, too, but it should be extremely 
    // rare to observe. We still check to rule it out for certain.
    if (!dupes.length && (sDupes.length || hDupes.length)) {
      alert (
        `warning: duplicate standing/holding orders found:
        ${JSON.stringify(sDupes, null, 2)}
        ${JSON.stringify(hDupes, null, 2)}`
      )
    }

    // this is the type of "duplication" we need to watch out for (for now).
    // danger is more relevant when holding orders are included.
    if (dupes.length && (!sDupes.length && !hDupes.length)) {
      alert(
        `warning: overlapping standing/holding orders found. 
        May cause problems with current logic.
        ${JSON.stringify(dupes, null, 2)}`
      )
    }

    // Assuming the data isn't contaminated with duplicates, we can 
    // apply cart overrides with a simpler Object.fromEntries approach. 

    const cartDict = Object.fromEntries(cartOrders.map(C => [`${C.locNick}#${C.prodNick}`, C]))
    const standDict = includeHolding 
      ? Object.fromEntries(standingOrders.map(S => [`${S.locNick}#${S.prodNick}`, S]))
      : Object.fromEntries(standingOnly.map(S => [`${S.locNick}#${S.prodNick}`, S]))

    return (Object.values({
      ...standDict, 
      ...cartDict
    })).filter(item => item.qty !== 0)
    .map(item => ({ ...item, delivDate: delivDateISO }))

  } // end transformData

  return({
    data: useMemo(transformData, [data, includeHolding, delivDateISO])
  })

}

// *******************
// * Main Data Cache *
// *******************


/**depreciating. Can use 'useOrderReportByDate with option includeHolding: false */
export const useLogisticsDataByDate = (delivDateJS, shouldFetch) => {
  const delivDate = delivDateJS.toISOString().split('T')[0]
  const dayOfWeek = getWeekday(delivDateJS)

  const { data:orderData } = useOrderDataByDate(delivDate, dayOfWeek, shouldFetch)
  const { data:dimensionData } = useLogisticsDimensionData(shouldFetch)

  const transformData = () => {
    if (!orderData || !dimensionData) return undefined

    let { locations, routeMatrix } = dimensionData
    let { cartOrders, standingOrders } = orderData
    
    const combinedRoutedOrders = combineOrdersByDate(cartOrders, standingOrders.filter(i => i.isStand))
      .filter(order => order.qty > 0)
      .map(order => assignDelivRoute({
        order: order, 
        locationZoneNick: locations[order.locNick]?.zoneNick, 
        dayOfWeek : dayOfWeek, 
        routeMatrix: routeMatrix
      }))
    return combinedRoutedOrders

  } // end transformData
  
  return ({
    dimensionData: dimensionData,
    routedOrderData: useMemo(transformData, [orderData, dimensionData, dayOfWeek])
  })
}

// successor to the above 'useLogisticsDataByDate'
//  - Updates method for combining cart/standing orders.
//  - Allows inclusion/exclusion of holdingOrders

/**  
 * Most up-to-date hook for producing order records for production/logistics reports.
 * Assigns routes and joins location, product, and route dimension data to records.
*/
export const useOrderReportByDate = ({ delivDateJS, includeHolding, shouldFetch }) => {
  //const delivDate = dateToYyyymmd_d(delivDateJS)
  const dayOfWeek = getWeekday(delivDateJS)
  const { data:combinedOrders } = useCombinedOrdersByDate({ delivDateJS, includeHolding, shouldFetch })
  const { data:dimensionData } = useDimensionData(shouldFetch)

  const transformData = () => {
    if (!combinedOrders || !dimensionData) return undefined

    const { locations, products, routes, routeMatrix } = dimensionData
    
    // Assign routes to each order
    //
    // Retail orders will not have a location to look up, but
    // the pickup route/fulfillment values of 'slopick' or 'atownpick'
    // are compatible values for route lookup.
    const combinedRoutedOrders = combinedOrders.map(order => assignDelivRoute({
        order: order, 
        locationZoneNick: order.isWhole ? locations[order.locNick]?.zoneNick : order.route, 
        dayOfWeek : dayOfWeek, 
        routeMatrix: routeMatrix
      }))

    // Join dimension data to orders
    // rename the order's route attribute to 'fulfillment'
    //   to avoid conflict with the joined 'route' object
    //
    // In the event of a retail order we 'join' a fake location
    // to keep the production algorithms from breaking.
    const combinedRoutedOrdersWithDimensionData = combinedRoutedOrders.map(order => ({
      ...order,
      fulfillment: order.route,
      location: order.isWhole 
        ? locations[order.locNick] 
        : { 
          locNick: order.locNick, 
          locName: order.locNick, 
          latestFirstDeliv: 7, 
          latestFinalDeliv: 13,
          zoneNick: order.route === 'atownpick' 
            ? 'atownpick' 
            : 'slopick'
        },
      product: products[order.prodNick],
      route: routes[order.routeNick]
    }))

    return combinedRoutedOrdersWithDimensionData

  } // end transformData
  
  return ({
    dimensionData: dimensionData,
    routedOrderData: useMemo(transformData, [combinedOrders, dimensionData, dayOfWeek])
  })
}

// ***Cache to enable general route assignment in the ordering page***

/**
 * Call up a delivery-route-calculating function for the given location.
 * 
 * The function takes a prodNick, dayOfWeek, and fulfillmentOption and
 * produces a list of routeNicks, sorted by routeStart time.
 * 
 * If no valid route exists, the function returns the array ['NOT ASSIGNED'].
 * 
 * Function uses a memoized lookup table of fetched/cached data. If the function
 * is not supplied with all arguments, or if the data has not been fetched, the
 * function will return null.
 */
export const useCalculateRoutesByLocation = (locNick, shouldFetch, useTest=false) => {

  const { data:locationData } = useListData({ tableName: "Location", shouldFetch: true })
  const { data:productData } = useListData({ tableName: "Product", shouldFetch: true })
  const { data:routeData } = useListData({ tableName: "Route", shouldFetch: true })

  const transformData = () => {
    if (!locationData || !productData || !routeData) return (() => null)

    let zoneRoutes = locationData.zone.zoneRoute.items.map(zr => zr.routeNick)

    const locationDict = { [locationData.locNick] : { ...locationData, zoneRoutes: [...zoneRoutes] } }
    const productDict = Object.fromEntries(productData.map(p => [p.prodNick, p]))
    const routeDict = Object.fromEntries(routeData.map(r => [r.routeNick, r]))
    const routeMatrix = useTest
      ? buildRouteMatrix_test(locationDict, productDict, routeDict)
      : buildRouteMatrix(locationDict, productDict, routeDict)

    const pickupMatrix = useTest
      ? buildRouteMatrix_test(pickupLocationDict, productDict, routeDict)
      : null

    return [routeMatrix, locationData.zoneNick, pickupMatrix]

  } // end transformData

  const memo = useMemo(transformData, [locationData, productData, routeData, useTest])
  const routeMatrix = memo ? memo[0] : undefined 
  const locationZoneNick = memo ? memo[1] : undefined
  const pickupMatrix = memo ? memo[2]: undefined

  const calculateRoute = (prodNick, dayOfWeek, fulfillmentOption) => 
    // imported function combines override logic and routeMatrix lookup.
    useTest 
      ? calculateValidRoutes_test(locNick, prodNick, fulfillmentOption, locationZoneNick, dayOfWeek, routeMatrix, pickupMatrix)
      : calculateValidRoutes(locNick, prodNick, fulfillmentOption, locationZoneNick, dayOfWeek, routeMatrix)
  
  // console.log("route matrix:",routeMatrix)

  // calculateValidRoutes({locNick: locNick, prodNick: prodNick, route: fulfillmentOption}, locationZoneNick, dayOfWeek, routeMatrix)
  
  return calculateRoute
}

const pickupLocationDict = {
  "slopick":    { locNick: "slopick", latestFirstDeliv: 5, latestFinalDeliv: 12, zoneRoutes: ['Pick up SLO']},
  "atownpick":  { locNick: "atownpick", latestFirstDeliv: 5, latestFinalDeliv: 12, zoneRoutes: ['Pick up Carlton']}
}



/**
 * Combines cart and standing orders so that cart items override any matching
 * standing items. Returns an array of order items. Returned cart and standing 
 * items are left in their original fetched shape 
 * (see customGraphQL/queries/productionQueries).
 * 
 * Assumptions:
 * 
 * 1. Cart and standing orders are filtered to a single equivalent day/date. 
 * 
 * 2. Standing orders do not contain holding order items.
 * 
 * DOES NOT REMOVE 0 QTY ORDERS!
 */
export const combineOrdersByDate = (cartOrdersbyDate, standingOrdersbyDay) => {
  // We forego the simple Object.fromEntries construction and build our objects by
  // looping, allowing us to record any duplicate items. Because of prior
  // filtering, 'duplicate' means two+ cart orders for the same product/location
  // or two+ standing orders for the same product/location

  // Current behavior keeps treats the first record as 'normal'. Subsequent 
  // duplicates get added to the 'duplicates' array, but not along with the 
  // original item. So we'll be easily alerted to the existence of duplicates,
  // but not be able to compare all of them side-by-side easily.
  
  const keyedStanding = { items: {}, duplicates: [] }
  for (let item of standingOrdersbyDay) {
    let dataKey = `${item.locNick}#${item.prodNick}`
    if (dataKey in keyedStanding.items) {
      keyedStanding.duplicates.push(item)
    } else {
      keyedStanding.items[dataKey] = item
    }

  }
  
  const keyedOrders = { items: {}, duplicates: [] }
  for (let item of cartOrdersbyDate) {
    let dataKey = `${item.locNick}#${item.prodNick}`
    if (dataKey in keyedOrders.items) {
      keyedOrders.duplicates.push(item)
    } else {
      keyedOrders.items[dataKey] = item
    }

  }

  if (keyedStanding.duplicates.length) {
    console.log("Duplicate standing orders:", keyedStanding.duplicates)
  }
  if (keyedOrders.duplicates.length) {
    console.log("Duplicate cart orders:", keyedOrders.duplicates)
  }

  return Object.values({ ...keyedStanding.items, ...keyedOrders.items })

}

// General-purpose function "bucketing" data
// by matching values across one or more
// attrubutes.
// 
// Returns an object keyed by observed 
// combinations of attribute values, delimited 
// with the '#' character. Values are 'bucket'
// arrays containing all items matching the key
// values.
//
// Supports specifying nested properties with
// lodash-like "." separators.