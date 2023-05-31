import { maxBy } from "lodash"
import { DateTime } from "luxon"
import { Dialog } from "primereact/dialog"
import TimeAgo from "timeago-react"

export const CartHeaderSummary = ({
  showOrderDateDialog, 
  setShowOrderDateDialog,
  cartHeader,             // cart props
  cartItems,              // ...
  delivDateDT,            // date props
  orderLeadTime,          // ...
  ORDER_DATE_DT,          // ...
  wSize,
  user,
}) => {

  const lastEditItem = maxBy(
    cartItems.filter(i => i.orderType === 'C'), 
    item => new Date(item.updatedOn).getTime()
  )

  const fulfillmentString = cartHeader 
  ? cartHeader.route === 'deliv' ? "Delivery"
    : cartHeader.route === 'slopick' ? "SLO Pickup"
    : "Carlton Pickup"
  : "Order"

  const relativeDateString = orderLeadTime === 0 
    ? `Today`
    : orderLeadTime === 1 
      ? "Tomorrow"
      : orderLeadTime > 1 ? `Today +${orderLeadTime}`
    : `Yesterday`

  const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
  const pastCutoff = todayDT.toMillis() !== ORDER_DATE_DT.toMillis()

  const headerMessage = <>
    <div style={{display: "inline-block"}}>
      {`${fulfillmentString}`}
    </div> 
    <div>
      {delivDateDT.toFormat('EEEE, MMM d')} ({relativeDateString})
    </div> 
  </>

  const mobileHeaderMessage = orderLeadTime > 0
    ? <>
        <span style={{display: "inline-block"}}>
          {`For ${delivDateDT.toFormat('EEEE')}`}
        </span> <span style={{display: "inline-block"}}>
            {`(${relativeDateString})`}
        </span>
      </>
    : orderLeadTime === 0
      ? `For Today ${user.authClass !== 'bpbfull' ? "― Read Only" : ""}`
      : `Yesterday ${user.authClass !== 'bpbfull' ? "― Read Only" : ""}`

  return(
    <div className="cart-ui-summary"
      style={{
        color: "hsl(37, 100%, 5%)",
        background: "var(--bpb-surface-content-header)",
        padding: "1px 1rem",
        marginBottom: "1rem",
        borderRadius: "3px",
        boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2),"
          + " 0 1px 1px 0 rgba(0, 0, 0, 0.14),"
          + " 0 1px 3px 0 rgba(0, 0, 0, 0.12)",
      }}
    >
      <div style={{
        fontSize:"1.5rem", 
        fontWeight: "bold", 
        marginBlock: ".75rem"
      }}>
        {wSize === 'lg' ? headerMessage : mobileHeaderMessage}
      </div>
      
      <div 
        style={{
          fontSize: "0.9rem",
          marginBottom: ".25rem", 
          display: "inline-flex", 
          justifyContent: "start",
          alignItems: "baseline",
          gap: ".25rem",
          cursor: "pointer",
        }}
        onClick={() => setShowOrderDateDialog(true)}
      >
        <span>
          {"Your order placement date: "}
        </span>
        <span style={{
          color: pastCutoff ? "hsl(0, 96%, 38%)" : undefined, 
          fontWeight: pastCutoff ? "bold" : undefined, 
          paddingInline: ".25rem"
        }}>
          {ORDER_DATE_DT.toFormat('MMM d')}
        </span>
        <i className="pi pi-question-circle" 
          style={{color: 'hsl(218, 65%, 50%)'}}
        />

      </div> 
      
      <div style={{
        marginBottom: ".75rem", 
        fontSize: "0.9rem",
        color: !!lastEditItem ? "" : "hsla(37, 30%, 20%, .8)"
      }}>
        Last edit: {!!lastEditItem &&
          <em><TimeAgo datetime={lastEditItem.updatedOn}/></em>
        }
      </div>

      <Dialog visible={showOrderDateDialog}
        header="8:00pm Cutoff"
        onHide={() => setShowOrderDateDialog(false)}
        style={{maxWidth: "26rem", margin: ".75rem"}}
      >
        <p>
          Orders placed after 8:00pm will be 
          handled as if placed tomorrow.
        </p>
      </Dialog>

    </div>
  )


}
