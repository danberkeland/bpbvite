// Enrich an order item by assigning a route based on contextual information.
//
// This is a very minimal assignment, simply assigning a routeNick attribute
// to an order item. It answers the question: "how do we plan to deliver this 
// item?". 
//
// In other contexts we may want to ask: "what are all my delivery options for
// this order"? This is a similar computation, but we will mostly leave that
// as the responsibility of a separate module.
//
// Calculating the validity of an order requires some product/location info,
// a search of valid fulfillment routes, and finally a way of selecting a
// preferred route.
//
// Route assignment is described here.
//   
// We pretty much need to go 1 route at a time, applying a sequence of tests,
// discarding the route if it fails at any point.
//
// It helps us to test from finish to start.
// 
// Given a product, location, route, and a date...
//
//  * (Required) Does the route run on that date/weekday? 
//  * (Required) Does the delivPeriod intersect the customer's availability Period?
//  * Where will the product actually be baked?
//  * Is the bake location the same as the route departure hub?
//      If so...
//        * (Required) Is the product available that day?
//        * (Required) Is the product ready before the route starts?
//        Route is valid
//      If not, test for a valid transfer route...
//        > Find routes that connects the actual bake location to the route's
//          departure hub (lucky for us there is always exactly 1 candidate)
//        > Test:
//            * does the transfer Period end before the delivery Period starts?
//            * is the product ready before the transfer Period starts?
//            Route is valid if test passes, else test for valid delayed delivery
//      
//

import { keyBy } from "lodash/fp"
import { useListData } from "../../_listData"
import { useCallback } from "react"
import { Period } from "./period.mjs"


/**Pre-Loads the required Route, ZoneRoute data to make route assignment work */
const useGetRouteOptions = () => {
  const { data:RTE } = useListData({ tableName: "Route", shouldFetch: true })
  const { data:ZRT } = useListData({ tableName: "ZoneRoute", shouldFetch: true })

  const makeFunction = () => {
    if (!RTE || !ZRT) {
      return () => undefined // return some trivial function
    }

    const getRouteOptions = ({ product, location }) => 
      _getRouteOptions({ product, location, RTE, ZRT })

    

  } 

  return useCallback(makeFunction, [RTE, ZRT])
}


/**
 * For internal use, we would rather use a fixed length (7) array
 * with truthy/falsy values (1 and 0) to model a route's schedule,
 * where indexes 0 - 6 correspond to Sun - Sat.
 */
const legacyWeekdays = ['1', '2', '3', '4', '5', '6', '7']
const weekdays = [0, 1, 2, 3, 4, 5, 6]

const _getRouteOptions = ({ product, location, RTE, ZRT }) => { 

  const {latestFirstDeliv, latestFinalDeliv} = location
  const validDropoffPeriod = new Period(latestFirstDeliv, latestFinalDeliv)
  

  // Test only routes that serve the target zone
  // We do some transformations to make future computations clearer
  const routes = RTE
    .filter(R => ZRT.some(zr => 
      zr.routeNick === R.routeNick && zr.zoneNick === location.zoneNick
    ))
    .map(R => ({ 
      ...R, 
      RouteSched: legacyWeekdays.map(weekdayNum => 
        R.RouteSched.includes(weekdayNum) ? 1 : 0
      ),
      fulfillmentPeriod: new Period(R.routeStart, R.routeStart + R.routeTime)
    }))

  // routes that can move products from one shop/hub to another
  const transferRoutes = RTE.filter(R => R.RouteDepart !== R.RouteArrive)



  // summarize on all { routes } X { weekdays } (Cartesian Product)
  const summaryByRouteByWeekday = routes.map(route => {
    // Things that don't depend on the day/date:
    // 1. Decide if transfer is necessary. Our strategy is to bake at the 
    //    departure hub whenever the product allows it.

    const needsTransfer = !product.bakedWhere.includes(route.RouteDepart)

    // Test by weekday
    const summaryByWeekday = weekdays.map(weekdayNum => {



    })
    // In both cases...


    


  })

  // tests come in 4 flavors; by date and time, and by deiv schedule and production schedule

  

  // Group route candidates by day of week, make sure weekday groups 
  // are in Sun-Sat (0-6) order.
  const routeSummaries = sortBy(
    Object.values(groupBy(flatten(_routeSummaries), item => item.dayNum)),
    group => group[0].dayNum
  )

  // get all "2nd round" summaries that make adjustments for delayed delivery.
  // Iterating over route summaries grouped by weekday lets us read all
  // routes tested on the previous day.
  const adjustedRouteSummaries = adjustSummaries(routeSummaries, product)

  // when multiple routes are considered, sort the options so that the first
  // one is valid (if possible), has the minimum lead time, and earliest
  // start.
  const _assignedBySorting = adjustedRouteSummaries.map(group => sortBy(
    group, 
    [
      meta => !meta.isValid,
      meta => meta.adjustedLeadTime,
      meta => routes[meta.routeNick].routeStart,
    ]
  ))

  return _assignedBySorting
  
}

/** 
 * Testing different iteration order to allow 
 * reading all route summaries for the previous day.
 */
