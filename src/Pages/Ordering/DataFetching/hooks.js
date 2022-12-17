import useSWRimmutable from "swr/immutable"
import { gqlFetcher } from "../DataFetching/fetcher"
import * as queries from "../DataFetching/queries"
import { DateTime } from "luxon"
import { getOrderSubmitDate, dateToMmddyyyy, getWeekday } from "../Functions/dateAndTime"
import dynamicSort from "../Functions/dynamicSort"

/*********************************************
 * Location Selection Options for BPB admins *
 *********************************************/

export const useLocationList = (shouldFetch) => {
  const { data, errors } = useSWRimmutable(shouldFetch ? [queries.listLocationNames, {limit: 1000}] : null, gqlFetcher)

  return({
    locationList: data ? data.data.listLocations.items.sort(dynamicSort("locName")) : data,
    locationListErrors: errors
  })
}

/***************************************************
 * Order Data by Location and Date to be displayed *
 ***************************************************/
// Summary:
//  - Fetch Standing and Cart orders from a given location + date
//  - Cart orders override any existing Standing orders

//  - Each Location + delivery date should have at most 1
//    cart order record and 1 standing order record 
//    for a given product.

//  - Standing orders have a default fulfillment option, but this
//    can be overwritten while editing. Changing this option alone
//    warrants generating a cart order, even if the qty is still
//    the standing amount.

//  - Since there is no order 'header' record, these data need to be
//    replicated across all line items.  This includes the fulfillment
//    option ('route' attribute), as well as the delivery note.

//  - We should ensure that 'route' and 'note' are constant across 
//    all line items.

// export const useOrderDisplay = (location, date) => {
//   // build query and transform fetched data for display

//   const variables = {
//     locNick: location ? location : null,
//     dayOfWeek: date ? getWeekday(date) : null,
//     delivDate: date ? dateToMmddyyyy(date) : null,
//   }

//   const { data: orderList, errors } = useSWRimmutable(
//     [queries.listOrdersFromLocation, variables], 
//     gqlFetcher
//   )

//   let orders = []
//   if (orderList) {
//     let altPrices
//     let standing, cart
//     let zone, route

//     if (orderList) {
//       zone = orderList.data.getLocation.zoneNick
//       route = (zone === 'atownpick' || zone === 'slopick') ? zone : 'deliv'

//       altPrices = orderList.data.getLocation.customProd.items
//       altPrices = altPrices?.map(item => ([item.prodNick, item.wholePrice]))
//       altPrices = Object.fromEntries(altPrices)

//       let standing = orderList.data.getLocation.standing.items?.map(item => ({
//         orderID: item.id,
//         prodName: item.product.prodName,
//         prodNick: item.product.prodNick,
//         originalQty: item.qty,
//         newQty: item.qty,
//         type: "S",
//         route: route,
//         rate: item.product.prodNick in altPrices 
//           ? altPrices[item.product.prodNick] 
//           : item.product.wholePrice,
//         total: Math.round(item.qty * item.product.wholePrice * 100) / 100
//       }))

//       let cart = orderList.data.getLocation.orders.items?.map(item => ({
//         orderID: item.id,
//         prodName: item.product.prodName,
//         prodNick: item.product.prodNick,
//         originalQty: item.qty,
//         newQty: item.qty,
//         type: "C",
//         route: item.route ? item.route : "deliv",
//         rate: 'rate' in item ? 
//           item.rate : 
//           (
//             item.product.prodNick in altPrices ? 
//               altPrices[item.product.prodNick] : 
//               item.product.wholePrice
//           ),
//         total: Math.round(item.qty * item.product.wholePrice * 100) / 100
//       }))
//       let cartAndStanding = [...cart, ...standing]
//       let names = Array.from(new Set(cartAndStanding?.map((pro) => pro.prodNick)));
      
//       for (let name of names) {
//         let firstMatch = cartAndStanding.find((obj) => obj.prodNick === name);
//         orders.push(firstMatch);
//       }
//     }
//   }

//   return({
//     orderDisplay: orders.length > 0 ? orders : orderList,
//     orderDisplayErrors: errors
//   })
// }

