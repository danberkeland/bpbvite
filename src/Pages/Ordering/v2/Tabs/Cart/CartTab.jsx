import React from "react"

import { CartCalendar } from "./CartCalendar"
import { CartHeader } from "./CartHeader"
import { CartItemList } from "./CartItemList"
import { Button } from "primereact/button"
import { Data } from "../../../../../utils/dataFns"
import { round } from "lodash"



/**
 * @param {Object} props
 * @param {CartHeaderProps} props.headerProps
 * @param {Object} props.calendarProps
 * @param {Object} props.cartProps
 * @param {boolean} props.isMobile
 */
const CartTab = ({
  isMobile,
  headerProps,
  calendarProps,
  cartProps,
  productSelectorProps,
  defaultFulfillment,
  children,
}) => {

  const { cartChanges } = cartProps
  const cartTotal = cartChanges?.[0].items
    .reduce(Data._sumBy(item => item.qty * item.rate), 0) ?? 0


  return (
    <div className="cart-tab">
      <div style={{marginInline: isMobile ? "-1px" : ""}}>
        {children}
        <CartCalendar 
          {...calendarProps} 
          inline={true}
          style={{
            display: isMobile 
              ? "none" 
              : "",
            width: "100%",
          }}
        />
      </div>

      <div style={{marginInline: isMobile ? "-1px" : ""}}> 
        <CartHeader 
          isMobile={isMobile}
          {...headerProps}
          calendarProps={calendarProps}
        />

        <CartItemList 
          {...cartProps}
          productSelectorProps={productSelectorProps}
          isMobile={isMobile}
        />

        <div className="cart-submit-container">
          <span>Total: {round(cartTotal, 2)}</span>
          <Button label="Submit" />
        </div>
      </div>

    </div>

  )
}

export {
  CartTab
}