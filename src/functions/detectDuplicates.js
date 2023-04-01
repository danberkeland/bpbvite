// General-purpose function "bucketing" data
// by matching values across one or more
// attrubutes.
// 
// Returns an object keyed by observed 
// combinations of attribute values, delimited 
// with the '#' character. Values are 'bucket'
// arrays containing all items matching the key
// values.
//
// Supports specifying nested properties with
// lodash-like "." separators.

import getNestedObject from "./getNestedObject"

const groupBy = (objectArray, keyAtts) => {

  return objectArray.reduce((acc, obj) => {
    const key = keyAtts
      .map(attName => {
        let path = attName.split('.')
        return getNestedObject(obj, path)
      })
      .join('#')
    
    const curGroup = acc[key] ?? []

    return { ...acc, [key]: [...curGroup, obj] }
  }, {})
  
}

// items with matching values along key attributes are returned
// in array buckets. if objectArray has no duplicates, returns
// and empty array.
/**
 * Test common array-of-object data for matching values across 
 * 1 or more attribute values.
 * 
 * Returns nested arrays of duplicate item buckets, or an empty
 * array if no duplicates are found.
 * 
 */
export const getDuplicates = (objectArray, keyAtts) => {
  const buckets = groupBy(objectArray, keyAtts)
  return Object.values(buckets).filter(group => group.length > 1)

}



// export const testGroupBy = () => {
//   const data = [
//     {foo: 'a', bar: 1, baz: 1},
//     {foo: 'b', bar: 1, baz: 2},
//     {foo: 'c', bar: 1, baz: 3},
//     {foo: 'd', bar: 2, baz: 1},
//     {foo: 'e', bar: 2, baz: 2},
//     {foo: 'f', bar: 2, baz: 3},
//     {foo: 'g', bar: 3, baz: 1},
//     {foo: 'h', bar: 3, baz: 2},
//     {foo: 'i', bar: 3, baz: 3},
//     {foo: 'j', bar: 3, baz: 3},
//     {foo: 'k', bar: 3, baz: 3},
//   ] 

//   console.log(data) 

//   console.log("group by bar:", groupBy(data, ["bar"]))
//   console.log("group by baz:", groupBy(data, ["baz"]))
//   console.log("group by bar + baz:", groupBy(data, ["bar", "baz"]))

// }

// export const testGetDuplicates = () => {
//   const data = [
//     {foo: 'a', bar: 1, baz: 1},
//     {foo: 'b', bar: 1, baz: 2},
//     {foo: 'c', bar: 1, baz: 3},
//     {foo: 'd', bar: 2, baz: 1},
//     {foo: 'e', bar: 2, baz: 2},
//     {foo: 'f', bar: 2, baz: 3},
//     {foo: 'g', bar: 3, baz: 1},
//     {foo: 'h', bar: 3, baz: 2},
//     {foo: 'i', bar: 3, baz: 3},
//     {foo: 'j', bar: 3, baz: 3},
//     {foo: 'k', bar: 3, baz: 3},
//   ] 

//   console.log("by foo:", getDuplicates(data, ['foo']))
//   console.log("by bar + baz:", getDuplicates(data, ['bar', 'baz']))
  
// }