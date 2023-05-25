import { Tag } from "primereact/tag"
import { Chip } from "primereact/chip"
import { IconInfoMessage } from "../../IconInfoMessage"

const fulfillmentDisplayTextMap = {
  'deliv': 'Delivery',
  'slopick': 'SLO pickup',
  'atownpick': 'Carlton pickup',
}


const chipStyle = {
  background: "transparent", 
  border: "1px solid var(--bpb-orange-tone-500)", 
  fontSize: ".8rem", 
  color: "var(--bpb-text-color)",
  marginTop: ".5rem"
}


export const AddItemInfoMessages = ({ 
  selectedProdNick,
  delivDateDT,
  ORDER_DATE_DT,
  orderLeadTime,
  isDelivDate,
  isPastDeliv,
  //inProd,
  //leadTime, 
  //isValid,
  //defaultInclude,
  //isAvailable, 
  // hasAssignedRoute,
  //inCart, 
  //maxQty,  
  //recentlyDeleted,
  user,
  fulfillmentOption, 
  selectedProduct,
  cartItem,
  cartMeta,
}) => {


    const defaultInclude = selectedProduct?.defaultInclude

    const inCart = !!cartItem && cartItem.qty !== 0
    const qty = cartItem?.qty ?? 0
    const baseQty = cartItem?.baseQty ?? 0
    
    const {
      hasAssignedRoute, 
      isAvailable, 
      inProd,
      isValid, 
      leadTime , 
      routeOption: { routeIsAvailable } 
    } = selectedProduct?.meta?.assignedRouteSummary
      || {    
        hasAssignedRoute: null,
        isAvailable: null,  
        inProd: null,
        isValid: null,
        leadTime: null,
        routeOption: { routeIsAvailable: null }
      } 

    const assignedRouteIsValid = 
      selectedProduct?.meta?.assignedRouteSummary.routeOption.isValid
  
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
    
    const recentlyDeleted = baseQty === 0 && sameDayUpdate






  const strWeekdayFull = delivDateDT.toFormat('EEEE')
  const strEarliestDate = 
    ORDER_DATE_DT.plus({ days: leadTime }).toFormat('EEEE, MMM dd')

  const timingStatus = isNaN(orderLeadTime) ? 'past' 
    : orderLeadTime === 0 ? 'deliv' 
    : inProd ? 'prod' : ''

  if (!selectedProdNick) return (
    <div className="info-message-box" 
      style={{ minHeight: "3rem", margin: "1rem .5rem", fontSize: ".9rem"}}
    />
  )
  return ( 
    <div className="info-message-box" 
      style={{
        minHeight: "3rem",
        margin: "1rem .5rem", 
        fontSize: ".9rem",
        // display: "flex",
        // gap: ".25rem",
        // flexWrap: "wrap",
        // alignItems: "flex-start"
      }}
    >
      {/* {inCart && maxQty > 0 && 
        <Chip style={chipStyle} 
          label="In Cart"
          icon="pi pi-fw pi-shopping-cart" 
        />}
      {timingStatus === 'prod' && recentlyDeleted && maxQty > 0 && 
        <Chip 
          style={chipStyle} 
          label="Recently Deleted"
          icon="pi pi-fw pi-trash" 
        />
      } */}
      {/* <IconInfoMessage
        text="In cart"
        showIf={inCart && maxQty > 0}
        iconClass="pi pi-fw pi-shopping-cart" 
        iconColor="var(--bpb-text-color)"
      />
      <IconInfoMessage 
        text={`Recently deleted`}// (max ${maxQty})`}
        showIf={timingStatus === 'prod' && recentlyDeleted && maxQty > 0}
        iconClass="pi pi-fw pi-trash" 
        iconColor="hsla(37, 100%, 10%, .8)"
      /> */}



      <IconInfoMessage 
        text={`In production${maxQty < 999 && ` (max ${maxQty})`}`} 
        showIf={timingStatus === 'prod' && maxQty > 0}
        iconClass="pi pi-fw pi-info-circle" 
        iconColor="hsl(218, 43%, 50%)"
      />
      <IconInfoMessage
        text={`In production. Earliest ${strEarliestDate}`} 
        showIf={timingStatus === 'prod' && maxQty === 0}
        iconClass="pi pi-fw pi-times" 
        iconColor="#BF0404"
      />
      {/* {timingStatus === 'prod' && maxQty > 0 &&
        <Chip label={`In production${maxQty < 999 && ` (max ${maxQty})`}`}
          icon="pi pi-fw pi-info-circle" 
          style={{...chipStyle, color:"#4971b6", border: "1px solid #4971b6"}}
        />
      } */}


      <IconInfoMessage
        text={`Delivery Date reached 
          ${ inCart ? "(read only)" : `: Earliest ${strEarliestDate}` }`
        } 
        showIf={timingStatus === 'deliv'}// && !inCart}
        iconClass={inCart ? "pi pi-fw pi-info-circle" : "pi pi-fw pi-times"}
        iconColor={inCart ? "#4971b6": "#BF0404"}
      />
      <IconInfoMessage
        text={`Past delivery date
          ${ inCart ? "(read only)" : `: Earliest ${strEarliestDate}` }`
        } 
        showIf={timingStatus === 'past'}// && !inCart}
        iconClass={inCart ? "pi pi-fw pi-info-circle" : "pi pi-fw pi-times"}
        iconColor={inCart ? "hsl(218, 43%, 50%)": "#BF0404"}
      />
      {/* <IconInfoMessage
        text={`Past delivery date: Earliest `+`${strEarliestDate}`} 
        showIf={timingStatus === 'past' && !inCart}
        iconClass="pi pi-fw pi-info-circle" 
        iconColor="hsl(218, 43%, 50%)"
      /> */}
      {/* <IconInfoMessage
        showIf={!isAvailable} // && hasAssignedRoute 
        text={`Product not available ${delivDateDT.toFormat('EEEE')}s`} 
        iconClass="pi pi-fw pi-exclamation-triangle" 
        iconColor="hsl(45, 96%, 35%)"
      />
      <IconInfoMessage 
        showIf={!assignedRouteIsValid} // && hasAssignedRoute
        text={
          `${fulfillmentDisplayTextMap[fulfillmentOption]}`
          + ` not available ${strWeekdayFull}s`
        } 
        iconClass="pi pi-fw pi-exclamation-triangle" 
        iconColor="hsl(45, 96%, 35%)"
      /> */}
      <IconInfoMessage text={`Product not available for 
          ${fulfillmentDisplayTextMap[fulfillmentOption]} 
          ${strWeekdayFull}s`
        } 
        showIf={!isAvailable || !assignedRouteIsValid}
        iconClass={"pi pi-fw pi-exclamation-triangle"} 
        iconColor={"hsl(45, 96%, 35%)"}
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
    </div>
  )
}


