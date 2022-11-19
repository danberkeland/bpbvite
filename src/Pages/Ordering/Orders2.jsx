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
import { Sidebar } from "primereact/sidebar"

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
  const productList = mockData.products.map(item => ({label: item.prodName, value: item.prodNick}))

  const tabIndexFulfillmentTypes = ["deliv", "slopick", "atownpick"]
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
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

  // Add product Sidebar
  const [showSidebar, setShowSidebar] = useState(false)
  
  return (
      <div className="pageContainer">

        <h1>Wholesale Cart Order</h1>

        {/* Selection Area */}

        <div className="card">
          <header className="card-header">
            <h2>Selection</h2>
          </header>
          <div className="card-body">
            <div style={{display: "grid", gridTemplateColumns: "50% 50%", gap: "2px"}}>

              {/* Date */}
              <div style={{gridColumnStart: "1"}} className="p-fluid">
                <Calendar 
                  readOnlyInput
                  value={selectedDate}
                  placeholder={"Select Date"}
                  inline={false}
                  touchUI={true}
                  dateFormat="mm/dd/yy"
                  showTime={false}
                  onChange={e => {
                    // calendar selection values are js Date objects
                    setSelectedWeekday(weekdays[((e.value).getDay())])
                    setSelectedDate(e.value)
                  }}
                />
              </div>

              {/* Location */}
              <div style={{gridColumnStart: "2"}} className="p-fluid">
                {userProps.locNick === "backporch" &&
                  <Dropdown
                    placeholder="Select Location" 
                    options ={locationList}
                    value={selectedLocation}
                    onChange={e => {setSelectedLocation(e.value)}}
                  />
                }
                {userProps.locNick !== "backporch" && `Your location: ${selectedLocation}`}
              </div>
            </div>

            {/* PO Note */}
            <div style={{padding: "2px 0px 2px 0px"}}>
              <InputTextarea 
                autoResize
                placeholder={"Add a PO note"}
                style={{width: "100%"}}
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

          <div className="card-body">
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
                      onClick={() => {
                        setShowSidebar(true)
                      }}
                      // onClick={() => {
                      //   let newData = orderTable.slice()
                      //   let newItem = {
                      //     ...mockData.emptyOrder, 
                      //     locNick: selectedLocation,
                      //     delivDate: selectedDate,
                      //     route: tabIndexFulfillmentTypes[activeIndex], 
                      //     total: 0
                      //   }
                      //   newData.push(newItem)
                      //   setOrderTable(newData)
                      // }}
                    /> 
                  </div>
                  <div style={{display: "inline-block", width: "70%", height: "100%", textAlign: "center", verticalAlign: "middle"}}>
                    {orderTable && `Grand Total: ${dollarUS.format(orderTable.reduce((total, current) => {
                      return (total + current.total)
                    }, 0))}`}
                  </div>
                </>
              }
            >
              <Column field="prodNick" header="Product" ></Column>
              <Column field="rate" header="Rate" ></Column>
              <Column field="qty" 
                header="Quantity"
                style={{ width: '20%' }}
                editor={(options) => { return(
                    <InputNumber 
                      className="p-fluid" 
                      value={options.value} 
                      onValueChange={(e) => options.editorCallback(e.value)} 
                      style={{padding: "0px"}}
                    ></InputNumber>
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
              ></Column>
              <Column 
                field="total" 
                header="Total" 
                body={rowData => dollarUS.format(rowData.total)}
              ></Column>
              
            </DataTable>
            </div>

            <div className="card-footer" style={{backgroundColor:"lightGrey"}}></div>
          </div>

          <Sidebar className="p-sidebar-lg" visible={showSidebar} position="bottom" onHide={() => setShowSidebar(false)} modal={false} dismissable blockScroll>
            <h3>Bottom Sidebar</h3>
            <AddProductForm
              currentOrders={orderTable}
              currentRoute={tabIndexFulfillmentTypes[activeIndex]}
            />

          
          </Sidebar>
        
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
            <pre>orderTable: {JSON.stringify(orderTable, null, 2)}</pre>
          </div>
        </div>
        <div style={{height: "125px"}} />
      </div>

  )
}

export default Orders2



/*********
 * TODOS *
 *********/

//  Add-Product Sidebar:
//    Product Dropdown:
//      - filter out products already listed in the current fulfillment tab

//  Initital Product List:
//    - calculate the first available delivery date for each item

//  Order List:
//    - Disable editing features for orders from today or before

const AddProductForm = (currentOrders, currentRoute) => {

  // fetch product list
  const productList = mockData.products

  const [selectedProduct, setSelectedProduct] = useState()
  const [selectedQuantity, setSelectedQuantity] = useState()

  return (
    <div>
      <Dropdown 
      options={productList}
      optionLabel="prodName"
      value={selectedProduct}
      placeholder="Select Product"
      optionDisabled={item => {
        return (item.value === "rfr")
      }}
      onChange={e => {
        setSelectedProduct(e.value)
        // additionally, load details for selected product
      }}
      />
      <InputNumber 
        value={selectedQuantity} 
        onValueChange={e => {
          setSelectedQuantity(e.value)
        }} 
        placeholder="Quantity"
      />
      <p>Selected product details</p>
      <Button label="Add +" 
        onClick={() => {
          
        }}
      />
    </div>
  )
}