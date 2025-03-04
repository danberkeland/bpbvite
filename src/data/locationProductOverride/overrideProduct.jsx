import { DBLocationProductOverride, DBProduct } from "../types.d";


/**
 * Non-null valued override properties are applied to
 * product properties of the same key.
 * 
 * Does nothing if override is undefined (falsy).
 * @param {DBProduct} product 
 * @param {DBLocationProductOverride | undefined} override
 * @returns {DBProduct}
 */
const overrideProduct = (product, override) => {
  if (!override) return product

  let _product = { ...product }
  const { id, locNick, prodNick, createdAt, updatedAt, ...ovrProps } = override

  for (const key in ovrProps) {
    if (ovrProps !== null) _product[key] = ovrProps[key]
  }

  return _product

}

/**
 * @param {DBLocationProductOverride | undefined} override
 */
const getOverrideProps = override => {
  if (!override) return {}
  let { id, locNick, prodNick, createdAt, updatedAt, ...ovrProps } = override

  let returnProps = {}
  for (let key in ovrProps) {
    if (ovrProps[key] !== null) returnProps[key] = ovrProps[key] 
  }

  return returnProps

}

export {
  overrideProduct,
  getOverrideProps
}