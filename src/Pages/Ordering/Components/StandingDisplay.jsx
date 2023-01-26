// First Iteration Standing Order Management

// Although the schema allows for serveral categories of standing order,
// we assume all records are wholesale (not retail), and standing (not holding).
// First extra type to incorporate will be holding orders

import React, { useState } from "react"

import { Dropdown } from "primereact/dropdown"
import { Button } from "primereact/button"

import { useProductList } from "../Data/productData"
import { fetchTransitionOrders, useStandingByLocation } from "../Data/orderData"

import { useEffect } from "react"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import dynamicSort from "../Functions/dynamicSort"
import { Card } from "primereact/card"
import { InputNumber } from "primereact/inputnumber"
import { getTransitionDates, getWeekday, getWorkingDateTime } from "../Functions/dateAndTime"

import { gqlFetcher } from "../Data/fetchers"
import * as queries from '../Data/gqlQueries'


export const StandingDisplay = ({ standingSettings, user }) => {
  const  { location, isWhole, isStand } = standingSettings

  // Display Controls
  const [viewMode, setViewMode] = useState(null) // 'DAY' or 'PRODUCT'. for future, perhaps a 'FULL' view which is a DAY view but with all 7 day columns.
  const [dayOfWeek, setDayOfWeek] = useState(null) // select day in viewMode 'DAY'
  const [selectedProduct, setSelectedProduct] = useState(null)
  const viewSettings = { viewMode, setViewMode, dayOfWeek, setDayOfWeek, selectedProduct, setSelectedProduct } 
  
  // const { data:locationDetails } = useLocationDetails(location, !!location) // maybe use when adding route management features?
  
  const { data:standingData, mutate:mutateStanding } = useStandingByLocation(location, !!location)
  const [standingBase, setStandingBase] = useState({})
  const [standingChanges, setStandingChanges] = useState({})
  const changeDetected = detectChange(standingBase, standingChanges)

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
      <StandingDisplayOptions
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
            const dataKey = [rowData.prodNick, rowData.dayOfWeek, (isWhole ? '1' : '0'), (isStand ? '1' : '0')].join('_')
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
                    // console.log('rowData', rowData)
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
                      let dataKey = [rowData.prodNick, rowData.dayOfWeek, (isWhole ? '1' : '0'), (isStand ? '1' : '0')].join('_')
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
                      console.log("Updated standing changes:", _update)
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
        viewMode={viewMode}
        setSelectedProduct={setSelectedProduct}
      />

      <Button label="Submit Changes"
        onClick={() => handleStandingSubmit(location, isWhole, standingBase, standingChanges, mutateStanding, user.name)}
        disabled={!changeDetected}
      />

      <p>{`Changes will take effect ${getWorkingDateTime('NOW').plus({ days: 4 }).toLocaleString({ weekday: 'long', month: 'short', day: '2-digit' })}.`}</p>
        
      {/* <pre>{viewMode === 'DAY' ? JSON.stringify(standingByDay, null, 2) : JSON.stringify(standingByProduct, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(standingDisplay, null, 2)}</pre> */}
      {/* <pre>{productData && JSON.stringify(productData.slice(5), null, 2)}</pre> */}
      {/* <pre>{locationDetails && locationDetails.locNick}</pre> */}
      {/* <pre>{standingData && JSON.stringify(standingData.filter(item => item.isStand === isStand && item.isWhole === isWhole), null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(products, null, 2)}</pre> */}

    </div>
  )

}

/**
 * Converts AppSync array-of-objects to a nested object with prodNick/dayOfWeek/isWhole/isStand compound keys 
 */
const makeStandingBase = (standingData) => {

  const _standingData = standingData.map(item => {
    let dataKey = [item.product.prodNick, item.dayOfWeek, (item.isWhole ? '1' : '0'), (item.isStand ? '1' : '0')].join('_')
    return ([dataKey, item])
  })

  return Object.fromEntries(_standingData)
}

/**
 * Data transform on standingChanges. Filter and change to array of objects structured for different DataTable displays.
 */
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

const detectChange = (standingBase, standingChanges) => {
  let changeDetected = false
  for (let dataKey of Object.keys(standingChanges)) {
    let changeItem = standingChanges[dataKey]
    if (changeItem.dayOfWeek === 'placeholder') continue

    let baseItem = standingBase[dataKey]
    if ((!baseItem) || (baseItem.qty !== changeItem.qty)) {
      changeDetected = true
      break
    }
  }

  return changeDetected
}


/**
 * Decides which standing order items have been changed, and submit the appropriate mutation to the DB.
 * 
 * Preserves orders up to 3 days out by converting any items generated by the current standing order to
 * cart order items.
 */
