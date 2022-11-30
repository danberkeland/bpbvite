import { API } from "aws-amplify"
import { Dropdown } from "primereact/dropdown"
import { Card } from "primereact/card"
import { Accordion, AccordionTab } from "primereact/accordion"
import { Panel } from "primereact/panel"
import { InputNumber } from "primereact/inputnumber"
import React, { useState } from "react"

import { useSettingsStore } from "../../Contexts/SettingsZustand"
import { Calendar } from "primereact/calendar"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import useSWR from "swr"
import useSWRimmutable from "swr/immutable"
import { Column } from "primereact/column"
import { useEffect } from "react"
import { products } from "./mockData"
import { TabMenu } from "primereact/tabmenu"
import { Sidebar } from "primereact/sidebar"



/*********************
 * FETCHERS & STORES *
 *********************/

const gqlFetcher = async (query, variables) => {
  return (
    await API.graphql({
      query: query,
      variables: variables 
    })
  )
}

const useOrderList = (variables) => {
    const {locNick, dayOfWeek, delivDate} = variables
    console.log ("locNick: ", locNick)
    const { data, error } = useSWRimmutable(
      variables ? [listOrdersFromLocation, {
      locNick: locNick,
      dayOfWeek: dayOfWeek,
      delivDate: delivDate
    }] : null, gqlFetcher)

    console.log("data: ", data)
    console.log("error: ", error)
    return ({
      data: data? data.data : data,
      error: error
    })
}

const useLocationList = (userInfo) => {
  const {data, error } = useSWRimmutable(
    userInfo.location === 'backporch' ? [listLocationNames, {limit: 1000}] : null, 
    gqlFetcher
  )

  return ({
    data: data ? data.data.listLocations.items : data,
    error: error
  })
}

const useProductSelectionList = (userInfo) => {
  // for future: different fetching strategy depending on
  // external vs internal user?
  const { data, error } = useSWRimmutable(
    [listProducts, {limit: 1000}],
    gqlFetcher
  )

  return ({
    data: data ? data.data.listProducts.items : data,
    error: error
  })

}

/********
 * MAIN *
 ********/

