import React, { useEffect } from "react"
import { useState } from "react"

import { useInvoiceSummaryByDate } from "../../data/invoice/useInvoice"
import { useInvoicing2Data } from "./dataInvoicing2"

import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { DatePickerButton } from "../../components/DatePickerButton"

import { DateTime } from "luxon"
import { DT } from "../../utils/dateTimeFns"
import { countBy } from "../../utils/collectionFns"
import { HelpDialog } from "./ComponentHelpDialog"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { useSettingsStore } from "../../Contexts/SettingsZustand"
import { downloadPDF } from "../../utils/pdf/downloadPDF"
import { QB2 } from "../../data/qbApiFunctions"
import { rankedSearch } from "../../utils/textSearch"
import { InputText } from "primereact/inputtext"

import { useOrdersByDelivDate } from "../../data/order/useOrders"
import { OrderCellTemplate } from "./ComponentTableCellTemplateOrder"
import { InvoiceCellTemplate } from "./ComponentTableCellTemplateInvoice"
import { EmailSentCellTemplate, InvoiceSyncedCellTemplate } from "./ComponentTableCellTemplateOther"

function PageInvoicing2() {
  const todayDT = DT.today()
  const [reportDT, setReportDT] = useState(todayDT)
  const isToday = reportDT.toMillis() === todayDT.toMillis()
  const isTomorrow = reportDT.toMillis() === todayDT.plus({ days: 1 }).toMillis()
  const onDateChange = e => { setReportDT(DT.fromJs(e.value)) }

  return (
    <div style={{maxWidth: "40rem", padding: "2rem .25rem", margin: "auto"}}>
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
        <p>Using newest version. <a href="/Billing/v3">Go to the previous version</a>.</p>

      </div>
      <div style={{marginTop: "1rem"}}>
        <InvoiceTable reportDT={reportDT} todayDT={todayDT} />
      </div>
    </div>
  )
}

export { PageInvoicing2 as default }

/**
 * @param {Object} props
 * @param {DateTime} props.reportDT 
 * @param {DateTime} props.todayDT 
 */
