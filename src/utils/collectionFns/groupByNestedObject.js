import { mapValues } from "../objectFns/mapValues"
import { groupByObject } from "./groupByObject"



/**
 * Extends groupBy. Creates nested objects by successively 
 * applying groupBy callbacks to object values.
 * @function
 * @template T
 * @param {T[]} data
 * @param {((t:T) => number|string|boolean|null|undefined)[]} callbacks
 * @returns {Object.<string, (T[] | Object)>|T[]}
 */
const nestedGroupBy = (data, callbacks) => {
  if (callbacks.length === 0) return data

  const [iterFn, ...remainingIterFns] = callbacks
  const groupedData = groupByObject(data, iterFn)

  return mapValues(
    groupedData, 
    (/** @type T[] */ group) => nestedGroupBy(group, remainingIterFns)
  )
}




/**
 * @function
 * @template T
 * @param {T[]} data 
 * @param {Function[]} callbacks 
 * @returns {([ string[], T[] ])[]}
 */
const nestedBucketByEntries = (data, callbacks) => {

  /** @type {([string[], T[]])[]} */
  let keyedData = [[[], data]]

  for (let callback of callbacks) {

    keyedData = keyedData.flatMap(kv => {
      let [keyArr, kData] = kv

      return bucketByEntries(kData, callback)
        .map(kvItem => prependKeys(keyArr, kvItem))
      
    })

  }

  return keyedData
}