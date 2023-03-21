import React, { useState } from "react"

import { Button } from "primereact/button"
import { Dropdown } from "primereact/dropdown"
import { Sidebar } from "primereact/sidebar"
import { InputNumber } from "primereact/inputnumber"

import { useProductDataWithLocationCustomization } from "../../../../../data/productData"

import { getWeekday, getWorkingDate, getWorkingDateTime } from "../../../../../functions/dateAndTime"
//import dynamicSort from "../../../../../functions/dynamicSort"
import { DateTime } from "luxon"

import gqlFetcher from "../../../../../data/fetchers"
import { createTemplateProd, deleteTemplateProd } from "../../../../../customGraphQL/mutations/locationMutations"
import { useLocationDetails } from "../../../../../data/locationData"
import { useCalculateRoutesByLocation, useRouteAssignmentByLocation } from "../../../../../data/productionData"

export const AddItemSidebar = ({ locNick, delivDate, visible, setVisible, cartItems, cartItemChanges, setCartItemChanges, user, fulfillmentOption}) => {
  const dayOfWeek = getWeekday(delivDate)
  const delivDateString = DateTime
    .fromJSDate(delivDate, {zone: 'America/Los_Angeles'})
    .toLocaleString({ weekday: 'short', month: 'short', day: 'numeric' })  

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedQty, setSelectedQty] = useState(null)

  const { data:customProductData } = useProductDataWithLocationCustomization(locNick)
  const { data:locationData, mutate:mutateLocation, isValidating:locationIsValidating } = useLocationDetails(locNick, !!locNick)

  const calculateRoutes = useCalculateRoutesByLocation(locNick, !!locNick)

  const orderSubmitDate = getWorkingDateTime('NOW')
  const selectedProductMaxQty = getMaxQty(user, selectedProduct, delivDate, cartItems)
  const selectedProductRoutes = selectedProduct ? (calculateRoutes(selectedProduct.prodNick, dayOfWeek, fulfillmentOption)) : []
  const selectedProductIsDeliverable = fulfillmentOption === 'deliv' 
  ? (selectedProductRoutes[0] !== 'NOT ASSIGNED' && selectedProductRoutes[0] !== null) 
  : true

  const selectedProductInProduction = selectedProduct ? delivDate < orderSubmitDate.plus({ days: selectedProduct.leadTime }) : null
  const selectedProductIsAvailable = selectedProduct ? testProductAvailability(selectedProduct.prodNick, dayOfWeek) : null
  const errorFlag = selectedProductInProduction || !selectedProductIsAvailable || !selectedProductIsDeliverable
  
  const handleAddProduct = () => {
    let _cartItemChanges = [...cartItemChanges]
    let oldItem = cartItemChanges.find(item => 
      item.product.prodNick === selectedProduct.prodNick
    )
    let newItem
    
    if (oldItem) {
      // case: update qty on an existing cart order
      _cartItemChanges = cartItemChanges.map(item => 
        item.product.prodNick === selectedProduct.prodNick
          ? { ...item, qty: selectedQty}
          : { ...item }  
      )
    } else {
      // case: create a new cart item
      newItem = { 
        id: null,
        product: {
          prodNick: selectedProduct.prodNick,
          prodName: selectedProduct.prodName,
          leadTime: selectedProduct.leadTime,
          packSize: selectedProduct.packSize
        },
        qty: selectedQty,
        orderType: "C",
        rate: selectedProduct.wholePrice,
        action: "CREATE"
      }
      _cartItemChanges = [ ..._cartItemChanges, newItem]
        .sort((a, b) => {
          if (a.product.prodName < b.product.prodName) return -1
          if (a.product.prodName > b.product.prodName) return 1
          return 0
        })
    }
    setCartItemChanges(_cartItemChanges)

  }
  
  
  
  const DropdownItemTemplate = (option) => {
    const inProduction = delivDate < orderSubmitDate.plus({ days: option.leadTime })

    const dateParts = orderSubmitDate.plus({ days: option.leadTime }).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY).split(',')
    const availableDate = `${dateParts[0]}, ${dateParts[1]}`
    
    const cartMatchItem = cartItemChanges.find(i => i.product.prodNick === option.prodNick)
    const inCart = !!cartMatchItem && (cartMatchItem.qty > 0 || cartMatchItem.action === 'CREATE')
    const recentlyDeleted = cartMatchItem && getWorkingDate('NOW') === getWorkingDate(cartMatchItem.qtyUpdatedOn) && cartMatchItem.qty === 0
    const delivRoutes = calculateRoutes(option.prodNick, dayOfWeek, fulfillmentOption)
    const isDeliverable = fulfillmentOption === 'deliv' 
      ? (delivRoutes[0] !== 'NOT ASSIGNED' && delivRoutes[0] !== null)
      : true
    const productIsAvailable = testProductAvailability(option.prodNick, dayOfWeek)

    const displayText = wrap(option.prodName, 25)

    const icon = !!option.templateProd ? "pi pi-star-fill" : "pi pi-star"

    const errorFlag = inProduction || !productIsAvailable || !isDeliverable

    return(
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={{width: "100%", display: "flex", justifyContent:"space-between", alignItems: "center"}}>
          <div style={{width: "fit-content", fontWeight: (recentlyDeleted && inProduction) ? "bold" : "normal"}}>
            {/* {option.prodName} */}
            {displayText.split('\n').map((line, idx) => <div style={{fontWeight: !!option.templateProd ? "bold" : "normal"}} key={idx}>{line}</div>)}
            {(recentlyDeleted && inProduction) && <div style={{fontSize: ".9rem"}}>Recently Deleted</div>}
            {!(recentlyDeleted && inProduction) && <div style={{fontSize: ".9rem"}}>{inCart ? "In cart" : (option.leadTime + " day lead; " + (inProduction ? "earliest " + availableDate : 'available'))}</div>}
            {/* {!isDeliverable && <div style={{fontSize: ".9rem"}}>{`Pick up Only for ${dayOfWeek}`}</div>} */}
            {/* {!productIsAvailable && <div style={{fontSize: ".9rem"}}>{`Not available for ${dayOfWeek}`}</div>} */}
            {/* <div style={{fontSize: ".9rem"}}>{JSON.stringify(delivRoutes)}</div> */}
          </div>
          <i className={errorFlag ? "pi pi-exclamation-circle" : ""} style={{fontSize: "1.25rem", marginRight: "1rem"}}/>
        </div>
        <Button icon={icon}
          onClick={e => {
            e.preventDefault() 
            e.stopPropagation()
            //if (locNick === user.locNick) {
              console.log(locNick, option.prodNick, option.templateProd)
              toggleFav(locNick, option.prodNick, option.templateProd, mutateLocation)
              //setIsFav(() => !isFav)
           // }
            
          }} 
          className="p-button-text p-button-rounded"
          disabled={
            //locNick !== user.locNick || 
            locationIsValidating
          }
        />
      </div>
    )
  }

  const dropdownValueTemplate = (option, props) => {
    if (option) return(
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <div>{option.prodName || ''}</div>{!!option.templateProd && <i className="pi pi-star-fill"/>}
      </div>
    )

    return <span>{props.placeholder}</span>;
  }
  
  
  
  return (
    <Sidebar
      visible={visible} 
      onHide={() => {
        setVisible(false)
        setSelectedProduct(null)
        setSelectedQty(null)
      }}  
      blockScroll={true}
      icons={() => <div>Adding for {delivDateString}</div>}
      position="top"
      style={{height: "200px"}}
    >
      <div className="p-fluid" style={{margin: ".5rem"}}>
        <Dropdown options={customProductData || []} 
          //showOnFocus={true}
          optionLabel="prodName" optionValue="prodNick"
          value={selectedProduct ? selectedProduct.prodNick : null}
          filter filterBy={`prodName${user.locNick === 'backporch' ? ",prodNick" : ""}`} showFilterClear resetFilterOnHide
          class
          itemTemplate={DropdownItemTemplate}
          valueTemplate={dropdownValueTemplate}
          onChange={e => {
            console.log("selectedProduct:", customProductData?.find(item => item.prodNick === e.value))
            setSelectedProduct(customProductData?.find(item => item.prodNick === e.value))
            setSelectedQty(cartItemChanges.find(i => i.product.prodNick === e.value)?.qty || 0)
          }}
          placeholder={customProductData ? "Select Product" : "Loading..."}
        />
      </div>
      {errorFlag && 
        <div style={{width: "100%", display: "flex", justifyContent:"space-between", alignItems: "center"}}>
          <div style={{width: "fit-content"}}>
              {/* {option.prodName} */}
              {/* {displayText.split('\n').map((line, idx) => <div style={{fontWeight: !!option.templateProd ? "bold" : "normal"}} key={idx}>{line}</div>)} */}
              {/* {(recentlyDeleted && inProduction) && <div style={{fontSize: ".9rem"}}>Recently Deleted</div>} */}
              {/* {!(recentlyDeleted && inProduction) && <div style={{fontSize: ".9rem"}}>{inCart ? "In cart" : (option.leadTime + " day lead; " + (inProduction ? "earliest " + availableDate : 'available'))}</div>} */}
              {/* {!isDeliverable && <div style={{fontSize: ".9rem"}}>{`Pick up Only for ${dayOfWeek}`}</div>} */}
              {/* {!productIsAvailable && <div style={{fontSize: ".9rem"}}>{`Not available for ${dayOfWeek}`}</div>} */}
              {/* <div style={{fontSize: ".9rem"}}>{JSON.stringify(delivRoutes)}</div> */}
          </div>
          <i className={errorFlag ? "pi pi-exclamation-circle" : ""} style={{fontSize: "1.25rem", marginRight: "1rem"}}/>
        </div>
      }
      <div style={{display: "flex", justifyContent: "flex-end", gap: "1rem", padding: ".5rem"}}>
        <div className="p-fluid" style={{flex: "0 0 80px", maxWidth: "80px"}}>
          <InputNumber 
            value={selectedQty}
            min={0}
            max={selectedProductMaxQty}
            placeholder="Qty"
            disabled={
              !selectedProduct || 
              selectedProductMaxQty === 0
            }
            onFocus={(e) => {
              e.target.select();
            }}
            onChange={e => setSelectedQty(e.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") {
                if (e.target.value === "") setSelectedQty(0);
                e.target.blur();
              }

            }}
            onBlur={() => {
              if (selectedQty === null) {
                setSelectedQty(0)
              }
            }}
          />
        </div>

        <Button label="ADD"
          // className="p-button-outlined p-button-rounded"
          onClick={()=>{
            console.log("product added")
            handleAddProduct()
            setVisible(false)
            setSelectedProduct(null)
            setSelectedQty(null)
          }}
          disabled={
            !selectedProduct || 
            selectedProductMaxQty === 0 ||
            selectedQty === 0 ||
            (user.authClass === 'bpbfull' && delivDate < getWorkingDateTime('NOW')) ||
            (user.authClass !== 'bpbfull' && delivDate <= getWorkingDateTime('NOW')) ||
            (!selectedProductIsDeliverable)
          }
          style={{flex: "0 0 100px"}}
        />
      </div>

    </Sidebar>
  )

}




