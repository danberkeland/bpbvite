import React, { useEffect, useMemo, useState } from "react"

import { Button } from "primereact/button"
import { SelectButton } from "primereact/selectbutton"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Sidebar } from "primereact/sidebar"
import { Dropdown } from "primereact/dropdown"
import { InputNumber } from "primereact/inputnumber"

import { createStanding, deleteStanding, updateStanding, useStandingByLocation } from "../../../../data/standingData"
import { createOrder, fetchTransitionOrders } from "../../../../data/orderData"
import { useLocationDetails } from "../../../../data/locationData"
import { useProductDataWithLocationCustomization } from "../../../../data/productData"

import dynamicSort from "../../../../functions/dynamicSort"
import { getTransitionDates, getTtl, getWeekday, getWorkingDate, getWorkingDateTime } from "../../../../functions/dateAndTime"

const standOptions = [
  {label: "Standing", value: true},
  {label: "Holding", value: false}
]
const wholeOptions = [
  {label: "Wholesale", value: true},
  {label: "Retail", value: false}
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
  const [dayOfWeek, setDayOfWeek] = useState(getWeekday(new Date(getWorkingDate('NOW'))))
  const [prodNick, setProdNick] = useState(null)
  const [product, setProduct] = useState(null)
  const [showAddItem, setShowAddItem] = useState(false)
  
  const { data:locationDetails } = useLocationDetails(locNick, !!locNick)
  const { data:standingData, mutate:mutateStanding } = useStandingByLocation(locNick, !!locNick)

  const [standingBase, setStandingBase] = useState(null)
  const [standingChanges, setStandingChanges] = useState(null)

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

  useEffect(() => {
    if (!!standingData) {
      const baseItems = makeStandingBase(standingData, locNick)

      setStandingBase(JSON.parse(JSON.stringify(baseItems)))
      setStandingChanges(JSON.parse(JSON.stringify(baseItems)))
    }
  }, [standingData, locNick])

  const tableData = makeTableData(standingChanges, viewMode, dayOfWeek, product, isStand, isWhole)

  //console.log(tableData)
  return(
    <div>
      {user.authClass === 'bpbfull' &&
        <div style={{display: "flex", justifyContent:"space-between"}}>
          <div style={{padding: ".5rem"}}>
            <SelectButton 
              value={isStand} 
              onChange={(e) => {if (e.value !== null) setIsStand(e.value)}} 
              options={standOptions}
            />
          </div>
          <div style={{padding: ".5rem"}}>
            <SelectButton 
              value={isWhole} 
              onChange={(e) => {if (e.value !== null) setIsWhole(e.value)}} 
              options={wholeOptions}
            />
          </div>
        </div>
      }

      <div style={{margin: ".5rem"}}>
        <SelectButton
          value={viewMode}
          onChange={e => {
            if (e.value !== null) setViewMode(e.value)
            if (prodNick === null && e.value === 'PRODUCT' && productOptions.length) {
              setProdNick(productOptions[0].prodNick)
              setProduct(productOptions[0])
            }
          }}
          options={viewOptions}
        />
      </div>

      <div style={{padding: ".5rem"}}>
        {viewMode === 'DAY' &&
          <div className="p-fluid">
            <Dropdown 
              options={weekdayOptions}
              value={dayOfWeek}
              onChange={e => setDayOfWeek(e.value)}
            />
          </div>
        }
        {viewMode === 'PRODUCT' &&
          <div className="p-fluid">
            <Dropdown
              options={productOptions}
              optionLabel="prodName"
              optionValue="prodNick"
              value={prodNick}
              onChange={(e) => {
                setProdNick(e.value)
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
                    standingChanges={standingChanges}
                    setStandingChanges={setStandingChanges}
                  />
                </div>
              )
            }}  
          />
        </DataTable>
      </div>

      <Button label="Submit Changes" 
        onClick={() => handleSubmit(locNick, isWhole, isStand, standingBase, standingChanges, mutateStanding, user.name, locationDetails)}
      />

      <AddItemSidebar
        showAddItem={showAddItem}
        setShowAddItem={setShowAddItem}
        locNick={locNick}
        standingChanges={standingChanges}
        setStandingChanges={setStandingChanges}
        isStand={isStand}
        isWhole={isWhole}
      />


      <pre>{JSON.stringify(isStand)}</pre>
      <pre>{JSON.stringify(isWhole)}</pre>
      <pre>{JSON.stringify(viewMode)}</pre>
      <pre>{JSON.stringify(dayOfWeek)}</pre>
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
const makeStandingBase = (standingData, locNick) => {

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
              prodName: p.prodName
            }
          }
          placeholders.push(newItem)

        }
      }
    }
  }

  console.log("placeholders", placeholders)

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



