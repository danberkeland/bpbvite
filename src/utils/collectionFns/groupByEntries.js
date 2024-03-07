/**@typedef {number|string|boolean|null|undefined} PrimitiveValue */

/**
 * @template T
 * @param {(t: T) => PrimitiveValue} iterFn 
 * @returns {(prev: [PrimitiveValue, T[]][], curr: T) => [PrimitiveValue, T[]][]}
 */
export function groupByEntriesRdc(iterFn) {

  return (prev, curr) => {
    const currentValue = iterFn(curr)
    const groupMactchIdx = 
      prev.findIndex(groupEntry => groupEntry[0] === currentValue)

    if (groupMactchIdx > -1) {
      prev[groupMactchIdx][1].push(curr)

    } else {
      prev.push([currentValue, [curr]])

    }

    return prev
  }

}