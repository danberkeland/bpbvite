// Data is fetched from the DB and stored in SWR caches;
// Components will use a transformed version of these data
// for final rendering.
//
// Out basic setup is to fetch data depending on some user selection.
//
//  Ex: selecting a location and date triggers a fetch of order data.
//      The query depends on both location and date, and a custom
//      hook with useSWR manages the fetching. useSWR prevents
//      redundant fetches as users flip back and forth between
//      selection options. The final component rendering uses a blend
//      of data from 3 different sources (data about the location, cart
//      orders, and standing orders).  
//
//      Since location data, cart data, and standing order data might be
//      reused in different contexts, requiring different transformations,
//      we choose to keep data transformations mostly out of the
//      custom hooks, and instead put them in the relevant component
//      within a useEffect, ultimately storing this transformed data
//      as a state variable.
//
//      useEffect listens for changes to the swr data it depends on,
//      re-executing the transformations when a change is detected.
//      The swr hooks listen for changes in input setting on the page,
//      fetching (or not) and changing the data it produces accordingly.
//

import { getWeekday } from "../Functions/dateAndTime"
import dynamicSort from "../Functions/dynamicSort"
import { gqlFetcher } from "./fetchers"
import { deleteOrder } from "./gqlQueries"

export function makeOrderHeader(locationDetails, cartData, standingData, delivDate) {
  if (!locationDetails || !cartData || !standingData || !delivDate) return undefined

  const defaultRoute = ['atownpick', 'slopick'].includes(locationDetails.zoneNick) ?
    locationDetails.zoneNick :
    'deliv'

  // set header values to default
  let headerRoute = defaultRoute
  let headerNote = null
  let headerIsWhole = true

  if (cartData.length) {
    const routeIsConstant = cartData.reduce( (result, item) => {
      return (item.route === cartData[0].route) && result
    }, true)
    const noteIsConstant = cartData.reduce( (result, item) => {
      return (item.ItemNote === cartData[0].ItemNote) && result
    }, true)
    const isWholeIsConstant = cartData.reduce( (result, item) => {
      return (item.isWhole === cartData[0].isWhole) && result
    }, true)

    // If no variation in values, we assume the data 
    // is well-formed & use that value instead.
    if (routeIsConstant) {headerRoute = cartData[0].route} else {console.log("Variation in route detected")}
    if (noteIsConstant) {headerNote = cartData[0].ItemNote} else {console.log("Variation in ItemNote detected")}
    if (isWholeIsConstant) {headerIsWhole = cartData[0].isWhole} else {console.log("Variation in isWhole detected")}
  }

  const orderHeader = {
    locNick: locationDetails.locNick,
    isWhole: headerIsWhole,
    delivDate: delivDate,
    defaultRoute: defaultRoute,
    route: headerRoute,
    ItemNote: headerNote,
  }
  // console.log("ORDER HEADER: ", orderHeader)
  return orderHeader
 
}

