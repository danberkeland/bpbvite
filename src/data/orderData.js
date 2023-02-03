import useSWR, { mutate } from "swr"
import { defaultSwrOptions } from "./constants"

// import { useMemo } from "react"

// import dynamicSort from "../functions/dynamicSort"
import getNestedObject from "../functions/getNestedObject"

import gqlFetcher from "./fetchers"

import * as queries from "../customGraphQL/queries/orderQueries"
import * as mutations from "../customGraphQL/mutations/orderMutations"

import * as yup from "yup"


/******************
 * QUERIES/CACHES *
 ******************/


/**
 * Produces a list of cart order items for the given location & delivery date.
 * @param {String} locNick Location ID attribute.
 * @param {String} delivDate Date string in ISO yyyy-mm-dd format.
 * @param {Boolean} shouldFetch Fetches data only when true.
 * @return {{data: Array<Object>, errors: Object}}
 */
export const useOrdersByLocationByDate = (locNick, delivDate, shouldFetch) => {
  const variables = shouldFetch ? {
    locNick: locNick,
    delivDate: delivDate
  } : null
  // if (shouldFetch) console.log("Fetching cart data...")
  const { data, errors } = useSWR(
    shouldFetch ? [queries.listOrdersByLocationByDate, variables] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  // if (data) console.log("Cart Data response: ", data)
  // if (errors) console.log("Cart Data errors", errors)
  
  const _data = getNestedObject(data, ['data', 'getLocation', 'ordersByDate', 'items'])

  return ({
    data: _data,
    errors: errors
  })
}


/** 
 * Can be called whenever productListSimple data is affected by a mutation.
 * Revalidation can be called anywhere, even when useProductListSimple is not present.
 * @param {String} locNick Location ID attribute.
 * @param {String} delivDate Date string in ISO yyyy-mm-dd format.
 */
export const revalidateOrdersByLocationByDate = (locNick, delivDate) => {
  mutate(
    [queries.listOrdersByLocationByDate, { locNick: locNick, delivDate: delivDate }], 
    null, 
    { revalidate: true}
  )
}

/*************
 * MUTATIONS *
 *************/

const LOGGING = true

export const createOrder = async (createOrderInput) => {
  if (LOGGING) console.log("Create order input: ", createOrderInput)
  const response = await gqlFetcher(
    mutations.createOrder, 
    { input: createOrderInput }
  )
  if (LOGGING) console.log("Create order response: ", response)

}

export const updateProduct = async (updateOrderInput) => {
  if (LOGGING) console.log("Update order input: ", updateOrderInput)
  const response = await gqlFetcher(
    mutations.updateOrder, 
    { input: updateOrderInput }
  )
  if (LOGGING) console.log("Update order response: ", response)

}

export const deleteProduct = async (deleteOrderInput) => {
  if (LOGGING) console.log("Delete order input: ", deleteOrderInput)
  const response = await gqlFetcher(
    mutations.deleteOrder,
    { input: deleteOrderInput }
  )
  if (LOGGING) console.log("Delete order response: ", response)

}


/***********
 * SCHEMAS *
 ***********/

const createProductSchema = yup.object().shape({
  
})

const updateProductSchema = yup.object().shape({

})

const deleteProductSchema = yup.object().shape({
  id: yup.string().required()
})