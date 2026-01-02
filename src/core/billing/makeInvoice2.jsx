import { round } from "lodash"
import { DBLocation, DBOrder, DBProduct } from "../../data/types.d"
import { DateTime } from "luxon"
import { DT } from "../../utils/dateTimeFns"

//  QB Layer
// **********
// Specify the shape of QB Data, static vs. mutable properties

/**
 * Generates the header portion of the QB Invoice.
 * The invoice will not be valid for submitting unless
 * the Line property has at least 1 item in it.
 * @param {Object}      input 
 * @param {string}      input.DocNumber Standard format is the MMddyyyy date + locNick; max 21 chars
 * @param {string}      input.TxnDate yyyy-MM-dd date; e.g. the delivDate
 * @param {string}      input.CustomerRef_name locName
 * @param {string}      input.CustomerRef_value the location's qbID
 * @param {string}      input.CustomerMemo_value order.itemNote; max 1000 chars
 * @param {string|null} input.Line1 Location.addr1
 * @param {string|null} input.Line2 Location.addr2
 * @param {string|null} input.PostalCode Location.zip
 * @param {string}      input.SalesTermRef_name Location.terms
 * @param {string}      input.DueDate TxnDate plus nDays specified by terms; e.g. TxnDate + 15 days
 * @param {string}      input.ShipDate yyyy-MM-dd date; also typically the delivDate
 * @param {string}      input.BillEmail_Address
 */
const makeInvoiceHeader = ({
  DocNumber,
  TxnDate,
  CustomerRef_name,
  CustomerRef_value,
  CustomerMemo_value,
  Line1,
  Line2,
  PostalCode,
  SalesTermRef_name,
  DueDate,
  ShipDate,
  BillEmail_Address,
}) => {

  return {
    AllowIPNPayment: false,
    AllowOnlinePayment: false,
    AllowOnlineCreditCardPayment: false,
    AllowOnlineACHPayment: true,
    DocNumber,
    TxnDate,
    CurrencyRef: { value: "USD", name: "United States Dollar" },
    CustomerRef: { name: CustomerRef_name, value: CustomerRef_value },
    CustomerMemo: { value: CustomerMemo_value || 'na' },
    BillAddr: { Line1, CountrySubDivisionCode: "CA", PostalCode },
    ShipAddr: { Line1, Line2 },
    FreeFormAddress: true,
    //ClassRef: { value: "3600000000001292604", name: "Wholesale" },
    SalesTermRef: { name: SalesTermRef_name },
    DueDate,
    ShipDate,
    BillEmail: { Address: BillEmail_Address },
    domain: "QBO",
    sparse: false, // old code specified true when invoicing !== 'daily', but this is the only currently supported option. Why use a sparse update when the full invoice object is described here anyway?
    Line: [] 
  }
} 

/**
 * @param {Object}      input
 * @param {string}      input.Description usually prodName, but can be any description. max 4000 chars
 * @param {number}      input.UnitPrice the order's effective rate 
 * @param {number}      input.Qty
 * @param {string}      input.ItemRef_name i.e. Product.prodName
 * @param {string|null} input.ItemRef_value i.e. Product.qbID
 * @param {string}      input.ServiceDate delivDate
 */
const makeLineItem = ({ 
  Description, 
  UnitPrice, 
  Qty, 
  ItemRef_name,
  ItemRef_value, 
  ServiceDate 
}) => ({
  DetailType: "SalesItemLineDetail",
  Description,
  SalesItemLineDetail: {
    TaxCodeRef: { value: "TAX" },
    Qty,
    UnitPrice,
    ItemRef: { name: ItemRef_name, value: ItemRef_value},
    ServiceDate,
    //ClassRef: { value: "3600000000001292604"},
    //ItemAccountRef: { name: "Uncategorized Income" },
  },
  Amount: round(UnitPrice * Qty, 2), // number, not (numeric) string
})



//  Interface Layer
// *****************
// Define maps between our app's data and QB Data

/**
 * @param {string} delivDate yyyy-mm-dd format
 * @param {string} locNick 
 * @returns 
 */
const makeDocNumber = (delivDate, locNick) => {
  const [yyyy, mm, dd] = delivDate.split('-')
  return (mm + dd + yyyy + locNick).slice(0, 21)
}

/**
 * @typedef {Object} ToQBInvoiceHeaderLocationProps
 * @property {string}      locNick
 * @property {string}      locName
 * @property {string}      qbID
 * @property {string|null} addr1
 * @property {string|null} addr2
 * @property {string|null} zip
 * @property {string}      terms
 * @property {string}      email
 */

