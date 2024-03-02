// Functions that operate on arrays containing scalar values 
// like numbers, strings, and booleans. 
//
// For functions that specialize in arrays of objects, see the Data module
// in dataFns.js

/**
 * Uniqueness check by simple equality. Not meant for object/array items
 * @param {(number|string|boolean|null)[]} array 
 * @returns {(number|string|boolean|null)[]}
 */
function uniqSimple(array) {
  let uniqArray = []
  for (let i =0; i < array.length; i++) {
    if (!uniqArray.includes(array[i])) {
      uniqArray.push(array[i])
    }
  }
  return uniqArray
}


export const List = {
  uniq: uniqSimple
}