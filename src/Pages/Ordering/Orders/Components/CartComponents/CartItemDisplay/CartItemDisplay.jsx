import React, { useState } from "react"

import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"

import TimeAgo from "timeago-react"
import { sortBy, sumBy } from "lodash"
import { reformatProdName } from "../../../../Orders10/_utils/reformatProdName"

import { CartQtyInput } from "./CartQtyInput"
import { CartSubmitButton } from "./CartSubmitButton"
import { CartItemMessages } from "../CartItemMessages"


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
    // delivDateJS,
    // delivDateDT,
    ...dateProps,
    user,
    disableInputs,
    orderHasChanges,
    wSize,
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
      // timingStatus, 
      // sameDayUpdate, 
      // maxQty, 
      qtyChanged 
    } = cartMeta[prodNick]

    const product = products[prodNick]
    const { prodName, packSize } = products[prodNick]

    const lastAction = orderType === 'C' && !!createdOn
      ? baseQty === 0 && updatedBy !== 'standing_order' 
        ? "Deleted"
        : createdOn === updatedOn ? "Created" : "Updated"
      : ""

    const infoMessageProps = {
      product,
      cartItem: rowData,
      cartMeta,
      fulfillmentOption, 
      user,
      ...dateProps,
    }
        
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
            qty={qty}
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
    const shouldDisableSample = (rate === 0 && user.authClass !== 'bpbfull')

    return (
      <div>
        <CartQtyInput
          rowData={rowData}
          product={product}
          cartItems={cartItems}
          cartMeta={cartMeta}
          setCartItems={setCartItems}
          user={user}
          disableInputs={disableInputs || shouldDisableSample}
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

    return (<>
      <div style={{
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        color: "hsl(37, 100%, 10%)",
      }}>
        <span style={{fontSize: "1.1rem" }}>
          {`Total: $${total}`}
        </span>
        <CartSubmitButton {...submitButtonProps} />
      </div>
    </>)
  }

  return (<>
    <DataTable
      value={sortBy(cartItems, i => products[i.prodNick].prodName)} 
      responsiveLayout="scroll"
      footer={footerTemplate}
      scrollable={wSize === 'lg'}
      scrollHeight={wSize === 'lg' ? "40rem" : undefined}
      style={{
        border: "none",
        boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2),"
          +" 0 1px 1px 0 rgba(0, 0, 0, 0.14), "
          +"0 1px 3px 0 rgba(0, 0, 0, 0.12)",
        borderRadius: "3px",
        overflow: "hidden",
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
  updatedBy,
  qty
}) => {

  return (
    <div style={{paddingTop: ".5rem", fontSize: ".9rem"}}>
      {orderType === 'C' && !!lastAction &&
        <div>{`${lastAction} `}<TimeAgo datetime={qtyUpdatedOn}/></div>
      }
      {orderType === 'C' && !!updatedBy && 
        <div>{`by ${updatedBy}`}</div>
      }
      {orderType === 'C' && !updatedBy && qty !== 0 &&
        <div><em>-- Pending submit</em></div>
      }
      {orderType === 'S' &&
        <div>-- Standing order</div>
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