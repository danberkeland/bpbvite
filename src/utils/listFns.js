// Functions that operate on arrays containing scalar values 
// like numbers, strings, and booleans. 
//
// For functions that specialize in arrays of objects, see the Data module
// in dataFns.js

const uniq = (array) => {
  let uniqArray = []
  for (let i =0; i < array.length; i++) {
    if (!uniqArray.includes(array[i])) {
      uniqArray.push(array[i])
    }
  }
  return uniqArray
}


export const List = {
  uniq
}