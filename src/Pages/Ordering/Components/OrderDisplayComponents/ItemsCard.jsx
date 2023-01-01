import React, { useState } from "react"

import { Card } from "primereact/card"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { InputNumber } from "primereact/inputnumber"
import { Tooltip } from "primereact/tooltip"
import { confirmPopup } from "primereact/confirmpopup"
import { OverlayPanel } from "primereact/overlaypanel"
import { useRef } from "react"
import TimeAgo from "timeago-react"
import { getOrderSubmitDate, getWorkingDate } from "../../Functions/dateAndTime"
import { useProductData } from "../../Data/productData"



/**For display/control of individual cart item info*/
export const ItemsCard = ({ orderItemsState, setShowAddItem, delivDate, readOnly }) => {
  const { orderItems, orderItemChanges, setOrderItemChanges } = orderItemsState
  const [expandedRows, setExpandedRows] = useState(null)
  const [rollbackQty, setRollbackQty] = useState(null)
  const current = useRef()
  const rollback = useRef()

  const inProductionOverlay = useRef(null)
  const orderLockedOverlay = useRef(null)

  const { data:productData } = useProductData()

  const cardTitleTemplate = () => {
    return (
      <div style={{display: "flex", }}>
        <div style={{flex: "65%"}}>
          {readOnly ? "Items (Read Only)" : "Items"}
        </div>
        <div style={{flex: "35%"}}>
          <Button label="+ Add Item" 
            disabled={readOnly}
            onClick={() => setShowAddItem(true)}
          />
        </div>
      </div>
    )
  }

  const rowExpansionTemplate = (rowData) => {
    
    return (
      <div>
        <p>{"Rate: " + rowData.rate}</p>
        <p>{"Subtotal: " + ( (rowData.rate * rowData.qty).toFixed(2) )}</p>
        {rowData.qtyUpdatedOn && <p>Item edited <TimeAgo datetime={rowData.qtyUpdatedOn} /></p>}
        {rowData.updatedBy && <p>{"by " + rowData.updatedBy}</p>}
      </div>
    )
  }

  const tableFooterTemplate = () => {
    const total = orderItemChanges.reduce( (acc, item) => {
        return (acc + (item.rate * item.qty)) 
      }, 0).toFixed(2)

    return(
      <div>
        {"Total: " + total}
      </div>
    )
  }

  const qtyInputTemplate = (rowData) => {
    const orderSubmitDate = getOrderSubmitDate()
    const productDetails = productData?.find(item => item.prodNick === rowData.prodNick)
    const leadTime = productDetails?.leadTime
    const isLate = delivDate < orderSubmitDate.plus({ days: leadTime })

    return(
      <div className="p-fluid">
        <InputNumber 
          disabled={readOnly}
          value={rowData.qty}
          min={0}
          max={isLate ?
            (
              getWorkingDate('NOW') === getWorkingDate(rowData.qtyUpdatedOn) ?
                rowData.sameDayMaxQty :
                orderItems[rowData.prodNick].qty                
            ) :
            undefined}
          onFocus={e => {
            current.current = parseInt(e.target.value)
            rollback.current = parseInt(e.target.value)
            e.target.select()
          }}
          onValueChange={e => {
            const _orderItemChanges = orderItemChanges.map(item =>
              item.prodNick === rowData.prodNick ?
                {...item, qty: e.value ? parseInt(e.value) : 0} :
                item  
            )

            setOrderItemChanges(_orderItemChanges)
          }}

          onKeyDown={e => {
            if (e.key === "Enter") {
              e.target.blur()
            }
            // if (e.key === "Escape") {
            //   const _orderItemChanges = orderItemChanges.map(item =>
            //     item.prodNick === rowData.prodNick ?
            //       {...item, qty: rollback.current} :
            //       item  
            //   )
            //   current.current = rollback.current
            //   setOrderItemChanges(_orderItemChanges)
            //   e.target.blur()
            // }
          }}
          // onBlur={e => {
          //   const _orderItemChanges = orderItemChanges.map(item =>
          //     item.prodNick === rowData.prodNick ?
          //       {...item, qty: e.target.value ? parseInt(e.target.value) : 0} :
          //       item  
          //   )
          //   setOrderItemChanges(_orderItemChanges)
          // }}
        />
      </div>
    )
  }

  return (
    <Card 
      style={{marginTop: "10px"}}
      title={cardTitleTemplate}
    >   
      <DataTable
        value={orderItemChanges.filter(item => (
          item.action === 'CREATE' 
            || item.qty > 0 
            || orderItems[item.prodNick].qty > 0
        ))}
        style={{width: "100%"}}
        responsiveLayout="scroll"
        rowExpansionTemplate={rowExpansionTemplate}
        expandedRows={expandedRows} 
        onRowExpand={e => console.log("Data for " + e.data.prodNick, JSON.stringify(e.data, null, 2))}
        onRowToggle={(e) => setExpandedRows(e.data)}
        dataKey="prodNick"
        footer={tableFooterTemplate}
      >
        <Column expander={true} style={{ width: '3em' }} />
        <Column header="Product" 
          field="prodName" 
          body={rowData => {
            const orderSubmitDate = getOrderSubmitDate()
            const productDetails = productData?.find(item => item.prodNick === rowData.prodNick)
            const leadTime = productDetails?.leadTime
            const isLate = delivDate < orderSubmitDate.plus({ days: leadTime })
            const changeDetected = rowData.prodNick in orderItems ? rowData.qty !== orderItems[rowData.prodNick].qty : true
            const style = {
              color: (rowData.qty === 0 || readOnly)? "gray" : "black",
              textDecoration: rowData.qty === 0 ? "line-through" : "",
              fontWeight: changeDetected ? "bold" : "normal"
            }

            return (
              <div>
                <div style={style} 
                  className="productNameDisplay"
                  onClick={(e) => {
                    // console.log(e)
                    if (readOnly) orderLockedOverlay.current.toggle(e)
                    else if (isLate) inProductionOverlay.current.toggle(e)
                  }} 
                  aria-haspopup 
                  aria-controls="overlay_panel"
                >
                  {rowData.prodName + (changeDetected ? "*" : "")}
                  {isLate && 
                    <i id="order-table-info-icon" className="pi pi-info-circle" style={{'fontSize': '1em', marginLeft: "10px"}}></i>
                  }
                </div>
                <OverlayPanel 
                  ref={inProductionOverlay}
                  style={{maxWidth: "400px", margin: "10px"}}
                  id="in-production-overlay"
                >
                  <h2>In Production</h2>
                  <p>Order adjustments are capped at the amount recorded at daily 6:00pm changeovers.</p>
                  <p><b>Reductions and cancellations will not be reversible after the next 6:00pm changeover.</b></p>

                </OverlayPanel>

                <OverlayPanel 
                  ref={orderLockedOverlay}
                  style={{maxWidth: "400px", margin: "10px"}}
                  id="locked-overlay"
                >
                  <h2>Delivery Date Reached</h2>
                  <p>Final production day is complete. Order is no longer editable.</p>

                </OverlayPanel>

              </div>
            )
          }}
        />
        <Column header="Qty" 
          field="_qty"
          style={{width: "80px"}}
          body={qtyInputTemplate}
        />
      </DataTable>

    </Card>
  )
}