const AddItemSidebar = ({showAddItem, setShowAddItem, locNick, standingChanges, setStandingChanges, isStand, isWhole, userName, locationDetails}) => {
  const { data:productData } = useProductDataWithLocationCustomization(locNick)

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
      onHide={() => {
        setShowAddItem(false)
        setSelectedProdNick(null)
      }}
    >
      <span className="p-float-label p-fluid" style={{marginTop: "25px"}}>
        <Dropdown 
          id="productDropdown"
          value={selectedProdNick}
          options={productData}
          onChange={e => setSelectedProdNick(e.value)}
          optionLabel="prodName"
          optionValue="prodNick"
          filter 
          showClear 
          filterBy="prodName" 
          scrollHeight="350px"
          //itemTemplate={dropdownItemTemplate}
        />
        <label htmlFor="productDropdown">{productData ? "Select Product" : "Loading..."}</label>
      </span>

      <Button label="Add Item"
        style={{flex: "35%", marginTop: "28px"}}
        onClick={handleAddItem}
      />
    </Sidebar>

  )

}


// filter base/change items to category
// detect which action is to be taken,
// associate these directives with each submisison candidate

const handleSubmit = async (locNick, isWhole, isStand, standingBase, standingChanges, mutateStanding, userName, locationDetails) => {

  // submission only handles the current category 
  // of standing order (according to isStand, isWhole).
  const baseItems = standingBase.filter(item => (item.isWhole === isWhole && item.isStand === isStand))
  const submissionCandidates = standingChanges.filter(item => (item.isWhole === isWhole && item.isStand === isStand))

  // submit items are standing items that have a change 
  // requiring database action ('CREATE', 'UPDATE', or 'DELETE')
  const submitItems = getSubmitItems(baseItems, submissionCandidates, userName)
  
  if (!submitItems.length) return


  // Create cart placeholders over transition period.

  // If the existing cart orders have custom header values 
  // (i.e. route or ItemNote), we want to use those values 
  // for the placeholder items, or fall back to defaults.
  
  const _cartOrders = await fetchTransitionOrders(locNick)
  const cartOrders = _cartOrders.filter(item => item.isWhole === isWhole)
  const cartHeaders = getCartHeaders(cartOrders, locationDetails)

  // console.log(transitionDates)
  // console.log(cartHeaders)

  let cartPlaceHolderItems = []

  // for each transition date, see if there are any submitItems that
  // apply to that date. Cart headers can hold date/weekday info.
  //
  // If submit items exist, see if there is already a cart order for that product.
  // If there is no cart order, create a placeholder containing...
  //    a zero qty item if the standing item was just created, otherwise
  //    an item with the previous standing order's qty 

  //console.log("cart headers", cartHeaders)

  for (let header of cartHeaders) {
    let submitItemsByDate = submitItems.filter(item =>
      item.dayOfWeek === header.dayOfWeek
    )

    for (let subItem of submitItemsByDate) {
      let cartMatchItem = cartOrders.find(cartItem =>
        cartItem.prodNick === subItem.product.prodNick
        && cartItem.delivDate === header.delivDateISO  
      )

      let standingBaseItem = baseItems.find(b => 
        b.product.prodNick === subItem.product.prodNick
        && b.dayOfWeek === subItem.dayOfWeek  
      )
      let placeholderQty = subItem.action === 'CREATE' ? 0 : standingBaseItem.qty

      if (!cartMatchItem) {
        let placeholderItem = {
          locNick: locNick,
          isWhole: subItem.isWhole,
          route: header.route,
          delivDate: header.delivDateISO,
          prodNick: subItem.product.prodNick,
          qty: placeholderQty,
          qtyUpdatedOn: new Date().toISOString(),
          sameDayMaxQty: placeholderQty,
          rate: subItem.product.wholePrice,
          ItemNote: header.ItemNote,
          isLate: 0,
          updatedBy: 'standing_order',
          ttl: header.ttl
        }

        cartPlaceHolderItems.push(placeholderItem)
      }
    }
  }

  // console.log("Submit Items: ", submitItems)
  // console.log("Cart placeholders:", cartPlaceHolderItems)

  for (let subItem of submitItems) {
    let { action, ...item } = subItem
    console.log(action, item)
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
    if (action === "DELETE") {
      const deleteItem = {
        id: subItem.id
      }
      deleteStanding(deleteItem)
    }
  }

  for (let placeholder of cartPlaceHolderItems) {
    console.log(placeholder)
    createOrder(placeholder)
  }

  mutateStanding()

}

