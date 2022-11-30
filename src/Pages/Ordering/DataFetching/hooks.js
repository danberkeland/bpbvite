import useSWRimmutable from "swr/immutable"
import { gqlFetcher } from "../DataFetching/fetcher"
import * as queries from "../DataFetching/queries"
import { orders } from "../mockData"

/*********************************************
 * Location Selection Options for BPB admins *
 *********************************************/

export const useLocationList = (userLocation) => {
  const { data, errors } = useSWRimmutable(userLocation === 'backporch' ? [queries.listLocationNames, {limit: 1000}] : null, gqlFetcher)

  return({
    locationList: data ? data.data.listLocations.items : data,
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

export const useOrderDisplay = (location, date) => {
  // builds query and transforms fetched data for display

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const variables = {
    locNick: location ? location : null,
    dayOfWeek: date ? weekdays[date.getDay()] : null,
    delivDate: date ? (('0' + (date.getMonth() + 1)).slice(-2) + '/' +  ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear()) : null,
  }

  const { data: orderList, errors } = useSWRimmutable(
    [queries.listOrdersFromLocation, variables], 
    gqlFetcher
  )

  let orders = []
  if (orderList) {
    let altPrices
    let standing, cart
    let zone, route

    if (orderList) {
      zone = orderList.data.getLocation.zoneNick
      route = (zone === 'atownpick' || zone === 'slopick') ? zone : 'deliv'

      altPrices = orderList.data.getLocation.customProd.items
      altPrices = altPrices.map(item => ([item.prodNick, item.wholePrice]))
      altPrices = Object.fromEntries(altPrices)

      standing = orderList.data.getLocation.standing.items.map(item => ({
        orderID: item.id,
        prodName: item.product.prodName,
        prodNick: item.product.prodNick,
        originalQty: item.qty,
        newQty: item.qty,
        type: "S",
        route: route,
        rate: item.product.prodNick in altPrices 
          ? altPrices[item.product.prodNick] 
          : item.product.wholePrice,
        total: Math.round(item.qty * item.product.wholePrice * 100) / 100
      }))

      cart = orderList.data.getLocation.orders.items.map(item => ({
        orderID: item.id,
        prodName: item.product.prodName,
        prodNick: item.product.prodNick,
        originalQty: item.qty,
        newQty: item.qty,
        type: "C",
        route: item.route ? item.route : "deliv",
        rate: 'rate' in item 
          ? item.rate 
          : (
            item.product.prodNick in altPrices 
              ? altPrices[item.product.prodNick] 
              : item.product.wholePrice
          ),
        total: Math.round(item.qty * item.product.wholePrice * 100) / 100
      }))
      let cartAndStanding = [...cart, ...standing]
      let names = Array.from(new Set(cartAndStanding.map((pro) => pro.prodNick)));
      
      for (let name of names) {
        let firstMatch = cartAndStanding.find((obj) => obj.prodNick === name);
        orders.push(firstMatch);
      }
    }
  }

  return({
    orderDisplay: orders.length > 0 ? orders : orderList,
    orderDisplayErrors: errors
  })
}