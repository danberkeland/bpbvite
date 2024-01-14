// module to house route assignment logic

import { flow, groupBy, keyBy, mapValues, sortBy } from "lodash/fp"
import { useRoutingData } from "./hooks"

import { RoutingLocation, _RoutingLocation, RoutingProduct, _RoutingProduct, RoutingRoute, _RoutingRoute, ZoneRoute } from "./types.d.js"
import { useMemo } from "react"
import { HOLIDAYS } from "../../constants/constants.js"



const modulo = (n, m) => ((n % m) + m) % m

// const reversedFrom = (array, position) => {
//   const P = modulo(position + 1, array.length)
//   return [...array.slice(P), ...array.slice(0, P)].reverse()
// }

// /**
//  * Takes at least one step back from the initial index. Error (no valid day found)
//  * is signaled when the second return value (nDaysBefore) is 0.
//  * @param {boolean[]} scheduleArray 
//  * @param {number} fromWeekdayIdx 
//  * @returns {[number, number]} [(previous weekday), (# days before start day)]
//  */
// const backSchedule = (scheduleArray, fromWeekdayIdx) => {
//   const nDaysBefore = reversedFrom(scheduleArray, fromWeekdayIdx).indexOf(true) + 1
//   const prevWeekday = modulo(fromWeekdayIdx - nDaysBefore, scheduleArray.length)
//   return [prevWeekday, nDaysBefore]
// }



// Assumes intervals are closed on both ends, '[ , ]' - style.
// Better setup would be to use half open, '[ , )' - style intervals, but
// this matches prior logic more cleanly.

const intervalContainsPoint = (I, point) => I[0] <= point && point <= I[1]
const intervalsIntersect = (I1, I2) => 
  intervalContainsPoint(I1, I2[0])
  || intervalContainsPoint(I2, I1[0])


const ifValidDo = (testFn, ...args) => {
  return (result) => result.error
    ? result
    : { ...result, ...testFn(...args) }
}

const routingErrorMsgs = {
  1: "route does not serve zone",
  2: "location not available during delivery",
  3: "transfer route not found",
  4: "could not schedule transfer in time",
  5: "could not schedule product in time",
  6: "route not scheduled on weekday",
  7: "closed for holiday",
}

const testDay = (route, weekday, delivDate) => {
  const weekdayError = route.validDays[weekday] ? null : 6
  const holidayError = !HOLIDAYS.includes(delivDate) ? null : 7
  const error = weekdayError || holidayError || null
  
  return { error }
}

const testZone = (route, location) => {
  const isValid = route.zonesServed.includes(location.zoneNick)
  return { error: isValid ? null : 1 }
}

const testTimePeriod = (route, location) => {
  const isValid = intervalsIntersect(
    [route.timeStart, route.timeFinis],
    [location.delivTimeStart, location.delivTimeFinis]
  )

  return { error: isValid ? null : 2 }
}

/**
 * 
 * @param {_RoutingRoute} route 
 * @param {_RoutingProduct} product 
 * @param {number} weekday
 * @param {_RoutingRoute[]} transferRoutes 
 */
const getFulfillmentPlan = (route, product, weekday, transferRoutes) => {
  const fulfillEvent = { 
    ...route, 
    name: "fulfillment",
    isValid: true,
    weekday, 
    dateOffset: 0
  }

  const bakeHub = product.bakedWhere.includes(route.hubStart)
    ? route.hubStart
    : product.bakedWhere[0]

  const needsTransfer = bakeHub !== route.hubFinis
  const transferRoute = needsTransfer 
    ? transferRoutes.find(tR =>
        tR.hubStart === bakeHub && tR.hubFinis === route.hubFinis
      )
    : null

  if (transferRoute === undefined) { // couldn't make connection
    const fulfillmentPlan = [
      { 
        routeNick: 'NOT ASSIGNED', 
        timeStart: 0,
        timeFinis: 0,
        validDays: [false, false, false, false, false, false, false],
        hubStart: bakeHub,
        hubFinis: route.hubStart,
        zonesServed: [],
        name: "transfer",
        isValid: false, 
        weekday,
        dateOffset: 0,
      },
      { ...fulfillEvent }
    ]

    return { error: 3, fulfillmentPlan }
  }

  if (transferRoute === null) { // no transfer needed
    return { fulfillmentPlan: [{ ...fulfillEvent }] }

  }

  // need to schedule/validate transfer
  const canScheduleSameDay = transferRoute.validDays[fulfillEvent.weekday] === true
    && transferRoute.timeFinis < route.timeStart

  const canSchedulePreviousDay = 
    transferRoute.validDays[modulo(fulfillEvent.weekday - 1, 7)] === true

  const daysBeforeNextStep = canScheduleSameDay ? 0
    : canSchedulePreviousDay ? 1
    : 0

  const fulfillmentPlan = [
    { 
      ...transferRoute, 
      name: "transfer",
      isValid: canScheduleSameDay || canSchedulePreviousDay, 
      weekday: modulo(fulfillEvent.weekday - daysBeforeNextStep, 7),
      dateOffset: fulfillEvent.dateOffset - daysBeforeNextStep
    },
    { ...fulfillEvent }
  ]

  return { 
    error: fulfillmentPlan[0].isValid ? null : 4,
    fulfillmentPlan
  }


}

