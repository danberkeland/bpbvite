
import { isoToDT } from "../../Pages/Production/NewPages/BPBN/utils.js"
import { compareBy, uniqByN } from "../../utils/collectionFns"
import { uniqBy } from "../../utils/collectionFns/uniqBy.js"
/**@typedef {import('../../data/types.d.js').DBOrder} DBOrder*/
/**@typedef {import('../../data/types.d.js').DBStanding} DBStanding*/

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
    createdOn:null,
    updatedOn:null,
    updatedBy: null,
    ttl: null,
  }

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
 * @returns {DBOrder[][]} each nested group of orders corresponds to a date
*/
const _combineOrdersGrug = (
  orders,
  standingOrders,
  optDates,
) => {
  const dates = !!optDates
    ? uniqBy(optDates, x => x)
    : uniqBy(orders.map(order => order.delivDate), x => x).sort(compareBy(x => x))

  // Iterating over each delivDate is necessary 
  // since standings map 1-to-N with orders
  // Can edit the "rules" for uniqueness here.
  //
  // For future, if we want to allow N orders per date,
  // we can add a comparison function for it here.
  const uniquenessFns = [
    order => order.isWhole,
    order => order.locNick,
    order => order.prodNick,
  ]

  return dates.length 
    ? dates.map(delivDate => {
        const dayOfWeek = isoToDT(delivDate).toFormat('EEE')
        const _sByDate = standingOrders
          .filter(S => S.dayOfWeek === dayOfWeek)
          .map(S => toOrder(S, delivDate))
          
        const O =   orders.filter(O => O.delivDate === delivDate)
        const S = _sByDate.filter(S => S.Type === "Standing")
        const H = _sByDate.filter(S => S.Type === "Holding")

        return uniqByN([...O, ...S, ...H], uniquenessFns)
      })
    : [[]]
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
  _combineOrdersGrug(orders, standingOrders, optDates).flat()

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
_combineOrdersGrug(orders, standingOrders, optDates)

export { 
  combineOrders,
  combineOrdersGrouped
}