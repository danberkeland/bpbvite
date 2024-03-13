
/**
 * @typedef {(a: any, b: any) => number} CompareFn
 */

/**
 * @typedef {((a: any) => number)|((a: any) => string)|((a: any) => boolean)} CompareCallbackFn
 */

/**
 * @type {CompareFn}
 */
const stdCompare = (a, b) => 
  a > b ?  1 : 
  a < b ? -1 : 
  0

/**
 * Used directly in Array.prototype.sort()
 * 
 * Reminder, sorting on boolean values puts false before true in ascending order.
 * Just remember false is like 0, true is like 1.
 * @param {CompareCallbackFn} callback Function should a single value type of either string, number, or boolean.
 * @param {'asc'|'desc'} direction='asc' Default: ascending.
 * @returns {CompareFn}
 */
export function compareBy(callback, direction='asc') {
  return direction === 'desc'
    ? (a, b) => stdCompare(callback(b), callback(a))
    : (a, b) => stdCompare(callback(a), callback(b))

}