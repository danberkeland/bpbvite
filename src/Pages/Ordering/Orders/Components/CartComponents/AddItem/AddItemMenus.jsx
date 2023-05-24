import React, { useEffect, useState } from "react"

import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { AddItemQtyInput } from "./AddItemQtyInput"
import { CartItemDropdown } from "./CartItemDropdown"
import { Sidebar } from "primereact/sidebar"
import { handleAddItem } from "./handleAddItem"
import { AddItemInfoMessages } from "./InfoMessages"



export const AddItemMenu = ({  
  products,
  cartHeader, 
  cartItems,
  cartMeta,
  setCartItems,
  dateProps,
  user,
  wSize,
  mode,
  showSidebar,
  setShowSidebar,
  disableInputs,
  ORDER_DATE_DT,
}) => {
  const [selectedQty, setSelectedQty] = useState('')
  const [selectedProdNick, setSelectedProdNick] = useState()

  // const addItemProps = {
  //   products,
  //   cartHeader,
  //   cartItems,
  //   setCartItems,
  //   //cartMeta,
  //   dateProps,
  //   user,
  //   wSize,
  //   selectedQty,
  //   setSelectedQty,
  //   selectedProdNick,
  //   setSelectedProdNick,
  //   showSidebar,
  //   setShowSidebar,
  // }

  const { delivDateJS, delivDateDT, orderLeadTime } = dateProps
  const relativeDateString = orderLeadTime === 0 
    ? `(Today)${user.authClass !== 'bpbfull' && " ― Read Only"}`
    : orderLeadTime === 1 ? "(Tomorrow)"
    : orderLeadTime > 1 ? `(Today +${orderLeadTime})`
    : `${user.authClass !== 'bpbfull' && " ― Read Only"}`

  const selectedProduct = products?.[selectedProdNick] ?? null
  const defaultInclude = selectedProduct?.defaultInclude
  const cartItem = selectedProduct 
    ? cartItems.find(item => item.prodNick === selectedProduct.prodNick)
    : null

  const inCart = !!cartItem 
    && (cartItem.orderType !== 'T' || cartItem.qty !== 0)

  const baseQty = cartItem?.baseQty ?? 0
  const fulfillmentOption = cartHeader?.route
  

  const {
    hasAssignedRoute, isAvailable, inProd,
    isValid, leadTime , routeOption: { routeIsAvailable } 
  } = selectedProduct?.meta?.assignedRouteSummary
    || {    
      hasAssignedRoute: null,
      isAvailable: null,  
      inProd: null,
      isValid: null,
      leadTime: null,
      routeOption: { routeIsAvailable: null }
    } 

  const { 
    maxQty:inCartMaxQty, 
    sameDayUpdate, 
    disableInput:cartDisableInput 
  } = cartMeta?.[selectedProdNick]
    || {
      inCartMaxQty: null, 
      sameDayUpdate: null, 
      cartDisableInput: null
    }
  const maxQty = inCartMaxQty ?? (inProd ? 0 : 999) 

  // console.log(cartMeta?.[selectedProdNick])
  // console.log(maxQty, sameDayUpdate)


  const recentlyDeleted = baseQty === 0 && sameDayUpdate

  useEffect(() => {
    const cartItem = cartItems.find(i => i.prodNick === selectedProdNick)
    setSelectedQty(cartItem ? cartItem.qty : 0)
  }, [delivDateJS])


  // ***Body Props

  const dropdownProps = {
    products,
    cartHeader,
    cartItems,
    cartMeta,
    user,
    wSize,
    selectedProdNick,
    setSelectedProdNick,
    setSelectedQty,
    ORDER_DATE_DT,
  }

  const infoProps = {
    selectedProdNick,
    hasAssignedRoute,
    isAvailable, 
    inCart, 
    inProd,
    isValid,
    defaultInclude,
    leadTime,
    maxQty, 
    routeIsAvailable, 
    recentlyDeleted,
    user,
    fulfillmentOption, 
    selectedProduct,
    cartItem,
    cartMeta,
    ...dateProps,
  }

  // ***Footer Props

  const qtyInputProps = {
    selectedProduct,
    selectedQty,
    setSelectedQty,
    baseQty,
    maxQty: user.authClass === 'bpbfull' ? 999 : maxQty,
    user,
    disableInputs: disableInputs || !selectedProdNick,
  }


  const bodyTemplate = (<>
    <CartItemDropdown 
      {...dropdownProps} />

    <AddItemInfoMessages {...infoProps} {...dateProps} />
  </>) 

  const footerTemplate = (
    <div style={{display: "flex", justifyContent: "flex-end", gap: "2rem"}}>
      
      <AddItemQtyInput {...qtyInputProps} />
      
      <Button label={!!inCart ? "Update" : "Add"} 
        style={{
          width: "5.5rem", 
          fontSize: "1.1rem"
        }}
        disabled={
          !selectedProduct 
          || selectedQty === baseQty
          || disableInputs
          // || (maxQty === 0 && user.authClass !== 'bpbfull')
          // || (isDelivDate && user.authClass !== 'bpbfull')
          // || isPastDeliv 
        }
        onClick={() => {
          handleAddItem(
            products, 
            selectedProduct, 
            selectedQty, 
            cartItems, 
            setCartItems
          )
          setSelectedProdNick('')
          setSelectedQty('')
          setShowSidebar(false)
        }}
      />
    </div>
  )

  const sidebarHeaderTemplate = () => {
    return (
      <div style={{fontSize: "1.25rem", color: "hsl(37, 100%, 10%)" }}>
        {
          orderLeadTime > 0
            ? `Adding for ${delivDateDT.toFormat('EEEE, MMM d')}`
              + ` ${relativeDateString}`
            : `For ${delivDateDT.toFormat('EEEE, MMM d')}`
              + ` ${relativeDateString}`
        }
      </div>
    )
  }
  

  if (mode === 'card') return (<>
    <Card 
      title={() => 
        <span style={{fontSize: "1.25rem"}}>Add a Product</span>
      }
      footer={footerTemplate}
      style={{ marginTop: "1rem" }}
    >
      {bodyTemplate}
    </Card>
    </>)

  else if (mode === 'sidebar') return (
    <Sidebar
      visible={showSidebar || selectedProdNick}
      onHide={() => {
        setShowSidebar(false)
        setSelectedProdNick('')
        setSelectedQty('')
      }}  
      blockScroll={true}
      icons={sidebarHeaderTemplate}
      position="top"
      style={{height: "15.75rem"}}    
      footer={footerTemplate}
    >
      <div style={{marginTop: ".25rem"}}>
        {bodyTemplate}
      </div>
      <div style={{marginInline: "1rem"}}>
        {footerTemplate}  
      </div>
    </Sidebar>
  )

}


























