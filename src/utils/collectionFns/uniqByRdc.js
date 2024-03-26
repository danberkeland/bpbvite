/**
 * Can also be thought of as 'firstBy'. If the iterFn would return the same
 * value on multiple items, uniqBy will keep the first and discard the rest.
 * @template T
 * @param {(t: T) => number|string|boolean|null|undefined} iterFn 
 * @returns {(prev: T[], curr: T) => T[]}
 */
export function uniqByRdc(iterFn) {

  return (prev, curr) => {
    const currentIterValue = iterFn(curr)
    if (!prev.some(item => iterFn(item) === currentIterValue)) {
      prev.push(curr)
    }
    return prev
    
  }
}