import React, { useState } from "react"
import Orders10 from "./Orders10/Orders10"
import { Orders } from "./Orders/Orders"

import { useSettingsStore } from "../../Contexts/SettingsZustand"
import { Button } from "primereact/button"

const Ordering2 = () => {

  const authClass = useSettingsStore(state => state.authClass)
  const [showNewPage, setShowNewPage] = useState(false)
  const [useTestAuth, setUseTestAuth] = useState(false)

  return(
    <div style={{margin:"auto"}}>
      {authClass === 'bpbfull' && 
        <div style={{display: "flex", alignItems: "center"}}>
          <Button label="Toggle Test Page" 
            style={{margin: "1rem"}}
            onClick={() => setShowNewPage(!showNewPage)}  
          /> 
          <span>
            {showNewPage ? "Mode: Test" : "Mode: Prod"}
          </span>
          <Button label="Toggle Auth" 
            style={{margin: "1rem"}}
            onClick={() => setUseTestAuth(!useTestAuth)}  
          /> 
          <span>
            {useTestAuth ? "Auth: customer" : "Auth: bpbfull"}
          </span>
        </div>
      }
      {/* <Orders9 /> */}
      {!showNewPage && <Orders10 />}
      {showNewPage && <Orders useTestAuth={useTestAuth} />}
    </div>
  )
}

export default Ordering2

// Ordering2 exists for convenience so that we can swap/iterate work 
// more easily without leaving the Ordering folder.