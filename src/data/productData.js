import useSWR, { mutate } from "swr"
import { defaultSwrOptions } from "./constants"

import { useMemo } from "react"

import dynamicSort from "../functions/dynamicSort"
import getNestedObject from "../functions/getNestedObject"

import gqlFetcher from "./fetchers"

import * as queries from "../customGraphQL/queries/productQueries"
import * as mutations from "../customGraphQL/mutations/productMutations"

import { useLocationDetails } from "./locationData"

// import * as yup from "yup"


/******************
 * QUERIES/CACHES *
 ******************/

/**
 * Produces a full list of prodNick/prodName items.
 * @param {boolean} shouldFetch Fetches data only when true.
 * @returns {{ data: Array<{ locNick: string, locName: string }>, errors: object }} A list of locNick ID's and locName text labels.
 */
export const useProductListSimple = (shouldFetch) => {
  const { data, errors } = useSWR(
    shouldFetch ? [queries.listProductsSimple, { limit: 1000 }] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  const transformData = () => {
    if (!data) return undefined
    return getNestedObject(data, ['data', 'listProducts', 'items']).sort(dynamicSort("locName"))
  }
  const _data = useMemo(transformData, [data])

  return({
    data: _data,
    errors: errors
  })

}

/** 
 * Can be called whenever productListSimple data is affected by a mutation.
 * Revalidation can be called anywhere, even when useProductListSimple is not present.
 */
export const revalidateProductListSimple = () => {
  mutate(
    [queries.listProductsSimple, { limit: 1000 }], 
    null, 
    { revalidate: true}
  )
}

/**
 * Produces a full list of prodNick/prodName items.
 * @param {boolean} shouldFetch Fetches data only when true.
 * @returns {{ data: Array<{ locNick: string, locName: string }>, errors: object }} A list of locNick ID's and locName text labels.
 */
export const useProductListFull = (shouldFetch) => {
  const { data, errors } = useSWR(
    shouldFetch ? [queries.listProductsFull, { limit: 1000 }] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  const transformData = () => {
    if (!data) return undefined
    return getNestedObject(data, ['data', 'listProducts', 'items']).sort(dynamicSort("locName"))
  }
  const _data = useMemo(transformData, [data])

  return({
    data: _data,
    errors: errors
  })

}

/** 
 * Can be called whenever productListFull data is affected by a mutation.
 * Revalidation can be called anywhere, even when useProductListFull is not present.
 */
export const revalidateProductListFull = () => {
  mutate(
    [queries.listProductsFull, { limit: 1000 }], 
    null, 
    { revalidate: true}
  )
}

export const useProductListForOrders = (shouldFetch) => {
  const { data, errors } = useSWR(
    shouldFetch ? [queries.listProductsForOrders, { limit: 1000 }] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  const transformData = () => {
    if (!data) return undefined
    return getNestedObject(data, ['data', 'listProducts', 'items']).sort(dynamicSort("locName"))
  }
  const _data = useMemo(transformData, [data])

  return({
    data: _data,
    errors: errors
  })

}

/** 
 * Can be called whenever associated cache is affected by a mutation.
 * Revalidation can be called anywhere, even when the associated SWR hook is not present.
 */
export const revalidateProductListForOrders = () => {
  mutate(
    [queries.listProductsForOrders, { limit: 1000 }], 
    null, 
    { revalidate: true}
  )
}

/**
 * Produces a more extensive list of attributes for a single product.
 * Does not produce info for '@connected' types.
 * @param {string} prodNick ID value for the desired product.
 * @param {boolean} shouldFetch Fetches data only when true.
 * @returns {{ data: object, errors: object }} A single object representing the requested product.
 */
export const useProductDetails = (prodNick, shouldFetch) => {
  const { data, errors } = useSWR(
    shouldFetch ? [queries.getProductDetails, { prodNick: prodNick }] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )
  
  const _data = getNestedObject(data, ['data', 'getProduct'])

  return({ 
    data: _data,
    errors: errors
  })
}

/** 
 * Can be called whenever productDetails data is affected by a mutation.
 * Revalidation can be called anywhere, even when productDetails is not present.
 */
export const revalidateProductDetails = (prodNick) => {
  mutate(
    [queries.getProductDetails, { prodNick: prodNick }],
    null,
    { revalidate: true }
  )
}


/**
 * Compound data hook + transformation. Returns a detailed product list modified
 * with Location-specific settings. Intended to use for Ordering
*/
export const useProductDataWithLocationCustomization = (locNick) => {
  const { data:productData, errors:productErrors } = useProductListFull(true)
  const { altPrices, templateProds, prodsNotAllowed, altLeadTimes, errors:locationErrors } = useLocationDetails(locNick, !!locNick)

  const applyCustomizations = () => {
    if (!productData || !altPrices || !templateProds || !prodsNotAllowed || !altLeadTimes) return undefined

    return productData.filter(item => {
      let override = prodsNotAllowed.find(i => i.prodNick === item.prodNick)
      return override ? override.isAllowed : item.defaultInclude

    }).map(item => {
      let override = altPrices.find(i => i.prodNick === item.prodNick)
      return override ? { ...item, wholePrice: override.wholePrice } : { ...item }

    }).map(item => {
      let override = altLeadTimes.find(i => i.prodNick === item.prodNick)
      return override ? { ...item, leadTime: override.leadTime } : { ...item }

    }).map(item => {
      let favorite = templateProds.find(i => i.prodNick === item.prodNick)
      return { ...item, templateProd: (favorite ? favorite.id : null)}

    }).sort(
      dynamicSort("prodName")

    ).sort( (a, b) => {
      let _a = a.templateProd !== null ? 0 : 1
      let _b = b.templateProd !== null ? 0 : 1
      return _a - _b

    })
  
  }

  const productsForLocation = useMemo(
    applyCustomizations, 
    [productData, altPrices, templateProds, prodsNotAllowed, altLeadTimes]
  )

  return ({
    data: productsForLocation,
    errors: {
      product: productErrors,
      location: locationErrors
    }
  })

}

/*************
 * MUTATIONS *
 *************/

const LOGGING = true

export const createProduct = async (createProductInput) => {
  if (LOGGING) console.log("Create product input: ", createProductInput)

  const response = await gqlFetcher(
    mutations.createProduct, 
    { input: createProductInput }
  )
  if (LOGGING) console.log("Create product response: ", response)

}


export const updateProduct = async (updateProductInput) => {
  if (LOGGING) console.log("Update product nput: ", updateProductInput)

  const response = await gqlFetcher(
    mutations.updateProduct, 
    { input: updateProductInput }
  )
  if (LOGGING) console.log("Update product response: ", response)

}


export const deleteProduct = async (deleteProductInput) => {

  if (LOGGING) console.log("Delete product input: ", deleteProductInput)
  const response = await gqlFetcher(
    mutations.deleteProduct,
    { input: deleteProductInput }
  )
  if (LOGGING) console.log("Delete product response: ", response)

}


/***********
 * SCHEMAS *
 ***********/

// const createProductSchema = yup.object().shape({
  
// })

// const updateProductSchema = yup.object().shape({

// })

// const deleteProductSchema = yup.object().shape({
//   prodNick: yup.string().required()
// })