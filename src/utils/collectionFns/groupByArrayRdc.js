/**
 * "Array" denotes a nested array return type, instead of the usual object. 
 * Like calling ```Object.values(groupBy(...))```.
 * 
 * "Rdc" denotes the intended usage as an Array.reduce callback function.
 * Remember to supply an initial value of ```[]```
 * @template T
 * @param {(t: T) => number|string|boolean|null|undefined} iterFn 
 * @returns {(prev: Array.<T[]>, curr: T) => Array.<T[]>}
 */
export function groupByArrayRdc(iterFn) {

  return (prev, curr) => {
    const currentValue = iterFn(curr)
    const groupMactchIdx = 
      prev.findIndex(group => iterFn(group[0]) === currentValue)

    if (groupMactchIdx > -1) {
      prev[groupMactchIdx].push(curr)

    } else {
      prev.push([curr])

    }

    return prev
  }

}