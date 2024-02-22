
/**
 * @param {number} first 
 * @param {number} last 
 * @param {number} [stepSize]
 * @returns {number[]}
 */
export function range(first, last, stepSize=1) {
  let list = []
  for (let i = first; i <= last; i += stepSize) {
    list.push(i)
  }
  return list
}