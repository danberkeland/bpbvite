import { FulfillmentOption } from "../data/types.d"

/** 
 * Dates should be strings in ISO 'yyyy-MM-dd' format. 
 * Used to override (cease) production/logistics activities 
 * on the specified day.
 * @type {readonly string[]}
 */
const HOLIDAYS = Object.freeze([
  '2023-12-25', // xmas
])


/** 
 * Specifies when ordering app should treat placed orders
 * as if placed on the next day. = 20
 * @type {number}
 */
const CUTOFF_TIME_HOURS = 20 // 8:00 pm


/** Values: ['atownpick', 'slopick'] */
/** 
 * @type {readonly FulfillmentOption[]} 
 */
const PICKUP_ZONES = Object.freeze(['atownpick', 'slopick'])

/** Values: ['Prado', 'Carlton'] */
const HUBS = Object.freeze(['Prado', 'Carlton'])


const WEEKDAYS_EEE = Object.freeze(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])

/**JS Date convention: Sun = 0; Sat = 6*/
const WEEKDAYS_NUM = Object.freeze([0, 1, 2, 3, 4, 5, 6])

export {
  PICKUP_ZONES,
  HUBS,
  HOLIDAYS,
  CUTOFF_TIME_HOURS,
  WEEKDAYS_EEE,
  WEEKDAYS_NUM,
}