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
 * we mark the route as valid for every day the route runs, otehrwise we mark the route as invalid
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
  let routeEnd = Number(routeStart) + Number(routeTime)


  let validTransitRoutes = []
  for (let transit of transitRoutes) {
    let transitEnd = Number(transit.routeStart) + Number(transit.routeTime)

    let transitRouteIsValid = 
      bakedWhere.includes(transit.RouteDepart)
      && transit.RouteArrive === RouteDepart
      && (
        transitEnd < Number(routeStart) 
        || transitEnd > latestFinalDeliv // does this have something to do with orders rolling over to the next day?
      )

    if (transitRouteIsValid) validTransitRoutes.push(transit.routeNick)
  }
  
  let needTransit = !(bakedWhere.includes("Mixed") || bakedWhere.includes(RouteDepart))
  let productCanBeInPlace = bakedWhere.includes("Mixed") 
    || bakedWhere.includes(RouteDepart)
    || (!!validTransitRoutes.length)

  let productReadyBeforeRouteStarts = readyTime < routeStart
    || readyTime > latestFinalDeliv

  let customerIsOpen = latestFirstDeliv < routeEnd

  const routeIsValid = productCanBeInPlace
    && productReadyBeforeRouteStarts
    && customerIsOpen

  
  const routeSummary =  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => {
    return ({
      dayOfWeek: day,
      isValid: routeIsValid && RouteSched.includes(ddbRouteSchedMap[day]),
      needTransit: needTransit,
      transitRoutes: transitRoutes
    })
  })

  return routeSummary
}

/**
 * Produces a dictionary for available/valid route lookup.
 * 
 * Usage: Lookup with key \`${locNick}#${prodNick}#${dayOfWeek}\`
 * 
 * Result: An array of valid routeNicks ordered by start time. 
 * 
 * We need the routeDict to contain all routes for the routeMatrix to work correctly.
 * locations and products may be partial lists as long as they are in the same format (keyed on their ---Nick primary key).
 * This allows us to build a route matrix in more specific contexts, e.g. for a single location on the ordering page.
 * locations are modified client-side with a zoneRoute attribute containing an array of routeNicks that serve the location's zone.
 * 
 * This function iterates over the different applicable combinations of location/product/route. 
 * The core testing logic which determines validity is housed in the function 'testRoute'.
 * 
 * @param {Object} locationDict - List of location objects keyed on locNick
 * @param {Object} productDict - List of product objects keyed on prodNick
 * @param {Object} routeDict - Complete list of route objects keyed on routeNick
 */
export const buildRouteMatrix = (locationDict, productDict, routeDict) => {
  const locationList = Object.keys(locationDict)
  const productList = Object.keys(productDict)
  const transitRoutes = Object.values(routeDict).filter(r => r.RouteDepart !== r.RouteArrive)

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
          routeMatrix[key] = prevItem ? prevItem.concat([routeNick]) : [routeNick]
        }

      }
    }
  }

  return routeMatrix
}