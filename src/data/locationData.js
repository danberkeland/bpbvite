import useSWR, { mutate } from "swr"
import { defaultSwrOptions } from "./constants"

import { useMemo } from "react"

import dynamicSort from "../functions/dynamicSort"
import getNestedObject from "../functions/getNestedObject"

import gqlFetcher from "./fetchers"

import * as queries from "../customGraphQL/queries/locationQueries"
import * as mutations from "../customGraphQL/mutations/locationMutations"

import * as yup from "yup"


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
    shouldFetch ? [queries.listLocationsSimple, { limit: 1000 }] : null, 
    gqlFetcher, 
    defaultSwrOptions
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
 * Can be called whenever locationListSimple data is affected by a mutation.
 * Revalidation can be called anywhere, even when useLocationListSimple is not present.
 */
export const revalidateLocationListSimple = () => {
  mutate(
    [queries.listLocationsSimple, { limit: 1000 }], 
    null, 
    { revalidate: true}
  )
}


/**
 * Produces a full list of locNicks/locNames.
 * @param {boolean} shouldFetch Fetches data only when true.
 * @returns {{ data: Array<Object>, errors: Object }}
 */
export const useLocationListFull = (shouldFetch) => {
  const { data, errors } = useSWR(
    shouldFetch ? [queries.listLocationsFull, { limit: 1000 }] : null, 
    gqlFetcher, 
    defaultSwrOptions
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
 * Can be called whenever locationListSimple data is affected by a mutation.
 * Revalidation can be called anywhere, even when useLocationListSimple is not present.
 */
export const revalidateLocationListFull = () => {
  mutate(
    [queries.listLocationsFull, { limit: 1000 }], 
    null, 
    { revalidate: true}
  )
}


/**
 * Produces a more extensive list of attributes for a single location.
 * Includes product customization info which can be accessed individually,
 * or as part of the full 'data' return object
 * @param {string} locNick ID value for the desired location.
 * @param {boolean} shouldFetch Fetches data only when true.
 * @returns {{ data: object, templateProds: object, prodsNotAllowed: object, altPrices: object, altLeadTimes: object }} A single object representing the requested location.
 */
export const useLocationDetails = (locNick, shouldFetch) => {

  const { data, errors, mutate, isValidating } = useSWR(
    shouldFetch ? [queries.getLocationDetails, { locNick: locNick }] : null, 
    gqlFetcher, 
    defaultSwrOptions
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
    altLeadTimes: _altLeadTimes,
    errors: errors,
    mutate: mutate,
    isValidating: isValidating
  })
}

/** 
 * Can be called whenever locationDetails data is affected by a mutation.
 * Revalidation can be called anywhere, even when useLocationDetails is not present.
 */
export const revalidateLocationDetails = (locNick) => {
  mutate(
    [queries.getLocationDetails, { locNick: locNick }],
    null,
    { revalidate: true }
  )
}

// consider calling the revalidate functions above after 
// performing one or a batch of mutations below.


/*************
 * MUTATIONS *
 *************/

const LOGGING = true

export const createLocation = async (createLocationInput) => {
  if (LOGGING) console.log("Create location input: ", createLocationInput)

  if (!createLocationSchema.isValid(createLocationInput)) {
    console.log("createLocation validation failed")
    return
  }

  const response = await gqlFetcher(
    mutations.createLocation, 
    { input: createLocationInput }
  )
  if (LOGGING) console.log("Create location response: ", response)

}


export const updateLocation = async (updateLocationInput) => {
  if (LOGGING) console.log("Update location input: ", updateLocationInput)
  const response = await gqlFetcher(
    mutations.updateLocation, 
    { input: updateLocationInput }
  )
  if (LOGGING) console.log("Update location response: ", response)

}


export const deleteLocation = async (deleteLocationInput) => {
  if (LOGGING) console.log("Delete location input: ", deleteLocationInput)
  const response = await gqlFetcher(
    mutations.deleteLocation,
    { input: deleteLocationInput }
  )
  if (LOGGING) console.log("Delete location response: ", response)

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

// const updateLocationSchema = yup.object().shape({
//   Type: yup.string(),
//   locNick: yup.string().required(),
//   locName: yup.string(),
//     // .notOneOf(locNames, "this name is not available.")
//   zoneNick: yup.string(),
//   addr1: yup.string(),
//   addr2: yup.string(),
//   city: yup.string(),
//   zip: yup.string(),
//   email: yup.array()
//     .transform(function(value,originalValue){
//       if (this.isType(value) && value !==null) {
//         return value;
//       }
//       return originalValue ? originalValue.split(/[\s,]+/) : [];
//     })
//     .of(yup.string().email(({ value }) => `${value} is not a valid email`)),
//   phone: yup.string()
//     .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, "Phone number format xxx-xxx-xxxx"),
//   firstName: yup.string(),
//   lastName: yup.string(),
//   toBePrinted: yup.bool(),
//   toBeEmailed: yup.bool(),
//   printDuplicate: yup.bool(),
//   terms: yup.string(),
//   invoicing: yup.string(),
//   latestFirstDeliv: yup.number(),
//   latestFinalDeliv: yup.number(),
//   webpageURL: yup.string(),
//   picURL: yup.string(),
//   gMap: yup.string(),
//   specialInstructions: yup.string(),
//   delivOrder: yup.number().integer(),
//   qbID: yup.string(),
//   currentBalance: yup.string(),
//   isActive: yup.bool(),
// })

// const deleteLocationSchema = yup.object().shape({
//   locNick: yup.string().required()
// })