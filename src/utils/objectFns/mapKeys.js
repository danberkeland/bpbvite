/**
 * 
 * @param {Object} obj 
 * @param {function} iterFn 
 * @returns {Object}
 */
export function mapKeys(obj, iterFn) {

  return Object.fromEntries(
    Object.entries(obj).map(entry => [iterFn(entry[0]), entry[1]])
  )
}