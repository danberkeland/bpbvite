import React from "react"

import { IconInfoMessage } from "../IconInfoMessage"
import { Tag } from "primereact/tag"


const fulfillmentDisplayTextMap = {
  'deliv': 'Delivery',
  'slopick': 'SLO pickup',
  'atownpick': 'Carlton pickup',
}

export const CartItemMessages = ({
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
}) => {
  const strWeekdayFull = delivDateDT.toFormat('EEEE')

  return (<>
    <IconInfoMessage 
      text={"Recently deleted"}
      showIf={recentlyDeleted}
      iconClass="pi pi-fw pi-info-circle" 
      iconColor={!!qty ? "hsl(218, 43%, 50%)" : ""}
    />
    <IconInfoMessage text={`In production (max ${maxQty})`} 
      showIf={timingStatus === 'prod' && maxQty > 0}
      iconClass="pi pi-fw pi-info-circle"
      iconColor={!!qty ? "hsl(218, 43%, 50%)" : ""}
    />
    <IconInfoMessage text="In production" 
      showIf={timingStatus === 'prod' && maxQty === 0}
      iconClass="pi pi-fw pi-times"
      iconColor={!!qty ? "#BF0404" : ""}
    />
    <IconInfoMessage text="Delivery date reached" 
      showIf={timingStatus === 'deliv'}
      iconClass="pi pi-fw pi-info-circle"
      iconColor={!!qty ? "hsl(218, 43%, 50%)" : ""}
    />
    <IconInfoMessage text={`Past delivery date`} 
      showIf={timingStatus === 'past'}
      iconClass="pi pi-fw pi-info-circle"
      iconColor={!!qty ? "hsl(218, 43%, 50%)" : ""}
    />
    {/* <IconInfoMessage text={
        `${fulfillmentDisplayTextMap[fulfillmentOption]}`
        + ` not available for ${strWeekdayFull}s`
      } 
      showIf={!routeIsAvailable}
      textStyle={{fontWeight: !!qty ? "bold" : ""}}
      iconClass={"pi pi-fw pi-exclamation-triangle"} 
      iconColor={!!qty ? "hsl(45, 96%, 35%)"  : ""}
    />
    <IconInfoMessage text={`Product not available ${strWeekdayFull}s`} 
      showIf={!isAvailable}
      textStyle={{fontWeight: !!qty ? "bold" : ""}}
      iconClass={"pi pi-fw pi-exclamation-triangle"} 
      iconColor={!!qty ? "hsl(45, 96%, 35%)"  : ""}
    /> */}
    <IconInfoMessage text={`Product not available for 
        ${fulfillmentDisplayTextMap[fulfillmentOption]} 
        ${strWeekdayFull}s`
      } 
      showIf={!isAvailable || !routeIsAvailable}
      textStyle={{fontWeight: !!qty ? "bold" : ""}}
      iconClass={"pi pi-fw pi-exclamation-triangle"} 
      iconColor={!!qty ? "hsl(45, 96%, 35%)"  : ""}
    /> 
    {!defaultInclude && user.authClass === 'bpbfull' && 
      <div style={{paddingBlock: ".2rem", fontSize: ".9rem"}}>
        <Tag 
          severity='danger' 
          value="Not Allowed" 
          icon="pi pi-fw pi-exclamation-circle"
          style={{background: "#BF0404", marginRight: ".5rem"}}
        />
        Special exceptions only
      </div>
    }
    <IconInfoMessage text={`Special Order (read only)`} 
      showIf={!defaultInclude && user.authClass !== 'bpbfull'}
      iconClass="pi pi-fw pi-info-circle"
      iconColor={!!qty ? "hsl(218, 43%, 50%)" : ""}
    />

  </>)

}