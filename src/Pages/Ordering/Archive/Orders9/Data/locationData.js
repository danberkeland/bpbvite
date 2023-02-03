import useSWR from "swr"
import dynamicSort from "../Functions/dynamicSort"
import { getNestedObject } from "../Functions/getNestedObject"
import { gqlFetcher } from "./fetchers"
import { getLocationDetails, listLocationDetails, listLocationNames } from "./gqlQueries"



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


export const useLocationDetailedList = (shouldFetch) => {
  const { data, isError, isLoading } = useSWR(
    shouldFetch ? [listLocationDetails, {limit: 1000}] : null, 
    gqlFetcher, 
    usualOptions
  )

  const _data = getNestedObject(data, ['data', 'listLocations', 'items'])
  _data?.sort(dynamicSort("locName"))


  return({
    data: _data,
    isError: isError,
    isLoading: isLoading
  })

}



export const useLocationDetails = (location, shouldFetch) => {
  const variables = shouldFetch ? { locNick: location } : null

  const { data } = useSWR(
    shouldFetch ? [getLocationDetails, variables] : null, 
    gqlFetcher, 
    usualOptions
  )
  
  const _data = getNestedObject(data, ['data', 'getLocation'])
  console.log('_data', _data && _data.zone.zoneNick)
  
  
  if (_data){
    _data.zoneNick = _data.zone.zoneNick
  }
  
  const _templateProds = getNestedObject(data, ['data', 'getLocation', 'templateProd', 'items'])
  const _prodsNotAllowed = getNestedObject(data, ['data', 'getLocation', 'prodsNotAllowed', 'items'])
  const _altPrices = getNestedObject(data, ['data', 'getLocation', 'customProd', 'items'])
  const _altLeadTimes = getNestedObject(data, ['data', 'getLocation', 'altLeadTimeByProduct', 'items'])

  return({ 
    data: _data,
    templateProds: _templateProds,
    prodsNotAllowed: _prodsNotAllowed,
    altPrices: _altPrices,
    altLeadTimes: _altLeadTimes
  })
}


