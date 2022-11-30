import React from "react"

import { Card } from "primereact/card"
import { Panel } from "primereact/panel"
import { RadioButton } from "primereact/radiobutton"
import { InputTextarea } from "primereact/inputtextarea"
import { ScrollPanel } from "primereact/scrollpanel"

import { useOrderDisplay } from "../DataFetching/hooks"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputNumber } from "primereact/inputnumber"
import { useState } from "react"

export const OrderDisplay = ({ location, date, debug }) => {
  const { orderDisplay, orderDisplayErrors } = useOrderDisplay(location, date)
  const [route, setRoute] = useState()
  const [note, setNote] = useState()
  const optionsState = {route, setRoute, note, setNote}


  if (orderDisplayErrors) return(
    <pre>"Error displaying order: " + JSON.stringify(orderDisplayErrors, null, 2)</pre>
  )
  if (!orderDisplay) return(
    <pre>Loading...</pre>
  )
  return (

    <div>
      <OrderOptions optionsState={optionsState} debug={debug} />
      <OrderDisplayCardsFC
        orderDisplayData={orderDisplay}
        debug={debug}
      />
    </div>
  )
}

function OrderOptions({optionsState, debug}) {
  const {route, setRoute, note, setNote} = optionsState

  return(
    <Card
      title="Options"
      style={{margin: "10px"}}
    >
      
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gridTemplateRows:"1fr 3fr"}}>
        <div className="field-radiobutton" style={{gridArea:"1 / 1 / 2 / 2"}}>
          <RadioButton style={{float: "left"}} inputId="delivery" name="route" value="deliv" onChange={(e) => setRoute(e.value)} checked={route === 'deliv'} />
          <label htmlFor="delivery" style={{margin: "5px"}}>Delivery</label>
        </div>

        <div className="field-radiobutton" style={{gridArea:"1 / 2 / 2 / 3"}}>
          <RadioButton style={{float: "left"}} inputId="slopick" name="route" value="slopick" onChange={(e) => setRoute(e.value)} checked={route === 'slopick'} />
          <label htmlFor="slopick" style={{margin: "5px"}}>SLO Pickup</label>
        </div>

        <div className="field-radiobutton" style={{gridArea:"1 / 3 / 2 / 4"}}>
          <RadioButton style={{float: "left"}} inputId="atownpick" name="route" value="atownpick" onChange={(e) => setRoute(e.value)} checked={route === 'atownpick'} />
          <label htmlFor="atownpick" style={{margin: "5px"}}>Carlton Pickup</label>
        </div>

        <div style={{margin:"2px", gridArea: "2 / 1 / 3 / 4"}}>
          <InputTextarea 
            style={{width: "100%", marginTop: "5px"}} 
            rows={4} 
            inputid="note" 
            placeholder="Delivery Note" 
            onChange={e => setNote(e.target.value)} 
            maxLength={300}
          />

        </div>
      </div>

      {debug && <pre>{"route: " + JSON.stringify(route, null, 2)}</pre>}
      {debug && <pre>{"note: " + JSON.stringify(note, null, 2)}</pre>}
    </Card>
  )
}

function OrderDisplayCardsFC({ orderDisplayData, debug }) {

  return(
    <div>
        <h2>Items</h2>
        <ScrollPanel style={{width: '100%', height: '300px'}}>
        {orderDisplayData.map (item => {
          return (
            // <div className="orderCard"
            //   key={item.orderID}
            //   style={{
            //     border: "solid 1px lightgray",
            //     borderRadius: "4px",
            //     margin: "2px 10px 2px 10px",
            //     backgroundColor: "lightgray"
            //   }}
            // >
            //   <div className="orderCard-header">
            //     <h3 style={{color: "black"}}>{item.prodName}</h3>
            //   </div>

            <Panel key={item.orderID} toggleable icons={<i icons="pi pi-trash" />} collapsed={true} header={item.prodName + " (" + item.newQty + ")"}>
              <div className="orderCard-body p-fluid"
                style={{
                  backgroundColor:"white",
                  display: "grid",
                  gridTemplateRows: "1fr 1fr 1fr",
                  gridTemplateColumns: "1fr 75px 50px",
                  columnGap: "5px",
                  padding: "10px"
                }}
              >
                <div style={{gridArea: "1 / 2 / 2 / 3", alignSelf:"center", textAlign: "right"}}>
                  {"Qty:"}
                </div>
                <div style={{gridArea: "1 / 3 / 2 / 4", alignSelf:"center"}}>
                  <InputNumber value={item.newQty}/>
                </div>
                <div style={{gridArea: "2 / 2 / 3 / 3", alignSelf:"center", textAlign: "right"}}>
                  {"Rate:"}
                </div>
                <div style={{gridArea: "2 / 3 / 3 / 4", alignSelf:"center"}}>
                  {item.rate.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                </div>
                <div style={{gridArea: "3 / 2 / 4 / 3", alignSelf:"center", textAlign: "right"}}>
                  <b>{"Subtotal:"}</b>
                </div>
                <div style={{gridArea: "3 / 3 / 4 / 4", alignSelf:"center"}}>
                  <b>{(item.rate * item.newQty).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</b>
                </div>
              </div>
            </Panel>
            // </div>
          )
        })}
        </ScrollPanel>
        {debug && <pre>{JSON.stringify(orderDisplayData, null, 2)}</pre>}
    </div>
  )
}

function OrderDisplayTableFC({ orderDisplayData, debug }) {

  return (
    <Card 
      title="Order Display"
      style={{margin: "10px"}}
    >
      <DataTable
        value={orderDisplayData}
        style={{width: "100%"}}
        responsiveLayout="scroll"
        className="editable-cells-table"
        editMode="cell"
      >
            <Column field="prodName" header="Product" />
            <Column field="newQty" header="Quantity" />
      </DataTable>

      {debug && 
        <Panel header="OrderDisplay Variables" toggleable collapsed={true} style={{margin: "10px"}}>
          <pre>{"data: " + JSON.stringify(orderDisplayData, null, 2)}</pre>
        </Panel>
      }
    </Card>
  )
}