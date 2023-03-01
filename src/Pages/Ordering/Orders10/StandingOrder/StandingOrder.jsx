import React, { useEffect, useMemo, useState } from "react"

import { Button } from "primereact/button"
import { SelectButton } from "primereact/selectbutton"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Sidebar } from "primereact/sidebar"
import { Dropdown } from "primereact/dropdown"
import { InputNumber } from "primereact/inputnumber"
import { ListBox } from "primereact/listbox"

import { createStanding, deleteStanding, updateStanding, useStandingByLocation } from "../../../../data/standingData"
import { createOrder, fetchTransitionOrders } from "../../../../data/orderData"
import { useLocationDetails } from "../../../../data/locationData"
import { useProductDataWithLocationCustomization } from "../../../../data/productData"

import { mutate } from "swr"


import dynamicSort from "../../../../functions/dynamicSort"
import { getTransitionDates, getTtl, getWeekday, getWorkingDate, getWorkingDateJS, getWorkingDateTime } from "../../../../functions/dateAndTime"
import { listOrdersByLocationByDate } from "../../../../customGraphQL/queries/orderQueries"
import { APIGatewayFetcher } from "../../../../data/fetchers"

const standOptions = [
  {label: "Standing", value: true},
  {label: "Holding", value: false}
]
const wholeOptions = [
  {label: "Wholesale", value: true},
  {label: "Retail", value: false, disabled: true}
]
const viewOptions = [
  {label: 'By Day', value: 'DAY'},
  {label: 'By Product', value: 'PRODUCT'}
]
const weekdayOptions = [
  {label: "Sunday", value: "Sun"},
  {label: "Monday", value: "Mon"},
  {label: "Tuesday", value: "Tue"},
  {label: "Wednesday", value: "Wed"},
  {label: "Thursday", value: "Thu"},
  {label: "Friday", value: "Fri"},
  {label: "Saturday", value: "Sat"},
]



