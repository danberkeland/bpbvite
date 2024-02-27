// MARKED FOR DEPRECATION

import useSWR, { mutate } from "swr"
import { defaultSwrOptions } from "./_constants"

import { useMemo } from "react"

import gqlFetcher from "./_fetchers"


import * as yup from "yup"
import { sortBy } from "lodash"

// const listLocationsSimple = /* GraphQL */ `
//   query ListLocations(
//     $locNick: String
//     $filter: ModelLocationFilterInput
//     $limit: Int
//     $nextToken: String
//     $sortDirection: ModelSortDirection
//   ) {
//     listLocations(
//       locNick: $locNick
//       filter: $filter
//       limit: $limit
//       nextToken: $nextToken
//       sortDirection: $sortDirection
//     ) {
//       items {
//         locNick
//         locName
//         ttl
//       }
//     }
//   }
// `;

const listLocationsFull = /* GraphQL */ `
  query ListLocations(
    $locNick: String
    $filter: ModelLocationFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listLocations(
      locNick: $locNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        Type
        locNick
        locName
        subs {
          items {
            sub
          }
        }
        zoneNick
        addr1
        addr2
        city
        zip
        email
        phone
        firstName
        lastName
        toBePrinted
        toBeEmailed
        printDuplicate
        terms
        invoicing
        latestFirstDeliv
        latestFinalDeliv
        webpageURL
        picURL
        gMap
        specialInstructions
        delivOrder
        qbID
        currentBalance
        isActive
        createdAt
        updatedAt
        locationCreditAppId
        prodsNotAllowed {
          items {
            id
            isAllowed
            product {
              prodNick
              prodName
            }
           
          }
          nextToken
        }
        customProd {
          
          items {
            id
            wholePrice
            product {
              prodNick
              prodName
            }
          }
          nextToken
        }
        templateProd {
          
          items {
            id
            product {
              prodName
            }
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;
const getLocationDetails = /* GraphQL */ `
  query GetLocation($locNick: String!) {
    getLocation(locNick: $locNick) {
      Type
      locNick
      locName
      subs {
        items {
          id
          Type
          authType
          locNick
          sub
          createdAt
          updatedAt
        }
        nextToken
      }
      zoneNick
      zone {
        zoneNick
        zoneName
        description
        zoneFee
        zoneRoute {
          items {
            routeNick
          }
        }
        createdAt
        updatedAt
      }
      creditApp {
        id
        firstName
        lastName
        companyName
        phone
        email
        addr1
        addr2
        city
        state
        zip
        locAddr1
        locAddr2
        locCity
        locState
        locZip
        startDate
        businessType
        bankName
        bankPhone
        refName
        refAddr1
        refAddr2
        refCity
        refZip
        refPhone
        refEmail
        refDescrip
        signture
        sigDate
        sigName
        sigTitle
        createdAt
        updatedAt
      }
      addr1
      addr2
      city
      zip
      email
      orderCnfEmail
      phone
      firstName
      lastName
      toBePrinted
      toBeEmailed
      printDuplicate
      terms
      invoicing
      latestFirstDeliv
      latestFinalDeliv
      webpageURL
      picURL
      gMap
      specialInstructions
      delivOrder
      qbID
      currentBalance
      isActive
      ttl
      prodsNotAllowed {
        items {
          id
          isAllowed
          locNick
          prodNick
          createdAt
          updatedAt
        }
        nextToken
      }
      customProd {
        items {
          id
          wholePrice
          locNick
          prodNick
          createdAt
          updatedAt
        }
        nextToken
      }
      templateProd {
        items {
          id
          locNick
          prodNick
          product {
            prodNick
            prodName
            wholePrice
            retailPrice
            daysAvailable
            leadTime
            packSize
          }
          createdAt
          updatedAt
        }
        nextToken
      }
      altLeadTimeByProduct {
        items {
          id
          leadTime
          locNick
          prodNick
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
      locationCreditAppId
    }
  }
`;

const createLocationMutation = /* GraphQL */ `
  mutation CreateLocation(
    $input: CreateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    createLocation(input: $input, condition: $condition) {
      locNick
      createdAt
    }
  }
`;
const updateLocationMutation = /* GraphQL */ `
  mutation UpdateLocation(
    $input: UpdateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    updateLocation(input: $input, condition: $condition) {
      locNick
      createdAt
    }
  }
`;
const deleteLocationMutation = /* GraphQL */ `
  mutation DeleteLocation(
    $input: DeleteLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    deleteLocation(input: $input, condition: $condition) {
      locNick
      createdAt
    }
  }
`;

// /******************
//  * QUERIES/CACHES *
//  ******************/


/**
 * Produces a full list of locNicks/locNames.
 * @param {boolean} shouldFetch Fetches data only when true.
 * @returns {{ data: Array<Object>, errors: Object }}
 */
export const useLocationListFull = (shouldFetch) => {
  const { data, ...otherReturns } = useSWR(
    shouldFetch ? [listLocationsFull, { limit: 1000 }] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  const transformData = () => {
    if (data) return sortBy(data.data.listLocations.items, ['locName'])
  }

  return({
    data: useMemo(transformData, [data]),
    ...otherReturns
  })

}

/** 
 * Can be called whenever locationListSimple data is affected by a mutation.
 * Revalidation can be called anywhere, even when useLocationListSimple is not present.
 */
export const revalidateLocationListFull = () => {
  mutate(
    [listLocationsFull, { limit: 1000 }], 
    null, 
    { revalidate: true}
  )
}


// /**
//  * Produces a more extensive list of attributes for a single location.
//  * Includes product customization info which can be accessed individually,
//  * or as part of the full 'data' return object
//  * @param {string} locNick ID value for the desired location.
//  * @param {boolean} shouldFetch Fetches data only when true.
//  * @returns {{ data: object, templateProds: object, prodsNotAllowed: object, altPrices: object, altLeadTimes: object }} A single object representing the requested location.
//  */
// export const useLocationDetails = (locNick, shouldFetch) => {

//   const { data, errors, mutate, isValidating } = useSWR(
//     shouldFetch ? [getLocationDetails, { locNick: locNick }] : null, 
//     gqlFetcher, 
//     defaultSwrOptions
//   )
  
//   const _data = getNestedObject(data, ['data', 'getLocation'])
//   const _templateProds = getNestedObject(data, ['data', 'getLocation', 'templateProd', 'items'])
//   const _prodsNotAllowed = getNestedObject(data, ['data', 'getLocation', 'prodsNotAllowed', 'items'])
//   const _altPrices = getNestedObject(data, ['data', 'getLocation', 'customProd', 'items'])
//   const _altLeadTimes = getNestedObject(data, ['data', 'getLocation', 'altLeadTimeByProduct', 'items'])

//   return({ 
//     data: _data,
//     templateProds: _templateProds,
//     prodsNotAllowed: _prodsNotAllowed,
//     altPrices: _altPrices,
//     altLeadTimes: _altLeadTimes,
//     errors: errors,
//     mutate: mutate,
//     isValidating: isValidating
//   })
// }

// /** 
//  * Can be called whenever locationDetails data is affected by a mutation.
//  * Revalidation can be called anywhere, even when useLocationDetails is not present.
//  */
// export const revalidateLocationDetails = (locNick) => {
//   mutate(
//     [getLocationDetails, { locNick: locNick }],
//     null,
//     { revalidate: true }
//   )
// }

// // consider calling the revalidate functions above after 
// // performing one or a batch of mutations below.


// /*************
//  * MUTATIONS *
//  *************/

// const LOGGING = true

// export const createLocation = async (createLocationInput) => {
//   if (LOGGING) console.log("Create location input: ", createLocationInput)

//   if (!createLocationSchema.isValid(createLocationInput)) {
//     console.log("createLocation validation failed")
//     return
//   }

//   const response = await gqlFetcher([
//     createLocationMutation, 
//     { input: createLocationInput }
//   ])
//   if (LOGGING) console.log("Create location response: ", response)

// }


// export const updateLocation = async (updateLocationInput) => {
//   if (LOGGING) console.log("Update location input: ", updateLocationInput)
//   const response = await gqlFetcher([
//     updateLocationMutation, 
//     { input: updateLocationInput }
//   ])
//   if (LOGGING) console.log("Update location response: ", response)

// }


// export const deleteLocation = async (deleteLocationInput) => {
//   if (LOGGING) console.log("Delete location input: ", deleteLocationInput)
//   const response = await gqlFetcher([
//     deleteLocationMutation,
//     { input: deleteLocationInput }
//   ])
//   if (LOGGING) console.log("Delete location response: ", response)

// }


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