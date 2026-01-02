import { round } from "lodash"
import { DBLocation, DBOrder, DBProduct } from "../../data/types.d"
import { DateTime } from "luxon"
import { DT } from "../../utils/dateTimeFns"
import { compareBy } from "../../utils/collectionFns"

/**
 * @param {Object} input
 * @param {string} input.prodName typically product prop, esp. when using a qbID, but can be other text - ex: "(No Items)", "DELIVERY"
 * @param {string} [input.Description] optional custom text description. defaults to prodName
 * @param {string|null} input.qbID product prop
 * @param {number} input.rate order prop
 * @param {number} input.qty order prop
 * @param {string} input.delivDate order prop
 */
const getLineItem = ({ prodName, Description, qbID, rate, qty, delivDate }) => ({
  Description: Description ?? prodName,
  DetailType: "SalesItemLineDetail",
  Amount: round(rate * qty, 2),
  SalesItemLineDetail: {
    TaxCodeRef: { value: "TAX" },
    Qty: qty,
    UnitPrice: rate,
    ItemRef: {
      name: prodName,
      value: qbID,
    },
    ServiceDate: delivDate,
    //ClassRef: { value: "3600000000001292604"},
    ItemAccountRef: {
      name: "Uncategorized Income",
    },
  }
})

const getPlaceholderLineItem = delivDate => getLineItem({ 
  prodName: "(No Items)",
  qbID: null,
  rate: 0,
  qty: 0,
  delivDate,
}) 

/**
 * 
 * @param {Object}      input 
 * @param {DateTime}    input.delivDT
 * @param {string}      input.ItemNote
 * @param {string}      input.locNick
 * @param {string}      input.locName
 * @param {string}      input.qbID
 * @param {string|null} input.addr1
 * @param {string|null} input.addr2
 * @param {string|null} input.zip
 * @param {string}      input.email
 * @param {string}      input.terms
 */
const getInvoiceHeader = ({
  delivDT,
  ItemNote, 
  locNick,
  locName,
  qbID,
  addr1,
  addr2,
  zip,
  email,
  terms,
}) => {
  const delivDate = delivDT.toFormat('yyyy-MM-dd')

  return {
    AllowIPNPayment: false,
    AllowOnlinePayment: false,
    AllowOnlineCreditCardPayment: false,
    AllowOnlineACHPayment: true,
    DocNumber: delivDT.toFormat('MMddyyyy') + locNick.slice(0,13),
    TxnDate: delivDate,
    CurrencyRef: { value: "USD", name: "United States Dollar" },
    CustomerRef: { value: qbID, name: locName },
    CustomerMemo: { value: ItemNote || 'na' },
    BillAddr: { Line1: addr1, CountrySubDivisionCode: "CA", PostalCode: zip },
    ShipAddr: { Line1: addr1, Line2: addr2 },
    FreeFormAddress: true,
    ClassRef: { value: "3600000000001292604"},
    SalesTermRef: { name: terms },
    DueDate: delivDT.plus({ days: 15 }).toFormat('yyyy-MM-dd'), // net 15 is the only currently supported option
    ShipDate: delivDate,
    BillEmail: { Address: email },
    domain: "QBO",
    sparse: false, // old code specified true when invoicing !== 'daily', but this is the only currently supported option. Why use a sparse update when the full invoice object is described here anyway?
  }
} 

/** 
 * Returns an invoice object formatted for a QB request, EXCEPT some ID info
 * that we will fetch prior to submitting
 * 
 * @param {DBOrder[]} orders
 * @param {DBLocation} location
 * @param {{[x:string]: DBProduct}} products
 * @param {number} zoneFee
 */
export const makeQbInvoice = (orders, location, products, zoneFee) => {
  const _orders = orders.filter(order => order.rate !== null)
  if (_orders.length < orders.length) {
    console.error("Detected order with rate === null. Assign value first")
    return undefined
  }

  const { locNick, delivDate, ItemNote, route, delivFee } = orders[0]
  const { locName, qbID, addr1, addr2, zip, email, terms } = location
  const delivDT = DT.fromIso(delivDate) 

  const deliveryCharge = delivFee ?? zoneFee
  const shouldChargeDelivery = 1
    && route === 'deliv'
    && orders.some(item => item.qty > (item.qtyShort ?? 0))

  const regularItems = _orders
    .filter(order => order.qty !== 0)
    .sort(compareBy(order => products[order.prodNick].prodName))
    .map(order => 
      getLineItem({
        prodName:    products[order.prodNick].prodName, 
        Description: products[order.prodNick].prodName, 
        qbID:        products[order.prodNick].qbID, 
        rate:        order.rate, // guard statement will prevent execution if null
        qty:         order.qty, 
        delivDate:   order.delivDate
      })
    )

  const correctionItems = _orders
    .filter(order => order.qty > 0 && (order.qtyShort ?? 0) > 0)
    .sort(compareBy(order => products[order.prodNick].prodName))
    .map(order => 
      getLineItem({
        prodName:    products[order.prodNick].prodName, 
        Description: products[order.prodNick].prodName + " - not delivered", 
        qbID:        products[order.prodNick].qbID, 
        rate:        order.rate, // guard statement will prevent execution if null
        qty:         Math.min(order.qty, (order.qtyShort ?? 0)) * -1, 
        delivDate:   delivDate
      })
    )

  const deliveryItem = shouldChargeDelivery ? [
    getLineItem({
      prodName:    "DELIVERY", 
      Description: "DELIVERY", 
      qbID:        null, 
      rate:        deliveryCharge, 
      qty:         1, 
      delivDate:   delivDate
    })
  ] : []

  const invoiceHeader = getInvoiceHeader({
    delivDT,
    ItemNote, 
    locNick,
    locName,
    qbID,
    addr1: addr1,
    addr2: addr2,
    zip: zip,
    email,
    terms,
  })

  const lineItems = regularItems.concat(correctionItems).concat(deliveryItem)
  const Line = lineItems.length ? lineItems : [] //[getPlaceholderLineItem(delivDate)]
  
  return { ...invoiceHeader, Line }

}