import React, { useState, useEffect } from "react"

import { dateToYyyymmdd, getTtl, getWorkingDate, getWorkingDateTime } from "../../../../functions/dateAndTime"

import { Button } from "primereact/button"

import { CartCalendar } from "./Components/CartCalendar"
import { CartItemDisplay } from "./Components/CartItemDisplay"
import { FulfillmentDropdown } from "./Components/FulfillmentDropdown"
import { ItemNoteInput } from "./Components/ItemNoteInput"

import { createOrder, revalidateOrdersByLocationByDate, updateOrder, useCartOrderData, useOrdersByLocationByDate } from "../../../../data/orderData"


export const CartOrder = ({ user, locNick }) => {
  // cart::admin state
  const [isWhole, ] = useState(true) // for possible future extension to retail orders
  
  // cart::public state
  const [delivDate, setDelivDate] = useState(
    new Date(getWorkingDateTime("NOW").plus({ days: 1 }).toISO())
  )

  // data
  const cartOrderData = useCartOrderData(locNick, delivDate, isWhole)
  const { mutate:mutateCart } = useOrdersByLocationByDate(locNick, dateToYyyymmdd(delivDate), !!cartOrderData)
  const [headerChanges, setHeaderChanges] = useState(null)
  const [itemChanges, setItemChanges] = useState(null)
  
  useEffect(() => {
    if (!!cartOrderData) {
      setHeaderChanges(JSON.parse(JSON.stringify(cartOrderData.header)))
      setItemChanges(JSON.parse(JSON.stringify(cartOrderData.items)))
      console.log(cartOrderData)
    }
  }, [cartOrderData])

  const handleSumbit = async () => {
    console.log("submitting...")
    // console.log(headerChanges)
    // console.log("itemBase:", cartOrderData.items)
    // console.log("itemChanges:", itemChanges)

    let shouldRevalidate = false

    for (let orderItem of itemChanges) {
      const baseItem = cartOrderData.items
        .find(item => item.product.prodNick === orderItem.product.prodNick)

      // detect changes worth submitting to the DB
      const routeChanged = headerChanges.route !== cartOrderData.header.route
      const noteChanged = headerChanges.ItemNote !== cartOrderData.header.ItemNote

      const qtyChanged = (!baseItem && orderItem.qty > 0)
        || (!!baseItem && orderItem.qty !== baseItem.qty)
      const rateChanged = !!baseItem && orderItem.rate !== baseItem.rate

      const changeDetected = routeChanged || noteChanged || qtyChanged || rateChanged

      // decide action
      let action = 'NONE'

      if (!orderItem.id && orderItem.qty > 0) {
        action = 'CREATE'
      } else {
        if (changeDetected && orderItem.orderType === 'S') action = 'CREATE'
        if (changeDetected && orderItem.orderType === 'C') action = 'UPDATE'
      }
      console.log(action, orderItem.product.prodNick)
      
      if (action === 'CREATE') {
        const createItem = {
          locNick: locNick,
          delivDate: dateToYyyymmdd(delivDate),
          isWhole: true,
          route: headerChanges.route,
          ItemNote: headerChanges.ItemNote,
          prodNick: orderItem.product.prodNick,
          qty: orderItem.qty,
          qtyUpdatedOn: new Date().toISOString(),
          sameDayMaxQty: orderItem.qty,
          rate: orderItem.rate,
          isLate: 0,
          updatedBy: user.name,
          ttl: getTtl(delivDate)
        }
        // console.log(createItem)

        // make api call
        const response = await createOrder(createItem)
        
        if (!!response.errors) console.log('error')
        else console.log('ok')
        if (response && !response.errors) shouldRevalidate = true
      
      } else if (action === 'UPDATE') {
        const updateItem = {
          id: orderItem.id
        }

        // add only changed values for submisison
        if (routeChanged) updateItem.route = orderItem.route
        if (noteChanged) updateItem.ItemNote = orderItem.ItemNote
        if (qtyChanged) updateItem.qty = orderItem.qty
        if (qtyChanged) updateItem.qtyUpdatedOn = new Date().toISOString()
        if (getWorkingDate(orderItem.qtyUpdatedOn) !== getWorkingDate('NOW')) {
          updateItem.sameDayMaxQty = baseItem.qty
        }
        // console.log(updateItem)

        // make api call
        const response = await updateOrder(updateItem)
        
        if (!!response.errors) console.log('error')
        else console.log('ok')
        if (response && !response.errors) shouldRevalidate = true
        
      }

      if (shouldRevalidate) {
        console.log('revalidating')
        mutateCart()
      }

    }
  }
  
  return(
    <div>
      {/* <h1>Cart Order</h1>
      <pre>{JSON.stringify(headerChanges, null, 2)}</pre> */}
      {/* {user.authClass === 'bpbfull' &&
        <div>Admin Settings</div>
      } */}

      <div style={{padding: "0.5rem", display: "flex", gap: "1rem"}}>
        {/* <div style={{flex: "85%"}} className="bpb-input-field p-fluid"> */}
          <div className="fulfillBox">
            <div className="fulDrop">
              <FulfillmentDropdown 
                headerChanges={headerChanges}
                setHeaderChanges={setHeaderChanges}
              />
            </div>
          </div>
        {/* </div> */}
        <div style={{flex: "15%"}} className="bpb-input-field p-fluid">
          <CartCalendar 
            delivDate={delivDate}
            setDelivDate={setDelivDate}
          />
        </div>
      </div>

      <CartItemDisplay 
        itemBase={cartOrderData?.items}
        itemChanges={itemChanges}  
        setItemChanges={setItemChanges}
        locNick={locNick}
        delivDate={delivDate}
        user={user}
      />


      <ItemNoteInput 
        headerChanges={headerChanges}
        setHeaderChanges={setHeaderChanges}
      />

      <div style={{padding: "0.5rem"}}>
        <Button className="p-button-lg" 
          label="Submit"
          onClick={handleSumbit}  
        />
      </div>
    </div>
  )

}



