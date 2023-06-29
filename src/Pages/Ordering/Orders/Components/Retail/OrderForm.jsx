import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { ProductDropdown } from "./ProductDropdown"
import { useState } from "react"
import { InputLabel } from "../InputLabel"

const pickupOptions = [
  { label: "Carlton", value: "atownpick"},
  { label: "SLO", value: "slopick"},
]

export const OrderForm = ({
  formMode, setFormMode,
  currentCustomer, setCurrentCustomer,
  currentOrder, setCurrentOrder,
  products,
  selectedProduct, setSelectedProduct,
  delivDateDT
}) => {

  const actionText = formMode === 'create' ? "Creating"
    : formMode === 'edit' ? "Editing"
    : ''

  const cardHeader = () => {
    return (
      <div className="card-header"
        style={{
          padding: ".5rem 1rem",
        }}
      >
        <div style={{
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}>
          <span style={{fontSize: "1.5rem"}}>
            {actionText} Order
          </span>
          <Button 
            icon="pi pi-times"
            className="p-button-rounded p-button-outlined"
            onClick={() => {
              setFormMode('hide')
              setCurrentCustomer('')
              setCurrentOrder()
            }}
          />
        </div>

        <div style={{fontSize: "1.25rem", marginBottom: ".25rem"}}>
          Name: {currentOrder?.header.locNick.split('__')[0]}
        </div>
        <div style={{fontSize: ".9rem", marginBottom: "1rem"}}>
          Token: {currentOrder?.header.locNick.split('__')[1]}
        </div>

        
        
      </div>
    )
  }

  const cardFooter = () => {
    return (
      <div style={{display: "flex", justifyContent: "flex-end"}}>
        <Button label="Submit" />
      </div>
    )
  }

  const qtyColumnTemplate = (rowData) => {
    const maxQty = 999
    const product = products[rowData.prodNick]

    const updateQty = (newValue) => {
      let newState = structuredClone(currentOrder)

      const matchIdx = newState.items.findIndex(i => 
        i.prodNick === rowData.prodNick
      )
      newState.items[matchIdx].qty = newValue
      setCurrentOrder(newState)
    }

    return(
      <InputText 
        value={rowData.qty}
        inputMode="numeric"
        keyfilter={/[0-9]/}
        onClick={() => console.log(rowData)}
        onFocus={e => {
          e.target.select()
        }}
        tooltip={product?.packSize > 1 
          ? `= ${(rowData.qty || 0) * product.packSize} ea`
          : ''
        }
        tooltipOptions={{ 
          event: 'focus', 
          position: 'left', 
          autoZIndex: false, 
          baseZIndex: '75'
        }}
        onChange={e => {
          if (e.target.value === '') updateQty('')
          else updateQty(Math.min(maxQty, Number(e.target.value)))

        }}
        onBlur={e => updateQty(Number(e.target.value))}
        style={{width: "3rem"}}
      />
    )

  }

  return (
    <Card 
      header={cardHeader}
      footer={cardFooter}
      style={{padding: ".75rem"}}
    >
      <div style={{
        display: "flex", 
        justifyContent: "space-between", 
        gap: "2rem",
        marginBottom: "1rem",
      }}>

        <label style={{fontSize: ".9rem"}}>Pickup Location
          <Dropdown 
            placeholder="(required)" 
            options={pickupOptions}
            value={currentOrder?.header.route || ''}
            onChange={e => {
              let updatedOrder = structuredClone(currentOrder)
              updatedOrder.header.route = e.value
              setCurrentOrder(updatedOrder)
            }}
            style={{width: "10rem"}}
          />
        </label>

        <label style={{fontSize: ".9rem"}}>Note 
          <InputTextarea
            value={currentOrder?.header.ItemNote}
            onChange={e => {
              let updatedOrder = structuredClone(currentOrder)
              updatedOrder.header.ItemNote = e.target.value
              setCurrentOrder(updatedOrder)
            }}
            rows={1}
            autoResize
          />
        </label>


      </div>


      <DataTable
        value={currentOrder?.items ?? []}
        style={{width: "25.5rem"}}
      >
        <Column 
          header={() => {
            return (
              <div onClick={() => console.log(currentOrder)}>
                Product
              </div>
            )
          }}
          body={I => <span>
            {products?.[I.prodNick].prodName ?? I.prodNick}
          </span>} 
        />
        <Column header="Qty" 
          body={qtyColumnTemplate}
          style={{width: "90px"}}
        />
      </DataTable>
      
      <div style={{
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
      }}>
        <ProductDropdown 
          value={selectedProduct}
          onChange={e => {setSelectedProduct(e.value); console.log(e.value)}}
          style={{
            width: "100%",
            marginBlock: "1rem",
            
          }}
          
        />

        <Button label="Add" 
          onClick={() => {
            if (!selectedProduct) return

            const { prodNick, retailPrice, wholePrice } = selectedProduct
            const inCart = currentOrder.items.findIndex(item => 
              item.prodNick === prodNick
            ) > -1

            if (inCart) return

            let updatedValue = structuredClone(currentOrder)
            updatedValue.items.push({
              prodNick: prodNick,
              rate: retailPrice || wholePrice,
              qty: 0,
            })

            setCurrentOrder(updatedValue)
            setSelectedProduct(null)
          }}
        />
      </div>
    </Card>

  )

}