function InvoiceTable({ reportDT, todayDT }) {
  const isLoading = useSettingsStore(state => state.isLoading)
  const setIsLoading = useSettingsStore(state => state.setIsLoading)
  const reportDate = reportDT.toFormat('yyyy-MM-dd')
  const isToday = reportDT.toMillis() === todayDT.toMillis()
  const isTomorrow = reportDT.toMillis() === todayDT.plus({ days: 1 }).toMillis()

  const invoiceCache = useInvoiceSummaryByDate({ TxnDate: reportDT.toFormat("yyyy-MM-dd"), shouldFetch: true })
  

  // const { submitMutations } = useOrdersByDelivDate({ delivDate: reportDT.toFormat("yyyy-MM-dd"), shouldFetch: true })

  const { 
    rows, 
    // invoicesForReview, 
    toQBInvoice, 
    loadedMakeQbInvoice,
    batchGetPdfs,
  } = useInvoicing2Data({ reportDT, isToday, isTomorrow, shouldFetch: true })

  const syncData = async (row) => {
    if (!toQBInvoice || !loadedMakeQbInvoice || !row.invoiceFlags.readyToSyncData) {
      console.log("not allowed to sync")
      return
    }

    if (row.invoiceFlags.readyToDelete) {
      const { Id, SyncToken } = row.invoice
      console.log("delete:", { Id, SyncToken })
      const result = await invoiceCache.deleteItem({ Id, SyncToken })
      invoiceCache.updateLocalData(result)
      return result
    }
    if (row.invoiceFlags.readyToCreate) {
      const Invoice = toQBInvoice(row.order)
      console.log("create:", Invoice)
      // const _Invoice = loadedMakeQbInvoice(row)
      // console.log("_create:", _Invoice)
      // console.log("equal?", isEqual(Invoice, _Invoice))
      const result = await invoiceCache.createItem(Invoice)
      invoiceCache.updateLocalData(result)
      return result
    }
    if (row.invoiceFlags.readyToUpdate) {
      const { Id, SyncToken } = row.invoice
      const Invoice = { ...toQBInvoice(row.order), Id, SyncToken }
      // console.log("update:", Invoice)
      // const _Invoice = { ...loadedMakeQbInvoice(row), Id, SyncToken }
      // console.log("_update:", _Invoice)
      // console.log("equal?", isEqual(Invoice, _Invoice))
      const result = await invoiceCache.updateItem(Invoice)
      invoiceCache.updateLocalData(result)
      return result
    }
    console.log("could not determine action")
  }

  const sendEmail = async (row) => {
    if (!row.invoiceFlags.readyToSendEmail) return
    const result = await invoiceCache.sendEmail({ Id: row.invoice.Id })
    invoiceCache.updateLocalData(result)
    return result
  }

  const getPdf = (row) => QB2.invoice
    .getPdf({ Id: row.invoice.Id })
    .then(data => downloadPDF([data], `Invoice_${reportDate}_${row.locNick}`))

  const [pdfFetchCount, setPdfFetchCount] = useState(null)
  const confirmBatchGetPdf = () => {
    if (!batchGetPdfs) return
    confirmDialog({
      message: 'Download PDF invoices?',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      accept: async () => {
        setIsLoading(true)
        await batchGetPdfs(setPdfFetchCount)
        setIsLoading(false)
        setPdfFetchCount(null)
      },
    })

  }


  const handleBatchSyncNecessary = async () => {
    const syncRows = rows.filter(row => row.invoiceFlags.readyToSyncData)
    for (let row of syncRows) {
      await syncData(row)
    }
  }


  const confirmBatchSyncNecessary = () => {
    resetLocationQuery()
    confirmDialog({
      message: 'Do you want to send data to QB?',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      accept: async () => {
        setIsLoading(true)
        await handleBatchSyncNecessary()
        setIsLoading(false)
      },
    })
  }

  const handleBatchSyncAllElligible = async () => {
    const syncRows = rows.filter(row => row.invoiceFlags.option_syncData && !row.invoiceFlags.emailSent)
    for (let row of syncRows) {
      await syncData(row)
    }
  }



  const handleBatchSendEmail = async () => {
    resetLocationQuery()
    const emailRows = rows.filter(row => row.invoiceFlags.readyToSendEmail)
    console.log("emailRows", emailRows)
    let errorList = []
    for (let row of emailRows) {
      const result = await sendEmail(row)
      if (!!result?.errors) errorList.push(result.errors)
    }
    if (errorList.length) {
      console.log("error list", errorList)
    }
    return errorList.length ? errorList : null
  }

  const confirmBatchSendEmail = () => {
    confirmDialog({
        message: 'Do you want to send out emails?',
        header: 'Confirm',
        icon: 'pi pi-info-circle',
        accept: async () => {
          setIsLoading(true)
          await handleBatchSendEmail()
          setIsLoading(false)
        },
        reject: () => {console.log("Rejected.")},
    })
  }


  const nEmailsExpected = countBy(rows, row => row.invoiceFlags.emailExpected)
  const nEmailsSent = countBy(rows, row => row.invoiceFlags.emailSent)
  const nSendEmailRemaining = countBy(rows, row => !row.invoiceFlags.emailSent && row.invoiceFlags.emailExpected)
  const nReadyToSendEmail = countBy(rows, row => row.invoiceFlags.readyToSendEmail)

  const nReadyToSyncData = countBy(rows, row => row.invoiceFlags.readyToSyncData)
  // const nCanSync = countBy(rows, row => row.invoiceFlags.option_syncData)
  // const nSynced = countBy(rows, row => !row.invoiceFlags.readyToSyncData)

  const nItemsSentAndOutOfSync = countBy(rows, row => row.issues[0].hasIssue)

  
  const allItemsSynced = nReadyToSyncData === 0
  const allItemsSent = nEmailsExpected === nEmailsSent

  const [showHelp, setShowHelp] = useState(false)

  const [locationQuery, setLocationQuery] = useState("")
  function resetLocationQuery() { setLocationQuery("") }
  useEffect(resetLocationQuery, [reportDT])
  const displayRows = rankedSearch(locationQuery, rows, ['locNick', 'locNameDisplay'])
  const locationSearchBar =               
    <span className="p-input-icon-right" style={{flex: "1 .5 9rem"}}>
      {!!locationQuery
        ? <i className="pi pi-fw pi-times" style={{cursor: "pointer"}} onClick={resetLocationQuery}/>
        : <i className="pi pi-fw pi-search" />
      }
      <InputText 
        placeholder="Order"
        value={locationQuery}
        onChange={e => setLocationQuery(e.target.value)}
        onFocus={e => e.target.select()}
        style={{width: "100%"}}
        disabled={!rows || !rows?.length}
      />
    </span>

  return (
    <div>
      <ConfirmDialog />
      <div style={{display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: "1rem"}}>
        <div style={{display: "flex", gap: "1rem"}}>
          {(isToday || isTomorrow) && 
            <Button onClick={confirmBatchSyncNecessary} disabled={allItemsSynced || isLoading}>
              <span>
                Sync data with QB<br/>
                ({allItemsSynced ? "all items synced" : `${nReadyToSyncData} ready to sync`})
              </span> 
            </Button>
          }
          {(isToday) && 
            <Button onClick={confirmBatchSendEmail} disabled={allItemsSent || isLoading}>
              <span>
                send Emails<br/>
                ({allItemsSent ? "all items sent" : `${nReadyToSendEmail}/${nSendEmailRemaining} ready`})
              </span>
            </Button>
          }
          {(isTomorrow) &&
            <Button onClick={confirmBatchGetPdf} disabled={!allItemsSynced || isLoading}>
              <span>
                Get PDFs<br/>
                ({ pdfFetchCount !== null ? pdfFetchCount : (allItemsSynced ? "Ready" : `sync all first`) })
              </span>
            </Button>
          }
        </div>
        <Button label="Help" onClick={() => { setShowHelp(true) }} />
      </div>
      {nItemsSentAndOutOfSync > 0 && issuesMsg(nItemsSentAndOutOfSync)}
      <div style={{maxWidth: "40rem"}}>
        <DataTable 
          value={displayRows} 
          size="small" 
          scrollable 
          responsiveLayout="scroll" 
          className={isToday ? '' : 'not-today'}
        >
          <Column 
            header={locationSearchBar}
            body={row => OrderCellTemplate({ row, isToday })} 
            style={{minWidth: "11rem"}} 
          />
          <Column 
            header="Invoice"
            body={row => InvoiceCellTemplate({ row, syncData,  sendEmail, getPdf })} 
          />
          <Column 
            header={<>
              <div className="show-min-md">Synced<br/>with QB</div>
              <div className="show-max-md">
                <i className="pi pi-refresh"/>?
              </div>
            </>}
            // header={<div>Synced with QB ({nSynced}/{nCanSync})</div>} 
            body={row => InvoiceSyncedCellTemplate(row)} 
            style={{flex: "0 1 5rem", justifyContent: "center"}}
          />
          <Column 
            header={<>
              <div className="show-min-md">Email<br/>Sent</div>
              <div className="show-max-md">
                <i className="pi pi-send"/>?
              </div>
            </>}
            // header={<div>Email Sent ({nEmailsSent}/{nEmailsExpected})</div>}
            body={row => EmailSentCellTemplate(row)}
            style={{flex: "0 1 5rem", justifyContent: "center"}}
          />
        </DataTable>

      </div>
      <HelpDialog showHelp={showHelp} setShowHelp={setShowHelp} />

    </div>
  )
}

const issuesMsg = (nItemsSentAndOutOfSync) => 
  <div style={{
    marginBlock: "1rem", 
    padding: "1rem", 
    borderRadius: "6px", 
    backgroundColor: "var(--bpb-surface-content)",
    maxWidth: "40rem"
  }}>
    <div style={{marginBottom: ".5rem", fontWeight:"bold"}}>Issues:</div>
    <div>Items sent and out of sync: {nItemsSentAndOutOfSync}</div>
    <ul>
      <li>
        Most likely the orders were edited automatically from a standing order
        update after the email was sent. Warnings can be ignored in this case. 
        If an invoice does need adjustment, handle this directly in QB.
      </li>
      <li>
        Check the 'Synced with QB' column to see which customers are affected.
      </li>
      <li>
        You can check the state of an invoice with the 'Get PDF' option in the 
        'Invoice' column.
      </li>
    </ul>
  </div>