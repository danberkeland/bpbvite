import { groupByArrayRdc } from "./groupByArrayRdc";

/**
 * Variant of the classic groupBy that produces a nested array instead of an
 * object keyed on the iteratee function values.
 * 
 * GOTCHA: groupByObject casts iteratee function values to strings; this 
 * version does not! So if iterFn(item1) === 1 and iterFn(item2) === '1', this
 * function will put item1 and item2 in different groups, whereas groupByObject
 * will put the items in the same group.
 * @template T
 * @param {T[]} array
 * @param {(t: T) => number|string|boolean|null|undefined} iterFn 
 * @returns {T[][]}
 */
export function groupByArray(array, iterFn) {
  return array.reduce(groupByArrayRdc(iterFn), [])

}