import React, { useState, useEffect } from "react"
import { Formik } from "formik"
import * as yup from "yup"

import { Calendar } from "primereact/calendar"
import { InputTextarea } from "primereact/inputtextarea"

import * as mockData from './mockData'
import { Dropdown } from "primereact/dropdown"
import { Button } from "primereact/button"
import { TabMenu } from "primereact/tabmenu"
import { Badge } from "primereact/badge"

import './orders.css'
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputNumber } from "primereact/inputnumber"

const Orders2 = () => {

  const testUser = mockData.users[1] // change index to test different user settings
  const userProps = {
    sub: testUser.sub,
    name: testUser.user.name,
    locNick: testUser.locNick,
    authClass: testUser.user.authClass,
    authType: testUser.authType
  }
  const locationList = [ ... new Set(mockData.users.map(item => item.locNick))]
    .map(item => ({label: item, value: item}))

  const tabIndexFulfillmentTypes = ["deliv", "slopick", "atownpick"]
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const dollarUSLocale = Intl.NumberFormat('en-US')
  const dollarUS = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  })

  // Selection inputs
  const [selectedDate, setSelectedDate] = useState()
  const [selectedWeekday, setSelectedWeekday] = useState()
  const [selectedLocation, setSelectedLocation] = useState(testUser.locNick === "backporch"? null : testUser.locNick)

  // order list area
  const [activeIndex, setActiveIndex] = useState(0)
  const [orderTable, setOrderTable] = useState()
  
  // Probably has bugs -- convert to Luxon later!
  useEffect(() => {
    let date = new Date()
    date.setDate(date.getDate() + 2)
    setSelectedDate(date)
    setSelectedWeekday(weekdays[((date).getDay())])
  }, []);
  
  return (
      <div className="pageContainer">

        <h1>Wholesale Cart Order</h1>

        {/* Selection Area */}

        <div className="card">
          <header className="card-header">
            <h3>Selection</h3>
          </header>
          <div className="card-body">
            {/* Location */}
            <div style={{padding: "0px 0px 2px 0px"}}>
              {userProps.locNick === "backporch" &&
                <Dropdown
                  placeholder="Location" 
                  options ={locationList}
                  value={selectedLocation}
                  onChange={e => {setSelectedLocation(e.value)}}
                />
              }
              {userProps.locNick !== "backporch" && <div>Your location: {selectedLocation}</div>}
            </div>
            {/* Date */}
            <div style={{padding: "2px 0px 2px 0px"}}>
              <Calendar 
                readOnlyInput
                value={selectedDate}
                inline={false}
                touchUI={true}
                dateFormat="mm/dd/yy"
                showTime={false}
                onChange={e => {
                  // calendar selection values are js Date objects
                  setSelectedWeekday(weekdays[((e.value).getDay())])
                  setSelectedDate(e.value)
                }}
                placeholder={"Select Date"}
              />
            </div>
            <div style={{padding: "2px 0px 2px 0px"}}>
              <InputTextarea 
                autoResize
                placeholder={"Add a PO note"}
              />
            </div>

            <div style={{padding: "2px 0px 2px 0px"}}>
              <Button label="Show" 
                onClick={() => {
                  const data = mockData.orders
                  const prodsWithTotals = data.map(item => ({
                    ...item, total: (item.qty * item.rate)
                  }))
                  setOrderTable(prodsWithTotals)
                }}
                disabled={!selectedDate || !selectedLocation}
              />
            </div>
          </div>
        </div>
        
        {/* Order List Area */}

        <div className="card">
          <header className="card-header">
            <h2>Order List</h2>
          </header>


            <TabMenu 
              model={[
                {label: `Delivery${orderTable ? ' (' + orderTable.filter(item => item.route === 'deliv').length + ')' : ''}`, icon: 'pi pi-send'},
                {label: `Pickup SLO${orderTable ? ' (' + orderTable.filter(item => item.route === 'slopick').length + ')' : ''}`, icon: 'pi pi-shopping-bag'},
                {label: `Pickup Carlton${orderTable ? ' (' + orderTable.filter(item => item.route === 'atownpick').length + ')' : ''}`, icon: 'pi pi-shopping-bag'},
              ]} 
              activeIndex={activeIndex}
              onTabChange={e => setActiveIndex(e.index)}
            />
            
            <DataTable 
              className="editable-cells-table"
              value={orderTable && orderTable.filter(item => (item.route === tabIndexFulfillmentTypes[activeIndex]))}
              responsiveLayout="scroll"
              editMode="cell"
              footer={
                <>
                  <div style={{display: "inline-block", width: "30%"}}>
                    <Button label="Add +" 
                      className="inline"
                      onClick={() => {
                      
                      }}
                    /> 
                  </div>
                  <div style={{display: "inline-block", width: "70%", height: "100%", textAlign: "center", verticalAlign: "middle"}}>
                    {orderTable && `Grand Total: ${dollarUS.format(orderTable.reduce((total, current) => {
                      return (total + current.total)
                    }, 0))}`}
                  </div>
                </>
              }
              // className="editable-cells-table"
            >
              <Column field="prodNick" header="Product" />
              <Column field="rate" header="Rate" />
              <Column field="qty" 
                header="Quantity"
                style={{ width: '20%' }}
                editor={(options) => { return(
                    <InputNumber 
                      className="p-fluid" 
                      value={options.value} 
                      onValueChange={(e) => options.editorCallback(e.target.value)} 
                    />
                )}}
                onCellEditComplete={e => {
                  let { rowData, newValue, field, originalEvent: event } = e
                  if (newValue >= 0) {
                    let newTableData = orderTable.slice()
                    newTableData.forEach( (item, idx) => {
                      if (item.id === rowData.id) {
                        newTableData[idx] = {...newTableData[idx], qty: newValue, total: (rowData.rate * newValue)}
                      }})
                    setOrderTable(newTableData)
                  } else
                    event.preventDefault()
                }}
              />
              <Column 
                field="total" 
                header="Total" 
                body={rowData => dollarUS.format(rowData.total)}
              />
              
            </DataTable>
          </div>
          <div className="card-footer" style={{backgroundColor:"lightGrey"}}>


        </div>
        
        {/* Variables */}
        <div className="card" hidden={false}>
          <header className="card-header">
            <h3>Variables</h3>
          </header>

          <div className="card-body">
            <pre>selectedDate: {JSON.stringify(selectedDate, null, 2)}</pre>
            <pre>selectedWeekday: {JSON.stringify(selectedWeekday, null, 2)}</pre>
            <pre>selectedLocation: {JSON.stringify(selectedLocation, null, 2)}</pre>
            <pre>userProps: {JSON.stringify(userProps, null, 2)}</pre>
            <pre>activeIndex: {JSON.stringify(activeIndex, null, 2)}</pre>
          </div>
        </div>
        <div style={{height: "125px"}} />
      </div>


  )
}

export default Orders2