import useSWR, { mutate } from "swr"
import { useMemo } from "react"

import gqlFetcher from "./fetchers"

import * as queries from "../customGraphQL/queries"
import * as mutations from "../customGraphQL/mutations"

import dynamicSort from "../functions/dynamicSort"
import getNestedObject from "../functions/getNestedObject"

import * as yup from "yup"

const usualOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: true
}

// Parameters become part of the SWR key, so standarizing them will help prevent redundant caches.
const DEFAULT_LIMIT = { limit: 1000 }


/******************
 * QUERIES/CACHES *
 ******************/

/**
 * Produces a full list of locNicks/locNames.
 * @param {boolean} shouldFetch Fetches data only when true.
 * @returns {{ data: Array<{ locNick: string, locName: string }>, errors: object }} A list of locNick ID's and locName text labels.
 */
export const useLocationListSimple = (shouldFetch) => {
  const { data, errors } = useSWR(
    shouldFetch ? [queries.listLocationsSimple, DEFAULT_LIMIT] : null, 
    gqlFetcher, 
    usualOptions
  )

  const transformData = () => {
    if (!data) return undefined
    return getNestedObject(data, ['data', 'listLocations', 'items']).sort(dynamicSort("locName"))
  }
  const _data = useMemo(transformData, [data])

  // const _data = getNestedObject(data, ['data', 'listLocations', 'items'])
  // _data?.sort(dynamicSort("locName"))

  return({
    data: _data,
    errors: errors
  })

}

/**
 * Produces a more extensive list of attributes for a single location.
 * Includes product customization info which can be accessed individually,
 * or as part of the full 'data' return object
 * @param {string} locNick ID value for the desired location.
 * @param {boolean} shouldFetch Fetches data only when true.
 * @returns {{ data: object, templateProds: object, prodsNotAllowed: object, altPrices: object, altLeadTimes: object }}
  } A single object representing the requested location.
 */
export const useLocationDetails = (locNick, shouldFetch) => {

  const { data } = useSWR(
    shouldFetch ? [queries.getLocationDetails, { locNick: locNick }] : null, 
    gqlFetcher, 
    usualOptions
  )
  
  const _data = getNestedObject(data, ['data', 'getLocation'])
  const _templateProds = getNestedObject(data, ['data', 'getLocation', 'templateProd', 'items'])
  const _prodsNotAllowed = getNestedObject(data, ['data', 'getLocation', 'prodsNotAllowed', 'items'])
  const _altPrices = getNestedObject(data, ['data', 'getLocation', 'customProd', 'items'])
  const _altLeadTimes = getNestedObject(data, ['data', 'getLocation', 'altLeadTimeByProduct', 'items'])

  return({ 
    data: _data,
    templateProds: _templateProds,
    prodsNotAllowed: _prodsNotAllowed,
    altPrices: _altPrices,
    altLeadTimes: _altLeadTimes
  })
}


/*************
 * MUTATIONS *
 *************/


export const createLocation = async (createLocationInput) => {

  if (!createLocationSchema.isValid(createLocationInput)) {
    console.log("validation failed for creatLocation")
    return
  }

  const response = await gqlFetcher(mutations.createLocation, { input: createLocationInput })
  console.log(response)

  mutate(
    [queries.listLocationsSimple, DEFAULT_LIMIT], 
    null, 
    { revalidate: true}
  )

  mutate(
    [queries.getLocationDetails, { locNick: createLocationInput.locNick }],
    null,
    { revalidate: true }
  )

}



export const updateLocation = (updateLocationInput) => {

}


export const deleteLocation = (deleteLocationInput) => {

}


/***********
 * SCHEMAS *
 ***********/

const createLocationSchema = yup.object().shape({
  Type: yup.string().default('Location'),
  locNick: yup.string()
    .required("Required")
    .matches(/^[a-z]+$/, "must contain only lowercase letters")
    // .notOneOf(locNicks, "this id is not available.")
    .min(2, "Location ID must have at least 2 characters"),
  locName: yup.string()
    // .notOneOf(locNames, "this name is not available.")
    .required("Required"),

  zoneNick: yup.string(),
  addr1: yup.string(),
  addr2: yup.string(),
  city: yup.string(),
  zip: yup.string(),
  email: yup.array()
    .transform(function(value,originalValue){
      if (this.isType(value) && value !==null) {
        return value;
      }
      return originalValue ? originalValue.split(/[\s,]+/) : [];
    })
    .of(yup.string().email(({ value }) => `${value} is not a valid email`)),
  phone: yup.string()
    .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, "Phone number format xxx-xxx-xxxx"),
  firstName: yup.string(),
  lastName: yup.string(),
  toBePrinted: yup.bool(),
  toBeEmailed: yup.bool(),
  printDuplicate: yup.bool(),
  terms: yup.string(),
  invoicing: yup.string(),
  latestFirstDeliv: yup.number(),
  latestFinalDeliv: yup.number(),
  webpageURL: yup.string(),
  picURL: yup.string(),
  gMap: yup.string(),
  specialInstructions: yup.string(),
  delivOrder: yup.number().integer(),
  qbID: yup.string(),
  currentBalance: yup.string(),
  isActive: yup.bool(),
})

