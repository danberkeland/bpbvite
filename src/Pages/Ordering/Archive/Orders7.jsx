// because why not?
import React, { useEffect, useState } from "react"
import { useSettingsStore } from "../../Contexts/SettingsZustand"
import { useLocationDetails, useLocationList } from "./Data/locationData"

import { Dropdown } from "primereact/dropdown"
import { Calendar } from "primereact/calendar"
import { useOrdersByLocationByDate, useStandingByLocation } from "./Data/orderData"
import { dateToMmddyyyy, getWeekday } from "./Functions/dateAndTime"
import { API } from "aws-amplify"
import { updateOrder } from "./Data/gqlQueries"

const Orders7 = () => {
  const user = useCurrentUser() // these data should be constant while on the Ordering page

  const [location, setLocation] = useState(user.location !== 'backporch' ? 
    user.location : 
    null
  )
  const [delivDate, setDelivDate] = useState(null)
  const selection = { 
    location, setLocation, 
    delivDate, setDelivDate 
  }

  const [orderHeader, setOrderHeader] = useState(null)
  const [orderItems, setOrderItems] = useState(null)
  const orderState = { 
    orderHeader, setOrderHeader,
    orderItems, setOrderItems
  }

  
  const { data:locationList, errors:locationListErrors } = useLocationList(user.location) // fetch depends on the user's location
  const { data:locationDetailsSWR, errors:LocationDetailErrors } = useLocationDetails(selection.location)
  const [locationDetails, setLocationDetails] = useState(null)
  useEffect(() => {
    if (locationDetailsSWR) setLocationDetails(locationDetailsSWR.data.getLocation)
  }, [locationDetailsSWR])
  const { data:cartDataSWR, errors: cartErrors, mutate:mutateCartData } = useOrdersByLocationByDate(selection.location, selection.delivDate)
  const [cartData, setCartData] = useState(null)
  useEffect(() => {
    if (cartDataSWR) {
      if (cartData.hasOwnProperty('data')) {
        setCartData(cartData.data.getlocation.ordersByDate.items)
      } else {
        setCartData(Object.values(cartDataSWR))
      }
    }
  }, [cartDataSWR])
  const { data:standingData, errors: standingErrors } = useStandingByLocation(selection.location, selection.delivDate)

  useEffect(() => {
    if (!!locationDetails && !!cartData && !!standingData) {
      const _orderHeader = makeOrderHeader(locationDetails, cartData, standingData, delivDate, mutateCartData)
      setOrderHeader(_orderHeader)
      const fixItems = validateOrder(_orderHeader, cartData)
      console.log("Fix Items: ", fixItems)

      if (fixItems.length) {
        //fixCartOrders(fixItems)
        // update cartData with applicable fix values
        const fixedCart = cartData.map(cartItem => {
          const fixItem = fixItems.find(fx => fx.id === cartItem.id)
          if (!!fixItem) return({...cartItem, ...fixItem})
          else return cartItem
        })
        console.log("FIXED CART:", fixedCart)
        mutateCartData({...fixedCart})
      }
      if (!fixItems.length) setOrderItems(makeOrderItems(locationDetails, cartData, standingData, delivDate))
    }   
  }, [locationDetails, cartData, standingData, delivDate])

  return(
    <div style={{margin: "20px"}}>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      {user.location === 'backporch' && 
        <Dropdown 
          id="locationDropdown"
          options={locationList}
          optionLabel="locName"
          optionValue="locNick"
          value={location}
          onChange={e => setLocation(e.value)}
        />
      }
      <Calendar 
        id="calendar"
        touchUI={true}
        value={delivDate}
        onChange={e => setDelivDate(e.value)}
      />

      <pre>{"Selection: " + location + ", " + delivDate}</pre>
      <pre>{"Order Header: " + JSON.stringify(orderHeader, null, 2)}</pre>
      <pre>{"Order List: " + JSON.stringify(orderItems, null, 2)}</pre>
      {locationDetails &&
        <pre>{"Location Details: " + JSON.stringify(locationDetails, null, 2)}</pre>
      }

      {cartData &&
        <pre>{"Cart Data: " + JSON.stringify(cartData, null, 2)}</pre>
      }
      {cartErrors &&
        <pre>{"Cart Errors: " + JSON.stringify(cartErrors, null, 2)}</pre>
      }

      {standingData &&
        <pre>{"Standing Data: " + JSON.stringify(standingData.slice(0,2), null, 2)}</pre>
      }
      <div style={{height:"200px"}} />
    </div>
  )
}

export default Orders7

/***** Helper Functions *****/

const useCurrentUser = () => {
  const globalState = useSettingsStore()
  console.log(globalState)
  return ({
    name: globalState.user,
    authClass: globalState.authClass,
    location: globalState.currentLoc
  })

}

