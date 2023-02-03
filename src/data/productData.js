import useSWR, { mutate } from "swr"
import { defaultSwrOptions } from "./constants"

import { useMemo } from "react"

import dynamicSort from "../functions/dynamicSort"
import getNestedObject from "../functions/getNestedObject"

import gqlFetcher from "./fetchers"

import * as queries from "../customGraphQL/queries/productQueries"
import * as mutations from "../customGraphQL/mutations/productMutations"

import * as yup from "yup"


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

// consider calling the revalidate functions above after 
// performing one or a batch of mutations below.


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

const createProductSchema = yup.object().shape({
  
})

const updateProductSchema = yup.object().shape({

})

const deleteProductSchema = yup.object().shape({
  prodNick: yup.string().required()
})