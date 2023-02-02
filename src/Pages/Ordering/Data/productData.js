import useSWR from "swr"
import dynamicSort from "../Functions/dynamicSort"
import { dateToMmddyyyy } from "../Functions/dateAndTime"
import { getNestedObject } from "../Functions/getNestedObject"
import { gqlFetcher } from "./fetchers"
import * as queries from "./gqlQueries"
import { useLocationDetails } from "./locationData"
import { useOrdersByLocationByDate, useStandingByLocation } from "./orderData"
import { makeOrderHeader, makeOrderItems } from "./dataTransformations"
import { useEffect } from "react"
import { listProducts } from "../../../graphql/queries"

const usualOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
}


/**
 * Heavy duty query. Lists all products; includes most attributes.
 * Consider switching to a more lightweight query if you can get away with it.
 */
export const useProductData = () => {
  const { data, error, isLoading } = useSWR([queries.listProductDetails, {limit: 1000}], gqlFetcher, usualOptions)
  const _data = getNestedObject(data, ['data', 'listProducts', 'items'])
  _data?.sort(dynamicSort("prodName"))

  //if (_data) console.log(_data.slice(0,6))

  return({
    data: _data,
    errors: error,
    isLoading: isLoading
  })
}


export const useProductDisplay = (location, delivDate) => {
  const { data: productData } = useProductData()
  const { data: locationDetails } = useLocationDetails(location)

}


export const useOrderState = (location, delivDate, setOrderHeader, setOrderItems) => {
  const { data:locationDetails } = useSWR(
    !!location ? [queries.getLocationDetails, { locNick: location }] : null, 
    gqlFetcher, 
    usualOptions
  )

  const { data:standingData } = useSWR(
    (!!location && !!delivDate) ? [queries.listStandingByLocation, { locNick: location }] : null,
    gqlFetcher, 
    usualOptions
  )

  const { data:cartData } = useSWR(
    (!!location && !!delivDate) ? 
      [queries.listOrdersByLocationByDate, { locNick: location, delivDate: dateToMmddyyyy(delivDate) }] : 
      null, 
    gqlFetcher, 
    usualOptions
  )

  const _locationDetails = getNestedObject(locationDetails, ['data', 'getLocation'])
  const _standingData = getNestedObject(standingData, ['data', 'getLocation', 'standing', 'items'])
  const _cartData = getNestedObject(cartData, ['data', 'getLocation', 'ordersByDate', 'items'])

  let _orderHeader
  let _orderItems

    if (!!_locationDetails && !!_standingData && !!_cartData) {
    _orderHeader = makeOrderHeader(_locationDetails, _cartData, _standingData, delivDate)
    _orderItems = makeOrderItems(_locationDetails, _cartData, _standingData, delivDate)
  }

  console.log("(locDet, stand, cart):", locationDetails ? "1" : "0", standingData ? "1" : "0", cartData ? "1" : "0")

    // useEffect(() => {
    //   setOrderHeader(makeOrderHeader(locationDetails, cartData, standingData, delivDate))
    //   setOrderItems(makeOrderItems(locationDetails, cartData, standingData, delivDate))
    // }, [locationDetails, cartData, standingData, delivDate])
  return({
    orderHeader: _orderHeader,
    orderItems: _orderItems
  })
  
}

/**
 * Lightweight list of products, typically used for Dropdown menus
 */
export const useProductList = (shouldFetch) => {
  const { data, errors } = useSWR(shouldFetch ? [queries.listProducts, {limit: 1000}] : null, gqlFetcher, usualOptions)

  const _data = getNestedObject(data, ['data', 'listProducts', 'items'])
  _data?.sort(dynamicSort("prodName"))

  //if (_data) console.log(_data.slice(0,6))

  return({
    data: _data,
    errors: errors
  })
}