const handleStandingSubmit = async (location, isWhole, standingBase, standingChanges, mutateStanding,  userName) => {
  const cartOrders = await fetchTransitionOrders(location)

  let _cartOrders = cartOrders.filter(item => item.isWhole === isWhole)
  let _standingBase = Object.values(standingBase).filter(item => (item.isWhole === isWhole && item.isStand === true))
  let _standingChanges = Object.values(standingChanges).filter(item => (item.isWhole === isWhole && item.isStand === true))

  const transitionDates = getTransitionDates('UTCString')
  for (let utcDate of transitionDates) {
    let delivDateISO = utcDate.split('T')[0]
    let dayOfWeek = getWeekday(new Date(utcDate))
    const cartItems = _cartOrders.filter(item => item.delivDate === delivDateISO)
    const standingBaseItems = _standingBase.filter(item => item.dayOfWeek === dayOfWeek)
    const standingChangeItems = _standingChanges.filter(item => item.dayOfWeek === dayOfWeek)

    for (let changeItem of standingChangeItems) {
      let baseItem = standingBaseItems.find(item => item.product.prodNick === changeItem.product.prodNick)

      if (cartItems.findIndex(item => item.prodNick === changeItem.product.prodNick) !== -1) {
        if ((!baseItem && changeItem.qty > 0) || (baseItem && (baseItem.qty !== changeItem.qty))) {
          console.log(delivDateISO, dayOfWeek, changeItem.product.prodNick, `: cart item exists; take no action`)
        }
      } else {
        
        if (!baseItem && changeItem.qty > 0) {
          console.log(`${delivDateISO} ${changeItem.product.prodNick}_${dayOfWeek}_${changeItem.isWhole ? '1' : '0'}_1: Standing created & no cart; create cart item with 0 qty.`)
          let cartCreateItem = {
            locNick: location,
            isWhole: changeItem.isWhole,
            route: changeItem.route,
            delivDate: delivDateISO,
            prodNick: changeItem.product.prodNick,
            qty: 0,
            qtyUpdatedOn: new Date().toISOString(),
            sameDayMaxQty: 0,
            rate: null,
            ItemNote: changeItem.ItemNote,
            isLate: 0,
            updatedBy: userName
          }

          let query = queries.createOrder
          let variables = { input: cartCreateItem }

          const response = await gqlFetcher(query, variables)
          console.log("Created cart order:", JSON.stringify(response.data.createOrder))


        }

        if (baseItem && (baseItem.qty !== changeItem.qty)) {
          console.log(`${delivDateISO} ${changeItem.product.prodNick}_${dayOfWeek}_${changeItem.isWhole ? '1' : '0'}_1: Standing changed & no cart; create cart item. with ${baseItem.qty} qty.`)
          // console.log(cartCreateItem)
          let cartCreateItem = {
            locNick: location,
            isWhole: baseItem.isWhole,
            route: baseItem.route,
            delivDate: delivDateISO,
            prodNick: baseItem.product.prodNick,
            qty: baseItem.qty,
            qtyUpdatedOn: new Date().toISOString(),
            sameDayMaxQty: baseItem.qty,
            rate: null,
            ItemNote: baseItem.ItemNote,
            isLate: 0,
            updatedBy: userName
          }

          let query = queries.createOrder
          let variables = { input: cartCreateItem }

          const response = await gqlFetcher(query, variables)
          console.log("Created cart order:", JSON.stringify(response.data.createOrder))

        }
      }

    }

  }

  for (let dataKey of Object.keys(standingChanges)) {
    if (standingChanges[dataKey].dayOfWeek === 'placeholder') continue

    let changeItem = standingChanges[dataKey]

    if (dataKey in standingBase) {
      let baseItem = standingBase[dataKey]
      if (changeItem.qty !== baseItem.qty) {
        if (changeItem.qty > 0) {
          console.log("UPDATE", dataKey)

          // graphql updateStanding mutation
          let query = queries.updateStanding
          let variables = {
            input: {
              id: baseItem.id,
              qty: changeItem.qty
            }
          }
          const response = await gqlFetcher(query, variables)
          console.log("Updated standing order:", JSON.stringify(response.data.createStanding))
        }
        
        else {
          console.log("DELETE", dataKey)

          //graphql deleteStanding mutation
          let query = queries.deleteStanding
          let variables = {
            input: {
              id: baseItem.id
            }
          }
          const response = await gqlFetcher(query, variables)
          console.log("Deleted standing order:", JSON.stringify(response.data.deleteStanding))
        }
        
      }

    } else {
      if (changeItem.qty > 0) {
        console.log("CREATE", dataKey)

        // graphql createStanding mutation
        let query = queries.createStanding
        let variables = {
          input: {
            locNick: location,
            isWhole: changeItem.isWhole,
            isStand: changeItem.isStand,
            dayOfWeek: changeItem.dayOfWeek,
            route: changeItem.route,
            prodNick: changeItem.prodNick,
            qty: changeItem.qty,
            startDate: getWorkingDateTime('NOW').plus({ days: 4}).toISODate(),
            updatedBy: userName
          }
        }
        const response = await gqlFetcher(query, variables)
        console.log("Created standing order:", JSON.stringify(response.data.createStanding))

      }

    }
  }

  mutateStanding()

}

const StandingDisplayOptions = ({ viewSettings, products }) => {
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


const AddProductInterface = ({ standingChanges, setStandingChanges, isWhole, isStand, viewMode, setSelectedProduct }) => {
  const { data: productList } = useProductList(true)
  const [productToAdd, setProductToAdd] = useState(null)

  const handleAddProduct = () => {
    let dataKey = [productToAdd.prodNick, 'placeholder', (isWhole ? '1' : '0'), (isStand ? '1' : '0')].join('_')
    let placeholderItem = {
      dayOfWeek: 'placeholder',
      product: {
        prodNick: productToAdd.prodNick,
        prodName: productToAdd.prodName
      },
      isStand: isStand,
      isWhole: isWhole,
    }

    setStandingChanges({ ...standingChanges, [dataKey]: placeholderItem })
    if (viewMode === 'PRODUCT') setProductToAdd(null)
  }

  return (
    <div style={{margin: "10px"}}>
      <Dropdown 
        id="product-list-dropdown"
        options={productList}
        optionLabel="prodName"
        optionValue="prodNick"
        value={productToAdd?.prodNick}
        filter
        onChange={e => setProductToAdd(productList.find(item => item.prodNick === e.value))}
        style={{width: "100%", marginBottom: "10px"}}
      />

      <Button label="Add Product" 
        onClick={e => {
          handleAddProduct()
          setSelectedProduct({prodNick: productToAdd.prodNick, prodName: productToAdd.prodName})
        }}
        disabled={!productToAdd}
      />
    </div>
  )
}

