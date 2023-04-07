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

export const groupBy = (objectArray, keyAtts) => {

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