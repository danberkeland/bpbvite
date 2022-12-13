// iteration that does not use SWR to manage order state ('form state')
import { OrderSelection } from './OrderComponents/OrderSelection'
import { OrderDisplay } from './OrderComponents/OrderDisplay'
import { AddItemSidebar } from './OrderComponents/AddItemSidebar';
import { Button } from 'primereact/button'

import React from "react";
import { useState, useEffect } from "react";

import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { fetchOrderData } from "./DataFetching/fetcher";
import { getOrderSubmitDate } from './Functions/dateAndTime';

export const Orders6 = () => {
  const globalState = useSettingsStore()
  const user = {
    name: globalState.user,
    authClass: globalState.authClass,
    location: globalState.userObject.attributes["custom:defLoc"]
  }
  const [location, setLocation] = useState(user.location === 'backporch' ? null : user.location)
  const [delivDate, setDelivDate] = useState(new Date(getOrderSubmitDate().plus({ days: 1}).toISO()))
  const selection = {location, setLocation, delivDate, setDelivDate}

  const [orderHeader, setOrderHeader] = useState()
  const [orderData, setOrderData] = useState()
  const data = {orderHeader, setOrderHeader, orderData, setOrderData}

  const [showAddItem, setShowAddItem] = useState(false)
  const sidebarProps = {showAddItem, setShowAddItem}

  useEffect(() => {
    console.log(globalState)
  }, [])

  useEffect(() => {
    if (location && delivDate) {
      fetchOrderData(location, delivDate, setOrderHeader, setOrderData)
    }
  }, [location, delivDate])

  return (
    <div style={{margin: "10px"}}>
      <OrderSelection 
        selection={selection} 
        canChooseLocation={user.location === 'backporch'} 
      />

      {orderData &&
      <OrderDisplay 
        data={data}
        disableAddItem={delivDate <= getOrderSubmitDate()}
        setShowAddItem={setShowAddItem}
      />
      }

      {location && delivDate &&
        <AddItemSidebar 
          data={data}
          location={location}
          delivDate={delivDate}
          sidebarProps={sidebarProps}
        />
      }

      {/* TODO: Disable is no changes to DB are needed */}
      <Button label="Submit Order"
        disabled={(!location) || (!delivDate)}
        onClick={() => {
          // Need to build up order Update/Create items
          // according to schema spec.
          // Also need to decide whether to create or edit
          // apply header values to each item
          // Create if...
          //    order type is S
          //    newQty != originalQty
          // Update if...
          //    
          const orderSubmit = orderData.map(item => {
            return ({
              ...item, 
              route: orderHeader.route,
              ItemNote: orderHeader.ItemNote
            })
          })
          
          const routeChanged = orderHeader.route !== orderHeader.newRoute
          const noteChanged = orderHeader.ItemNote !== orderHeader.newItemNote

          const headerSummary = {
            routeChanged: routeChanged,
            noteChanged: noteChanged,
          }

          const itemSummary = orderSubmit.map(item => {
            const qtyChanged = item.originalQty !== item.newQty

            return ({
              originalType: item.type,
              uuid: item.orderID,
              qtyChanged: qtyChanged,
              newQty: item.newQty,
              action: (!item.orderID) && (item.newQty > 0) ? 'CREATE' : 
                (item.type === 'S' && (qtyChanged || routeChanged || noteChanged) ? 'CREATE' :
                  item.type === 'C' && (qtyChanged || routeChanged || noteChanged) ? 'UPDATE' : 'N/A'
                )
            })
          })


          const submitLog = [headerSummary, ...itemSummary]

          console.log(JSON.stringify(submitLog, null, 2))

          
        }}
      />
      
      <pre>{"location: " + JSON.stringify(location, null, 2)}</pre>
      <pre>{"delivDate: " + JSON.stringify(delivDate, null, 2)}</pre>
      <pre>{"showSidebar: " + JSON.stringify(showAddItem, null, 2)}</pre>
      <pre>{JSON.stringify(orderHeader, null, 2)}</pre>

      <div style={{height: "150px"}}></div>
    </div>
  )
}