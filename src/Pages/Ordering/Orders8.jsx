// Hello from Orders7,
// SWR Caches were working ok with useEffect & useState until 
// mutations & revalidation got thrown into the mix. It seems 
// stuffing synchronous data transformation into the async data 
// hooks gets messed up easily. Still running into cases where 
// js code runs into an unexpected 'undefined', and the code has 
// reached a complexity where I don't think I can figure out why.
//
// Strategy for Orders8:
// Because it is difficult to predict exactly when SWR data is 
// going to be undefined in the course of fetching/switching keys, 
// and because improper handling of undefined values tends to 
// bring EVERYTHING to a halt, we will try a 'safer' method of
// returning data. The major difference here is that our SWR
// hooks will always return something, even if only an empty
// object {} or empty array []. While we gain much in not having
// to prefix actions with "if data exists, then...," a tradeoff 
// is that we cannot differentiate between data still being fetched
// and a successful response that happens to not contain any data. 
// In the past we have made little use of the isLoading state, but
// I think we can build & return isLoading flags from our SWR hooks 
// from the primitive data and error values returned form useSWR.
//
// ...
// 
// Like previous attempts, everything went smooth at first.
// Problems arose while trying to transform raw data for forms and
// presentation inside a useEffect. I suspect the 'safe' access
// method described above fails because it defaults to the
// non-primitive [] or {}. this means every time a custom SWR
// hook is called it is guaranteed to return what useEffect sees
// as a changed value. As such I kept getting thrown into an 
// infinite re-render loop when it came time to fetch order data.
// 
// Looking back to failures with unexpected undefined objects, the
// real dealbreaker was that code execution stopped. Conditional
// checks in the components were just an annoyance. Fortunately I 
// found another method to try that allows us to access a deeply 
// nested value, defaulting to undefined if an assumed key does not 
// exist. With useEffect in mind, this feels like the 'correct' 
// behavior because it matches what useSWR returns for data when
// the data is still fetching.
//
// ...
//
// So far this 'array reduce' method of accessing data is working.
// Haven't been getting "unable to read property '___' of undefined"
// errors so far. Components seem to be handling data or lack thereof
// fine without much defensive code.

import React, { useEffect, useState } from "react"
import { useSettingsStore } from "../../Contexts/SettingsZustand"
import { useLocationDetails, useLocationList } from "./Data/locationData"

import { OrderDisplay } from "./Components/OrderDisplay"

import { useOrdersByLocationByDate, useStandingByLocation } from "./Data/orderData"
import { getOrderSubmitDate } from "./Functions/dateAndTime"
import { OrderSelection } from "./Components/OrderSelection"
import { makeOrderHeader, makeOrderItems } from "./Data/dataTransformations"

const Orders8 = () => {
  const globalState = useSettingsStore()
  const user = {
    name: globalState.user,
    authClass: globalState.authClass,
    location: globalState.currentLoc
  }

  const [location, setLocation] = useState(user.location !== 'backporch' ? user.location : null)
  const [delivDate, setDelivDate] = useState(new Date(getOrderSubmitDate().plus({ days: 1}).toISO()))
  const selection = { 
    location, setLocation, 
    delivDate, setDelivDate 
  }

  const { data:locationDetails } = useLocationDetails(location)
  const { data:cartData } = useOrdersByLocationByDate(location, delivDate)
  const { data:standingData } = useStandingByLocation(location, delivDate)
  const [orderHeader, setOrderHeader] = useState(null)
  const [orderItems, setOrderItems] = useState(null)
  const orderState = { 
    orderHeader, setOrderHeader,
    orderItems, setOrderItems
  }

  useEffect(() => {
    if (!!locationDetails && !!cartData && !!standingData && !!delivDate) {
      const header = makeOrderHeader(locationDetails, cartData, standingData, delivDate)
      const items = makeOrderItems(locationDetails, cartData, standingData, delivDate)

      setOrderHeader(header)
      setOrderItems(items)
    }

  }, [locationDetails, cartData, standingData, delivDate])

  return (
    <div> 
      <h2>Orders8</h2>
      <OrderSelection 
        selection={selection}
        canChooseLocation={user.location === 'backporch'}
      />

      {orderHeader && orderItems &&
      <OrderDisplay
        orderState={orderState}
        locationDetails={locationDetails}
        selection={selection}
      />
      }

      {/* <pre>{"LOCATION DETAILS: " + JSON.stringify(locationDetails, null, 2)}</pre> */}
      {/* <pre>{"CART DATA (first 3): " + JSON.stringify(cartData?.slice(0, 3), null, 2)}</pre> */}
      {/* <pre>{"STANDING DATA (first 3): " + JSON.stringify(standingData?.slice(0, 3), null, 2)}</pre> */}
  
      {/* <pre>{"ORDER HEADER: " + JSON.stringify(orderHeader, null, 2)}</pre> */}
      {/* <pre>{"ORDER LIST: " + JSON.stringify(orderItems, null, 2)}</pre> */}
 
      <div style={{height: "200px"}} />

    </div>
  )

}

export default Orders8
