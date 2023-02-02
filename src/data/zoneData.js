import useSWR, { mutate } from "swr"
import { useMemo } from "react"

import gqlFetcher from "./fetchers"

import * as queries from "../customGraphQL/queries"
import getNestedObject from "../functions/getNestedObject"
// import * as mutations from "../customGraphQL/mutations"

// import dynamicSort from "../functions/dynamicSort"
// import getNestedObject from "../functions/getNestedObject"

// import * as yup from "yup"

const usualOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: true
}

// Parameters become part of the SWR key, so standarizing them will help prevent redundant caches.
const DEFAULT_LIMIT = { limit: 1000 }

export const useZoneListFull = (shouldFetch) => {
  const { data, errors } = useSWR(
    shouldFetch ? [queries.listZonesFull, DEFAULT_LIMIT] : null, 
    gqlFetcher, 
    usualOptions)
  
  const transformData = () => {
    if (!data) return undefined
    return getNestedObject(data, ['data', 'listZones', 'items'])
  }
  const _data = useMemo(transformData, [data])

  //console.log("zoneData:", _data)

  return ({
    data: _data,
    errors: errors
  })

}