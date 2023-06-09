
const pickupOptions = [
  { label: "Pick up Carlton", value: "atownpick"},
  { label: "Pick up SLO", value: "slopick"},
]

export const OrderForm = ({
  formMode, setFormMode,
  currentCustomer, setCurrentCustomer,
  currentOrder, setCurrentOrder,
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
        <div style={{fontSize: "1.5rem", marginBottom: "1rem"}}>
          Order for {currentCustomer.split('__')[0]}
        </div>

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
          />
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

  return (
    <Card 
      const
      header={cardHeader}
      footer={cardFooter}
    >
      {/* <div style={{width: "25rem"}}>
        <pre>{JSON.stringify(currentOrder, null, 2)}</pre>

      </div> */}
      <DataTable
        value={currentOrder?.items ?? []}
      >
        <Column header="Product"
          body={I => <span>
            {products?.[I.prodNick].prodName ?? I.prodNick}
          </span>} 
        />
        <Column header="Qty" 
          body={I => <span>{I.qty}</span>}
        />
      </DataTable>
    </Card>

  )

}