//for ${delivDateString} (T +${timeDeltaDays})`}</div>}
// export const AddItemCardMenu = ({
//   products,
//   cartHeader, 
//   cartItems,
//   setCartItems,
//   //cartMeta,
//   dateProps,
//   user,
//   wSize,
//   selectedQty,
//   setSelectedQty,
//   selectedProdNick,
//   setSelectedProdNick,
//   // showSidebar,
//   setShowSidebar,
// }) => {
//   // const { delivDateJS, isDelivDate, isPastDeliv } = dateProps
//   // const selectedProduct = products?.[selectedProdNick]
//   // const cartItem = selectedProduct 
//   //   ? cartItems.find(item => item.prodNick === selectedProduct.prodNick)
//   //   : null

//   // const inCart = !!cartItem 
//   //   && (cartItem.orderType !== 'T' || cartItem.qty !== 0)

//   // const baseQty = cartItem?.baseQty ?? 0
//   // const fulfillmentOption = cartHeader?.route
  

//   // const {
//   //   hasAssignedRoute, isAvailable, inProd,
//   //   isValid, leadTime , routeOption: { routeIsAvailable } 
//   // } = selectedProduct?.meta?.assignedRouteSummary
//   //   || {    
//   //     hasAssignedRoute: null,
//   //     isAvailable: null,  
//   //     inProd: null,
//   //     isValid: null,
//   //     leadTime: null,
//   //     routeOption: { routeIsAvailable: null }
//   //   }

//   // const { maxQty, sameDayUpdate, disableInput } = cartMeta?.[selectedProdNick]
//   //   || {
//   //     maxQty: 0, 
//   //     sameDayUpdate: null, 
//   //     disableInput: true
//   //   }


//   // const recentlyDeleted = baseQty === 0 && sameDayUpdate

//   // const qtyInputProps = {
//   //   selectedProduct,
//   //   selectedQty,
//   //   setSelectedQty,
//   //   baseQty,
//   //   maxQty: user.authClass === 'bpbfull' ? 999 : maxQty,
//   //   disableInput,
//   // }

//   // const infoProps = {
//   //   selectedProduct,
//   //   fulfillmentOption, 
//   //   hasAssignedRoute,
//   //   isAvailable, 
//   //   inCart, 
//   //   inProd,
//   //   isValid,
//   //   leadTime,
//   //   maxQty, 
//   //   routeIsAvailable, 
//   //   recentlyDeleted,
//   // }



  

//   return (
  
//   )

// }