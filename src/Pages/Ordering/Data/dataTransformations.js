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

import { dateToMmddyyyy, getWeekday } from "../Functions/dateAndTime"

export function makeOrderHeader(locationDetails, cartData, standingData, delivDate) {
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

  return ({
    locNick: locationDetails.locNick,
    isWhole: headerIsWhole,
    delivDate: delivDate,
    defaultRoute: defaultRoute,
    route: headerRoute,
    _route: headerRoute,
    ItemNote: headerNote,
    _ItemNote: headerNote,
  })
 
}

export function makeOrderItems(locationDetails, cartData, standingData, delivDate) {
  // order list state data for PRESENTATION.
  // Header-type data are removed from items.
  // May contain extra properties to assist with 
  // presentation and submission.
  let cartItems = cartData.map(item => { 
    let altPriceItem = locationDetails.customProd.items
      .filter(alt => alt.prodNick = item.prodNick)

    return({
      id: item.id,
      prodNick: item.product.prodNick,
      prodName: item.product.prodName,
      qty: item.qty,
      _qty: item.qty,
      defaultRate: item.product.wholePrice, // For future, consider the case of retail items
      locationRate: altPriceItem.length ?
        altPriceItem[0].wholePrice : 
        item.product.wholePrice,
      rate: item.rate,
      _rate: item.rate, // to be editable by bpbadmins
      isLate: item.isLate,
      createdOn : item.createdOn ? item.createdOn : null,
      updatedOn : item.updatedOn ? item.updatedON : null,
      type: "C",
      action: "READ",
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
        _qty: item.qty,
        rate: altPriceItem.length ?
          altPriceItem[0].wholePrice : 
          item.product.wholePrice,
        _rate: altPriceItem.length ?
          altPriceItem[0].wholePrice : 
          item.product.wholePrice,
        startDate: item.startDate,
        endDate: item.endDate,
        isStand: item.isStand,
        createdOn: item.createdOn ? item.updatedOn : null,
        updatedOn: item.updatedOn ? item.createcOn : null,
        type: "S",
       action: "READ",
    })
  })

  return [...cartItems, ...standingItems]
}