import { DBLocation, DBProduct, DBRoute, DBZoneRoute } from "../types.d"
import { RoutingLocation, RoutingProduct, RoutingRoute, WeekdayFlags } from "./types.d"
import { compareBy, uniqBy } from "../../utils/collectionFns"

// Casting Functions that convert database items to a format tailored to
// the routing domain. We try to use more generic/consistent attribute
// names. 

// This extra conversion step is possibly memory-inefficient, 
// but if it becomes an issue we can probably optimize our fetching pipeline
// so that we aren't caching/copying as much data around.

/** @typedef {'Sun'|'Mon'|'Tue'|'Wed'|'Thu'|'Fri'|'Sat'} WeekdayEEE */
/** @typedef {0|1|2|3|4|5|6} WeekdayNum */

const legacyWeekdays = ["1", "2", "3", "4", "5", "6", "7"]

/**@type {Object.<WeekdayEEE, WeekdayNum>} */
const _weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

/**
 * Not sure how to appease the linter when getting from the object directly
 * @param {WeekdayEEE} weekdayEEE
 * @returns {WeekdayNum} 
 */
const weekdayMap = (weekdayEEE) => _weekdayMap[weekdayEEE]

/**
 * Point-in-time event object
 * @typedef {Object} ProcessEvent
 * @property {string} place Usually points to a hub, but could be a locNick
 * @property {WeekdayNum} weekday 
 * @property {number} relDate For scheduling sequences of events/steps
 * @property {number} time 
 * @property {WeekdayFlags} validDays Helper for validating a schedule
 */
/**
 * Models things that occur over an interval of time.
 * Interval defined by a beginning event and an ending event.
 * @typedef {Object} ProcessStep
 * @property {string} name
 * @property {ProcessEvent} begin
 * @property {ProcessEvent} end
*/

/**
 * @typedef {Object} FulfillmentPlan
 * @property {string}        locNick
 * @property {string}        prodNick
 * @property {string}        routeNick
 * @property {WeekdayEEE}    finishDay
 * @property {string|null}   error
 * @property {ProcessStep[]} steps
 */


/**
 * @param {DBLocation} location 
 * @returns {RoutingLocation}
 */
const fromDBLocation = location => ({
  locNick:   location.locNick,
  zoneNick:  location.zoneNick,
  timeBegin: Math.round(location.latestFirstDeliv * 100),
  timeEnd:   Math.round(location.latestFinalDeliv * 100),
})

/**
 * @param {DBProduct} product 
 * @returns {RoutingProduct}
 */
const fromDBProduct = product => ({
  prodNick:  product.prodNick,
  bakeHub:   product.bakedWhere,
  readyTime: Math.round(product.readyTime * 100),
  validDays: (product.daysAvailable ?? [1,1,1,1,1,1,1]).map(day => !!day)
})

/**
 * @param {DBRoute} route
 * @param {DBZoneRoute[]} zoneRoutes
 * @returns {RoutingRoute}
 */
const fromDBRoute = (route, zoneRoutes) => ({
  routeNick:   route.routeNick,
  validDays:   legacyWeekdays.map(d => route.RouteSched.includes(d)),
  timeBegin:   Math.round(route.routeStart * 100),
  timeEnd:     Math.round((route.routeStart + route.routeTime) * 100),
  hubBegin:    route.RouteDepart,
  hubEnd:      route.RouteArrive,
  zonesServed: zoneRoutes.filter(zr => zr.routeNick === route.routeNick).map(zr => zr.zoneNick)
})

// ****************************************************************************

// returns a data structure that validates/schedules fulfillment steps

/**@typedef {[number, number]} Interval*/



/**
 * Test assumes the interval [num, num] corresponds to 
 * the closed interval [a, b] that include both endpoints. 
 * This is for compatibility with old code.
 * A better implementation would have [num, num] correspond to 
 * the half-open interval [a, b) that excludes the right endpoint.
 */
const intervalContainsPoint = (interval, point) =>
  interval[0] <= point && point <= interval[1]

/**
 * @param {Interval} interval1 
 * @param {Interval} interval2
 * @returns {boolean} 
 */
const intervalsOverlap = (interval1, interval2) => 
  intervalContainsPoint(interval1, interval2[0])
  || intervalContainsPoint(interval2, interval1[0])


