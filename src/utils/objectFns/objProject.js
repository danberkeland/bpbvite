
/**
 * Project the input object to only the specified attributes.
 * If a specified key is not in the object, value will be undefined.
 * @param {Object} obj 
 * @param {string[]} keys 
 * @returns {Object}
 */
export const objProject = (obj, keys) => {
  
  let projectedObject = {}
  for (let key of keys) {
    if (obj.hasOwnProperty(key)) {
      projectedObject[key] = obj[key]
    } else {
      console.warn(`key ${String(key)} not found in object`)
    }
  }

  return projectedObject
}