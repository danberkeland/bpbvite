import { filter, flow, groupBy, keyBy, map, mapValues, sortBy } from "lodash/fp"
import { useListData } from "../../../data/_listData"
import { useProdOrdersByDate } from "../../../data/useT0T7ProdOrders"
import { useMemo } from "react"
import { DateTime } from "luxon"
import { round } from "lodash"

// convert order items to qb invoice object

//    Pure order data is not sufficient to generate a qb invoice.
//    We require 
//      * product info:
//        - prodNames for display
//        - unit prices, as they are not listed on standing orders
//      * altPrices to look up any special unit price overrides
//      * location info:
//        - locName for display
//        - zoneNick to lookup zoneFee
//      * zone info
//        - get zoneFee

//    V1 treated invoice objects as static data, which
//    felt a little awkward in cases where order data needed to be changed
//    to produce a new invoice.
//
//    In V2 we treat the the invoice as a function
//    of order items.
//
//    In this version (V3) we remodel the "order object" more like it appears
//    in the cart order page. We will try "normaizing" the cart/standing items
//    by deriving a separate header object, leaving the items array with
//    objects that contain only line-item-specific attributes.
//
//    We need to be able to convert a standing line-item to a cart line-item
//    when a line field changes, and convert the entire order to cart records
//    when a header field changes.
//
//    header-level changes need to apply to all cart records, including those
//    we might not want to display (e.g. where qty = 0)
//
//    A header should contain { locNick, delivDate, route, ItemNote, delivFee }
//    Line Item objects should contain...
//      { Type, id, prodNick, qty, qtyShort, sameDayMaxQty qtyUpdatedOn, updatedBy }
//    additionally, lines should contain the helper info"
//      { }

// submit single invoice (with email option flag)


// submit batch invoices (with email option flag)

/**
 * @param {Object} input - kwargs
 * @param {string} input.reportDate - yyyy-MM-dd formatted string
 * @param {boolean} input.shouldFetch
 * @returns 
 */
export const useBillingDataByDate = ({ reportDate, shouldFetch }) => {

  // produces retail & holding orders; need to filter out
  const { data:orders } = useProdOrdersByDate({ 
    reportDate, 
    shouldFetch,
    shouldAddRoutes: false,
  })
  const { data:LOC } = useListData({ 
    tableName: "Location", 
    shouldFetch
  })
  const { data:PRD } = useListData({ 
    tableName: "Product", 
    shouldFetch
  })
  const { data:ZNE } = useListData({ 
    tableName: "Zone", 
    shouldFetch
  })
  const { data:APR } = useListData({ 
    tableName: "AltPricing", 
    shouldFetch
  })

  // console.log(orders, LOC, PRD, ZNE, APR)

  const calculateValue = () => {
    if (!LOC || !ZNE) {
      return { 
        data: undefined, 
        convertOrderToInvoice: () => {},
        locations: undefined, 
        zones: undefined,
      }
    }

    /**@type {Object} Keyed with locNick values */
    const locations = keyBy('locNick')(LOC)
    /**@type {Object} Keyed with zoneNick values */
    const zones = keyBy('zoneNick')(ZNE)

    if (!orders || !PRD  || !APR) {
      return { 
        data: undefined, 
        convertOrderToInvoice: () => {}, 
        locations, 
        zones,
      }
    }

    const products = keyBy('prodNick')(PRD)
    const altPrices = keyBy(apr =>`${apr.locNick}#${apr.prodNick}`)(APR)

    const convertOrderToInvoice = ({ cartOrder }) => makeInvoice({
      cartOrder, 
      location: locations[cartOrder.header.locNick], 
      products,
      zoneFee: zones[locations[cartOrder.header.locNick].zoneNick].zoneFee
    })

    const invoicesByLocNick = flow(
      filter(order =>
        order.isWhole === true
        && order.isStand !== false
        // && order.qty !== 0  
      ),
      map(order => {
        return {
          ...order,
          qtyShort: order.qtyShort ?? null,
          rate: order.rate
            ?? altPrices[`${order.locNick}#${order.prodNick}`]?.wholePrice
            ?? products[order.prodNick].wholePrice
        }
      }),
      groupBy('locNick'),
      mapValues(orderItems => {
        const location = locations[orderItems[0].locNick]
        const { header, items } = makeCartOrder({ orderItems, location })
        return { header, items }
      })
    )(orders)

    return {
      data: invoicesByLocNick, 
      convertOrderToInvoice,
      locations,
      zones,
    }
  }

  const { data, convertOrderToInvoice, locations, zones } =
    useMemo(calculateValue, [orders, LOC, PRD, ZNE, APR])

  return { 
    data, 
    convertOrderToInvoice,
    locations,
    zones,
  }

}






