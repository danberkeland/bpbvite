/**
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