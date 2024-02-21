import { groupByObjectRdc } from "./groupByObjectRdc"

/**
 * @template T
 * @param {T[]} array
 * @param {(t: T) => number|string|boolean|null|undefined} iterFn
 * @returns {{[x: string]: T[]}}
 */
export function groupByObject(array, iterFn) {
  return array.reduce(groupByObjectRdc(iterFn), {})

}