/** 
 * orderItems is assumed to represent a complete order for a given location, 
 * on a given date. Decisions about whether to use a standing or cart order
 * item is assumed to have already been made. Moreover, unit prices ('rate') 
 * are assumed to be present on all items.
 * 
 * Returns an invoice object formatted for a QB request, EXCEPT some ID info
 * that we will fetch prior to submitting
 * 
 * We are building out a mechanism for reporting shorted qtys. A sensible
 * restriction would be to make sure the shorted qty does not exceed the 
 * ordered qty, but we can't gurantee that orders will be handled in a way that
 * enforces this rule across the app. So, we will override any poorly-formed
 * order items at the point of invoice generation, limiting the max qtyShort
 * to no more than the qty.
 */
const makeInvoice = ({ cartOrder, location, products, zoneFee }) => {
  const { locNick, delivDate, ItemNote, route, delivFee } = cartOrder.header
  const { locName, qbID, addr1, addr2, zip, email, terms } = location

  const delivDateDT = DateTime
    .fromFormat(delivDate, 'yyyy-MM-dd', { zone: 'America/Los_Angeles' })

  const deliveryCharge = delivFee ?? zoneFee
  const shouldChargeDelivery = (
    route === 'deliv'
    && cartOrder.items.some(item => (item.qty > 0) && (item.qty > item.qtyShort))
  )

  const regularItems = flow(
    filter(item => item.qty !== 0),
    map(item => ({
      Description: products[item.prodNick].prodName,
      DetailType: "SalesItemLineDetail",
      Amount: round(item.rate * item.qty, 2),
      SalesItemLineDetail: {
        TaxCodeRef: { value: "TAX" },
        Qty: item.qty,
        UnitPrice: item.rate,
        ItemRef: {
          name: products[item.prodNick].prodName,
          value: products[item.prodNick]?.qbID ?? null,
        },
        ServiceDate: delivDate,
        ItemAccountRef: {
          name: "Uncategorized Income",
        },
      },
    })),
    sortBy('SalesItemLineDetail.ItemRef.name')
  )(cartOrder.items)

  const correctionItems = flow(
    filter(item => item.qty > 0 && item.qtyShort > 0),
    map(item => ({
      Description: products[item.prodNick].prodName + " - not delivered",
      DetailType: "SalesItemLineDetail",
      Amount: round(item.rate * Math.min(item.qty, item.qtyShort) * -1, 2), // should not allow net qty < 0.
      SalesItemLineDetail: {
        TaxCodeRef: { value: "TAX" },
        Qty: Math.min(item.qty, item.qtyShort) * -1,
        UnitPrice: item.rate,
        ItemRef: {
          name: products[item.prodNick].prodName,
          value: products[item.prodNick]?.qbID ?? null,
        },
        ServiceDate: delivDate,
        ItemAccountRef: {
          name: "Uncategorized Income",
        },
      },
    })),
    sortBy('SalesItemLineDetail.ItemRef.name')
  )(cartOrder.items)

  const deliveryItem = shouldChargeDelivery
    ? [{
        Description: 'DELIVERY',
        DetailType: "SalesItemLineDetail",
        Amount: deliveryCharge,
        SalesItemLineDetail: {
          TaxCodeRef: { value: "TAX" },
          Qty: 1,
          UnitPrice: deliveryCharge,
          ItemRef: {
            name: 'DELIVERY',
            value: null,
          },
          ServiceDate: delivDate,
          ItemAccountRef: {
            name: "Uncategorized Income",
          },
        },
        
      }]
    : []

  const lineItems = regularItems.concat(correctionItems).concat(deliveryItem)
    // .map((lineItem, idx) => {
    //   return {
    //     Id: idx + 1,
    //     ...lineItem
    //   }
    // })

  const placeholderItem = [{
    //Id: 1,
    Description: '(No Items)',
    DetailType: "SalesItemLineDetail",
    Amount: 0,
    SalesItemLineDetail: {
      TaxCodeRef: { value: "TAX" },
      Qty: 0,
      UnitPrice: 0,
      ItemRef: {
        name: '(No Items)',
        value: null,
      },
      ServiceDate: delivDate,
      ItemAccountRef: {
        name: "Uncategorized Income",
      },
    },
    
  }]

  return {
    AllowIPNPayment: false,
    AllowOnlinePayment: false,
    AllowOnlineCreditCardPayment: false,
    AllowOnlineACHPayment: true,
    DocNumber: delivDateDT.toFormat('MMddyyyy') + locNick.slice(0,13),
    TxnDate: delivDate,
    CurrencyRef: {
      value: "USD",
      name: "United States Dollar",
    },
    CustomerRef: {
      value: qbID,
      name: locName,
    },
    CustomerMemo: {
      value: ItemNote || 'na',
    },
    BillAddr: {
      Line1: addr1,
      CountrySubDivisionCode: "CA",
      PostalCode: zip,
    },
    ShipAddr: {
      Line1: addr1,
      Line2: addr2,
    },
    FreeFormAddress: true,
    ClassRef: {
      value: "3600000000001292604",
      name: "Wholesale",
    },
    SalesTermRef: {
      name: terms,
    },
    DueDate: delivDateDT.plus({ days: 15 }).toFormat('yyyy-MM-dd'), // net 15 is the only currently supported option
    ShipDate: delivDate,
    BillEmail: {
      Address: email,
    },
    Line: lineItems.length ? lineItems : placeholderItem,
    domain: "QBO",
    sparse: false, // old code specified true when invoicing !== 'daily', but this is the only currently supported option. Why use a sparse update when the full invoice object is described here anyway?
  }

}


