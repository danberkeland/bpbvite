import React, { useState } from "react"

import { Button } from "primereact/button"
import { Dropdown } from "primereact/dropdown"
import { Sidebar } from "primereact/sidebar"
import { InputNumber } from "primereact/inputnumber"

import { useProductDataWithLocationCustomization } from "../../../../../data/productData"

import { getWorkingDate, getWorkingDateTime } from "../../../../../functions/dateAndTime"
import dynamicSort from "../../../../../functions/dynamicSort"

export const AddItemSidebar = ({ locNick, delivDate, visible, setVisible, cartItems, cartItemChanges, setCartItemChanges}) => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedQty, setSelectedQty] = useState(null)


  const { data:customProductData } = useProductDataWithLocationCustomization(locNick)

  const orderSubmitDate = getWorkingDateTime('NOW')
  const selectedProductMaxQty = getMaxQty(selectedProduct, delivDate, cartItems)
  

  
  const handleAddProduct = () => {
    let _cartItemChanges = [...cartItemChanges]
    let oldItem = cartItemChanges.find(item => 
      item.prodNick === selectedProduct.prodNick
    )
    let newItem
    
    if (oldItem && oldItem.orderType === "C") {
      // case: update qty on an existing cart order
      newItem = { ...oldItem, qty: selectedQty }
      _cartItemChanges = [...cartItemChanges]
        .map(item => item.prodNick === selectedProduct.prodNick ? newItem : item)
        .sort(dynamicSort("prodName"))
    } else {
      // case: create a new cart item
      newItem = { 
        id: null,
        product: {
          prodNick: selectedProduct.prodNick,
          prodName: selectedProduct.prodName,
        },
        qty: selectedQty,
        orderType: "C",
        rate: selectedProduct.wholePrice,
        action: "CREATE"
      }
      _cartItemChanges = [ ..._cartItemChanges, newItem]
        .sort(dynamicSort("prodName"))
    }
    setCartItemChanges(_cartItemChanges)

  }
  
  
  
  const dropdownItemTemplate = (option) => {
    const inProduction = delivDate < orderSubmitDate.plus({ days: option.leadTime })
    const availableDate = orderSubmitDate.plus({ days: option.leadTime }).toLocaleString()
    
    const cartMatchItem = cartItemChanges.find(i => i.prodNick === option.prodNick)
    const inCart = cartMatchItem && (cartMatchItem.qty > 0 || cartMatchItem.action === 'CREATE')
    const recentlyDeleted = cartMatchItem && getWorkingDate('NOW') === getWorkingDate(cartMatchItem.qtyUpdatedOn) && cartMatchItem.qty === 0

    return(
      <div style={{fontWeight: (recentlyDeleted && inProduction) ? "bold" : "normal"}}>
        <div>{option.prodName}</div>
        {(recentlyDeleted && inProduction) && <div>Recently Deleted</div>}
        {!(recentlyDeleted && inProduction) && <div>{inCart ? "In cart" : (option.leadTime + " day lead; " + (inProduction ? "earliest " + availableDate : 'available'))}</div>}
      </div>
    )
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
      icons={() => <div>Add a product</div>}
      position="top"
      style={{height: "200px"}}
    >
      <div className="p-fluid" style={{margin: ".5rem"}}>
        <Dropdown options={customProductData || []} 
          optionLabel="prodName" optionValue="prodNick"
          value={selectedProduct ? selectedProduct.prodNick : null}
          filter filterBy="prodName,prodNick" showFilterClear resetFilterOnHide
          itemTemplate={dropdownItemTemplate}
          onChange={e => {
            console.log("selectedProduct:", customProductData?.find(item => item.prodNick === e.value))
            setSelectedProduct(customProductData?.find(item => item.prodNick === e.value))
            setSelectedQty(0)
          }}
          placeholder={customProductData ? "Select Product" : "Loading..."}
        />
      </div>

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
          selectedQty === 0
        }
        style={{flex: "0 0 100px"}}
      />
      </div>

    </Sidebar>
  )

}




const getMaxQty = (selectedProduct, delivDate, cartItems) => {
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

  if (!inProduction) {
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



