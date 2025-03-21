import { InputText } from "primereact/inputtext"
import { InputLabel } from "../InputLabel"
import { useState } from "react"
import { Button } from "primereact/button"




export const CreateMenu = ({
  formMode, setFormMode,
  delivDateISO,
  setCurrentOrderBase, setCurrentOrder,
  orderName, setOrderName,
}) => {

  return (
    <div style={{
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "flex-end",
      gap: "1rem"
    }}>
      <InputLabel label="Name for New Order">
        <InputText 
          value={orderName}
          onChange={e => setOrderName(e.target.value)}
          disabled={formMode !== 'hide'}
        />
      </InputLabel>

      <Button label="Create" 
        disabled={!orderName || formMode !== 'hide'}
        onClick={() => {
          let newOrder = structuredClone(initOrder)
          newOrder.header.locNick = orderName
          newOrder.header.delivDate = delivDateISO
          setCurrentOrderBase(structuredClone(newOrder))
          setCurrentOrder(structuredClone(newOrder))
          setFormMode('create')
        }}
        
      />
    </div>
  )
}

const initOrder = {
  header: {
    locNick: '',
    delivDate: '',
    isWhole: false,
    route: null,
    ItemNote: '',
    updatedBy: "bpb_admin"
  },
  items: [],
}