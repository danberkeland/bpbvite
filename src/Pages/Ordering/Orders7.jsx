// because why not?
import React, { useState } from "react"
import { useSettingsStore } from "../../Contexts/SettingsZustand"
import { useLocationList } from "./Data/locations"

import { Dropdown } from "primereact/dropdown"
import { Calendar } from "primereact/calendar"
import { useOrdersByLocationByDate } from "./Data/orderData"

const Orders7 = () => {
  const user = useCurrentUser() // these data should be constant while on the Ordering page

  const [location, setLocation] = useState(user.location !== 'backporch' ? 
    user.location : 
    null
  )
  const [delivDate, setDelivDate] = useState()
  const selection = { 
    location, setLocation, 
    delivDate, setDelivDate 
  }

  const [cartHeader, setCartHeader] = useState()
  const [cartItems, setCartItems] = useState()
  const [standingItems, setStandingItems] = useState()
  const orderState = { 
    cartHeader, setCartHeader, 
    cartItems, setCartItems, 
    standingItems, setStandingItems 
  }

  const { data:locationList } = useLocationList(user.location) // fetch depends on the user's location
  const { data:cartData } = useOrdersByLocationByDate(selection.location, selection.delivDate)

  return(
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      {user.location === 'backporch' && 
        <Dropdown 
          id="locationDropdown"
          options={locationList}
          optionLabel="locName"
          optionValue="locNick"
          value={location}
          onChange={e => setLocation(e.value)}
        />
      }
      <Calendar 
        id="calendar"
        touchUI={true}
        value={delivDate}
        onChange={e => setDelivDate(e.value)}
      />
    </div>
  )
}

export default Orders7



const useCurrentUser = () => {
  const globalState = useSettingsStore()
  console.log(globalState)
  return ({
    name: globalState.user,
    authClass: globalState.authClass,
    location: globalState.currentLoc
  })

}