export const StandingOrder = ({ user, locNick }) => {
  // standing::admin state
  const [isStand, setIsStand] = useState(true)
  const [isWhole, setIsWhole] = useState(true)
  
  // standing::public state
  const [viewMode, setViewMode] = useState('DAY')
  const [dayOfWeek, setDayOfWeek] = useState(getWeekday(getWorkingDateJS('NOW')))

  const { data:productData } = useProductDataWithLocationCustomization(locNick)
  const [product, setProduct] = useState(null)
  const [showAddItem, setShowAddItem] = useState(false)
  
  const { data:locationDetails } = useLocationDetails(locNick, !!locNick)
  const { data:standingData, mutate:mutateStanding } = useStandingByLocation(locNick, !!locNick)

  const [standingBase, setStandingBase] = useState(null)
  const [standingChanges, setStandingChanges] = useState(null)

  useEffect(() => {
    if (!!standingData && !!productData) {
      const baseItems = makeStandingBase(standingData, productData, locNick)

      setStandingBase(JSON.parse(JSON.stringify(baseItems)))
      setStandingChanges(JSON.parse(JSON.stringify(baseItems)))
      //console.log(baseItems)
    }
  }, [standingData, productData, locNick])

  const makeProductOptions = () => {
    if (!standingChanges) return []
    return standingChanges
      .filter(item => item.isStand === isStand && item.isWhole === isWhole)
      .reduce((acc, curr) => {
        let matchIndex = acc.findIndex(item =>
          item.prodNick === curr.product.prodNick
        )
        if (matchIndex === -1) {
          acc.push(curr.product)
        }
        return acc
      }, [])
      .sort(dynamicSort('prodName'))
      
  }
  const productOptions = useMemo(makeProductOptions, [standingChanges, isStand, isWhole])

  const tableData = makeTableData(standingChanges, viewMode, dayOfWeek, product, isStand, isWhole)

  //console.log(tableData)
  return(
    <div>
      <h1 style={{padding: ".5rem"}}>Standing Order</h1>
      {user.authClass === 'bpbfull' &&
        <div style={{margin: ".5rem", padding: ".5rem", border: "1px solid", borderRadius: "3px", backgroundColor: "#ffc466", borderColor: "hsl(37, 67%, 60%)"}}>
          <h2>Admin Settings</h2>
          <div style={{display: "flex", gap: "2rem"}}>
            <div style={{padding: ".5rem", flex: "50%"}}>
              <ListBox 
                options={standOptions}
                value={isStand}
                onChange={e => {if (e.value !== null) setIsStand(e.value)}}
              />
            </div>
            <div style={{padding: ".5rem", flex: "50%"}}>
              <ListBox 
                options={wholeOptions}
                value={isWhole}
                onChange={e => {if (e.value !== null) setIsWhole(e.value)}}
              />
            </div>
          </div>
        </div>
      }

      <div style={{padding: ".5rem"}}>
        <SelectButton
          value={viewMode}
          onChange={e => {
            if (e.value !== null) setViewMode(e.value)
            if (product === null && e.value === 'PRODUCT' && productOptions.length) {
              // setProdNick(productOptions[0].prodNick)
              setProduct(productOptions[0])
            }
          }}
          options={viewOptions}
        />
      </div>

      <div style={{padding: ".5rem"}}>
        {viewMode === 'DAY' &&
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <div className="p-fluid" style={{flex: "0 0 9rem"}}>
              <Dropdown 
                options={weekdayOptions}
                value={dayOfWeek}
                onChange={e => setDayOfWeek(e.value)}
              />
            </div>
            <div style={{display: "flex", flex: "100%", justifyContent: "right", gap: "2rem"}}>
              <div style={{flex: "0 0 4rem"}}>
                <Button icon="pi pi-chevron-left"
                  style={{width: "4rem"}}
                  onClick={() => {
                    let matchIdx = weekdayOptions.findIndex(item =>
                      item.value === dayOfWeek
                    )
                    setDayOfWeek(weekdayOptions[(matchIdx - 1 + 7) % 7].value)
                  }}
                />
              </div>
              <div style={{flex: "0 0 4rem"}}>
                <Button icon="pi pi-chevron-right"
                  style={{width: "4rem"}}
                  onClick={() => {
                    let matchIdx = weekdayOptions.findIndex(item =>
                      item.value === dayOfWeek
                    )
                    setDayOfWeek(weekdayOptions[(matchIdx + 1) % 7].value)
                  }}
                />
              </div>
            </div>
          </div>
        }
        {viewMode === 'PRODUCT' &&
          <div className="p-fluid">
            <Dropdown
              options={productOptions}
              optionLabel="prodName"
              optionValue="prodNick"
              value={product?.prodNick}
              onChange={(e) => {
                // setProdNick(e.value)
                setProduct(productOptions.find(i => i.prodNick === e.value))
              }}
            />
          </div>
        }
      </div>

      <div style={{margin: ".5rem"}}>
        <DataTable 
          value={tableData}
          responsiveLayout
          showGridlines
        >
          <Column header={viewMode === 'DAY' ? "Product" : "Weekday"}
            field={viewMode === 'DAY' 
              ? "product.prodName" 
              : "dayOfWeek"}
            />
          <Column 
            header={() => <Button label="Add" onClick={() => setShowAddItem(true)}/>}
            style={{width: "80px"}}
            field="qty" 
            body={rowData => {
              return(
                <div className="p-fluid">
                  <CustomInputNumber 
                    rowData={rowData}
                    standingBase={standingBase}
                    standingChanges={standingChanges}
                    setStandingChanges={setStandingChanges}
                  />
                </div>
              )
            }}  
          />
        </DataTable>
      </div>

      <div style={{padding: ".5rem"}}>
        <Button label="Submit Changes (Warning: mutates prod database!)" 
          className="p-button-lg" 
          onClick={() => handleSubmit(locNick, isWhole, isStand, standingBase, standingChanges, mutateStanding, user.name, locationDetails, productData)}
        />
      </div>

      <AddItemSidebar
        showAddItem={showAddItem}
        setShowAddItem={setShowAddItem}
        locNick={locNick}
        standingChanges={standingChanges}
        setStandingChanges={setStandingChanges}
        productData={productData}
        setProduct={setProduct}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isStand={isStand}
        isWhole={isWhole}
        user={user}
      />


      {/* <pre>{JSON.stringify(isStand)}</pre> */}
      {/* <pre>{JSON.stringify(isWhole)}</pre> */}
      {/* <pre>{JSON.stringify(viewMode)}</pre> */}
      {/* <pre>{JSON.stringify(dayOfWeek)}</pre> */}
      {/* <pre>{JSON.stringify(productOptions, null, 2)}</pre> */}

    </div>
  )

}


