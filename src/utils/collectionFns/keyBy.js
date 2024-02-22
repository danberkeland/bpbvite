import { keyByRdc } from "./keyByRdc";

/**
 * @template T
 * @param {any[]} data 
 * @param {(t: T) => number|string|boolean|null|undefined} iterFn 
 * @returns {{[x: string]: T}}}
 */
export function keyBy(data, iterFn) {
  return data.reduce(keyByRdc(iterFn), {})
}