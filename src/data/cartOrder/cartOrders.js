import { PICKUP_ZONES } from "../../constants/constants";
import { Data } from "../../utils/dataFns";
import { CartOrder, DBLocation, DBOrder, FulfillmentOption, Exte, ExtendedOrderItem } from "../types.d";



/**
 * Produces an unsorted/unkeyed list of Cart Order objects.
 * 
 * Automatically filters out any holding orders.
 * @param {DBOrder[]} combinedOrders 
 * @returns {CartOrder[]}
 */
const constructCartOrders = (combinedOrders) => {

  const groupedOrders = Data.bucketBy(
    combinedOrders,
    order => `${order.locNick}#${order.delivDate}#${order.isWhole}`
  )
  return groupedOrders.map(itemGroup => constructCartOrder(itemGroup))

}

/**
 * Assumes items represent a single cart order, i.e.
 * all items have same isWhole, locNick, delivDate.
 * 
 * Standing items should have already been 
 * cast to/combined with Order items.
 * 
 * Will filter out holding orders.
 * 
 * @param {DBOrder[]} orderList 
 * @param {DBLocation} location
 * @param {string} delivDate
 * @returns {CartOrder}
 */
const constructCartOrder = (orderList, location, delivDate) => {
  // const { isWhole, locNick, delivDate, ItemNote, route, delivFee } =
  //   orderList.find(item => item.Type === "Orders") ?? orderList[0]

  const cartItem = orderList.find(item => item.Type === "Orders")
  const firstItem = orderList[0]

  const cartRoute = cartItem?.route ?? null
  const overrideRoute = location?.dfFulfill || null
  const defaultRoute = PICKUP_ZONES.includes(location.zoneNick) // type jank: pickup zones are also fulfillment options...
    ? location.zoneNick
    : 'deliv'

  return {
    header: { 
      isWhole: cartItem?.isWhole ?? firstItem?.isWhole ?? true, 
      locNick: location.locNick,
      delivDate, 
      ItemNote: cartItem?.ItemNote ?? firstItem?.ItemNote ?? "",
      route: cartRoute ?? overrideRoute ?? defaultRoute, // type jank; it works despite warnings
      delivFee: cartItem?.delivFee ?? null,
    },
    items: orderList
      .filter(item => item.Type !== 'Holding')
      .map(item => {
        const { id, Type, prodNick, qty, qtyShort, qtyUpdatedOn, sameDayMaxQty, rate, SO, isLate, createdOn, updatedOn, updatedBy, ttl } = item
        return { id, Type, prodNick, qty, qtyShort, qtyUpdatedOn, sameDayMaxQty, rate, SO, isLate, createdOn, updatedOn, updatedBy, ttl, meta: {} }
      
      })
  }

}

/**
 * @param {'Orders'|'Standing'|'Holding'|'Template'} Type
 * @param {string} prodNick
 * @param {number} rate
 * @returns {ExtendedOrderItem}
 */
const constructCartItem = (Type, prodNick, rate, meta) => {

  return {
    id: '',
    Type,
    prodNick,
    qty: 0,
    qtyShort: null,
    qtyUpdatedOn: '',
    sameDayMaxQty: 0,
    rate,
    SO: null,
    isLate: null,
    createdOn: null,
    updatedOn: null,
    updatedBy: null,
    ttl: null,
    meta,
  }

}

export {
  constructCartOrder,
  constructCartItem,
}