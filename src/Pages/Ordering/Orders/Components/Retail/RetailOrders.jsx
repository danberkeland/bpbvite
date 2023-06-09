import { Button } from "primereact/button"
// import { Calendar } from "primereact/calendar"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
// import { ListBox } from "primereact/listbox"
import { InputTextarea } from "primereact/inputtextarea"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { useRetailOrders } from "../../data/orderHooks"
// import { getWorkingDateTime } from "../../../../../functions/dateAndTime"
import { useState } from "react"
import { DateTime, Interval } from "luxon"
// import { InputLabel } from "../InputLabel"
import { useListData } from "../../../../../data/_listData"
import { cloneDeep, sortBy } from "lodash"
import { RetailCalendar } from "./RetailCalendar"
import { OrderList } from "./OrderList"
import { CreateMenu } from "./CreateMenu"
import { Card } from "primereact/card"


// const fulfillmentOptions = [
//   { label: "Pick up SLO", value: "slopick"},
//   { label: "Pick up Carlton", value: "atownpick"},
// ]

// const formatName = (inputName) => {
//   if (!inputName) return [[""],[""]]
//   const splitName = inputName.split('__')

//   const [name, token] = splitName[0] === 'retail'
//     ? [splitName[1], ""]
//     : [splitName[0], splitName[1]]

//   return [name, token]
// }


// export const RetailOrders = () => {
//   const nowDT = DateTime.now().setZone('America/Los_Angeles')
//   const todayDT = nowDT.startOf('day')
//   const [delivDateJS, setDelivDateJS] = useState(todayDT.toJSDate())
//   const delivDateDT = 
//     DateTime.fromJSDate(delivDateJS).setZone('America/Los_Angeles')
//   const delivDateISO = delivDateDT.toISODate()
//   const relativeDate = 
//     Interval.fromDateTimes(todayDT, delivDateDT).length('days')
//     || (-1 * Interval.fromDateTimes(delivDateDT, todayDT).length('days'))

//   const dateProps = 
//     { todayDT, delivDateJS, delivDateDT, delivDateISO, relativeDate }

//   const [formMode, setFormMode] = useState("hide") // 'hide'|'read'|'update'|'create'

//   const { data:PRD } = 
//     useListData({ tableName: "Product", shouldFetch: true})
//   const products = Object.fromEntries(PRD.map(P => [P.prodNick, P]))

//   const { data:retail } = useRetailOrders({ shouldFetch: true })

//   const { ordersByDateByName, orderDates, customerNames } = retail
//     ?? { ordersByDateByName: [], orderDates: [], customerNames: [] }

//   const ordersForDate = ordersByDateByName?.[delivDateISO] ?? {}

//   const orderOptionsForDate = Object.values(ordersForDate)

//   const [currentOrder, setCurrentOrder] = useState()
//   const [selectedCustomer, setSelectedCustomer] = useState()
//   const [createName, setCreateName] = useState()
//   const [selectedProdNick, setSelectedProdNick] = useState()
//   const currentLocNick = currentOrder?.header.locNick ?? ''
//   const [currentName, currentToken] = formatName(currentLocNick)

//   // const resetForm =() => {
//   //   setSelectedCustomer()
//   //   setCurrentOrder()
//   //   setCreateName()
//   //   setSelectedProdNick()
//   //   setCurrentOrder({ header: {
//   //     locNick: "",
//   //     route: null,
//   //     ItemNote: '',
//   //     delivDate: "",
//   //     isWhole: false,
//   //   }})
//   // }

//   const handleDateChange = (e) => {
//     setDelivDateJS(e.value)
//     //resetForm()
//   }



//   // const qtyColumnTemplate = (rowData) => {
//   //   const maxQty = 999
//   //   const product = products[rowData.prodNick]

//   //   const updateQty = (newValue) => {
//   //     let newState = cloneDeep(currentOrder)

//   //     const matchIdx = newState.items.findIndex(i => 
//   //       i.prodNick === rowData.prodNick
//   //     )
//   //     newState.items[matchIdx].qty = newValue
//   //     setCurrentOrder(newState)
//   //   }

