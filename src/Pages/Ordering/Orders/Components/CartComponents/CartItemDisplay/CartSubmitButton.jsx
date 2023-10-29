import React, { useState, useRef } from 'react'

import { Button } from "primereact/button"
import { Toast } from "primereact/toast"

import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog'
import { reformatProdName } from '../../../../Orders10/_utils/reformatProdName'
import { submitCartOrder } from '../../../functions/submitCartOrder'
import { useSettingsStore } from '../../../../../../Contexts/SettingsZustand'
import { Dialog } from 'primereact/dialog'
import { sortBy } from 'lodash'

const northZones = ['atownpick', '46', 'Atown', 'Margarita', 'Paso', 'Templeton', 'Tin City']

const fulfillmentDisplayTextMap = {
  'deliv': 'Delivery',
  'slopick': 'SLO Pickup',
  'atownpick': 'Carlton Pickup',
}

const noChangeToast = { 
  summary: 'No changes detected', 
  detail: 'Nothing to submit.', 
  severity: 'info', 
  life: 8000 
  // sticky: true
}
const errorToast = { 
  summary: 'Error', 
  detail: 'Submit failed', 
  severity: 'warn', 
  // life: 8000 
  sticky: true
  }
const successToast = { 
  summary: 'Confirmed', 
  detail: 'Order received', 
  severity: 'success', 
  life: 8000
}
const successToastWithEmail = { 
  summary: 'Confirmed', 
  detail: 'Email confirmation sent', 
  severity: 'success', 
  life: 8000
}
const toasts = {
  noChange: noChangeToast, 
  error: errorToast, 
  success: successToast, 
  successEmail: successToastWithEmail
}

const WarnIcon = () => {
  return <i className="pi pi-fw pi-exclamation-triangle" 
    style={{color: 'hsl(45, 96%, 35%)'}} 
  />

}

const signedNumber = (number) => {
  return new Intl.NumberFormat('en-US', {
    signDisplay: 'always',
    useGrouping: false,
  }).format(number)

}