/**
 * @param {FulfillmentPlan} rp 
 * @param {RoutingRoute} route 
 * @param {WeekdayNum} weekday 
 * @returns {FulfillmentPlan}
 */
const validateWeekday = (rp, route, weekday) => {
  const isValid = route.validDays[weekday]
  return isValid ? rp : { ...rp, error: "route not scheduled"}  
}


/**
 * For delivery, make sure the route runs while the location
 * is available to receive delivery during the route window.
 * 
 * For pickup, the location will be simulated to have an
 * availability window that agrees with any route.
 * @param {FulfillmentPlan} rp 
 * @param {RoutingRoute} route 
 * @param {RoutingLocation} location 
 * @returns {FulfillmentPlan}
 */
const validateTiming = (rp, route, location) => {
  const isValid = intervalsOverlap(
    [route.timeBegin, route.timeEnd], 
    [location.timeBegin, location.timeEnd]
  ) 
  return isValid ? rp : { ...rp, error: "location not available during route" }

}

/**
 * Make sure the route serves the location's zone.
 * @param {FulfillmentPlan} rp 
 * @param {RoutingRoute} route 
 * @param {RoutingLocation} location 
 * @returns {FulfillmentPlan}
 */
const validateZone = (rp, route, location) => {
  const isValid = route.zonesServed.includes(location.zoneNick)
  return isValid ? rp : { ...rp, error: "route does not serve zone"}
}



// src: https://algotree.org/algorithms/tree_graph_traversal/depth_first_search/all_paths_in_a_graph/

// Algorithm Find_All_Paths ( Graph g )
// 1.  Push the source node src in the path ( list ).
// 2.  DFS ( src, dest, g )

// DFS ( Source src, Destination dest, Graph g )
// 1.  If ( src == dest ) then
// 2.      A path has been found. Push the path in the list of all_the_paths ( list of list ).
// 3.  Else
// 4.     For every adjacent node adj_node that is adjacent to src do
// 5.        Push adj_node in the path.
// 6.        DFS ( adj_node, dest, g )
// 7.        Pop adj_node from the path. This is essentially a backtracking mechanism to find a different path from the source ( src ) node.

// Our version uses a graph represented by an edge list, rather than an
// adjacency list. We also prevent cycles by maintaining a list of edges
// already used.  

/**
 * Typed specifically for the routing context. 
 * I don't think it'll be used elsewhere...
 * @param {ProcessEvent} beginNode 
 * @param {ProcessEvent} endNode 
 * @param {ProcessStep[]} edges 
 * @returns {ProcessStep[][]}
 */
const enumerateDfsPaths = (beginNode, endNode, edges) => {
  /**@type {ProcessStep[][]} */
  let paths = []
  
  /**@type {ProcessStep[]} */
  let currentPath = []

  /**@type {Set<string>} */
  let edgesUsed = new Set()
  
  /**
   * @param {ProcessEvent} source 
   * @param {ProcessEvent} target 
   */
  const dfs = (source, target) => {
    if (source.place === target.place) {
      paths = paths.concat([[...currentPath]])
    }
    
    for (let edge of edges) {
      if (
        edge.begin.place === source.place
        && !edgesUsed.has(edge.name)
      ) {
        currentPath.push(edge)
        edgesUsed.add(edge.name)

        dfs(edge.end, endNode)

        currentPath.pop()
        edgesUsed.delete(edge.name)
      }
    }
  }
  
  dfs(beginNode, endNode)
  
  return paths
}

/**
 * @param {ProcessStep[]} processSteps 
 * @returns {ProcessStep[]}
 */
const backSchedule = processSteps => {
  let steps = [...processSteps]
  if (steps.length > 0) {
    steps[steps.length - 1].begin.relDate = 0
    steps[steps.length - 1].end.relDate = 0
  }
  if (steps.length > 1) {
    let weekday = steps[steps.length - 1].begin.weekday
    let relDate = 0

    for (let i = steps.length - 2; i >= 0; i--) {
      for (let j = 0; j < 7; j++) {
        // comparison is <= for backwards compatibility, but should be <
        if (
          steps[i].end.validDays[weekday] === true
          && (
            relDate < steps[i+1].begin.relDate
            || (
              (steps[i+1].name.includes("Pick up") && steps[i].end.time <= steps[i+1].end.time) // for connecting to pickup, transfer needs to complete "before or during" the pickup window
              || (!steps[i+1].name.includes("Pick up") && steps[i].end.time <= steps[i+1].begin.time) // for connecting to delivery, transfer needs to complete before delivery starts.
            )
          )
        ) {
          steps[i].begin.weekday = weekday
          steps[i].begin.relDate = relDate
          steps[i].end.weekday = weekday
          steps[i].end.relDate = relDate
          break
        } else {
          weekday = (weekday - 1 + 7) % 7
          relDate = relDate - 1
        }

      }
    }

  }

  return steps

}

