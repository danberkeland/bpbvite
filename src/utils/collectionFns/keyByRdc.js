// Not sure if a reducer implementation can be type safe
// https://github.com/jsdoc/jsdoc/issues/1990


/**
 * GOTCHA: if used with .reduce, will return the LAST item that generates the
 * observed key. If you want keyBy to return the first item, use .reduceRight to
 * reverse the iteration.
 * 
 * ALSO GOTCHA: Type-safety isnt the best with this implementation. You will
 * probably need to use `@type` on the argument of your iterFn.
 * @template T
 * @param {(t: T) => number|string|boolean|null|undefined} iterFn 
 * @returns {(prev: {[x: string]: T}, curr: T) => {[x: string]: T}}
 */
export function keyByRdc(iterFn) {
  return (prev, curr) => {
    prev[String(iterFn(curr))] = curr
    return prev
  }
  // return (prev, curr) => ({ ...prev, [String(iterFn(curr))]: curr })
}