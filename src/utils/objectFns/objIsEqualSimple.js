/**
 * @param {Object<[k: string], (number|string|boolean|null|undefined)>} obj1 
 * @param {Object<[k: string], (number|string|boolean|null|undefined)>} obj2 
 * @returns {boolean}
 */
export function objIsEqualSimple(obj1, obj2) {

  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false

  let result = true

  for (let key in obj1) {
    if (!obj2.hasOwnProperty(key) || obj2[key] !== obj1[key])
    result = false
    break
  }

  return result
}