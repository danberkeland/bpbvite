/**
 * GOTCHA: if used with .reduce, will return the LAST item that generates the
 * observed key. If you keyBy to return the first item, use .reduceRight to
 * reverse the iteration.
 * @template T
 * @param {(t: T) => number|string|boolean|null|undefined} iterFn 
 * @returns {(prev: {[k: string]: T}, curr: T) => {[x: string]: T}}
 */
export function keyByRdc(iterFn) {
  return (prev, curr) => {
    prev[String(iterFn(curr))] = curr
    return prev
  }
}