// source: https://dev.to/flexdinesh/accessing-nested-objects-in-javascript--9m4
//
// lodash might have something to accomplish the same thing?

/** 
 * Helper for safe access to nested object properties. 
 * Gracefully defaults to 'undefined' if an expected key is not found. 
 * */ 
export const getNestedObject = (nestedObj, pathArr) => {
  return pathArr.reduce((obj, key) =>
      (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}