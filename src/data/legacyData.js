import { useMemo } from "react"
import { sortBy } from "lodash"
import { useProducts } from "./product/useProducts"
import { BpbHub, DBDoughBackup, DBDoughComponentBackup, DBInfoQBAuth, DBLocation, DBLocationUser2, DBOrder, DBProduct, DBRoute, DBStanding, DBZoneRoute, FulfillmentOption } from "./types.d"
import { uniqByRdc } from "../utils/collectionFns/uniqByRdc"
import { useLocations } from "./location/useLocations"
import { useOrders } from "./order/useOrders"
import { useLocationUser2s } from "./locationUser2/useLocationUser2"
import { compareBy } from "../utils/collectionFns/compareBy"
import { useRoutes } from "./route/useRoutes"
import { useZoneRoutes } from "./zoneRoute/useZoneRoutes"
import { useInfoQBAuths } from "./infoQBAuths/useInfoQBAuths"
import { useStandings } from "./standing/useStandings"
import { useDoughs } from "./dough/useDoughs"
import { useDoughComponents } from "./doughComponent/useDoughComponents"

const shouldFetch = true

export const useLegacyProducts = () => {
  const { data:PRD } = useProducts({ shouldFetch })
  const calculateValue = () => !!PRD 
    ? sortBy(PRD.map(productToLegacy), 'prodName') 
    : undefined

  return { data: useMemo(calculateValue, [PRD]) }
}

// export const useLegacyLocations = () => {
//   const { data:LOC } = useLocations({ shouldFetch })
//   const { data:ORD } = useOrders({ shouldFetch })
//   const { data:LCU } = useLocationUser2s({ shouldFetch })

//   const calculateValue = () => !!LOC && !!ORD && LCU
//     ? sortBy(mapLocationsToLegacy(LOC, ORD, LCU), 'custName') 
//     : undefined

//   return { data: useMemo(calculateValue, [LOC, ORD, LCU]) }
// }

export const useLegacyCustomers = () => {
  const { data:LOC } = useLocations({ shouldFetch })
  const { data:ORD } = useOrders({ shouldFetch })
  const { data:LCU } = useLocationUser2s({ shouldFetch })

  const calculateValue = () => (!!LOC && !!ORD && !!LCU)
    ? mapLocationsToLegacy(LOC, ORD, LCU).sort(compareBy(C => C.custName))
    : undefined

  return { data: useMemo(calculateValue, [LOC, ORD, LCU]) }
}

export const useLegacyRoutes = () => {
  const { data:RTE } = useRoutes({ shouldFetch })
  const { data:ZRT } = useZoneRoutes({ shouldFetch })
  const calculateValue = () => (!!RTE && !!ZRT) 
    ? sortBy(mapRoutesToLegacy(RTE, ZRT), 'routeStart')
    : undefined

  return { data: useMemo(calculateValue, [RTE, ZRT]) }
}

export const useLegacyStanding = () => {
  const { data:STD } = useStandings({ shouldFetch }) //useListData({ tableName: "Standing", shouldFetch })
  const { data:PRD } = useProducts({ shouldFetch })
  const { data:LOC } = useLocations({ shouldFetch })
  const calculateValue = () => (!!STD && !!PRD && !!LOC)
    ? sortBy(mapStandingItemsToLegacy(STD, PRD, LOC), 'timeStamp')
    : undefined

  return { data: useMemo(calculateValue, [STD, PRD, LOC]) }
}

export const useLegacyOrders = () => {
  const { data:ORD } = useOrders({ shouldFetch })
  const { data:PRD } = useProducts({ shouldFetch })
  const { data:LOC } = useLocations({ shouldFetch })
  const calculateValue = () => (!!ORD && !!PRD && !!LOC)
    ? sortBy(mapOrdersToLegacy(ORD, PRD, LOC), 'prodName')
    : undefined

  return { data: useMemo(calculateValue, [ORD, PRD, LOC]) }
}

