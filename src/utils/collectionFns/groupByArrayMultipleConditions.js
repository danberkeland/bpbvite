/** @typedef {number | string | boolean | null} Result */
/** @typedef {Result[]} ResultArray */


/**
 * Partitions data according to multiple inter fns.
 * 
 * Grouping requires matching values on each iter fn result.
 * Unlike the 'Object' flavor of groupBy, the array grouping comparisons
 * consider data types, so "2" doesn't match 2, "true" doesn't match true, etc...
 * 
 * @template T
 * @param {T[]} data 
 * @param {((t: T) => Result)[]} iterFns
 * @returns {T[][]}
 */
export function groupByArrayMultipleConditions(data, iterFns) {

  /** @type {Result[][]} */
  let prevResults = []

  /** @type {T[][]} */
  let groupedArray = []

  for (let item of data) {

    const currResult = iterFns.map(iterFn => iterFn(item))
    const matchIdx = prevResults.findIndex(prevResult => 
      prevResult.every((_, i) => prevResult[i] === currResult[i])  
    )

    if (matchIdx === -1) {
      prevResults.push(currResult)
      groupedArray.push([item])
    } else {
      groupedArray[matchIdx].push(item)
    }

  }

  return groupedArray
}