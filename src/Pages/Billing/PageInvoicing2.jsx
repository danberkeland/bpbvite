import React from "react"
import { useState } from "react"

import { useInvoiceSummaryByDate } from "../../data/invoice/useInvoice"
import { useInvoicing2Data } from "./dataInvoicing2"

import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { DatePickerButton } from "../../components/DatePickerButton"
import { CellTemplates } from "./componentsInvoicing2TableTemplates"

import { DateTime } from "luxon"
import { DT } from "../../utils/dateTimeFns"
import { countBy } from "../../utils/collectionFns"

function PageInvoicing2() {
  const todayDT = DT.today()
  const [reportDT, setReportDT] = useState(todayDT)
  const isToday = reportDT.toMillis() === todayDT.toMillis()
  const isTomorrow = reportDT.toMillis() === todayDT.plus({ days: 1 }).toMillis()
  const onDateChange = e => { setReportDT(DT.fromJs(e.value)) }

  return (
    <div style={{padding: "2rem 8rem"}}>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <div style={{display: "flex", alignItems: "center"}}>
          <span style={{fontSize: "2rem", fontWeight:"bold"}}>
            Invoicing {reportDT.toFormat('MM/dd/yyyy')}
          </span>
          <DatePickerButton 
            jsDate={reportDT.toJSDate()} 
            onChange={onDateChange} 
          />
        </div>
      </div>
      <div style={{marginTop: "1rem", padding: ".25rem 1rem", borderRadius: "6px", backgroundColor: "var(--bpb-surface-content)"}}>
        <p>Using newest version. <a href="/Billing/v3">Go to the previous version</a> to export data to QuickBooks and send emails.</p>
        <p>For now, use this page to check the invoice status of each customer's order for today and tomorrow.</p>
        {isToday &&
          <p>After closing out, reload this page and look for "all items synced" and "all emails sent" on the buttons below.</p>
        }
        {isTomorrow &&
          <p>After closing out, look for "all items synced" on the button below.</p>
        }

      </div>
      <div style={{marginTop: "1rem"}}>
        <InvoiceTable reportDT={reportDT} todayDT={todayDT} />
      </div>
    </div>
  )
}

export { PageInvoicing2 as default }

/**
 * 
 * @param {Object} props
 * @param {DateTime} props.reportDT 
 * @param {DateTime} props.todayDT 
 */
