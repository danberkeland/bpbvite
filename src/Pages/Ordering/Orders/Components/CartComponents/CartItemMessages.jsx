import React from "react"

import { Tag } from "primereact/tag"
import { IconInfoMessage } from "../IconInfoMessage"

const fulfillmentDisplayTextMap = {
  'deliv': 'Delivery',
  'slopick': 'SLO pickup',
  'atownpick': 'Carlton pickup',
}

const infoColor = 'hsl(218, 65%, 50%)'
const warnColor = 'hsl(45, 96%, 35%)'
const dangerColor = 'hsl(0, 96%, 38%)'


export const CartItemMessages = ({ 
  displayFor='itemDisplay',
  product,
  cartItem,
  cartMeta,
  fulfillmentOption, 
  user,
  delivDateDT, ORDER_DATE_DT, orderLeadTime, // dateProps
}) => {
  const { prodNick, defaultInclude } = product
  const { qty, baseQty, orderType } = cartItem ?? {}
  const { maxQty:inCartMaxQty, sameDayUpdate } = cartMeta?.[prodNick] ?? {}

  const inCart = !!cartItem && cartItem.baseQty !== 0
  
  const {
    hasAssignedRoute, 
    isAvailable, 
    inProd,
    isValid, 
    leadTime, 
    routeOption,
  } = product?.meta?.assignedRouteSummary ?? {} 

  const routeIsAvailable = routeOption?.routeIsAvailable
  const assignedRouteIsValid = routeOption?.isValid

  const maxQty = inCartMaxQty ?? (inProd ? 0 : 999) 
  const recentlyDeleted = orderType === 'C' && baseQty === 0 && sameDayUpdate

  const timingStatus = isNaN(orderLeadTime) ? 'past' 
    : orderLeadTime === 0 ? 'deliv' 
    : inProd ? 'prod' : ''

  const strWeekdayFull = delivDateDT.toFormat('EEEE')
  const strEarliestDate = 
    ORDER_DATE_DT.plus({ days: leadTime }).toFormat('EEEE, MMM dd')

  const removeColor = displayFor === 'itemDisplay' && !qty

  return (<>


    <IconInfoMessage showIf={timingStatus === 'prod' && maxQty > 0}
      text={`In production${maxQty < 999 && ` (max ${maxQty})`}`} 
      iconClass="pi pi-fw pi-info-circle" 
      iconColor={removeColor ? "" : infoColor}
    />
    <IconInfoMessage showIf={timingStatus === 'prod' && maxQty === 0}
      text={`In production. Earliest ${strEarliestDate}`} 
      iconClass="pi pi-fw pi-times" 
      iconColor={removeColor ? "" : dangerColor}
    />


    <IconInfoMessage showIf={timingStatus === 'deliv'}
      text={`Delivery Date reached 
        ${ inCart ? "(read only)" : `: Earliest ${strEarliestDate}` }`
      } 
      iconClass={inCart ? "pi pi-fw pi-info-circle" : "pi pi-fw pi-times"}
      iconColor={removeColor ? "" : (inCart ? infoColor : dangerColor)}
    />


    <IconInfoMessage showIf={timingStatus === 'past'}
      text={`Past delivery date
        ${ inCart ? "(read only)" : `: Earliest ${strEarliestDate}` }`
      } 
      iconClass={inCart ? "pi pi-fw pi-info-circle" : "pi pi-fw pi-times"}
      iconColor={removeColor ? "" : (inCart ? infoColor : dangerColor)}
    />


    <IconInfoMessage showIf={!isAvailable || !assignedRouteIsValid}
      text={`Not available for 
        ${fulfillmentDisplayTextMap[fulfillmentOption]} 
        ${strWeekdayFull}s`
      } 
      textStyle={displayFor === "itemDisplay" && !!qty 
        ? { fontWeight : "bold" } 
        : undefined
      }
      iconClass={"pi pi-fw pi-exclamation-triangle"} 
      iconColor={removeColor ? "" : warnColor}
    /> 


    {!defaultInclude && user.authClass === 'bpbfull' && 
      <div style={{paddingBlock: ".2rem", fontSize: ".9rem"}}>
        <Tag 
          severity='danger' 
          value="Not Allowed" 
          icon="pi pi-fw pi-exclamation-circle"
          style={{background: dangerColor, marginRight: ".5rem"}}
        />
        Special cases only
      </div>
    } 
    <IconInfoMessage showIf={!defaultInclude && user.authClass !== 'bpbfull'}
      text={`Special Order (read only)`} 
      iconClass="pi pi-fw pi-info-circle"
      iconColor={!!qty ? "hsl(218, 43%, 50%)" : ""}
    />


  </>)
}