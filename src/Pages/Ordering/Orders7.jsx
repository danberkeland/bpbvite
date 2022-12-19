// because why not?
import React, { useEffect, useState } from "react"
import { useSettingsStore } from "../../Contexts/SettingsZustand"
import { useLocationDetails, useLocationList } from "./Data/locations"

import { Dropdown } from "primereact/dropdown"
import { Calendar } from "primereact/calendar"
import { useOrdersByLocationByDate, useStandingByLocation } from "./Data/orderData"
import { dateToMmddyyyy } from "./Functions/dateAndTime"

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

  const [orderHeader, setOrderHeader] = useState()
  const [orderItems, setOrderItems] = useState()
  const orderState = { 
    orderHeader, setOrderHeader,
    orderItems, setOrderItems
  }

  const { data:locationList, errors:locationListErrors } = useLocationList(user.location) // fetch depends on the user's location
  const { data:locationDetails, errors:LocationDetailErrors } = useLocationDetails(selection.location)
  const { data:cartData, errors: cartErrors } = useOrdersByLocationByDate(selection.location, selection.delivDate)
  const { data:standingData, errors: standingErrors } = useStandingByLocation(selection.location, selection.delivDate)

  useEffect(() => {
    if (locationDetails && cartData && standingData) {
      setOrderHeader(makeOrderHeader(locationDetails, cartData, standingData, delivDate))      
      setOrderItems(makeOrderItems(locationDetails, cartData, standingData, delivDate))
      validateOrder(orderState)
    }   
  }, [selection.location, selection.delivDate])

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

function makeOrderHeader(locationDetails, cartData, standingData, delivDate) {
  const defaultRoute = ['atownpick', 'slopick'].includes(locationDetails.zoneNick) ?
    locationDetails.zoneNick :
    'deliv'

  let headerRoute = defaultRoute
  let headerNote = null
  let headerIsWhole = null
  if (cartData.length) {
    let firstRoute = cartData[0].route
    let firstNote = cartData[0].note
    let firstIsWhole = cartData[0].isWhole
    let routeChanges = cartData.map(item => item.route !== firstRoute)
    let noteChanges = cartData.map(item => item.ItemNote !== firstNote)
    let isWholeChanges = cartData.map(item => item.isWhole !== firstIsWhole)

    if (firstRoute !== null && !routeChanges.includes(true)) {
      headerRoute = firstRoute
    }

    if (!noteChanges.includes(true)) {
      headerNote = firstNote
    }

    if (!isWholeChanges.includes(true)) {
      headerIsWhole = firstIsWhole      
    }
  }  
  
  // underscore prefix denotes mutable properties.
  // other properties should not be changed.
  return ({
    locNick: locationDetails.locNick,
    delivDate: dateToMmddyyyy(delivDate),
    route: headerRoute,
    _route: headerRoute,
    ItemNote: headerNote,
    _ItemNote: headerNote,
    isWhole: headerIsWhole
  })
}

function makeOrderItems(cartData, standingData, orderHeader) {
  // order list state data for PRESENTATION
  // does not need data held in the header
  // may contain extra properties to assist with presentation.
  let standingItems = standingData.map(item => {
    return({
      id: item.id,
      prodNick: item.product.prodNick,
      prodName: item.product.prodName,
      qty: item.qty,
      _qty: item.qty,
      rate: item.rate,
      isLate: item.isLate,
      isWhole: item.isWhole,
      defaultRate: item.isWhole ?
        item.product.wholePrice : 
        item.product.retailPrice,
      startDate: item.startDate,
      endDate: item.endDate


    })
  })
  


  return "I'm an order list!"
}

function validateOrder(orderState) {
  // checks:
  // route is one of 'deliv', 'atownpick', or 'slopick'
  //    if check fails 

  console.log("Orders validated")
}