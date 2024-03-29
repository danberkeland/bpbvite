/**
 * Warning: Implementing as a reducer callback seems to break type linting.
 * It's safer to use the regular groupByObject.
 * @template T
 * @param {(t: T) => number|string|boolean|null|undefined} iterFn 
 * @returns {(prev: {[x: string]: T[]}, curr: T) => {[x: string]: T[]}}
 */
export function groupByObjectRdc(iterFn) {

  return (prev, curr) => {
    const currentValue = iterFn(curr)
    if (prev.hasOwnProperty(String(currentValue))) {
      prev[String(currentValue)].push(curr)
    } else {
      prev[String(currentValue)] = [curr]
    }

    return prev
  }

}



