import { useMemo } from "react"
import { useLocationProductOverrides } from "./useLocationProductOverrides"
import { DBProduct } from "../types.d"
import { postDBOverrides, preDBOverrides } from "../product/testOverrides"

// Given a product and a location, should we modify any properties 
// of the product? This function will handle that task.


export const useOverrideProduct = ({ shouldFetch }) => {

  const { data:OVR } = useLocationProductOverrides({ shouldFetch })

  const overrideProduct = useMemo(() => {

    if (!OVR) return undefined
    
    /**
     * Applies both DB overrides as well as local, test overrides.
     * Orders should have these overrides applied when assigning routes.
     * @param {DBProduct} product 
     * @param {string} locNick 
     * @returns {DBProduct}
     */
    const overrideProduct = (product, locNick) => {

      // local data; not location specific
      const preDBOverride = preDBOverrides[product.prodNick] ?? {}

      // db item comes with a handful of irrelevant attributes.
      // Also, a null override attribute value should signal that we
      // do not want it to alter the original product, so we remove them
      // here.
      const _dbOverride = OVR.find(ovr => 1
          && ovr.locNick  === locNick
          && ovr.prodNick === product.prodNick  
        ) ?? {}

      const dbOverride = Object.fromEntries(
        Object.entries(_dbOverride).filter(entry => 1
          && !["id", "createdAt", "updatedAt"].includes(entry[0])
          && entry[1] !== null
        )
      )

      // local data; is location specific
      const postDBOverride = 
        postDBOverrides[`${locNick}#${product.prodNick}`] ?? {}

      // kind of verbose way of applying overrides,
      // but feels more explicit/type-safe. Override props align with
      // DB Product props, but that isn't annotated elsewhere.
      const override = Object.assign(
        {}, preDBOverride, dbOverride, postDBOverride
      )

      /**@type {DBProduct} */
      let productWithOverrides = { ...product }

      for (let key in override) {
        if (product.hasOwnProperty(key)) {
          productWithOverrides[key] = override[key]
        }
      }

      return productWithOverrides

    }

    return overrideProduct

  }, [OVR])

  return overrideProduct

}

