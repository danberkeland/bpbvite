
import { compareBy, groupByArray, groupByArrayN, uniqByRdc } from "../../utils/collectionFns"
import { uniqBy } from "../../utils/collectionFns/uniqBy.js"
import { DT } from "../../utils/dateTimeFns.js"
/**@typedef {import('../../data/types.d.js').DBOrder} DBOrder*/
/**@typedef {import('../../data/types.d.js').DBStanding} DBStanding*/

const isoToDT = isoDate => DT.fromIso(isoDate)

/**
 * For compiling cart/combined orders. 
 * Casts Standing item to comply with Order spec.
 * 
 * Does not validate the delivDate! 
 * Ensure the standing item's dayOfWeek is equivalent to the input delivDate.
 * @param {DBStanding} standing
 * @param {string} delivDate
 * @returns {DBOrder} 
 */
const toOrder = (standing, delivDate) => {

  const { 
    isStand,
    isWhole, 
    locNick, 
    prodNick,
    ItemNote,
    route,
    qty,
    updatedAt,
    updatedBy,
  } = standing

  return {
    id: null,
    Type: isStand ? "Standing" : "Holding",
    isWhole,
    delivDate,
    locNick, 
    prodNick,
    ItemNote: ItemNote ?? '',
    route,
    delivFee: null,
    qty,
    qtyShort: 0,
    qtyUpdatedOn: '',
    sameDayMaxQty: qty,
    rate: null,
    SO: null,
    isLate: null,
    createdOn:'',
    updatedOn:updatedAt,
    updatedBy,
    ttl: null,
  }

}


const TypeOrderingFn = Type => {
  const char0 = Type[0]

  return char0 === "O" ? 0 // "Orders"
    : char0 === "S" ? 1    // "Standing"
    : char0 === "H" ? 2    // "Holding"
    : char0 === "T" ? 3    // "Template"
    : 4
}


// "Grug developer" implementation of combineOrders.
// Less efficient (though maybe efficient enough), 
// but with emphasis on being easier to verify correctness.

/**
 * Intended for use with data returned by useOrders/useStandings-type hooks.
 * 
 * Function will avoid duplicate orders, but will not choose among duplicates
 * with any strategy other than keeping the first one encountered. Validating
 * & deduplicating should be handled elsewhere.
 * @param {DBOrder[]} orders 
 * @param {DBStanding[]} standingOrders 
 * @param {string[]} [optDates] - Optional list of ISO dates; will force generation of combined orders on explicit dates. If omitted, dates will be parsed form the orders list.
 * @returns {DBOrder[]} each nested group of orders corresponds to a date
*/
const _combineOrdersGrug = (
  orders,
  standingOrders,
  optDates,
) => {
  const dates = !!optDates
    ? uniqBy(optDates, x => x)
    : uniqBy(orders.map(order => order.delivDate), x => x).sort(compareBy(x => x))

  if (!dates.length) return []

  // Iterating over each delivDate is necessary 
  // since standings map 1-to-N with orders
  // Can edit the "rules" for uniqueness here.
  //
  // For future, if we want to allow N orders per date,
  // we can add a comparison function for it here.
  const allStandings = dates.flatMap(delivDate => {
    const dayOfWeek = isoToDT(delivDate).toFormat('EEE')
    return standingOrders
      .filter(S => S.dayOfWeek === dayOfWeek)
      .sort(compareBy(S => S.isStand, 'desc')) // puts standing before holding
      .map(S => toOrder(S, delivDate))
      
  })

  const allOrders = groupByArrayN([...orders, ...allStandings], [
    order => order.isWhole,
    order => order.locNick,
    order => order.delivDate,
  ])

  // Kinda jank as this clashes with the Standing table's usage of the 
  // route attribute, but as of now application logic does not handle
  // standing orders with other route values well.
  return allOrders
    .map(orderSet => {
      const cartOrder = orderSet.find(order => order.Type === "Orders")
      const effectiveRoute = !!cartOrder ? cartOrder.route : 'deliv'

      return orderSet
        .sort(compareBy(order => TypeOrderingFn(order.Type)))
        .reduce(uniqByRdc(order => order.prodNick), [])
        .map(order => ({ ...order, route: effectiveRoute }))

    })
    .flat()
    .map(order => order.isWhole ? order : ({ ...order, Type: 'Retail' }))


  // old strategy: deprecated b/c it doesn't ensure that all items belonging
  // to the same order have the same route attribute. In the future we should
  // make sure that any edit to a standing order causes a full overwrite, so
  // that no decision logic is necessary at the individual attribute level.

  // return dates.map(delivDate => {
  //   const dayOfWeek = isoToDT(delivDate).toFormat('EEE')
  //   const _sByDate = standingOrders
  //     .filter(S => S.dayOfWeek === dayOfWeek)
  //     .map(S => toOrder(S, delivDate))
      
  //   const O =   orders.filter(O => O.delivDate === delivDate)
  //   const S = _sByDate.filter(S => S.Type === "Standing")
  //   const H = _sByDate.filter(S => S.Type === "Holding")

  //   return uniqByN([...O, ...S, ...H], [
  //     order => order.isWhole,
  //     order => order.locNick,
  //     order => order.prodNick,
  //     order => order.delivDate,
  //   ])
  // })

}

/**
 * Intended for use with data returned by useOrders/useStandings-type hooks.
 * 
 * Does not filter out holding orders.
 * @param {DBOrder[]} orders 
 * @param {DBStanding[]} standingOrders 
 * @param {string[]} [optDates] - Optional list of ISO dates; will force generation of combined orders on explicit dates
 * @returns {DBOrder[]}
*/
const combineOrders = (orders, standingOrders, optDates) =>
  _combineOrdersGrug(orders, standingOrders, optDates)

/**
 * Intended for use with data returned by useOrders/useStandings-type hooks.
 * Orders remain grouped by date as a nested array.
 * 
 * Does not filter out holding orders.
 * @param {DBOrder[]} orders 
 * @param {DBStanding[]} standingOrders 
 * @param {string[]} [optDates] - Optional list of ISO dates; will force generation of combined orders on explicit dates
 * @returns {DBOrder[][]}
*/
const combineOrdersGrouped = (orders, standingOrders, optDates) =>
  groupByArray(
    _combineOrdersGrug(orders, standingOrders, optDates),
    order => order.delivDate
    
  ).sort(compareBy(orderSet => orderSet[0].delivDate))

export { 
  combineOrders,
  combineOrdersGrouped
}