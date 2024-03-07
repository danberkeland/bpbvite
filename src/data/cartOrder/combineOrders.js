import { isoToDT } from "../../Pages/Production/NewPages/BPBN/utils.js"
import { uniqBy } from "../../utils/collectionFns/uniqBy.js"
/**@typedef {import('../types.d.js').DBOrder} DBOrder*/
/**@typedef {import('../types.d.js').DBStanding} DBStanding*/

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
 * @param {DBOrder[]} orders 
 * @param {DBStanding[]} standingOrders 
 * @param {string[]} [optDates] - Optional list of ISO dates; will force generation of combined orders on explicit dates
 * @returns {DBOrder[][]}
*/
const _combineOrdersGrug = (
  orders,
  standingOrders,
  optDates,
) => {
  const dates = !!optDates
    ? uniqBy(optDates, x => x)
    : uniqBy(orders.map(order => order.delivDate), x => x)

  return dates.length 
    ? dates.map(delivDate => {
        const dayOfWeek = isoToDT(delivDate).toFormat('EEE')
        const _sByDate = standingOrders
          .filter(S => S.dayOfWeek === dayOfWeek)
          .map(S => toOrder(S, delivDate))
          
        const O =   orders.filter(O => O.delivDate === delivDate)
        const S = _sByDate.filter(S => S.Type === "Standing")
        const H = _sByDate.filter(S => S.Type === "Holding")

        return uniqBy(
          [...O, ...S, ...H],
          item => `${item.isWhole}#${item.locNick}#${item.prodNick}`
        )
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