/**
 * Take a collection of order items representing a customer's order for a given
 * date, as produced from useProdOrdersByDate & filtered to a given locNick.
 * 
 * Gotcha: useProdOrdersByDate applies a rate & delivDate value to all records,
 * including standing orders.
 */
const makeCartOrder = ({ orderItems, location }) => {

  const { Orders:cart, undefined:standing } = groupBy(orderItems, 'Type')

  const { delivDate, locNick, isWhole } = orderItems[0]
  const ItemNote = cart?.[0]?.ItemNote ?? ''
  const delivFee = cart?.[0]?.delvFee ?? null
  
  const standardFulfillment = 
    ['atownpick', 'slopick'].includes(location.zoneNick)
      ? location.zoneNick
      : 'deliv'

  const route = cart?.[0]?.route || location.dfFulfill || standardFulfillment

  const header = { locNick, delivDate, ItemNote, delivFee, route, isWhole }

  const items = orderItems.map(item => ({
    Type: item.Type, // to decide whether to update or create
    id: item.id,
    prodNick: item.prodNick, 
    qty: item.qty, 
    qtyShort: item.qtyShort ?? null, 
    qtyUpdatedOn: item.qtyUpdatedOn, 
    rate: item.rate,
    isLate: item.isLate ?? 0,
    sameDayMaxQty: item.sameDayMaxQty ?? item.qty, 
    updatedBy: item.updatedBy
  }))

  return {
    header,
    items
  }

}