//   //   return(
//   //     <InputText 
//   //       value={rowData.qty}
//   //       inputMode="numeric"
//   //       keyfilter={/[0-9]/}
//   //       onClick={() => console.log(rowData)}
//   //       onFocus={e => {
//   //         e.target.select()
//   //       }}
//   //       tooltip={product?.packSize > 1 
//   //         ? `= ${(rowData.qty || 0) * product.packSize} ea`
//   //         : ''
//   //       }
//   //       tooltipOptions={{ 
//   //         event: 'focus', 
//   //         position: 'left', 
//   //         autoZIndex: false, 
//   //         baseZIndex: '75'
//   //       }}
//   //       onChange={e => {
//   //         if (e.target.value === '') updateQty('')
//   //         else updateQty(Math.min(maxQty, Number(e.target.value)))

//   //       }}
//   //       onBlur={e => updateQty(Number(e.target.value))}
//   //       style={{width: "3rem"}}
//   //     />
//   //   )

//   // }

//   return (
//     <div style={{
//       display: "flex", 
//       justifyContent: "space-between",
//       gap: "1.5rem",
//       maxWidth: "54rem",
//       margin: "auto",
//     }}>

//       <div className="retail-col-1" style={{width: "25.5rem"}}>
//         <div style={{marginBlock: "1rem"}}>
//           <RetailCalendar 
//             todayDT={todayDT}
//             delivDateJS={delivDateJS}
//             orderDates={orderDates}
//             handleDateChange={handleDateChange}
//           />
//         </div>

//         <CreateMenu 
//           // orderOptionsForDate={orderOptionsForDate}
//         />

//         <div style={{marginBlock: "1rem"}}>
//           <OrderList 
//             {...dateProps} 
//             selectedCustomer={selectedCustomer}
//             setSelectedCustomer={setSelectedCustomer}
//           />
//         </div>
        
//         <pre>{JSON.stringify(orderOptionsForDate, null, 2)}</pre>
//         <pre>{JSON.stringify(ordersForDate, null, 2)}</pre>
//       </div>

//       {/* <div className="retail-col-2" style={{width: "25.5rem"}}>

//         <div style={{
//           background: "var(--bpb-surface-content-header)",
//           padding: ".75rem",
//           borderRadius: "3px",
//           marginBlock: "1rem",
//         }}>
//           <div style={{fontSize: "1.5rem", fontWeight: "bold"}}>
//             For {delivDateDT.toFormat('EEEE, MMM d')} (T +{relativeDate})
//           </div>
//           <div style={{marginTop: ".5rem"}}>Customer: {currentName}</div>
//           <div >Token: {currentToken}</div>
//         </div>
  
//         <div style={{marginBlock: ".5rem"}}>
//           <InputLabel label="Pickup Location">
//             <Dropdown 
//               value={currentOrder?.header.route}
//               options={fulfillmentOptions}
//               placeholder={currentOrder ? "(Required)" : ""}
//               disabled={!currentOrder}
//               onChange={e => {
//                 const newValue = { 
//                   header: { ...currentOrder.header, route: e.value },
//                   items: [...currentOrder.items]
//                 }
//                 setCurrentOrder(newValue)
//               }}
//               style={{width: "17rem"}}
//             />
//           </InputLabel>
//         </div>

//         <div style={{marginBlock: "1rem"}}>
//           <InputLabel label="Note">
//             <InputTextarea 
//               value={currentOrder?.header.ItemNote}
//               onChange={e => {
//                 const newValue = { 
//                   header: { ...currentOrder.header, ItemNote: e.target.value },
//                   items: [...currentOrder.items]
//                 }
//                 setCurrentOrder(newValue)
//               }}
//               placeholder ="(Optional)" 
//               style={{width: "17rem"}}
//               disabled={!currentOrder}
//             />
//           </InputLabel>
//         </div>
        
//         <DataTable
//           value={currentOrder?.items ?? []}
//           responsiveLayout="scroll"
//           style={{width: "25rem", marginBlock: "1rem"}}
//         >
//           <Column header="Product" 
//             body={rowData => products[rowData.prodNick].prodName}
//           />
//           <Column header = "Qty" 
//             body={qtyColumnTemplate}
//           />
//         </DataTable>


