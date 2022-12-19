// Only require simple fetching. Data is static while
// using Ordering page.

import { API } from "aws-amplify"
import useSWR from "swr"
import dynamicSort from "../Functions/dynamicSort"
import { getLocationDetails, listLocationNames } from "./gqlQueries"

const gqlFetcher = async (query, variables) => {
  return (
    await API.graphql({
      query: query,
      variables: variables 
    })
  )
}

const usualOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: true
}

/**************
 * SWR Caches *
 **************/

export const useLocationList = (location) => {
  const shouldFetch = location === 'backporch'
  const { data, errors } = useSWR(
    shouldFetch ? listLocationNames : null, 
    gqlFetcher, 
    usualOptions
  )

  let _data
  if (data) {
    _data = [...data.data.listLocations.items]
    _data.sort(dynamicSort("locName"))
  }

  return({
    data: data ? _data : data,
    errors: errors
  })

}

export const useLocationDetails = (location) => {
  const shouldFetch = !!location
  console.log("Should fetch location details? ", shouldFetch)
  const variables = shouldFetch ? {
    locNick: location
  } : null

  const { data, errors } = useSWR(
    shouldFetch ? [getLocationDetails, variables] : null, 
    gqlFetcher, 
    usualOptions
  )

  if (data) console.log("Location Details: ", data.data.getLocation)
  
  return({
    data: data?.data.getLocation,
    errors: errors
  })

}