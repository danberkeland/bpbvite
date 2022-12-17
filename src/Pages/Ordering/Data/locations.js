// Only require simple fetching. Data is static while
// using Ordering page.

import { API } from "aws-amplify"
import useSWR from "swr"
import { listLocationNames } from "./gqlQueries"

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

export const useLocationList = (location) => {
  const shouldFetch = location === 'backporch'
  const { data, errors } = useSWR(shouldFetch ? listLocationNames : null, gqlFetcher, usualOptions)

  console.log("location list (head): ", data?.data.listLocations.items.slice(0, 5))

  return({
    data: data?.data.listLocations.items,
    errors: errors
  })

}