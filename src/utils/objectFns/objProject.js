
// /**
//  * Project the input object to only the specified attributes.
//  * If a specified key is not in the original object, it will not be 
//  * projected onto the returned object.
//  * 
//  * 
//  * @example
//  * const foo1 = { a: 1, b: 2, c: undefined }
//  * const foo2 = projectObject(foo1, ["b", "c"]) 
//  * // { b: 2, c: undefined }
//  * 
//  * const bar1 = { a: 1, b: 2 }
//  * const bar2 = projectObject(bar1, ["b", "c"]) 
//  * // { b: 2 }
//  * 
//  * @param {Object} obj 
//  * @param {string[]} keys 
//  * @returns {Object}
//  */
// export const objProject = (obj, keys) => {
  
//   let projectedObject = {}
//   for (let key of keys) {
//     if (obj.hasOwnProperty(key)) {
//       projectedObject[key] = obj[key]
//     } else {
//       console.warn(`key ${String(key)} not found in object`)
//     }
//   }

//   return projectedObject
// }

/**
 * Project the input object to fields specified in the keys argument.
 * 
 * If a key is not in the original object, it will
 * be included in the returned object with a value of undefined.
 * 
 * @example
 * const foo1 = { a: 1, b: 2, c: undefined }
 * const foo2 = projectObject(foo1, ["b", "c"]) 
 * // { b: 2, c: undefined }
 * 
 * const bar1 = { a: 1, b: 2 }
 * const bar2 = projectObject(bar1, ["b", "c"]) 
 * // { b: 2, c: undefined }
 * 
 * @param {Object} obj 
 * @param {string[]} keys 
 * @returns {Object}
 */
export const objProject = (obj, keys) => {

  let projectedObject = {}
  for (let key of keys) {
    projectedObject[key] = obj[key]
  }
  return projectedObject
}