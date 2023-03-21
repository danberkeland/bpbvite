import React, {useState} from "react"

import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
// import { InputNumber } from "primereact/inputnumber"
// import { Tag } from "primereact/tag"
// import { Sidebar } from "primereact/sidebar"
// import { Tooltip } from "primereact/tooltip"

import { AddItemSidebar } from "./AddItemSidebar"

import { getWorkingDate, getWorkingDateTime } from "../../../../../functions/dateAndTime"
import { useLocationDetails } from "../../../../../data/locationData"
import TimeAgo from "timeago-react"
import { InputText } from "primereact/inputtext"

export const CartItemDisplay = ({ itemBase, itemChanges, setItemChanges, locNick, delivDate, user, fulfillmentOption }) => {
  const { altLeadTimes } = useLocationDetails(locNick, !!locNick)
  const [rollbackQty, setRollbackQty] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  const isDelivDate = delivDate.getTime() === getWorkingDateTime('NOW').toMillis()
  const isPastDeliv = delivDate < getWorkingDateTime('NOW')
  const disableInputs = isPastDeliv || (isDelivDate && user.authClass !== 'bpbfull')

  const tableDisplayData = (!!itemBase && !!itemChanges) ? itemChanges.filter(rowData => {
    const baseItem = itemBase.find(i => i.product.prodNick === rowData.product.prodNick)

    return (!baseItem)
      || (baseItem.qty !== rowData.qty)
      || (rowData.qty > 0)
      || (rowData.action === 'CREATE')
      || (rowData.orderType === 'C' && rowData.sameDayMaxQty > 0 && getWorkingDate(rowData.qtyUpdatedOn) === getWorkingDate('NOW'))

  }) : []

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
    const recentlyDeleted = rowData.orderType === 'C' && rowData.sameDayMaxQty > 0 && getWorkingDate(rowData.qtyUpdatedOn) === getWorkingDate('NOW')
    const timingStatus = isPastDeliv ? 'past' : (isDelivDate ? 'deliv' : (isInProduction ? 'inprod' : null))
    const timingMessage = {
      inprod: " In production",
      deliv: " Delivery date reached",
      past: " Past delivery date"
    }
    return (
      <div style={rowData.qty === 0 ? {color : "gray"} : null}>
        <div style={{fontStyle: qtyChanged ? "italic" : "normal", fontWeight: "bold"}}>{`${rowData.product.prodName.replace(/\([0-9]+\)/, '').trim()}${rowData.product.packSize > 1 ? ` (${rowData.product.packSize}pk)` : ''}`}</div>
        {/* <div style={{paddingTop: ".1rem", fontSize:".9rem", whiteSpace: "nowrap"}}>{`${helperText}`}</div> */}
        {/* {rowData.product.packSize > 1 && <div style={{fontSize: ".9rem"}}>{`-- pack of ${rowData.product.packSize}`}</div>} */}
        {!!timingStatus && 
          <div style={{display: "flex", alignItems: "center", gap: ".2rem", marginBlock: ".1rem"}}>
            <span><i className="pi pi-info-circle" style={{fontSize: ".9rem"}} /></span>
            <span style={{fontSize: ".9rem"}}>
              {timingMessage[timingStatus]}
            </span>
          </div>}
        {recentlyDeleted && rowData.qty === 0 && <div style={{marginTop: ".25rem", fontSize: ".9rem"}}>{`recently deleted`}</div>}
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
    const qtyChanged = baseItem ? baseItem.qty !== rowData.qty : rowData.qty > 0

    const disableInput = (user.authClass === 'bpbfull' && delivDate < getWorkingDateTime('NOW'))
      || (maxQty === 0 || (user.authClass !== 'bpbfull' && delivDate <= getWorkingDateTime('NOW')))

    const updateProductQty = (newQty, prodNick) => {
      const _itemChanges = itemChanges.map((item) => {
        if (item.product.prodNick === prodNick) {
          return ({ 
            ...item, 
            qty: newQty > maxQty ? maxQty : (newQty === '' ? newQty : Number(newQty)) 
          })

        } 
        return item
      })
      setItemChanges(_itemChanges);
    }

    return (
      <div className="p-fluid">
        <InputText
          //className={`qty-input-${rowData.product.prodNick}`}
          value={rowData.qty}
          inputMode="numeric"
          keyfilter={/[0-9]/}
          style={{
            fontWeight : qtyChanged ? "bold" : "normal",
            color: rowData.qty === 0 ? "gray" : '',
            backgroundColor: qtyChanged ? 'hsl(37, 67%, 95%)' :'',
          }}
          tooltip={rowData.product.packSize > 1 ? `${rowData.qty || 0} pk = ${(rowData.qty || 0) * rowData.product.packSize} ea` : ''}
          tooltipOptions={{ event: 'focus', position: 'left' }}
          onClick={() => console.log(rowData)}
          readOnly={disableInput}
          //disabled={disableInput}
          onFocus={(e) => {
            setRollbackQty(parseInt(e.target.value));
            if (!disableInput) e.target.select();
          }}
          onChange={(e) => updateProductQty(e.target.value, prodNick)}
          onKeyDown={(e) => {
            console.log(e)
            if (e.key === "Enter") { 
              e.target.blur();
              if (e.target.value === "") updateProductQty(0, prodNick);
            }

            if (e.key === "Escape") {
              if (e.target.value === '') {
                e.target.blur()
                let resetQty = baseItem.qty || 0
                updateProductQty(resetQty, prodNick);
                setRollbackQty(resetQty)
              } else {
                e.target.blur()
                updateProductQty(rollbackQty, prodNick);
              }
            }
          }}
          onBlur={() => {
            if (rowData.qty === '') {
              updateProductQty(0, prodNick)
            }
          }}
        />
        {/* <Tooltip 
          target={`.qty-input-${rowData.product.prodNick}`}
          position="left"
          event="focus"
          autoHide={false}
        >
          {rowData.product.packSize > 1 && 
            <div style={{display: "flex"}}>
              <span style={{width: "4.5rem"}}>{`${(rowData.qty || 0) * rowData.product.packSize} pcs`}</span>
            </div>
          }
        </Tooltip> */}
        {showDetails &&
          <>
            <div style={{paddingTop: ".5rem", fontSize:".9rem"}}>{`$${rowData.rate.toFixed(2)}/${rowData.product.packSize > 1 ? "pk" :"ea"}.`}</div>
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

  return (
    <div className="bpb-datatable-orders" style={{padding: ".5rem"}}>
      <DataTable
        value={tableDisplayData} 
        //value={itemChanges}
        responsiveLayout
        footer={footerTemplate}
      >
        <Column 
          headerClassName="header-split-content"
          header={() => {
            return (
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
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
        <Column header={() => <Button onClick={() => setShowSidebar(true)} disabled={disableInputs} style={{width: "62px"}}>Add</Button>}
          field="qty" 
          body={qtyColumnTemplate}
          style={{width: "5.5rem"}}
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
        user={user}
        fulfillmentOption={fulfillmentOption}
      />
    </div>
  )
}


