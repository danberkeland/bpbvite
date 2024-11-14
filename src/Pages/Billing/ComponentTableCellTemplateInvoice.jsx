import React from "react"
import { useRef, useState } from "react"

import { Button } from "primereact/button"

import { Menu } from "primereact/menu"
import { confirmDialog } from "primereact/confirmdialog"
import { Toast } from "primereact/toast"

import { useSettingsStore } from "../../Contexts/SettingsZustand"

export const InvoiceCellTemplate = ({ row, syncData, sendEmail, getPdf }) => {
  const setIsLoading = useSettingsStore(state => state.setIsLoading)
  const menuRef = useRef(null)
  const toastRef = useRef(null)
  // const [visible, setVisible] = useState(false)

  const iconClassName = row.invoicingStrategy === "no invoice" ? "pi pi-ban"
    : row.invoicingStrategy === "print only" ? "pi pi-print"
    : "pi pi-at"

  const DocNumber = row.invoice.DocNumber
  
  const text = row.invoiceFlags.exists ? <><div className="show-min-sm">{DocNumber}</div><div className="show-max-sm">...{DocNumber.slice(8)}</div></>
    : row.invoiceFlags.readyToSyncData ? <div>not found</div>
    : <div>n/a</div> 
  
  const textPlain = row.invoiceFlags.exists ? DocNumber
  : row.invoiceFlags.readyToSyncData ? "not found"
  : "n/a"

  const suggestedAction = row.invoiceFlags.readyToCreate ? "create"
    : row.invoiceFlags.readyToDelete ? "delete"
    : row.invoiceFlags.readyToUpdate ? "update"
    : row.invoiceFlags.exists ? "re-sync" : "create"
  
  const cannotSyncReason = !row.invoiceFlags.option_syncData ? "Customer does not get invoiced"
    : row.invoiceFlags.emailSent ? "email has already been sent"
    : row.isOrderDeleted && !row.invoiceFlags.exists ? "No invoice to create"
    : null

  const handleSync = () => {
    if (!!cannotSyncReason) {
      toastRef.current.show({ 
        severity: "warn", 
        summary: "Cannot Sync with QB", 
        detail: cannotSyncReason, 
        life: 3000 
      })
      return 
    }

    const warnMessage = 
      suggestedAction === "re-sync"
        ? 'Data is already synced. Resend data anyway?' : 
      row.invoiceFlags.readyToSyncDataStrict === false
        ? 'This is not an invoice for today or tomorrow. Sync data anyway?'
        : null

    confirmDialog({
      header: !!warnMessage ? 'YOU MIGHT BE DOING SOMETHING DUMB' : `Confirm: ${row.locNick}`,
      message: warnMessage ?? 'Do you want to send data to QB?',
      icon: !!warnMessage
        ? 'pi pi-exclamation-triangle'
        : 'pi pi-info-circle',
      accept: async () => {
        setIsLoading(true)
        const { errors } = await syncData(row)
        setIsLoading(false)
        if (!errors) {
          toastRef.current.show({ 
            severity: "success", 
            summary: "Synced with QB", 
            detail: `${suggestedAction} successful`, 
            life: 3000 
          })
        } else {
          toastRef.current.show({ 
            severity: "danger", 
            summary: `Error on ${suggestedAction}`, 
            detail: `Try refreshing the page before taking further action on the item.`, 
            sticky:true
          })
        }
      },
    })

  }

  const cannotSendReason = row.invoiceFlags.emailSent ? "Email has already been sent"
    : !row.invoiceFlags.option_sendEmail ? "Customer does not get email invoices"
    : !row.invoiceFlags.exists ? "Invoice does not exist"
    : row.invoiceFlags.readyToSyncData ? "Sync data with QB first"
    : null

  const handleSend = () => {
    if (!!cannotSendReason) {
      toastRef.current.show({ 
        severity: "warn", 
        summary: "Cannot send email", 
        detail: cannotSendReason, 
        life: 3000 
      })
      return 
    }

    const warnMessage = row.invoiceFlags.readyToSendEmailStrict === false
      ? 'This is not an invoice for today. Sync the email anyway?'
      : null

    confirmDialog({
      header: !!warnMessage ? 'YOU MIGHT BE DOING SOMETHING DUMB' : `Confirm: ${row.locNick}`,
      message: warnMessage ?? 'Do you want send the email?',
      icon: !!warnMessage
        ? 'pi pi-exclamation-triangle'
        : 'pi pi-info-circle',
      accept: async () => {
        setIsLoading(true)
        await sendEmail(row).then(result => { console.log(`${row.locNick}: email sent`, result) })
        setIsLoading(false)
        toastRef.current.show({ 
          severity: "success", 
          summary: "Success", 
          detail: `Email sent`, 
          life: 3000 
        })
      },
    })


  }

  const cannotPrintReason = !row.invoiceFlags.exists ? "Invoice does not exist" 
    : row.invoiceFlags.readyToSyncData ? "Sync data with QB first"
    : null

  const handlePrint = () => {
    if (!!cannotPrintReason) {
      toastRef.current.show({ 
        severity: "warn", 
        summary: "Cannot get PDF", 
        detail: cannotPrintReason, 
        life: 3000 
      })
      return
    }

    confirmDialog({
      header: `Confirm: ${row.locNick}`,
      message: 'Download PDF?',
      icon: 'pi pi-info-circle',
      accept: async () => {
        setIsLoading(true)
        await getPdf(row)
        setIsLoading(false)
        toastRef.current.show({ 
          severity: "success", 
          summary: "Success", 
          detail: `Email sent`, 
          life: 3000 
        })
      },
    })
  }

  const menuModel = [{
    label: textPlain,
    items: [
      { icon: "pi pi-refresh", label: `Sync with QB${!!cannotSyncReason ? " ( ! )" : ""}`, command: () => handleSync() },
      { icon: "pi pi-send",    label: `Send email${!!cannotSendReason ? " ( ! )" : ""}`,   command: () => handleSend() },
      { icon: "pi pi-print",   label: `Get PDF${!!cannotPrintReason ? " ( ! )" : ""} `,  command: () => handlePrint() }
    ],
  }]

  return (
    <div>
      <Button 
        className="p-button-text"
        style={{paddingInline: ".25rem"}}
        label={
          <div style={{display: "flex", alignItems: "center", gap: ".25rem"}}>
            <i className="pi pi-chevron-down "/>
            <i className={iconClassName} />
            <span className="show-min-xs">{text}</span>
          </div>
        }
        onClick={e => menuRef.current.toggle(e)}
      />
      <Menu 
        popup ref={menuRef} 
        model={menuModel}
      />
      <Toast ref={toastRef} position="bottom-right" />
    </div>

  )
}

