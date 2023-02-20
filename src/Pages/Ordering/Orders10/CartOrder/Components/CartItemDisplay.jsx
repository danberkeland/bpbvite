import React from "react"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputNumber } from "primereact/inputnumber"
import { Button } from "primereact/button"
// import { Tag } from "primereact/tag"
// import { Sidebar } from "primereact/sidebar"

import { AddItemSidebar } from "./AddItemSidebar"

import { getWorkingDate, getWorkingDateTime } from "../../../../../functions/dateAndTime"
import { useLocationDetails } from "../../../../../data/locationData"
import { useState } from "react"
import TimeAgo from "timeago-react"

export const CartItemDisplay = ({ itemBase, itemChanges, setItemChanges, locNick, delivDate, user }) => {
  const { altLeadTimes } = useLocationDetails(locNick, !!locNick)
  const [rollbackQty, setRollbackQty] = useState(null)
  
  const [showSidebar, setShowSidebar] = useState(false)

  const [showDetails, setShowDetails] = useState(false)

  const isDelivDate = delivDate.getTime() === getWorkingDateTime('NOW').toMillis()
  const isPastDeliv = delivDate < getWorkingDateTime('NOW')
  const disableInputs = isPastDeliv || (isDelivDate && user.authClass !== 'bpbfull')

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

    const isInProduction = delivDate < getWorkingDateTime('NOW').plus({ days: leadTime })
    const timingStatus = isPastDeliv ? 'past' : (isDelivDate ? 'deliv' : (isInProduction ? 'inprod' : 'none'))
    
    return (
      <div style={rowData.qty === 0 ? {color : "gray"} : null}>
        <div style={{fontStyle: qtyChanged ? "italic" : "normal", fontWeight: "bold"}}>{`${rowData.product.prodName}`}</div>
        {/* <div style={{paddingTop: ".1rem", fontSize:".9rem", whiteSpace: "nowrap"}}>{`${helperText}`}</div> */}
        {timingStatus === 'inprod' && <div style={{marginTop: ".25rem", fontSize: ".9rem"}}><i className="pi pi-info-circle" style={{fontSize: ".9rem"}} />{` in production`}</div>}
        {timingStatus === 'deliv' && <div style={{marginTop: ".25rem", fontSize: ".9rem"}}><i className="pi pi-info-circle" style={{fontSize: ".9rem"}} />{` delivery date reached`}</div>}
        {timingStatus === 'past' && <div style={{marginTop: ".25rem", fontSize: ".9rem"}}><i className="pi pi-info-circle" style={{fontSize: ".9rem"}} />{` past delivery date`}</div>}
        {showDetails && 
          <>
            {rowData.qtyUpdatedOn && (
              <div style={{paddingTop: ".5rem", fontSize:".9rem"}}>edited <TimeAgo datetime={rowData.qtyUpdatedOn}/></div>
              )}
            {rowData.updatedBy && <div style={{fontSize:".9rem"}}>{`by ${rowData.updatedBy}`}</div>}
            {rowData.orderType === 'S' &&
              <div style={{fontSize:".9rem"}}>-- standing order</div>
            }
            {/* <div style={{paddingTop: ".5rem", fontSize:".9rem"}}>{`$${(rowData.rate).toFixed(2)}/ea, Subtotal: $${(rowData.rate * rowData.qty).toFixed(2)}`}</div> */}
          </>
        }
      </div>
    )
  }



  const qtyColumnTemplate = (rowData) => {
    const prodNick = rowData.product.prodNick
    const baseItem = itemBase?.find(item => item.product.prodNick === prodNick)
    const leadTimeOverride = altLeadTimes?.find(
      (item) => item.prodNick === rowData.product.prodNick
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
    // const qtyChanged = baseItem ? baseItem.qty !== rowData.qty : rowData.qty > 0

    const disableInput = (user.authClass === 'bpbfull' && delivDate < getWorkingDateTime('NOW'))
      || (maxQty === 0 || delivDate <= getWorkingDateTime('NOW'))

    const updateProductQty = (newQty, prodNick) => {
      const _itemChanges = itemChanges.map((item) => {
        if (item.product.prodNick === prodNick) {
          return { ...item, qty: newQty > 999 ? 999 : newQty } 

        } 
        return item
      })
      setItemChanges(_itemChanges);
    }

    return (
      <div className="p-fluid">
        <InputNumber
          onClick={() => console.log(rowData)}
          readOnly={disableInput}
          //disabled={disableInput}
          value={rowData.qty}
          min={0}
          max={maxQty}
          onFocus={(e) => {
            setRollbackQty(parseInt(e.target.value));
            if (!disableInput) e.target.select();
          }}
          onChange={(e) => updateProductQty(e.value, prodNick)}
          onValueChange={(e) => updateProductQty(e.value, prodNick)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.target.blur();
              if (e.target.value === "") updateProductQty(0, prodNick);
            }

            if (e.key === "Escape") {
              if (e.target.value === "") {
                e.target.blur()
                let resetQty = baseItem ? baseItem.qty : 0
                updateProductQty(resetQty, prodNick);
                setRollbackQty(resetQty)
              } else {
                e.target.blur()
                updateProductQty(rollbackQty, prodNick);
              }
            }
          }}
          onBlur={() => {
            if (rowData.qty === null) {
              updateProductQty(0, prodNick)
            }
          }}
        />
        {showDetails &&
          <>
            <div style={{paddingTop: ".5rem", fontSize:".9rem"}}>{`$${rowData.rate.toFixed(2)}/ea.`}</div>
            <div style={{paddingTop: ".5rem", fontSize:".9rem"}}>Subtotal:</div>
            <div style={{fontSize:".9rem"}}>{`$${(rowData.rate * rowData.qty).toFixed(2)}`}</div>
          </>
        }
      </div>
    )
  }

  const footerTemplate = () => {
    const total = itemChanges ? itemChanges.reduce((acc, item) => {
      return acc + item.rate * item.qty
    }, 0).toFixed(2) : 0

    return (
      <div style={{textAlign: 'right'}}>{`Total: $${total}`}</div>
    )
  }

  const tableDisplayData = (!!itemBase && itemChanges) ? itemChanges.filter(rowData => {
    const baseItem = itemBase.find(i => i.product.prodNick === rowData.product.prodNick)

    return (!baseItem)
      || (baseItem.qty !== rowData.qty)
      || (rowData.qty > 0)
      || (rowData.orderType === 'C' && rowData.sameDayMaxQty > 0 && getWorkingDate(rowData.qtyUpdatedOn) === getWorkingDate('NOW'))

  }) : []

  return (
    <div className="bpb-datatable-orders" style={{padding: ".5rem"}}>
      <DataTable
        value={tableDisplayData} 
        responsiveLayout
        footer={footerTemplate}
      >
        <Column 
          header={() => {
            return (
              <div style={{width: "200px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <span onClick={() => {console.log(itemChanges)}}>Products</span> 
                <Button 
                  icon={showDetails ? "pi pi-search-minus" : "pi pi-search-plus"}
                  className="p-button-rounded p-button-text" 
                  onClick={() => setShowDetails(!showDetails)}
                />
              </div>

            )
          }}
          field="product.prodName" 
          body={productColumnTemplate}  
        />
        <Column header={() => <Button onClick={() => setShowSidebar(true)} disabled={disableInputs}>Add</Button>}
          field="qty" 
          body={qtyColumnTemplate}
          style={{width: "6rem"}}
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


