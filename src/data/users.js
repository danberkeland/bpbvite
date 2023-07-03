import useSWR from "swr"
import { defaultSwrOptions } from "./_constants"

import { useMemo } from "react"

//import dynamicSort from "../functions/dynamicSort"
import getNestedObject from "../functions/getNestedObject"

import gqlFetcher from "./_fetchers"

import * as queries from "../customGraphQL/queries/userQueries"
//import * as mutations from "../customGraphQL/mutations"
//import * as yup from "yup"


/******************
 * QUERIES/CACHES *
 ******************/

/**
 * Produces a full list of locNicks/locNames.
 * @param {boolean} shouldFetch Fetches data only when true.
 * @returns {{ data: Array<{ locNick: string, locName: string }>, errors: object }} A list of locNick ID's and locName text labels.
 */
export const useUserDetails = (sub, shouldFetch) => {
  const { data, errors } = useSWR(
    shouldFetch ? [queries.getUser, { sub: sub }] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  const transformData = () => {
    if (!data) return undefined
    return getNestedObject(data, ['data', 'getUser2'])
  }
  const _data = useMemo(transformData, [data])


  return({
    data: _data,
    errors: errors
  })

}