// in Production / is delivery date / is past delivery date => report
// in production && in Cart => report max qty

// Given fulfillment option,
//
// No valid routes for option => report option available


{/* 
<IconInfoMessage text="recently deleted" 
  showIf={recentlyDeleted}
  iconClass="pi pi-fw pi-info-circle" 
  iconColor="hsl(218, 43%, 50%)" 
/>
<IconInfoMessage text={`In production (max ${maxQty})`} 
  showIf={timingStatus === 'prod' && maxQty > 0}
  iconClass="pi pi-fw pi-info-circle"
  iconColor={!!qty ? "hsl(218, 43%, 50%)" : ""}
/>
<IconInfoMessage text="In production" 
  showIf={timingStatus === 'prod' && maxQty === 0}
  iconClass="pi pi-fw pi-times" 
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
<IconInfoMessage text={
    `${fulfillmentDisplayTextMap[fulfillmentOption]}`
    + ` not available for ${weekdayLong}s`
  } 
  showIf={!routeIsAvailable}
  textStyle={{fontWeight: !!qty ? "bold" : ""}}
  iconClass={"pi pi-fw pi-exclamation-triangle"} 
  iconColor={!!qty ? "hsl(45, 96%, 35%)"  : ""}
/>
<IconInfoMessage text={`Item not available ${weekdayLong}s`} 
  showIf={!isAvailable}
  textStyle={{fontWeight: !!qty ? "bold" : ""}}
  iconClass={"pi pi-fw pi-exclamation-triangle"} 
  iconColor={!!qty ? "hsl(45, 96%, 35%)"  : ""}
/> 
*/}