/**
 * Converts data format. Weekday/relDate are initialized 
 * with 0 values, so be sure to modify them to suit your needs.
 * @param {RoutingRoute} route
 * @returns {ProcessStep} 
 */
const routeToProcessStep = route => ({
  name: route.routeNick,
  begin: {
    place:     route.hubBegin,
    weekday:   0,
    relDate:   0,
    time:      route.timeBegin, 
    validDays: route.validDays,
  },
  end: {
    place:     route.hubEnd,
    weekday:   0,
    relDate:   0,
    time:      route.timeEnd, 
    validDays: route.validDays,
  }
})

/**
 * Builds a detailed, structured description of fulfillment steps that may be
 * extended backwards to shedule production steps. route/location/product can
 * be validated by successfully building the route plan without creating errors.
 * 
 * If product attributes have location-specific overrides, 
 * they need to be applied before passing to this function.
 * @param {RoutingRoute} route 
 * @param {RoutingLocation} location 
 * @param {RoutingProduct} product 
 * @param {WeekdayEEE} dayOfWeek 
 * @param {RoutingRoute[]} transferRoutes 
 */
const buildRoutePlan = (route, location, product, dayOfWeek, transferRoutes) => {
  const weekday = weekdayMap(dayOfWeek)

  const decidedBakeHub = product.bakeHub.includes(route.hubBegin)
    ? route.hubBegin
    : product.bakeHub[0]

  /**@type {ProcessStep} */
  const prdCompleteStep = {
    name: "prd_completed",
    begin: {
      place:     decidedBakeHub,
      weekday:   0, // to be determined
      relDate:   0, // to be determined
      time:      0, // dummy value; not used
      validDays: product.validDays,
    },
    end: {
      place:     decidedBakeHub,
      weekday:   0, // to be determined
      relDate:   0, // to be determined
      time:   product.readyTime,
      validDays: product.validDays,
    }
  }

  let fulfillStep = routeToProcessStep(route)
    fulfillStep.begin.weekday = weekday
    fulfillStep.end.weekday = weekday
  

  // the "initial route plan".
  /**@type {FulfillmentPlan} */
  let rp = {
    locNick:   location.locNick,
    prodNick:  product.prodNick,
    routeNick: route.routeNick,
    finishDay: dayOfWeek,
    error:     null,
    steps:     []
  }

  /**@type {ProcessStep[][]} */
  let planCandidates = []

  if (!rp.error) rp = validateZone(rp, route, location)   // does the route serve the location''s zone?
  if (!rp.error) rp = validateWeekday(rp, route, weekday) // does the route operate on the given weekday?
  if (!rp.error) rp = validateTiming(rp, route, location) // is the location open during the route window?
  if (!rp.error) {
    if (prdCompleteStep.end.place === fulfillStep.begin.place) {
      planCandidates = [[{...prdCompleteStep}, {...fulfillStep}]]

    } else {
      const transferSteps = transferRoutes
        .filter(route => route.validDays.some(day => day === true)) // a route that has no valid days will mess up back-scheduling later on
        .map(routeToProcessStep)

      // Generates lists of transfer steps that can (spatially) connect the
      // production hub to the fullfillment route's start hub.
      planCandidates = enumerateDfsPaths(
        prdCompleteStep.end, 
        fulfillStep.begin, 
        transferSteps
      ).map(connectingPath => 
        [{...prdCompleteStep}, ...connectingPath, {...fulfillStep}]
      )

      if (planCandidates.length === 0) {
        rp.error = "could not find transfer"
      } 
    }

  }
  if (!rp.error) {
    planCandidates = planCandidates
      .map(processPath => backSchedule(processPath))
      .sort(compareBy(ps => ps.length))
      .sort(compareBy(ps => ps[ps.length -1].begin.relDate - ps[0].end.relDate))

    rp.steps = planCandidates[0]
    const rpDaysNeeded = rp.steps[0].end.relDate * -1 // relDate of last step is always 0

    if (rpDaysNeeded >= 2) rp.error = "cannot fulfill in time"

  }

  return rp
}

