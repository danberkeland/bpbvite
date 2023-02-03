import useSWR, { mutate } from "swr"
import { defaultSwrOptions } from "./constants"

import { useMemo } from "react"

import dynamicSort from "../functions/dynamicSort"
import getNestedObject from "../functions/getNestedObject"

import gqlFetcher from "./fetchers"

import * as queries from "../customGraphQL/queries/productQueries"
import * as mutations from "../customGraphQL/mutations/productMutations"

import * as yup from "yup"


/******************
 * QUERIES/CACHES *
 ******************/

/** Fetches ALL standing items for location */
export const useStandingByLocation = (locNick, shouldFetch) => {
  const { data, errors } = useSWR(
    shouldFetch ? [queries.listStandingByLocation, { locNick: locNick }] : null,
    gqlFetcher, 
    defaultSwrOptions
  )

  // if (data) console.log("Standing list: ", data.data)
  // if (errors) console.log("Standing list errors", errors)
  
  const _data = getNestedObject (data, ['data', 'getLocation', 'standing', 'items'])


  return ({
    data: _data,
    errors: errors
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