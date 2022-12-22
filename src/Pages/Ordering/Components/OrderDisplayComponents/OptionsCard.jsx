import React from "react"

import { Card } from "primereact/card"
import { RadioButton } from "primereact/radiobutton"
import { InputTextarea } from "primereact/inputtextarea"

const CustomRadioButton = ({value, label, orderHeader, setOrderHeader, hidden}) => {
  const isDefaultOption = value === orderHeader.defaultRoute
  const checked = value === orderHeader._route
  const valueUpdated = orderHeader.route !== orderHeader._route

  return (
    <div style={{margin: "5px"}}>
      <RadioButton 
        inputId={value} 
        value={value} 
        checked={checked}
        onChange={e => setOrderHeader({...orderHeader, _route: e.value})}
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

/**For display/control of header-type order info*/
export const OptionsCard = ({orderHeader, setOrderHeader}) => {
  
  return (
    <Card 
      style={{marginTop: "10px"}}
      title="Options"
    >
      <div style={{marginBottom: "30px"}}>
        <CustomRadioButton label='Delivery' value='deliv'
          orderHeader={orderHeader} setOrderHeader={setOrderHeader}
          hidden={orderHeader.defaultRoute !== 'deliv'}
        />

        <CustomRadioButton label='Pick up SLO' value='slopick'
          orderHeader={orderHeader} setOrderHeader={setOrderHeader}
        />

        <CustomRadioButton label='Pick up Carlton' value='atownPick'
          orderHeader={orderHeader} setOrderHeader={setOrderHeader}
        />
      </div>

      <span className="p-float-label">
        <InputTextarea
          id="input-note"
          style={{width: "100%"}}
          onChange={e => setOrderHeader({ ...orderHeader, _ItemNote: e.target.value })}
        />
        <label htmlFor="input-note"
          style={{fontWeight: orderHeader._ItemNote !== orderHeader.ItemNote ? "bold" : "normal"}}
        >
          {"Add a Note" + (orderHeader._ItemNote !== orderHeader.ItemNote ? "*" : '')}
        </label>
      </span>
    </Card>
  )
}