// const handleSubmit = async () => {
//   // combine header data with items
//   // combination & submission logic will be designed 
//   // to focus on one item at a time.
  
//   // We build the submission item, then decide what, if anything,
//   // to do with it.
//   // For now we will build uniform submission items without
//   // worrying about submitting non-changes over the wire.
//   console.log("Submitting...")
//   for (let ordItm of orderItemChanges) {
//     // build submit item
//     let subItem = {
//       isWhole: true,
//       delivDate: dateToYyyymmdd(delivDate),
//       route: orderHeaderChanges.route,
//       ItemNote: orderHeaderChanges.ItemNote,
//       locNick: location,
//       prodNick: ordItm.prodNick,
//       qty: ordItm.qty,
//       rate: ordItm.rate,
//       isLate: 0,
//       updatedBy: userName,
//       ttl: getTtl(delivDate)
//     }
//     // can conditionally add other attributes in the future
//     if (!!ordItm.id && ordItm.type === "C") subItem.id = ordItm.id

//     // Decide Action
//     let action = "NONE"
//     if (subItem.hasOwnProperty("id")) {
//       // check changes for route, ItemNote, qty, rate
//       if (ordItm.qty !== orderItems[ordItm.prodNick]?.qty) action = "UPDATE"
//       if (ordItm.rate !== orderItems[ordItm.prodNick]?.rate) action = "UPDATE"
//       if (orderHeader.route !== orderHeaderChanges.route) action = "UPDATE"
//       if (orderHeader.ItemNote !== orderHeaderChanges.ItemNote) action = "UPDATE"
//     } else {
//       if (ordItm.qty > 0) action = "CREATE"
//       if (orderHeader.route !== orderHeaderChanges.route) action = "CREATE" // convert all items to cart when header values change
//       if (orderHeader.ItemNote !== orderHeaderChanges.ItemNote) action = "CREATE" // ditto here
//     }

//     if (action === "CREATE") {
//       subItem.sameDayMaxQty = ordItm.qty
//       subItem.qtyUpdatedOn = new Date().toISOString()
//     }

//     if (action === "UPDATE") {
//       if (getWorkingDate('NOW') !== getWorkingDate(ordItm.updatedOn)) {
//         subItem.sameDayMaxQty = orderItems[ordItm.prodNick].qty
//       }
//       if (ordItm.qty !== orderItems[ordItm.prodNick].qty) subItem.qtyUpdatedOn = new Date().toISOString()
//     }

//     // make API calls and revalidate cartData cache after.
//     // less dynamic/efficient, but simple.  Can be enhanced later.
//     // because of the final revalidation, response items serve no function.
//     console.log(action+": ", JSON.stringify(subItem, null, 2))

//     let response
//     if (action === "CREATE") {
//       response = await gqlFetcher(createOrder, {input: subItem})
//       response = response.data.createOrder
//       console.log(response)

//     }
//     if (action === "UPDATE") {
//       response = await gqlFetcher(updateOrder, {input: subItem})
//       response = response.data.updateOrder
//       console.log(response)

//     }

//     mutateCart()
    
//     // Testing mutate with generic SWR mutate below

//     // let variables = {
//     //   locNick: location,
//     //   delivDate: dateToYyyymmdd(delivDate)
//     // }
//     // let key = [listOrdersByLocationByDate, variables]
//     // mutate(key)
//   }

// }