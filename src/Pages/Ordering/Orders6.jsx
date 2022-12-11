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
  const [delivDate, setDelivDate] = useState(null)
  const selection = {location, setLocation, delivDate, setDelivDate}

  const [orderHeader, setOrderHeader] = useState()
  const [orderData, setOrderData] = useState()
  const data = {orderHeader, setOrderHeader, orderData, setOrderData}

  const [showAddItem, setShowAddItem] = useState(false)
  const sidebarProps = {showAddItem, setShowAddItem}

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

      <Button label="Submit Order"
        onClick={() => {
          // Need to build up order Update/Create items
          // according to schema spec.
          // Also need to decide whether to create or edit
          // apply header values to each item
          const orderSubmit = orderData.map(item => {
            return ({
              ...item, 
              route: orderHeader.route,
              ItemNote: orderHeader.ItemNote
            })
          })
          alert(JSON.stringify(orderSubmit, null, 2))
        }}
      />
      
      <pre>{"location: " + JSON.stringify(location, null, 2)}</pre>
      <pre>{"delivDate: " + JSON.stringify(delivDate, null, 2)}</pre>
      <pre>{"showSidebar: " + JSON.stringify(showAddItem, null, 2)}</pre>
      {/* <pre>{JSON.stringify(orderData, null, 2)}</pre> */}

      <div style={{height: "150px"}}></div>
    </div>
  )
}