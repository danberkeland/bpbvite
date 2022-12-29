<<<<<<< HEAD:src/Pages/Ordering/OrderComponents/OrderDisplay.jsx
import React, { useEffect } from "react"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputNumber } from "primereact/inputnumber"
import { RadioButton } from "primereact/radiobutton"
import { InputTextarea } from "primereact/inputtextarea"
import { useState } from "react"
// import { packGroups } from "../DataFetching/mockdata"

export const OrderDisplay = ({data, disableAddItem, setShowAddItem}) => {
  const {orderHeader, setOrderHeader, orderData, setOrderData} = data
  const [expandedRows, setExpandedRows] = useState(null)
  const [rollbackQty, setRollbackQty] = useState(null)

  useEffect(()=> {
    console.log('orderData', orderData)
  },[orderData])

  const rowExpansionTemplate = (rowData) => {
    return (
      <div>
        <p>{"Rate: " + rowData.rate}</p>
        <p>{"Subtotal: " + rowData.total}</p>
      </div>
    )
  }
=======
import React, { useState } from "react"
import { Button } from "primereact/button"

import { OptionsCard } from "./OrderDisplayComponents/OptionsCard"
import { ItemsCard } from "./OrderDisplayComponents/ItemsCard"
import { AddItemSidebar } from "./AddItemSidebar"
import { useEffect } from "react"
import { makeOrderHeader, makeOrderItems, makeOrderObject, validateCart } from "../Data/dataTransformations"
import { useLocationDetails } from "../Data/locationData"
import { useOrdersByLocationByDate, useStandingByLocation } from "../Data/orderData"
import { dateToMmddyyyy } from "../Functions/dateAndTime"

import { gqlFetcher } from "../Data/fetchers"
import { createOrder, updateOrder } from "../Data/gqlQueries"
import { mutate } from "swr"

export const OrderDisplay = ({ location, delivDate, userName }) => {
  const [showAddItem, setShowAddItem] = useState(false)
  const sidebarProps = {showAddItem, setShowAddItem}
>>>>>>> 67a71ae7464f9d93ea5d0cffb46e3d1b492dd70c:src/Pages/Ordering/Components/OrderDisplay.jsx

  const [orderHeader, setOrderHeader] = useState()
  const [orderHeaderChanges, setOrderHeaderChanges] = useState()

  const [orderItems, setOrderItems] = useState()
  const [orderItemChanges, setOrderItemChanges] = useState()

  const [revalidating, setRevalidating] = useState(false)

  const orderHeaderState = { orderHeader, orderHeaderChanges, setOrderHeaderChanges }
  const orderItemsState = { orderItems, orderItemChanges, setOrderItemChanges }

  // const { locationDetails, standingData, cartData } = useOrderData
  const { data:locationDetails, prodsNotAllowed, altPrices } = useLocationDetails(location)
  const { data:standingData } = useStandingByLocation(location, delivDate)
  const { data:cartData, mutate:mutateCart } = useOrdersByLocationByDate(location, delivDate)

  //const OrderItemList = makeOrderObject(locationDetails, cartData, standingData, delivDate)

  useEffect(() => {
    console.log("(L,S,C):", locationDetails?1:0, standingData?1:0, cartData?1:0)
    if (!!locationDetails && !!standingData && !!cartData) {
      const _header = makeOrderHeader(locationDetails, cartData, standingData, delivDate)
      const _items = makeOrderItems(locationDetails, cartData, standingData, delivDate)
      const _itemsObj = Object.fromEntries(_items.map(item => [item.prodNick, item]))
      setOrderHeader(_header)
      setOrderItems(_itemsObj) // keyed on prodNick for easy reference
      setOrderHeaderChanges(_header)
      setOrderItemChanges(_items)
      console.log("changed items:", _itemsObj)

      validateCart(cartData, mutateCart)
      setRevalidating(false)
    }
  }, [locationDetails, standingData, cartData, delivDate])

  const handleSubmit = async () => {
    // combine header data with items
    // combination & submission logic will be designed 
    // to focus on one item at a time.
    
    // We build the submission item, then decide what, if anything,
    // to do with it.
    // For now we will build uniform submission items without
    // worrying about submitting non-changes over the wire.
    console.log("Submitting...")
    for (let ordItm of orderItemChanges) {
      // build submit item
      let subItem = {
        isWhole: true,
        delivDate: dateToMmddyyyy(delivDate), // should start converting to ISO
        route: orderHeaderChanges.route,
        ItemNote: orderHeaderChanges.ItemNote,
        locNick: location,
        prodNick: ordItm.prodNick,
        qty: ordItm.qty,
        rate: ordItm.rate,
        isLate: 0,
        updatedBy: userName,
      }
      // can conditionally add other attributes in the future
      if (!!ordItm.id && ordItm.type === "C") subItem.id = ordItm.id

      // Decide Action
      let action = "NONE"
      if (subItem.hasOwnProperty("id")) {
        // check changes for route, ItemNote, qty, rate
        if (orderHeader.route !== orderHeaderChanges.route) action = "UPDATE"
        if (orderHeader.ItemNote !== orderHeaderChanges.ItemNote) action = "UPDATE"
        if (ordItm.rate !== orderItems[ordItm.prodNick]?.rate) action = "UPDATE"
        if (ordItm.qty !== orderItems[ordItm.prodNick]?.qty) action = "UPDATE"
      } else {
        if (ordItm.qty > 0) action = "CREATE"
        if (orderHeader.route !== orderHeaderChanges.route) action = "CREATE" // convert all items to cart when header values change
        if (orderHeader.ItemNote !== orderHeaderChanges.ItemNote) action = "CREATE" // ditto here
      }

      // make API calls and revalidate cartData cache after.
      // less dynamic/efficient, but simple.  Can be enhanced later.
      // because of the final revalidation, response items serve no function.
      console.log(action+": ", JSON.stringify(subItem, null, 2))

      let response
      if (action === "CREATE") {
        response = await gqlFetcher(createOrder, {input: subItem})
        response = response.data.createOrder
        console.log(response)

      }
      if (action === "UPDATE") {
        response = await gqlFetcher(updateOrder, {input: subItem})
        response = response.data.updateOrder
        console.log(response)

      }

      mutateCart()
      
    }

  }


  return (
    <div>
      {/* <pre>{"HEADER: " + JSON.stringify(orderHeader, null, 2)}</pre> */}
      {/* <pre>{"ITEMS: " + JSON.stringify(orderItems, null, 2)}</pre> */}
      {/* <pre>{"ITEM CHANGES: " + JSON.stringify(orderItemChanges, null, 2)}</pre> */}

      <OptionsCard
        orderHeaderState={orderHeaderState}
      />

      {orderItems &&
      <ItemsCard
        orderItemsState={orderItemsState}
        setShowAddItem={setShowAddItem}
      />
      }

      <Button label="Submit" 
        disabled={!orderItemChanges || orderItemChanges?.length === 0 || revalidating} // disable when no changes detected
        onClick={() => {
          setRevalidating(true)
          handleSubmit()
          
        }}
      />

      <AddItemSidebar 
        orderItemsState={orderItemsState}
        location={location}
        delivDate={delivDate}
        sidebarProps={sidebarProps}
      />

    </div>
  )

}




// DEPRECIATED: for temporary reference only. to be deleted after rewrite

// export const OrderDisplay2 = ({data, disableAddItem, setShowAddItem}) => {
//   const {orderDisplayData, setOrderDisplayData} = data
//   const { header:orderHeader, items:orderData} = orderDisplayData
//   const [expandedRows, setExpandedRows] = useState(null)
//   const [rollbackQty, setRollbackQty] = useState(null)

//   const rowExpansionTemplate = (rowData) => {
//     return (
//       <div>
//         <p>{"Rate: " + rowData.rate}</p>
//         <p>{"Subtotal: " + rowData.total}</p>
//       </div>
//     )
//   }

//   return (
//     <div>
//       <Card 
//         style={{marginTop: "10px"}}
//         title="Options"
//       >
//         <div style={{marginBottom: "30px"}}>
//           {orderHeader.defaultRoute !== 'slopick' && orderHeader.defaultRoute !== 'atownpick' &&
//           <div style={{margin: "5px"}}>
//             <RadioButton inputId="deliv" value="deliv" 
//               checked={orderHeader.newRoute === 'deliv'}
//               onChange={e => setOrderDisplayData({
//                 header: {...orderHeader, _route: e.value},
//                 items: [...orderData]
//               })}
//             />
//             <label 
//               htmlFor="deliv"
//               style={{fontWeight: orderHeader.newRoute === orderHeader.route ? "normal" : (orderHeader.newRoute === 'deliv' ? "bold" : "normal")}}
//             >
//               {orderHeader.defaultRoute === 'deliv' ? 'Delivery (default)' : 'Delivery'}
//             </label>
//           </div>
//           }
//           <div style={{margin: "5px"}}>
//             <RadioButton inputId="slopick" value="slopick" 
//               onChange={e => setOrderDisplayData({
//                 header: {...orderHeader, _route: e.value},
//                 items: [...orderData]
//               })}
//               checked={orderHeader._route === 'slopick'}
//             />
//             <label 
//               htmlFor="slopick"
//               style={{fontWeight: orderHeader._route === orderHeader.route ? "normal" : (orderHeader.newRoute === 'slopick' ? "bold" : "normal")}}
//             >
//               {orderHeader.defaultRoute === 'slopick' ? 'Pick Up SLO (defualt)' : "Pick Up SLO"}
//             </label>
//           </div>
//           <div style={{margin: "5px"}}>
//             <RadioButton inputId="atownpick" value="atownpick" 
//               onChange={e => setOrderDisplayData({
//                 header: {...orderHeader, _route: e.value},
//                 items: [...orderData]
//               })}
//               checked={orderHeader._route === 'atownpick'}
//             />
//             <label 
//               htmlFor="atownpick"
//               style={{fontWeight: orderHeader.newRoute === orderHeader.route ? "normal" : (orderHeader.newRoute === 'atownpick' ? "bold" : "normal")}}
//             >
//               {orderHeader.defaultRoute === 'atownpick' ? "Pick Up Carlton (defualt)" : "Pick Up Carlton"}
//             </label>
//           </div>
//         </div>

//         <span className="p-float-label">
//           <InputTextarea
//             id="input-note"
//             style={{width: "100%"}}
//             onChange={e => setOrderDisplayData({
//               header: {...orderHeader, _ItemNote: e.value},
//               items: [...orderData]
//             })}
//           />
//           <label htmlFor="input-note"
//             style={{fontWeight: orderHeader.newItemNote !== orderHeader.ItemNote ? "bold" : "normal"}}
//           >
//             {"Add a Note" + (orderHeader.newItemNote !== orderHeader.ItemNote ? "*" : '')}
//           </label>
//         </span>
//         {/* <pre>{JSON.stringify(orderHeader, null, 2)}</pre> */}
//       </Card>

//       <Card 
//         style={{marginTop: "10px"}}
//         title={() => {
//           return (
//             <div style={{display: "flex", }}>
//               <div style={{flex: "65%"}}>
//                 Items
//               </div>
//               <div style={{flex: "35%"}}>
//                 <Button label="+ Add Item" 
//                   disabled={disableAddItem}
//                   onClick={() => setShowAddItem(true)}
//                 />
//               </div>
//             </div>
//           )
//         }}
//       >
//         <DataTable
//           value={orderData.filter(item => (!item.orderID || item.originalQty > 0 || item.newQty > 0))}
//           style={{width: "100%"}}
//           responsiveLayout="scroll"
//           rowExpansionTemplate={rowExpansionTemplate}
//           expandedRows={expandedRows} 
//           onRowExpand={e => console.log("Data for " + e.data.prodNick, JSON.stringify(e.data, null, 2))}
//           onRowToggle={(e) => setExpandedRows(e.data)}
//           dataKey="prodNick"
//           footer={() => {return(<div>{"Total: " + orderData.reduce( (acc, item) => { return (acc + (item.rate * item.newQty)) }, 0).toFixed(2)}</div>)}}
//         >
//           <Column expander={true} style={{ width: '3em' }} />
//           <Column header="Product" 
//             field="prodName" 
//             body={rowData => {
//               const changeDetected = rowData.newQty !== rowData.originalQty
//               if (rowData.newQty === 0) return (
//                 <div
//                   style={{color: "gray"}}
//                 >
//                   <strike>{rowData.prodName}</strike>
//                 </div>
//               )
//               if (changeDetected) return (
//                 <b>{rowData.prodName + "*"}</b>
//               )
//               return rowData.prodName
//             }}
//           />
//           <Column header="Quantity" 
//             field="newQty" 
//             style={{width: "75px"}}
//             body={rowData => {
//               return(
//                 <div className="p-fluid">
//                   <InputNumber 
//                     disabled={disableAddItem} // means ordering date >= deliv date; order list should be read-only
//                     value={rowData.newQty}
//                     min={0}
//                     onChange={e => {
//                       const _orderData = orderData.map(item => 
//                         item.prodNick === rowData.prodNick ? 
//                           {...item, newQty: e.value} : 
//                           item
//                       )
//                       //setOrderData(_orderData)
//                     }}
//                     onKeyDown={e => {
//                       // console.log(e)
//                       if (e.key === "Enter") {
//                         e.target.blur()
//                       }
//                       if (e.key === "Escape") {
//                         const _orderData = orderData.map(item =>
//                           item.prodNick === rowData.prodNick ?
//                             {...item, newQty: rollbackQty} :
//                             item  
//                         )
//                         //setOrderData(_orderData)
//                         e.target.blur()
//                       }
//                     }}
//                     onFocus={e => {
//                       setRollbackQty(parseInt(e.target.value))
//                       e.target.select()
//                     }}
//                     onBlur={e => {
//                       if (e.target.value === '') {
//                         const _orderData = orderData.map(item =>
//                           item.prodNick === rowData.prodNick ?
//                             {...item, newQty: item.originalQty} :
//                             item  
//                         )
//                         //setOrderData(_orderData)
//                       }
//                     }}
//                   />
//                 </div>
//               )
//             }}
//           />
//         </DataTable>
//       </Card>

//       {/* <DataTable
//         value={packGroups.data.listProductBackups.items}
//         style={{width: "100%"}}
//         responsiveLayout="scroll"
//       >
//         <Column header="name" field="nickName"></Column>
//         <Column header="packGroup" field="packGroup"></Column>
//       </DataTable> */}
//     </div>
//   )

// }

// // export const OrderDisplay = ({ location, date, debug }) => {
// //   const { orderDisplay, orderDisplayErrors } = useOrderDisplay(location, date)
// //   const [route, setRoute] = useState()
// //   const [note, setNote] = useState()
// //   const optionsState = {route, setRoute, note, setNote}

// //   const [isEditing, setIsEditing] = useState(false);

// //   if (orderDisplayErrors) return(
// //     <pre>"Error displaying order: " + JSON.stringify(orderDisplayErrors, null, 2)</pre>
// //   )
// //   if (!orderDisplay) return(
// //     <pre>Loading...</pre>
// //   )
// //   return (

// //     <div>
// //       <OrderDisplayTableFC
// //         orderDisplayData={orderDisplay}
// //         debug={debug}
// //       />
// //       <OrderOptions optionsState={optionsState} debug={debug} />
// //       <Button 
// //         style={{width: "90%", margin: "10px"}} 
// //         label="Submit"
// //         onClick={() => {
// //           // 
// //         }}
// //       />



// //     </div>
// //   )
// // }

// /*********
//  * PARTS *
//  *********/

// // function OrderOptions({optionsState, debug}) {
// //   const {route, setRoute, note, setNote} = optionsState

// //   return(
// //     <Card
// //       title="Options"
// //       style={{margin: "10px"}}
// //     >
      
// //       <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gridTemplateRows:"1fr 2fr"}}>
// //         <div className="field-radiobutton" style={{gridArea:"1 / 1 / 2 / 2"}}>
// //           <RadioButton style={{float: "left"}} inputId="delivery" name="route" value="deliv" onChange={(e) => setRoute(e.value)} checked={route === 'deliv'} />
// //           <label htmlFor="delivery" style={{margin: "5px"}}>Delivery</label>
// //         </div>

// //         <div className="field-radiobutton" style={{gridArea:"1 / 2 / 2 / 3"}}>
// //           <RadioButton style={{float: "left"}} inputId="slopick" name="route" value="slopick" onChange={(e) => setRoute(e.value)} checked={route === 'slopick'} />
// //           <label htmlFor="slopick" style={{margin: "5px"}}>SLO Pickup</label>
// //         </div>

// //         <div className="field-radiobutton" style={{gridArea:"1 / 3 / 2 / 4"}}>
// //           <RadioButton style={{float: "left"}} inputId="atownpick" name="route" value="atownpick" onChange={(e) => setRoute(e.value)} checked={route === 'atownpick'} />
// //           <label htmlFor="atownpick" style={{margin: "5px"}}>Carlton Pickup</label>
// //         </div>

// //         <div style={{margin:"2px", gridArea: "2 / 1 / 3 / 4"}}>
// //           <InputTextarea 
// //             style={{width: "100%", marginTop: "5px"}} 
// //             rows={3} 
// //             inputid="note" 
// //             placeholder="Delivery Note (max 120 characters)" 
// //             onChange={e => setNote(e.target.value)} 
// //             maxLength={120}
// //           />
// //         </div>
// //       </div>

// //       {debug && <pre>{"route: " + JSON.stringify(route, null, 2)}</pre>}
// //       {debug && <pre>{"note: " + JSON.stringify(note, null, 2)}</pre>}
// //     </Card>
// //   )
// // }

// // function OrderDisplayCardsFC({ orderDisplayData, debug }) {

// //   return(
// //     <div>
// //         <div style={{display: "flex", margin:"10px"}}>
// //           <div style={{flex: "35%"}}>
// //             <Button label="+ Add Item" />
// //           </div> 
// //           <div style={{flex: "65%", alignSelf: "center", textAlign: "right"}}>
// //             {"Grand Total: " + orderDisplayData.reduce( (acc, curr) => acc + curr.newQty * curr.rate, 0).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
// //           </div>
// //         </div>
// //         <ScrollPanel style={{height: '350px', border: "solid 1px lightgray", borderRadius: "4px", margin: "10px"}}>
// //         <Accordion>
// //         {orderDisplayData.map (item => {
// //           return (
// //             <AccordionTab key={item.orderID} 
// //               toggleable icons={<i icons="pi pi-trash" />} 
// //               collapsed={true} 
// //               header={
// //                   <div className="p-fluid" style={{width: "100%", display: "grid", gridTemplateColumns: "200px 50px", columnGap: "20px"}}>
// //                     <div style={{alignSelf: "center"}}>{item.prodName}</div>
                    
// //                     <InputNumber value={item.newQty} />
                    
// //                   </div> 
// //               }
// //               style={{marginRight:"10px"}}  
// //             >
// //               <div className="orderCard-body p-fluid"
// //                 style={{
// //                   backgroundColor:"white",
// //                   display: "grid",
// //                   gridTemplateRows: "1fr 1fr",
// //                   gridTemplateColumns: "1fr 75px 50px",
// //                   rowGap: "5px",
// //                   columnGap: "5px"
// //                 }}
// //               >
// //                 <div style={{gridArea: "1 / 1 / 3 / 2", border: "solid 1px gray", padding: "5px"}}>
// //                   Picture? Product description?
// //                 </div>
// //                 <div style={{gridArea: "1 / 2 / 2 / 3", alignSelf:"center", textAlign: "right"}}>
// //                   {"Rate:"}
// //                 </div>
// //                 <div style={{gridArea: "1 / 3 / 2 / 4", alignSelf:"center"}}>
// //                   {item.rate.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
// //                 </div>
// //                 <div style={{gridArea: "2 / 2 / 3 / 3", alignSelf:"center", textAlign: "right"}}>
// //                   <b>{"Subtotal:"}</b>
// //                 </div>
// //                 <div style={{gridArea: "2 / 3 / 3 / 4", alignSelf:"center"}}>
// //                   <b>{(item.rate * item.newQty).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</b>
// //                 </div>
// //               </div>
// //             </AccordionTab>
// //           )
// //         })}
// //         </Accordion>
// //         </ScrollPanel>
// //         {debug && <pre>{JSON.stringify(orderDisplayData, null, 2)}</pre>}
// //     </div>
// //   )
// // }

// // function OrderDisplayTableFC({ orderDisplayData, debug }) {

// //   return (
// //     <Card 
// //       title="Order Display"
// //       style={{margin: "10px"}}
// //     >
// //       <DataTable
// //         value={orderDisplayData}
// //         style={{width: "100%"}}
// //         responsiveLayout="scroll"
// //         className="editable-cells-table"
// //         editMode="cell"
// //       >
// //             <Column field="prodName" header="Product" />
// //             <Column header="Quantity" 
// //               field="newQty" 
// //               style={{width: "75px"}}
// //               body={rowData => {
// //                 return(
// //                   <div className="p-fluid">
// //                     <InputNumber value={rowData.newQty} />
// //                   </div>
// //                 )
// //               }}
// //             />
// //       </DataTable>

// //       {debug && 
// //         <Panel header="OrderDisplay Variables" toggleable collapsed={true} style={{margin: "10px"}}>
// //           <pre>{"data: " + JSON.stringify(orderDisplayData, null, 2)}</pre>
// //         </Panel>
// //       }
// //     </Card>
// //   )
// // }




// // export const OrderDisplay2 = ({data, user, selection}) => {
// //   const [showSidebar, setShowSidebar] = useState(false)
  
// //   if (!data) return <pre>Loading...</pre>
// //   return (
// //     <>
// //       <Card 
// //         title={() => {
// //           return (
// //             <div style={{display: "flex", }}>
// //               <div style={{flex: "65%"}}>
// //                 Items
// //               </div>
// //               <div style={{flex: "35%"}}>
// //                 <Button label="+ Add Item" 
// //                   onClick={() => setShowSidebar(true)}
// //                   disabled={!selection.date || !selection.location}
// //                 />
// //               </div>
// //             </div>
// //           )
// //         }}
// //         style={{margin: "10px"}}
// //       >
        
// //         <DataTable
// //           value={data}
// //           style={{width: "100%"}}
// //           responsiveLayout="scroll"
// //           className="editable-cells-table"
// //           editMode="cell"
// //         >
// //               <Column field="prodName" header="Product" />
// //               <Column header="Quantity" 
// //                 field="newQty" 
// //                 style={{width: "75px"}}
// //                 body={rowData => {
// //                   return(
// //                     <div className="p-fluid">
// //                       <InputNumber value={rowData.newQty} />
// //                     </div>
// //                   )
// //                 }}
// //               />
// //         </DataTable>
// //       </Card>

// //       <AddItemSidebar 
// //         showSidebar={showSidebar} 
// //         setShowSidebar={setShowSidebar} 
// //         location={selection.location} 
// //         date={selection.date}
// //       />
// //     </>

// //   )
// // }

// // function AddItemSidebar({showSidebar, setShowSidebar, location, date}) {
// //   // fetch product data
// //   // maybe give hook location data about user pricing


// //   const { productData, productDataErrors } = useProductData(location, date)

// //   const [selection, setSelection] = useState({
// //     prodNick: null,
// //     newQty: null
// //   })
// //   if (!productData) return <pre>Loading...</pre>
// //   return(
// //     <Sidebar 
// //       className="p-sidebar-lg"
// //       visible={showSidebar}
// //       position="bottom"
// //       blockScroll={true}
// //       onHide={() => setShowSidebar(false)}
// //     >
// //       <span className="p-float-label p-fluid" style={{marginTop: "25px"}}>
// //         <Dropdown 
// //           id="productDropdown"
// //           options={productData ? productData : []}
// //           optionLabel="prodName"
// //           optionValue="prodNick"
// //           value={selection.prodNick}
// //           onChange={e => setSelection({
// //               ...selection,
// //               ...{prodNick: e.value}
// //           })}
// //           itemTemplate={option => {
// //             return(
// //               <div>
// //                 <div>{option.prodName}</div>
// //                 <div>{option.leadTime + " day lead; " + (option.disabled ? "earliest " + option.availableDate : 'available')}</div>
// //               </div>
// //             )
// //           }}
// //         />
// //         <label htmlFor="productDropdown">{productData ? "Select Product" : "Loading..."}</label>
// //       </span>
      
// //       <span className="p-float-label p-fluid" style={{marginTop: "25px"}}>
// //         <InputNumber />
// //         <label htmlFor="productDropdown">
// //           {"Quantity"}
// //         </label>
// //       </span>

// //     </Sidebar>
// //   )
// // }