/**
 * @param {RoutingLocation} location 
 * @param {RoutingProduct} product 
 * @param {RoutingRoute[]} routes 
 * @param {WeekdayEEE} dayOfWeek 
 */
const getOptions = (location, product, dayOfWeek, routes) => {
  const transferRoutes = routes.filter(R => 
    R.hubBegin !== R.hubEnd
  )

  // const delivRoutes = routes.filter(R => !R.routeNick.includes("Pick up"))
  const pickupRoutes = routes.filter(R => R.routeNick.includes("Pick up"))
  const pickupZoneNicks = uniqBy(pickupRoutes.flatMap(R => R.zonesServed), x => x)

  let delivRoutePlans = routes // delivRoutes
    .filter(route => route.zonesServed.includes(location.zoneNick))
    .map(route => 
      buildRoutePlan(route, location, product, dayOfWeek, transferRoutes)
    )
    .sort(compareBy((/**@type {FulfillmentPlan}*/ plan) => 
      plan.steps.length > 0
        ? plan.steps[plan.steps.length - 1].begin.time
        : 999
    ))
    .sort(compareBy((/**@type {FulfillmentPlan}*/ plan) => 
      plan.steps.length > 0
        ? plan.steps[plan.steps.length - 1].begin.relDate - plan.steps[0].end.relDate
        : 999
    ))

  // // console.log("PLANS", delivRoutePlans)
  // delivRoutePlans = Dat_a.orderBy(
  //   delivRoutePlans,
  //   [
  //     (/**@type {FulfillmentPlan}*/ plan) => {
  //       return plan.steps.length > 0
  //         ? plan.steps[plan.steps.length - 1].begin.relDate - plan.steps[0].end.relDate
  //         : 999
  //     },
  //     (/**@type {FulfillmentPlan}*/ plan) => {
  //       return plan.steps.length > 0
  //         ? plan.steps[plan.steps.length - 1].begin.time
  //         : 999
  //     },
  //   ],
  //   ["asc", "asc"]
  // )

  // const pickupRoutePlans = pickupRoutes.map(puRoute => {
  //   /**@type {RoutingLocation} */
  //   const puLocation = {
  //     locNick: location.locNick,
  //     zoneNick: puRoute.zonesServed[0],
  //     timeBegin: 0,
  //     timeEnd: 2399,
  //   }
  //   return buildRoutePlan(
  //     puRoute, 
  //     puLocation, 
  //     product, 
  //     dayOfWeek, 
  //     transferRoutes
  //   )

  // })
  const pickupPlansByZoneNickEntries = pickupZoneNicks.map(zoneNick => {
    /**@type {RoutingLocation} */
    const puLocation = {
      locNick: location.locNick,
      zoneNick,
      timeBegin: 0,
      timeEnd: 2399,
    }

    const routePlans = pickupRoutes
      .filter(route => route.zonesServed.includes(zoneNick))
      .map(route => 
        buildRoutePlan(route, puLocation, product, dayOfWeek, transferRoutes)
      )
    return [zoneNick, routePlans]
  })

  // let routeOptions = Object.fromEntries(
  //   pickupRoutePlans.map(plan => [plan.routeNick, [plan]])
  // )
  let routeOptions = Object.fromEntries(
    pickupPlansByZoneNickEntries
  )
  routeOptions.deliv = delivRoutePlans
  
  return routeOptions
}

/**
 * Returns list of routes that cover the location's zone
 * and are compatible with the location's availability window
 * @param {RoutingLocation} location 
 * @param {RoutingRoute[]} routes 
 */
const getServingRoutes = (location, routes) => routes.filter(R => 
  R.zonesServed.includes(location.zoneNick)
  && intervalsOverlap(
    [location.timeBegin, location.timeEnd],
    [R.timeBegin, R.timeEnd]
  )
)  

export const Routing = {
  cast: {
    fromDBLocation,
    fromDBProduct,
    fromDBRoute,
  },
  getOptions,
  getServingRoutes,
}