import React, { useState, useRef } from 'react'

import { Button } from "primereact/button"
import { Toast } from "primereact/toast"

import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog'
import { reformatProdName } from '../../../../Orders10/_utils/reformatProdName'
import { submitCartOrder } from '../../../functions/submitCartOrder'
import { useSettingsStore } from '../../../../../../Contexts/SettingsZustand'
import { Dialog } from 'primereact/dialog'

const fulfillmentDisplayTextMap = {
  'deliv': 'Delivery for',
  'slopick': 'SLO Pickup for',
  'atownpick': 'Carlton Pickup for',
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
  disableInputs,
  orderHasChanges,
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
    !cartMeta[item.prodNick].routeIsValid && item.qty !== 0
  )
  const inProdFlag = cartItems.some(item => 
    item.qty > cartMeta[item.prodNick].maxQty 
    && cartMeta[item.prodNick].productIsInProd
  )
  const cartIsValid = !overMaxFlag && !invalidRouteFlag
  const disabled = disableInputs 
    || (!cartIsValid && user.authClass !== 'bpbfull')


  const handleSubmit = async () => {
    setIsLoading(true)
    if (!navigator.onLine) {
      setIsLoading(false)
      setShowNoConnectionDialog(true)
      return
    }
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


  const cnfDialogHeader = () => {
    return (
      <>
        <div style={{marginBottom: ".5rem"}}>
          {`${fulfillmentDisplayTextMap[cartHeader.route]}`}
        </div>
        <div>{`${delivDateDT.toFormat('EEEE, MMM d')}`}</div>
        {invalidRouteFlag && <div>Warning: invalid route</div>}
        {inProdFlag && <div>Warning: increasing in-prod qty</div>}
      </>
    )
  }

  const cnfDialogBody = () => {
    return (
      <div>
        {
          cartItems.filter(item => 
            (item.baseQty !== item.qty) || item.qty !==0
          ).map((item, idx) => {
            const { prodNick, qty } = item
            const { prodName, packSize } = products[prodNick]

            return (
              <div key={`cnf-order-item-${idx}`} 
                style={{ display: "flex", gap: ".5rem", marginBottom: ".2rem" }} 
              >
                <span style={{ width: "1.75rem", textAlign: "end" }}>
                  {qty}
                </span>
                <span style={{ flex: "0 1 12rem" }}>
                  {reformatProdName(prodName, packSize)}
                </span>
              </div>
            )
          })
        }
      </div>
    )
  }

  // const confirmSubmit = () => {
  //   confirmDialog({
  //     header: cnfDialogHeader,
  //     message: cnfDialogBody,
  //     acceptLabel: "Confirm Order",
  //     rejectLabel: "Go Back",
  //     accept: handleSubmit,
  //     reject: () => console.log("cancel submit"),
  //   })
  // }

  return (<>
    <Button label="Submit Order" 
      style={{
        background: !disabled && orderHasChanges 
          ? "var(--bpb-background-0)"
          : '',
        fontSize: "1.1rem"
      }}
      disabled={disabled}
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