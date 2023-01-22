// First Iteration Standing Order Management

// Although the schema allows for serveral categories of standing order,
// we assume all records are wholesale (not retail), and standing (not holding).
// First extra type to incorporate will be holding orders

import React, { useState } from "react"

import { Dropdown } from "primereact/dropdown"
import { Checkbox } from "primereact/checkbox"
import { Button } from "primereact/button"

import { useLocationDetails, useLocationList } from "../Data/locationData"
import { useProductData } from "../Data/productData"
import { useStandingByLocation } from "../Data/orderData"

import { getWorkingDate } from "../Functions/dateAndTime"
import { useEffect } from "react"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import dynamicSort from "../Functions/dynamicSort"
import { Card } from "primereact/card"
import { InputNumber } from "primereact/inputnumber"


export const StandingDisplay = ({location, setLocation, userName, user}) => {
  const currentWorkingDate = getWorkingDate('NOW')

  // Admin Options for standing orders
  const [isWhole, setIsWhole] = useState(true)
  const [isStand, setIsStand] = useState(true)
  const filters = { isWhole, isStand }
  
  // Display Controls
  const [viewMode, setViewMode] = useState(null) // 'DAY' or 'PRODUCT'. for future, perhaps a 'FULL' view which is a DAY view but with all 7 day columns.
  const [dayOfWeek, setDayOfWeek] = useState(null) // view by day X all products
  const [selectedProdNick, setSelectedProdNick] = useState(null) // view by product X all days
  
  const { data:locationList, errors:locationListErrors } = useLocationList(user.location === 'backporch')
  const { data:locationDetails } = useLocationDetails(location, !!location) // maybe use elsewhere
  const { data:productData } = useProductData()
  
  const { data:standingData } = useStandingByLocation(location, !!location)
  const [standingBase, setStandingBase] = useState()
  const [standingChanges, setStandingChanges] = useState()

  useEffect(() => {
    if (!!standingData) {
      setStandingBase(makeStandingBase(standingData))
      setStandingChanges(makeStandingBase(standingData))
      
    }
  }, [standingData])

  const standingView = makeStandingView(standingChanges, filters, viewMode, dayOfWeek, selectedProdNick)

  // State for tracking edits
  const [dropdownProdNick, setDropdownProdNick] = useState(null)
  //const [newProducts, setNewProducts] = useState([]) // array of objects with prodNick, prodName attributes
  
  //const standingDataFiltered = standingData ? standingData.filter(item => item.isStand === isStand && item.isWhole === isWhole) : []
  //const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const products = standingChanges ? Object.values(standingChanges)
    .filter(item => item.isStand === isStand && item.isWhole === isWhole)
    .reduce((acc, curr) => {
      if (acc.findIndex(item => item.prodNick === curr.product.prodNick) === -1) {
        acc.push(curr.product)
      }
      return acc
      
    }, [])
    //.concat(newProducts)
    .sort(dynamicSort('prodName'))
    : []

  // const standingByDay = makeDayView(standingDataFiltered, weekdays, products)
  // const standingByProduct = makeProductView(standingDataFiltered, weekdays, products)
  // const labelColumn = viewMode === 'DAY' ? 'product.prodName' : 'dayOfWeek'
  // const valueColumn = viewMode === 'DAY' ? dayOfWeek : selectedProdNick

  return(
    <div>
      {user.location === 'backporch' &&
      <Card title="Admin Controls" style={{margin: "10px"}}>
          <div className="p-float-label p-fluid" style={{margin: "25px"}}>
            <Dropdown 
              id="locationDropdown"
              options={locationList || null}
              optionLabel="locName"
              optionValue="locNick"
              value={location}
              filter
              onChange={e => setLocation(e.value)}
            />
            <label htmlFor="locationDropdown">{locationList ? "Location" : (locationListErrors ? "Error" : "Loading...")}</label>

          </div>

          <div className="field-checkbox" style={{marginLeft: "25px"}}>
            <Checkbox
              inputId="iswhole"
              onChange={e => setIsWhole(e.checked)}
              checked={isWhole}
              style={{marginRight: "0.5em"}}
            />
            <label htmlFor="iswhole" className="p-checkbox-label">isWhole</label>
          </div>

          <div className="field-checkbox" style={{marginLeft: "25px", marginTop: "5px"}}>
            <Checkbox
              inputId="isstand"
              onChange={e => setIsStand(e.checked)}
              checked={isStand}
              style={{marginRight: "0.5em"}}
            />
            <label htmlFor="isstand" className="p-checkbox-label">isStand</label>
          </div>
        </Card>
      }

      <Card title="Display" style={{margin: "10px"}}>
      <div style={{display: "flex"}}>
        <Button label="by Day" 
          onClick={e => {
            setViewMode('DAY')
            if (!dayOfWeek) setDayOfWeek('Sun')
          }} 
          className={viewMode === 'DAY' ? '' : "p-button-outlined p-button-secondary"}
          style={{flex: "50%", marginRight: "25px"}}
        />
        <Button label="by Product" 
          onClick={e => {
            setViewMode('PRODUCT')
            if (!selectedProdNick && !!products.length) setSelectedProdNick(products[0].prodNick)
          }} 
          className={viewMode === 'PRODUCT' ? '' : "p-button-outlined p-button-secondary"}
          style={{flex: "50%"}}
        />
      </div>


      {viewMode === 'DAY' && 
      <div className="p-float-label" style={{marginTop: "30px"}}>
        <Dropdown
          id="weekday-dropdown"
          value={dayOfWeek}
          options={
            [
              {label: "Sunday", value: "Sun"},
              {label: "Monday", value: "Mon"},
              {label: "Tuesday", value: "Tue"},
              {label: "Wednesday", value: "Wed"},
              {label: "Thursday", value: "Thu"},
              {label: "Friday", value: "Fri"},
              {label: "Saturday", value: "Sat"},
            ]
          }
          onChange={e => setDayOfWeek(e.value)}
        />
        <label htmlFor="weekday-dropdown">Day</label>
      </div>
      }

      {viewMode === 'PRODUCT' && 
      <div className="p-float-label" style={{marginTop: "30px"}}>
        <Dropdown
          style={{width: "100%"}}
          id="product-dropdown"
          value={selectedProdNick}
          options={products.map(item => {
            return({
              label: item.prodName, 
              value: item.prodNick})
          })}
          onChange={e => setSelectedProdNick(e.value)}
        />
        <label htmlFor="product-dropdown">Product</label>
      </div>
      }
      </Card>


      <DataTable 
        value={standingView}
        style={{width: "100%", margin: "10px"}}
        responsiveLayout="scroll"
      >        
        <Column field='label'
          header={viewMode === 'DAY' ? 'Product' : 'Weekday'}
          body={rowData => {
            const dataKey = `${rowData.prodNick}_${rowData.dayOfWeek}_${isWhole ? '1' : '0'}_${isStand ? '1' : '0'}`
            const originalItem = standingBase[dataKey]
            const changedItem = standingChanges[dataKey]

            const shouldCreate = !originalItem && (!!changedItem && changedItem.qty) > 0
            const qtyChanged = (!!originalItem && !!changedItem) && (originalItem.qty !== changedItem.qty)

            return (
              <span style={{fontWeight: (shouldCreate || qtyChanged) ? "bold" : ""}}>
                {rowData.label}
              </span>
            )
          }}
        />
        <Column field='dataKey'
          header="Quantity"
          style={{width:"80px"}}
          body={rowData => {
            const standingItem = standingChanges[rowData.dataKey]
            
            return(
              <div className="p-fluid">
                <InputNumber 
                  value={standingItem ? standingItem.qty : 0}
                  onValueChange={e => {
                    if (standingItem) {
                      let _update = { 
                        ...standingChanges, 
                        [rowData.dataKey]: {
                          ...standingChanges[rowData.dataKey], 
                          qty: e.value
                        }
                      }
                      console.log(_update)
                      setStandingChanges(_update)
                    } else {
                      let dataKey = rowData.prodNick + '_' + rowData.dayOfWeek + '_' + (isWhole ? '1' : '0') + '_' + (isStand ? '1' : '0') 
                      let newItem = {
                        locNick: location,
                        isStand: isStand,
                        isWhole: isWhole,
                        dayOfWeek: rowData.dayOfWeek,
                        route: 'deliv',
                        prodNick: rowData.prodNick,
                        qty: e.value,
                        startDate: '2023-01-01',
                        updatedBy: user.name,
                        product: {
                          prodNick: rowData.prodNick,
                          prodName: rowData.prodName
                        }
                      }
                      let _update = {
                        ...standingChanges,
                        [dataKey]: newItem
                      }
                      console.log(_update)
                      setStandingChanges(_update)
                    }
                  }}
                />
              </div>
            )
          }}
        />
      </DataTable>

      <Dropdown 
        id="product-list-dropdown"
        options={productData}
        optionLabel="prodName"
        optionValue="prodNick"
        value={dropdownProdNick}
        filter
        onChange={e => setDropdownProdNick(e.value)}
      />
      
      <Button label="Add Product" 
        onClick={e => {
          let match = productData.find(item => item.prodNick === dropdownProdNick)
          if (!!match) {
            let dataKey = match.prodNick + '_placeholder_' + (isWhole ? '1' : '0') + '_' + (isStand ? '1' : '0')
            let placeholderItem = {
              dayOfWeek: 'placeholder',
              product: {
                prodNick: match.prodNick,
                prodName: match.prodName
              },
              isStand: isStand,
              isWhole: isWhole,
            }

            setStandingChanges({ ...standingChanges, [dataKey]: placeholderItem })

          } else {
            let dataKey

          }

        }}
      />

      {/* <pre>{viewMode === 'DAY' ? JSON.stringify(standingByDay, null, 2) : JSON.stringify(standingByProduct, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(standingDisplay, null, 2)}</pre> */}
      {/* <pre>{productData && JSON.stringify(productData.slice(5), null, 2)}</pre> */}
      {/* <pre>{locationDetails && locationDetails.locNick}</pre> */}
      {/* <pre>{standingData && JSON.stringify(standingData.filter(item => item.isStand === isStand && item.isWhole === isWhole), null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(products, null, 2)}</pre> */}

    </div>
  )

}



