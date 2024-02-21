import { sumByRdc } from "./sumByRdc";

/**
 * @param {any[]} data
 * @param {(a: any) => number} iterFn
 * @returns {number}
 */
export function sumBy(data, iterFn) {
  return data.reduce(sumByRdc(iterFn), 0)
}