/**
 * Transforms standingChanges for DataTable presentation.
 * 
 * Filters down to the selected isStand/isWhole category.
 * 
 * For 'PRODUCT' and 'DAY' view, data is just filtered to the
 * applicable product or weekday, respectively.
 */
const makeTableData = (standingChanges, viewMode, dayOfWeek, product, isStand, isWhole) => {
  if (!standingChanges || (viewMode === 'PRODUCT' && !product)) return []
  
  let tableData = standingChanges
    .filter(item => item.isStand === isStand && item.isWhole === isWhole)

  if (viewMode === 'DAY') {
    tableData = tableData
      .filter(item => item.dayOfWeek === dayOfWeek)
  }

  else if (viewMode === 'PRODUCT') {
    tableData = tableData
      .filter(item => item.product.prodNick === product.prodNick)
  }

  return tableData
}

/** 
 * Fills in missing cells of the standing grid(s) and 
 * sorts data by prodName and by weekday.
 * 
 * We're now front-loading the data processing more,
 * leaving the more frequent update routines lighter.
 */
const makeStandingBase = (standingData, productData, locNick) => {

  const categories = [
    { isStand: true, isWhole: true },
    { isStand: true, isWhole: false },
    { isStand: false, isWhole: true },
    { isStand: false, isWhole: false },
  ]
  const weekdays = weekdayOptions.map(i => i.value)

  let placeholders = []
  
  for (let cat of categories) {

    let catItems = standingData.filter(i => i.isStand === cat.isStand && i.isWhole === cat.isWhole)
    let catProducts = catItems.reduce((acc, curr) => {
      if (acc.findIndex(item => item.prodNick === curr.product.prodNick) === -1) {
        acc.push(curr.product)
      }
      return acc
    }, [])

    for (let p of catProducts) {
      // productData has location-specific overrides applied to prices/leadtime.
      // Use values from productData if possible; fall-back to default values fetched
      // with standing data otherwise. There's probably a better place to apply overrides
      // than here...
      let pLoc = productData.find(item => item.prodNick === p.prodNick)

      for (let day of weekdays) {
        if (catItems.findIndex(i => i.product.prodNick === p.prodNick && i.dayOfWeek === day) === -1) {
          let newItem = {
            locNick: locNick,
            isStand: cat.isStand,
            isWhole: cat.isWhole,
            route: 'deliv',
            ItemNote: null,
            dayOfWeek: day,
            qty: 0,
            startDate: null, // assign value on submit
            updatedBy: null, // assign value on submit
            product: {
              prodNick: p.prodNick,
              prodName: p.prodName,
              retailPrice: pLoc ? pLoc.retailPrice : p.retailPrice,
              wholePrice: pLoc ? pLoc.wholePrice : p.wholePrice,
              leadTime: pLoc ? pLoc.leadTime : p.leadTime
            }
          }
          placeholders.push(newItem)

        }
      }
    }
  }

  //console.log("placeholders", placeholders)
  const baseItems = standingData.concat(placeholders)

  baseItems.sort((a, b) => {
    let _a = weekdayOptions.findIndex(i => i.value === a.dayOfWeek)
    let _b = weekdayOptions.findIndex(i => i.value === b.dayOfWeek)
    return _a - _b
  })

  baseItems.sort((a, b) => {
    if (a.product.prodName < b.product.prodName) return -1
    if (a.product.prodName > b.product.prodName) return 1
    return 0
  })

  //console.log("baseItems", baseItems)

  return baseItems

}

