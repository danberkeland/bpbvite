import React from "react"

import { Card } from "primereact/card"
import { RadioButton } from "primereact/radiobutton"
import { InputTextarea } from "primereact/inputtextarea"

/**For display/control of header-type order info*/
export const OptionsCard = ({ orderHeaderState }) => {
  const { orderHeader, orderHeaderChanges, setOrderHeaderChanges} = orderHeaderState

  return (
    <Card 
      style={{marginTop: "10px"}}
      title="Options"
    >
      {orderHeaderChanges &&
        <div style={{marginBottom: "30px"}}>
          <CustomRadioButton label='Delivery' value='deliv'
            orderHeaderState={orderHeaderState}
            hidden={orderHeader.defaultRoute !== 'deliv'}
          />

          <CustomRadioButton label='Pick up SLO' value='slopick'
            orderHeaderState={orderHeaderState}
          />

          <CustomRadioButton label='Pick up Carlton' value='atownPick'
            orderHeaderState={orderHeaderState}
          />
        </div>
      }

      {orderHeaderChanges &&
        <span className="p-float-label">
          <InputTextarea
            id="input-note"
            style={{width: "100%"}}
            onChange={e => setOrderHeaderChanges({ ...orderHeader, ItemNote: e.target.value })}
          />
          <label htmlFor="input-note"
            style={{fontWeight: orderHeader.ItemNote !== orderHeaderChanges.ItemNote ? "bold" : "normal"}}
          >
            {"Add a Note" + (orderHeader.ItemNote !== orderHeaderChanges.ItemNote ? "*" : '')}
          </label>
        </span>
      }

    </Card>
  )
}



const CustomRadioButton = ({value, label, orderHeaderState, hidden}) => {
  const { orderHeader, orderHeaderChanges, setOrderHeaderChanges } = orderHeaderState

  const isDefaultOption = value === orderHeader.defaultRoute
  const checked = value === orderHeaderChanges.route
  const valueUpdated = orderHeader.route !== orderHeaderChanges.route

  return (
    <div style={{margin: "5px"}}>
      <RadioButton 
        inputId={value} 
        value={value} 
        checked={checked}
        onChange={e => setOrderHeaderChanges({...orderHeaderChanges, route: e.value})}
        hidden={hidden || false}
      />
      <label 
        htmlFor={value} 
        style={{fontWeight: checked && valueUpdated ? "bold" : "normal"}}
      >
        {isDefaultOption ? label + " (default)" : label}
      </label>
    </div>
  )
}