import { sortBy } from "lodash"

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
 * Test if the given route is Valid for delivering the given product to the given location.
 * 
 * Big assumption: Timing info for delivery route/location availability/product availability
 * Is constant throughout the week, EXCEPT for days where a route doesn't run.  We can imagine
 * changing this model to allow customer availability to vary by day, or to allow product
 * timing/availability to vary by day.
 *  
 * We look at the assumed static location/product/route parameters and see if that works. If it does
 * we mark the route as valid for every day the route runs, otherwise we mark the route as invalid
 * for all days of the week.
 * 
 * @param {Object} location 
 * @param {Object} product 
 * @param {Object} route 
 * @param {Array} transitRoutes 
 */
const testRoute = (route, product, location, transitRoutes) => {
  let { latestFirstDeliv, latestFinalDeliv } = location
  let { readyTime, bakedWhere } = product
  let { routeStart, routeTime, RouteDepart, RouteSched } = route

  // *** Change: We can verify that attributes from new data sources are not
  //     converted to strings, so coercing with 'Number()' isn't necessary.
  // let routeEnd = Number(routeStart) + Number(routeTime)
  let routeEnd = routeStart + routeTime

  let validTransitRoutes = []
  for (let transit of transitRoutes) {
    // *** Change: removing 'Number()'
    // let transitEnd = Number(transit.routeStart) + Number(transit.routeTime)
    let transitEnd = transit.routeStart + transit.routeTime


    let transitRouteIsValid = 
      bakedWhere.includes(transit.RouteDepart)
      && transit.RouteArrive === RouteDepart
      && (
        // *** Change: removing 'Number()'
        //transitEnd < Number(routeStart) 
        transitEnd < routeStart
        || transitEnd > latestFinalDeliv // does this have something to do with orders rolling over to the next day?
      )

    if (transitRouteIsValid) validTransitRoutes.push(transit.routeNick)
  }
  

  // *** Change: 
  // bakedWhere now lists all individual locations instead of using "Mixed".
  // let needTransit = !( 
  //   bakedWhere.includes("Mixed") 
  //   || bakedWhere.includes(RouteDepart) 
  // )
  let needTransit = !bakedWhere.includes(RouteDepart)

  // * Change: reuse logic for readability
  // let productCanBeInPlace = bakedWhere.includes("Mixed") 
  //   || bakedWhere.includes(RouteDepart)
  //   || (!!validTransitRoutes.length)
  let productCanBeInPlace = !needTransit || !!validTransitRoutes.length

  let productReadyBeforeRouteStarts = readyTime < routeStart
    || readyTime > latestFinalDeliv

    let customerIsOpen = latestFirstDeliv < routeEnd
  // *** Pending Change: extra condition to weed out late routes. The delivery
  //     window should overlap with the customer's avavilability window.
  // let customerIsOpen = latestFirstDeliv < routeEnd || routeStart < latestFinalDeliv
  

  const routeIsValid = productCanBeInPlace
    && productReadyBeforeRouteStarts
    && customerIsOpen

  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => ({
      dayOfWeek: day,
      isValid: routeIsValid && RouteSched.includes(ddbRouteSchedMap[day]),
      needTransit: needTransit,
      transitRoutes: transitRoutes
    }))

}

/**
 * Produces a dictionary for available/valid route lookup.
 * 
 * Usage: Lookup with key \`${locNick}#${prodNick}#${dayOfWeek}\`
 * 
 * Result: An array of valid routeNicks ordered by start time. 
 * 
 * We need the routeDict to contain all routes for the routeMatrix to work 
 * correctly. Locations and products may be partial lists as long as they are 
 * in the same format (keyed on their ---Nick primary key). This allows us to 
 * build a route matrix in more specific contexts, e.g. for a single location 
 * on the ordering page. Locations are modified client-side with a zoneRoute 
 * attribute containing an array of routeNicks that serve the location's zone.
 * 
 * This function iterates over the different applicable combinations of 
 * location/product/route. The core testing logic which determines validity is 
 * housed in the function 'testRoute'.
 * 
 * @param {Object} locationDict - List of location objects keyed on locNick
 * @param {Object} productDict - List of product objects keyed on prodNick
 * @param {Object} routeDict - Complete list of route objects keyed on routeNick
 */
export const buildRouteMatrix = (locationDict, productDict, routeDict) => {
  const locationList = Object.keys(locationDict)
  const productList = Object.keys(productDict)
  const transitRoutes = Object.values(routeDict).filter(r => 
    r.RouteDepart !== r.RouteArrive
  )

  let routeMatrix = {}
  for (let locNick of locationList) {
    let location = locationDict[locNick]
    
    for (let prodNick of productList) {
      let product = productDict[prodNick]
      
      for (let routeNick of location.zoneRoutes) {
        let route = routeDict[routeNick]
        let routeSummary = testRoute(route, product, location, transitRoutes)

        for (let item of routeSummary) {
          if (!item.isValid) continue

          let key = `${locNick}#${prodNick}#${item.dayOfWeek}`
          let prevItem = routeMatrix[key]
          routeMatrix[key] = prevItem 
            ? prevItem.concat([routeNick]) 
            : [routeNick]
        }

      }
    }
  }

  return routeMatrix
}

