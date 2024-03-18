// Routing is a relatively complex part of our application logic,
// a mini domain of its own. We define some context-specific types 
// that strip database items down to the essientials as they enter 
// 'routing land' in the hopes of keeping things clean.

// /**@typedef {import('../../data/types.d.js').DBRoute}     DBRoute */
/**@typedef {import('../../data/types.d.js').DBZoneRoute} DBZoneRoute */
// /**@typedef {import('../../data/types.d.js').DBLocation}  DBLocation */
// /**@typedef {import('../../data/types.d.js').DBProduct}   DBProduct */


/** @typedef {boolean[]} */ let WeekdayFlags
/** @typedef {'Sun'|'Mon'|'Tue'|'Wed'|'Thu'|'Fri'|'Sat'} */ let WeekdayEEE
/** @typedef {0|1|2|3|4|5|6} */ let WeekdayNum


/** 
 * @typedef {Object} 
 * @property {string} locNick
 * @property {string} zoneNick
 * @property {number} timeBegin aka latestFirstDeliv; time at which the location is first available for delivery
 * @property {number} timeEnd   aka latestFinalDeliv; time at which the location is no longer available for delivery
 */
let RoutingLocation

/** 
 * @typedef {Object} 
 * @property {string} prodNick
 * @property {string[]} bakeHub
 * @property {number} readyTime
 * @property {WeekdayFlags} validDays aka daysAvailable
 */
let RoutingProduct

/** 
 * @typedef {Object} 
 * @property {string} routeNick
 * @property {WeekdayFlags} validDays aka RouteSched
 * @property {number} timeBegin       aka routeStart
 * @property {number} timeEnd         derived value = routeStart + routeTime
 * @property {string} hubBegin        aka RouteDepart
 * @property {string} hubEnd          aka RouteArrive
 * @property {string[]} zonesServed   derived from DBZoneRoute data
 */
let RoutingRoute

// unchanged, but we'll rename to signal that it's safe for routing-land.
// Future changes may require a converion here.
/**@typedef {DBZoneRoute} */ let RoutingZoneRoute 


/**
 * Point-in-time event object
 * @typedef {Object} 
 * @property {string} place Usually points to a hub, but could be a locNick
 * @property {WeekdayNum} weekday 
 * @property {number} relDate For scheduling sequences of events/steps
 * @property {string} date    Initialized with empty string. It up to you to make sure a date has been calculated before using the date property
 * @property {number} time 
 * @property {WeekdayFlags} validDays Helper for validating a schedule
 */
let ProcessEvent
/**
 * Models things that occur over an interval of time.
 * Interval defined by a beginning event and an ending event.
 * @typedef {Object} 
 * @property {string} name
 * @property {ProcessEvent} begin
 * @property {ProcessEvent} end
*/
let ProcessStep

/**
 * @typedef {Object} 
 * @property {string}        locNick
 * @property {string}        prodNick
 * @property {string}        routeNick
 * @property {WeekdayEEE}    finishDay
 * @property {string|null}   error
 * @property {ProcessStep[]} steps
 */
let FulfillmentPlan

export {
  RoutingLocation,
  RoutingProduct,
  RoutingRoute,
  RoutingZoneRoute,
  WeekdayFlags,
  WeekdayNum,
  WeekdayEEE,
  ProcessEvent,
  ProcessStep,
  FulfillmentPlan,
}