import { useMemo } from "react"
import { useLocationProductOverrides } from "./useLocationProductOverrides"
import { DBLocation, DBLocationProductOverride, DBProduct } from "../types.d"
import { postDBOverrides, preDBOverrides } from "../product/testOverrides"

const PRODUCT_OVERRIDE_PROPS = [
  'defaultInclude',
  'leadTime',
  'readyTime',
  'daysAvailable',
  'wholePrice',
]
const LOCATION_OVERRIDE_PROPS = [
  'latestFirstDeliv',
  'latestFinalDeliv',
  'zoneNick',
]

/**
 * Applies both DB overrides as well as local, test overrides.
 * Orders should have these overrides applied when assigning routes.
 * @param {DBProduct} product 
 * @param {string} locNick 
 * @param {DBLocationProductOverride[]} overrides 
 * @returns {DBProduct}
 */
export function overrideProduct(product, locNick, overrides) {
  if (!overrides || !locNick) return product

  // local data; not location specific
  const preDBOverride = preDBOverrides[product.prodNick] ?? {}

  // db item comes with a handful of irrelevant attributes. Also, a null 
  // override value should signal that it does not apply to the product, 
  // so we remove them here.
  const _dbOverride = overrides.find(ovr => 1
    && ovr.locNick  === locNick
    && ovr.prodNick === product.prodNick  
  ) ?? {}
  const dbOverride = Object.fromEntries(
    Object.entries(_dbOverride).filter(entry => 1
      && PRODUCT_OVERRIDE_PROPS.includes(entry[0])
      && entry[1] !== null
    )
  )
  const postDBOverride = postDBOverrides[`${locNick}#${product.prodNick}`] ?? {}

  return Object.assign({ ...product }, preDBOverride, dbOverride, postDBOverride)

}

/**
 * Applies only DB overrides
 * @param {DBLocation} location 
 * @param {string} prodNick 
 */
export const overrideLocation = (location, prodNick, overrides) => {

  const _dbOverride = overrides.find(item => 1
    && item.locNick === location.locNick  
    && item.prodNick === prodNick
  ) ?? {}
  const dbOverride = Object.fromEntries(
    Object.entries(_dbOverride).filter(entry => 1
      && LOCATION_OVERRIDE_PROPS.includes(entry[0])
      && entry[1] !== null
    )
  )

  return Object.assign({ ...location }, dbOverride)
}



export const useOverrideProduct = ({ shouldFetch }) => {

  const { data:OVR } = useLocationProductOverrides({ shouldFetch })

  const loadedOverrideProduct = useMemo(() => {
    if (!OVR) return undefined
    
    /**
     * @param {DBProduct} product
     * @param {string} locNick
     */
    return (product, locNick) => overrideProduct(product, locNick, OVR)
  }, [OVR])

  const loadedOverrideLocation = useMemo(() => {
    if (!OVR) return undefined

    /**
     * @param {DBLocation} location
     * @param {string} prodNick
     */
    return (location, prodNick) => overrideLocation(location, prodNick, OVR)

  }, [OVR])

  return {
    overrideProduct: loadedOverrideProduct,
    overrideLocation: loadedOverrideLocation,
  }

}