const Orders3 = () => {
  const globalState = useSettingsStore()
  const userInfo = {
    name: globalState.user,
    authClass: globalState.authClass,
    location: globalState.userObject.attributes["custom:defLoc"]
  }

  const [selectedLocation, setSelectedLocation] = useState(userInfo.location !== 'backporch' ? userInfo.location : null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [orderQueryVariables, setOrderQueryVariables] = useState(null)
  const [showData, setShowData] = useState(false)
  
  const tabIndexFulfillmentTypes = ["deliv", "slopick", "atownpick"]
  const [activeIndex, setActiveIndex] = useState(0)
  const [displayDate, setDisplayDate] = useState()
  const [orderListDisplay, setOrderListDisplay] = useState()
  const [showSidebar, setShowSidebar] = useState(false)

  const [expandedRows, setExpandedRows] = useState(null);
  
  const { data: locList }  = useLocationList(userInfo)
  const { data: orderList } = useSWRimmutable(
    showData ? [listOrdersFromLocation, orderQueryVariables] : null, 
    gqlFetcher
  )
  const { data: productSelectList } = useProductSelectionList()

  // clean up incoming order data for presentation
  useEffect(() => {
    let altPrices
    let standing, cart
    let zone, route

    if (orderList) {
      zone = orderList.data.getLocation.zoneNick
      route = (zone === 'atownpick' || zone === 'slopick') ? zone : 'deliv'

      altPrices = orderList.data.getLocation.customProd.items
      altPrices = altPrices.map(item => ([item.prodNick, item.wholePrice]))
      altPrices = Object.fromEntries(altPrices)

      standing = orderList.data.getLocation.standing.items.map(item => ({
        id: item.id,
        prodName: item.product.prodName,
        prodNick: item.product.prodNick,
        originalQty: item.qty,
        newQty: item.qty,
        type: "S",
        route: route,
        rate: item.product.prodNick in altPrices 
          ? altPrices[item.product.prodNick] 
          : item.product.wholePrice,
        total: Math.round(item.qty * item.product.wholePrice * 100) / 100
      }))

      cart = orderList.data.getLocation.orders.items.map(item => ({
        id: item.id,
        prodName: item.product.prodName,
        prodNick: item.product.prodNick,
        originalQty: item.qty,
        newQty: item.qty,
        type: "C",
        route: item.route ? item.route : "deliv",
        rate: 'rate' in item 
          ? item.rate 
          : (
            item.product.prodNick in altPrices 
              ? altPrices[item.product.prodNick] 
              : item.product.wholePrice
          ),
        total: Math.round(item.qty * item.product.wholePrice * 100) / 100
      }))
      let cartAndStanding = [...cart, ...standing]
      let names = Array.from(new Set(cartAndStanding.map((pro) => pro.prodNick)));
      
      let orders = []
      for (let name of names) {
        let firstMatch = cartAndStanding.find((obj) => obj.prodNick === name);
        orders.push(firstMatch);
      }
      setOrderListDisplay(orders)
    }

  }, [orderList])

  return (
    <div>
      {/* SELECTION */}
      <Card 
        title={
          <div>
            <div style={{display: "inline-block"}}>Order Selection</div>
          </div>
        }
        footer={
          <Button label="Show"
            disabled={!selectedLocation || !selectedDate}
            onClick={() =>{
              const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
              const variables = {
                locNick: selectedLocation,
                dayOfWeek: weekdays[selectedDate.getDay()],
                delivDate: ('0' + (selectedDate.getMonth() + 1)).slice(-2) + '/' +  ('0' + selectedDate.getDate()).slice(-2) + '/' + selectedDate.getFullYear(),
              }
              setOrderQueryVariables(variables)
              setShowData(true)
              console.log("isodate: ", selectedDate)
              console.log("variables: ", variables)
            }}
          
          />
        }
        style={{margin: "10px"}}
      >
        <div>
          {(userInfo.location === 'backporch') && 
            <span className="p-float-label p-fluid" style={{marginTop: "25px"}}>
              <Dropdown 
                id="locationDropdown"
                options={locList}
                optionLabel="locName"
                optionValue="locNick"
                value={selectedLocation}
                onChange={e => {
                  setShowData(false)
                  setOrderListDisplay(null)
                  setSelectedLocation(e.value)
                }}
              />
              <label htmlFor="locationDropdown">{locList ? "location" : "Loading..."}</label>
            </span>
          }
          <span className="p-float-label p-fluid" style={{marginTop: "30px"}}>
            <Calendar 
              id="calendar"
              placeholder="delivery date"
              touchUI={true}
              style={{width: "100%"}}
              value={selectedDate}
              onChange={e => {
                setShowData(false)
                setOrderListDisplay(null)
                setSelectedDate(e.value)

                let dateArray = (e.value).toString().split(' ')
                setDisplayDate(dateArray[0] + ', ' + dateArray[1] + ' ' + dateArray[2])
              }}
            />
            <label htmlFor="calendar">{"Delivery Date"}</label>
          </span>
        </div> 
      </Card>
   
      {/* DISPLAY */}
      {orderListDisplay && showData && 
        <Card 
          title={"Orders for " + displayDate}
          style={{margin: "10px"}}  
          footer={() => {
            return(
              <div>
                <Button label="Add +" 
                  onClick={() => setShowSidebar(true)}
                />
              </div>
            )
          }}
        >
          {/* <TabMenu 
            model={[
              {label: `Delivery${orderListDisplay ? ' (' + orderListDisplay.filter(item => item.route === 'deliv').length + ')' : ''}`, icon: 'pi pi-send'},
              {label: `Pickup SLO${orderListDisplay ? ' (' + orderListDisplay.filter(item => item.route === 'slopick').length + ')' : ''}`, icon: 'pi pi-shopping-bag'},
              {label: `Pickup Carlton${orderListDisplay ? ' (' + orderListDisplay.filter(item => item.route === 'atownpick').length + ')' : ''}`, icon: 'pi pi-shopping-bag'},
            ]} 
            activeIndex={activeIndex}
            onTabChange={e => setActiveIndex(e.index)}
          /> */}

          <DataTable
            value={orderListDisplay && orderListDisplay.filter(item => (item.route === tabIndexFulfillmentTypes[activeIndex]))}
            style={{width: "100%"}}
            responsiveLayout="scroll"
            className="editable-cells-table"
            editMode="cell"
            dataKey="id" // dataKey prevents row from collapsing when editing quantity
            expandedRows={expandedRows} 
            onRowToggle={e => setExpandedRows(e.data)}
            rowExpansionTemplate={data => {
              return(
                <div style={{ display: "grid", gridTemplateColumns: "3em 1fr 20%", columnGap: "20px"}}>
                  <div style={{gridColumn: "1 / 2", alignSelf: "center"}}>
                    <Button icon="pi pi-trash" 
                      className="p-button-rounded p-button-warning" 
                      onClick={() => {
                        let _expandedRows = expandedRows
                        delete _expandedRows[data.id]
                        setExpandedRows(_expandedRows)
                        let filteredOrders = orderListDisplay.filter(item => item.prodNick !== data.prodNick)
                        setOrderListDisplay(filteredOrders)  
                      }} 
                    />
                  </div>
                  <div style={{gridColumn: "2 / 3", alignSelf: "center", textAlign: "right"}}>
                    <p>{"Rate: "}</p>
                    <p>{"Subtotal: "}</p>
                  </div>
                  <div style={{gridColumn: "3 / 4", alignSelf: "center"}}>
                    <p>{data.rate.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
                    <p>{(data.newQty * data.rate).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
                  </div>
                  {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
                </div>
              )
            }}
          >
            <Column expander style={{ width: '3em' }} />
            <Column field="prodName" 
              header="Product" 
              body={rowData => {
                return (
                    <div>{rowData.originalQty === rowData.newQty ? rowData.prodName : <b>{rowData.prodName}</b>}</div>
                )
              }}
            />
            <Column field="newQty" 
                header="Quantity"
                style={{ width: '20%' }}
                editor={(options) => { return(
                    <InputNumber 
                      className="p-fluid" 
                      value={options.value} 
                      onValueChange={(e) => {
                        options.editorCallback(e.value)
                      }} 
                      style={{padding: "0px"}}
                    ></InputNumber>
                )}}
                onCellEditComplete={e => {
                  let { rowData, newValue, field, originalEvent: event } = e
                  if (newValue > 0) {
                    let newTableData = orderListDisplay.slice()
                    newTableData.forEach( (item, idx) => {
                      if (item.id === rowData.id) {
                        newTableData[idx] = {...newTableData[idx], newQty: newValue, total: (rowData.rate * newValue)}
                      }})
                    setOrderListDisplay(newTableData)
                  } else if (newValue === 0) {
                    let newTableData = orderListDisplay.filter(item => item.prodNick !== rowData.prodNick)
                    setOrderListDisplay(newTableData)
                  } else
                    event.preventDefault()
                }}
                body={rowData => {
                  return (
                    <div>
                      {(rowData.originalQty === rowData.newQty ? rowData.newQty : <b>{rowData.newQty}</b>)}
                      <i className="pi pi-pencil" style={{fontSize: '0.75em', float: 'right', marginRight: '8px'}}></i>
                    </div>
                  )
                }}
              ></Column>
          </DataTable>
          <Panel header="Raw Table Data" toggleable collapsed={true} style={{margin: "10px"}}>
            {/* <pre>Order List: {JSON.stringify(orderList, null, 2)}</pre> */}
            <pre>expandedRows: {JSON.stringify(expandedRows, null, 2)}</pre>

          </Panel>
        </Card>
      }
      
      <Panel header="Variables" toggleable collapsed={true} style={{margin: "10px"}}>
        <pre>productSelectList: {JSON.stringify(productSelectList, null, 2)}</pre>
        <pre>orderListDisplay: {JSON.stringify(orderListDisplay, null, 2)}</pre>
        <pre>userInfo: {JSON.stringify(userInfo, null, 2)}</pre>
        <pre>selectedLocation: {JSON.stringify(selectedLocation, null, 2)}</pre>
        <pre>selectedDate: {JSON.stringify(selectedDate, null, 2)}</pre>
        <pre>orderQueryVariables: {JSON.stringify(orderQueryVariables, null, 2)}</pre>
        <pre>locList: {JSON.stringify(locList, null, 2)}</pre>
      </Panel>

      <div style={{height: "200px"}} />

      <Sidebar className="p-sidebar-lg" 
        visible={showSidebar} 
        position="bottom" 
        onHide={() => setShowSidebar(false)} 
        modal={false} 
        dismissable blockScroll
      >
        <h3>Bottom Sidebar</h3>
      </Sidebar>
    </div>
  )

}

export default Orders3

/*****************
 * SUBCOMPONENTS *
 *****************/


const OrderSummary = (variables) => {
  const { data: orderList, error } = useOrderList(variables)

  return (
    <Card 
      title="Data"
      style={{margin: "10px"}}  
    >
      <pre>Order List: {JSON.stringify(orderList, null, 2)}</pre>
    </Card>

  )

}

/***********
 * QUERIES *
************/

const listLocationNames = /* GraphQL */ `
  query ListLocations(
    $locNick: String
    $filter: ModelLocationFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listLocations(
      locNick: $locNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        locNick
        locName
      }
      nextToken
    }
  }
`;

const listOrdersFromLocation = /* GraphQL */ `
  query MyQuery(
    $locNick: String!, 
    $dayOfWeek: String, 
    $delivDate: String
  ) {
    getLocation(locNick: $locNick) {
      locNick
      locName
      zoneNick
      customProd {
        items {
          prodNick
          wholePrice
        }
      }
      orders(filter: {delivDate: {eq: $delivDate}}) {
        items {
          id
          product {
            prodNick
            prodName
            wholePrice
            retailPrice
          } 
          qty
          delivDate
          ItemNote
          isWhole
          SO
          rate
          route
          isLate
        }
        nextToken
      }
      standing(filter: {dayOfWeek: {eq: $dayOfWeek}}) {
        items {
          id
          product {
            prodNick
            prodName
            wholePrice
            retailPrice
          } 
          qty
          dayOfWeek
          ItemNote
          isWhole
          isStand
          startDate
          endDate
        }
        nextToken
      }
    }
  }
`;

const listProducts = /* GraphQL */ `
  query ListProducts(
    $prodNick: String
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listProducts(
      prodNick: $prodNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        prodName
        prodNick
        packSize
        doughNick
        guarantee
        readyTime
        wholePrice
        retailPrice
        isRetail
        retailName
        retailDescrip
        isWhole
        weight
        descrip
        picURL
        squareID
        forBake
        defaultInclude
        leadTime
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

