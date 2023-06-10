import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"

const pickupOptions = [
  { label: "Pick up Carlton", value: "atownpick"},
  { label: "Pick up SLO", value: "slopick"},
]

export const OrderForm = ({
  formMode, setFormMode,
  currentCustomer, setCurrentCustomer,
  currentOrder, setCurrentOrder,
  products,
}) => {

  const cardHeader = () => {
    return (
      <div className="card-header"
        style={{
          padding: ".75rem",
        }}
      >
        <div style={{display: "flex", justifyContent: "flex-end"}}>
          <Button 
            icon="pi pi-times"
            className="p-button-rounded p-button-text"
            onClick={() => {
              setFormMode('hide')
              setCurrentCustomer('')
              setCurrentOrder()
            }}
          />
        </div>
        <div style={{fontSize: "1.5rem", marginBottom: ".25rem"}}>
          Name: {currentCustomer.split('__')[0]}
        </div>
        <div style={{fontSize: ".9rem", marginBottom: "1rem"}}>
          Token: {currentCustomer.split('__')[1]}
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
        disabled={formMode === 'read'}
      />
    )

  }

  return (
    <Card 
      header={cardHeader}
      footer={cardFooter}
    >
      <Dropdown 
        placeholder="Pick up location (required)" 
        options={pickupOptions}
        value={currentOrder?.header.route || ''}
        onChange={e => {
          let updatedOrder = structuredClone(currentOrder)
          updatedOrder.header.route = e.value
          setCurrentOrder(updatedOrder)
        }}
        style={{marginBottom: "1rem"}}
        disabled={formMode === 'read'}
      />

      <div style={{marginBottom: "1rem"}}>
        <InputTextarea 
          value={currentOrder?.header.ItemNote}
          onChange={e => {
            let updatedOrder = structuredClone(currentOrder)
            updatedOrder.header.ItemNote = e.target.value
            setCurrentOrder(updatedOrder)
          }}
          rows={1}
          disabled={formMode === 'read'}
        />
      </div>

      <DataTable
        value={currentOrder?.items ?? []}
      >
        <Column header="Product"
          body={I => <span>
            {products?.[I.prodNick].prodName ?? I.prodNick}
          </span>} 
        />
        <Column header="Qty" 
          body={qtyColumnTemplate}
          style={{width: "90px"}}
        />
      </DataTable>
    </Card>

  )

}