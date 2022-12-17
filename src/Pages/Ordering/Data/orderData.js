// OrderData.js
//
// fetch cart orders by location & delivery date
// fetch all standing orders by location


import { API } from "aws-amplify"
import useSWR from "swr"
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

export const useOrdersByLocationByDate = (location, delivDate) => {
  const shouldFetch = location && delivDate
  const variables = {
    locNick: locNick,
    delivDate: delivDate
  }
  const { data, errors } = useSWR(shouldFetch ? queries.listOrdersByLocationByDate : null, gqlFetcher, usualOptions)

  console.log("location list (head): ", data?.data.listLocations.items.slice(0, 5))

  return({
    data: data?.data.listLocations.items,
    errors: errors
  })
}
