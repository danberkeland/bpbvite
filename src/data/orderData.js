import { useMemo } from "react"
import useSWR, { mutate } from "swr"
import { defaultSwrOptions } from "./constants"

// import { useMemo } from "react"

// import dynamicSort from "../functions/dynamicSort"
import getNestedObject from "../functions/getNestedObject"
import { getWeekday, dateToYyyymmdd } from "../functions/dateAndTime"

import gqlFetcher from "./fetchers"

import * as queries from "../customGraphQL/queries/orderQueries"
import * as mutations from "../customGraphQL/mutations/orderMutations"

//import * as yup from "yup"

import { useLocationDetails } from "./locationData"
import { useStandingByLocation } from "./standingData"


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

// const createProductSchema = yup.object().shape({
  
// })

// const updateProductSchema = yup.object().shape({

// })

// const deleteProductSchema = yup.object().shape({
//   id: yup.string().required()
// })




/**
 * Compound SWR hook + data transformation. Produces a header object and items object, 
 * combining cart and standing data according to business logic.
 * @param {string} locNick - location ID for query 
 * @param {Date} delivDateJS - js Date for the desired delivery date. Converts to ISO string automatically
 * @param {boolean} isWhole - for possible future cases of handling wholesale and retail orders
 * @returns 
 */
export const useCartOrderData = (locNick, delivDateJS, isWhole) => {
  const delivDate = dateToYyyymmdd(delivDateJS)
  const dayOfWeek = getWeekday(delivDateJS)
  const { data:locationDetails } = useLocationDetails(locNick, !!locNick)
  const { data:cartData } = useOrdersByLocationByDate(locNick, delivDate, !!locNick && !!delivDate)
  const { data:standingData } = useStandingByLocation(locNick, !!locNick)
  
  // console.log(locNick, delivDate, isWhole, dayOfWeek)
  // console.log("L C S:", locationDetails?1:0, cartData?1:0, standingData?1:0)

  const makeCartOrder = () => {
    if (!locationDetails || !cartData || !standingData) return undefined

    const altPrices = locationDetails.customProd.items

    // orderItems are cart items, plus any standing items...
    //    whose dayOfWeek coincides with the delivDate, and
    //    whose product (prodNick) doesn't show up in any cart item.
    const orderItems = standingData
      .filter(item => item.dayOfWeek === dayOfWeek && item.isWhole === true && item.isStand === true)
      .map(item => {
        let altPriceItem = altPrices.find(altItem => altItem.prodNick = item.product.prodNick)
        item.rate = (!!altPriceItem) 
          ? altPriceItem.wholePrice 
          : item.product.wholePrice
        item.orderType = 'S'

        return item
      })
      .reduce((prev, curr) => {
        let matchIndex = prev.findIndex(item => item.product.prodNick === curr.product.prodNick)

        if (matchIndex === -1) {
          curr.orderType = 'C'
          prev.push(curr)
        }
        return prev
      }, cartData)
      .sort((a, b) => a.product.prodName < b.product.prodName ? -1 
        : a.product.prodName > b.product.prodname ? 1
        : 0
      )


    // Make Header
    const defaultRoute = ['atownpick', 'slopick'].includes(locationDetails.zone.zoneNick) 
      ? locationDetails.zone.zoneNick
      : 'deliv'
    const cartRoute = cartData.length ? cartData[0].route : null
    //const standingRoute = ... <-- for when we enable setting the attribute in standing orders
    
    const cartNote = cartData.length ? cartData[0].ItemNote : null
    //const standingNote = ... <-- for when we enable setting the attribute in standing orders
    
    const orderHeader = {
      locNick: locationDetails.locNick,
      isWhole: isWhole,
      delivDate: delivDate,
      defaultRoute: defaultRoute,
      route: cartRoute ? cartRoute : defaultRoute,
      ItemNote: cartNote ? cartNote : '',
    }

    return {
      header: orderHeader,
      items: orderItems
    }
  }

 const cartOrder = useMemo(
    makeCartOrder, 
    [locationDetails, cartData, standingData, delivDate, dayOfWeek, isWhole]
  )

  return cartOrder

}