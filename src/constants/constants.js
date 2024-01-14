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
 * as if placed on the next day.
 * @type {number}
 */
const CUTOFF_TIME_HOURS = 20 // 8:00 pm


export {
  HOLIDAYS,
  CUTOFF_TIME_HOURS,
}