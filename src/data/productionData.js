import { useMemo } from "react"

import useSWR, { mutate } from "swr"
import { defaultSwrOptions } from "./_constants"

import gqlFetcher from "./_fetchers"
import * as queries from "../customGraphQL/queries/productionQueries"

import { dateToYyyymmdd, getWeekday } from "../functions/dateAndTime"
import { combineOrdersByDate } from "../functions/orderingFunctions/combineOrders"
import { buildRouteMatrix } from "../functions/routeFunctions/buildRouteMatrix"
import { assignDelivRoute, calculateValidRoutes } from "../functions/routeFunctions/assignDelivRoute"
import { useLocationDetails } from "./locationData"
import { useProductListFull } from "./productData"
import { useRouteListFull } from "./routeData"
import { getDuplicates } from "../functions/detectDuplicates"
import { groupBy } from "../functions/groupBy"

const LIMIT = 5000

// **************************
// * Supporting Data Caches *
// **************************

export const useLogisticsDimensionData = (shouldFetch) => {
  const query = queries.getDimensionData
  const variables = { limit: LIMIT }
  const { data, errors } = useSWR(
    shouldFetch ? [query, variables] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  const transformData = () => {
    if (!data) return undefined

    const products = Object.fromEntries(data.data.listProducts.items.map(i => [i.prodNick, i]))
    const zones = Object.fromEntries(data.data.listZones.items.map(i => [i.zoneNick, i]))
    const routes = Object.fromEntries(data.data.listRoutes.items.map(i => [i.routeNick, i]))
    const zoneRoutes = data.data.listZoneRoutes.items.sort((zrA, zrB) => routes[zrA.routeNick].routeStart - routes[zrB.routeNick].routeStart)
    const doughs = Object.fromEntries(data.data.listDoughBackups.items.map(i => [i.doughName, i]))
    const doughComponents = groupBy(data.data.listDoughComponentBackups.items, ['dough'])

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
  const query = queries.getAllOrdersByDate
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
  const delivDateISO = dateToYyyymmdd(delivDateJS)
  const dayOfWeek = getWeekday(delivDateJS)

  const query = queries.getAllOrdersByDate
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

  } // end transformData

  return({
    data: useMemo(transformData, [data, includeHolding])
  })

}

// *******************
// * Main Data Cache *
// *******************


/**depreciating. Can use 'useOrderReportByDate with option includeHolding: false */
export const useLogisticsDataByDate = (delivDateJS, shouldFetch) => {
  const delivDate = dateToYyyymmdd(delivDateJS)
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
  //const delivDate = dateToYyyymmdd(delivDateJS)
  const dayOfWeek = getWeekday(delivDateJS)
  const { data:combinedOrders } = useCombinedOrdersByDate({ delivDateJS, includeHolding, shouldFetch })
  const { data:dimensionData } = useLogisticsDimensionData(shouldFetch)

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
      location: order.isWhole ? locations[order.locNick] : { locNick: order.locNick, locName: order.locNick, latestFirstDeliv: 7, latestFinalDeliv: 13 },
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
export const useCalculateRoutesByLocation = (locNick, shouldFetch) => {
  const { data:locationData } = useLocationDetails(locNick, shouldFetch)
  const { data:productData } = useProductListFull(shouldFetch)
  const { data:routeData } = useRouteListFull(shouldFetch)

  const transformData = () => {
    if (!locationData || !productData || !routeData) return (() => null)

    let zoneRoutes = locationData.zone.zoneRoute.items.map(zr => zr.routeNick)

    const locationDict = { [locationData.locNick] : { ...locationData, zoneRoutes: [...zoneRoutes] } }
    const productDict = Object.fromEntries(productData.map(p => [p.prodNick, p]))
    const routeDict = Object.fromEntries(routeData.map(r => [r.routeNick, r]))
    const routeMatrix = buildRouteMatrix(locationDict, productDict, routeDict)

    return [routeMatrix, locationData.zoneNick]
  }

  const memo = useMemo(transformData, [locationData, productData, routeData])
  const routeMatrix = memo ? memo[0] : undefined 
  const locationZoneNick = memo ? memo[1] : undefined

  const calculateRoute = (prodNick, dayOfWeek, fulfillmentOption) => 
    // imported function combines override logic and routeMatrix lookup.
    calculateValidRoutes(locNick, prodNick, fulfillmentOption, locationZoneNick, dayOfWeek, routeMatrix)
  
  // console.log("route matrix:",routeMatrix)

  // calculateValidRoutes({locNick: locNick, prodNick: prodNick, route: fulfillmentOption}, locationZoneNick, dayOfWeek, routeMatrix)
  
  return calculateRoute
}