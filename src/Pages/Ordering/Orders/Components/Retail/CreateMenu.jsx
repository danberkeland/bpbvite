import { InputText } from "primereact/inputtext"
import { InputLabel } from "../InputLabel"
import { useState } from "react"
import { Button } from "primereact/button"




export const CreateMenu = () => {

  const [orderName, setOrderName] = useState('')

  return (
    <div style={{
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "flex-end",
      gap: "1rem"
    }}>
      <InputLabel label="Name for New Order">
        {/* <Dropdown 
          options={customerNames.filter(n => !namesForDate.includes(n))}
          value={createName}
          style={{
            // width: "25rem"
            flex: "1 1 25rem"
          }} 
          editable
          onChange={e => setCreateName(e.value)}
        /> */}
        <InputText 
          onChange={e => setOrderName(e.target.value)}
        />
      </InputLabel>

      <Button label="Create" 
        disabled={!orderName}
        
      />
    </div>
  )
}