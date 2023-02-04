import React from "react"

import { Card } from "primereact/card"
import { RadioButton } from "primereact/radiobutton"
import { InputTextarea } from "primereact/inputtextarea"

/**For display/control of header-type order info*/
export const OptionsCard = ({ orderHeaderState, readOnly }) => {
  const { orderHeader, orderHeaderChanges, setOrderHeaderChanges} = orderHeaderState

  return (
    <Card 
      style={{marginTop: "0px"}}
      //title={readOnly ? "Items (Read Only)" : "Items"}
    >
      {orderHeaderChanges &&
        <div style={{marginBottom: "30px"}}>
          <CustomRadioButton label='Delivery' value='deliv'
            orderHeaderState={orderHeaderState}
            hidden={orderHeader.defaultRoute !== 'deliv'}
            disabled={readOnly}
          />

          <CustomRadioButton label='Pick up SLO' value='slopick'
            orderHeaderState={orderHeaderState}
            disabled={readOnly}
          />

          <CustomRadioButton label='Pick up Carlton' value='atownpick'
            orderHeaderState={orderHeaderState}
            disabled={readOnly}
          />
        </div>
      }

      {orderHeaderChanges &&
        <span className="p-float-label">
          <InputTextarea
            id="input-note"
            style={{width: "100%"}}
            value={orderHeader.ItemNote ? orderHeader.itemNote : undefined}
            onChange={e => setOrderHeaderChanges({ ...orderHeader, ItemNote: e.target.value ? e.target.value : null })}
            disabled={readOnly}
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



const CustomRadioButton = ({value, label, orderHeaderState, hidden, disabled}) => {
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
        disabled={disabled}
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