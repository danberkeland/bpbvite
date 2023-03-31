// Functions to help assign routes to order items.
//
// most of our orders are fulfilled by delivery.
// To make this happen, we need to decide which 
// delivery route an order will be packed onto.
// This route is a value derived from properties
// of the location, product, day of the week, and
// the route itself.  
//
// In fact, it may be possible to assign more than
// one route to an order -- we default to choosing
// the route that starts earliest.
//
// with some added logic we can even split a customer's
// order items along multiple delivery routes, if
// multiple exist.
//
// Our strategy for managing this calculation is to build & cache a 
// 'route matrix' derived from location, product, route, and zoneRoute data.
// We call this supporting data logisticsDimensionData and manage fetching 
// and caching it with the SWR hook 'useLogisticsDimensionData'.
//
// We do the work to build this up front so that we avoid making the same 
// calculation multiple times, and make subsequent on-the-fly assignments 
// cheap. See function 'buildRouteMatrix'.
//
// Depending on our needs we can build this matrix for a limited dataset,
// e.g. for only one location.
//
// While the matrix holds the core logic for route calculations, some
// overrides or exceptions to those rules may take place beside it.
// the function 'assignDelivRoute' applies those exceptions first, then
// falls back to the default matrix logic if exceptions are not applicable.
//
// Our workflow for deciding which route to apply to a given order item is:
// 1. construct a suitable routeMatrix
//    useLogisticsDimensionData returns this matrix
//    in addition to the data itself.
//
// 2. Compile a list of car/standing orders to add routes to.
//
// 3. Call assignDelivRoute on each order along with other parameters 
//    described by the function.
//      The function will add a routeNick attribute to each order item.



/**
 * Applies Override/Exception rules first, then falls back to standard routeMatrix calculations.
 * 
 * @param {Object} order - Order object containing locNick, prodNick, and route = 'deliv' || 'slopick' || 'atownpick'
 * @param {String} locationZoneNick - zoneNick of the location object associated with the orders locNick
 * @param {String} dayOfWeek - for efficiency we expect dayOfWeek to be tracked outside this function. This way it does not need to be computed for cart orders.
 * @param {Object} routeMatrix - memoized route calculations built from the function 'buildRouteMatrix'. Make sure the matrix has the location/prodNick from the order included!
 * @returns 
 */
export const assignDelivRoute = ({ order, locationZoneNick, dayOfWeek, routeMatrix }) => {
  const { locNick, prodNick, route:fulfillmentOption } = order

  return ({
    ...order,
    routeNick: (calculateValidRoutes(locNick, prodNick, fulfillmentOption, locationZoneNick, dayOfWeek, routeMatrix))[0]
  })
}


/**
 * Returns an array of valid routes. Return type is always an array.
 *
 * Returns the array ["NOT ASSIGNED"] if no routes are found.
 */
export const calculateValidRoutes = (locNick, prodNick, fulfillmentOption, locationZoneNick, dayOfWeek, routeMatrix) => {
  let zoneNick = locationZoneNick
  if (!locNick || !prodNick || !fulfillmentOption || !zoneNick) return [null]

  let validRoutes = ''
  
  // ***EXCEPTIONS & OVERRIDES***
  if (locNick === 'lincoln' && (prodNick === 'fr' || prodNick === 'dtch')) {
    validRoutes = ["Lunch"]
  }

  if (zoneNick === 'slopick' || zoneNick === 'Prado Retail') validRoutes = ["Pick up SLO"]
  if (zoneNick === 'atownpick' || zoneNick === "Carlton Retail") validRoutes = ["Pick up Carlton"]
  if (fulfillmentOption === 'slopick' || fulfillmentOption === 'Prado Retail') validRoutes = ["Pick up SLO"]
  if (fulfillmentOption === 'atownpick' || fulfillmentOption === 'Carlton Retail') validRoutes = ["Pick up Carlton"]

  if (!validRoutes) {
    let key = `${locNick}#${prodNick}#${dayOfWeek}`
    validRoutes = routeMatrix[key] || ["NOT ASSIGNED"]
  }

  return validRoutes
}