function makeOrderHeader(locationDetails, cartData, standingData, delivDate, mutateCartData) {
  const defaultRoute = ['atownpick', 'slopick'].includes(locationDetails.zoneNick) ?
    locationDetails.zoneNick :
    'deliv'

  let headerRoute = defaultRoute
  let headerNote = null
  let headerIsWhole = null

  console.log("CHECKING CART DATA: ", cartData)
  // Decide what the correct header values are
  if (cartData.length) {
    let firstRoute = cartData[0].route
    let firstNote = cartData[0].ItemNote
    let firstIsWhole = cartData[0].isWhole
    let routeChanges = cartData.map(item => item.route !== firstRoute)
    let noteChanges = cartData.map(item => item.ItemNote !== firstNote)
    let isWholeChanges = cartData.map(item => item.isWhole !== firstIsWhole)
    
    console.log("routeChanges: ", routeChanges)
    console.log("noteChanges: ", noteChanges)
    console.log("isWholeChanges: ", isWholeChanges)

    if (firstRoute !== null && !routeChanges.includes(true)) {
      headerRoute = firstRoute
    }

    if (!noteChanges.includes(true)) {
      headerNote = firstNote
    }

    if (!isWholeChanges.includes(true)) {
      headerIsWhole = firstIsWhole      
    }

    // now reexamine each item for values that don't match the
    // the supposed correct values and mutate accordingly

  //   let fixItems = []
  //   for (let i = 0; i < cartData.length; i++) {
  //     let fix = {}
  //     if (cartData[i].route !== headerRoute) fix.route = headerRoute
  //     if (cartData[i].ItemNote !== headerNote) fix.ItemNote = headerNote
  //     if (cartData[i].IsWhole !== headerIsWhole) fix.isWhole = headerIsWhole
  //     console.log("validating item " + cartData[i].product.prodNick)
  //     console.log("FIXES: ", fix)

  //     if (Object.keys(fix).length) {
  //       fixFlag = true
  //       fix.id = cartData[i].id
  //       let response = await API.graphql({
  //         query: updateOrder,
  //         variables: {input: fix}
  //       })
  //       console.log("fixed " + cartData[i].product.prodNick)
  //       console.log(response)
  //     }
  //   }
  //   console.log("Fixes made to this order? ", fixFlag)
  //   if (fixFlag) fixItems.push(fix)

  }  
  
  // underscore prefix is for mutable properties.
  // other properties should not be changed.

  return ({
    locNick: locationDetails.locNick,
    isWhole: headerIsWhole,
    delivDate: dateToMmddyyyy(delivDate),
    dayOfWeek: getWeekday(delivDate),
    route: headerRoute,
    _route: headerRoute,
    ItemNote: headerNote,
    _ItemNote: headerNote,
  })
}

function makeOrderItems(locationDetails, cartData, standingData, delivDate) {
  // order list state data for PRESENTATION
  // does not need data held in the header
  // may contain extra properties to assist with presentation.
  let cartItems = cartData.map(item => { 
    let altPriceItem = locationDetails.customProd.items
      .filter(alt => alt.prodNick = item.prodNick)

    return({
      type: "C",
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
    })
  })

  let standingItems = standingData.map(item => {
    let altPriceItem = locationDetails.customProd.items
      .filter(alt => alt.prodNick = item.prodNick)

    return({
      type: "S",
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
    })
  })
  
  // don't want to display holding orders.
  // due to malformed entries in the DB, we assume null to mean true
  standingItems = standingItems.filter(item => item.isStand !== false)

  // don't want to display standing items that have cart counterparts.
  standingItems = standingItems.filter(standingItem => {
    // "keep standing item if you can't find a cart item with a matching prodNick"
    return (cartItems.findIndex(cartItem => cartItem.prodNick === standingItem.prodNick) === -1)
  })
  
  

  return (
    ["Cart Items: ", ...cartItems.slice(0,3), "Standing Items: ", ...standingItems.slice(0,3)]
  )
}

function validateOrder(orderHeader, cartData) {
  // The formed orderHeader containts the (supposed-to-be) constant values
  // found across all cart items belonging to the order. If variation is found,
  // a guess or default value is provided.  Here we double back on the items --
  // if they have values that differ from the header we fix them here and 
  // revalidate.
  //
  // Aside from header values, we also check isLate, as it is often maldefined as null
  //
  // CAUTION: if api calls are configured improperly, the page load may get caught
  // in an endless cycle of fetch data > validate > "fix errors" > fetch data > ...
  
  let fixItems = []
  if (cartData.length) {
    for (let item of cartData) {
      let fix = {}
      if (item.route !== orderHeader.route) fix.route = orderHeader.route
      if (item.ItemNote !== orderHeader.ItemNote) fix.ItemNote = orderHeader.ItemNote
      if (item.isWhole !== orderHeader.isWhole) fix.isWhole = orderHeader.isWhole
      if (item.isWhole === null) fix.isWhole = true
      if (item.isLate === null) fix.isLate = 0

      if (Object.keys(fix).length) {
        console.log(item.product.prodName + " needs to be fixed")
        console.log(fix)

        fix.id = item.id
        fixItems.push(fix)

        
      }
    }
  }
  return(fixItems)
    
}

async function fixCartOrders(fixItems) {
  for (let item of fixItems){
    let response = await API.graphql({
      query: updateOrder,
      variables: {input: item}
    })
    console.log(response)

  }


}