//         <div style={{marginBlock: "1rem"}}>
//           <InputLabel label="Products">
//             <Dropdown 
//               options={sortBy(PRD, 'prodName')}
//               optionLabel="prodName"
//               optionValue="prodNick"
//               filter
//               filterBy="prodNick,prodName"
//               value={selectedProdNick}
//               onChange={e => setSelectedProdNick(e.value)}
//               style={{width: "100%"}}
//               disabled={!currentOrder}
//             />
//           </InputLabel>
//         </div>

//         <div>
//           <Button label="Add" 
//             disabled={!currentOrder}
            
//             onClick={() => {
//               const cartMatchItem = currentOrder.items.find(i =>
//                 i.prodNick === selectedProdNick  
//               )
//               if (selectedProdNick && !cartMatchItem) {
//                 const newItem = {
//                   prodNick: selectedProdNick,
//                   rate: products[selectedProdNick].wholePrice,
//                   qty: 0
//                 }

//                 const newValue = {
//                   header: {...currentOrder.header},
//                   items: [...currentOrder.items].concat([newItem])
//                 }
//                 setCurrentOrder(newValue)
//               }

//             }}
//             style={{marginBlock: "1rem"}}
//           />
//         </div>

//         <div>
//           <Button label="Submit" 
//             onClick={() => {
//               const submitItems = currentOrder.items.map(item => {
                
//                 let submitItem = {
//                   ...currentOrder.header,
//                   qty: item.qty,
//                   rate: item.rate,
//                   updatedBy: "bpb_admin",
//                 }

//                 if (!!item.id) submitItem.id = item.id

//                 return submitItem
//               })

//               const createInputs = submitItems.filter(i => !i.id && i.qty !== 0)
//               const updateInputs = submitItems.filter(i => !!i.id)

//               console.log({ createInputs, updateInputs })
//             }}
//             disabled={!currentOrder || !currentOrder?.header?.route}
          
//           />

//         </div>

//       </div> */}


//     </div>

//   )

// }


export const RetailOrders = () => {
  const { data:PRD } = 
    useListData({ tableName: "Product", shouldFetch: true})
  const products = Object.fromEntries(PRD.map(P => [P.prodNick, P])) 

  const nowDT = DateTime.now().setZone('America/Los_Angeles')
  const todayDT = nowDT.startOf('day')
  const [delivDateJS, setDelivDateJS] = useState(todayDT.toJSDate())
  const delivDateDT = 
    DateTime.fromJSDate(delivDateJS).setZone('America/Los_Angeles')
  const delivDateISO = delivDateDT.toISODate()
  const relativeDelivDate = 
    Interval.fromDateTimes(todayDT, delivDateDT).length('days')
    || (-1 * Interval.fromDateTimes(delivDateDT, todayDT).length('days'))

  const dateProps = { 
      todayDT, delivDateJS, setDelivDateJS, 
      delivDateDT, delivDateISO, relativeDelivDate 
    }

  const handleDateChange = (e) => {
    setDelivDateJS(e.value)
    setCurrentOrder()
  }

  const [currentCustomer, setCurrentCustomer] = useState('')
  const [currentOrder, setCurrentOrder] = useState()
  //const [selectedCustomer, setSelectedCustomer] = useState()
  const [formMode, setFormMode] = useState('hide') // 'hide'|'read'|'edit'|'create'

 

  return (<>
    <div className="retail-body-container"
      style={{
        width: "56rem",
        display: "flex",
        justifyContent: "space-between",
        gap: "1.5rem"
      }}
    >
      <div className="retail-column-1">
        <RetailCalendar 
          { ...dateProps } 
          handleDateChange={handleDateChange}  
          calendarStyle={{marginBottom: "1rem"}}
        />

        <CreateMenu />

        <OrderList 
          { ...dateProps }
          // selectedCustomer={selectedCustomer}
          // setSelectedCustomer={setSelectedCustomer}
          currentCustomer={currentCustomer}
          setCurrentCustomer={setCurrentCustomer}
          setCurrentOrder={setCurrentOrder}
          formMode={formMode}
          setFormMode={setFormMode}
        />
      </div>

      <pre>{JSON.stringify(formMode, null, 2)}</pre>
      {/* <pre>{JSON.stringify(currentCustomer, null, 2)}</pre> */}
      <pre>{JSON.stringify(currentOrder, null, 2)}</pre>

      <div classname="retail-column-2">
      
      </div>

    </div>



  </>)

}