const AddItemSidebar = ({showAddItem, setShowAddItem, locNick, standingChanges, setStandingChanges, productData, setProduct, viewMode, setViewMode, isStand, isWhole, user}) => {
  const [selectedProdNick, setSelectedProdNick] = useState(null)

  const handleAddItem = () => {
    let inCart = standingChanges.findIndex(i => i.product.prodNick === selectedProdNick) > -1

    if (inCart) {
      //console.log("in Cart")
      setShowAddItem(false)
      setSelectedProdNick(null)
      return
    }

    const weekdays = weekdayOptions.map(i => i.value)
    const prod = productData.find(i => i.prodNick === selectedProdNick)

    const placeholders = weekdays.map(day => {
      let newItem = {
        locNick: locNick,
        isStand: isStand,
        isWhole: isWhole,
        route: 'deliv',
        ItemNote: null,
        dayOfWeek: day,
        qty: 0,
        startDate: null, // assign value on submit
        updatedBy: null, // assign value on submit
        product: {
          prodNick: prod.prodNick,
          prodName: prod.prodName,
          leadTime: prod.leadTime,
          retailPrice: prod.retailPrice,
          wholePrice: prod.wholePrice
        }
      }

      return newItem
    })

    console.log(placeholders)
    const newData = [...standingChanges].concat(placeholders)
    
    newData.sort((a, b) => {
        let _a = weekdayOptions.findIndex(i => i.value === a.dayOfWeek)
        let _b = weekdayOptions.findIndex(i => i.value === b.dayOfWeek)
        return _a - _b
      })
    newData.sort((a, b) => {
      if (a.product.prodName < b.product.prodName) return -1
      if (a.product.prodName > b.product.prodName) return 1
      return 0
      })

    setStandingChanges(newData)

    if (viewMode === 'PRODUCT') setProduct({
      prodNick: prod.prodNick,
      prodName: prod.prodName,
      leadTime: prod.leadTime,
      retailPrice: prod.retailPrice,
      wholePrice: prod.wholePrice
    })
    setSelectedProdNick(null)
    setShowAddItem(false)

  }

  return (
    <Sidebar
      //className="p-sidebar-lg"
      style={{height: "225px"}}
      visible={showAddItem}
      position="top"
      blockScroll={true}
      icons={() => <div>Add a product</div>}
      onHide={() => {
        setShowAddItem(false)
        setSelectedProdNick(null)
      }}
    >
      <span className="p-float-label p-fluid" style={{marginTop: "25px"}}>
        <Dropdown 
          id="productDropdown"
          value={selectedProdNick}
          options={productData || []}
          disabled={!productData}
          onChange={e => setSelectedProdNick(e.value)}
          optionLabel="prodName"
          optionValue="prodNick"
          filter 
          showClear 
          filterBy={`prodName${user.locNick === 'backporch' ? ",prodNick" : ""}`}
          scrollHeight="350px"
          //itemTemplate={dropdownItemTemplate}
        />
        <label htmlFor="productDropdown">{productData ? "Select Product" : "Loading..."}</label>
      </span>

      <Button label="Add Item"
        style={{flex: "35%", marginTop: "28px"}}
        onClick={handleAddItem}
        disabled={!productData || !selectedProdNick}
      />
    </Sidebar>

  )

}


// filter base/change items to category
// detect which action is to be taken,
// associate these directives with each submisison candidate

