// /** @typedef {boolean[]} WeekdayFlags */

// /**
//  * @typedef {Object} RoutingLocation 
//  * @property {string} locNick
//  * @property {string} zoneNick
//  * @property {number} latestFirstDeliv
//  * @property {number} latestFinalDeliv
//  */

// /** 
//  * @typedef {Object} _RoutingLocation
//  * @property {string} locNick
//  * @property {string} zoneNick
//  * @property {number} delivTimeStart
//  * @property {number} delivTimeFinis
//  *
//  */

// /**
//  * @typedef {Object} RoutingProduct
//  * @property {string} prodNick
//  * @property {string[]} bakedWhere
//  * @property {number} readyTime
//  * @property {number[]} daysAvailable
//  */

// /** 
//  * @typedef {Object} _RoutingProduct
//  * @property {string} prodNick
//  * @property {string[]} bakedWhere
//  * @property {number} readyTime
//  * @property {WeekdayFlags} validDays
//  */

// /** 
//  * @typedef {Object} RoutingRoute
//  * @property {string} routeNick
//  * @property {string[]} RouteSched
//  * @property {number} routeStart
//  * @property {number} routeTime
//  * @property {string} RouteDepart
//  * @property {string} RouteArrive 
//  */

// /** 
//  * @typedef {Object} _RoutingRoute
//  * @property {string} routeNick
//  * @property {number} timeStart
//  * @property {number} timeFinis
//  * @property {WeekdayFlags} validDays
//  * @property {string} hubStart
//  * @property {string} hubFinis
//  * @property {string[]} zonesServed
//  */

// /** 
//  * @typedef {Object} ZoneRoute
//  * @property {string} id
//  * @property {string} zoneNick
//  * @property {string} routeNick
//  */

// /** @type {RoutingLocation} */ let RoutingLocation
// /** @type {_RoutingLocation} */ let _RoutingLocation
// /** @type {RoutingProduct} */ let RoutingProduct
// /** @type {_RoutingProduct} */ let _RoutingProduct
// /** @type {RoutingRoute} */ let RoutingRoute
// /** @type {_RoutingRoute} */ let _RoutingRoute
// /** @type {ZoneRoute} */ let ZoneRoute


// module.exports = {
//   // @ts-ignore
//   RoutingLocation,
//   // @ts-ignore
//   _RoutingLocation,
//   // @ts-ignore
//   RoutingProduct,
//   // @ts-ignore
//   _RoutingProduct,
//   // @ts-ignore
//   RoutingRoute,
//   // @ts-ignore
//   _RoutingRoute,
//   // @ts-ignore
//   ZoneRoute
// }
