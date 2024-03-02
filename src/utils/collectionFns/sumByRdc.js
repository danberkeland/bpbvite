/**
 * @template T
 * @param {(t:T) => number} iterFn
 * @returns {(prev: number, curr: T) => number}
 */
export function sumByRdc(iterFn) {
  return (prev, curr) => prev + iterFn(curr)
}