function InvoiceTable({ reportDT, todayDT }) {
  const isToday = reportDT.toMillis() === todayDT.toMillis()
  const isTomorrow = reportDT.toMillis() === todayDT.plus({ days: 1 }).toMillis()

  const { createItem, updateItem, deleteItem } = useInvoiceSummaryByDate({ TxnDate: reportDT.toFormat("yyyy-MM-dd"), shouldFetch: true })

  const { rows, problemRows, orphanedInvoices, toQBInvoice, loadedMakeQbInvoice } = 
    useInvoicing2Data({ reportDT, isToday, isTomorrow, shouldFetch: true })
    
  console.log(rows)
  console.log(problemRows)
  console.log(orphanedInvoices)

  const syncData = async (row) => {
    if (!toQBInvoice || !loadedMakeQbInvoice || !row.invoiceFlags.readyToSyncData) {
      console.log("not allowed to sync")
      return
    }

    if (row.invoiceFlags.readyToDelete) {
      const { Id, SyncToken } = row.invoice
      // console.log("delete:", { Id, SyncToken })
      await deleteItem({ Id, SyncToken })
      return
    }
    if (row.invoiceFlags.readyToCreate) {
      const Invoice = toQBInvoice(row.order)
      // console.log("create:", Invoice)
      // const _Invoice = loadedMakeQbInvoice(row)
      // console.log("_create:", _Invoice)
      // console.log("equal?", isEqual(Invoice, _Invoice))
      await createItem(Invoice)
      return
    }
    if (row.invoiceFlags.readyToUpdate) {
      const { Id, SyncToken } = row.invoice
      const Invoice = { ...toQBInvoice(row.order), Id, SyncToken }
      // console.log("update:", Invoice)
      // const _Invoice = { ...loadedMakeQbInvoice(row), Id, SyncToken }
      // console.log("_update:", _Invoice)
      // console.log("equal?", isEqual(Invoice, _Invoice))
      await updateItem(Invoice)
      return
    }
    console.log("could not determine action")
  }

  const handleBatchSyncNecessary = async () => {
    const syncRows = rows.filter(row => row.invoiceFlags.readyToSyncData)
    console.log(syncRows)

  }
  const handleBatchSyncAllElligible = async () => {
    const syncRows = rows.filter(row => row.invoiceFlags.option_syncData && !row.invoiceFlags.emailSent)
    console.log(syncRows)

  }

  const sendEmail = row => {
    if (!row.invoiceFlags.readyToSendEmail) return
    const data = { Id: row.invoice.Id }
    console.log(data)
  }

  const handleBatchSendEmail = async () => {
    const emailRows = rows.filter(row => row.invoiceFlags.readyToSendEmail)
    console.log(emailRows)
  }

  const nEmailsExpected = countBy(rows, row => row.invoiceFlags.emailExpected)
  const nEmailsSent = countBy(rows, row => row.invoiceFlags.emailSent)
  const nSendEmailRemaining = countBy(rows, row => !row.invoiceFlags.emailSent && row.invoiceFlags.emailExpected)
  const nReadyToSendEmail = countBy(rows, row => row.invoiceFlags.readyToSendEmail)

  const nReadyToSyncData = countBy(rows, row => row.invoiceFlags.readyToSyncData)
  const nCanSync = countBy(rows, row => row.invoiceFlags.option_syncData)
  const nSynced = countBy(rows, row => !row.invoiceFlags.readyToSyncData)
  
  const allItemsSynced = nReadyToSyncData === 0
  const allItemsSent = nEmailsExpected === nEmailsSent

  return (
    <div>
      <div style={{display: "flex", gap: "1rem", marginBottom: "1rem"}}>
        {(isToday || isTomorrow) && 
          <Button onClick={handleBatchSyncNecessary} disabled>
            Sync data with QB ({allItemsSynced ? "all items synced" : `${nReadyToSyncData} ready to sync`})
          </Button>
        }
        {(isToday) && 
          <Button onClick={handleBatchSendEmail} disabled>
            send Emails ({allItemsSent ? "all items sent" : `${nReadyToSendEmail}/${nSendEmailRemaining} ready to send`})
          </Button>
        }
      </div>
      <DataTable value={rows} size="small" scrollable scrollHeight="75vh" responsiveLayout="scroll" >
        <Column 
          header="Customer" 
          body={row => CellTemplates.Customer(row)} 
          style={{minWidth: "12rem"}}  
        />
        <Column 
          header="Order"
          body={row => CellTemplates.Order(row)} 
          style={{minWidth: "7rem", flex: ".25 .25 7rem"}} 
        />
        <Column 
          header="Inv Type" 
          body={row => CellTemplates.InvoiceType(row)} 
          style={{minWidth: "7rem", flex: ".15 .215 7rem"}} 
        />
        <Column 
          header="Invoice"
          body={row => CellTemplates.Invoice(row)} 
          style={{minWidth: "10rem", flex: ".5 .5 10rem"}} 
        />
        <Column 
          header="Synced with QB"
          // header={<div>Synced with QB ({nSynced}/{nCanSync})</div>} 
          body={row => CellTemplates.InvoiceSynced(row, syncData)} 
        />
        <Column 
          header="Email Sent"
          // header={<div>Email Sent ({nEmailsSent}/{nEmailsExpected})</div>} 
          body={row => CellTemplates.EmailSent(row)} 
        />
      </DataTable>
    </div>
  )
}