export const CartSubmitButton = ({ 
  location,
  products,
  cartOrder,
  cartHeader,
  cartItems=[],
  cartMeta,
  cartCache,
  user,
  delivDateJS,
  delivDateDT,
  relativeDelivDate,
  disableInputs,
  deactivated,
  orderHasChanges,
  wSize,
}) => {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading)
  const toastRef = useRef(null)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [showNoConnectionDialog, setShowNoConnectionDialog] = useState(false)

  // const cartIsValid = cartItems.every(item => 
  //   cartMeta[item.prodNick].routeIsValid
  //   && item.qty <= cartMeta[item.prodNick].maxQty 
  // )
  const overMaxFlag = cartItems.some(item => 
    item.qty > cartMeta[item.prodNick].maxQty 
  )
  const invalidRouteFlag = cartItems.some(item =>
    // !cartMeta[item.prodNick].routeIsValid && item.qty !== 0
    !cartMeta[item.prodNick].routeIsValid && item.qty !== item.baseQty
  )
  const noRouteAvailableFlag = cartItems.some(item =>
    !products[item.prodNick].meta.assignedRouteSummary.routeOption.routeIsAvailable 
  )
  console.log("CART META:", cartMeta)

  const inProdFlag = cartItems.some(item => 
    item.qty > cartMeta[item.prodNick].maxQty 
    && cartMeta[item.prodNick].productIsInProd
  )
  const cartIsValid = !overMaxFlag && !invalidRouteFlag
  const disabled = disableInputs 
    || (!cartIsValid && user.authClass !== 'bpbfull')

  const relativeDateString = relativeDelivDate === 0
    ? "Today"
    : relativeDelivDate === 1
      ? "(Tomorrow)"
      : relativeDelivDate > 1
        ? `(T +${relativeDelivDate})`
        : ''

  const handleSubmit = async () => {
    if (!navigator.onLine) {
      setShowNoConnectionDialog(true)
      return
    }
    setIsLoading(true)
    const result = await submitCartOrder({ 
      location,
      products,
      cartOrder,
      cartHeader,
      cartItems,
      cartCache,
      user,
      delivDateJS,
    })
    console.log(result)
    if (result ==='error') { setShowErrorDialog(true) }
    else { toastRef.current.show(toasts[result]) }
    setIsLoading(false)
  }

  //console.log('BBBBB', location)
  const cnfDialogHeader = () => {
    const showPickupWarning = user.authClass === 'bpbfull'
      && (
        (northZones.includes(location.zoneNick) && cartHeader.route === 'slopick')
        || (!northZones.includes(location.zoneNick) && cartHeader.route === 'atownpick')

      )
    const showFulfillWarning = user.authClass === 'bpbfull'
      && cartHeader.route !== cartHeader.meta.defaultRoute

    return (
      <>
        <div>
          {user.authClass === 'bpbfull' && location.locName}
        </div>
        <div style={{
          color: showPickupWarning ? 'red'
            : showFulfillWarning ? 'hsl(45, 96%, 35%)' 
            : ''
        }}>
          {`${fulfillmentDisplayTextMap[cartHeader.route]}`}
          {showPickupWarning ? ' (Are You Sure?)'
            : showFulfillWarning ? ' (Alternate)'
            : ''
          }
        </div>
        <div>{delivDateDT.toFormat('EEEE, MMM d')} {relativeDateString}</div>
        {noRouteAvailableFlag && user.authClass === 'bpbfull' && 
          <div><WarnIcon /> Route: 'NOT ASSIGNED' <WarnIcon /></div>
        }
        {inProdFlag && user.authClass === 'bpbfull' &&
          <div><WarnIcon /> Over in-prod max <WarnIcon /></div>
        }
      </>
    )
  }

  const cnfDialogBody = () => {
    const displayItems = sortBy(
      cartItems.filter(item => item.baseQty !== item.qty || item.qty !== 0),
      item => products[item.prodNick].prodName
    )

    return (
      <table style={{boxSizing: 'content-box', }}>
        <colgroup>
          <col />
          <col style={{width: wSize === 'lg'? "" : "14rem"}}/>
          {wSize === 'lg' && <col />} 
        </colgroup>
        <thead>
          <tr>
            <th aria-label="quantity"></th>
            <th aria-label="product"></th>
            {wSize === 'lg' && <th aria-label="quantity change"></th>}
          </tr>
        </thead>
        <tbody>
          {displayItems.map((item, idx) => {
            const { prodNick, baseQty, qty } = item
            const { prodName, packSize } = products[prodNick]
            const maxQty = cartMeta[item.prodNick].maxQty
            
            const diff = (qty !== baseQty && baseQty !== 0)
              ? `(${signedNumber(qty - baseQty)})`
              : "" 
            

            return(
              <tr 
                key={`text-table-row-${idx}`}
                style={{
                  fontWeight: qty !== baseQty ? "bold" : "",
                  color: item.qty > maxQty
                    ? 'hsl(45, 96%, 35%)'
                    : '',
                }}
              >
                <td>{qty}</td>
                <td>{reformatProdName(prodName, packSize)}</td>
                {wSize === 'lg' && <td>{diff}</td>}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }



  return (<>
    <Button label={!deactivated ? "Submit Order" : "Ordering Disabled"}
      style={{
        background: !disabled && orderHasChanges 
          ? "var(--bpb-background-0)"
          : '',
        fontSize: "1.1rem"
      }}
      disabled={disabled || deactivated}
      onClick={() => {
        if (orderHasChanges) confirmDialog({
          header: cnfDialogHeader,
          message: cnfDialogBody,
          acceptLabel: "Confirm Order",
          rejectLabel: "Go Back",
          accept: handleSubmit,
          reject: () => console.log("cancel submit"),
        })
        else toastRef.current.show(noChangeToast)
        // else setShowErrorDialog(true)
      }}
    />
    <ConfirmDialog />
    <Toast ref={toastRef} 
      style={{ width: "15rem", opacity: ".98" }}
    />
    <Dialog visible={showErrorDialog}
      header="Oops, something went wrong."
      onHide={() => setShowErrorDialog(false)}
      style={{maxWidth: "25.5rem", margin: "1rem"}}
    >
      <p>
        Try Refreshing the page and check your entries. 
      </p>
      <p>
        If problems persist you can still place your order 
        through our hotline at (805) 242-4403.
      </p>
    </Dialog>
    <Dialog visible={showNoConnectionDialog}
      header="Couldn't find the Internet."
      onHide={() => setShowNoConnectionDialog(false)}
      style={{maxWidth: "25.5rem", margin: "1rem"}}
    >
      <p>Your changes have not been submitted.</p>
      <p>
        Please try reconnecting or waiting 
        a bit before submitting again.
      </p>
    </Dialog>
  </>)

}