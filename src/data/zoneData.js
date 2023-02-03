import useSWR from "swr"
import { useMemo } from "react"
import { defaultSwrOptions } from "./constants"

import gqlFetcher from "./fetchers"

import * as queries from "../customGraphQL/queries/zoneQueries"
//import * as mutations from "../customGraphQL/mutations/zoneMutations"

import dynamicSort from "../functions/dynamicSort"
import getNestedObject from "../functions/getNestedObject"

//import * as yup from "yup"

export const useZoneListFull = (shouldFetch) => {
  const { data, errors } = useSWR(
    shouldFetch ? [queries.listZonesFull, { limit: 1000 }] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )
  
  const transformData = () => {
    if (!data) return undefined
    return getNestedObject(data, ['data', 'listZones', 'items']).sort(dynamicSort("zoneName"))
  }
  const _data = useMemo(transformData, [data])

  //console.log("zoneData:", _data)

  return ({
    data: _data,
    errors: errors
  })

}