/**
 * @template T
 * @template Y
 * @param {{[k: string]: T}} obj 
 * @param {(t: T) => Y} iterFn 
 * @returns {{[k: string]: Y}}
 */
export function mapValues(obj, iterFn) {

  return Object.fromEntries(
    Object.entries(obj).map(entry => [entry[0], iterFn(entry[1])])
  )
}