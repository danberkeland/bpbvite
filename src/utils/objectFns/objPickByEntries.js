/**
 * Handles the wrapping/unwrapping of Object.entries & Object.fromEntries
 * @param {Object} object 
 * @param {(k, v) => boolean} entryIterFn 
 */
export function objPickByEntries(object, entryIterFn) {

  return Object.fromEntries(
    Object.entries(object).filter(entry => entryIterFn(entry[0], entry[1]))
  )

}