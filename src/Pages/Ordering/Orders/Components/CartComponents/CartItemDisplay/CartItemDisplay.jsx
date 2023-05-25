import React, { useState } from "react"

import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"

// import { IconInfoMessage } from "../IconInfoMessage"

import TimeAgo from "timeago-react"
import { sortBy, sumBy } from "lodash"
import { reformatProdName } from "../../../../Orders10/_utils/reformatProdName"

import { CartQtyInput } from "./CartQtyInput"
import { CartSubmitButton } from "./CartSubmitButton"
import { CartItemMessages } from "./CartItemMessages"

// const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
// const fulfillmentDisplayTextMap = {
//   'deliv': 'Delivery',
//   'slopick': 'SLO pickup',
//   'atownpick': 'Carlton pickup',
// }



export const CartItemDisplay = ({ 
  cartOrder,
  cartHeader, 
  cartItems,
  cartMeta,
  setCartItems,
  dateProps,
  wSize,
  user,
  location,
  products,
  cartCache,
  setShowSidebar,
  orderHasChanges,
  disableInputs,
}) => {
  const [showDetails, setShowDetails] = useState(false)
  const { delivDateJS, delivDateDT } = dateProps
  const weekdayLong = delivDateDT.toLocaleString({ weekday: 'long' })

  const fulfillmentOption = cartHeader?.route ?? ''

  // Component props

  const submitButtonProps = {
    location,
    products,
    cartOrder,
    cartHeader,
    cartItems,
    cartMeta,
    cartCache,
    user,
    delivDateJS,
    delivDateDT,
    disableInputs,
    orderHasChanges,
  }



  const productHeaderTemplate = () => {
    return (
      <div style={{
        fontSize: "1.25rem",
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center"
      }}>
        <span onClick={() => {if (user.authClass === 'bpbfull') {
          console.log("Location details:", location)
          console.log("Base Data:", cartOrder)
          console.log("Order header:", cartHeader)
          console.log("Items:", cartItems)
        }}}>
          Products
        </span> 
        <Button
          size="large"
          icon={showDetails ? "pi pi-search-minus" : "pi pi-search-plus"}
          className="p-button-rounded p-button-text p-button-lg" 
          onClick={() => setShowDetails(!showDetails)}
        />
      </div>
    )
  }
  const productColumnTemplate = (rowData) => {
    const { 
      prodNick, 
      createdOn, 
      updatedOn, 
      qty, 
      baseQty, 
      qtyUpdatedOn, 
      orderType, 
      updatedBy 
    } = rowData
    const { 
      timingStatus, 
      sameDayUpdate, 
      maxQty, 
      qtyChanged 
    } = cartMeta[prodNick]
    const { prodName, packSize, meta, defaultInclude } = products[prodNick]
    const { isAvailable, isValid, routeOption } = meta.assignedRouteSummary
    const { routeIsAvailable } = routeOption
    
    //const notIncluded = !defaultInclude && user.authClass === 'bpbfull'
    const lastAction = (orderType) === 'C' 
      ? createdOn === updatedOn 
        ? "Created" 
        : (baseQty === 0 ? "Deleted" : "Updated") 
      : ""
    const recentlyDeleted = lastAction === 'Deleted' && sameDayUpdate

    const infoMessageProps = {
      recentlyDeleted,
      maxQty,
      timingStatus,
      fulfillmentOption,
      isAvailable,
      routeIsAvailable,
      delivDateDT,
      defaultInclude,
      user,
      qty,
    }
    
    //const recentlyDeleted = (lastAction === "Deleted") && sameDayUpdate
    
    return (
      <div style={qty === 0 ? {opacity: ".70"} : null}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignContent: "center", 
          gap: ".25rem"
        }}>
          <span style={{
            fontStyle: qtyChanged && qty > 0 ? "italic" : "normal", 
            fontWeight: "bold"
          }}>
            {reformatProdName(prodName, packSize)}
          </span>
        </div>

        <CartItemMessages 
          {...infoMessageProps} 
        />
    
        {showDetails && 
          <ProductColumnDetails 
            orderType={orderType}
            lastAction={lastAction}
            updatedBy={updatedBy}
            qtyUpdatedOn={qtyUpdatedOn}
          />
        }
      </div>
    )
  } // end productColumnTemplate

  const qtyHeaderTemplate = () => {
    if (wSize === 'lg') return "Qty"
    else return (
      <Button label="Add"
        onClick={() => setShowSidebar(true)} 
        disabled={disableInputs} 
        style={{width: "62px", fontSize: "1.1rem"}} 
      />
    )
  }

  const qtyColumnTemplate = (rowData) => {
    const { prodNick, qty, rate } = rowData
    const product = products[prodNick]
    const { packSize } = product
    return (
      <div>
        <CartQtyInput
          rowData={rowData}
          product={product}
          cartItems={cartItems}
          cartMeta={cartMeta}
          setCartItems={setCartItems}
          user={user}
          disableInputs={disableInputs}
        />
        {showDetails && 
          <QtyColumnDetails 
            qty={qty}
            rate={rate}
            packSize={packSize}
          />
        }
      </div>
    )
  }
  
  const footerTemplate = () => {
    const total = sumBy(cartItems, item => item.qty * item.rate).toFixed(2) 

    return (
      <div style={{
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center"}}
      >
        <span style={{ color: "hsl(37, 100%, 10%)", fontSize: "1.1rem" }}>
          {`Total: $${total}`}
        </span>
        <CartSubmitButton {...submitButtonProps} />
      </div>
    )
  }

  const displayItems = cartItems.filter(item => {
    const meta = cartMeta[item.prodNick]

  })

  return (<>
    <DataTable
      value={sortBy(cartItems, item => products[item.prodNick].prodName)} 
      responsiveLayout="scroll"
      footer={footerTemplate}
      scrollable={wSize === 'lg'}
      scrollHeight={wSize === 'lg' ? "49rem" : undefined}
      style={{
        border: "none",
        boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2),"
          +" 0 1px 1px 0 rgba(0, 0, 0, 0.14), "
          +"0 1px 3px 0 rgba(0, 0, 0, 0.12)",
      }}
    >
      <Column
        header={productHeaderTemplate}
        headerStyle={{
          color: "hsl(37, 100%, 10%)",
        }}
        headerClassName="header-split-content"
        body={productColumnTemplate}
      />
      <Column 
        header={qtyHeaderTemplate}
        headerStyle={wSize === 'lg' 
          ? {
            fontSize: "1.25rem",
            color: "hsl(37, 100%, 10%)",
            display: "flex", 
            alignItems: "center"
          } 
          : undefined
        }
        body={qtyColumnTemplate}
        style={{width: "90px", flex: "0 0 90px"}}
      />
    </DataTable>
  </>)
}



const ProductColumnDetails = ({ 
  orderType, 
  lastAction, 
  qtyUpdatedOn, 
  updatedBy 
}) => {

  return (
    <div style={{paddingTop: ".5rem", fontSize: ".9rem"}}>
      {orderType === 'C' && 
        <div>{`${lastAction} `}<TimeAgo datetime={qtyUpdatedOn}/></div>
      }
      {orderType === 'C' && updatedBy && 
        <div>{`by ${updatedBy}`}</div>
      }
      {orderType === 'S' &&
        <div>-- standing order</div>
      }
    </div>
  )
}


const QtyColumnDetails = ({ qty, rate, packSize }) => {
  const containerStyle = { 
    paddingTop: "2.75rem", 
    fontSize: ".9rem", 
    textAlign: "center"
  }

  return (
    <div style={containerStyle}>
      <div>{`$${rate.toFixed(2)}/${packSize !== 1 ? "pk" : "ea"}.`}</div>
      <div style={{paddingTop: ".5rem"}}>Subtotal:</div>
      <div>{`$${(rate * qty).toFixed(2)}`}</div>
    </div>
  )
}

