import React, { useState } from "react"

import { useSettingsStore } from "../../Contexts/SettingsZustand"

import { OrderSelection } from "./OrderComponents/OrderSelection"
import { OrderDisplay } from "./OrderComponents/OrderDisplay"

import { Panel } from "primereact/panel"

const Orders4 = () => {
  const debug = false

  // Define User Context/state
  const globalState = useSettingsStore()
  const userInfo = {
    name: globalState.user,
    authClass: globalState.authClass,
    location: globalState.userObject.attributes["custom:defLoc"]
  }

  // Define location/date selection state
  const [location, setLocation] = useState(userInfo.location !== 'backporch' ? userInfo.location : null)
  const [date, setDate] = useState(null)
  const [shouldFetchOrders, setShouldFetchOrders] = useState(false)
  const selectionProps = { 
    location, setLocation, 
    date, setDate, 
    shouldFetchOrders, setShouldFetchOrders
  }

  const [isEditing, setIsEditing] = useState(null)

  return(
    // Add Item Menu
    <div>
      <h2>(Orders 4)</h2>
      <OrderSelection 
        user={userInfo} 
        selectionProps={selectionProps} 
        debug={debug}
      />

      {shouldFetchOrders && 
        <OrderDisplay
          location={location}
          date={date}
          shouldFetchOrders={shouldFetchOrders}
          debug={debug} 
        />
      }

      {debug && 
        <Panel header="Order4 Variables" toggleable collapsed={true} style={{margin: "10px"}}>
          <pre>{"userInfo: " + JSON.stringify(userInfo, null, 2)}</pre>
          <pre>{"date: " + JSON.stringify(date, null, 2)}</pre>
        </Panel>
      }

      <div style={{height: "150px"}} />

      

    </div>
  )
}

export default Orders4