// Current system is in same format as legacy system for doughs
export const useLegacyDoughs = () => {
  const { data:DGH } = useDoughs({ shouldFetch })
  const calculateValue = () => !!DGH 
    ? mapDoughsToLegacy(DGH)
    : undefined

  return { data: useMemo(calculateValue, [DGH]) }
}

export const useLegacyDoughComponents = () => {
  const { data:DCP } = useDoughComponents({ shouldFetch })
  const calculateValue = () => !!DCP 
    ? mapDoughComponentsToLegacy(DCP)
    : undefined

  return { data: useMemo(calculateValue, [DCP]) }
}


export const useLegacyInfoQBAuths = () => {
  const { data:IQB } = useInfoQBAuths({ shouldFetch })
  
  return { data: IQB }
}

/** @typedef {[LegacyProduct[], LegacyCustomer[], LegacyRoute[], LegacyStanding[], LegacyOrder[], DBDoughBackup[], DBDoughComponentBackup[], [], DBInfoQBAuth[]]} */ export let LegacyDatabase

/**
 * Fetches data from the current database and transforms it to
 * Legacy format. The intent is to make the translation here so
 * that legacy functions that build production reports, etc. can
 * be plugged in without any alteration.
 * 
 * Those functions are housed in legacyDataFunctions.js
 *
 * Legacy sources have been broken into individual hooks. We can call the full
 * Database here for compatibility with legacy functions, or call the individual
 * tables if we wish to incrementally improve efficiency of those functions.
 * 
 * As before, all data can be traced back to some primitive useListData caches,
 * so mutation/revalidation can be efficiently handled with those.
 * @returns {{ data: (LegacyDatabase | undefined) }}
*/
export const useLegacyFormatDatabase = () => {
  const { data:PRD } = useLegacyProducts()
  const { data:CUS } = useLegacyCustomers()
  const { data:RTE } = useLegacyRoutes()
  const { data:STD } = useLegacyStanding()
  const { data:ORD } = useLegacyOrders()
  const { data:DGH } = useLegacyDoughs()
  const { data:DCP } = useLegacyDoughComponents()
  // alt?? codebase shows reference to another table here, but not sure if it's used
  const { data:IQB } = useLegacyInfoQBAuths()

  // order is important! original order:
  // [products, customers, routes, standing, orders, doughs, doughComponents]

  /** @returns {LegacyDatabase | undefined} */
  const calcValue = () => (PRD && CUS && RTE && STD && ORD && DGH && DCP && IQB)
    ? [PRD, CUS, RTE, STD, ORD, DGH, DCP, [], IQB]
    : undefined
   
  return ({ data: useMemo(calcValue, [PRD, CUS, RTE, STD, ORD, DGH, DCP, IQB]) })

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


/**
 * @typedef {Object} 
 * @property {string} nickName
 * @property {string} custName
 * @property {string[]} userSubs
 * @property {string} zoneName
 * @property {string|null} addr1
 * @property {string|null} addr2
 * @property {string|null} city
 * @property {string|null} zip
 * @property {string} email
 * @property {string|null} phone 
 * @property {string|null} firstName
 * @property {string|null} lastName
 * @property {boolean} toBeEmailed
 * @property {boolean} toBePrinted
 * @property {boolean} printDuplicate
 * @property {string} terms
 * @property {string} invoicing
 * @property {number} latestFirstDeliv
 * @property {number} latestFinalDeliv
 * @property {string|null} webpageURL 
 * @property {string|null} picURL
 * @property {string|null} gMap
 * @property {string|null} specialInstructions
 * @property {number} delivOrder
 * @property {string} qbID
 * @property {string|null} currentBalance
 */
export let LegacyCustomer

/**
 * 
 * @param {DBLocation[]} locations 
 * @param {DBOrder[]} orders 
 * @param {DBLocationUser2[]} locationUsers 
 * @returns {LegacyCustomer[]}
 */
const mapLocationsToLegacy = (locations, orders, locationUsers) => {
  const legacyLocations = locations.map(location => {
    const { locNick, locName, zoneNick, ...unchangedAttributes } = location
  
    return ({
      ...unchangedAttributes,
      nickName: locNick,
      custName: locName,
      userSubs: locationUsers.filter(lu => lu.locNick === locNick).map(lu => lu.userID),
      zoneName: zoneNick
    })
  })

  const retailLocations = orders
    .filter(order => order.isWhole === false)
    .reduce(uniqByRdc(order => order.locNick), [])
    .map(order => {
      const template = Object.create(blankLegacyCustomer)
      return ({
        ...template,
        nickName: order.locNick,
        custName: order.locNick,
        zoneName: order.route    // << will be slopick or atownpick
      })
    })

  return legacyLocations.concat(retailLocations)
}


/**
 * @typedef {Object}
 * @property {string}   Type
 * @property {string}   nickName - prddNick in new system
 * @property {string}   prodName
 * @property {string}   packGroup
 * @property {number}   packSize
 * @property {string}   doughType - doughNick in new system
 * @property {boolean}  freezerThaw
 * @property {number}   packGroupOrder
 * @property {number}   shapeDay
 * @property {string}   shapeNick
 * @property {number}   bakeDay
 * @property {string}   bakeNick
 * @property {string}   guarantee
 * @property {string}   transferStage
 * @property {number}   readyTime
 * @property {string[]} bakedWhere - new system lists out hubs; here we use 'Mixed'
 * @property {number}   wholePrice
 * @property {number}   retailPrice
 * @property {boolean}  isRetail
 * @property {string}   retailName
 * @property {string}   retailDescrip
 * @property {boolean}  isWhole
 * @property {boolean}  eodCount - isEOD in new system
 * @property {number}   weight
 * @property {string}   descrip
 * @property {string}   picURL
 * @property {string}   squareID
 * @property {string}   forBake
 * @property {number}   bakeExtra
 * @property {number}   batchSize
 * @property {boolean}  defaultInclude
 * @property {number}   leadTime
 * @property {number[]} daysAvailable
 * @property {string}   qbID
 * @property {number}   currentStock
 * @property {string}   whoCountedLast
 * @property {number}   freezerClosing
 * @property {number}   freezerCount
 * @property {number}   freezerNorth
 * @property {number}   freezerNorthClosing
 * @property {string}   freezerNorthFlag
 * @property {number}   prepreshaped
 * @property {number}   preshaped
 * @property {string}   updatePreDate
 * @property {string}   updateFreezerDate
 * @property {number}   backporchbakerypre
 * @property {number}   backporchbakery
 * @property {number}   bpbextrapre
 * @property {number}   bpbextra
 * @property {number}   bpbssetoutpre
 * @property {number}   bpbssetout
 * @property {number}   sheetMake
 * @property {string}   createdAt
 * @property {string}   updatedAt
 */
export let LegacyProduct

/**
 * 
 * @param {DBProduct} product
 * @returns {LegacyProduct}
 */
const productToLegacy = product => {
  const { prodNick, doughNick, isEOD, bakedWhere, ...unchangedAttributes } = product

  const _bakedWhere = bakedWhere.map(str => str[0].toUpperCase() + str.slice(1))
  // let legacyBakedWhere = _bakedWhere.includes('Mixed') || _bakedWhere.length > 1 ? ['Mixed'] : _bakedWhere
  const legacyBakedWhere = _bakedWhere.length > 1 
    ? ['Mixed']
    : _bakedWhere

  return {
    ...unchangedAttributes,
    nickName: prodNick,
    doughType: doughNick,
    eodCount: isEOD,
    bakedWhere: legacyBakedWhere
  }
}


/**
 * Template route item from the DB as fetched by useListData
 * @typedef {Object}
 * @property {string} routeName
 * @property {number} routeStart
 * @property {number} routeTime
 * @property {BpbHub} RouteDepart
 * @property {BpbHub} RouteArrive
 * @property {string[]} RouteSched
 * @property {number} printOrder
 * @property {string} driver
 * @property {string[]} RouteServe
 */
export let LegacyRoute


/**
 * 
 * @param {DBRoute[]} routes 
 * @param {DBZoneRoute[]} zoneRoutes 
 * @returns {LegacyRoute[]}
 */
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


/**
 * @typedef {Object}
 * @property {boolean} isWhole
 * @property {string} custName
 * @property {string} delivDate
 * 
 * @property {string} PONote
 * @property {FulfillmentOption|null} route Override. Otherwise derived from the location's zone.
 * @property {number|null} delivFee         Override. Otherwise derived from the location's zone.
 *
 * @property {string | null} id
 * @property {'Orders'|'Standing'|'Holding'|'Template'} Type
 * @property {string} prodName
 * 
 * @property {number} qty
 * @property {number|null} qtyShort Optional. Should not be larger than qty
 * @property {string} qtyUpdatedOn
 * @property {number} sameDayMaxQty Update with qty value on 1st change after daily cutoff.
 * @property {number|null} rate     Override. Otherwise derived from product/product override.
 * 
 * @property {number|null} SO     Not used
 * @property {number|null} isLate Not used
 * 
 * @property {string|null} createdOn
 * @property {string|null} timestamp
 */
export let LegacyOrder

/**
 * 
 * @param {DBOrder[]} orders 
 * @param {DBProduct[]} products 
 * @param {DBLocation[]} locations 
 * @returns {LegacyOrder[]}
 */
const mapOrdersToLegacy = (orders, products, locations) => orders.map(order => {
  const { prodNick, locNick, ItemNote, delivDate, updatedOn, updatedBy, ...unchangedAttributes } = order

  const matchLocation = locations.find(location => location.locNick === locNick)
  const matchProduct = products.find(product => product.prodNick === prodNick)

  // if (!matchLocation) console.log(order)
  // if (!matchProduct) console.log(order)

  return ({
    ...unchangedAttributes,
    prodName: matchProduct?.prodName ?? 'ERROR',
    custName: order.isWhole ? (matchLocation?.locName ?? 'ERROR') : locNick,
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

/**
 * Template order item from the DB as fetched by useListData
 * @typedef {Object}
 * @property {string} timeStamp: String
 * @property {string} prodName: String
 * @property {string} custName: String
 * @property {boolean} isStand: Boolean
 * @property {number} Sun: Int
 * @property {number} Mon: Int
 * @property {number} Tue: Int
 * @property {number} Wed: Int
 * @property {number} Thu: Int
 * @property {number} Fri: Int
 * @property {number} Sat: Int
*/
export let LegacyStanding

/**
 * 
 * @param {DBStanding[]} standingItems 
 * @param {DBProduct[]} products 
 * @param {DBLocation[]} locations 
 * @returns {LegacyStanding[]}
 */
const mapStandingItemsToLegacy = (standingItems, products, locations) => {
  const productDict = Object.fromEntries(products.map(P => [P.prodNick, P]))
  const locationDict = Object.fromEntries(locations.map(L => [L.locNick, L]))

  /**@type {{[k:string]: LegacyStanding}} */
  let items = {}
  let duplicates = []

  for (let S of standingItems) {
    const dataKey = `${S.locNick}#${S.prodNick}#${S.isStand}`

    if (!items.hasOwnProperty(dataKey)) {

      /**@type {LegacyStanding} */
      let newItem = {
        timeStamp: S.updatedAt, // not gonna be accurate....
        prodName: productDict[S.prodNick].prodName,
        custName: locationDict[S.locNick].locName,
        isStand: S.isStand,
        Sun: Infinity, // wacky coding to appease the linter by not using null.
        Mon: Infinity,
        Tue: Infinity,
        Wed: Infinity,
        Thu: Infinity,
        Fri: Infinity,
        Sat: Infinity,
      }
      newItem[S.dayOfWeek] = S.qty
      items[dataKey] = newItem

    } else {
      if (items[dataKey][S.dayOfWeek] === Infinity) {
        items[dataKey][S.dayOfWeek] = S.qty
      } else {
        duplicates.push(S)
      }

    }

  }

  if (duplicates.length) {
    console.log("Warning, duplicate standing items found:")
    console.log(duplicates)
  }

  const legacyItems = Object.values(items).map(item => {
    for (let day of ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]) {
      if (item[day] === Infinity) item[day] = 0
    }
    return item
  })

  return legacyItems

  // let init = {
  //   items: {},
  //   duplicates: []
  // }
  // let _standingItems = standingItems
  //   .filter(item => item.isWhole)
  //   .reduce((prev, curr) => {
  //     let next = {...prev}
  //     // let locName = curr.location.locName
  //     // let prodName = curr.product.prodName
  //     let prodName = productDict[curr.prodNick].prodName
  //     let locName = locationDict[curr.locNick].locName
  //     let isStand = curr.isStand
  //     let dataKey = `${locName}#${prodName}#${isStand}#`
  //     if (dataKey in prev.items) {
  //       if (prev.items[dataKey][curr.dayOfWeek] !== null) next.duplicates = prev.duplicates.concat(curr)
  //       else next.items[dataKey][curr.dayOfWeek] = curr.qty
  //     } else {
  //       next.items[dataKey] = {
  //         timestamp: curr.updatedAt,
  //         prodName: prodName,
  //         custName: locName,
  //         isStand: isStand,
  //         Sun: null,
  //         Mon: null,
  //         Tue: null,
  //         Wed: null,
  //         Thu: null,
  //         Fri: null,
  //         Sat: null,
  //       }
  //       next.items[dataKey][curr.dayOfWeek] = curr.qty
  //     }
  //     return next
  //   }, init)

  // if (_standingItems.duplicates.length) {
  //   console.log("Warning, duplicate standing items found:")
  //   console.log(_standingItems.duplicates)
  // }

  // set any empty quantities to 0
  // let returnItems = Object.values(_standingItems.items).map(item => {
  //   for (let day of ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]) {
  //     if (item[day] === null) item[day] = 0
  //   }
  //   return item
  // })

  // return returnItems

}


/**
 * 
 * @param {DBDoughBackup[]} doughs 
 * @returns {DBDoughBackup[]}
 */
const mapDoughsToLegacy = (doughs) => doughs.map(dough => {
  const { ...unchangedAttributes } = dough
  
  return ({
    ...unchangedAttributes,
   
  })
  
})


/**
 * 
 * @param {DBDoughComponentBackup[]} doughs 
 * @returns {DBDoughComponentBackup[]}
 */
const mapDoughComponentsToLegacy = (doughs) => doughs.map(dough => {
  const { ...unchangedAttributes } = dough
  
  return ({
    ...unchangedAttributes,
   
  })
  
})



/**@type {LegacyCustomer} */
const blankLegacyCustomer = {
  nickName: '',
  custName: '',
  userSubs: [],
  zoneName: '',
  addr1: null,
  addr2: null,
  city: null,
  zip: null,
  email: '',
  phone: null,
  firstName: null,
  lastName: null,
  toBePrinted: false,
  toBeEmailed: false,
  printDuplicate: false,
  terms: '',
  invoicing: '',
  latestFirstDeliv: 7,
  latestFinalDeliv: 13,
  webpageURL: null,
  picURL: null,
  gMap: null,
  specialInstructions: null,
  delivOrder: 0,
  qbID: '',
  currentBalance: null,
}