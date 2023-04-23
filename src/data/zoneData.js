import { useMemo } from "react"

import useSWR from "swr"
import { defaultSwrOptions } from "./_constants"

import gqlFetcher from "./_fetchers"

import * as queries from "../customGraphQL/queries/zoneQueries"
import { sortBy } from "lodash"

export const useZoneListFull = ({ shouldFetch }) => {
  const { data, errors, mutate } = useSWR(
    shouldFetch ? [queries.listZonesFull, { limit: 1000 }] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )
  
  const transformData = () => {
    if (data) return sortBy(data.data.listZones.items, ["zoneName"])
  }

  return ({
    data: useMemo(transformData, [data]),
    errors,
    mutate
  })

}