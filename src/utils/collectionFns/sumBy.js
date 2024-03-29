import { sumByRdc } from "./sumByRdc";

/**
 * @template T
 * @param {T[]} data
 * @param {(t: T) => number} iterFn
 * @returns {number}
 */
export function sumBy(data, iterFn) {
  return data.reduce(sumByRdc(iterFn), 0)
}