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
    if (errors) console.log('errors', errors)
    
    if (!data) return undefined

    console.log('data', data)

    for (let table of Object.keys(data.data)) {
      //console.log('table', table)
      if (data.data[table].items.length >= LIMIT) {
        console.log(`warning: ${table} has reached query limit of ${LIMIT}.`)
      }
    }

    const _products = data.data.listProducts.items
    const _locations = data.data.listLocations.items
    const _orders = data.data.listOrders.items

    const products = mapProductsToLegacy(_products)
    const customers = mapLocationsToLegacy(_locations, _orders)
    const routes = mapRoutesToLegacy(data.data.listRoutes.items)
    const standing = mapStandingItemsToLegacy(data.data.listStandings.items, _products, _locations)
    const orders = mapOrdersToLegacy(_orders, _products, _locations)
    const doughs = mapDoughsToLegacy(data.data.listDoughBackups.items)
    const doughComponents = mapDoughComponentsToLegacy(data.data.listDoughComponentBackups.items)

    return ([products, customers, routes, standing, orders, doughs, doughComponents])
  }

  const _data = useMemo(transformData, [data])
  if (errors) console.log('errors', errors)

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

const mapLocationsToLegacy = (locations, orders) => {
  const legacyLocations = locations.map(location => {
    const { locNick, locName, subs, zoneNick, ...unchangedAttributes } = location
  
    return ({
      ...unchangedAttributes,
      nickName: locNick,
      custName: locName,
      userSubs: subs.items.map(s => s.sub),
      zoneName: zoneNick
    })
  })

  const retailOrders = orders.filter(order => order.isWhole === false)
  const locNicks = [...new Set(retailOrders.map(order => order.locNick))]

  const retailLocations = locNicks.map(locNick => {
    const matchOrder = retailOrders.find(order => order.locNick === locNick)
    const template = Object.create(blankLegacyLocation)
    return({
      ...template,
      nickName: locNick,
      custName: locNick,
      zoneName: matchOrder.route
    })
  })
  
  console.log("retail locs:", retailLocations)
  return legacyLocations.concat(retailLocations)
}




const mapProductsToLegacy = (products) => products.map(product => {
  const { prodNick, doughNick, isEOD, bakedWhere, ...unchangedAttributes } = product

  let _bakedWhere = bakedWhere.map(str => str[0].toUpperCase() + str.slice(1))
  let legacyBakedWhere = _bakedWhere.includes('Mixed') || _bakedWhere.length > 1 ? ['Mixed'] : _bakedWhere
  
  return ({
    ...unchangedAttributes,
    nickName: prodNick,
    doughType: doughNick,
    eodCount: isEOD,
    bakedWhere: legacyBakedWhere
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

const mapOrdersToLegacy = (orders, products, locations) => orders.map(order => {
  const { prodNick, locNick, ItemNote, delivDate, updatedOn, ...unchangedAttributes } = order

  const matchLocation = locations.find(location => location.locNick === locNick)
  const matchProduct = products.find(product => product.prodNick === prodNick)

  // if (!matchLocation) console.log(order)
  // if (!matchProduct) console.log(order)

  return ({
    ...unchangedAttributes,
    prodName: matchProduct.prodName,
    custName: order.isWhole ? matchLocation.locName : locNick,
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

const mapStandingItemsToLegacy = (standingItems, products, locations) => {
  const productDict = Object.fromEntries(products.map(P => [P.prodNick, P]))
  const locationDict = Object.fromEntries(locations.map(L => [L.locNick, L]))

  let init = {
    items: {},
    duplicates: []
  }
  let _standingItems = standingItems
    .filter(item => item.isWhole)
    .reduce((prev, curr) => {
      let next = {...prev}
      // let locName = curr.location.locName
      // let prodName = curr.product.prodName
      let prodName = productDict[curr.prodNick].prodName
      let locName = locationDict[curr.locNick].locName
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


const blankLegacyLocation = {
  nickName: null,
  custName: null,
  userSubs: [],
  zoneName: null,
  addr1: null,
  addr2: null,
  city: null,
  zip: null,
  email: null,
  phone: null,
  firstName: null,
  lastName: null,
  toBePrinted: null,
  toBeEmailed: null,
  printDuplicate: null,
  terms: null,
  invoicing: null,
  latestFirstDeliv: 7,
  latestFinalDeliv: 13,
  webpageURL: null,
  picURL: null,
  gMap: null,
  specialInstructions: null,
  delivOrder: null,
  qbID: null,
  currentBalance: null,
}