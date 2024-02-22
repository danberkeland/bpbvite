/**
 * 
 * @param {Object} obj 
 * @param {function} iterFn 
 * @returns {Object}
 */
export function mapValues(obj, iterFn) {

  return Object.fromEntries(
    Object.entries(obj).map(entry => [entry[0], iterFn(entry[1])])
  )
}