const makeDayView = (standingData, weekdays, products) => {
  // want rows with first column showing product names
  // want quantities corresponding to each weekday in subsequent 7 columns
  // we can limit the view as needed to a particular day
  if (!standingData.length) return []

  // build out empty grid
  let dayView = []
  for (let p of products) {
    let emptyRow = {
      prodNick: p.prodNick,
      product: p
    }

    for (let day of weekdays) {
      emptyRow[day] = {
        id: null,
        qty: 0,
      }
    
    }

    dayView.push(emptyRow)

  }

  // put standing items in spots matching prodNick and dayOfWeek

  for (let item of standingData) {
    let idx = dayView.findIndex(dvItem => dvItem.product.prodNick === item.product.prodNick)
    if (idx > -1) dayView[idx][item.dayOfWeek] = item
  }

  dayView.sort(dynamicSort('prodNick'))
  
  return dayView

}

const makeProductView = (standingData, weekdays, products) => {
  // want rows with first column showing days of the week
  // want quantities correspopnding to each product in subsequent N columns (depends on # of products)
  // can limit the view to a single product
  if (!standingData.length) return []

  // build out empty grid
  let productView = []
  for (let day of weekdays) {
    let emptyRow = {
      dayOfWeek: day,
    }

    for (let p of products) {
      emptyRow[p.prodNick] = {
        id: null,
        qty: 0,
      }
    
    }

    productView.push(emptyRow)

  }

  for (let item of standingData) {
    let idx = productView.findIndex(viewItem => viewItem.dayOfWeek === item.dayOfWeek)
    if (idx > -1) productView[idx][item.product.prodNick] = item
  }

  return productView

}


