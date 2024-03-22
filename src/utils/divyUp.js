/**
 * Related to integer division. Splits {nItems} items 
 * as equally as possible into {nParts} parts. Returns
 * qtys in decareasing order.
 * @example ```
 * divyUp(10, 3) // [4, 3, 3]
 * ```
 * @param {number} nItems 
 * @param {number} nParts 
 * @returns {number[]}
 */
export function divyUp(nItems, nParts) {
  if (!(nParts > 0)) return []

  const quotient  = Math.floor(nItems / nParts)
  const remainder = nItems % nParts

  return (new Array(nParts))
    .fill(quotient)
    .map((q, idx) => idx < remainder ? q+1 : q)

}