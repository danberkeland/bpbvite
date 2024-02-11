import useSWR from "swr"
import { defaultSwrOptions } from "./_constants"

import { useMemo } from "react"
import gqlFetcher from "./_fetchers"
import { getUser } from "../customGraphQL/queries/userQueries"

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
    shouldFetch ? [getUser, { sub: sub }] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  return({ 
    data: useMemo(() => data?.data?.getUser2, [data?.data?.getUser2]), 
    errors,
  })

}