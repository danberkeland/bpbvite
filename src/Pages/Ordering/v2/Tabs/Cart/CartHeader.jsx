import React from "react"

import { CartOrder } from "../../../../../data/types.d"

import { DateTime } from "luxon"
import { Dropdown } from "primereact/dropdown"
import { CartCalendar } from "./CartCalendar"
import { IsoDate } from "../../../../../utils/dateTimeFns"

const fulfillmentOptions = [
  { value: 'deliv', label: 'Delivery' },
  { value: 'slopick', label: 'Pickup in SLO' },
  { value: 'atownpick', label: 'Pickup in Atascadero' },
]

/**
 * @typedef {Object} CartHeaderProps 
 * @property {DateTime<true>[]} props.delivDTList
 * @property {CartOrder[]} props.cartChanges
 * @property {Function} updateCartHeader
 * @property {DateTime<true> | DateTime<false>} props.todayDT
 * @property {DateTime<true> | DateTime<false>} props.orderDT
 * @property {Function} props.changeDelivDate 
 * @property {[Date, Date]} props.calendarDateRange
 * @property {string} props.defaultFulfillment
 * @property {Function} props.updateCartHeader
 * @property {boolean} isMobile
 */
/**
 * @param {CartHeaderProps} props  
 */
const CartHeader = ({ 
  delivDTList, 
  cartChanges,
  updateCartHeader,
  todayDT,
  orderDT,
  location,

  calendarProps,
  isMobile,
}) => {
  const selectedFflOpt = cartChanges?.[0]?.header.route
  const delivDate = cartChanges?.[0]?.header.delivDate
  const weekdayEEE = !!delivDate ? IsoDate.toWeekdayEEE(delivDate) : ''
  const weekday = !!delivDate ? IsoDate.toWeekdayNum(delivDate) : 0

  const pastCutoff = todayDT.day !== orderDT.day
  const fulfillmentOptionIsAvailable = 
    location?.meta?.validDaysByFflOpt?.[selectedFflOpt]?.[weekday] !== false

  if (delivDTList.length === 1) return (
    <div className={"cart-header" + (isMobile ? " cart-header-sticky" : "")}>

      <label 
        htmlFor='cart-header-ffl-input' 
        style={{display: "block"
      }}>
        Fulfillment:
      </label>
      <Dropdown 
        id='cart-header-ffl-input'
        className="cart-header-dropdown"
        value={cartChanges?.[0]?.header?.route ?? 0}
        options={location?.meta?.deliveryEnabled
          ? fulfillmentOptions
          : fulfillmentOptions.slice(1)
        }
        itemTemplate={option => 
          option.value === location?.meta?.defaultFulfillment
            ? option.label + " (Default)"
            : option.label
        }
        onChange={e => { if (!!cartChanges) {
          updateCartHeader(0, { route: e.value })}
        }}
        style={{width: "100%", fontSize: "1.5rem", marginBottom: ".5rem"}}
      />


      <label htmlFor='cart-header-date-input' style={{display: "block"}}>
        Order Date:
      </label>

      <CartCalendar
        id='cart-header-date-input'
        {...calendarProps}
        touchUI={true}
        showIcon={true}
        style={{marginBottom: ".5rem", width: "100%"}}
        inputStyle={{
          width: "100%", 
          display: "block", 
          background: "var(--bpb-orange-vibrant-100)", 
          fontSize: "1.25rem", 
          fontWeight: "bold", 
          color: "var(--bpb-text-color)", 
          padding: ".125rem, .5rem"
        }}
        displayTextOnly={!isMobile}
      />
      <div style={{fontSize: ".9rem"}}>
        Placement Date: {orderDT.toFormat('MMM d')} <i className="pi pi-fw pi-info-circle" />
      </div>

      {fulfillmentOptionIsAvailable === false &&
        <div style={{display: "flex", alignItems: "center"}}>
          <i className="pi pi-fw pi-exclamation-triangle" />
          {fulfillmentOptions.find(opt => opt.value === selectedFflOpt)?.label} not available on {weekdayEEE}
        </div>
      }

    </div>
  )
}

export {
  CartHeader
}