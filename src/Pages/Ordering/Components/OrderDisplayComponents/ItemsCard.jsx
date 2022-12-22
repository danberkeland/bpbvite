import React, { useState } from "react"

import { Card } from "primereact/card"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { InputNumber } from "primereact/inputnumber"

/**For display/control of individual cart item info*/
export const ItemsCard = ({orderItems, setOrderItems, setShowAddItem}) => {
  const [expandedRows, setExpandedRows] = useState(null)
  const [rollbackQty, setRollbackQty] = useState(null)

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
    return (
      <div>
        <p>{"Rate: " + rowData.rate}</p>
        <p>{"Subtotal: " + ( (rowData.rate * rowData._qty).toFixed(2) )}</p>
      </div>
    )
  }

  const tableFooterTemplate = () => {
    const total = orderItems.reduce( (acc, item) => {
        return (acc + (item.rate * item._qty)) 
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
          value={rowData._qty}
          min={0}
          onChange={e => {
            const _orderItems = orderItems.map(item => 
              item.prodNick === rowData.prodNick ? 
                {...item, _qty: e.value} : 
                item
            )
            setOrderItems(_orderItems)
          }}
          onKeyDown={e => {
            // console.log(e)
            if (e.key === "Enter") {
              e.target.blur()
            }
            if (e.key === "Escape") {
              const _orderItems = orderItems.map(item =>
                item.prodNick === rowData.prodNick ?
                  {...item, _qty: rollbackQty} :
                  item  
              )
              setOrderItems(_orderItems)
              e.target.blur()
            }
          }}
          onFocus={e => {
            setRollbackQty(parseInt(e.target.value))
            e.target.select()
          }}
          onBlur={e => {
            if (e.target.value === '') {
              const _orderItems = orderItems.map(item =>
                item.prodNick === rowData.prodNick ?
                  {...item, _qty: item.qty} :
                  item  
              )
              setOrderItems(_orderItems)
            }
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
        value={orderItems.filter(item => (item.action === 'CREATE' || item.qty > 0 || item._qty > 0))}
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
        <Column header="Product" field="prodName" />
        <Column header="Qty" 
          field="_qty"
          style={{width: "75px"}}
          body={qtyInputTemplate}
        />
      </DataTable>

    </Card>
  )
}

