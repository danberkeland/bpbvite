
/**
 * Project the input object to only the specified attributes.
 * If a specified key is not in the object, value will be undefined.
 * @param {Object} obj 
 * @param {string[]} keys 
 * @returns {Object}
 */
const proj = (obj, keys) => 
  Object.fromEntries(keys.map(att => [att, obj[att]]))

/**
 * 
 * @param {Object} obj 
 * @param {function} callback 
 * @returns {Object}
 */
const mapValues = (obj={}, callback) => Object.fromEntries(
  Object.entries(obj).map(entry => [entry[0], callback(entry[1])])
)

/** functions that operate on single object */
export const Obj = { proj, mapValues }