const getMaxQty = (user, selectedProduct, delivDate, cartItems) => {
  if (!selectedProduct || !cartItems || !delivDate) return null

  // we only look through cart items returned from the DB; i.e. items already entered.
  // items just added in the app dont count as part of the order if the product is in production.
  // probably need to review all cases more closely in the future.
  const cartMatchItem = cartItems.find(
    item => item.product.prodNick === selectedProduct.prodNick
  )
  const inProduction = delivDate < getWorkingDateTime('NOW').plus({ days: selectedProduct.leadTime })
  const inCartItems = !!cartMatchItem
  const qtyUpdatedToday = inCartItems && getWorkingDate('NOW') === getWorkingDate(cartMatchItem.qtyUpdatedOn) 

  let selectedProductMax

  if (!inProduction || user.authClass === 'bpbfull') {
    selectedProductMax = 999

  } else if (!inCartItems) { 
    // implied inProduction === true
    selectedProductMax = 0

  } else if (!qtyUpdatedToday) { 
    // implied inProduction === true && inCartItems === true
    selectedProductMax = cartMatchItem.qty

  } else { 
    // implied all true
    selectedProductMax = cartMatchItem.sameDayMaxQty

  }

  return selectedProductMax

}



const wrap = (s, w) => s.replace(
  new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n'
);



const toggleFav = async (locNick, prodNick, id, mutateLocation) => {
  console.log(id)

  if (!!id) await deleteFav(id)
  else await createFav(locNick, prodNick)

  mutateLocation()
}

const createFav = async (locNick, prodNick) => {
  let query = createTemplateProd
  let variables = { 
    input: {
      locNick: locNick,
      prodNick: prodNick
    }
  }

  let response = await gqlFetcher(query, variables)
  console.log("createFav", response)
}

const deleteFav = async (id) => {
  let query = deleteTemplateProd
  let variables = { 
    input: {
      id: id
    }
  }

  let response = await gqlFetcher(query, variables)
  console.log("deleteFav", response)
}


const testProductAvailability = (prodNick, dayOfWeek) => {
  if (['ptz', 'unpz', 'pbz'].includes(prodNick) && ['Sun', 'Mon'].includes(dayOfWeek)) return false
  return true  
}