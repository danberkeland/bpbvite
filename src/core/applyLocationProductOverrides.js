import { DBLocation, DBLocationProductOverride, DBProduct } from "../data/types.d";

const productOverrideKeys = [
  "defaultInclude",
  "leadTime",
  "readyTime",
  "daysAvailable",
  "wholePrice",
]

const locationOverrideKeys = [
  "latestFirstDeliv",
  "latestFinalDeliv",
  "zoneNick",
]

/**
 * Non-null valued override properties are applied to
 * location properties of the same key.
 * 
 * Does nothing if override is undefined (falsy).
 * @param {DBLocation} location 
 * @param {string | undefined} prodNick optional parameter for validating the override item (e.g. ensure the prodNicks match)
 * @param {DBLocationProductOverride | undefined} override 
 * @returns {DBLocation}
 */
function overrideLocation (location, prodNick, override) {
  if (!override) return location
  if (0
    || (location.locNick !== override.locNick) 
    || (!!prodNick && prodNick !== override.prodNick)
  ) {
    console.warn("Warning: Mismatched Override")
  }
  
  let _location = { ...location }
  for (let key of locationOverrideKeys) {
    if (override[key] !== null) {
      _location[key] = override[key]
    }
  }

  return _location

}


/**
 * Non-null valued override properties are applied to
 * product properties of the same key.
 * 
 * Does nothing if override is undefined (falsy).
 * @param {DBProduct} product
 * @param {string | undefined} locNick optional parameter for validating (e.g. ensuring the locNicks match)
 * @param {DBLocationProductOverride | undefined} override
 * @returns {DBProduct}
 */
const overrideProduct = (product, locNick, override) => {
  if (!override) return product
  if (0
    || (product.prodNick !== override.prodNick) 
    || (!!locNick && locNick !== override.locNick)
  ) {
    console.warn("Warning: Mismatched Override")
  }

  let _product = { ...product }
  for (let key of productOverrideKeys) {
    if (override[key] !== null) {
      _product[key] = override[key]
    }
  }

  return _product

}

export {
  overrideLocation,
  overrideProduct,
}