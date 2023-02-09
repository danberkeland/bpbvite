import React from "react"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputNumber } from "primereact/inputnumber"
import { Button } from "primereact/button"
// import { Sidebar } from "primereact/sidebar"

import { AddItemSidebar } from "./AddItemSidebar"

import { getWorkingDate, getWorkingDateTime } from "../../../../../functions/dateAndTime"
import { useLocationDetails } from "../../../../../data/locationData"
import { useState } from "react"

export const CartItemDisplay = ({ itemBase, itemChanges, setItemChanges, locNick, delivDate, user }) => {
  const { altLeadTimes } = useLocationDetails(locNick, !!locNick)
  const [rollbackQty, setRollbackQty] = useState(null)
  
  const [showSidebar, setShowSidebar] = useState(false)

  const productColumnTemplate = (rowData) => {
    const prodNick = rowData.product.prodNick
    const baseItem = itemBase?.find(item => item.product.prodNick === prodNick)

    const leadTimeOverride = altLeadTimes?.find(
      (item) => item.prodNick === prodNick
      )
    const leadTime = leadTimeOverride 
      ? leadTimeOverride.altLeadTime 
      : rowData.product.leadTime
    const qtyChanged = baseItem ? baseItem.qty !== rowData.qty : rowData.qty > 0

    let helperText = ''
    if (!baseItem) helperText = '-- adding item'
    if (delivDate < getWorkingDateTime('NOW').plus({ days: leadTime })) helperText = '-- in production'
    if (delivDate.getTime() === getWorkingDateTime('NOW').toMillis()) helperText = '-- delivery date reached'
    if (delivDate < getWorkingDateTime('NOW')) helperText = '-- delivery date passed'
    
    return (
      <div>
        <div style={{fontStyle: qtyChanged ? "italic" : "normal", fontWeight: "bold"}}>{`${rowData.product.prodName}`}</div>
        <div style={{paddingTop: ".1rem", fontSize:".9rem"}}>{`${helperText}`}</div>
      </div>
    )
  }



  const qtyColumnTemplate = (rowData) => {
    const prodNick = rowData.product.prodNick
    const baseItem = itemBase?.find(item => item.product.prodNick === prodNick)
    const leadTimeOverride = altLeadTimes?.find(
      (item) => item.prodNick === rowData.prodNick
    )
    const leadTime = leadTimeOverride 
      ? leadTimeOverride.altLeadTime 
      : rowData.product.leadTime
    const inProduction = delivDate < getWorkingDateTime('NOW').plus({ days: leadTime })
    const sameDayUpdate = !!baseItem && getWorkingDate('NOW') === getWorkingDate(baseItem.qtyUpdatedOn)

    const maxQty = !inProduction || user.authClass === 'bpbfull' ? 999
      : !baseItem ? 0        
      : !sameDayUpdate ? baseItem.qty
      : baseItem.sameDayMaxQty
    const qtyChanged = baseItem ? baseItem.qty !== rowData.qty : rowData.qty > 0

    const disableInput = (user.authClass === 'bpbfull' && delivDate < getWorkingDateTime('NOW'))
      || (maxQty === 0 || delivDate < getWorkingDateTime('NOW'))

    const updateProductQty = (newQty, prodNick) => {
      const _itemChanges = itemChanges.map((item) =>
        item.product.prodNick === prodNick 
          ? { ...item, qty: newQty > 999 ? 999 : newQty } 
          : item
      )
      setItemChanges(_itemChanges);
    }

    return (
      <div className="p-fluid">
        <InputNumber
          disabled={disableInput}
          value={rowData.qty}
          min={0}
          max={maxQty}
          onFocus={(e) => {
            setRollbackQty(parseInt(e.target.value));
            e.target.select();
          }}
          onChange={(e) => updateProductQty(e.value, prodNick)}
          onValueChange={(e) => updateProductQty(e.value, prodNick)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (e.target.value === "") updateProductQty(0, prodNick);
              e.target.blur();
            }

            if (e.key === "Escape") {
              if (e.target.value === "") {
                let resetQty = baseItem.qty;
                updateProductQty(resetQty, prodNick);
              } else {
                updateProductQty(rollbackQty, prodNick);
              }
              e.target.blur();
            }
          }}
          onBlur={() => {
            if (rowData.qty === null) {
              updateProductQty(0, prodNick)
            }
          }}
        />
      </div>
    )
  }

  const footerTemplate = () => {
    const total = itemChanges ? itemChanges.reduce((acc, item) => {
      return acc + item.rate * item.qty
    }, 0).toFixed(2) : 0

    return (
      <div>{`Total: $${total}`}</div>
    )
  }



  return (
    <div className="bpb-datatable-orders" style={{padding: ".5rem"}}>
      <DataTable
        value={itemChanges} 
        responsiveLayout
        footer={footerTemplate}
      >
        <Column header="Products"
         
          field="product.prodName" 
          body={productColumnTemplate}  
        />
        <Column header={() => <Button onClick={() => setShowSidebar(true)}>Add</Button>}
          field="qty" 
          body={qtyColumnTemplate}
          style={{width: "90px"}}
        />
      </DataTable>


      <AddItemSidebar 
        locNick={locNick}
        delivDate={delivDate}
        visible={showSidebar}
        setVisible={setShowSidebar}
        cartItems={itemBase}
        cartItemChanges={itemChanges}
        setCartItemChanges={setItemChanges}
      />
    </div>
  )
}


