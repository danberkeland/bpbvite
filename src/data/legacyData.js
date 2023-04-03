import { useMemo } from "react"
import useSWR, { mutate } from "swr"
import { defaultSwrOptions } from "./constants"

import gqlFetcher from "./fetchers"
import * as legacyQueries from "../customGraphQL/queries/legacyQueries"


/**
 * Fetches data from the current database and transforms it to
 * Legacy format. The intent is to make the translation here so
 * that legacy functions that build production reports, etc. can
 * be plugged in without any alteration.
 * 
 * Those functions are housed in legacyDataFunctions.js
 */

const LIMIT = 5000

export const useLegacyFormatDatabase = () => {

  const query = legacyQueries.getLegacyDatabase
  const variables = {
    limit: LIMIT
  }

  const { data, errors } = useSWR(
    [query, variables], 
    gqlFetcher, 
    defaultSwrOptions
  )

  const transformData = () => {
    console.log('errors', errors)
    console.log('data', data)
    if (!data) return undefined

    for (let table of Object.keys(data.data)) {
      console.log('table', table)
      if (data.data[table].items.length >= LIMIT) {
        console.log(`warning: ${table} has reached query limit of ${LIMIT}.`)
      }
    }

    const products = mapProductsToLegacy(data.data.listProducts.items)
    const customers = mapLocationsToLegacy(data.data.listLocations.items)
    const routes = mapRoutesToLegacy(data.data.listRoutes.items)
    const standing = mapStandingItemsToLegacy(data.data.listStandings.items)
    const orders = mapOrdersToLegacy(data.data.listOrders.items)
    const doughs = mapDoughsToLegacy(data.data.listDoughBackups.items)
    const doughComponents = mapDoughComponentsToLegacy(data.data.listDoughComponentBackups.items)

    return ([products, customers, routes, standing, orders, doughs, doughComponents])
  }

  const _data = useMemo(transformData, [data])
  console.log('errors', errors)

  return ({
    data: _data,
    errors: errors
  })


}



// *****MAPPING FUNCTIONS******
//
// Same strategy for most functions:
// For each item, we pick out attributes whose key name
// or value format changes. We also pick out
// attributes that for some reason were fetched, but
// shouldn't be included in the final item/object.
// Attributes that require no manipulation are bundled
// as "...unchangedAttributes".
//
// We return an object with the correct key names
// and/or adjusted value formats.

const mapLocationsToLegacy = (locations) => locations.map(location => {
  const { locNick, locName, subs, zoneNick, ...unchangedAttributes } = location
  
  return ({
    ...unchangedAttributes,
    nickName: locNick,
    custName: locName,
    userSubs: subs.items.map(s => s.sub),
    zoneName: zoneNick
  })
})


const mapProductsToLegacy = (products) => products.map(product => {
  const { prodNick, doughNick, isEOD, ...unchangedAttributes } = product
  
  return ({
    ...unchangedAttributes,
    nickName: prodNick,
    doughType: doughNick,
    eodCount: isEOD
  })
})


const mapRoutesToLegacy = (routes) => routes.map(route => {
  const { routeNick, zoneRoute, ...unchangedAttributes } = route
  
  return ({
    ...unchangedAttributes,
    routeName: routeNick,
    RouteServe: zoneRoute.items.map(zr => zr.zoneNick)
  })
  
})



const yyyymmddToMmddyyyy = (yyyymmddDateString) => {
  const dateParts = yyyymmddDateString.split('-')
  return `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`
}

const mapOrdersToLegacy = (orders) => orders.map(order => {
  const { product, location, ItemNote, delivDate, updatedOn, ...unchangedAttributes } = order

  return ({
    ...unchangedAttributes,
    prodName: product.prodName,
    custName: location.locName,
    SO: order.qty,
    delivDate: yyyymmddToMmddyyyy(delivDate),
    PONote: ItemNote,
    timestamp: updatedOn
  })

})

// legacy standing Attributes:
// prodName: String
// custName: String
// isStand: boolean
// Sun, ..., Sat: Int

// This one is going be more involved, because new standing items only handle
// one day of the week at a time. So we need to combine up to 7 records to 
// recover a legacy standing item.

// we should assume new records are unique combinations of
// locName, prodName, isStand, and dayOfWeek.
// We will key transformed (legacy format) records on the first three,
// and detect possible duplicates when a value is written to the same
// weekday qty attribute more than once.

const mapStandingItemsToLegacy = (standingItems) => {

  let init = {
    items: {},
    duplicates: []
  }
  let _standingItems = standingItems
    .filter(item => item.isWhole)
    .reduce((prev, curr) => {
      let next = {...prev}
      let locName = curr.location.locName
      let prodName = curr.product.prodName
      let isStand = curr.isStand
      let dataKey = `${locName}#${prodName}#${isStand}#`
      if (dataKey in prev.items) {
        if (prev.items[dataKey][curr.dayOfWeek] !== null) next.duplicates = prev.duplicates.concat(curr)
        else next.items[dataKey][curr.dayOfWeek] = curr.qty
      } else {
        next.items[dataKey] = {
          timestamp: curr.updatedAt,
          prodName: prodName,
          custName: locName,
          isStand: isStand,
          Sun: null,
          Mon: null,
          Tue: null,
          Wed: null,
          Thu: null,
          Fri: null,
          Sat: null,
        }
        next.items[dataKey][curr.dayOfWeek] = curr.qty
      }
      return next
    }, init)

  if (_standingItems.duplicates.length) {
    console.log("Warning, duplicate standing items found:")
    console.log(_standingItems.duplicates)
  }

  // set any empty quantities to 0
  let returnItems = Object.values(_standingItems.items).map(item => {
    for (let day of ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]) {
      if (item[day] === null) item[day] = 0
    }
    return item
  })

  return returnItems

}


const mapDoughsToLegacy = (doughs) => doughs.map(dough => {
  const { ...unchangedAttributes } = dough
  
  return ({
    ...unchangedAttributes,
   
  })
  
})


const mapDoughComponentsToLegacy = (doughs) => doughs.map(dough => {
  const { ...unchangedAttributes } = dough
  
  return ({
    ...unchangedAttributes,
   
  })
  
})