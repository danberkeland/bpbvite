/**
 * Works by "dumb" assignment to the generated key value on each iteration.
 * Uses reverse iteration so that if multiple items generate the same key,
 * the FIRST occurring item will get show as one of the returned object's values.
 * @template T
 * @param {T[]} data 
 * @param {(t: T) => number|string|boolean|null|undefined} iterFn 
 * @returns {{[x: string]: T}}}
 */
export function keyBy(data, iterFn) {

  /** @type {{[x: string]: T}}} */
  let keyedData = {}
  let n = data.length
  for (let i = n - 1; i >= 0; --i) {
    keyedData[String(iterFn(data[i]))] = data[i]
  }
  return keyedData

}