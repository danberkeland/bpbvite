/**
 * @typedef {number|string|boolean|null|undefined|symbol} SimpleValue
 */

/**
 * @typedef {SimpleValue[]} SimpleArray
 */

/**
 * Checks for equality of length, and for equality of values 
 * on all corresponding indexes.
 * @param {SimpleArray} array1 
 * @param {SimpleArray} array2 
 * @returns {boolean}
 */
export function simpleArrayIsEqual(array1, array2) {

  return array1.length === array2.length
    && array1.every((_, i) => array1[i] === array2[i])
}