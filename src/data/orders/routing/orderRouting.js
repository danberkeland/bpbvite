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

import { useListData } from "../../_listData"
import { useCallback } from "react"
import { Period } from "./period.mjs"
import { flow } from "lodash/fp"


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



const weekdaysEEE = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const legacyWeekdays = ['1', '2', '3', '4', '5', '6', '7']
const weekdays = [0, 1, 2, 3, 4, 5, 6] // JS Date format

/**
 * @typedef {Object} Result 
 * @property {Object} tests
 * @property {Array} errors
 */

// Boost up a regular boolean test function to one that takes/returns a 'result'
const applyTest = (test, errorMsg) => {

  /**
   * @param {Result} resultObj 
   * @returns {Result}
   */
  const wrappedTestFn = (resultObj) => {
    const { tests, errors } = resultObj

    const testName = Object.keys({test})[0]
    const testValue = typeof test === 'function' ? !!test() : !!test

    return {
      tests: Object.assign(tests, { [testName]: testValue }),
      errors: testValue ? [...errors] : errors.concat(errorMsg)
    }
  }

  return wrappedTestFn

}




/**
 * Very much an in-house solution, streamlined for our exact setup.
 * For future, we may want to use a full graph traversal.
 */
function getFulfillmentPath(route, bakedWhere, RTE) {
  
  // Very much a rule just for our current setup. We have no rule/strategy 
  // in place for scenarios involving more than 2 bake locations.
  const actualBakedWhere = bakedWhere.includes(route.RouteDepart)
    ? route.RouteDepart
    : bakedWhere[0] 

  const needsTransfer = actualBakedWhere !== route.RouteDepart
  const transferRoute = needsTransfer
    ? RTE.find(R => 
        R.RouteDepart === actualBakedWhere 
        && R.routeArrive === route.RouteDepart
      )
    : undefined

  if (needsTransfer && transferRoute === undefined) return []
  if (needsTransfer) return [transferRoute.routeNick, route.routeNick]
  return [route.routeNick]
}

const _getRouteOptions = ({ product, location, RTE, ZRT }) => { 

  // routes that can move products from one shop/hub to another
  const transferRoutes = RTE.filter(R => R.RouteDepart !== R.RouteArrive)
  
  const { zoneNick, latestFirstDeliv, latestFinalDeliv } = location
  const { bakedWhere, daysAvailable, readyTime } = product
  
  const validDropoffPeriod = new Period(latestFirstDeliv, latestFinalDeliv)



  // We take a 'test all the things' approach so that we can always return a
  // summary that easily/reliably tells us *why* a route fails to be valid.
  // If we would rather not test some routes, we should control the list passed
  // to the function.
  const summaryByRouteByWeekday = RTE.map(route => {

    const { RouteSched, RouteDepart, RouteArrive, routeStart, routeTime } = route
    const delivPeriod = new Period(routeStart, routeStart + routeTime)
    const _RouteSched = legacyWeekdays.map(weekday => 
      RouteSched.includes(weekday)  
    )

    // Things that don't depend on the day/date:
    const routeServesZone = ZRT.some(zr => 
      zr.zoneNick === location.zoneNick && zr.routeNick === route.routeNick  
    )
    const locationIsAvailable = delivPeriod.intersects(validDropoffPeriod)
      || delivPeriod.joins(validDropoffPeriod)
    
    const routeResult = flow(
      applyTest(routeServesZone, 'zone not served'),
      applyTest(locationIsAvailable, 'location not available'),
    )({ tests: {}, errors: [] })

    // returns a list of routes that 'spatially' connect a product from where
    // it's baked to the target zone. Further checks are required to 
    // test if valid under timing constraints.
    const fulfillmentPath = getFulfillmentPath(route, bakedWhere, RTE)


    // Test by weekday
    const summaryByWeekday = weekdays.map(weekdayNum => {
      const routeIsScheduled = _RouteSched[weekdayNum]
      const productIsReady = readyTime < delivPeriod.min

      const weekdayResult = flow(
        applyTest(
          routeIsScheduled, 
          `route not available ${weekdaysEEE[weekdayNum]}`
        ),
        
      )(routeResult)




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


/**
 * Find valid paths that spatially connect a baked product to the target
 * zoneNick. We avoid hub-to-hub movements ('transfer') whenever baking at
 * a certain hub makes that possible.
 * 
 * For future, if we want to consider ALL possibilites, we can enumerate those
 * sub-optimal paths as well.
 * 
 * Also for future, if our logistics setup becomes more complicated, we may
 * want to swap this logic for a full-on graph traversal algorithm.
 */
const enumeratePaths = (zoneNick, bakedWhere, RTE, ZRT) => {
  
  const transferRoutes = RTE.filter(R => 
    R.RouteDepart !== R.RouteArrive
  )
  const routesToTest = RTE.filter(R => ZRT.some(zr => 
    zr.routeNick === R.routeNick 
    && zr.zoneNick === zoneNick
  ))

  const paths = routesToTest.map(route => {

    // Idiosyncratic buisness logic that works because there are only
    // 2 bake locations
    const assignedBakedWhere = bakedWhere.includes(route.RouteDepart)
      ? route.RouteDepart
      : bakedWhere[0]

    const needsTransfer = assignedBakedWhere !== route.RouteDepart

    // yet more idiosyncratic buisness logic that works because there is always
    // exactly 1 transfer route that can (spatially) complete the path
    const transferRoute = needsTransfer
      ? [transferRoutes.find(R => R.routeArrive === route.routeDepart)]
      : []

    return transferRoute.concat(route)
  })
  
  return paths
}

// path traversal can be thought of as a sequence of events,
//   ex: 
//     * The product is ready, 
//     * The product is transferred to another hub,
//     * The product goes out on its final route
//
// modeling as an array of events will naturally extend backwards in time
// to describe production tasks that lead up to the final bake.
// These event sequences have the same structure every day of the week, but
// may get flagged as invalid on later tests if thee product or route isn't 
// available on a particular day.
const getFulfillmentEvents = (paths, readyTime) => {

  // model the readyTime as the end of a 1 hr (baking) task period.
  // For future we may want to model the bake process as a task with duration.
  const E0 = {
    name: "product ready",
    time: new Period(readyTime - 1, readyTime),
    bakeRelDate: 0
  }

  const eventSequences = paths.map(path => {
    
    const pathEventSequence = path.map(route => ({
      name: route.RouteDepart !== route.RouteArrive ? 'transfer' : 'deliver',
      time: new Period(route.routeStart, route.routeStart + route.routeTime)
    }))
    const events = [E0].concat(pathEventSequence)

    return events.map((event, idx, self) => {
      if (idx === 0) return event

      const prevEvent = self[idx - 1]
      const bakeRelDate = 
        prevEvent.time.before(event.time) || prevEvent.time.meets(event.time)
          ? prevEvent.bakeRelDate
          : prevEvent.bakeRelDate + 1

      return { ...event, bakeRelDate }
    })

  })

  return eventSequences

}


const getAllRouteOptions = (location, product, RTE, ZRT) => {
  const { zoneNick, latestFirstDeliv, latestFinalDeliv } = location
  const { bakedWhere, daysAvailable, readyTime } = product

  const pathsToTest = enumeratePaths(zoneNick, bakedWhere, RTE, ZRT)

  const pathEventSequences = getFulfillmentEvents(pathsToTest, readyTime)

  const 


}