// *****************************************************************************
// Testing new route assignment
// *****************************************************************************

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// the input route is assumed to be one that can serve the input location.
export const getRoutingMetadata = (route, product, location, tansferRoutes) => {
  let { latestFirstDeliv, latestFinalDeliv } = location
  let { readyTime, bakedWhere, daysAvailable } = product
  let { routeNick, routeStart, routeTime, RouteDepart, RouteSched } = route
  let routeEnd = routeStart + routeTime

  const routeSummary = weekdays.map((day, idx) => {
    const productIsAvailable = daysAvailable
      ? !!daysAvailable[idx]
      : true
    
    const routeIsAvailable = RouteSched.includes(ddbRouteSchedMap[day])

    // Old test:
    //    let customerIsOpen = latestFirstDeliv < routeEnd
    //
    // The old test allows for cases where the delivery window doesn't overlap
    // at all with the customer's availability window. Is there a reason for
    // this? Testing with more accurate logic for now -- if we get weird
    // behavior, the following should be an early candidate for debugging.
    const locationIsOpenDuringRoute = productIsAvailable && routeIsAvailable
      ? routeStart < latestFinalDeliv && latestFirstDeliv < routeEnd
      : null

    const needTransfer = locationIsOpenDuringRoute
      ? !bakedWhere.includes(RouteDepart)
      : null

    let transferSummary = needTransfer ? [] : null
    if (needTransfer) for (let trRoute of tansferRoutes) {
      let transferEnd = trRoute.routeStart + trRoute.routeTime

      const isAvailable = trRoute.RouteSched.includes(ddbRouteSchedMap[day])  
      const connectsHubs = bakedWhere.includes(trRoute.RouteDepart)
        && trRoute.RouteArrive === RouteDepart

      // passing these two conditions is equivalent to 'productCanBeInPlace'
      // for cases where transfer is required.
      const productReadyBeforeTransfer = readyTime < trRoute.routeStart
      const transferConnectsBeforeRoute = transferEnd < routeStart // scrapping the rollover test here
      const isLate = productReadyBeforeTransfer || transferConnectsBeforeRoute

      if (isAvailable && connectsHubs) transferSummary.push({
        routeNick: trRoute.routeNick,
        isLate,
        productReadyBeforeTransfer,
        transferConnectsBeforeRoute,
      })
    }

    // Original route assignment has some hacky logic that handles shelf 
    // products. The expression
    //                    readyTime > latestFinalDeliv
    // is true when readyTime is set very late. However, this assumes
    // the product can be baked and shelved the day before, and a separate
    // decision process is made ensure production steps are timed accordingly.
    // Moreover, this assumes that production for the given product happens
    // every day, so that the item can be made & shelved the previous day.
    //
    // For now the goal is to add a minimal amount of extra logic to our order
    // validation / route assignment, but a more ambitious improvement would be
    // To manage order validation, route assignment, and production coordination
    // all with the same decision-making functions. Our system will be more
    // robust if, for example, the function that says "the lead time on this
    // order is going to need one extra day" and the function that says
    // "let's schedule the bake/shape/etc..." for this item one day earlier
    // are the same function, or are reading from metadata generated by the 
    // same function.
    //
    // const productReadyBeforeRoute = (
    //   productIsAvailable && routeIsAvailable && !needTransfer
    // ) 
    //   ? product.readyTime < routeStart 
    //   : null

    const productReadyBeforeRoute = (
      productIsAvailable && routeIsAvailable && !needTransfer
    ) 
      ? readyTime < routeStart || readyTime > latestFinalDeliv
      : null

    
    const lateTransferFlag = needTransfer && transferSummary.length
      ? transferSummary.every(trRoute => trRoute.isLate)
      : null

    const isValid = locationIsOpenDuringRoute 
      && (
        needTransfer 
          ? transferSummary.some(trRoute => !trRoute.isLate)
          : !!productReadyBeforeRoute
      )

    return ({
      dayOfWeek: day,
      prodNick: product.prodNick,
      routeNick,
      isValid,
      productIsAvailable,
      routeIsAvailable,
      locationIsOpenDuringRoute,
      needTransfer,
      lateTransferFlag,
      transferSummary,
      productReadyBeforeRoute,
      route: {
        routeStart,
        routeEnd,
        RouteDepart: route.RouteDepart,
        routeArrive: route.RouteArrive,
        RouteSched: JSON.stringify(RouteSched),
      },
      product: { 
        leadTime: product.leadTime,
        readyTime, 
        bakedWhere, 
        daysAvailable,
      },
    })
  }) // end routeSummary

  const routeMetadata = routeSummary.map((summary, idx) => {
    const yesterdaySummary = routeSummary[(idx + 6) % 7]
    
    const allowDelayedDelivery = yesterdaySummary.lateTransferFlag
    const adjustedIsValid = allowDelayedDelivery || summary.isValid

    const adjustedLeadTime = allowDelayedDelivery
      ? summary.product.leadTime + 1
      : summary.product.leadTime
      // : isValid 
      //   ? summary.product.leadTime 
      //   : null

    return ({
      ...summary,
      isValid: adjustedIsValid,
      allowDelayedDelivery,
      adjustedLeadTime,
    })

  })

  return sortBy( 
    routeMetadata.filter(item => item.isValid === true),
    ['route.routeStart']
  )

}


export const buildRouteMatrix_test = (locationDict, productDict, routeDict) => {
  const transferRoutes = Object.values(routeDict).filter(r => 
    r.RouteDepart !== r.RouteArrive
  )

  let routeMatrix = {}
  for (let locNick of Object.keys(locationDict)) {
    let location = locationDict[locNick]
    
    for (let prodNick of Object.keys(productDict)) {
      let product = productDict[prodNick]
      
      for (let routeNick of location.zoneRoutes) {
        let route = routeDict[routeNick]
        let routeSummary = getRoutingMetadata(route, product, location, transferRoutes)

        for (let item of routeSummary) {
          let key = `${locNick}#${prodNick}#${item.dayOfWeek}`
          let prevItem = routeMatrix[key]
          routeMatrix[key] = prevItem 
            ? prevItem.concat([item]) 
            : [item]

        }

      }
    }
  }

  return routeMatrix
}