export const useOrderData = (selection) => {
  const {location, date} = selection

  const shouldFetch = location && date
  const variables = {
    locNick: location ? location : null,
    dayOfWeek: date ? getWeekday(date) : null,
    delivDate: date ? dateToMmddyyyy(date) : null,
  }

  const { data, errors } = useSWRimmutable(
    shouldFetch ? [queries.listOrdersFromLocation, variables] : null, 
    gqlFetcher
  )

  let orders = []
  if (data) {
    console.log("data: ", data)
    let zone = data.data.getLocation.zoneNick
    let route = (zone === 'atownpick' || zone === 'slopick') ? zone : 'deliv'

    let altPrices = data.data.getLocation.customProd.items
    altPrices = altPrices?.map(item => ([item.prodNick, item.wholePrice]))
    altPrices = Object.fromEntries(altPrices)
    let standing = []
    let cart = []

    if (data.data.getLocation.standing.items.length) {
      standing = data.data.getLocation.standing.items?.map(item => ({
        orderID: item.id,
        prodName: item.product.prodName,
        prodNick: item.product.prodNick,
        originalQty: item.qty,
        newQty: item.qty,
        type: "S",
        route: route,
        rate: item.product.prodNick in altPrices ? 
          altPrices[item.product.prodNick] : 
          item.product.wholePrice,
        total: Math.round(item.qty * item.product.wholePrice * 100) / 100
      }))
    }

    if (data.data.getLocation.standing.items.length) {
      cart = data.data.getLocation.orders.items?.map(item => ({
        orderID: item.id,
        prodName: item.product.prodName,
        prodNick: item.product.prodNick,
        originalQty: item.qty,
        newQty: item.qty,
        type: "C",
        route: item.route ? item.route : "deliv",
        rate: 'rate' in item ? 
          item.rate : 
          (
            item.product.prodNick in altPrices ? 
              altPrices[item.product.prodNick] : 
              item.product.wholePrice
          ),
        total: Math.round(item.qty * item.product.wholePrice * 100) / 100
      }))
    }

    let cartAndStanding = [...cart, ...standing]
    let names = []
    if (cartAndStanding.length) {
      names = Array.from(new Set(cartAndStanding?.map((pro) => pro.prodNick)));
    }

    // in the case of a double-entry, pick the cart order
    for (let name of names) {
      let firstMatch = cartAndStanding.find((obj) => obj.prodNick === name);
      orders.push(firstMatch);
    }

    // check routes?

    console.log("orders: ", orders)
  }

  return({
    orderData: orders,
    orderDataErrors: errors
  })

}

export const useProductData = (location, date) => {
  const orderSubmitDate = getOrderSubmitDate()
  const selectedDelivDate = date? DateTime.fromISO(date.toISOString()) : null

  const { data: products, errors } = useSWRimmutable([queries.listProducts, {limit: 1000}], gqlFetcher) 
  const { data: altPrices } = useSWRimmutable( products ? [queries.listAltPricesforLocation, {locNick: location}] : null, gqlFetcher)
  
  let modifiedProducts = []

  // this check just ensures fetching is complete
  if (altPrices) {
    modifiedProducts = products.data.listProducts.items
    let altPriceItems = altPrices.data.getLocation.customProd.items

    // apply any location-specific pricing to product list
    if (altPriceItems.length > 0) {
      let altPriceMap = Object.fromEntries(altPriceItems?.map(item => [item.prodNick, item.wholePrice]))

      for (let item in modifiedProducts) {
        if (item.prodNick in altPriceMap) {
          item.wholePrice = altPriceMap[item.prodNick]
        }
      }
    }

    // lock out items depending on lead time
    //    FUTURE: lock out for external users, show warninig for bpb admins?
    for (let item of modifiedProducts) {
      let isDisabled = orderSubmitDate.plus({ days: item.leadTime }) > selectedDelivDate
      item.disabled = isDisabled
      item.availableDate = orderSubmitDate.plus({ days: item.leadTime }).toLocaleString()
    }
  }

  return({
    productData: altPrices ? modifiedProducts : products,
    productDataErrors: errors
  })
}

