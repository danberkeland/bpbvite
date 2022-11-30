import React from "react"

import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Calendar } from "primereact/calendar"
import { Dropdown } from "primereact/dropdown"
import { Panel } from "primereact/panel"

import { useLocationList } from "../DataFetching/hooks"

export function OrderSelection({user, selectionProps, debug}) {
  // user (context) values are not expected to change during component lifecycle
  const { location, setLocation, date, setDate, shouldFetchOrders, setShouldFetchOrders } = selectionProps
  
  // user.location is used to decide whether or not to fetch
  const { locationList, locationListErrors } = useLocationList(user.location)

  const CardTitle = () => "Order Selection"
  const CardFooter = () => {
    return(
      <Button 
        label="Show Orders" 
        onClick={() => setShouldFetchOrders(true)}
        disabled={!date || !location}
      />
    )
  }
  
  return(
    <Card 
      style={{margin: "10px"}}
      title={<CardTitle />}
      footer={<CardFooter />}
    >
      <div>

        {(user.location === 'backporch') && 
          <span className="p-float-label p-fluid" style={{marginTop: "25px"}}>
            <Dropdown 
              id="locationDropdown"
              options={locationList ? locationList : []}
              optionLabel="locName"
              optionValue="locNick"
              value={location}
              onChange={e => {
                setShouldFetchOrders(false)
                setLocation(e.value)
              }}
            />
            <label htmlFor="locationDropdown">{true ? "Location" : "Loading..."}</label>
          </span>
        }

        <span className="p-float-label p-fluid" style={{marginTop: "30px"}}>
          <Calendar 
            id="calendar"
            touchUI={true}
            style={{width: "100%"}}
            value={date}
            onChange={e => {
              setShouldFetchOrders(false)
              setDate(e.value)
            }}
          />
          <label htmlFor="calendar">{"Delivery Date"}</label>
        </span>

        {debug && 
          <Panel header="OrderSelection Variables" toggleable collapsed={true} style={{marginTop: "15px"}}>
            <pre>{"user: " + JSON.stringify(user, null, 2)}</pre>
            <pre>{"selection: " + JSON.stringify(selectionProps, null, 2)}</pre>
            <pre>{"locationList (head): " + (locationList ? JSON.stringify(locationList.slice(0,5), null, 2) : "null")}</pre>
          </Panel>
        }
      </div> 
    </Card>
  )
}