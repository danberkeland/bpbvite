
/**
 * @param {(number|string|boolean|null|undefined)[]} array 
 * @returns {(number|string|boolean|null|undefined)[]}
 */
export function listUniq(array) { 
  let uniqList = []
  for (let i = 0; i < array.length; ++i) {
    if (!uniqList.includes(array[i])) {
      uniqList.push(array[i])
    }
  }
  return uniqList
}