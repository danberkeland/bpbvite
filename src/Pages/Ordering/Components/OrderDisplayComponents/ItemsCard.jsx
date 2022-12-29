import React, { useState } from "react"

import { Card } from "primereact/card"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { InputNumber } from "primereact/inputnumber"
import { useRef } from "react"
import TimeAgo from "timeago-react"
import * as timeago from "timeago.js"
import en_US from 'timeago.js/lib/lang/en_US'
import { DateTime } from "luxon"



/**For display/control of individual cart item info*/
export const ItemsCard = ({ orderItemsState, setShowAddItem }) => {
  const { orderItems, orderItemChanges, setOrderItemChanges } = orderItemsState
  const [expandedRows, setExpandedRows] = useState(null)
  const [rollbackQty, setRollbackQty] = useState(null)
  const current = useRef()
  const rollback = useRef()

  const cardTitleTemplate = () => {
    return (
      <div style={{display: "flex", }}>
        <div style={{flex: "65%"}}>
          Items
        </div>
        <div style={{flex: "35%"}}>
          <Button label="+ Add Item" 
            disabled={false}
            onClick={() => setShowAddItem(true)}
          />
        </div>
      </div>
    )
  }

  const rowExpansionTemplate = (rowData) => {
    let updateTime = timeago.format(rowData.updatedOn)
    return (
      <div>
        <p>{"Rate: " + rowData.rate}</p>
        <p>{"Subtotal: " + ( (rowData.rate * rowData.qty).toFixed(2) )}</p>
        {rowData.updatedOn && <p>Last update submitted <TimeAgo datetime={rowData.updatedOn} /></p>}
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
    return(
      <div className="p-fluid">
        <InputNumber 
          disabled={false} // means ordering date >= deliv date; order list should be read-only
          value={rowData.qty}
          min={0}
          onFocus={e => {
            current.current = parseInt(e.target.value)
            rollback.current = parseInt(e.target.value)
            e.target.select()
          }}
          onChange={e => {
            current.current = e.value
          }}
          onKeyDown={e => {
            // console.log(e)
            if (e.key === "Enter") {
              e.target.blur()
            }
            if (e.key === "Escape") {
              const _orderItemChanges = orderItemChanges.map(item =>
                item.prodNick === rowData.prodNick ?
                  {...item, qty: rollback.current} :
                  item  
              )
              setOrderItemChanges(_orderItemChanges)
              e.target.blur()
            }
          }}
          onBlur={e => {
            const _orderItemChanges = orderItemChanges.map(item =>
              item.prodNick === rowData.prodNick ?
                {...item, qty: e.target.value === '' ? rollback.current : current.current} :
                item  
            )
            setOrderItemChanges(_orderItemChanges)
          }}
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
            const changeDetected = rowData.prodNick in orderItems ? rowData.qty !== orderItems[rowData.prodNick].qty : true
            const style = {
              color: rowData.qty === 0 ? "gray" : "black",
              textDecoration: rowData.qty === 0 ? "line-through" : "",
              fontWeight: changeDetected ? "bold" : "normal"
            }

            return (
              <div style={style}>
                {rowData.prodName + (changeDetected ? "*" : "")}
              </div>
            )
          }}
        />
        <Column header="Qty" 
          field="_qty"
          style={{width: "75px"}}
          body={qtyInputTemplate}
        />
      </DataTable>

    </Card>
  )
}