/**
 * Checks all submission items and returns those that require
 * a database action. The action type is attached to each item
 * with the 'action' attribute. Also fills in startDate and
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
    if (subItem.qty === 0) action = 'DELETE'
    else if (subItem.qty !== baseItem.qty) action = 'UPDATE'
  } else {
    if (subItem.qty > 0) action = 'CREATE'
  }

  return action
}

/**
 * Returns an array of cart header object, each representing
 * the header for a different transition date (T+0 to T+3). 
 */
const getCartHeaders = (cartOrders, locationDetails) => {
  const transitionDates = getTransitionDates('UTCString')
  const defaultRoute = (locationDetails.zone !== 'atownpick' || locationDetails.zone !== 'slopick')
    ? 'deliv'
    : locationDetails.zone

  // array of header-value objects for each transition delivery date.
  // if cart order doesn't exist for a given date, fall back to default values
  const cartHeaders = transitionDates.map(utcDate => {
    let header = {
      delivDateISO: utcDate.split('T')[0],
      dayOfWeek: getWeekday(new Date(utcDate)),
      ttl: getTtl(new Date(utcDate)),
      route: '',
      ItemNote: ''
    }
    
    let ordersByDate = cartOrders.filter(order => 
      order.delivDate === utcDate.delivDateISO
    )


    if (ordersByDate.length) { 
      header.route = ordersByDate[0].route
      header.ItemNote = ordersByDate[0].ItemNote
    } else {
      header.route = defaultRoute
      header.ItemNote = null 
    }

    return header
  })

  return cartHeaders

}



const CustomInputNumber = ({ rowData, standingChanges, setStandingChanges }) => {
  
  const matchIndex = standingChanges.findIndex(i =>
    i.product.prodNick === rowData.product.prodNick
    && i.dayOfWeek === rowData.dayOfWeek  
    && i.isWhole === rowData.isWhole
    && i.isStand === rowData.isStand
  )
    

  return (
    <InputNumber
      value={rowData.qty}
      min={0}
      max={999}
      //onClick={() => console.log(rowData)}
      onKeyDown={e =>
        console.log(e)
      }
      onChange={e => {    
        let newQty = e.value >= 999 ? 999 : e.value
    
        //console.log(e, e.value, typeof(e.value), newQty)
        if (matchIndex > -1) {
          let _update = [...standingChanges]
          let _updateItem = {
            ..._update[matchIndex],
            qty: newQty
          }
          _update[matchIndex] = _updateItem
          setStandingChanges(_update)

        } else {
          console.log("error: standing data could not be updated.")
        }
      }}
    />
  )

}