const makeStandingBase = (standingData) => {

  const _standingData = standingData.map(item => {
    let dataKey = item.product.prodNick + '_' + item.dayOfWeek + '_' + (item.isWhole ? '1' : '0') + '_' + (item.isStand ? '1' : '0') 
    return ([dataKey, item])
  })

  return Object.fromEntries(_standingData)
}

const makeStandingView = (standingChanges, filters, viewMode, dayOfWeek, selectedProdNick) => {
  const { isStand, isWhole } = filters

  if (!standingChanges) return []
  if (viewMode === 'DAY' && !dayOfWeek) return []
  if (viewMode === 'PRODUCT' && !selectedProdNick) return []

  // Filter down to 'grid type'
  let viewItems = Object.entries(standingChanges).map(([k, v]) => {return { ...v, dataKey: k}}) // convert back to array of objects
    .filter(item => item.isStand === isStand && item.isWhole === isWhole)

  // define products/days for this grid type
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const products = viewItems
    .reduce((acc, curr) => {
      if (acc.findIndex(item => item.prodNick === curr.product.prodNick) === -1) {
        acc.push(curr.product)
      }
      return acc
      
    }, [])
    .sort(dynamicSort('prodName'))

  // make transformation for given viewMode
  let standingView = []

  // console.log(products)
  // console.log(viewItems)

  if (viewMode === 'DAY') {
    viewItems = viewItems.filter(item => item.dayOfWeek === dayOfWeek)
    
    for (let p of products) {
      let matchItem = viewItems.find(item => item.product.prodNick === p.prodNick)

      standingView.push({
        label: p.prodName,
        prodNick: p.prodNick,
        prodName: p.prodName,
        dayOfWeek: dayOfWeek,
        dataKey: matchItem ? matchItem.dataKey : null
      })
    }

  }

  if (viewMode === 'PRODUCT') {
    viewItems = viewItems.filter(item => item.product.prodNick === selectedProdNick)

    for (let day of weekdays) {
      let matchItem = viewItems.find(item => item.dayOfWeek === day)

      standingView.push({
        label: day,
        prodNick: selectedProdNick,
        prodName: (products.find(item => item.prodNick === selectedProdNick)).prodName,
        dayOfWeek: day,
        dataKey: matchItem ? matchItem.dataKey : null
      })
    }

  }

  return standingView

}