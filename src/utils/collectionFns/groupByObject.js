// import { groupByObjectRdc } from "./groupByObjectRdc"

/**
 * @template T
 * @param {T[]} data
 * @param {(t: T) => number|string|boolean|null|undefined} iterFn
 * @returns {{[k: string]: T[]}}
 */
export function groupByObject(data, iterFn) {
  // return array.reduce(groupByObjectRdc(iterFn), {})

  /** @type {{[k: string]: T[]}} */
  let groupedObject = {}
  const n = data.length
  
  for (let i = 0; i < n; ++i) {
    const iterValue = String(iterFn(data[i]))
    if (groupedObject.hasOwnProperty(iterValue)) {
      groupedObject[iterValue].push(data[i])
    } else {
      groupedObject[iterValue] = [data[i]]
    }
  }

  return groupedObject

}


