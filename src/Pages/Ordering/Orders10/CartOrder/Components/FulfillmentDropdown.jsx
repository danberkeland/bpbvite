import React from "react"
import { Dropdown } from "primereact/dropdown"

const fulfillmentDropdownModel = [
  {label: 'Delivery', value: 'deliv'},
  {label: 'SLO Pickup', value: 'slopick'},
  {label: 'Carlton Pickup', value: 'atownpick'}
]

export const FulfillmentDropdown = ({ headerChanges, setHeaderChanges }) => {

  const options = fulfillmentDropdownModel
  .map(
    item => item.value === headerChanges?.defaultRoute 
      ? {...item, label: `${item.label} (default)`} 
      : item
  )

  return (
    <Dropdown 
      options={options}
      value={headerChanges?.route}
      onChange={e => {
        console.log(e.value)
        setHeaderChanges({ ...headerChanges, route: e.value })
      }}
    />

  )
}
