import React, { useState, useEffect } from "react"

import { dateToYyyymmdd, getTtl, getWorkingDate, getWorkingDateTime } from "../../../../functions/dateAndTime"

import { Button } from "primereact/button"

import { CartCalendar } from "./Components/CartCalendar"
import { CartItemDisplay } from "./Components/CartItemDisplay"
import { FulfillmentDropdown } from "./Components/FulfillmentDropdown"
import { ItemNoteInput } from "./Components/ItemNoteInput"

import { createOrder, updateOrder, useCartOrderData, useOrdersByLocationByDate } from "../../../../data/orderData"
import { DateTime } from "luxon"
import { useLocationDetails } from "../../../../data/locationData"
import { APIGatewayFetcher } from "../../../../data/fetchers"


export const CartOrder = ({ user, locNick }) => {
  // cart::admin state
  const [isWhole, ] = useState(true) // for possible future extension to retail orders
  
  // cart::public state
  const [delivDate, setDelivDate] = useState(
    new Date(getWorkingDateTime("NOW").plus({ days: 1 }).toISO())
  )
  const delivDateString = DateTime
    .fromJSDate(delivDate, {zone: 'America/Los_Angeles'})
    .toLocaleString({ weekday: 'short', month: 'short', day: 'numeric' })  
  
  const isDelivDate = delivDate.getTime() === getWorkingDateTime('NOW').toMillis()
  const isPastDeliv = delivDate < getWorkingDateTime('NOW')

  const disableInputs = isPastDeliv || (isDelivDate && user.authClass !== 'bpbfull')

  // data
  const cartOrderData = useCartOrderData(locNick, delivDate, isWhole)
  const { mutate:mutateCart } = useOrdersByLocationByDate(locNick, dateToYyyymmdd(delivDate), !!cartOrderData)
  const [headerChanges, setHeaderChanges] = useState(null)
  const [itemChanges, setItemChanges] = useState(null)

  const { data:locationDetails } = useLocationDetails(locNick, !!locNick)
  
  useEffect(() => {
    if (!!cartOrderData) {
        setHeaderChanges(JSON.parse(JSON.stringify(cartOrderData.header)))
        setItemChanges(JSON.parse(JSON.stringify(cartOrderData.items)))
        // console.log(cartOrderData)
    }
  }, [cartOrderData])

  const handleCartSubmit = async () => {
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

      console.log(orderItem.product.prodNick, routeChanged, noteChanged, qtyChanged, rateChanged)

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

  const handleCartLegacySubmit = async () => {
    const routeChanged = headerChanges.route !== cartOrderData.header.route
    const noteChanged = headerChanges.ItemNote !== cartOrderData.header.ItemNote
  
    let submissionCandidates = itemChanges.map(changeItem => {
      let baseItem = cartOrderData.items.find(b => b.product.prodNick === changeItem.product.prodNick)
  
      return({
        ...changeItem,
        action: assignAction(changeItem, baseItem, routeChanged, noteChanged)
      })
    })
  
    console.log(submissionCandidates)
  
    const submitItems = submissionCandidates.filter(item => item.action !== 'NONE')
    if (!submitItems.length) {
      console.log("Nothing to submit")
      return
    }
  
    //***************************
    //* Submit to legacy system *
    //***************************
  
    // Any item already in the current db or will be commited to the current
    // db on submit should be asserted in the old system. This means any item
    // that has an id, or any item just created (no id but qty > 0).
  
    // Any item in the old cart table without a counterpart in the new system
    // should get (logical) deleted (qty set to 0). This will be handled by the
    // lambda function.
  
    let legacyResponse
    const dateParts = headerChanges.delivDate.split('-')
    const mmddyyyyDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`

    const legacySubmitItems = submissionCandidates
      .filter(item => item.hasOwnProperty('id') || item.action !== 'NONE')
      .map(item => {
        return ({
          prodName: item.product.prodName,
          qty: item.qty,
          rate: item.rate
        })
      })

    const body = {
      header: {
        isWhole: headerChanges.isWhole,
        custName: locationDetails.locName,
        delivDate: mmddyyyyDate,
        route: headerChanges.route,
        PONote: headerChanges.ItemNote,
      },
      items: legacySubmitItems
    }

    console.log("submitting:", body)

    legacyResponse = await APIGatewayFetcher('/orders/submitLegacyCart', {body: [body]})
    console.log("bpbGateway response:", legacyResponse)
    //const legacyItems = response.body.data
      
    //****************************
    //* Submit to current system *
    //****************************
  
    if (legacyResponse.statusCode !== 200) {
      console.log("Submission error")
      return
    }
  
    for (let submitItem of submitItems) {
      if (submitItem.action === 'CREATE') {
        const createItem = {
          locNick: locNick,
          delivDate: dateToYyyymmdd(delivDate),
          isWhole: true,
          route: headerChanges.route,
          ItemNote: headerChanges.ItemNote,
          prodNick: submitItem.product.prodNick,
          qty: submitItem.qty,
          qtyUpdatedOn: new Date().toISOString(),
          sameDayMaxQty: submitItem.qty,
          rate: submitItem.rate,
          isLate: 0,
          updatedBy: user.name,
          ttl: getTtl(delivDate)
        }
        // console.log(createItem)
  
        // make api call
        const response = await createOrder(createItem)
        if (!!response.errors) console.log('error')
        else console.log('ok')
      }
      if (submitItem.action === 'UPDATE') {
        const baseItem = cartOrderData.items.find(b => b.product.prodNick === submitItem.product.prodNick)
        const qtyChanged = baseItem.qty !== submitItem.qty
        const rateChanged = baseItem.rate !== submitItem.rate
  
        const updateItem = {
          id: submitItem.id
        }
  
        // add only changed values for submisison
        if (routeChanged) updateItem.route = submitItem.route
        if (noteChanged) updateItem.ItemNote = submitItem.ItemNote
        if (qtyChanged) updateItem.qty = submitItem.qty
        if (qtyChanged) updateItem.qtyUpdatedOn = new Date().toISOString()
        if (getWorkingDate(submitItem.qtyUpdatedOn) !== getWorkingDate('NOW')) {
          updateItem.sameDayMaxQty = baseItem.qty
        }
        if (rateChanged) updateItem.rate = submitItem.rate
        // console.log(updateItem)
  
        // make api call
        const response = await updateOrder(updateItem)
        if (!!response.errors) console.log('error')
        else console.log('ok')
  
      }
      mutateCart()
    }
  }
  
  
  

  
  return(
    <div>
      <h1 style={{padding: ".5rem"}}>Cart Order</h1>
      <div style={{width: "100%", display: "flex", justifyContent: "left", flexWrap: ""}}>
        <div style={{padding: "0.5rem", flex: "100%"}} className="bpb-input-field p-fluid">
          <FulfillmentDropdown 
            headerChanges={headerChanges}
            setHeaderChanges={setHeaderChanges}
            disabled={disableInputs}
          />
        </div>
        <div style={{padding: "0.5rem", flex: "0 0 7.5rem"}} className="bpb-input-field p-fluid">
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
        disabled={disableInputs}
      />

      <div style={{padding: "0.5rem"}}>
        <Button className="p-button-lg" 
          label={`Submit for ${delivDateString} (New System Only)`}
          onClick={handleCartSubmit}
          disabled={disableInputs}
        />
      </div>

      <div style={{padding: "0.5rem"}}>
        <Button className="p-button-lg" 
          label={`Test Submit (Warning: mutates prod database!)`}
          onClick={handleCartLegacySubmit}
          disabled={disableInputs}
        />
      </div>

    </div>
  )

}



const assignAction = (changeItem, baseItem, routeChanged, noteChanged) => {
  const qtyChanged = (!baseItem && changeItem.qty > 0)
    || (!!baseItem && changeItem.qty !== baseItem.qty)
  const rateChanged = !!baseItem && changeItem.rate !== baseItem.rate

  const changeDetected = routeChanged || noteChanged || qtyChanged || rateChanged
  let action = 'NONE'
  if (!changeItem.id && changeItem.qty > 0) {
    action = 'CREATE'
  } else {
    if (changeDetected && changeItem.orderType === 'S') action = 'CREATE'
    if (changeDetected && changeItem.orderType === 'C') action = 'UPDATE'
  }

  return action
}

// The following was originally inside the component body:

