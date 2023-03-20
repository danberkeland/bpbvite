import { useMemo } from "react"

import useSWR, { mutate } from "swr"
import { defaultSwrOptions } from "./constants"

import gqlFetcher from "./fetchers"
import * as queries from "../customGraphQL/queries/productionQueries"

import { dateToYyyymmdd, getWeekday } from "../functions/dateAndTime"
import { combineOrdersByDate } from "../functions/orderingFunctions/combineOrders"
import { buildRouteMatrix } from "../functions/routeFunctions/buildRouteMatrix"
import { assignDelivRoute } from "../functions/routeFunctions/assignDelivRoute"

const LIMIT = 2000

// **************************
// * Supporting Data Caches *
// **************************

export const useLogisticsDimensionData = (shouldFetch) => {
  const query = queries.getDimensionData
  const variables = { limit: LIMIT }
  const { data } = useSWR(
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
      routeMatrix: buildRouteMatrix(locations, products, routes)
    })

  } // end transformData

  return ({
    data: useMemo(transformData, [data])
  })

} 

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

// *******************
// * Main Data Cache *
// *******************

export const useLogisticsDataByDate = (delivDateJS, shouldFetch) => {
  const delivDate = dateToYyyymmdd(delivDateJS)
  const dayOfWeek = getWeekday(delivDateJS)

  const { data:orderData } = useOrderDataByDate(delivDate, dayOfWeek, shouldFetch)
  const { data:dimensionData } = useLogisticsDimensionData(shouldFetch)

  const transformData = () => {
    if (!orderData || !dimensionData) return undefined

    let { locations, products, routeMatrix } = dimensionData
    let { cartOrders, standingOrders } = orderData
    
    const combinedRoutedOrders = combineOrdersByDate(cartOrders, standingOrders.filter(i => i.isStand))
      .filter(order => order.qty > 0)
      .map(order => assignDelivRoute(order, locations[order.locNick], dayOfWeek, routeMatrix))

    return combinedRoutedOrders

  } // end transformData
  
  return ({
    dimensionData: dimensionData,
    routedOrderData: useMemo(transformData, [orderData, dimensionData])
  })
}