const getProductionPlan = (product, fulfillmentPlan) => {
  //console.log("fulfillmentPlan", fulfillmentPlan)
  if (!fulfillmentPlan.length) return { error: "no fulfillment plan" }
  const canScheduleSameDay = product.validDays[fulfillmentPlan[0].weekday] 
    && product.readyTime < fulfillmentPlan[0].timeStart

  const canSchedulePreviousDay = 
    product.validDays[modulo(fulfillmentPlan[0].weekday - 1, 7)] === true

  const daysBeforeNextStep = canScheduleSameDay ? 0
    : canSchedulePreviousDay ? 1
    : 0

  const productionPlan = [{
    ...product,
    name: "finished",
    isValid: canScheduleSameDay || canSchedulePreviousDay,
    weekday: modulo(fulfillmentPlan[0].weekday - daysBeforeNextStep, 7),
    dateOffset: fulfillmentPlan[0].dateOffset - daysBeforeNextStep
  }]
  
  

  return {
    error: productionPlan[0].isValid ? null : 5,
    fulfillmentLeadTime: productionPlan[0].dateOffset * -1,
    productionPlan
  }
}


/**
 * Main Routing Logic: "Decides" what the production/fulfillment plan should be,
 * and validates the plan
 * @param {Object} input
 * @param {_RoutingLocation} input.location 
 * @param {_RoutingProduct} input.product
 * @param {_RoutingRoute} input.route
 * @param {number} input.weekday
 * @param {string|null} input.delivDate
 * @param {_RoutingRoute[]} input.transferRoutes
 */
const getRouteSummary = ({
  location,
  product,
  route,
  weekday,
  delivDate=null,
  transferRoutes
}) => {

  const initialResult = {
    routeNick: route.routeNick,
    error: null,
    fulfillmentLeadTime: 0,
    productionPlan: [],
    fulfillmentPlan: [],
  }

  const finalSummary = flow(
    ifValidDo(testDay, route, weekday, delivDate),
    ifValidDo(testZone, route, location),
    ifValidDo(testTimePeriod, route, location),
    ifValidDo(getFulfillmentPlan, route, product, weekday, transferRoutes),
    result => ifValidDo(getProductionPlan, product, result.fulfillmentPlan)(result)
  )(initialResult)

  return finalSummary
}



/**
 * One of the main logic units for route assignment. Returns valid fulfillment
 * plans, plus a final production event (baking), along with date info to aid
 * work orchestration.
 * @param {Object} input
 * @param {_RoutingLocation} input.location 
 * @param {_RoutingProduct} input.product
 * @param {number} input.weekday
 * @param {string|null} input.delivDate
 * @param {_RoutingRoute[]} input.routes
 */
export const getRouteOptions = ({
  location,
  product,
  weekday,
  delivDate,
  routes,
}) => {

  const transferRoutes = routes.filter(route => route.hubStart !== route.hubFinis)
  const delivRoutes = routes.filter(route => !route.routeNick.includes("Pick up"))
  const pickupRoutes = routes.filter(route => route.routeNick.includes("Pick up"))

  const delivSummaries = delivRoutes.map(route => getRouteSummary({
    location, product, route, weekday, delivDate, transferRoutes
  }))

  const pickupSummaries = pickupRoutes.map(route => getRouteSummary({
    location: { 
      locNick: route.zonesServed[0],
      zoneNick: route.zonesServed[0],
      delivTimeStart: 7,
      delivTimeFinis: 11,
    },
    product,
    route,
    weekday,
    delivDate,
    transferRoutes
  }))

  return {
    deliv: sortBy([
      summary => summary.error === null ? 0 : 1, 
      summary => summary.productionPlan.at(0).dateOffset * -1,
      summary => summary.fulfillmentPlan.at(-1).timeStart
    ])(delivSummaries.filter(summary => summary.error === null)),
    ...keyBy('routeNick')(pickupSummaries)
  }

}




/**
 * Returns a function tailored for the input locNick, with specific location
 * data, plus product & route data pre-bound. The returned function produces
 * produciton/fulfillment options for the location given an input product
 * and weekday number.
 */
export const useGetRouteOptionsByLocation = (locNick) => {
  const location = useRoutingData.location({ locNick })
  const products = useRoutingData.products()
  const routes = useRoutingData.routes()

  const buildFunction = () => {
    if (location && products && routes) {

      console.log(location, products, routes)
      return (prodNick, weekday, delivDate) => {
        const product = products.find(P => P.prodNick === prodNick)

        if (!product) return undefined
        else return getRouteOptions({
          location, 
          product, 
          weekday, 
          delivDate,
          routes
        })

      }

    }

  }

  return useMemo(buildFunction, [locNick, location, products, routes])
  

}