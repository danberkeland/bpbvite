// import { keyByRdc } from "./keyByRdc";

// /**
//  * @template T
//  * @param {T[]} data 
//  * @param {(t: T) => number|string|boolean|null|undefined} iterFn 
//  * @returns {{[x: string]: T}}}
//  */
// export function keyBy(data, iterFn) {
//   return data.reduce(keyByRdc(iterFn), {})
// }

/**
 * @template T
 * @param {T[]} data 
 * @param {(t: T) => number|string|boolean|null|undefined} iterFn 
 * @returns {{[x: string]: T}}}
 */
export function keyBy(data, iterFn) {

  /** @type {{[x: string]: T}}} */
  let keyedData = {}
  let n = data.length
  for (let i = 0; i < n; ++i) {
    keyedData[String(iterFn(data[i]))] = data[i]
  }
  return keyedData

}