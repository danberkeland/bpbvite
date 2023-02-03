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
// non-primitive [] or {}. Because these work differently than
// primitive/scalar types, useEffect interprets these as changed
// values every time a hook fails to return data, triggering a
// re-render. As such, I was getting a LOT of rerenders, to the
// point that react had to intervene and stop it.
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
//
// ...
//
// I think I have settled on a best practice
// of being as minimal with the custom data hooks as possible. It is
// important to note that the data returned from useSWR is carefully 
// cached so that "if nothing changes," the data returned is the SAME as
// the old data (as in, I'm pretty sure it points to the same memory address)
// so that we can say 'old data' === 'new data'. If we mess with the data
// at all before returning it we run the risk of creating new instances
// of the data in memory, which could falsely signal a change.
//
// In particular, whenever we have something like useEffect watching 
// and responding to changes in our cached data, we virtually eliminate
// unintended side effects (e.g. needless re-renders) by putting the
// untouched swr data in the dependency array and moving all 
// transformations inside the useEffect.

import React, { useState } from "react"
import { useSettingsStore } from "../../Contexts/SettingsZustand"
//import { useLocationDetails, useLocationList } from "./Data/locationData"

import { OrderDisplay } from "./Components/OrderDisplay"

//import { useOrdersByLocationByDate, useStandingByLocation } from "./Data/orderData"
import { getOrderSubmitDate } from "./Functions/dateAndTime"
import { OrderSelection } from "./Components/OrderSelection"
//import { makeOrderHeader, makeOrderItems } from "./Data/dataTransformations"
import { useOrderState } from "./Data/productData"

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

  // const { data:locationDetails } = useLocationDetails(location)
  // const { data:cartData } = useOrdersByLocationByDate(location, delivDate)
  // const { data:standingData } = useStandingByLocation(location, delivDate)
  


  // const [orderHeader, setOrderHeader] = useState(null)
  // const orderHeader = makeOrderHeader(locationDetails, cartData, standingData, delivDate)
  //const [orderHeaderChanges, setOrderHeaderChanges] = useState(orderHeader)

  // const [orderItems, setOrderItems] = useState(null)
  // orderItems = makeOrderItems(locationDetails, cartData, standingData, delivDate)
  //const [orderItemChanges, setOrderItemChanges] = useState(orderHeader)
  
  // child components should not mutate original header/items, so don't pass setters


  // useEffect(() => {
  //   if (!!locationDetails && !!cartData && !!standingData && !!delivDate) {
  //     let _orderHeader = makeOrderHeader(locationDetails, cartData, standingData, delivDate)
  //     let _orderItems = makeOrderItems(locationDetails, cartData, standingData, delivDate)

  //     // TODO: make sure item route values
  //     // let _orderItems = validateOrderItems()

  //     setOrderHeader(_orderHeader)
  //     setOrderHeaderChanges({
  //       route: _orderHeader.route,
  //       ItemNote: _orderHeader.ItemNote,
  //     })

  //     // simple start: just make a copy for comparison
  //     setOrderItems(_orderItems)
  //     setOrderItemChanges(_orderItems
  //       // _orderItems.map(item => {
  //       //   return({
  //       //     prodNick: item.prodNick, // for matching/comparing with orderItems (don't assume matching products have the same index!)
  //       //     qty: item.qty,
  //       //     rate: item.rate,
  //       //     status: item.qty === 0 ? 'HIDE' : 'READ'
  //       //   })
  //       // })
  //     )

  //     console.log("Order Header: ", _orderHeader)
  //     console.log("Order Items: ", _orderItems)
  //   }

  // }, [locationDetails, cartData, standingData, delivDate])

  return (
    <div> 
      <h2>Orders8</h2>
      <OrderSelection 
        selection={selection}
        canChooseLocation={user.location === 'backporch'}
      />

      <OrderDisplay
        // orderHeaderState={orderHeaderState}
        // orderItemsState={orderItemsState}
        // locationDetails={locationDetails}
        location={location}
        delivDate={delivDate}
      />
 

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
