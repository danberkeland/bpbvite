import React from "react"

import { Card } from "primereact/card"
import { Calendar } from "primereact/calendar"
import { Dropdown } from "primereact/dropdown"

import { useLocationList } from "../Data/locationData"

export const OrderSelection = ({selection, canChooseLocation}) => {
  const { location, setLocation, delivDate, setDelivDate } = selection
  const { data:locationList, errors:locationListErrors } = useLocationList(canChooseLocation)

  return(
    <Card 
      title="Order Selection"
    >
      <div>
        {canChooseLocation && 
          <span className="p-float-label p-fluid" style={{marginTop: "25px"}}>
            <Dropdown 
              id="locationDropdown"
              options={locationList || null}
              optionLabel="locName"
              optionValue="locNick"
              value={location}
              onChange={e => setLocation(e.value)}
            />
            <label htmlFor="locationDropdown">{locationList ? "Location" : (locationListErrors ? "Error" : "Loading...")}</label>
          </span>
        }

        <span className="p-float-label p-fluid" style={{marginTop: "30px"}}>
          <Calendar 
            id="calendar"
            touchUI={true}
            style={{width: "100%"}}
            value={delivDate}
            onChange={e => setDelivDate(e.value)}
          />
          <label htmlFor="calendar">{"Delivery Date"}</label>
        </span>

      </div> 
    </Card>
    
  )
}