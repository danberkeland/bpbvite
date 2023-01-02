import useSWR from "swr"
import dynamicSort from "../Functions/dynamicSort"
import { getNestedObject } from "../Functions/getNestedObject"
import { gqlFetcher } from "./fetchers"
import { getLocationDetails, listLocationNames } from "./gqlQueries"



const usualOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: true
}



export const useLocationList = (shouldFetch) => {
  const { data, errors } = useSWR(
    shouldFetch ? [listLocationNames, {limit: 1000}] : null, 
    gqlFetcher, 
    usualOptions
  )

  const _data = getNestedObject(data, ['data', 'listLocations', 'items'])
  _data?.sort(dynamicSort("locName"))

  return({
    data: _data,
    errors: errors
  })

}



export const useLocationDetails = (location) => {
  const shouldFetch = !!location
  const variables = shouldFetch ? { locNick: location } : null

  const { data } = useSWR(
    shouldFetch ? [getLocationDetails, variables] : null, 
    gqlFetcher, 
    usualOptions
  )
  
  const _data = getNestedObject(data, ['data', 'getLocation'])
  const _prodsNotAllowed = getNestedObject(data, ['data', 'getLocation', 'prodsNotAllowed'])
  const _altPrices = getNestedObject(data, ['data', 'getLocation', 'customProd'])

  // return({
  //   data: _data,
  //   errors: errors
  // })

  return({ 
    data: _data,
    prodsNotAllowed: _prodsNotAllowed,
    altPrices: _altPrices
  })
}


