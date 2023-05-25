import React from "react"
import { Dropdown } from "primereact/dropdown"
import { InputLabel } from "../InputLabel"

const delivOptions = [
  {label: 'Delivery', value: 'deliv'},
]
const pickupOptions = [
  {label: 'SLO Pickup', value: 'slopick'},
  {label: 'Carlton Pickup', value: 'atownpick'}
]

export const FulfillmentDropdown = ({ 
  location, 
  cartHeader, 
  setCartHeader, 
  disabled 
}) => {
  const defaultRoute = ['slopick', 'atownpick'].includes(location?.zoneNick)
    ? location.zoneNick
    : 'deliv'

  let dropdownModel = defaultRoute === 'deliv' 
    ? delivOptions.concat(pickupOptions) 
    : pickupOptions
    

  return (
    <InputLabel label="Fulfillment Method" 
      htmlFor="fulfillment-dropdown"
      disabled={disabled}
    >
      <Dropdown 
        id="fulfillment-dropdown"
        options={dropdownModel}
        placeholder="loading..."
        value={cartHeader?.route ?? null}
        onChange={e => {
          if (!disabled) setCartHeader({ ...cartHeader, route: e.value })
        }}
        itemTemplate={option => 
          <span>
            {option.label}
            {`${option.value === defaultRoute ? ' (default)' : ''}`}
          </span>
        }
        valueTemplate={(option, props) => !!option
          ? <span>{option.label}</span>
          : <span>{props.placeholder}</span>
        }
        // disabled={disabled}
        style={{
          width: "100%",
          border: "none",
          boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2),"
            + " 0 1px 1px 0 rgba(0, 0, 0, 0.14),"
            + " 0 1px 3px 0 rgba(0, 0, 0, 0.12)",
        }}
      />
    </InputLabel>
  )
}