/**
 * @typedef {Object} ToQBInovoiceHeaderOrderProps
 * @property {string} delivDate
 * @property {string} ItemNote
 */

/**
 * Generates the header portion of the QB Invoice.
 * The invoice will not be valid for submitting unless
 * the Line property has at least 1 item in it. This function only
 * returns a header with "Line: []".
 * @param {Object} input
 * @param {ToQBInvoiceHeaderLocationProps} input.location 
 * @param {ToQBInovoiceHeaderOrderProps} input.orderHeader
 * @returns 
 */
const toQBInvoiceHeader = ({
  location: { locNick, locName, qbID, addr1, addr2, zip, terms, email },
  orderHeader: { delivDate, ItemNote },
}) => (
  makeInvoiceHeader({
    DocNumber: makeDocNumber(delivDate, locNick),
    TxnDate: delivDate,
    CustomerRef_name: locName,
    CustomerRef_value: qbID,
    CustomerMemo_value: ItemNote,
    Line1: addr1,
    Line2: addr2,
    PostalCode: zip,
    SalesTermRef_name: terms,
    DueDate: DT.fromIso(delivDate).plus({ days: 15 }).toFormat('yyyy-MM-dd'), // net 15 is the only supported option
    ShipDate: delivDate,
    BillEmail_Address: email,
  })
)

/**
 * @typedef {Object} ToQBInvoiceLineItemProductProps
 * @property {string} prodName
 * @property {string} qbID
 */

/**
 * @typedef {Object} ToQBInvoiceLineItemOrderProps
 * @property {number} qty
 * @property {number} rate
 * @property {string} delivDate
 */

/**
 * @typedef {Object} ToQBInvoiceLineItemCorrectionOrderProps
 * @property {number} qty
 * @property {number|null} qtyShort
 * @property {number} rate
 * @property {string} delivDate
 */

/**
 * Remember to use the rate as derived/calculated for the order,
 * Which could be the product's default price, or a customer-specific
 * default (specified in LocationProductOverrides), or a custom price
 * set on a per-order basis.
 * @param {Object} input
 * @param {ToQBInvoiceLineItemProductProps} input.product
 * @param {ToQBInvoiceLineItemOrderProps} input.orderItem
 * @param {string} [input.description] The line item description defaults to the product's prodName if not specified.
 * @returns 
 */
const toQBInvoiceLineItem = ({ 
  product: { prodName, qbID },
  orderItem: { rate, qty, delivDate },
  description,
}) => makeLineItem({
  Description: description ?? prodName,
  UnitPrice: rate, 
  Qty: qty, 
  ItemRef_name: prodName,
  ItemRef_value: qbID, 
  ServiceDate: delivDate
})

/**
 * Remember to use the rate as derived/calculated for the order,
 * Which could be the product's default price, or a customer-specific
 * default (specified in LocationProductOverrides), or a custom price
 * set on a per-order basis.
 * @param {Object} input
 * @param {ToQBInvoiceLineItemProductProps} input.product
 * @param {ToQBInvoiceLineItemCorrectionOrderProps} input.orderItem
 * @param {string} [input.description] The line item description defaults to the product's prodName if not specified.
 */
export const toQBInvoiceLineItemCorrection = ({ 
  product: { prodName, qbID },
  orderItem: { rate, qty, qtyShort, delivDate },
  description,
}) => makeLineItem({
  Description: description ?? (`${prodName} - not delivered`),
  UnitPrice: rate, 
  Qty: Math.min(qtyShort ?? 0, qty) * -1, 
  ItemRef_name: prodName,
  ItemRef_value: qbID, 
  ServiceDate: delivDate
})


/**
 * Previous API versions defaulted to the product/service with Id = '1' for some reason,
 * so we didn't specify it in the app. New version turns line items without an Item Id into
 * Description-only lines, so we need to explicitly define it.
 * @param {Object} input
 * @param {number} input.delivFee The associated zoneFee, or the custom delivFee defined in the order items
 * @param {string} input.delivDate yyyy-mm-dd format 
 * @returns 
 */
const toQBInvoiceDeliveryLineItem = ({
  delivFee,
  delivDate,
}) => makeLineItem({
  Description: "DELIVERY",
  UnitPrice: delivFee,
  Qty: 1,
  ItemRef_name: "Sales",
  ItemRef_value: "1", 
  ServiceDate: delivDate
})



export {
  toQBInvoiceHeader,
  toQBInvoiceLineItem,
  toQBInvoiceDeliveryLineItem,
}