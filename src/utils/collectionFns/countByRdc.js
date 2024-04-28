/**
 * @template T
 * @param {(t: T) => boolean} iterFn 
 * @returns {(prev: number, curr: T) => number}
 */
export function countByRdc(iterFn) {
  return (prev, curr) => iterFn(curr) ? prev + 1 : prev
}
