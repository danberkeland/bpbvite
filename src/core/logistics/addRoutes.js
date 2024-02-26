import { DateTime } from "luxon"
import { compareBy } from "../../utils/collectionFns/compareBy"

const PRETZEL_EXCEPTIONS = Object.freeze([
  "Pretzel", 
  "Unsalted Pretzel"
])

// legacy spec for weekday numbers:
//    Sun - Sat corresponds to ["1", "2", "3", "4", "5", "6", "7"] (strings)
// => Mon - Sun corresponds to ["2", "3", "4", "5", "6", "7", "1"]

// Luxon spec for weekday numbers:
//    Mon - Sun corresponds to [ 1,   2,   3,   4,   5,   6,   7 ] (numbers)

const calcDayNum = (delivDate) => {
  const weekdayNum = DateTime.fromFormat(
    delivDate, 
    'yyyy-MM-dd', 
    { zone: "America/Los_Angeles" }
  ).weekday
  return ((weekdayNum % 7) + 1).toString()
}

const routeRunsThatDay = (testRoute, delivDate) => 
  testRoute.RouteSched.includes(calcDayNum(delivDate))

const productCanBeInPlace = (order, routes, testRoute, customer) => 0
  || order.where.includes("Mixed") 
  || order.where.includes(testRoute.RouteDepart)
  || (
    // "productCanMakeIt" -- i.e. a valid connecting route exists
    routes.some(linkRoute => 1 
      && order.where.includes(linkRoute.RouteDepart)  
      && linkRoute.RouteArrive === testRoute.RouteDepart
      && (0
        || (linkRoute.routeStart + linkRoute.routeTime) < testRoute.routeStart
        || (linkRoute.routeStart + linkRoute.routeTime) > customer.latestFinalDeliv
      )
    )
  )

const productReadyBeforeRouteStarts = (product, testRoute, customer) => 0
  || product.readyTime < testRoute.routeStart 
  || product.readyTime > customer.latestFinalDeliv
  || PRETZEL_EXCEPTIONS.includes(product.prodName)

const customerIsOpen = (testRoute, customer) => 
  customer.latestFirstDeliv < (testRoute.routeStart + testRoute.routeTime)


/**
 * Order items need extra props added to them; intended to be used at the end
 * of a transformation pipeline, e.g. the function "getOrdersList"
 * @param {string} delivDate 
 * @param {Object[]} orderList
 * @param {Object[]} database - full legacy database. Only uses Product, Customers, and Route tables
 * @returns {Object[]}
 */
export const addRoutes2 = (delivDate, orderList, database) => {

  const [products, customers, _routes] = database
  const orders = [...orderList]
  const sortedRoutes = [..._routes].sort(compareBy(R => R.routeStart, "desc"))

  for (let testRoute of sortedRoutes) {
    for (let order of orders) {

      const customer = customers.find(C => C.custName === order.custName)
      const product  =  products.find(P => P.prodName === order.prodName)
      
      if (!testRoute.RouteServe.includes(order.zone)) continue
      if (1
        && routeRunsThatDay(testRoute, delivDate)
        && productCanBeInPlace(order, sortedRoutes, testRoute, customer)
        && productReadyBeforeRouteStarts(product, testRoute, customer)
        && customerIsOpen(testRoute, customer)
      ) {
        order.route       = testRoute.routeName
        order.routeDepart = testRoute.RouteDepart
        order.routeStart  = testRoute.routeStart
        order.routeServe  = testRoute.RouteServe
        order.driver      = testRoute.driver
      }

      // Lincoln Market French exception
      if (
        order.custName === "Lincoln Market"
        && ["French Stick", "Dutch Stick"].includes(order.prodName)
      ){
        order.route       = "Lunch"
        order.routeDepart = "Prado"
        order.routeStart  = 9.5
        order.routeServe  = ['Downtown SLO', 'Foothill']
        order.driver      = "Long Driver"
      }
    }

  }

  // maps zone to route
  for (let order of orders) {
    if (["slopick", "Prado Retail"].includes(order.zone)) {
      order.route = "Pick up SLO"
    }
    if (["atownpick", "Carlton Retail"].includes(order.zone)){
      order.route = "Pick up Carlton"
    }
    if (order.zone === "deliv") {
      order.route === "NOT ASSIGNED"
    }
  }

  return orders
}
