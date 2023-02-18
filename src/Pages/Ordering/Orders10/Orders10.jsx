import React, { useState } from "react";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import { CartOrder } from "./CartOrder/CartOrder";
import { StandingOrder } from "./StandingOrder/StandingOrder";

import { useSettingsStore } from "../../../Contexts/SettingsZustand";
import { useLocationListSimple } from "../../../data/locationData";

//import './Orders10.css'


const buttonModel = [
  {label: "EDIT STANDING ORDER"},
  {label: "RETURN TO CART", icon: "pi pi-chevron-left"}
]

const Orders10 = () => {
  const globalState = useSettingsStore()
  const user = {
    name: globalState.user,
    authClass: globalState.authClass,
    locNick: globalState.currentLoc,
  }

  const [locNick, setLocNick] = useState(user.locNick)
  const [activeIndex, setActiveIndex] = useState(0)

  const { data: locationList } = useLocationListSimple(true)

  return (
    <div id="ordering-page" className="ordering-page-container" style={{padding: "0.5rem 0.5rem 200px 0.5rem"}}>
      {user.authClass === 'bpbfull' &&
        <div className="custDrop p-fluid" style={{margin: "0.5rem"}}>
        <Dropdown 
          options={locationList}
          optionLabel="locName"
          optionValue="locNick"
          value={locNick}
          onChange={e => setLocNick(e.value)}
          filter
          filterby="locNick,locName"
          showFilterClear
          placeholder={locationList ? "LOCATION" : "loading..."}
        />
        </div>
      }
        <div className="cartStandButton p-fluid" style={{padding: "0.5rem"}}>
          <Button 
            {... buttonModel[activeIndex]} 
            onClick={() => {setActiveIndex((activeIndex + 1) % buttonModel.length)}}
          />
        </div>

      {activeIndex === 0 &&
        <CartOrder 
          user={user}
          locNick={locNick}
        />

      }

      {activeIndex === 1 &&
        <StandingOrder 
          user={user}
          locNick={locNick}
        />

      }

    </div>
  )
}

export default Orders10