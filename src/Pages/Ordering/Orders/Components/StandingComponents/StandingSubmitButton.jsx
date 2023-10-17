import React, { useState, useRef } from "react"
import { Button } from "primereact/button"

import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { Dialog } from "primereact/dialog"
import { useCartDataByLocation, useStandingDataByLocation } from "../../data/orderHooks"
import { Toast } from "primereact/toast"
import { submitStandingOrder } from "../../functions/submitStandingOrder"
import { useSettingsStore } from "../../../../../Contexts/SettingsZustand"
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
  detail: 'Standing order has been updated', 
  severity: 'success', 
  life: 8000
}
// const successToastWithEmail = { 
//   summary: 'Confirmed', 
//   detail: 'Email confirmation sent', 
//   severity: 'success', 
//   life: 8000
// }
const toasts = {
  noChange: noChangeToast, 
  error: errorToast, 
  success: successToast, 
  // successEmail: successToastWithEmail
}

export const StandingSubmitButton = ({
  standingData={header:{}, items:{}},
  standingHeader={},
  standingItems={},
  location,
  products,
  ORDER_DATE_DT,
  user,
  disabled,
}) => {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading)
  // const isLoading = useSettingsStore((state) => state.isLoading)
  const toastRef = useRef(null)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [showNoConnectionDialog, setShowNoConnectionDialog] = useState(false)
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
      accept: async () => {
        setIsLoading(true)
        try{
          const result = await submitStandingOrder({
            standingData,         // header + item data straight from the database
            standingHeader,       // future: header data might be editable?
            standingItems,        // data with possible changes
            location,
            products,
            ORDER_DATE_DT,
            user,
            ...submitFunctions,
          })
          if (result ==='error') { 
            setIsLoading(false)
            setShowErrorDialog(true) 
          }
          else toastRef.current.show(toasts[result])
        } catch (err) {
          console.error(err)
          setIsLoading(false)
        } finally {
          setIsLoading(false)
        }

      },
      reject: () => console.log("cancel submit"),
    })
  }

  return (
    <>
      <Button 
        label={!disabled ? "Submit Changes" : "Ordering Disabled"}
        //disabled={!itemsHaveChanges}
        disabled={disabled}
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
    </>
  )

}


