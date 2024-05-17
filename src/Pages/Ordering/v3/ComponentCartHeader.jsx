import "./componentCartHeader.css"

export const CartHeader = ({
  delivDT,
  fulfillmentDropdownComponent,
  cartCalendarComponent,
  isMobile,
}) => {

  return (
    <div className={"bpb-cart-header" + (isMobile ? " bpb-cart-header-sticky" : "")}>

      {fulfillmentDropdownComponent()}

      <label htmlFor='cart-header-date-input' style={{display: "block"}}>
        Order Date:
      </label>
      {cartCalendarComponent({ displayMode: isMobile ? "mobile" : "text"})}
      <div style={{fontSize: ".9rem"}}>
        Placement Date: {delivDT.toFormat('MMM d')} <i className="pi pi-fw pi-info-circle" />
      </div>

      {/* {fulfillmentOptionIsAvailable === false &&
        <div style={{display: "flex", alignItems: "center"}}>
          <i className="pi pi-fw pi-exclamation-triangle" />
          {fulfillmentOptions.find(opt => opt.value === fulfillmentOption)?.label} not available on {delivDT.toFormat('EEE')}
        </div>
      } */}

    </div>
  )

}