import React, { useRef } from "react"
import { Button } from "primereact/button"

import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"

import { useCartDataByLocation, useStandingDataByLocation } from "../../data/orderHooks"
import { Toast } from "primereact/toast"
import { submitStandingOrder } from "../../functions/submitStandingOrder"

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

export const StandingSubmitButton = ({
  standingData={header:{}, items:{}},
  standingHeader={},
  standingItems={},
  location,
  products,
  ORDER_DATE_DT,
  user,
}) => {
  const toastRef = useRef(null)
  const locNick = location?.locNick
  const {
    submitMutations:submitCart, 
    updateLocalData:updateLocalCart
  } = useCartDataByLocation({ locNick, shouldFetch: !!locNick })

  const {
    submitMutations:submitStanding, 
    updateLocalData:updateLocalStanding
  } = useStandingDataByLocation({ locNick, shouldFetch: !!locNick })

  const submitFunctions = {
    submitCart, updateLocalCart, submitStanding, updateLocalStanding
  }

  const itemsHaveChanges = Object.keys(standingItems).some(key =>
    (standingItems[key].qty) !== (standingData.items[key]?.qty ?? 0)
  )

  const cnfDialogHeader = () => {
    return "Confirm Changes"
  }

  const cnfDialogBody = () => {
    return (<div style={{maxWidth: "20rem"}}>
      <p style={{marginTop: "0"}}>
        Changes will take effect 
        <b> {ORDER_DATE_DT.plus({ days: 4 }).toFormat('EEEE, MMM d')}</b>.
      </p>
      <p>
        Orders up to the effect date can still be edited 
        on the cart order page.
      </p>
    </div>)
  }


  const confirmSubmit = () => {
    confirmDialog({
      header: cnfDialogHeader,
      message: cnfDialogBody,
      acceptLabel: "Submit",
      rejectLabel: "Go Back",
      accept: () => submitStandingOrder({
        standingData,         // header + item data straight from the database
        standingHeader,       // future: header data might be editable?
        standingItems,        // data with possible changes
        location,
        products,
        ORDER_DATE_DT,
        user,
        ...submitFunctions,
      }),
      reject: () => console.log("cancel submit"),
    })
  }

  return (
    <>
      <Button 
        label="Submit Changes"
        //disabled={!itemsHaveChanges}
        onClick={() => {
          if (itemsHaveChanges) confirmSubmit()
          else toastRef.current.show(toasts.noChange)
        }}
        style={{
          fontSize:'1.1rem',
          background: itemsHaveChanges ? "var(--bpb-background-0)" : ""
        }} 
      />
      <ConfirmDialog />
      <Toast ref={toastRef} 
        style={{ width: "15rem", opacity: ".98" }}
      />
    </>
  )

}


