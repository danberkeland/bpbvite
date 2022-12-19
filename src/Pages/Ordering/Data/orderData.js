// OrderData.js
//
// fetch cart orders by location & delivery date
// fetch all standing orders by location


import { API } from "aws-amplify"
import useSWR from "swr"
import { dateToMmddyyyy } from "../Functions/dateAndTime"
import * as queries from "./gqlQueries"

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

export const useOrdersByLocationByDate = (location, delivDate) => {
  const shouldFetch = !!location && !!delivDate; console.log("Fetch cart orders? ", shouldFetch)
  const variables = shouldFetch ? {
    locNick: location,
    delivDate: dateToMmddyyyy(delivDate)
  } : null
  console.log("Variables: ", variables)
  const { data, errors } = useSWR(
    shouldFetch ? [queries.listOrdersByLocationByDate, variables] : null, 
    gqlFetcher, 
    usualOptions
  )

  if (data) console.log("Order list: ", data.data)
  if (errors) console.log("Order list errors", errors)

  return({
    data: data?.data.getLocation.ordersByDate.items,
    errors: errors
  })
}

export const useStandingByLocation = (location, delivDate) => {
  const shouldFetch = !!location && !!delivDate; console.log("Fetch Standing? ", shouldFetch)
  const variables = shouldFetch ? {
    locNick: location
  } : null

  const { data, errors } = useSWR(
    shouldFetch ? [queries.listStandingByLocation, variables] : null,
    gqlFetcher, 
    usualOptions
  )

  if (data) console.log("Standing list: ", data.data)
  if (errors) console.log("Standing list errors", errors)

  return({
    data: data?.data.getLocation.standing.items,
    errors: errors
  })
}
