import React, { useState, useEffect } from "react"

import { dateToYyyymmdd, getTtl, getWeekday, getWorkingDate, getWorkingDateTime, yyyymmddToWeekday } from "../../../../functions/dateAndTime"

import { Button } from "primereact/button"

import { CartCalendar } from "./Components/CartCalendar"
import { CartItemDisplay } from "./Components/CartItemDisplay"
import { FulfillmentDropdown } from "./Components/FulfillmentDropdown"
import { ItemNoteInput } from "./Components/ItemNoteInput"

import { createOrder, updateOrder, useCartOrderData, useOrdersByLocationByDate } from "../../../../data/orderData"
import { DateTime } from "luxon"
import { useLocationDetails } from "../../../../data/locationData"
import { APIGatewayFetcher } from "../../../../data/fetchers"
import { useSettingsStore } from "../../../../Contexts/SettingsZustand"
import { useCalculateRoutesByLocation } from "../../../../data/productionData"
import { testProductAvailability } from "../_utils/testProductAvailability"
import useWindowDimensions from "../_utils/useWindowDimensions"
import { BpbTerminal } from "./Components/BpbTerminal"


export const CartOrder = ({ locNick, setLocNick }) => {
  const user = {
    name: useSettingsStore(state => state.user),
    sub: useSettingsStore(state => state.username),
    authClass: useSettingsStore(state => state.authClass),
    locNick: useSettingsStore(state => state.currentLoc),
  }
  const isLoading = useSettingsStore((state) => state.isLoading)
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const windowSize = useWindowDimensions()
  const isMobile = windowSize.width < 768

  // cart::admin state
  const [isWhole, ] = useState(true) // for possible future extension to retail orders
  
  // cart::public state
  const [delivDate, setDelivDate] = useState(
    new Date(getWorkingDateTime("NOW").plus({ days: 1 }).toISO())
  )
  const delivDateString = DateTime
    .fromJSDate(delivDate, {zone: 'America/Los_Angeles'})
    .toLocaleString({ weekday: 'short', month: 'short', day: 'numeric' })  
  const dayOfWeek = getWeekday(delivDate)
  
  const isDelivDate = delivDate.getTime() === getWorkingDateTime('NOW').toMillis()
  const isPastDeliv = delivDate < getWorkingDateTime('NOW')

  const disableInputs = isPastDeliv || (isDelivDate && user.authClass !== 'bpbfull') || isLoading

  // data
  const { data:locationDetails } = useLocationDetails(locNick, !!locNick)
  const cartOrderData = useCartOrderData(locNick, delivDate, isWhole)
  const { mutate:mutateCart } = useOrdersByLocationByDate(locNick, null, !!cartOrderData)

  const [headerChanges, setHeaderChanges] = useState({})
  const [itemChanges, setItemChanges] = useState([])
  //console.log("CART ORDER DATA:", cartOrderData)

  const changeDetected = cartOrderData
    ? detectChanges(cartOrderData.header, headerChanges, cartOrderData.items, itemChanges)
    : false
  const calculateRoutes = useCalculateRoutesByLocation(locNick, !!locNick)

  const fulfillmentOptionIsValid = (!!Object.keys(headerChanges).length) 
    ? itemChanges.map(item => {
        let validRoutes = calculateRoutes(item.product.prodNick, getWeekday(delivDate), headerChanges.route)

        return (!!validRoutes.length && validRoutes[0] !== 'NOT ASSIGNED' || item.qty === 0)
      }).every(item => item === true)
    : true
  const itemsAreAllAvailable = itemChanges?.map(item => {
    const isAvailable = testProductAvailability(item.product.prodNick, dayOfWeek)
    return (isAvailable || item.qty === 0)
  }).every(item => item === true)
  const errorsExist = !fulfillmentOptionIsValid || ! itemsAreAllAvailable

  useEffect(() => {
    if (!!cartOrderData) {
      setHeaderChanges(JSON.parse(JSON.stringify(cartOrderData.header)))
      setItemChanges(JSON.parse(JSON.stringify(cartOrderData.items)))
      console.log(cartOrderData)
    } else {
      setHeaderChanges({})
      setItemChanges([])
    }
  }, [cartOrderData])

  // Using 'handleCartLegacySubmit' while transitioning. NOT depreciated!

  // const handleCartSubmit = async () => {
  //   setIsLoading(true)
  //   console.log("submitting...")
  //   // console.log(headerChanges)
  //   // console.log("itemBase:", cartOrderData.items)
  //   // console.log("itemChanges:", itemChanges)

  //   let shouldRevalidate = false

  //   for (let orderItem of itemChanges) {
  //     const baseItem = cartOrderData.items
  //       .find(item => item.product.prodNick === orderItem.product.prodNick)

  //     // detect changes worth submitting to the DB
  //     const routeChanged = headerChanges.route !== cartOrderData.header.route
  //     const noteChanged = headerChanges.ItemNote !== cartOrderData.header.ItemNote

  //     const qtyChanged = (!baseItem && orderItem.qty > 0)
  //       || (!!baseItem && orderItem.qty !== baseItem.qty)
  //     const rateChanged = !!baseItem && orderItem.rate !== baseItem.rate

  //     const changeDetected = routeChanged || noteChanged || qtyChanged || rateChanged

  //     console.log(orderItem.product.prodNick, routeChanged, noteChanged, qtyChanged, rateChanged)

  //     // decide action
  //     let action = 'NONE'

  //     if (!orderItem.id && orderItem.qty > 0) {
  //       action = 'CREATE'
  //     } else {
  //       if (changeDetected && orderItem.orderType === 'S') action = 'CREATE'
  //       if (changeDetected && orderItem.orderType === 'C') action = 'UPDATE'
  //     }
  //     console.log(action, orderItem.product.prodNick)
      
  //     if (action === 'CREATE') {
  //       const createItem = {
  //         locNick: locNick,
  //         delivDate: dateToYyyymmdd(delivDate),
  //         isWhole: true,
  //         route: headerChanges.route,
  //         ItemNote: headerChanges.ItemNote,
  //         prodNick: orderItem.product.prodNick,
  //         qty: orderItem.qty,
  //         qtyUpdatedOn: new Date().toISOString(),
  //         sameDayMaxQty: baseItem ? baseItem.qty : orderItem.qty,
  //         rate: orderItem.rate,
  //         isLate: 0,
  //         updatedBy: user.name,
  //         ttl: getTtl(delivDate)
  //       }
  //       // console.log(createItem)

  //       // make api call

  //       const response = await createOrder(createItem)
  //       if (!!response.errors) console.log('error')
  //       else console.log('ok')
  //       if (response && !response.errors) shouldRevalidate = true
      
  //     } else if (action === 'UPDATE') {
  //       const updateItem = {
  //         id: orderItem.id
  //       }

  //       // add only changed values for submisison
  //       if (routeChanged) updateItem.route = headerChanges.route
  //       if (noteChanged) updateItem.ItemNote = headerChanges.ItemNote
  //       if (qtyChanged) updateItem.qty = orderItem.qty
  //       if (qtyChanged) updateItem.qtyUpdatedOn = new Date().toISOString()
  //       if (getWorkingDate(orderItem.qtyUpdatedOn) !== getWorkingDate('NOW')) {
  //         updateItem.sameDayMaxQty = baseItem.qty
  //       }
  //       // console.log(updateItem)

  //       // make api call

  //       const response = await updateOrder(updateItem)
  //       if (!!response.errors) console.log('error')
  //       else console.log('ok')
  //       if (response && !response.errors) shouldRevalidate = true
        
  //     }

  //     if (shouldRevalidate) {
  //       console.log('revalidating')
  //       mutateCart()
  //     }
  //     setIsLoading(false)
  //   }
  // }

  const handleCartLegacySubmit = async () => {
    setIsLoading(true)
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
      setIsLoading(false)
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

    let legacyResponse = await APIGatewayFetcher('/orders/submitLegacyCart', {body: [body]})
    console.log("bpbGateway response:", legacyResponse)
    //const legacyItems = response.body.data
      
    //****************************
    //* Submit to current system *
    //****************************
  
    if (legacyResponse.statusCode !== 200) {
      console.log("Submission error")
      setIsLoading(false)
      return
    }
  
    for (let submitItem of submitItems) {
      const baseItem = cartOrderData.items.find(b => b.product.prodNick === submitItem.product.prodNick)
      
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
          sameDayMaxQty: baseItem ? baseItem.qty : submitItem.qty,
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
        const qtyChanged = baseItem.qty !== submitItem.qty
        const rateChanged = baseItem.rate !== submitItem.rate
  
        const updateItem = {
          id: submitItem.id,
          updatedBy: user.name
        }
  
        // add only changed values for submisison
        if (routeChanged) updateItem.route = headerChanges.route
        if (noteChanged) updateItem.ItemNote = headerChanges.ItemNote
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
      setIsLoading(false)
    }
  }
  
  

  return(
    <>
    <div style={{
      height: isMobile ? "" : "50rem",
      margin: "auto",
      maxWidth: "27rem",
      // width: isMobile ? "100%" : "",
      display: "flex", 
      flexDirection: isMobile ? "row" : "column" , 
      alignItems: isMobile ? "flex-start" : "flex-end", 
      justifyContent: isMobile ? "flex-start" : "flex-start",
      alignContent: isMobile ? "" : "center",
      flexWrap: "wrap"
    }}>
      {/* <h1 style={{padding: ".5rem"}}>Cart Order</h1> */}
      {/* <div style={{width: "100%", display: "flex", flexDirection: isMobile ? "row" : "column" ,alignItems: "flex-end", justifyContent: "left", flexWrap: ""}}> */}
        <div style={{
            padding: "0.5rem", 
            flex: isMobile ? "1 1 10rem" : "", 
            order: isMobile ? "1" : "2",
            width: isMobile? "" : "18rem"
          }}
          className="bpb-input-field"
        >
          <div style={{color: "hsl(37, 100%, 10%)", fontSize: ".9rem", paddingBottom: ".1rem"}}>
              Fulfillment Method:
          </div>
          <FulfillmentDropdown 
            headerChanges={headerChanges}
            setHeaderChanges={setHeaderChanges}
            disabled={disableInputs}
          />
        </div>
        <div style={{
          // display: "inline",
          padding: "0.5rem", 
          flex: isMobile ? "0 0 7.5rem" : "", 
          order: isMobile ? "2" : "1"
          }} 
          className="bpb-input-field"
        >
          {/* <div style={{display: "flex", justifyContent: "flex-start", alignItems: "flex-end"}}> */}
            {isMobile && <div style={{color: "hsl(37, 100%, 10%)", fontSize: ".9rem", paddingBottom: ".1rem"}}>
              Order Date:
            </div>}
          {/* </div> */}
          <CartCalendar 
            delivDate={delivDate}
            setDelivDate={setDelivDate}
            locNick={locNick}
            inline={!isMobile}
          />
        </div>
      {/* </div> */}
      
      <div className="bpb-datatable-orders bpb-datatable-rounded-header bpb-datatable-rounded-footer" 
        style={{
          width: "100%",
          padding: ".5rem", 
          order: isMobile ? "3" : "5"
        }}
      >
        <CartItemDisplay 
          itemBase={cartOrderData?.items}
          itemChanges={itemChanges}  
          setItemChanges={setItemChanges}
          locNick={locNick}
          delivDate={delivDate}
          //user={user}
          fulfillmentOption={headerChanges?.route}
          calculateRoutes={calculateRoutes}
          isMobile={isMobile}
        />
      </div>

      <div className="bpb-inputtext" 
        style={{
          padding: ".5rem", 
          order: isMobile ? "4" : "3",
          width: isMobile ? "100%" : "18rem",
        }
      }>
        <ItemNoteInput 
          headerChanges={headerChanges}
          setHeaderChanges={setHeaderChanges}
          disabled={disableInputs}
        />
      </div>

      {!isMobile && <div style={{flexBasis: "100%", width: "0px", order: "5"}}/>}

      <div 
        style={{
          width: isMobile ? "100%" : "18rem",
          padding: "0.5rem", 
          order: isMobile ? "6" : "3"
        }}
      >
        <Button className="p-button-lg" 
          label={`Submit for ${delivDateString}`}
          onClick={() => {
            handleCartLegacySubmit()
          }}
          disabled={
            disableInputs 
            || !fulfillmentOptionIsValid
            || !itemsAreAllAvailable
          }
        />
        {changeDetected && <div style={{margin: "0 .5rem .5rem .5rem"}}>Changes pending</div>}
        {errorsExist && <div style={{margin: "0 .5rem .5rem .5rem"}}>Fix Errors to submit</div>}
      </div>

      {/* <pre>{JSON.stringify(itemChanges?.map(i => i.product.prodNick))}</pre>
      <pre>{JSON.stringify(getWeekday(delivDate))}</pre>
      <pre>{JSON.stringify(headerChanges?.route)}</pre>
      <pre>{JSON.stringify(fulfillmentOptionIsValid)}</pre> */}

      {/* <pre>{`${locNick}`}</pre> */}
      {/* <pre>{"CART ORDER DATA:" + JSON.stringify(cartOrderData, null, 2)}</pre> */}
      {/* <pre>{"HEADER CHANGES" + JSON.stringify(headerChanges, null, 2)}</pre> */}
      {/* <pre>{"ITEM CHANGES" + JSON.stringify(itemChanges, null, 2)}</pre> */}
    </div>
    {user.authClass === 'bpbfull' && !isMobile &&
      <div style={{padding: "6rem .5rem .5rem .5rem", margin: "auto", width: "55rem", order: "5"}}>
        <BpbTerminal 
          locNick={locNick}
          setLocNick={setLocNick}
          delivDate={delivDate}
          setDelivDate={setDelivDate}
          headerBase={cartOrderData?.header}
          headerChanges={headerChanges}
          setHeaderChanges={setHeaderChanges}
          itemBase={cartOrderData?.items}
          itemChanges={itemChanges}
          setItemChanges={setItemChanges}
        />
      </div>
    }
    </>
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

const weekLetterDisplayModel = [
  {dayOfWeek: 'Sun', symbol: 'S'},
  {dayOfWeek: 'Mon', symbol: 'M'},
  {dayOfWeek: 'Tue', symbol: 'T'},
  {dayOfWeek: 'Wed', symbol: 'W'},
  {dayOfWeek: 'Thu', symbol: 'Th'},
  {dayOfWeek: 'Fri', symbol: 'F'},
  {dayOfWeek: 'Sat', symbol: 'S'},
]


const detectChanges = (baseHeader, headerChanges, baseItems, itemChanges) => {
  if (headerChanges.route !== baseHeader.route || headerChanges.ItemNote !== baseHeader.ItemNote) return true

  for (let changeItem of itemChanges) {
    let baseItem = baseItems.find(b => b.product.prodNick === changeItem.product.prodNick)
    if (!baseItem && changeItem.qty > 0) return true
    if (!!baseItem && (baseItem.qty !== changeItem.qty)) return true
  }

}