import { simpleArrayIsEqual } from "../listFns/simpleArrayIsEqual"



/**
 * Define uniqueness by matching on an array of N iterFn values. Alternative
 * to using string concatenation methods.
 * 
 * Preserves array order; selects first of any group of "duplicate" items.
 * 
 * This implementation caches previous iterFn results for comparisons.
 * @template T
 * @param {T[]} data 
 * @param {((t: T) => number|string|boolean|null|undefined)[]} iterFns
 * @returns {T[]}
 */
export function uniqByN(data, iterFns) {

  let prevResults = []
  let uniqArray = []
  
  const n = data.length
  for (let i = 1; i < n; ++i) {
    const currResult = iterFns.map(iterFn => iterFn(data[i]))

    if (!prevResults.some(prevResult => simpleArrayIsEqual(prevResult, currResult))) {
      uniqArray.push(data[i])
      prevResults.push(currResult)
    } 

  }

  return uniqArray

}