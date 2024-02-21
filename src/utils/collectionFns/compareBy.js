
/**
 * @typedef {(a: any, b: any) => number} CompareFn
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
 * @param {function} callback Function should a single value type of either string, number, or boolean.
 * @param {boolean} [reverse=false] Default is false. If true, reverses the sort order.
 * @returns {CompareFn}
 */
export function compareBy(callback, reverse=false) {
  return reverse 
    ? (a, b) => stdCompare(callback(b), callback(a))
    : (a, b) => stdCompare(callback(a), callback(b))

}  