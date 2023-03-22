import React, { useState, useEffect } from "react";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import { CartOrder } from "./CartOrder/CartOrder";
import { StandingOrder } from "./StandingOrder/StandingOrder";

import { useSettingsStore } from "../../../Contexts/SettingsZustand"
import { useLocationListSimple } from "../../../data/locationData"

//import './Orders10.css'

const standingBlacklist = ['high', 'hios', 'sandos']

const buttonModel = [
  {label: "Standing", icon: "pi pi-chevron-right", iconPos: "right"},
  {label: "Cart", icon: "pi pi-chevron-left"}
]

const Orders10 = () => {
  const user = {
    name: useSettingsStore(state => state.user),
    sub: useSettingsStore(state => state.username),
    authClass: useSettingsStore(state => state.authClass),
    locNick: useSettingsStore(state => state.currentLoc),
  }
  const { data:locationList } = useLocationListSimple(user.authClass === 'bpbfull')
  const [locNick, setLocNick] = useState(user.locNick)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setLocNick(user.locNick)
  }, [user.locNick])

  return (
    <div id="ordering-page" className="ordering-page-container" style={{padding: "0.5rem 0.5rem 150px 0.5rem"}}>
      {user.authClass === 'bpbfull' &&
        <div className="custDrop p-fluid" style={{margin: "0.5rem"}}>
          <Dropdown
            style={{width: "100%"}} 
            options={locationList}
            optionLabel="locName"
            optionValue="locNick"
            value={locNick}
            onChange={e => setLocNick(e.value)}
            filter
            filterBy="locNick,locName"
            showFilterClear
            placeholder={locationList ? "LOCATION" : "loading..."}
          />
        </div>
      }
      
      <div className="cartStandButton p-fluid" style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem"}}>
        <h1 style={{width: "fit-content"}}>{activeIndex === 0 ? "Cart Order" : "Standing Order"}</h1>
        {standingBlacklist.indexOf(user.locNick) === -1 &&
          <Button
            className="p-button-text"
            style={{width: "fit-content", height: "2.25rem"}}
            {... buttonModel[activeIndex]} 
            onClick={() => {setActiveIndex((activeIndex + 1) % buttonModel.length)}}
          />
        }
      </div>

      {activeIndex === 0 &&
        <CartOrder 
          user={user}
          locNick={locNick}
        />

      }
      {standingBlacklist.indexOf(user.locNick) === -1 && activeIndex === 1 && 
        <StandingOrder 
          user={user}
          locNick={locNick}
        />

      }

    </div>
  )
}

export default Orders10



