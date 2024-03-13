// Routing is a relatively complex part of our application logic,
// a mini domain of its own. We define some context-specific types 
// that strip database items down to the essientials as they enter 
// 'routing land' in the hopes of keeping things clean.

/**@typedef {import('../../data/types.d.js').DBRoute}     DBRoute */
/**@typedef {import('../../data/types.d.js').DBZoneRoute} DBZoneRoute */
/**@typedef {import('../../data/types.d.js').DBLocation}  DBLocation */
/**@typedef {import('../../data/types.d.js').DBProduct}   DBProduct */


/** @typedef {boolean[]} */ let WeekdayFlags


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

export {
  RoutingLocation,
  RoutingProduct,
  RoutingRoute,
  RoutingZoneRoute,
  WeekdayFlags,
}