import React, { useRef } from "react"

import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { AddItemQtyInput } from "./AddItemQtyInput"
import { CartItemDropdown } from "./CartItemDropdown"
import { Sidebar } from "primereact/sidebar"
import { handleAddItem } from "./handleAddItem"
import { CartItemMessages } from "../CartItemMessages"
import { CartItemAutoComplete } from "./CartItemAutocomplete"



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

  cardStyle,
  selectedQty, setSelectedQty,
  selectedProdNick, setSelectedProdNick,
}) => {
  const dropdownRef = useRef(null)
  const qtyInputRef = useRef(null)
  const addButtonRef = useRef(null)
  const { delivDateDT, orderLeadTime, ORDER_DATE_DT, relativeDelivDate } = dateProps

  const relativeDateString = relativeDelivDate === 0 
    ? `(Today)${user.authClass !== 'bpbfull' ? " ― Read Only" : ""}`
    : relativeDelivDate === 1 
      ? "(Tomorrow)" 
      : relativeDelivDate > 1 
        ? `(Today +${relativeDelivDate})`
        : `${user.authClass !== 'bpbfull' ? " ― Read Only" : ""}`

  const selectedProduct = products?.[selectedProdNick] ?? null

  const cartItem = selectedProduct 
    ? cartItems.find(item => item.prodNick === selectedProdNick)
    : null


  const inCart = !!cartItem 
    && (cartItem.orderType !== 'T' || cartItem.qty !== 0)

  const shouldDisableSample = 
    cartItem?.rate === 0 && user.authClass !== 'bpbfull'

  const baseQty = cartItem?.baseQty ?? 0
  const fulfillmentOption = cartHeader?.route
  const { inProd } = selectedProduct?.meta?.assignedRouteSummary ?? {}
  const { maxQty:inCartMaxQty } = cartMeta?.[selectedProdNick] ?? {}
  const maxQty = inCartMaxQty ?? (inProd ? 0 : 999) 


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
    qtyInputRef,
    dropdownRef,
  }

  const infoProps = {
    displayFor: "addItem",
    product: selectedProduct,
    cartItem,
    cartMeta,
    fulfillmentOption, 
    user,
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
    disableInputs: disableInputs || !selectedProdNick || shouldDisableSample,
    qtyInputRef,
    addButtonRef,
  }


  const bodyTemplate = (<>
    {
      user.authClass === 'bpbfull' 
        ? <CartItemAutoComplete {...dropdownProps} />
        : <CartItemDropdown {...dropdownProps} />
    }
    

    <div className="info-message-box" 
      style={{ 
        minHeight: "3rem",
        margin: "1rem .5rem", 
        fontSize: ".9rem"
      }}
    >
      {selectedProduct && <CartItemMessages {...infoProps} />}
    </div>

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
          || disableInputs
          // || selectedQty === baseQty
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
        onKeyDown={e => {
          if (e.key === 'Enter') {
            // document.querySelector('#dropdown input').focus()
            // document.querySelector('#product-dropdown input').focus()
            console.log(dropdownRef)
            dropdownRef.current.focus()

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
          }
        }}
        onBlur={() => ""}
        ref={addButtonRef}
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
  

  if (mode === 'card') return (
    <Card 
      title={() => 
        <span style={{fontSize: "1.25rem"}}>Add a Product</span>
      }
      footer={footerTemplate}
      style={cardStyle}
    >
      {bodyTemplate}
    </Card>
  )

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
      style={{height: "20rem"}}    
      // footer={footerTemplate}
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