import React, { useRef, useState } from "react";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import { CartOrder } from "./CartOrder/CartOrder";
import { StandingOrder } from "./StandingOrder/StandingOrder";

import { useSettingsStore } from "../../../Contexts/SettingsZustand"
import { useLocationDetails, useLocationListSimple } from "../../../data/locationData"

import { Menu } from "primereact/menu"
import { useUserDetails } from "../../../data/users";
import getNestedObject from "../../../functions/getNestedObject";

//import './Orders10.css'


const buttonModel = [
  {label: "EDIT STANDING ORDER"},
  {label: "RETURN TO CART", icon: "pi pi-chevron-left"}
]

const Orders10 = () => {
  const globalState = useSettingsStore()
  const user = {
    name: globalState.user,
    sub: globalState.userObject.username,
    authClass: globalState.authClass,
    locNick: globalState.currentLoc,
  }
  const setCurrentLoc = globalState.setCurrentLoc

  const { data:userDetails } = useUserDetails(user.sub, !!user.sub)
  const { data:currentLocDetails } = useLocationDetails(user.locNick, !!user.locNick)
  const { data:locationList } = useLocationListSimple(true)

  const [locNick, setLocNick] = useState(user.locNick)
  const [activeIndex, setActiveIndex] = useState(0)
  const userMenu = useRef(null)
  const locationMenu = useRef(null)

  const userMenuItems = [
    {
      label: user.name,
      icon: "pi pi-fw pi-user",
      items: [
        {
          label: "Sign Out",
          icon: "pi pi-fw pi-sign-out"
        }
      ]
    }
  ]

  const userLocations = getNestedObject(userDetails, ['locs', 'items']) || []
  const locationItems = locationList ? userLocations
    .filter(i => i.locNick !== user.locNick)
    .map(i => ({
      label: locationList.find(loc => loc.locNick === i.locNick).locName,
      command: () => {
        setCurrentLoc(i.locNick)
        setLocNick(i.locNick)
      }
    })) : []

  const locationMenuItems = [
    {
      label: "Change Location...",
      items: locationItems
    }
  ]

  console.log(globalState)
  console.log(currentLocDetails)
  console.log(userDetails)

  return (
    <div id="ordering-page" className="ordering-page-container" style={{padding: "0.5rem 0.5rem 200px 0.5rem"}}>
      
        <div style={{display: "flex", justifyContent: "space-between", margin: ".5rem", padding: ".25rem", backgroundColor: "hsl(37, 100%, 80%)", borderRadius: "3px"}}>
            {userLocations.length === 0 &&
              <div className="read-only-button">
                <Button 
                  onClick={(e) => locationMenu.current.toggle(e)} 
                  className="p-button-text"
                  style={{width: "fit-content"}}
                  disabled={true}
                >
                    <i className="pi pi-fw pi-map-marker" /><span style={{marginRight: ".5rem"}}>{currentLocDetails?.locName}</span>
                </Button>
              </div>
            }
            {userLocations.length > 0 &&
              <div>
                <Menu model={locationMenuItems} popup ref={locationMenu} />
                <Button 
                  onClick={(e) => locationMenu.current.toggle(e)} 
                  className="p-button-text"
                  style={{width: "fit-content"}}
                  
                >
                    <i className="pi pi-fw pi-map-marker" /><span style={{marginRight: ".5rem"}}>{currentLocDetails?.locName}</span> <i className="pi pi-chevron-down" />
                </Button>
              </div>
            }
            <div>
              <Menu model={userMenuItems} popup ref={userMenu} />
              <Button 
                onClick={(e) => userMenu.current.toggle(e)} 
                className="p-button-text"
                style={{width: "fit-content"}}
              >
                  <i className="pi pi-fw pi-user" /><span style={{marginRight: ".5rem"}}>{user.name.split(' ').map(w => w.substring(0,1).toUpperCase()).join('')}</span> <i className="pi pi-chevron-down" />
              </Button>
            </div>
        </div>
      
      
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

      <pre>{JSON.stringify(locNick, null, 2)}</pre>

    </div>
  )
}

export default Orders10



