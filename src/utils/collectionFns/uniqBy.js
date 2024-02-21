import { uniqByRdc } from "./uniqByRdc";

/**
 * @template T
 * @param {T[]} data 
 * @param {(t: T) => number|string|boolean|null|undefined} iterFn 
 * @returns {T[]}
 */
export function uniqBy(data, iterFn) {
  return data.reduce(uniqByRdc(iterFn), [])
}