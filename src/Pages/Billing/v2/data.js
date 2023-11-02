import { filter, flow, forEach, groupBy, keyBy, map, mapValues, omitBy, pickBy, sortBy } from "lodash/fp"
import { useListData } from "../../../data/_listData"
import { useProdOrdersByDate } from "../../../data/useT0T7ProdOrders"
import { useMemo } from "react"
import { DateTime } from "luxon"

// Notes: 'terms' are limited to only net 15 rules, and 'invoicing' is only
// supported 'daily'. If we want to allow for other options, then we need
// to update code here.



/** 
 * orderItems is assumed to represent a complete order for a given location, 
 * on a given date. Decisions about whether to use a standing or cart order
 * item is assumed to have already been made.
 * 
 * Returns an invoice object formatted for a QB request, EXCEPT some ID info
 * that we will fetch prior to submitting
 */
const makeInvoice = ({ orderItems, location, zone, products, altPrices }) => {
  const { locNick, delivDate, route, ItemNote } = orderItems[0]
  const { locName, qbID, addr1, addr2, zip, email, terms } = location
  const { zoneFee } = zone

  const delivDateDT = DateTime
    .fromFormat(delivDate, 'yyyy-MM-dd', { zone: 'America/Los_Angeles' })

  const lineItems = flow(
    filter(item => item.qty !== 0),
    // map(item => ({
    //   prodName: products[item.prodNick].prodName,
    //   qty: item.qty,
    //   rate: item.rate 
    //     ?? altPrices[`${locNick}#${item.prodNick}`]  // shouldnt be necessary
    //     ?? products[item.prodNick].wholePrice        // shouldnt be necessary
    // })),
    map(item => {
      const product = products[item.prodNick]

      const rate = item.rate 
        ?? altPrices[`${locNick}#${item.prodNick}`]  // shouldnt be necessary
        ?? product.wholePrice                        // shouldnt be necessary

      const lineID = product.qbID 
        ? delivDate.replace(/-/g, "") + product.qbID 
        : "0000991234"
      console.log("Id", lineID.slice(5));

      return {
        Id: lineID.slice(5),
        // LineNum: <index>
        Description: item.prodName,
        DetailType: "SalesItemLineDetail",
        Amount: rate * item.qty,
        SalesItemLineDetail: {
          TaxCodeRef: {
            value: "TAX",
          },
          Qty: item.qty,
          UnitPrice: rate,
          ItemRef: {
            name: products[item.prodNick].prodName,
            value: products[item.prodNick].qbID,
          },
          ServiceDate: delivDate,
  
          ItemAccountRef: {
            name: "Uncategorized Income",
          },
        },
      }
    }),
    sortBy('prodName')
  )(orderItems)

  // TODO: add logic for appending line items for shorted qtys here
  //
  //    Plan: Take over the cart order SO attribute for this purpose.
  //          Normally this value is null, so we can look for non-null
  //          values here.

  const shouldChargeDelivery = (
    route === 'deliv'
    && zoneFee > 0
    && lineItems.length > 0
  )

  const deliveryItem = (shouldChargeDelivery)
    ? [{ prodName: 'DELIVERY', qty: 1, rate: zoneFee }]
    : []

  return {
    AllowIPNPayment: false,
    AllowOnlinePayment: false,
    AllowOnlineCreditCardPayment: false,
    AllowOnlineACHPayment: true,
    DocNum: delivDateDT.toFormat('MMddyyyy') + locNick.slice(0,13),
    TxnDate: delivDate,
    CurrencyRef: {
      value: "USD",
      name: "United States Dollar",
    },
    Line: lineItems.concat(deliveryItem),
    CustomerRef: {
      value: qbID,
      name: locName,
    },
    CustomerMemo: {
      value: ItemNote,
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
    domain: "QBO",
    sparse: false, // old code specified true when invoicing !== 'daily', but this is the only currently supported option. Why use a sparse update when the full invoice object is described here anyway?
  }

}

export const useBillingDataByDate = ({ reportDate, shouldFetch }) => {

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

  console.log(orders, LOC, PRD, ZNE, APR)

  const calculateValue = () => {
    if (!orders || !LOC || !PRD || !ZNE || !APR) return undefined
    console.log(orders, LOC, PRD, ZNE, APR)

    const locations = keyBy('locNick')(LOC)
    const products = keyBy('prodNick')(PRD)
    const zones = keyBy('zoneNick')(ZNE)
    const altPrices = keyBy(apr =>`${apr.locNick}#${apr.prodNick}`)(APR)

    const invoicesByLocNick = flow(
      filter(order => (
        order.isWhole === true 
        && order.isStand !== false
        && locations[order.locNick].invoicing === "daily"
      )),
      groupBy('locNick'),
      mapValues(orderItems => {
        const location = locations[orderItems[0].locNick]
        const zone = zones[location.zoneNick]

        return makeInvoice({ orderItems, location, zone, products, altPrices })
      }),
      pickBy(invoiceObj => invoiceObj.Line.length > 0)
    )(orders)

    return invoicesByLocNick
  }

  return { data: useMemo(calculateValue, [orders, LOC, PRD, ZNE, APR]) }

}