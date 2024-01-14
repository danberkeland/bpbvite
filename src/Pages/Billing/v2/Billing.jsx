import React, { useEffect, useRef, useState } from "react"
import { get, groupBy, isEqual, round, set, sumBy, sortBy, mapValues, countBy } from "lodash"
import { DateTime } from "luxon"

import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { Dialog } from "primereact/dialog"
import { OverlayPanel } from 'primereact/overlaypanel'
import { InputNumber } from "primereact/inputnumber"

import { SearchBar, rankedSearch } from "./searchBar"

import { useListData } from "../../../data/_listData"
import { useBillingDataByDate } from "./data"

import { batchSubmitQbInvoices, submitAndPrintInvoice, submitOrder } from "./submitFunctions"

import "./billing.css"
import { useSettingsStore } from "../../../Contexts/SettingsZustand"

const SHOW_PRINT = true
let USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const Billing = () => {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading)
  const [expandedRows, setExpandedRows] = useState()
  const [selectedDateJS, setSelectedDateJS] = useState(new Date())
  const selectedDateDT = DateTime.fromJSDate(selectedDateJS)
    .setZone('America/Los_Angeles')
    .startOf('day')
  const reportDate = selectedDateDT.toFormat('yyyy-MM-dd')

  const todayDT = DateTime.now()
    .setZone('America/Los_Angeles')
    .startOf('day')
  const todayISO = todayDT.toFormat('yyyy-MM-dd')

  const [query, setQuery] = useState('')
  const opRef = useRef()

  const [showDialog, setShowDialog] = useState(false)
  const [dialogContent, setDialogContent] = useState()
  const resultSummary = mapValues(
    groupBy((dialogContent ?? []), 'action'),
    actionGroup => countBy(actionGroup, 'result')
  )

  const { 
    data:billingDataByLocNick, 
    convertOrderToInvoice, 
    locations, 
    zones 
  } = useBillingDataByDate({ reportDate, shouldFetch: true })
  const [billingValues, setBillingValues] = useState()

  const orderCache = useListData({ 
    tableName: "Order", 
    customQuery: "orderByDelivDate",
    variables: { delivDate: reportDate, limit: 5000 },
    shouldFetch: true
  })

  useEffect(() => {
    if (!!billingDataByLocNick) {
      setBillingValues(structuredClone(billingDataByLocNick))
      console.log("billingDataByLocNick", billingDataByLocNick)
    }
  }, [billingDataByLocNick])

  const searchableRows = sortBy(
    Object.keys(billingValues ?? {}).map(key => ({
      locNick: key,
      locName: locations[key].locName,
    })),
    'locName'
  )

  

    /**
     * @param {Object} input
     * @param {boolean} input.shouldSendEmail 
     * @param {Object} input.data
     * @param {Object} input.locations
     * @returns 
     */
  const handleBatchSubmit = async ({ 
    shouldSendEmail,
    data,
    locations,
  }) => { 

    const doTheThing = async () => {
      setIsLoading(true)
      const resultPromises = await batchSubmitQbInvoices({
        billingDataByLocNick: data,
        convertOrderToInvoice,
        locations,
        shouldSendEmail
      })

      const results = await Promise.allSettled(resultPromises)
      setIsLoading(false)
      setDialogContent(results.map(r => r.value))
      setShowDialog(true)

      console.log("Results:", groupBy(results.map(r => r.value), 'result'))
    }

    const unsavedChangeMsg = !isEqual(billingDataByLocNick, billingValues)
      ? ["Unsaved Changes will be ignored"]
      : []
    const notTodayMsg = 
      todayDT.plus({ days: 1 }).toFormat('yyyy-MM-dd') === reportDate
        ? ["This is the report for TOMORROW"]
        : todayISO !== reportDate
          ? ["This is NOT TODAY's report"]
          : []
    const checkEntriesMsg = shouldSendEmail
      ? ["Check entries before sending emails"]
      : []

    const cnfMessages = [...unsavedChangeMsg, ...notTodayMsg, ...checkEntriesMsg]
    // console.log(cnfMessages)

    if (cnfMessages.length) {
      confirmDialog({
        header: 'Confirm ' + (shouldSendEmail ? "Send Email" : "Export"),
        message: () => {
          return (
            <ul style={{fontSize: "1rem"}}>
              {cnfMessages.map((msg, idx) => 
                <li key={`cnf-msg-${idx}`}>{msg}</li>)
              }
            </ul>
          )
        },
        accept: () => doTheThing(),
        acceptLabel: "Continue",
        rejectLabel: "Cancel",
        style: {width: "25rem"}
      })

    } else {
      doTheThing()

    }

  }

  const setFieldValue = (fieldPath, newValue) => {
    let newValues = structuredClone(billingValues)
    set(newValues, fieldPath, newValue)
    setBillingValues(newValues)
  }

  const QtyInput = ({ row, fieldPath }) => <InputNumber
    value={get(billingValues, fieldPath).toString()}
    inputStyle={{width: "4rem"}}
    min={row.qtyShort ?? 0}
    onChange={e => {
      const newValue = Math.max(e.value, row.qtyShort ?? 0)
      setFieldValue(fieldPath, newValue)
    }}
    onKeyDown={e => {
      if (e.key === "Escape") {
        const newValue = get(billingDataByLocNick, fieldPath)
        setFieldValue(fieldPath, newValue)
        e.target.blur()
      }
    }}
    onBlur={e => {
      if (e.target.value === '') {
        setFieldValue(fieldPath, 0)
      }
    }}
  />

  const QtyShortInput = ({ row, fieldPath, disabled }) => <InputNumber
    value={get(billingValues, fieldPath)}
    inputStyle={{width: "4rem"}}
    max={row.qty}
    disabled={disabled}
    onChange={e => {
      const newValue = e.value === null ? null : Math.min(e.value, row.qty)
      setFieldValue(fieldPath, newValue)
    }}
    onKeyDown={e => {
      if (e.key === "Escape") {
        const newValue = get(billingDataByLocNick, fieldPath)
        setFieldValue(fieldPath, newValue)
        e.target.blur()
      }
    }}
    onBlur={e => {
      if (e.target.value === "0") {
        setFieldValue(fieldPath, null)
      }
    }}
  />

  const CurrencyInput = ({ row, fieldPath }) => <InputNumber
    value={get(billingValues, fieldPath)}
    mode="currency" currency="USD"
    //minFractionDigits={2} 
    maxFractionDigits={2}
    inputStyle={{width: "4.5rem"}}
    onChange={e => {
      const newValue = e.value || 0 
      setFieldValue(fieldPath, newValue)
    }}
    onKeyDown={e => {
      if (e.key === "Escape") {
        const newValue = get(billingDataByLocNick, fieldPath)
        setFieldValue(fieldPath, newValue)
        e.target.blur()
      }
    }}
    onBlur={e => {
      if (!e.target.value) {
        setFieldValue(fieldPath, 0)
      }
    }}
  />

  const DelivFeeInput = ({ rowKey, fieldPath, placeholder }) => <InputNumber
    value={billingValues[rowKey].items.every(item => item.qty <= (item.qtyShort ?? 0))
      ? null
      : get(billingValues, fieldPath)
    }
    placeholder={billingValues[rowKey].items.every(item => item.qty <= (item.qtyShort ?? 0))
      ? "--"
      : placeholder
    }
    disabled={billingValues[rowKey].items.every(item => item.qty <= (item.qtyShort ?? 0))}
    mode="currency" currency="USD"
    maxFractionDigits={2}
    inputStyle={{width: "7.5rem"}}
    onChange={e => setFieldValue(fieldPath, e.value || 0)}
    onKeyDown={e => {
      if (e.key === "Escape") {
        const newValue = get(billingDataByLocNick, fieldPath)
        setFieldValue(fieldPath, newValue)
        e.target.blur()
      }
    }}
  />

  const rowExpansionTemplate = rowKey => {
    const location = locations[rowKey]
    const { invoicing, zoneNick } = location
    const { zoneFee } = zones[zoneNick]

    const invoiceNum = selectedDateDT.toFormat('MMddyyyy') + rowKey.slice(0,13)
    const headerText = invoicing === "no invoice"
      ? "(Does not get invoiced)"
      : "Invoice #" + invoiceNum 

    const disableDelivFeeEditor = 
    ['atownpick', 'slopick'].includes(billingValues[rowKey].header.route)
      || ['atownpick', 'slopick'].includes(locations[rowKey].zoneNick)

    return (
      <div>
        <div style={{fontSize:"1.125rem", marginBlock: ".25rem"}}>{headerText}</div>
        <DataTable 
          value={billingValues[rowKey].items} 
          size="small"
          tableStyle={{width: "100%"}}
          style={{border: "solid 1px var(--bpb-surface-content-border)"}}
          scrollable
          scrollHeight="100%"
        >
          <Column header="Product" field="prodNick" />
          <Column header="qty ordered" 
            body={(row, options) => QtyInput({
              row, fieldPath: `${rowKey}.items.[${options.rowIndex}].qty`
            })}
          />
          <Column header="qty short" 
            body={(row, options) => QtyShortInput({ 
              row, fieldPath: `${rowKey}.items.[${options.rowIndex}].qtyShort`,
              disabled: reportDate !== todayISO && rowKey !== 'aaatest'
            })} 
          />
          <Column header="total delivered" 
            body={row => row.qty - (row.qtyShort ?? 0)} 
          />
          <Column header="unit price" 
            body={(row, options) => CurrencyInput({
              row, fieldPath: `${rowKey}.items.[${options.rowIndex}].rate`
            })} 
          />
          <Column header="subtotal" 
            body={row => USDollar.format(
              round((row.qty - (row.qtyShort ?? 0)) * row.rate, 2)
            )} 
          />
        </DataTable>
        <div style={{margin: "1rem", display:"flex", justifyContent:"space-between"}}>
          <div>
            Delivery Fee: {disableDelivFeeEditor
              ? 'N/A for pickup'
              : DelivFeeInput({
                rowKey,
                placeholder: `${USDollar.format(zoneFee)} (auto)`, 
                fieldPath: `${rowKey}.header.delivFee` 
              })
            }
          </div>
          <div>
            <Button label="Save Changes"
              onClick={() => submitOrder({ 
                values: billingValues?.[rowKey],
                initial: billingDataByLocNick?.[rowKey],
                orderCache
              })}
              disabled={
                isEqual(billingValues?.[rowKey], billingDataByLocNick?.[rowKey])
                //|| rowKey !== 'aaatest'
              }
            />
          </div>
        </div>
        <div className={"test-qb-functions"}>
          {SHOW_PRINT &&
            <Button label="Adjust & print invoice"
              onClick={async () => {
                const invoice = convertOrderToInvoice({ 
                  cartOrder: billingValues?.[rowKey]}
                )
                setIsLoading(true)
                await submitAndPrintInvoice({ 
                  values: billingValues?.[rowKey], 
                  initial: billingDataByLocNick?.[rowKey], 
                  orderCache, 
                  invoice 
                })
                setIsLoading(false)
              }}
            />
          }

        </div>
      </div>
    )
  }



  const tableRows = rankedSearch({ 
    data: searchableRows, 
    onFields: ['locNick', 'locName'], 
    query,
    nResults: 20
  })?.map(row => row.locNick)


  return (
    <div className="billing-v2-body"> 
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <h1>Daily Invoicing</h1>
        <div className="calendar-header">
          <Button icon="pi pi-calendar" 
            className="p-button-rounded" 
            onClick={e => opRef.current.toggle(e)}  
          />
          <OverlayPanel ref={opRef}>
            <Calendar 
              value={selectedDateJS}
              onChange={e => {
                setSelectedDateJS(e.value)
                setBillingValues()
                setExpandedRows(null)
                opRef.current.hide()
              }}
              readOnlyInput
              inline={true}
            />
          </OverlayPanel>
          <div>{selectedDateDT.toFormat('M/dd/yyyy')}</div>
        </div>
      </div>

      <div style={{
        marginBlock: "1rem", 
        display: "flex", 
        justifyContent: "flex-end", gap: "1rem"
      }}>
        <ConfirmDialog />
        <Button label="Export CSV" 
          onClick={() => handleBatchSubmit({ 
            data: billingDataByLocNick,
            shouldSendEmail: false,
            locations
          })}
        />
        <Button label="Email Invoices" 
          onClick={() => {
            // if (!billingDataByLocNick?.aaatest) {
            //   console.log("todays invoices don't include aaatest")
            //   return 
            // }
            // const testData = { aaatest: billingDataByLocNick.aaatest }
            // const testLocation = { 
            //   aaatest: {
            //     invoicing: "daily", // 'no invoice'|'daily'
            //     toBeEmailed: true,
            //   }
            // }
            handleBatchSubmit({ 
              data: billingDataByLocNick, // testData,
              shouldSendEmail: true,
              locations // : testLocation
            })}
          }
          //disabled={reportDate !== todayISO}
        />
      </div>

      <DataTable 
        value={tableRows}
        expandedRows={expandedRows} 
        onRowToggle={(e) => setExpandedRows(e.data)}
        responsiveLayout="scroll"
        rowExpansionTemplate={rowExpansionTemplate} 
        scrollable
        scrollHeight="55rem"
        className={reportDate !== todayISO ? 'not-today-table' : ''}
      >
        <Column expander style={{ flex: "0 0 3rem", paddingRight: "0" }} />
        <Column 
          header={() => SearchBar({ 
            query, setQuery, inputProps: { placeholder: "Customer"}})
          }
          body={locNick => {
            const logData = () => console.log(
              "form changes:", billingValues?.[locNick]
            )
            const orderHasChanges = !isEqual(
              billingValues?.[locNick], billingDataByLocNick?.[locNick]
            )
            return (
              <div 
                onClick={logData}
                style={orderHasChanges ? {fontWeight: "bold"} : undefined}
              >
                <div>
                  {locations?.[locNick]?.locName ?? locNick}
                </div>
                <div style={{fontSize: ".8rem", fontFamily: "monospace" }}>
                  {locNick}
                </div>
              </div>
            )
          }}
          style={{flex: "1 0 12rem"}}
        />
        <Column header="Total" 
          body={rowKey => {
            const total = sumBy(
              billingValues?.[rowKey].items, 
              item => (item.qty - (item.qtyShort ?? 0)) * item.rate
            )

            return USDollar.format(total)
          }}
          style={{flex: "0.25 0 6rem"}}
        />
      </DataTable>
      <Dialog 
        header={`Export Complete (${dialogContent?.length} item${dialogContent?.length !== 1 ? 's' : ''})`}
        visible={showDialog} 
        onHide={() => setShowDialog(false)}
        style={{minWidth: "20rem"}}
        footer={<Button 
          label="Got it" 
          onClick={() => {
            setShowDialog(false)
          }} 
        />}
      >
        {dialogContent &&
          <pre style={{margin: "0"}}>
            {(JSON.stringify(resultSummary, null, 3))
              ?.replace(/[{}",]/g, '')
            }
          </pre>
        }
      </Dialog>
    </div>
  )
}


