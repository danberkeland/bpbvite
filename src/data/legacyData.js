import { useMemo } from "react"
import { useListData } from "./_listData"
import { sortBy } from "lodash"

/**
 * Fetches data from the current database and transforms it to
 * Legacy format. The intent is to make the translation here so
 * that legacy functions that build production reports, etc. can
 * be plugged in without any alteration.
 * 
 * Those functions are housed in legacyDataFunctions.js
 */


/**
 * Data is now broken up into separate SWR sources, so updating values
 * and revalidating can happen through one of the primary hooks, which
 * is less costly.
 */
export const useLegacyFormatDatabase = () => {
  const { data:_products } = useListData({ tableName: "Product", shouldFetch: true})
  const { data:_locations } = useListData({ tableName: "Location", shouldFetch: true})
  const { data:_locationUsers } = useListData({ tableName: "LocationUser", shouldFetch: true})
  const { data:_routes } = useListData({ tableName: "Route", shouldFetch: true})
  const { data:_zoneRoutes } = useListData({ tableName: "ZoneRoute", shouldFetch: true})
  const { data:_standing } = useListData({ tableName: "Standing", shouldFetch: true})
  const { data:_orders } = useListData({ tableName: "Order", shouldFetch: true})
  const { data:_doughs } = useListData({ tableName: "DoughBackup", shouldFetch: true})
  const { data:_doughComponents } = useListData({ tableName: "DoughComponentBackup", shouldFetch: true})

  const transformData = () => {
    if ([
      _products, _locations, _locationUsers, 
      _routes, _zoneRoutes, _standing, 
      _orders, _doughs, _doughComponents
    ].some(data => !data)) return undefined

    const products = sortBy(
      mapProductsToLegacy(_products), 
      'prodName'
    )
    const customers = sortBy(
      mapLocationsToLegacy(_locations, _orders, _locationUsers), 
      'custName'
    )
    const routes = sortBy(
      mapRoutesToLegacy(_routes, _zoneRoutes),
      'routeStart'
    )
    const standing = sortBy(
      mapStandingItemsToLegacy(_standing, _products, _locations),
      'timeStamp'
    )
    const orders = sortBy(
      mapOrdersToLegacy(_orders, _products, _locations),
      'prodName'
    )
    const doughs = mapDoughsToLegacy(_doughs)
    const doughComponents = mapDoughComponentsToLegacy(_doughComponents)

    return ([products, customers, routes, standing, orders, doughs, doughComponents])
  }

  const transformedData = useMemo(
    transformData, 
    [
      _products, _locations, _locationUsers, 
      _routes, _zoneRoutes, _standing, 
      _orders, _doughs, _doughComponents
    ]
  )

  return ({
    data: transformedData
  })

}

// export const revalidateLegacyDatabases = () => {
//   mutate([legacyQueries.getLegacyDatabase, { limit: LIMIT }], null, { revalidate: true });
// };

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

const mapLocationsToLegacy = (locations, orders, locationUsers) => {
  const legacyLocations = locations.map(location => {
    const { locNick, locName, zoneNick, ...unchangedAttributes } = location
  
    return ({
      ...unchangedAttributes,
      nickName: locNick,
      custName: locName,
      userSubs: locationUsers.filter(lu => lu.locNick === locNick).map(lu => lu.sub),
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



const mapRoutesToLegacy = (routes, zoneRoutes) => routes.map(route => {
  const { routeNick, ...unchangedAttributes } = route
  
  return ({
    ...unchangedAttributes,
    routeName: routeNick,
    RouteServe: zoneRoutes.filter(zr => zr.routeNick === routeNick).map(zr => zr.zoneNick)
  })
  
})



const yyyymmddToMmddyyyy = (yyyymmddDateString) => {
  const dateParts = yyyymmddDateString.split('-')
  return `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`
}

const mapOrdersToLegacy = (orders, products, locations) => orders.map(order => {
  const { prodNick, locNick, ItemNote, delivDate, updatedOn, updatedBy, ...unchangedAttributes } = order

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