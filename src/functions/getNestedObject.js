// source: https://dev.to/flexdinesh/accessing-nested-objects-in-javascript--9m4
//
// lodash might have something to accomplish the same thing?

/** 
 * Helper for safe access to nested object properties. 
 * Gracefully defaults to 'undefined' if an expected key is not found. 
 * 
 * @param {Object} nestedObj 
 * @param {[string]} pathArr a list of attribute names describing the path to the desired value.
 * 
 * @example 
 * let foo = { bar: { foobar: "foobarbar"}}
 * getNestedObject(foo, ['bar', 'foobar'])
 * // returns "foobarbar"
 * 
 * getNestedObject(foo, ['barbar', 'foobar'])
 * // returns undefined 
 * 
 * let x = foo.barbar.foobar
 * // returns an error
 * */ 
const getNestedObject = (nestedObj, pathArr) => {
  return pathArr.reduce((obj, key) =>
      (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}

export default getNestedObject