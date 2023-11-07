import { get, groupBy, isEqual, round, set, sumBy, min, sortBy } from "lodash"
import { DateTime } from "luxon"

import { OverlayPanel } from 'primereact/overlaypanel'
import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { DataTable } from "primereact/datatable"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import React, { useEffect, useRef, useState } from "react"
import { Column } from "primereact/column"
import { InputNumber } from "primereact/inputnumber"

import { SearchBar, rankedSearch } from "./searchBar"

import { useBillingDataByDate } from "./data"
import { useListData } from "../../../data/_listData"

import { submitAndPrintInvoice, submitOrder, submitQBInvoices } from "./submitFunctions"

import "./billing.css"
import { checkQBValidation_v2 } from "../../../helpers/QBHelpers"

let USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const Billing = () => {
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

  const dataHasChanges = !isEqual(billingDataByLocNick, billingValues)

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
      ? "(no invoice)"
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
                || rowKey !== 'aaatest'
              }
            />
          </div>
        </div>
        <div className={"test-qb-functions"}>
          <ConfirmDialog />
          {rowKey === 'aaatest' &&
            <Button label="Adjust & print invoice"
              onClick={() => {
                const invoice = convertOrderToInvoice({ 
                  cartOrder: billingValues?.[rowKey]}
                )
                console.log(invoice)

                if (!isEqual(billingValues?.[rowKey], billingDataByLocNick?.[rowKey])) {
                  confirmDialog({
                    header: "Confirm",
                    message: "Unsaved changes will not be submitted to QB. Continue?",
                    accept: () => {
                      // submitQBInvoices({ invoices: [invoice] })
                      submitAndPrintInvoice({ 
                        values: billingValues?.[rowKey], 
                        initial: billingDataByLocNick?.[rowKey], 
                        orderCache, 
                        invoice 
                      })
                    },
                    style: {width:"18rem"},
                  })
                } else {
                  // submitQBInvoices({ invoices: [invoice] })
                  submitAndPrintInvoice({ 
                    values: billingValues?.[rowKey], 
                    initial: billingDataByLocNick?.[rowKey], 
                    orderCache, 
                    invoice 
                  })
                }
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

      <div style={{marginBlock: "1rem"}}>
        <Button label="Make QB Invoices" />
        <Button label="Make & Send Email" 
          disabled={reportDate !== todayISO}
          style={{marginLeft: "1rem"}}
          onClick={() => batchSubmitQbInvoices()}
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
      >
        <Column expander style={{ flex: "0 0 3rem", paddingRight: "0" }} />
        <Column 
          header={() => 
            SearchBar({ query, setQuery, inputProps: { placeholder: "Customer"}})
          }
          body={locNick => <div 
            onClick={() => {
              console.log(billingValues[locNick])
              console.log(convertOrderToInvoice({ cartOrder: billingDataByLocNick?.[locNick] }))
            }}
            style={!isEqual(billingValues[locNick], billingDataByLocNick?.[locNick])
              ? {fontWeight: "bold"}
              : undefined
            }
          >
            <div>{locations?.[locNick]?.locName ?? locNick}</div>
            <div style={{fontSize: ".8rem", fontFamily: "monospace" }}>{locNick}</div>
          </div>}
          style={{flex: "1 0 12rem"}}
        />
        <Column header="Total" 
          body={rowKey => {
            const total = sumBy(
              billingValues[rowKey].items, 
              item => (item.qty - (item.qtyShort ?? 0)) * item.rate
            )

            return USDollar.format(total)
          }}
          style={{flex: "0.25 0 6rem"}}
        />
      </DataTable>
    </div>
  )
}


/**
 * @param {Object} kwargs
 * @param {Object} kwargs.billingDataByLocNick - Data as produced by useBillingDataByDate
 * @param {Function} kwargs.convertOrderToInvoice - as produced by useBillingDataByDate 
 * @param {Object} kwargs.locations - Data produced by useListData, keyed by locNick
 * @param {boolean} [kwargs.shouldSendEmail] - flag to send emails after submitting invoices
 */
const batchSubmitQbInvoices = async ({ 
  billingDataByLocNick,
  convertOrderToInvoice,
  locations,
  shouldSendEmail=false,
}) => {

    const { true:noInvLocNicks=[], false:invLocNicks=[] } = groupBy(
      Object.keys(billingDataByLocNick),
      locNick => locations[locNick].invoicing === "no invoice"
    )

    console.log("No invoicing for:", noInvLocNicks)
    
    const invoices = invLocNicks.map(locNick => 
      convertOrderToInvoice({ cartOrder: billingDataByLocNick?.[locNick]})
    )


    const accessToken = await checkQBValidation_v2()
    const qbResults = submitQBInvoices({ invoices, accessToken })

    const successes = invLocNicks.filter((locNick, idx) => qbResults[idx])
    const failures = invLocNicks.filter((locNick, idx) => !qbResults[idx])

    if (!shouldSendEmail) return

    // dont send email if location doesn't request it, or if their order
    // was set to be deleted (i.e. all items have 0 qty)
    const invoicesToEmail = invLocNicks.filter(locNick => 
      locations[locNick].toBeEmailed === true
      && billingDataByLocNick[locNick].items.some(item => item.qty > 0)
    )
    

    
}

// better name would be 'getInvoiceByDocNumber' -- returns full invoice object
// const foo = await getQBInvIDandSyncToken(accessToken, invoice.DocNumber)

// if (email) {
//   /* Begin email module */

//   let DocNum = inv.invNum;
  
//   let invID = await getQBInvIDandSyncToken(access, DocNum);
 
//   if (Number(invID.data.Id) > 0) {
//     invID = invID.data.Id;
//     let custo =
//       customers[
//         customers.findIndex((cust) => cust.custName === inv.custName)
//       ];
//     if (custo.toBeEmailed) {
//       let didItEmail = await emailQBInvoice(access, invID);
//       showSuccessEmail(inv.custName, didItEmail.status);
//     } else {
//       showDoNotMail(inv.custName);
//     }
//   } else {
//     showNoEmail(inv.custName);
//   }

//   /* end email module */
// }