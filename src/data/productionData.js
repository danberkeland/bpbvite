import useSWR, { mutate } from "swr"
import { defaultSwrOptions } from "./constants"

import { useMemo } from "react"

import dynamicSort from "../functions/dynamicSort"
import getNestedObject from "../functions/getNestedObject"

import gqlFetcher from "./fetchers"

import * as queries from "../customGraphQL/queries/productionQueries"

import { dateToYyyymmdd, getWeekday } from "../functions/dateAndTime"


const ddbRouteSchedMap = {
  '1': 'Sun',
  '2': 'Mon',
  '3': 'Tue',
  '4': 'Wed',
  '5': 'Thu',
  '6': 'Fri',
  '7': 'Sat',
}

export const useProductionDataByDate = (delivDateJS, shouldFetch) => {
  const delivDate = dateToYyyymmdd(delivDateJS)
  const dayOfWeek = getWeekday(delivDateJS)

  const query = queries.getProductionDataByDate
  const variables = {
    delivDate: delivDate,
    dayOfWeek: dayOfWeek,
    limit: 2000
  }
  console.log(variables)

  const { data, errors } = useSWR(
    shouldFetch ? [query, variables] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  const transformData = () => {
    // console.log("data:", data)
    if (!data) return undefined

    // for easy lookup, these arrays will be transformed into dictionaries
    // keyed on their "----Nick" primary index.
    let locations = Object.fromEntries(data.data.listLocations.items.map(L => [L.locNick, L]))
    let products = Object.fromEntries(data.data.listProducts.items.map(P => [P.prodNick, P]))
    let routes = Object.fromEntries(data.data.listRoutes.items
      .map(route => {
        let { RouteArrive, RouteDepart, RouteSched, ...otherAtts } = route
        return ({
          ...otherAtts,
          routeArrive: RouteArrive,
          routeDepart: RouteDepart,
          routeSched: RouteSched.map(n => ddbRouteSchedMap[n])
        })
      })
      .sort(dynamicSort("routeStart"))
      .map(R => [R.routeNick, R])
    )

    let zoneRoutes = data.data.listZoneRoutes.items
    let cartOrders = data.data.orderByDelivDate.items
      .map(i => ({...i, type: i.isWhole ? 'CW' : 'CR'}))
    let standingOrders = data.data.standingByDayOfWeek.items
      .filter(i => i.isStand === true)
      .map(i => ({...i, type: i.isWhole ? 'SW' : 'SR'}))
    let holdingOrders = data.data.standingByDayOfWeek.items
      .filter(i => i.isStand === false)
      .map(i => ({...i, type: i.isWhole ? 'HW' : 'HR'}))

    // console.log("locations", locations)
    // console.log("products", products)
    // console.log("routes", routes)
    // console.log("zoneRoutes", zoneRoutes)
    // console.log("cartOrders", cartOrders)
    // console.log("standingOrders", standingOrders)
    // console.log("holdingOrders", holdingOrders)

    const items = cartOrders.concat(standingOrders).concat(holdingOrders)
      .map(orderItem => ({
        ...orderItem,
        zoneRoutes: zoneRoutes.filter(zr => zr.zoneNick === locations[orderItem.locNick]["zoneNick"])
          .map(zr => ({
            routeNick: zr.routeNick,
            status: determineRouteStatus(
              locations[orderItem.locNick], 
              products[orderItem.prodNick], 
              routes[zr.routeNick], 
              routes, 
              dayOfWeek
            )
          }))
      }))
      .map(orderItem => ({
        ...orderItem,
        location: locations[orderItem.locNick],
        product: products[orderItem.prodNick]
      }))

    return items
  }

  const _data = useMemo(transformData, [data, dayOfWeek])
  // console.log("_data:", _data)

  return ({
    data: _data,
    errors: errors
  })

}


/**
 * 
 * @param {Object} location - DDB item representing the given location 
 * @param {Object} product - DDB item representing the given product
 * @param {Object} route - DDB item representing the route we wish to test
 * @param {String} dayOfWeek - route availability may depend on the weekday
 */
const determineRouteStatus = (location, product, route, allRoutes, dayOfWeek) => {

  const statusItem = {
    routeRuns: null,
    locationIsOpen: null,
    productReadyBeforeRouteStarts: null,
    productCanMakeIt: null,
    transitRoutes: null,
    productCanBeInPlace: null,
    isValid: null,
    errors: [],
  }

  if (!location) statusItem.errors.concat(["NO_LOCATION"])
  if (!product) statusItem.errors.concat(["NO_PRODUCT"])
  if (!route) statusItem.errors.concat(["NO_ROUTE"])
  if (!dayOfWeek) statusItem.errors.concat(["NO_WEEKDAY"])
  
  // TERMINATE IF ERRORS EXIST
  if (statusItem.errors.length) return statusItem

  const productReadyTime = Number(product.readyTime)
  const productBakeLocations = product.bakedWhere // string array

  const routeStartTime = Number(route.routeStart)
  const routeDuration = Number(route.routeTime)
  const routeEndTime = routeStartTime + routeDuration
  const routeDepartLocation = route.routeDepart

  // ***Determine if route runs***
  statusItem.routeRuns = route.routeSched.includes(dayOfWeek)

  // ***Determine if location "is open"*** 
  
  // This only checks if the route ends after the location is guaranteed 
  // to open. Is this a sufficient check, or are there further checks 
  // elsewhere to ensure that, say, the route doesn't end before a location 
  // opens, or that a locations doesn't close before a route starts?
  statusItem.locationIsOpen = location.latestFirstDeliv < routeEndTime

  // ***Determine if product is ready before the route starts***
  
  // Attempting to copy logic faithfully from legacy specification,
  // but now sure what the second part of the OR statement does.
  statusItem.productReadyBeforeRouteStarts = 
    productReadyTime < routeStartTime 
    || productReadyTime > location.latestFinalDeliv

  // ***Determine if "product can make it".***

  // example:
  // location L is served by a route R that starts at location A.
  // location L wants product P, but it is made at location B.
  // Is there a route that will take product P from location B to A
  // in time to get loaded for route R?
  //
  // let us call such routes "transit routes", which enable products
  // to be in the right place & at the right time to get loaded on
  // the final "delivery route"

  statusItem.productCanMakeIt = false
  let transitRoutes = []
  for (let testRoute of Object.values(allRoutes)) {
    let testRouteDepartLocation = testRoute.routeDepart
    let testRouteArriveLocation = testRoute.routeArrive
    let testRouteEndTime = Number(testRoute.routeStart) + Number(testRoute.routeTime)

    // New logic: pass over test routes that start/end at the same hub location.
    // The assumption is that if a route hits more than 2 hub nodes
    // (ex: A, B, A) it will be decomposed into more primitive routes that each
    // hit exactly 2 nodes (A to B, and B to A). Thus, any route with the same
    // Depart/Arrival location does not travel to another hub and cannot be a
    // means for hub-to-hub transit.
    if (testRouteDepartLocation === testRouteArriveLocation) continue

    let testRouteIsValidTransitRoute = 
      productBakeLocations.includes(testRouteDepartLocation)
      && testRouteArriveLocation === routeDepartLocation
      && (
        testRouteEndTime < routeStartTime 
        || testRouteEndTime > location.latestFinalDeliv
      )

    transitRoutes = transitRoutes.concat({
      routeNick: testRoute.routeNick,
      depart: testRouteDepartLocation,
      arrive: testRouteArriveLocation,
      EndTime: testRouteEndTime,
      isValid: testRouteIsValidTransitRoute
    })

    if (testRouteIsValidTransitRoute) {
      //transitRoutes = transitRoutes.concat(testRoute.routeNick)
      statusItem.productCanMakeIt = true
    }

  }
  statusItem.transitRoutes = transitRoutes

  // test if product can be in place
  statusItem.productCanBeInPlace = product.bakedWhere.includes("Mixed") 
    || product.bakedWhere.includes(routeDepartLocation)
    || statusItem.productCanMakeIt


  statusItem.isValid = 
    statusItem.routeRuns
    && statusItem.locationIsOpen
    && statusItem.productCanBeInPlace
    && statusItem.productReadyBeforeRouteStarts

  return statusItem
}