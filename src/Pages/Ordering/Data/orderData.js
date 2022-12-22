import useSWR from "swr"
import { dateToMmddyyyy } from "../Functions/dateAndTime"
import { getNestedObject } from "../Functions/getNestedObject"
import { gqlFetcher } from "./fetchers"
import * as queries from "./gqlQueries"

const usualOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
}



export const useOrdersByLocationByDate = (location, delivDate) => {
  const shouldFetch = !!location && !!delivDate
  const variables = shouldFetch ? {
    locNick: location,
    delivDate: dateToMmddyyyy(delivDate)
  } : null
  // if (shouldFetch) console.log("Fetching cart data...")
  const { data, errors } = useSWR(
    shouldFetch ? [queries.listOrdersByLocationByDate, variables] : null, 
    gqlFetcher, 
    usualOptions
  )

  // if (data) console.log("Cart Data response: ", data)
  // if (errors) console.log("Cart Data errors", errors)
  const _data = getNestedObject(data, ['data', 'getLocation', 'ordersByDate', 'items'])

  return({
    data: _data,
    errors: errors,
  })
}



/** Fetches ALL standing items for location, but fetch is suppressed until delivDate is specified */
export const useStandingByLocation = (location, delivDate) => {
  const shouldFetch = !!location && !!delivDate
  const variables = shouldFetch ? {
    locNick: location
  } : null
  // if (shouldFetch) console.log("Fetching standing data...")
  const { data, errors } = useSWR(
    shouldFetch ? [queries.listStandingByLocation, variables] : null,
    gqlFetcher, 
    usualOptions
  )

  // if (data) console.log("Standing list: ", data.data)
  // if (errors) console.log("Standing list errors", errors)
  const _data = getNestedObject (data, ['data', 'getLocation', 'standing', 'items'])

  return({
    data: _data,
    errors: errors
  })
}


