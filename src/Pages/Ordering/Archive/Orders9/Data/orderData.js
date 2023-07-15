import useSWR from "swr"
import { dateToYyyymmdd, getTransitionDates } from "../Functions/dateAndTime"
import { getNestedObject } from "../Functions/getNestedObject"
import { gqlFetcher } from "./fetchers"
import * as queries from "./gqlQueries"

const usualOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
}



export const useOrdersByLocationByDate = (location, delivDate, shouldFetch) => {
  const variables = shouldFetch ? {
    locNick: location,
    delivDate: dateToYyyymmdd(delivDate)
  } : null
  // if (shouldFetch) console.log("Fetching cart data...")
  const { data, mutate } = useSWR(
    shouldFetch ? [queries.listOrdersByLocationByDate, variables] : null, 
    gqlFetcher, 
    usualOptions
  )

  // if (data) console.log("Cart Data response: ", data)
  // if (errors) console.log("Cart Data errors", errors)
  
  const _data = getNestedObject(data, ['data', 'getLocation', 'ordersByDate', 'items'])

  // return({
  //   data: _data,
  //   errors: errors,
  // })

  return ({
    data: _data,
    mutate: mutate
  })
}


/** Fetches ALL standing items for location */
export const useStandingByLocation = (location, shouldFetch) => {
  const variables = shouldFetch ? {
    locNick: location
  } : null
  // if (shouldFetch) console.log("Fetching standing data...")
  const { data, mutate } = useSWR(
    shouldFetch ? [queries.listStandingByLocation, variables] : null,
    gqlFetcher, 
    usualOptions
  )

  // if (data) console.log("Standing list: ", data.data)
  // if (errors) console.log("Standing list errors", errors)
  
  const _data = getNestedObject (data, ['data', 'getLocation', 'standing', 'items'])

  // return({
  //   data: _data,
  //   errors: errors
  // })

  return ({
    data: _data,
    mutate: mutate
  })
}

/**
 * Specialized fetcher to retrieve cart orders from the current working date
 * to 3 days after.
 */
export const fetchTransitionOrders = async (location) => {
  const transitionDates = getTransitionDates()

  const query = queries.transitionOrdersByLocByDelivDate
  const variables = {
    locNick: location,
    delivDate: {between: [transitionDates[0], transitionDates[3]]}
  }

  const data = (await gqlFetcher([query, variables])).data.orderByLocByDelivDate.items

  return data
}