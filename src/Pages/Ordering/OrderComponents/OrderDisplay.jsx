import React, { useEffect } from "react"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputNumber } from "primereact/inputnumber"
import { RadioButton } from "primereact/radiobutton"
import { InputTextarea } from "primereact/inputtextarea"

export const OrderDisplay = ({data, disableAddItem, setShowAddItem}) => {
  const {orderHeader, setOrderHeader, orderData, setOrderData} = data

  return (
    <div>
      <Card 
        style={{marginTop: "10px"}}
        title="Options"
      >
        <div>
          {orderHeader.zoneNick !== 'slopick' && orderHeader.zoneNick !== 'atownpick' &&
          <span style={{margin: "5px"}}>
            <RadioButton inputId="deliv" value="deliv" 
              checked={orderHeader.route === 'deliv'}
              onChange={e => setOrderHeader({...orderHeader, route: e.value})}
            />
            <label htmlFor="deliv">Delivery</label>
          </span>
          }
          <span style={{margin: "5px"}}>
            <RadioButton inputId="slopick" value="slopick" 
              onChange={e => setOrderHeader({...orderHeader, route: e.value})} 
              checked={orderHeader.route === 'slopick'}
            />
            <label htmlFor="slopick">Pick Up SLO</label>
          </span>
          <span style={{margin: "5px"}}>
            <RadioButton inputId="atownpick" value="atownpick" 
              onChange={e => setOrderHeader({...orderHeader, route: e.value})} 
              checked={orderHeader.route === 'atownpick'}
            />
            <label htmlFor="atownpick">Pick Up Carlton</label>
          </span>
        </div>

        <InputTextarea placeholder="Add a Note" 
          style={{margin: "5px", width: "100%"}}
          onChange={e => setOrderHeader({...orderHeader, ItemNote: e.target.value})}
        />
          
        {/* <pre>{JSON.stringify(orderHeader, null, 2)}</pre> */}
      </Card>

      <Card 
        style={{marginTop: "10px"}}
        title={() => {
          return (
            <div style={{display: "flex", }}>
              <div style={{flex: "65%"}}>
                Items
              </div>
              <div style={{flex: "35%"}}>
                <Button label="+ Add Item" 
                  disabled={disableAddItem}
                  onClick={() => setShowAddItem(true)}
                />
              </div>
            </div>
          )
        }}
      >
        <DataTable
          value={orderData}
          style={{width: "100%"}}
          responsiveLayout="scroll"
          className="editable-cells-table"
          editMode="cell"
        >
          <Column header="Product" 
            field="prodName" 
          />
          <Column header="Quantity" 
            field="newQty" 
            style={{width: "75px"}}
            body={rowData => {
              return(
                <div className="p-fluid">
                  <InputNumber 
                    value={rowData.newQty} 
                    onChange={e => {
                      const _orderData = orderData.map(item => 
                        item.prodNick === rowData.prodNick ? 
                          {...item, newQty: e.value} : 
                          item
                      )
                      setOrderData(_orderData)
                    }}
                  />
                </div>
              )
            }}
          />
        </DataTable>
      </Card>
    </div>
  )

}

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