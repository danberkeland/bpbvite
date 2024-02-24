import { isEqual } from "lodash"

/**
 * Variation that accepts iterFns that produce any value. Uses lodash's
 * isEqual to compare, so 
 * @template T
 * @param {T[]} data
 * @param {(t: T) => any} iterFn 
 * @returns {T[][]}
 */
export function groupByArrayIsEqual(data, iterFn) {

  const prevResults = []
  const groupedArray = []

  for (let item of data) {
    const currResult = iterFn(item)
    const matchIdx = 
      prevResults.findIndex(prevResult => isEqual(prevResult, currResult))

    if (matchIdx === -1) {
      prevResults.push(iterFn(item))
      groupedArray.push([item])
    } else {
      groupedArray[matchIdx].push(item)
    }

  }

  return groupedArray

}