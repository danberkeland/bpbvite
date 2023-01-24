// First Iteration Standing Order Management

// Although the schema allows for serveral categories of standing order,
// we assume all records are wholesale (not retail), and standing (not holding).
// First extra type to incorporate will be holding orders

import React, { useState } from "react"

import { Dropdown } from "primereact/dropdown"
import { Checkbox } from "primereact/checkbox"
import { Button } from "primereact/button"

import { useLocationDetails, useLocationList } from "../Data/locationData"
import { useProductData, useProductList } from "../Data/productData"
import { useStandingByLocation } from "../Data/orderData"

import { getWorkingDate } from "../Functions/dateAndTime"
import { useEffect } from "react"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import dynamicSort from "../Functions/dynamicSort"
import { Card } from "primereact/card"
import { InputNumber } from "primereact/inputnumber"


export const StandingDisplay = ({ standingSettings, user }) => {
  const  { location, isWhole, isStand } = standingSettings
  const currentWorkingDate = getWorkingDate('NOW')

  // Display Controls
  const [viewMode, setViewMode] = useState(null) // 'DAY' or 'PRODUCT'. for future, perhaps a 'FULL' view which is a DAY view but with all 7 day columns.
  const [dayOfWeek, setDayOfWeek] = useState(null) // select day in viewMode 'DAY'
  const [selectedProdNick, setSelectedProdNick] = useState(null) // select product in viewMode 'PRODUCT'
  const [selectedProduct, setSelectedProduct] = useState(null)
  const viewSettings = { viewMode, setViewMode, dayOfWeek, setDayOfWeek, selectedProduct, setSelectedProduct } 
  
  // const { data:locationDetails } = useLocationDetails(location, !!location) // maybe use when adding route management features?
  // const { data:productData } = useProductData()
  
  const { data:standingData } = useStandingByLocation(location, !!location)
  const [standingBase, setStandingBase] = useState()

  const [standingChanges, setStandingChanges] = useState()

  useEffect(() => {
    if (!!standingData) {
      setStandingBase(makeStandingBase(standingData))
      setStandingChanges(makeStandingBase(standingData))
      
    }
  }, [standingData])

  const standingView = makeStandingView(standingChanges, isWhole, isStand, viewMode, dayOfWeek, selectedProduct)

  const products = standingChanges ? Object.values(standingChanges)
    .filter(item => item.isStand === isStand && item.isWhole === isWhole)
    .reduce((acc, curr) => {
      if (acc.findIndex(item => item.prodNick === curr.product.prodNick) === -1) {
        acc.push(curr.product)
      }
      return acc
      
    }, [])
    .sort(dynamicSort('prodName'))
    : []

  return(
    <div>
      <StandingViewControls
        viewSettings={viewSettings}
        products={products}
      />

      <div style={{margin: "10px"}}>
      <DataTable 
        value={standingView}
        responsiveLayout="scroll"
      >        
        <Column field='label'
          header={viewMode === 'DAY' ? 'Product' : 'Weekday'}
          body={rowData => {
            const dataKey = `${rowData.prodNick}_${rowData.dayOfWeek}_${isWhole ? '1' : '0'}_${isStand ? '1' : '0'}`
            const originalItem = standingBase ? standingBase[dataKey] : null
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
          header="Qty"
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
      </div>

      <AddProductInterface
        standingChanges={standingChanges}
        setStandingChanges={setStandingChanges}
        isWhole={isWhole}
        isStand={isStand}
      />

      <Button label="Submit Changes" 
        onClick={() => handleStandingSubmit(standingBase, standingChanges)}
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

const makeStandingBase = (standingData) => {

  const _standingData = standingData.map(item => {
    let dataKey = item.product.prodNick + '_' + item.dayOfWeek + '_' + (item.isWhole ? '1' : '0') + '_' + (item.isStand ? '1' : '0') 
    return ([dataKey, item])
  })

  return Object.fromEntries(_standingData)
}

const makeStandingView = (standingChanges, isWhole, isStand, viewMode, dayOfWeek, selectedProduct) => {
  if (!standingChanges) return []
  if (viewMode === 'DAY' && !dayOfWeek) return []
  if (viewMode === 'PRODUCT' && !selectedProduct) return []

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
    viewItems = viewItems.filter(item => item.product.prodNick === selectedProduct.prodNick)

    for (let day of weekdays) {
      let matchItem = viewItems.find(item => item.dayOfWeek === day)

      standingView.push({
        label: day,
        prodNick: selectedProduct.prodNick,
        prodName: selectedProduct.prodName,
        dayOfWeek: day,
        dataKey: matchItem ? matchItem.dataKey : null
      })
    }

  }

  return standingView

}


const StandingViewControls = ({ viewSettings, products }) => {
  const { viewMode, setViewMode, dayOfWeek, setDayOfWeek, selectedProduct, setSelectedProduct } = viewSettings

  return (
    <Card title="Display..." style={{margin: "10px"}}>
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
              if (!selectedProduct && !!products.length) setSelectedProduct(products[0])
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
            value={selectedProduct?.prodNick}
            options={products}
            optionLabel="prodName"
            optionValue="prodNick"
            onChange={e => setSelectedProduct(products.find(item => item.prodNick === e.value))}
          />
          <label htmlFor="product-dropdown">Product</label>
        </div>
        }
      </Card>
  )

}


const AddProductInterface = ({ standingChanges, setStandingChanges, isWhole, isStand }) => {
  const { data: productList } = useProductList(true)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleAddProduct = () => {
    let dataKey = selectedProduct.prodNick + '_placeholder_' + (isWhole ? '1' : '0') + '_' + (isStand ? '1' : '0')
    let placeholderItem = {
      dayOfWeek: 'placeholder',
      product: {
        prodNick: selectedProduct.prodNick,
        prodName: selectedProduct.prodName
      },
      isStand: isStand,
      isWhole: isWhole,
    }

    setStandingChanges({ ...standingChanges, [dataKey]: placeholderItem })
    
  }

  return (
    <div style={{margin: "10px"}}>
      <Dropdown 
        id="product-list-dropdown"
        options={productList}
        optionLabel="prodName"
        optionValue="prodNick"
        value={selectedProduct?.prodNick}
        filter
        onChange={e => setSelectedProduct(productList.find(item => item.prodNick === e.value))}
        style={{width: "100%", marginBottom: "10px"}}
      />

      <Button label="Add Product" 
        onClick={e => {
          handleAddProduct()
          setSelectedProduct(null)
        }}
        disabled={!productList || !selectedProduct}
      />
    </div>
  )
}

const handleStandingSubmit = (standingBase, standingChanges) => {

  for (let dataKey of Object.keys(standingChanges)) {
    if (standingChanges[dataKey].dayOfWeek === 'placeholder') continue
    let changeQty = standingChanges[dataKey].qty

    if (dataKey in standingBase) {
      let baseQty = standingBase[dataKey].qty
      if (changeQty !== baseQty) {
        if (changeQty > 0) console.log("UPDATE", dataKey)
        else console.log("DELETE", dataKey)

      }

    } else {
      if (changeQty > 0) {
        console.log("CREATE", dataKey)
      }

    }


  }


}