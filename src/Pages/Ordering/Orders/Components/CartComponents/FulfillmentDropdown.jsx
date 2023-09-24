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
  disabled,
  containerStyle,
}) => {
  const defaultRoute = ['atownpick', 'slopick', 'deliv'].includes(location?.dfFulfill)
    ? location.dfFulfill
    : ['atownpick', 'slopick'].includes(location?.zoneNick) 
      ? location.zoneNick
      : 'deliv'

  let dropdownModel = ['atownpick', 'slopick'].includes(location?.zoneNick) 
    ? pickupOptions
    : delivOptions.concat(pickupOptions) 
    

  return (
    <div style={containerStyle}>
      <InputLabel label="Fulfillment Method" 
        htmlFor="fulfillment-dropdown"
        disabled={disabled}
        helpHeader="Fulfillment"
        helpText={                  
          `Your order can be set for ${
            !['slopick', 'atownpick'].includes(location?.zoneNick) 
              ? "delivery, or for "
              : ''
          }pickup at either of our locations. Orders will be preset
          to handle your usual needs, but take care when you set
          this option manually. If you pick an unintended option, your
          order will end up in the wrong place!`
        }
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
    </div>
  )
}
