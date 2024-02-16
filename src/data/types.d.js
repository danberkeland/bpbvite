/**@typedef {"deliv"|"slopick"|"atownpick"}*/
let FulfillmentOption

/**@typedef {'Prado'|'Carlton'|'Higuera'}*/
let BpbHub

/**
 * @typedef {Object}
 * @property {boolean} isWhole
 * @property {string} locNick
 * @property {string} delivDate
 * 
 * @property {string} ItemNote
 * @property {FulfillmentOption|null} route Override. Otherwise derived from the location's zone.
 * @property {number|null} delivFee         Override. Otherwise derived from the location's zone.
 */
let OrderHeader

/**
 * @typedef {Object}
 * @property {string} id
 * @property {'Orders'|'Standing'|'Holding'|'Template'} Type
 * @property {string} prodNick
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
 * @property {string|null} updatedOn
 * @property {string|null} updatedBy
 * @property {number|null} ttl
 */
let OrderItem


// /** 
//  * Order item from the DB as fetched by useListData (no join attributes).
//  * @typedef {Object} 
//  * @property {string|null} id primary key (uuid)
//  * 
//  * @property {'Orders'|'Standing'|'Holding'} Type when combining orders, the Type will indicate isStand value
//  * @property {boolean} isWhole   header index
//  * @property {string} delivDate  header index
//  * @property {string} locNick    header index
//  * @property {string} prodNick   item index
//  * 
//  * @property {string|null} ItemNote                header value
//  * @property {FulfillmentOption} route             header value
//  * @property {number|null} delivFee                header value (override)
//  * 
//  * @property {number} qty
//  * @property {number} qtyShort      for invoice corrections
//  * @property {string} qtyUpdatedOn  timestamp, also for applying sameDayMax rule
//  * @property {number} sameDayMaxQty sets upper bound for in-production days
//  * @property {number|null} rate     hard-set/override product's default rate
//  * 
//  * @property {number|null} SO Not used
//  * @property {number|null} isLate Not used
//  * 
//  * @property {string|null} createdOn
//  * @property {string|null} updatedOn
//  * @property {string|null} updatedBy
//  * @property {number|null} ttl
//  */

/**@typedef {OrderHeader & OrderItem} */
let DBOrder

/**@typedef {OrderHeader & { meta:Object }} */
let ExtendedOrderHeader

/**@typedef {OrderItem & { meta:Object }} */
let ExtendedOrderItem

/**@typedef {{ header: ExtendedOrderHeader, items: ExtendedOrderItem[] }} */
let CartOrder

/**
 * Template order item from the DB as fetched by useListData
 * @typedef {Object}
 * @property {string|null}  id
 * @property {boolean} isStand
 * @property {boolean} isWhole
 * @property {string}  dayOfWeek
 * @property {string}  locNick
 * @property {string}  prodNick
 *   
 * @property {string|null} ItemNote
 * @property {FulfillmentOption} route
 * 
 * @property {number} qty
 * 
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} updatedBy
 * 
 * @property {string} startDate not used
 * @property {string} endDate   not used
*/
let DBStanding

/**
 * @typedef {Object}
 * @property {string} zoneNick
 * @property {string} zoneName
 * @property {string|null} description
 * @property {number} zoneFee
 */
let DBZone

/**
 * Template route item from the DB as fetched by useListData
 * @typedef {Object}
 * @property {string} routeNick
 * @property {string} routeName
 * @property {number} routeStart
 * @property {number} routeTime
 * @property {BpbHub} RouteDepart
 * @property {BpbHub} RouteArrive
 * @property {string[]} RouteSched
 * @property {number} printOrder
 * @property {string} driver
 */
let DBRoute

/**
 * @typedef {Object}
 * @property {string} id 
 * @property {string} routeNick 
 * @property {string} zoneNick
 */
let DBZoneRoute

/**
 * @typedef {Object} 
 * @property {string} Type
 * @property {string} locNick
 * @property {string} locName
 * @property {string} zoneNick
 * @property {FulfillmentOption|null} dfFulfill
 * @property {string|null} addr1
 * @property {string|null} addr2
 * @property {string|null} city
 * @property {string|null} zip
 * @property {string} email
 * @property {string|null} orderCnfEmail 
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
 * @property {string|null} gmap
 * @property {string|null} specialInstructions
 * @property {number} delivOrder
 * @property {string} qbID
 * @property {string|null} currentBalance
 * @property {boolean} isActive
 * @property {number|null} ttl
 * @property {string[]|null} requests
 * @property {string} createdAt
 * @property {string} updatedAt
*/
let DBLocation

/**
 * @typedef {Object}
 * @property {string} Type
 * @property {string} prodNick
 * @property {string} prodName
 * @property {string} packGroup
 * @property {number} packSize
 * @property {string} doughNick
 * @property {boolean} freezerThaw
 * @property {number} packGroupOrder
 * @property {number} shapeDay
 * @property {string} shapeNick
 * @property {number} bakeDay
 * @property {string} bakeNick
 * @property {string} guarantee
 * @property {string} transferStage
 * @property {number} readyTime
 * @property {BpbHub[]} bakedWhere
 * @property {number} wholePrice
 * @property {number} retailPrice
 * @property {boolean} isRetail
 * @property {string} retailName
 * @property {string} retailDescrip
 * @property {boolean} isWhole
 * @property {boolean} isEOD
 * @property {number} weight
 * @property {string} descrip
 * @property {string} picURL
 * @property {string} squareID
 * @property {string} forBake
 * @property {number} bakeExtra
 * @property {number} batchSize
 * @property {boolean} defaultInclude
 * @property {number} leadTime
 * @property {number[]} daysAvailable
 * @property {string} qbID
 * @property {number} currentStock
 * @property {string} whoCountedLast
 * @property {number} freezerClosing
 * @property {number} freezerCount
 * @property {number} freezerNorth
 * @property {number} freezerNorthClosing
 * @property {string} freezerNorthFlag
 * @property {number} prepreshaped
 * @property {number} preshaped
 * @property {string} updatePreDate
 * @property {string} updateFreezerDate
 * @property {number} backporchbakerypre
 * @property {number} backporchbakery
 * @property {number} bpbextrapre
 * @property {number} bpbextra
 * @property {number} bpbssetoutpre
 * @property {number} bpbssetout
 * @property {number} sheetMake
 * @property {string} createdAt
 * @property {string} updatedAt
 */
let DBProduct

/**
 * @typedef {Object}
 * @property {string} id
 * @property {string} locNick
 * @property {string} prodNick
 * @property {boolean|null} defaultInclude
 * @property {number|null} leadTime
 * @property {number|null} readyTime
 * @property {[number|null]} daysAvailable
 * @property {number|null} wholePrice
 * @property {string} createdAt
 * @property {string} updatedAt
 */
let DBLocationProductOverride

/**
 * @typedef {Object}
 * @property {string} id 
 * @property {string} locNick 
 * @property {string} prodNick 
 * @property {string} createdAt
 * @property {string} updatedAt
 */
let DBTemplateProd

export {
  DBOrder,
  CartOrder,
  DBStanding,
  DBZone,
  DBRoute,
  DBZoneRoute,
  DBLocation,
  DBLocationProductOverride,
  DBProduct,
  DBTemplateProd,
  BpbHub,
  FulfillmentOption,
  ExtendedOrderHeader,
  ExtendedOrderItem,
}