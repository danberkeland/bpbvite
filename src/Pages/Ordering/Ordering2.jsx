import React, { useState } from "react"
// import Orders10 from "./Orders10/Orders10"
import { Orders } from "./Orders/Orders"

import { useSettingsStore } from "../../Contexts/SettingsZustand"
import { Button } from "primereact/button"

// LocNicks specified here will have the new ordering page show by default
// (customers will not have the option to toggle)
const testLocations = ['backporch', 'slopro']

const Ordering2 = () => {

  const authClass = useSettingsStore(state => state.authClass)
  //const userLocNick = useSettingsStore(state => state.currentLoc)
  const [useTestAuth, setUseTestAuth] = useState(false)
  // const [showNewPage, setShowNewPage] = useState(
  //   testLocations.includes(userLocNick) ? true : false
  // )
  const [showNewPage, setShowNewPage] = useState(true)

  return(
    <div style={{margin:"auto"}}>
      {authClass === 'bpbfull' && 
        <div style={{display: "flex", alignItems: "center"}}>
          {/* <Button label="Toggle Test Page" 
            style={{margin: "1rem"}}
            onClick={() => setShowNewPage(!showNewPage)}  
          /> 
          <span>
            Mode: {showNewPage ? "Test" : "Prod"}
          </span> */}
          <Button label="Toggle Auth" 
            style={{margin: "1rem"}}
            onClick={() => setUseTestAuth(!useTestAuth)}  
          /> 
          <span>
            Auth: {useTestAuth ? "customer" : "bpbfull"}
          </span>
        </div>
      }
      {/* <Orders9 /> */}
      {/* {!showNewPage && <Orders10 />} */}
      {showNewPage && <Orders useTestAuth={useTestAuth} />}
    </div>
  )
}

export default Ordering2

// Ordering2 exists for convenience so that we can swap/iterate work 
// more easily without leaving the Ordering folder.