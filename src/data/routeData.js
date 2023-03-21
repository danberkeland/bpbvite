import useSWR, { mutate } from "swr"
import { defaultSwrOptions } from "./constants"

// import { useMemo } from "react"

// import dynamicSort from "../functions/dynamicSort"
import getNestedObject from "../functions/getNestedObject"

import gqlFetcher from "./fetchers"

import * as queries from "../customGraphQL/queries/routeQueries"

// import * as yup from "yup"

export const useRouteListFull = (shouldFetch) => {
  let query = queries.listRoutesFull
  let variables = { limit: 1000 }

  const { data, errors } = useSWR(
    shouldFetch ? [query, variables] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  // const transformData = () => {
  //   if (!data) return undefined
  //   return getNestedObject(data, ['data', 'listLocations', 'items']).sort(dynamicSort("locName"))
  // }
  // const _data = useMemo(transformData, [data])

  // const _data = getNestedObject(data, ['data', 'listLocations', 'items'])
  // _data?.sort(dynamicSort("locName"))

  return({
    data: getNestedObject(data, ['data', 'listRoutes', 'items']),
    errors: errors
  })

  
}