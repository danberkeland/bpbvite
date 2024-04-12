

/**
 * @template T
 * @param {T[]} collection 
 * @param {number} size
 * @returns {T[][]} 
 * @example ```chunk([1, 2, 3, 4], 3) // [[1, 2, 3], [4]]```
 */
export function chunk(collection, size) {
  if (size <= 0) { 
    console.error("Invalid Size: use a positive integer") 
    return []
  }

  let returnArray = []
  let currentChunkStartIdx = 0

  while(currentChunkStartIdx < collection.length) {
    returnArray.push(collection.slice(currentChunkStartIdx, currentChunkStartIdx + size))
    currentChunkStartIdx += size
  }

  return returnArray
}