import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import { ListBox } from "primereact/listbox"
import { InputTextarea } from "primereact/inputtextarea"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { useRetailOrders } from "../data/orderHooks"
import { getWorkingDateTime } from "../../../../functions/dateAndTime"
import { useState } from "react"
import { DateTime } from "luxon"
import { InputLabel } from "./InputLabel"
import { useListData } from "../../../../data/_listData"
import { cloneDeep, sortBy } from "lodash"


const fulfillmentOptions = [
  { label: "Pick up SLO", value: "slopick"},
  { label: "Pick up Carlton", value: "atownpick"},
]

const formatName = (inputName) => {
  if (!inputName) return [[""],[""]]
  const splitName = inputName.split('__')

  const [name, token] = splitName[0] === 'retail'
    ? [splitName[1], ""]
    : [splitName[0], splitName[1]]

  return [name, token]
}


export const RetailOrders = () => {
  const todayDT = getWorkingDateTime('NOW')
  const [delivDateJS, setDelivDateJS] = useState(todayDT.toJSDate())
  const [selectedCustomer, setSelectedCustomer] = useState()
  const [createName, setCreateName] = useState()
  const [selectedProdNick, setSelectedProdNick] = useState()
  const [currentOrder, setCurrentOrder] = useState()
  const currentLocNick = currentOrder?.header.locNick ?? ''
  const [currentName, currentToken] = formatName(currentLocNick)

  const delivDateDT = 
    DateTime.fromJSDate(delivDateJS).setZone('America/Los_Angeles')
  const delivDateISO = delivDateDT.toISODate()

  const { data:PRD } = 
    useListData({ tableName: "Product", shouldFetch: true})
  const products = Object.fromEntries(PRD.map(P => [P.prodNick, P]))

  const { data:retail } = useRetailOrders({ shouldFetch: true })
  const { ordersByDateByName, orderDates, customerNames } = retail
  ?? { ordersByDateByName: [], orderDates: [], customerNames: [] }

  const ordersForDate = ordersByDateByName?.[delivDateISO] ?? {}
  const namesForDate = Object.keys(ordersForDate)

  const resetForm =() => {
    setSelectedCustomer()
    setCurrentOrder()
    setCreateName()
    setSelectedProdNick()
    setCurrentOrder()
  }

  const composeNewOrder = () => {
    const items = []
    const header = {
      locNick: formatName(createName)[0],
      route: null,
      ItemNote: '',
      delivDate: delivDateISO,
      isWhole: false,
    }

    return { header, items }

  }

  const composeEditOrder = (date, name) => {    
    const items = ordersByDateByName[date][name]
    const header = {
      locNick: items?.[0].locNick,
      route: items?.[0].route,
      ItemNote: items?.[0].ItemNote,
      delivDate: delivDateISO,
      isWhole: false,
    }

    return { 
      header, 
      items: items.map(i => ({...i, baseQty: i.qty})) 
    }

  }

  const dateTemplate = (date) => {
    const dateJS = new Date(date.year, date.month, date.day)
    const isCustomToday = dateJS.getTime() === todayDT.toMillis()

    const calendarDate = `${date.year}-` 
      + `${('0' + String(date.month + 1).slice(-2))}-`
      + `${('0' + String(date.day)).slice(-2)}`
    const hasCart = orderDates.includes(calendarDate)

    return (
      <div 
        id={isCustomToday && date.selectable
          ? "bpb-date-cell-custom-today"
          : hasCart && date.selectable
            ? "bpb-date-cell-cart"
            : "bpb-date-cell-none"
        }
      >
        {date.day}
      </div>
    )
  }



  const qtyColumnTemplate = (rowData) => {
    const maxQty = 999
    const product = products[rowData.prodNick]

    const updateQty = (newValue) => {
      let newState = cloneDeep(currentOrder)

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
    <div style={{
      display: "flex", 
      justifyContent: "space-between",
      gap: "1.5rem",
      maxWidth: "54rem",
      margin: "auto",
    }}>

      <div className="retail-col-1" style={{width: "25.5rem"}}>
        <div style={{marginBlock: "1rem"}}>
          <Calendar 
            inline
            value={delivDateJS}
            dateTemplate={dateTemplate}
            onChange={e => {
              setDelivDateJS(e.value)
              resetForm()
            }}
          />
        </div>

        <div style={{marginBlock: "1rem"}}>
        <InputLabel label={"Existing Orders for " + delivDateISO}>
          <ListBox 
            id="bpb-order-calendar"
            className="bpb-order-calendar"
            options={namesForDate}
            value={selectedCustomer}
            onChange={e => {
              setSelectedCustomer(e.value)
              setCreateName()
              const order = composeEditOrder(delivDateISO, e.value)
              setCurrentOrder(order)

            }}
            style={{width: "25rem"}}
          />
        </InputLabel>
        </div>

        <div style={{
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-end",
          gap: "1rem"
        }}>
          <InputLabel label="Create With New or Existing Name">
            <Dropdown 
              options={customerNames.filter(n => !namesForDate.includes(n))}
              value={createName}
              style={{
                // width: "25rem"
                flex: "1 1 25rem"
              }} 
              editable
              onChange={e => setCreateName(e.value)}
            />
          </InputLabel>

          <Button label="Create" 
            disabled={!createName}
            onClick={() => {
              const newOrder = composeNewOrder()
              setCurrentOrder(newOrder)
            }}
          />
        </div>


        {/* <pre>{JSON.stringify(createName, null, 2)}</pre> */}
        {/* <pre>{JSON.stringify(currentOrder, null, 2)}</pre> */}

      </div>

      <div className="retail-col-2" style={{width: "25.5rem"}}>

        {currentOrder &&
          <div style={{
            background: "var(--bpb-surface-content-header)",
            padding: ".75rem",
            borderRadius: "3px",
            marginBlock: "1rem",
          }}>
            <div style={{fontSize: "1.5rem"}}>Order for {currentName}</div>
            <div style={{marginTop: ".5rem"}}>Token: {currentToken}</div>
          </div>
        }
        <div style={{marginBlock: ".5rem"}}>
          <InputLabel label="Fulfillment Option">
            <Dropdown 
              value={currentOrder?.header.route}
              options={fulfillmentOptions}
              placeholder={currentOrder ? "(Required)" : ""}
              disabled={!currentOrder}
              onChange={e => {
                const newValue = { 
                  header: { ...currentOrder.header, route: e.value },
                  items: [...currentOrder.items]
                }
                setCurrentOrder(newValue)
              }}
              style={{width: "17rem"}}
            />
          </InputLabel>
        </div>

        <div style={{marginBlock: "1rem"}}>
          <InputLabel label="Note">
            <InputTextarea 
              value={currentOrder?.header.ItemNote}
              onChange={e => {
                const newValue = { 
                  header: { ...currentOrder.header, ItemNote: e.target.value },
                  items: [...currentOrder.items]
                }
                setCurrentOrder(newValue)
              }}
              placeholder ="(Optional)" 
              style={{width: "17rem"}}
              disabled={!currentOrder}
            />
          </InputLabel>
        </div>
        
        <DataTable
          value={currentOrder?.items ?? []}
          responsiveLayout="scroll"
          style={{width: "25rem", marginBlock: "1rem"}}
        >
          <Column header="Product" 
            body={rowData => products[rowData.prodNick].prodName}
          />
          <Column header = "Qty" 
            body={qtyColumnTemplate}
          />
        </DataTable>


        <div style={{marginBlock: "1rem"}}>
          <InputLabel label="Products">
            <Dropdown 
              options={sortBy(PRD, 'prodName')}
              optionLabel="prodName"
              optionValue="prodNick"
              filter
              filterBy="prodNick,prodName"
              value={selectedProdNick}
              onChange={e => setSelectedProdNick(e.value)}
              style={{width: "100%"}}
              disabled={!currentOrder}
            />
          </InputLabel>
        </div>

        <div>
          <Button label="Add" 
            disabled={!currentOrder}
            
            onClick={() => {
              const cartMatchItem = currentOrder.items.find(i =>
                i.prodNick === selectedProdNick  
              )
              if (selectedProdNick && !cartMatchItem) {
                const newItem = {
                  prodNick: selectedProdNick,
                  rate: products[selectedProdNick].wholePrice,
                  qty: 0
                }

                const newValue = {
                  header: {...currentOrder.header},
                  items: [...currentOrder.items].concat([newItem])
                }
                setCurrentOrder(newValue)
              }

            }}
            style={{marginBlock: "1rem"}}
          />
        </div>

        <div>
          <Button label="Submit" 
            onClick={() => {
              const submitItems = currentOrder.items.map(item => {
                
                let submitItem = {
                  ...currentOrder.header,
                  qty: item.qty,
                  updatedBy: "bpb_admin",
                }

                if (!!item.id) submitItem.id = item.id

                return submitItem
              })

              const createItems = submitItems.filter(i => !i.id && i.qty !== 0)
              const updateItems = submitItems.filter(i => !!i.id)

              console.log({ createItems, updateItems })
            }}
            disabled={!currentOrder || !currentOrder?.header?.route}
          
          />

        </div>

      </div>


    </div>

  )

}