const getRouteSummaries = ({ 
  route:baseRoute, 
  product:baseProduct, 
  location, 
  transferRoutes 

}) => {

  // ***************************************
  // Apply Overrides before Route Assignment
  // ***************************************


  const productOverrides = applyOverridesForRouteAssignment({ 
    product: baseProduct, 
    location, 
    route: baseRoute
  })
  const product = { ...baseProduct, ...productOverrides }

  const routeOverrides = getRouteOverridesForAssignment({
    product: baseProduct, 
    location, 
    route: baseRoute,
  })
  const route = { ...baseRoute, ...routeOverrides }

  // end overrides

  let { latestFirstDeliv, latestFinalDeliv } = location
  let { readyTime, bakedWhere, daysAvailable } = product
  let { routeNick, routeStart, routeTime, RouteDepart, RouteSched } = route
  let routeEnd = routeStart + routeTime

  const routeSummary = weekdays.map((day, idx) => {
    const productIsAvailable = daysAvailable
      ? !!daysAvailable[idx]
      : true
    
    const isPickup = pickupRouteNicks.includes(routeNick)
    const routeIsAvailable = RouteSched.includes(ddbRouteSchedMap[day])

    // const locationIsOpenDuringRoute = productIsAvailable && routeIsAvailable
    //   ? routeStart <= latestFinalDeliv && latestFirstDeliv <= routeEnd
    //   : null
    const locationIsOpenDuringRoute = routeStart < latestFinalDeliv 
      && latestFirstDeliv < routeEnd


    // const needTransfer = locationIsOpenDuringRoute
    //   ? !bakedWhere.includes(RouteDepart)
    //   : null
    const needTransfer = !bakedWhere.includes(RouteDepart)

    let transferSummary = needTransfer ? [] : null
    if (needTransfer) for (let trRoute of transferRoutes) {
      let transferEnd = trRoute.routeStart + trRoute.routeTime

      const isAvailable = trRoute.RouteSched.includes(ddbRouteSchedMap[day])  
      const connectsHubs = bakedWhere.includes(trRoute.RouteDepart)
        && trRoute.RouteArrive === RouteDepart

      const productReadyBeforeTransfer = readyTime < trRoute.routeStart

      const transferConnectsBeforeRoute = !isPickup // (i.e. for deliveries)
        ? transferEnd < routeStart
        : null
      const transferConnectsDuringRoute = isPickup
        ? transferEnd < routeEnd
        : null


      const onTime = productReadyBeforeTransfer
        && (
          transferConnectsBeforeRoute || transferConnectsDuringRoute
        )

      if (isAvailable && connectsHubs) transferSummary.push({
        routeNick: trRoute.routeNick,
        isLate: !onTime,
        productReadyBeforeTransfer,
        transferConnectsDuringRoute,
        transferConnectsBeforeRoute,
      })
    }

    // Test for deliveries:
    const productReadyBeforeRoute =
      (productIsAvailable && routeIsAvailable && !needTransfer && !isPickup)
        ? product.readyTime < routeStart 
        : null
    // Test for pickup options:
    const productReadyDuringRoute =
      (productIsAvailable && routeIsAvailable && !needTransfer && isPickup)
        ? product.readyTime < routeEnd 
        : null


    const lateTransferFlag = needTransfer && transferSummary.length
      ? transferSummary.every(trRoute => trRoute.isLate)
      : null

    const isValid = routeIsAvailable && locationIsOpenDuringRoute 
      && (
        needTransfer 
          ? transferSummary.some(trRoute => !trRoute.isLate)
          : (productReadyBeforeRoute || productReadyDuringRoute)
      )

    return ({
      dayNum: idx,
      dayOfWeek: day,
      prodNick: product.prodNick,
      isValid,
      productIsAvailable,
      routeIsAvailable,
      locationIsOpenDuringRoute,
      needTransfer,
      lateTransferFlag,
      transferSummary,
      productReadyBeforeRoute,
      productReadyDuringRoute,
      routeNick,
      route: {
        routeStart,
        routeEnd,
        RouteDepart: route.RouteDepart,
        routeArrive: route.RouteArrive,
        RouteSched: JSON.stringify(RouteSched),
      },
      specialOverrides: {
        product: productOverrides
      }
    })
  }) // end routeSummary

  return routeSummary

}

const adjustSummaries = (routeSummaries, product) => {
  const { daysAvailable } = product
  // console.log(product.prodNick, routeSummaries)
 
  let adjustedRouteSummaries = []
  for (let i = 0; i < 7; i++) {
    const summaryWeekdayGroup = routeSummaries[i]

    let adjustedWeekdayGroup = []
    for (let summary of summaryWeekdayGroup) {
      const yesterdaySummaryGroup = routeSummaries[(i + 6) % 7]

      const shouldUseStrictTest = !summary.productIsAvailable

      const allowDelayedDelivery = shouldUseStrictTest
        ? !summary.isValid
            && summary.routeIsAvailable
            && summary.locationIsOpenDuringRoute
            && yesterdaySummaryGroup.every(yesterdaySummary => 
              !yesterdaySummary.isValid
              && yesterdaySummary.productIsAvailable
            )
        : !summary.isValid
            && summary.routeIsAvailable
            && summary.locationIsOpenDuringRoute
            && (daysAvailable?.[(i + 6) % 7] ?? true)

      const adjustedIsValid = summary.isValid || allowDelayedDelivery 
      const adjustedLeadTime = allowDelayedDelivery
        ? product.leadTime + 1
        : product.leadTime

      
      const adjustedDaysAvailable = daysAvailable 
        ? allowDelayedDelivery && shouldUseStrictTest
          ? daysAvailable.slice(7 - 1, 7).concat(daysAvailable.slice(0, 7 - 1))
          : daysAvailable
        : [1, 1, 1, 1, 1, 1, 1]
      
      adjustedWeekdayGroup.push({
        ...cloneDeep(summary),
        isValid: adjustedIsValid,
        //routeNick: adjustedIsValid ? summary.routeNick : 'NOT ASSIGNED',
        allowDelayedDelivery,
        adjustedLeadTime,
        adjustedDaysAvailable,
        baseIsAvailable: summary.productIsAvailable
      })

    }

    adjustedRouteSummaries.push(adjustedWeekdayGroup)

  }

  return adjustedRouteSummaries

}