export function makeOrderItems(locationDetails, cartData, standingData, delivDate) {
  if (!locationDetails || !cartData || !standingData || !delivDate) return undefined
  // order list state data for PRESENTATION.
  // Header-type data are removed from items.
  // May contain extra properties to assist with 
  // presentation and submission.
  let cartItems = cartData.map(item => { 
    let altPriceItem = locationDetails.customProd.items
      .filter(alt => alt.prodNick = item.prodNick)
    
    let locationRate = altPriceItem.length ?
      altPriceItem[0].wholePrice : 
      item.product.wholePrice

    return({
      id: item.id,
      prodNick: item.product.prodNick,
      prodName: item.product.prodName,
      qty: item.qty,
      qtyUpdatedOn: item.qtyUpdatedOn,
      sameDayMaxQty: item.sameDayMaxQty,
      defaultRate: item.product.wholePrice, // For future, consider the case of retail items
      locationRate: locationRate,
      rate: item.rate !== null ? item.rate : locationRate,
      isLate: item.isLate,
      createdOn: item.createdOn ? item.createdOn : null,
      updatedOn: item.updatedOn ? item.updatedOn : null,
      updatedBy: item.updatedBy,
      type: "C",
      isWhole: item.isWhole, // keep original value to validate/correct later
      route: item.route, // keep original value to validate/correct later
      ItemNote: item.ItemNote, // keep original value to validate/correct later
      ttl: item.ttl
    })
  })

  // filter down before reshaping
  //
  // for now we assume standing items are unique by {locNick, dayOfWeek, prodNick}
  // for future: filter to the correct standing items by start, end dates
  // OR, build that access pattern into appsync.
  let standingItems = standingData
    .filter(standingItem => standingItem.isStand !== false) // remove holding orders; due to malformedDB entries, we assume null means true
    .filter(standingItem => standingItem.dayOfWeek === getWeekday(delivDate))
    .filter(standingItem => {
      // "keep standing item if you can't find a cart item with a matching prodNick"
      return (cartItems.findIndex(cartItem => cartItem.prodNick === standingItem.product.prodNick) === -1)
    })
    .map(item => {
      let altPriceItem = locationDetails.customProd.items
        .filter(alt => alt.prodNick = item.prodNick)

      return({
        id: item.id,
        prodNick: item.product.prodNick,
        prodName: item.product.prodName,
        qty: item.qty,
        rate: altPriceItem.length ?
          altPriceItem[0].wholePrice : 
          item.product.wholePrice,
        createdOn: item.createdOn ? item.createdOn : null,
        updatedOn: item.updatedOn ? item.updatedOn : null,
        type: "S",
    })
  })

  return [...cartItems, ...standingItems].sort(dynamicSort("prodName"))
}


// export function makeOrderObject(locationDetails, cartData, standingData, delivDate) {
//   const defaultRoute = ['atownpick', 'slopick'].includes(locationDetails.zoneNick) ?
//     locationDetails.zoneNick :
//     'deliv'

//   const header = {
//     locNick: locationDetails.locNick,
//     delivDate: delivDate,
//     route: cartData.length ? cartData[0].route : defaultRoute,
//     _route: cartData.length ? cartData[0].route : defaultRoute,
//     ItemNote: cartData.length ? cartData[0].ItemNote : null,
//     _ItemNote: cartData.length ? cartData[0].ItemNote : null,
//     isWhole: true,
//   }

//   const cartItems = cartData.map( item => {
//     const cItem = {
//       id: item.id,
//       prodNick: item.prodNick,
//       qty: item.qty,
//       _qty: item.qty,
//       rate: item.rate,
//       _rate: item.rate,
//       isLate: item.isLate,
//       route: item.route,
//       isWhole: item.isWhole,
//       ItemNote: item.ItemNote,
//       createdOn: item.createdOn
//       //updatedOn: item.updatedOn
//     }
//   })

//   const standingItems = cartData.map( item => {
//     const cItem = {
//       id: item.id,
//       prodNick: item.prodNick,
//       qty: item.qty,
//       _qty: item.qty,
//       rate: item.rate,
//       _rate: item.rate,
//       isLate: item.isLate,
//       route: item.route,
//       isWhole: item.isWhole,
//       createdOn: item.createdOn,
//       //updatedOn: item.updatedOn
//       ItemNote: item.ItemNote,
//     }

//     return item

//   })

// }

export async function validateCart(cartData, mutateCart) {
    console.log("validating cartData")
    // Validation: detect duplicate products; keep only most recent

    let mutateFlag = false

    let _cartData = cartData.sort(dynamicSort("createdOn"))
    let prodInstances = {} // keys: prodNicks, values: [cart item Id's]
    for (let item of _cartData) {
      if (item.prodNick in prodInstances) prodInstances[item.prodNick] = (prodInstances[item.prodNick]).concat([item.id])
      else prodInstances[item.prodNick] = [item.id]
    }

    for (let key of Object.keys(prodInstances)) {
      let instancesOfProduct = prodInstances[key]
      if (instancesOfProduct.length > 1) {
        console.log("Warning: duplicates found for " + key, instancesOfProduct)

        let instancesToDelete = instancesOfProduct.slice(0, -1) // all but last instance of product
        for (let instanceId of instancesToDelete) {
          const input = {id: instanceId}
          let response = await gqlFetcher(deleteOrder, {input: input})
          console.log("deleted item: ", response)
        }
        
        mutateFlag = true
      }

    }

    if (mutateFlag) mutateCart() // mutate cartData to relaod with fixed data.
}