import React from "react";

import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";

import { useLocationDetails, useLocationList } from "../Data/locationData";




export const AdminControls = ({ adminSettings, orderingType }) => {
  const { location, setLocation, isWhole, setIsWhole, isStand, setIsStand } = adminSettings
  const { data:locationDetails } = useLocationDetails(location, !!location)

  return(
    <Card title="AdminControls">
      <LocationDropdown 
        location={location}
        setLocation={setLocation}
      />

      {orderingType === 'standing' &&
        <>
          <div className="field-checkbox" style={{marginLeft: "25px"}}>
            <Checkbox
              inputId="iswhole"
              onChange={e => setIsWhole(e.checked)}
              checked={isWhole}
              style={{marginRight: "0.5em"}}
            />
            <label htmlFor="iswhole" className="p-checkbox-label">isWhole</label>
          </div>

          <div className="field-checkbox" style={{marginLeft: "25px", marginTop: "5px"}}>
            <Checkbox
              inputId="isstand"
              onChange={e => setIsStand(e.checked)}
              checked={isStand}
              style={{marginRight: "0.5em"}}
            />
            <label htmlFor="isstand" className="p-checkbox-label">isStand</label>
          </div>
        </>
      }

    </Card>


  )

}



const LocationDropdown = ({ location, setLocation }) => {
  const { data:locationList, errors:locationListErrors } = useLocationList(true)

  return(
    <div className="p-float-label p-fluid" style={{margin: "0px 25px 10px 25px"}}>
      <Dropdown 
        id="locationDropdown"
        options={locationList || null}
        optionLabel="locName"
        optionValue="locNick"
        value={location}
        filter
        onChange={e => setLocation(e.value)}
      />
      <label htmlFor="locationDropdown">{locationList ? "Location" : (locationListErrors ? "Error" : "Loading...")}</label>
    </div>

  )

}