const handleSubmit = async (locNick, isWhole, isStand, standingBase, standingChanges, mutateStanding, userName, locationDetails, productData) => {

  // Submission only handles the current category 
  // of standing order (according to isStand, isWhole values).
  const baseItems = standingBase.filter(item => (item.isWhole === isWhole && item.isStand === isStand))
  const submissionCandidates = standingChanges.filter(item => (item.isWhole === isWhole && item.isStand === isStand))

  // Submit items are standing items that have a change requiring
  // some database action ('CREATE', 'UPDATE', or 'DELETE'/'DELETE_NO_OVERRIDE')
  const submitItems = getSubmitItems(baseItems, submissionCandidates, userName)
  
  if (!submitItems.length) return

  // *******************************
  // * DETERMINE CART PLACEHOLDERS *
  // *******************************

  // For standing/wholesale and standing/retail order items
  // being submitted, we may need to create "placeholder"
  // cart items during the transition period (T+0 to T+3)
  // to preserve the state of those orders.  
  //
  // If the existing cart orders have custom header values 
  // (i.e. route or ItemNote), we want to use those values 
  // for the placeholder items, or fall back to defaults.

  const _cartOrders = await fetchTransitionOrders(locNick)
  const cartOrders = _cartOrders.filter(item => item.isWhole === isWhole)
  const cartHeaders = getCartHeaders(cartOrders, locationDetails)

  // console.log(transitionDates)
  // console.log("cart headers", cartHeaders)

  let placeholderCandidates = submitItems.filter(item =>
    item.isStand === true
    && (item.action === 'CREATE' || item.action === 'UPDATE' || item.action === 'DELETE')
  )

  let cartPlaceHolderItems = []

  for (let header of cartHeaders) {

    let placeholderCandidatesByDate = placeholderCandidates.filter(item =>
      item.dayOfWeek === header.dayOfWeek
    )

    for (let subItem of placeholderCandidatesByDate) {
      let cartMatchItem = cartOrders.find(cartItem =>
        cartItem.prodNick === subItem.product.prodNick
        && cartItem.delivDate === header.delivDateISO  
      )

      if (!cartMatchItem) {
        let standingBaseItem = baseItems.find(b => 
          b.product.prodNick === subItem.product.prodNick
          && b.dayOfWeek === subItem.dayOfWeek  
        )
        let placeholderQty = subItem.action === 'CREATE' ? 0 : standingBaseItem.qty

        let placeholderItem = {
          locNick: locNick,
          isWhole: subItem.isWhole,
          route: header.route,
          delivDate: header.delivDateISO,
          prodNick: subItem.product.prodNick,
          qty: placeholderQty,
          qtyUpdatedOn: new Date().toISOString(),
          sameDayMaxQty: placeholderQty,
          rate: subItem.isWhole ? subItem.product.wholePrice : subItem.product.retailPrice,
          ItemNote: header.ItemNote,
          isLate: 0,
          updatedBy: 'standing_order',
          ttl: header.ttl
        }

        cartPlaceHolderItems.push(placeholderItem)
      }
    }
  }
  
  // **************************************
  // * SUBMIT CART PLACEHOLDERS TO LEGACY *
  // **************************************
  console.log("Cart placeholders:", cartPlaceHolderItems)
  
  const legacyCartSubmitBody = cartHeaders.map(header => {
    const dateParts = header.delivDateISO.split('-')
    const mmddyyyyDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`

    const headerByDate = {
      isWhole: isWhole,
      custName: locationDetails.locName,
      delivDate: mmddyyyyDate,
      route: header.route,
      PONote: header.ItemNote,
    }
    const itemsByDate = cartPlaceHolderItems.filter(item => 
      item.delivDate === header.delivDateISO
    ).map(item => ({
      prodName: productData.find(p => p.prodNick === item.prodNick).prodName,
      qty: item.qty,
      rate: item.rate
    }))

    return ({
      header: headerByDate,
      items: itemsByDate
    })

  }).filter(order => order.items.length > 0)

  console.log("Submitting cart placeholders to legacy system:", legacyCartSubmitBody)
  let legacyCartResponse
  if (legacyCartSubmitBody.length) {
    legacyCartResponse = await APIGatewayFetcher('/orders/submitLegacyCart', {body: legacyCartSubmitBody})
    console.log("Legacy cart response:", legacyCartResponse)
  }

  // *****************************
  // * SUBMIT STANDING TO LEGACY *
  // *****************************
  
  // The new system attempts to handle more features by handling
  // different categories of standing order simultaneously.
  // To prevent unexpected behavior in the old system we will only
  // make changes to the legacy system when submitting 
  // standing/wholesale type orders

  // Although code execution gets terminated earlier if there are
  // no submitItems, we will take this chance to assert the full
  // standing order from the new system onto the old system, 
  console.log("Submit for new system: ", submitItems)

  let legacyStandingResponse
  if (isStand === true && isWhole === true) {
    const legacyStandingSubmitBody = getLegacyStandingSubmitBody(submitItems, locationDetails, productData, submissionCandidates, isStand)
    console.log("Submit for legacy system:", legacyStandingSubmitBody)

    legacyStandingResponse = await APIGatewayFetcher('/orders/submitLegacyStanding', {body: legacyStandingSubmitBody})
    console.log("Legacy standing response:", legacyStandingResponse)
  }

  // ***********************
  // * SUBMIT PLACEHOLDERS *
  // ***********************

  
  for (let placeholder of cartPlaceHolderItems) {
    console.log("creating cart placeholder:")
    createOrder(placeholder)
  }
  
  // ***************************
  // * SUBMIT STANDING CHANGES *
  // ***************************

  for (let subItem of submitItems) {
    let { action, ...item } = subItem
    //console.log(action, item)
    if (action === "CREATE") {
      const { product, ..._createItem} = item
      const createItem = {
        ..._createItem,
        prodNick: product.prodNick
      }

      createStanding(createItem)

    }
    if (action === "UPDATE") {
      const updateItem = {
        id: subItem.id,
        qty: subItem.qty,
        startDate: subItem.startDate,
        updatedBy: subItem.updatedBy
      }
      updateStanding(updateItem)
    }
    if (action === "DELETE" || action === "DELETE_NO_OVERRIDE") {
      const deleteItem = {
        id: subItem.id
      }
      deleteStanding(deleteItem)
    }
  }

  // revailidate SWR data

  if (cartPlaceHolderItems.length) {
    for (let header of cartHeaders) {
      let variables = {
        locNick: locNick,
        delivDate: header.delivDateISO
      }
      let key = [listOrdersByLocationByDate, variables]
      mutate(key, undefined, {revalidate: true})
    }
  }
  mutateStanding()

}

/**
 * Checks all submission items and returns those that require
 * a database action. The action type is attached to each item
 * under the 'action' attribute. Also fills in startDate and
 * updatedBy values to prep items for submission.
 */
const getSubmitItems = (baseItems, submissionCandidates, userName) => {
  for (let subItem of submissionCandidates) {
    let baseItem = baseItems.find(b => 
      b.product.prodNick === subItem.product.prodNick 
      && b.dayOfWeek === subItem.dayOfWeek
    )
  
    let action = decideAction(baseItem, subItem)
    subItem.action = action
  }
  
  const submitItems = submissionCandidates
    .filter(item => item.action !== 'NONE')
    .map(item => ({
      ...item,
      startDate: getWorkingDateTime('NOW').plus({ days: 4}).toISODate(),
      updatedBy: userName
    }))

  return submitItems

}

/**
 * Compares submission item values to its original values
 * from the database (if the database entry exists).
 * Returns a string indicating whether a database action
 * is required, and if so indicates which kind.
 */
const decideAction = (baseItem, subItem) => {
  let action = 'NONE'

  if (subItem.hasOwnProperty('id')) {
    if (subItem.qty === 0 && baseItem.qty === 0) action = 'DELETE_NO_OVERRIDE' // mostly for catching 0 qty items from remap
    else if (subItem.qty === 0) action = 'DELETE'
    else if (subItem.qty !== baseItem.qty) action = 'UPDATE'
  } else {
    if (subItem.qty > 0) action = 'CREATE'
  }

  return action
}

/**
 * Returns an array of cart header objects, each representing
 * the header for a different transition date (T+0 to T+3). 
 */
const getCartHeaders = (cartOrders, locationDetails) => {
  const transitionDates = getTransitionDates('UTCString')
  //console.log(locationDetails)
  console.log("reading cart orders for transition dates: ", cartOrders)
  const defaultRoute = (locationDetails.zoneNick === 'atownpick' || locationDetails.zoneNick === 'slopick')
    ? locationDetails.zoneNick
    : 'deliv'

  // array of header-value objects for each transition delivery date.
  // if cart order doesn't exist for a given date, fall back to default values
  const cartHeaders = transitionDates.map(utcDate => {
    let header = {
      delivDateISO: utcDate.split('T')[0],
      dayOfWeek: getWeekday(new Date(utcDate)),
      ttl: getTtl(new Date(utcDate)),
      route: defaultRoute,
      ItemNote: ''
    }

    let ordersByDate = cartOrders.filter(order => 
      order.delivDate === header.delivDateISO
    )
    if (ordersByDate.length) { 
      header.route = ordersByDate[0].route
      header.ItemNote = ordersByDate[0].ItemNote || ''
    }

    return header
  })

  return cartHeaders

}



const CustomInputNumber = ({ rowData, standingBase, standingChanges, setStandingChanges }) => {
  const baseItem = standingBase.find(i =>
    i.product.prodNick === rowData.product.prodNick
    && i.dayOfWeek === rowData.dayOfWeek  
    && i.isWhole === rowData.isWhole
    && i.isStand === rowData.isStand
  )

  const qtyChanged = (baseItem && baseItem.qty !== rowData.qty) || (!baseItem && rowData.qty > 0)
  
  const matchIndex = standingChanges.findIndex(i =>
    i.product.prodNick === rowData.product.prodNick
    && i.dayOfWeek === rowData.dayOfWeek  
    && i.isWhole === rowData.isWhole
    && i.isStand === rowData.isStand
  )
  
  const updateQty = (value) => {    
    let newQty = value >= 999 ? 999 : value

    //console.log(e, e.value, typeof(e.value), newQty)
    if (matchIndex > -1) {
      let _update = [...standingChanges]
      let _updateItem = {
        ..._update[matchIndex],
        qty: newQty
      }
      _update[matchIndex] = _updateItem
      setStandingChanges(_update)
      console.log("new qty", rowData.qty)

    } else {
      console.log("error: standing data could not be updated.")
    }
  }

  // useEffect(() => {
  //   if (qtyRef.current.value > 999) updateQty(999)
  // }, [qtyRef, updateQty])

  return (
    <InputNumber
      value={rowData.qty}
      min={0}
      max={999}
      inputStyle={{fontWeight: qtyChanged ? "bold" : "normal"}}
      onClick={() => console.log(rowData)}
      onFocus={e => e.target.select()}
      // onKeyDown={e => console.log(e)}
      onChange={e => {updateQty(e.value); console.log(e)}}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.target.blur();
          if (e.target.value === "") updateQty(0);
        }
      }}
      onBlur={() => {
        if (rowData.qty === null) {
          updateQty(0)
        }
      }}
    />
  )

}


//need to add itemChanges to arguments so that we can copy that info into qties.
const getLegacyStandingSubmitBody = (submitItems, locationDetails, productData, submissionCandidates, isStand) => {
  
  const prodNicks = [...new Set(submitItems.map(i => i.product.prodNick))]

  const standingHeader = {
    custName: locationDetails.locName,
    isStand: isStand
  }
  
  const standingItems = prodNicks.map(pn => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const qtys = Object.fromEntries(
      weekdays.map(day => 
        [
          day, 
          submissionCandidates.find(item => 
            item.product.prodNick === pn && item.dayOfWeek === day
          )?.qty || 0
        ]
      )
    )

    return ({
      prodName: (productData.find(item => item.prodNick === pn)).prodName,
      ...qtys
    })
  })
  
  return ({
    header: standingHeader,
    items: standingItems
  })
}


// legacy standing item shape

// id: auto uuid
// __typename: str = "Standing"
// custName: str
// isStand: boolean
// prodName: str
// Sun: int
// Mon: int
// Tue: int
// Wed: int
// Thu: int
// Fri: int 
// Sat: int
// timeStamp: AWSDateTime
// createdAt: AWSDateTime
// updatedAt: AWSDateTime