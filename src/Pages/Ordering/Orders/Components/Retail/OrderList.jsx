import { ListBox } from "primereact/listbox"
import { InputLabel } from "../InputLabel"
import { useState } from "react"
import { Button } from "primereact/button"
import { useRetailOrders } from "../../data/orderHooks"


export const OrderList = ({
  delivDateISO,
  currentCustomer, setCurrentCustomer,
  currentOrder, setCurrentOrder,
  formMode, setFormMode,
  setOrderName,
}) => {
  const { data:retail } = useRetailOrders({ shouldFetch: true })
  const { ordersByDateByName = [] } = retail ?? {}

  const orderItemsForDate = ordersByDateByName?.[delivDateISO] ?? {}
  const namesForDate = Object.keys(orderItemsForDate)

  const orderOptions = namesForDate.map(name => 
    ({ label: name.split('__')[0], value: name })
  )

  const handleChange = e => {
    setCurrentCustomer(e.value || '')
    if (!!e.value) {
      setCurrentOrder(createEditOrder(orderItemsForDate[e.value]))
      setOrderName('')
      setFormMode('edit')
    } else {
      setCurrentOrder(null)
      setOrderName('')
    }
    
  }

  return (
    <div style={{marginBlock: "1rem"}}>
      <InputLabel label={"Existing Orders for " + delivDateISO}>
        <ListBox 
          id="bpb-order-calendar"
          className="bpb-order-calendar"
          options={orderOptions}
          value={currentCustomer}
          onChange={handleChange}
          style={{width: "25rem"}}
          disabled={formMode === 'edit' || formMode === 'create'}
        />
      </InputLabel>
      
      {/* <Button label="Edit" 
        disabled={!currentCustomer || formMode !== 'hide'}
        onClick={e => setFormMode('edit')}
      /> */}

      {/* <pre>{JSON.stringify(currentOrder, null, 2)}</pre> */}
    </div>


  )
}

const createEditOrder = (orderItems) => {
  if (!orderItems.length) return { header: {}, items: [] }

  const { locNick, delivDate, isWhole, route, ItemNote } = orderItems[0] ?? {}
  const header = { locNick, delivDate, isWhole, route, ItemNote }

  const items = orderItems.map(item => ({
    id: item.id,
    prodNick: item.prodNick,
    qty: item.qty,
    rate: item.rate,
  }))

  return({ header, items })

}