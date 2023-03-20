import useSWR, { mutate } from "swr"
import { defaultSwrOptions } from "./constants"

import { useMemo } from "react"

import dynamicSort from "../functions/dynamicSort"

import gqlFetcher from "./fetchers"
import * as queries from "../customGraphQL/queries/productionQueries"
import * as queries2 from "../customGraphQL/queries/productionQueries2"

import { dateToYyyymmdd, getWeekday, yyyymmddToWeekday } from "../functions/dateAndTime"

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

    // for easy lookup, these arrays will be transformed into 
    // dictionaries keyed on their "----Nick" primary index.
    let locations = Object.fromEntries(data.data.listLocations.items.map(L => [L.locNick, L]))
    let products = Object.fromEntries(data.data.listProducts.items.map(P => [P.prodNick, P]))
    let routes = Object.fromEntries(
      data.data.listRoutes.items.map(route => {
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
    console.log("routes", routes)
    console.log("zoneRoutes", zoneRoutes)
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


// ***************
// * DEPRECIATED *
// ***************

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

    let failureReasons = []
    if (!productBakeLocations.includes(testRouteDepartLocation)) failureReasons.push("product not baked at start hub")
    if (testRouteArriveLocation !== routeDepartLocation) failureReasons.push("transit route doesn't end at deliv route start")
    if (!(testRouteEndTime < routeStartTime || testRouteEndTime > location.latestFinalDeliv)) failureReasons.push("transit route ends after deliv route starts AND before locations latest final time")

    transitRoutes = transitRoutes.concat({
      routeNick: testRoute.routeNick,
      depart: testRouteDepartLocation,
      arrive: testRouteArriveLocation,
      EndTime: testRouteEndTime,
      isValid: testRouteIsValidTransitRoute,
      testFailures: failureReasons
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


const LIMIT = 2000

export const useRouteGrid = (delivDateJS, shouldFetch) => {
  const delivDate = dateToYyyymmdd(delivDateJS)
  const dayOfWeek = getWeekday(delivDateJS)

  const query = queries2.getRouteGridData
  const variables = {
    delivDate: delivDate,
    dayOfWeek: dayOfWeek,
    limit: LIMIT
  }
  console.log(variables)

  const { data, errors } = useSWR(
    shouldFetch ? [query, variables] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  console.log("data:", data)
  console.log("errors:", errors)

  const transformData = () => {
    if (!data) return undefined

    if (data.data.orderByDelivDate.items.length === LIMIT) console.log("Warning: cart order items has reached limit")
    if (data.data.standingByDayOfWeek.items.length === LIMIT) console.log("Warning: standing order items has reached limit")

    let routes = Object.fromEntries(data.data.listRoutes.items.map(r => [r.routeNick, r]))
    let cartOrdersByDate = data.data.orderByDelivDate.items
    let standingOrdersByDay = data.data.standingByDayOfWeek.items
      .filter(item => item.isStand)

    let orders = combineOrdersByDate(cartOrdersByDate, standingOrdersByDay)
      .filter(item => item.qty !== 0)
      .map(orderItem => {
        let fulfillmentOption = orderItem.route
        let calculatedRouteNick = calculateRoute(
          orderItem.product, 
          orderItem.location, 
          dayOfWeek,
          fulfillmentOption, 
          routes
        )

        return ({
          ...orderItem,
          routeNick: calculatedRouteNick
        })
      })
    
    return {
      orders: orders,
      routes: data.data.listRoutes.items
    }
  }

  const transformedData = useMemo(transformData, [data])
  //console.log(transformedData)

  return ({
    data: transformedData,
    errors: errors
  })
}

/**
 * Assumes cart and standing orders are "cleaned" to the point where cart
 * overrides can be applied on product/location match.
 * 
 * This means cart and standing datasets are for equivalent day/date, and
 * that standing orders do not contain holding order records.
 */
const combineOrdersByDate = (cartOrdersbyDate, standingOrdersbyDay) => {
  // We forego the simple Object.fromEntries construction and build our objects by
  // looping, allowing us to record any duplicate items, which could cause inaccurate 
  // output.

  // Current behavior keeps the first of any duplicate records with the other normal
  // items. Any subsequent duplicates get recorded as a duplicate, but not along with
  // the original item -- so we'll know it's a duplicate, but won't be able to easily
  // see which record it's a duplicate of.
  
  const keyedStanding = { items: {}, duplicates: [] }
  for (let item of standingOrdersbyDay) {
    //let dataKey = `${item.location.locNick}#${item.product.prodNick}`
    let dataKey = `${item.locNick}#${item.prodNick}`
    if (dataKey in keyedStanding.items) {
      keyedStanding.duplicates.push(item)
    } else {
      keyedStanding.items[dataKey] = item
    }

  }
  
  const keyedOrders = { items: {}, duplicates: [] }
  for (let item of cartOrdersbyDate) {
    //let dataKey = `${item.location.locNick}#${item.product.prodNick}`
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

const ddbRouteSchedMap = {
  Sun: '1',
  Mon: '2',
  Tue: '3',
  Wed: '4',
  Thu: '5',
  Fri: '6',
  Sat: '7'
}

/**
 * 
 * @param {Object} product 
 * @param {Object} location 
 * @param {Object} dayOfWeek 
 * @param {Object} allRoutes - converted array of route objects, keyed on routeNick
 */
const calculateRoute = (product, location, dayOfWeek, fulfillmentOption, allRoutes) => {

  let dayNum = ddbRouteSchedMap[dayOfWeek]
  let { prodNick, readyTime, bakedWhere } = product
  let { locNick, latestFirstDeliv, latestFinalDeliv } = location
  let zoneNick = location.zone.zoneNick
  let zoneRoutes = location.zone.zoneRoute.items
    .map(item => item.routeNick)
    .sort((a,b) => {
      return allRoutes[a].routeStart - allRoutes[b].routeStart
    })
  

    
  // ***TESTS***
    
  let calculatedRoute = "NOT ASSIGNED"
  for (let routeNick of zoneRoutes) {
    let {   
      routeStart, 
      routeTime, 
      RouteDepart, 
      //RouteArrive, 
      RouteSched
    } = allRoutes[routeNick]
    let routeEndTime = Number(routeStart) + Number(routeTime)

    let routeRunsThatDay = RouteSched.includes(dayNum)

    let validTransitRouteExists = false
    for (let testRoute of Object.values(allRoutes)) {
      let testRouteEndTime = Number(testRoute.routeStart) + Number(testRoute.routeTime)

      let testRouteIsValidTransitRoute = 
        bakedWhere.includes(testRoute.RouteDepart)
        && testRoute.RouteArrive === RouteDepart
        && (
          testRouteEndTime < Number(routeStart) 
          || testRouteEndTime > latestFinalDeliv
        )

      if (testRouteIsValidTransitRoute) {
        validTransitRouteExists = true
        break
      }
    }
    
    let productCanBeInPlace = bakedWhere.includes("Mixed") 
      || bakedWhere.includes(RouteDepart)
      || validTransitRouteExists

    let productReadyBeforeRouteStarts = readyTime < routeStart
      || readyTime > latestFinalDeliv

    let customerIsOpen = latestFirstDeliv < routeEndTime

    const routeIsValid = routeRunsThatDay
      && productCanBeInPlace
      && productReadyBeforeRouteStarts
      && customerIsOpen

    if (routeIsValid) {
      calculatedRoute = routeNick
      break
    }
  }

  // ***EXCEPTIONS & OVERRIDES***

  if (locNick === 'lincoln' && (prodNick === 'fr' || prodNick === 'dtch')) {
    calculatedRoute = "Lunch"
  }

  if (zoneNick === 'slopick' || zoneNick === 'Prado Retail') calculatedRoute = "Pick up SLO"
  if (zoneNick === 'atownpick' || zoneNick === "Carlton Retail") calculatedRoute = "Pick up Carlton"
  if (fulfillmentOption === 'slopick' || fulfillmentOption === 'Prado Retail') calculatedRoute = "Pick up SLO"
  if (fulfillmentOption === 'atownpick' || fulfillmentOption === 'Carlton Retail') calculatedRoute = "Pick up Carlton"

  return calculatedRoute
}