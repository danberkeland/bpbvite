import useSWR, { mutate } from "swr"
import { defaultSwrOptions } from "./_constants"

import { useMemo } from "react"

//import dynamicSort from "../functions/dynamicSort"
import getNestedObject from "../functions/getNestedObject"

import gqlFetcher from "./_fetchers"

import * as queries from "../customGraphQL/queries/standingQueries"
import * as mutations from "../customGraphQL/mutations/standingMutations"
import { getDuplicates } from "../functions/detectDuplicates"

//import * as yup from "yup"


/******************
 * QUERIES/CACHES *
 ******************/

/** Fetches ALL standing items for location */
export const useStandingByLocation = (locNick, shouldFetch) => {
  const { data, errors, mutate } = useSWR(
    shouldFetch ? [queries.listStandingByLocation, { locNick: locNick }] : null,
    gqlFetcher, 
    defaultSwrOptions
  )

  // if (data) console.log("Standing list: ", data.data)
  // if (errors) console.log("Standing list errors", errors)
  // const _data = getNestedObject (data, ['data', 'getLocation', 'standing', 'items'])
  const transformData = () => {
    if (!data) return undefined

    const _data = getNestedObject(data, ['data', 'getLocation', 'standing', 'items'])
    const duplicates = getDuplicates(_data, ['product.prodNick', 'dayOfWeek', 'isStand', 'isWhole'])
    if (duplicates.length) {
      console.log("Warning: duplicate standing items detected")
    }
    return _data
  }
  const _data = useMemo(transformData, [data])

  return ({
    data: _data,
    errors: errors,
    mutate: mutate
  })
}

/** 
 * Can be called whenever standingByLocation data is affected by a mutation.
 * Revalidation can be called anywhere, even when useStandingByLocation is not present.
 * @param {String} locNick Location ID attribute.
 */
export const revalidateStandingByLocation = (locNick) => {
  mutate(
    [queries.listStandingByLocation, { locNick: locNick }], 
    null, 
    { revalidate: true}
  )
}


/*************
 * MUTATIONS *
 *************/

const LOGGING = true

export const createStanding = async (createStandingInput) => {
  if (LOGGING) console.log("Create standing input: ", createStandingInput)
  const response = await gqlFetcher(
    mutations.createStanding, 
    { input: createStandingInput }
  )
  if (LOGGING) console.log("Create standing response: ", response)

}

export const updateStanding = async (updateStandingInput) => {
  if (LOGGING) console.log("Update standing input: ", updateStandingInput)
  const response = await gqlFetcher(
    mutations.updateStanding, 
    { input: updateStandingInput }
  )
  if (LOGGING) console.log("Update standing response: ", response)

}

export const deleteStanding = async (deleteStandingInput) => {
  if (LOGGING) console.log("Delete standing input: ", deleteStandingInput)
  const response = await gqlFetcher(
    mutations.deleteStanding,
    { input: deleteStandingInput }
  )
  if (LOGGING) console.log("Delete standing response: ", response)

}


export const useStandingListFull = ({ shouldFetch }) => {
  const query = queries.listStandingsFull

  const { data, ...otherReturns } = useSWR(
    shouldFetch ? [query, { limit: 5000 }] : null,
    gqlFetcher, 
    defaultSwrOptions
  )

  return ({
    data: data?.data.listStandings.items ?? undefined,
    ...otherReturns
  })

}