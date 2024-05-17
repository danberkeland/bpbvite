import { countByRdc } from "./countByRdc";

/**
 * @template T
 * @param {T[]} data
 * @param {(t: T) => boolean} iterFn
 * @returns {number}
 */
export function countBy(data, iterFn) {
  return data.reduce(countByRdc(iterFn), 0)
}