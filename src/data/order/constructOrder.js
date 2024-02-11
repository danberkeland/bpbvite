import { DBOrder, FulfillmentOption } from "../types.d";

/**
 * @param {'Orders'|'Standing'|'Holding'|'Template'} Type
 * @param {string} locNick
 * @param {string} prodNick
 * @param {string} delivDate
 * @param {boolean} isWhole
 * @param {FulfillmentOption} route
 * @returns {DBOrder}
 */
const constructOrder = (
  Type,
  locNick, 
  prodNick, 
  delivDate, 
  isWhole,
  route,
) => ({
  id: '',
  Type,
  locNick,
  delivDate,
  isWhole,
  prodNick,

  ItemNote: "",
  route,
  delivFee: null,

  qty: 0,
  qtyShort: null,
  qtyUpdatedOn: "",
  sameDayMaxQty: 0,
  rate: null,

  SO: null,
  isLate: null,
  createdOn: null,
  updatedOn: null,
  updatedBy: null,
  ttl: null,

})

export {
  constructOrder
}