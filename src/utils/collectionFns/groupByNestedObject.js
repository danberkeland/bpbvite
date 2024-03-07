import { mapValues } from "../objectFns"
import { groupByArray } from "./groupByArray"
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
 * @template T
 * @param {string[]} keyArray 
 * @param {[string, T[]]} entry
 * @returns {[string[], T[]]} 
 */
const prependKeys = (keyArray, entry) => [[...keyArray, entry[0]], entry[1]]

/**
 * Instead of recursively building up a nested object, we create an analogous
 * array of entries, and extend it to support an array 'path' of keys to each
 * group.
 * @template T
 * @param {T[]} data 
 * @param {((t:T) => number|string|boolean|null)[]} iterFns 
 * @returns {([string[], T[]])[]}
 */
const nestedGroupByEntries = (data, iterFns) => {

  /** @type {([string[], T[]])[]} */
  let keyedData = [[[], data]]

  for (let iterFn of iterFns) {

    keyedData = keyedData.flatMap(nestedEntry => {
      let [keyArray, groupItems] = nestedEntry

      return groupByArray(groupItems, iterFn)
        .map(kvItem => prependKeys(keyArray, kvItem))
      
    })

  }

  return keyedData
}