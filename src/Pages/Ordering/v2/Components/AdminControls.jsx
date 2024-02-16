import { Button } from "primereact/button"
import { LocationSelector } from "./LocationSelector"
import React from "react"

const AdminControls = ({
  authClass, 
  setAuthClass,
  
  location, 
  changeLocation,
  locations,
  disableLocationControl,
  setShowLocationDialog,

}) => {

  return (
    <div className="admin-panel">
      <div className="split-header">
        <h2>Admin Controls</h2> 
        <span onClick={() => setAuthClass(authClass === 'bpbfull' 
          ? 'customer' 
          : 'bpbfull'
        )}>
          view as: {authClass === 'bpbfull' ? 'admin' : 'user'}
        </span>
      </div>
      <div className="split-body"> 
        <div className="location-select-container">
          <label htmlFor="location-select">Location</label>
          <LocationSelector 
            location={location}
            onLocationChange={changeLocation}
            locations={locations}
            disabled={disableLocationControl}
          />
        </div>
        <Button label="Info" 
          className="p-button-raised"
          onClick={() => { if (!!location) setShowLocationDialog(true) }}
          disabled={disableLocationControl}
          style={{marginLeft: "auto"}}
        />
      </div>
    </div>
  )

}

export {
  AdminControls
}