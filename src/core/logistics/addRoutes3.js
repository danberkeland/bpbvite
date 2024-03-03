// Rewrite of addRoutes for use with updated dataHooks

// Goal: try to reduce addRoutes to a function that accepts the minimum
// required inputs.

// Ideally, we would like to be able to abstract the logic to the point where
// db-specific attributes are not used by name, but that may be too ambitious
// at this moment


// 0 and 1 are a shorthand to describe start and finish values, that is
// values that describe what happens at the beginning and at the end
// of the task/process.

// /**
//  * @typedef {Object}
//  * @property {number} time0
//  * @property {number} timeDelta
//  */
// let TimeWindow

// IN: a set of properties the Node (function) accepts
// OUT: a set of properties the Node (function) produces

// an edge is an ordered pair (n1, n2) where OUT(n1) satisfies IN(n2)

// /**
//  * @typedef {(TimeWindow|null)[]} WeeklySchedule
//  */

/**
 * @typedef {Object} Schedule
 * @property {boolean[]} validDays
 * @property {b}
 */

/**
 * @typedef  {Object}    Process
 * @property {string}    type for readability; the table the process came from
 * @property {string}    name
 * @property {string}    place0
 * @property {string}    place1
 * @property {string}    time0
 * @property {string}    timeDelta
 * @property {Weekly} validDays Should be an array of length 7. Indexes 0 to 6 correspond to Sun, ..., Sat.
 */



/** 
 * @typedef {Object} RouteValidationInput 
 * @property {RoutingRouteInput} route
 * @property {Object} product
 * @property {} zone
 * @property {string} delivDate
 * 
 */


/**
 * 
 * @param {string[]} productPlace1s 
 * @param {string} routePlace0 
 * @returns 
 */
const decideBakeLocation = (productPlace1s, routePlace0) => 
  productPlace1s.some(productPlace1 => productPlace1 === routePlace0)
    ? routePlace0
    : productPlace1s[0] //



const validateDeliveryRoute = (input) => {

  const { route, product, zone, delivDate }


}


const validatePickupRoute = (input) => {

}