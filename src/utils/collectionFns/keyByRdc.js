/**
 * @template T
 * @param {(t: T) => number|string|boolean|null|undefined} iterFn 
 * @returns {(prev: {[x: string]: T}, curr: T) => {[x: string]: T}}
 */
export function keyByRdc(iterFn) {
  return (prev, curr) => {
    prev[String(iterFn(curr))] = curr
    return prev
  }
}