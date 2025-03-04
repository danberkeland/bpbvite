import { useMemo, useRef, useState } from "react"
import { combineOrders } from "../../core/production/combineOrders"
import { useLocations } from "../../data/location/useLocations"
import { useOrdersByDelivDate } from "../../data/order/useOrders"
import { useStandingsByDayOfWeek } from "../../data/standing/useStandings"
import { DBOrder, OrderHeader } from "../../data/types.d"
import { compareBy, countByRdc, groupByArrayRdc, groupByObject, keyBy, sumBy } from "../../utils/collectionFns"
import { DT } from "../../utils/dateTimeFns"

import { ListBox } from "primereact/listbox"
import { ScrollPanel } from "primereact/scrollpanel"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { InputNumber } from "primereact/inputnumber"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { Dialog } from "primereact/dialog"

import { useProducts } from "../../data/product/useProducts"
import { useLocationProductOverrides } from "../../data/locationProductOverride/useLocationProductOverrides"
import { useZones } from "../../data/zone/useZones"
import { makeQbInvoice } from "../../core/billing/makeInvoice"
import { QB } from "../../data/qbApiFunctions"
import { useSettingsStore } from "../../Contexts/SettingsZustand"
import { mapValues } from "../../utils/objectFns"

const todayColor = "var(--bpb-orange-vibrant-200"
const notTodayColor = "rgb(191, 210, 218)"

const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

  // success signals for invoice requests:
  //
  // for create/update...
  // - response.value.data.Invoice    has the returned invoice object,
  // - response.value.data.time       has a timestamp string with local offset,
  //      ex: "2023-11-05T13:37:37.866-08:00"
  //
  // for delete...
  // example
  //
  // value: 
  //   config: { ... } 
  //   data:
  //     Invoice: 
  //       Id: "210071"
  //       domain: "QBO"
  //       status: "Deleted"
  //     time: "2023-11-06T12:18:33.759-08:00"
  //   ...

  // failure signals:
  // response has...
  // - .value.data.errorMessage,  ex: "Request failed with status code 400" << 400 indicates bad request body, 401 is bad access code
  // - .value.data.errorType,     ex: "Error"
  // - .value.data.trace          has an array of strings

const hasTimeout = (response) => 
  !!response?.data?.errorMessage?.includes?.("Task timed out")

/**
 * Configurable wrapper for submit functions. This retry pattern is specific
 * to the QB serverless functions mediated by API Gateway. We detect timeouts
 * from error message text in the response body, and retry on those errors
 * specifically.
 */
const retryOnTimeout = ({ submitFn, nAttempts, delayMs }) => {
  return submitFn.then(response => {

    if (!!response.data) {
      return response
      
    } else if (nAttempts > 0 && hasTimeout(response)) {
      console.log(`Timed out; ${nAttempts - 1} attempts remaining...`)
      return setTimeout(
        retryOnTimeout({ submitFn, nAttempts: nAttempts - 1, delayMs }),
        delayMs
      )

    } else {
      if (nAttempts === 0) {
        console.warn(`All retry attempts timed out`)
      }
      return response

    }
  })

}

const withRetry = (submitFn) => retryOnTimeout({
  submitFn, nAttempts: 5, delayMs: 4000
})

async function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

const handleDelete = (Id, SyncToken, accessToken, locNick) => 
  withRetry(
    QB.invoice.delete({ Id, SyncToken, accessToken })
  ).then(response => {
    const data = response?.data
    return !data ? 
        { locNick, response, action: "delete", message: "unknown error",   needsRetry: true } 
      : !!data.errorMessage ? 
        { locNick, response, action: "delete", message: data.errorMessage, needsRetry: true }
      : hasTimeout(response) ?
        { locNick, response, action: "delete", message: "task timed out",  needsRetry: true }
      : { locNick, response, action: "delete", message: "ok", needsRetry: false }
  })

const handleCreate = (invoice, Id, SyncToken, accessToken, locNick, shouldSendEmail, toBeEmailed) => 
  withRetry(
    QB.invoice.create({ invoice: !!Id ? { ...invoice, Id, SyncToken } : invoice, accessToken })
  ).then(response => {
    const data = response?.data
    return !data ?
        { locNick, response, action: "create", message: "unknown error",   needsRetry: true }
      : !!data.errorMessage ?
        { locNick, response, action: "create", message: data.errorMessage, needsRetry: true }
      : hasTimeout(response) ?
        { locNick, response, action: "create", message: "task timed out",  needsRetry: true }
      : shouldSendEmail && toBeEmailed ?
        handleSendEmail(response.data.Invoice.Id, accessToken, locNick)
      : shouldSendEmail && !toBeEmailed ? 
        { locNick, response, action: "create only", message: "ok", needsRetry: false }
      : { locNick, response, action: "create",      message: "ok", needsRetry: false }
  })

const handleSendEmail = (InvoiceId, accessToken, locNick) => 
  withRetry(
    QB.invoice.sendEmail({ InvoiceId, accessToken })
  ).then(response => {
    const data = response?.data
    return !data ?
        { locNick, response, action: "create & email", message: "unknown error",   needsRetry: true }
      : !!data.errorMessage ?
        { locNick, response, action: "create & email", message: data.errorMessage, needsRetry: true }
      : hasTimeout(response) ?
        { locNick, response, action: "create & email", message: "task timed out",  needsRetry: true }
      : { locNick, response, action: "create & email", message: "ok",              needsRetry: false }
  })

/** 
 * @typedef {Object} SetOrderHeaderProps 
 * @property {string} [locNick]
 * @property {string} [delivDate]
 * @property {boolean} [isWhole]
 * @property {string} [route]
 * @property {string} [ItemNote]
 * @property {number} [delivFee]
*/

/**
 * @param {DBOrder[]} orders 
 * @returns {OrderHeader}
 */
const getHeaderProps = (/** @type {DBOrder[]} */ orders) => {
  const { locNick, delivDate, isWhole, route, ItemNote, delivFee} = orders[0]
  return { locNick, delivDate, isWhole, route, ItemNote, delivFee }
}
/**
 * Any props passed will overwrite order data, so be sure to include only the ones you need.
 * @param {DBOrder[]} orders 
 * @param {SetOrderHeaderProps} propsToAssign 
 */
const setHeaderProps = (orders, propsToAssign) => { return orders.map(order => ({ ...order, ...propsToAssign }))}

const useInvoicingData = ({ reportDT, shouldFetch }) => {
  const delivDate = reportDT.toFormat('yyyy-MM-dd')
  const dayOfWeek = reportDT.toFormat('EEE')
  const { data:ORD, submitMutations, updateLocalData } = useOrdersByDelivDate({ delivDate, shouldFetch })
  const { data:STD } = useStandingsByDayOfWeek({ dayOfWeek, shouldFetch })
  const { data:LOC } = useLocations({ shouldFetch })
  const { data:PRD } = useProducts({ shouldFetch })
  const { data:LPO } = useLocationProductOverrides({ shouldFetch })
  const { data:ZNE } = useZones({ shouldFetch })
  const setIsLoading = useSettingsStore(state => state.setIsLoading)

  const data = useMemo(() => {
    if (!ORD || !STD || !LOC || !PRD || !LPO || !ZNE) return undefined

    const locations = keyBy(LOC, L => L.locNick)

    return combineOrders(ORD, STD, [delivDate])
      .filter(order => 1
        && order.Type !== "Holding"
        && order.isWhole === true
      )
      .map(order => {
        const customRate = LPO.find(ovr => ovr.locNick === order.locNick && ovr.prodNick === order.prodNick)?.wholePrice
        const defaultRate = PRD.find(P => P.prodNick === order.prodNick)?.wholePrice
        if (order.rate === null && customRate === undefined && defaultRate === undefined) {
          console.warn("Could not find unit price for ", order.prodNick)
        }

        return { 
          ...order, 
          rate: order.rate ?? customRate ?? defaultRate ?? null, 
          qtyShort: order.qtyShort === null ? 0 : order.qtyShort,
        }
      })
      .reduce(groupByArrayRdc(order => order.locNick), [])
      .map(orderGroup => {
        const { locNick, delivFee } = orderGroup[0]
        const location = locations[locNick]
        const { zoneNick } = location
        const zoneFee = ZNE.find(Z => Z.zoneNick === zoneNick)?.zoneFee

        return {
          locNick,
          locName: locations[locNick]?.locName ?? locNick,
          location,
          items: orderGroup,
          delivFee,
          zoneFee,
          shouldDelete: orderGroup.every(order => order.qty === 0),
          shouldEmail: location.toBeEmailed ?? false,
          status: "",
        }
      })
      .sort(compareBy(option => option.locName))
      .sort(compareBy(option => option.shouldEmail))
      .sort(compareBy(option => option.location.invoicing !== 'no invoice'))

  }, [ORD, STD, LOC, PRD, LPO, ZNE])

  /**
   * 
   * @param {Object} input
   * @param {boolean} input.shouldSendEmail 
   */
  const batchSubmitQbInvoices = async ({ shouldSendEmail }) => {
    if (!data || !PRD) {
      return [{ locNick: "", response: "", action: "none", message: "data not loaded", shouldRetry: true }]
    }
    if (data.every(item => item.location.invoicing === 'no invoice')) {
      return [{ locNick: "", response: "", action: "none", message: "nothing to submit", shouldRetry: false }]
    }
    
    const accessToken = await QB.getAccessToken() 
    if (accessToken === undefined) {
      return [{ locNick: "", response: "", action: "auth", message: "failed to get access token", shouldRetry: true }]
    }

    const products = keyBy(PRD, P => P.prodNick)

    const resultPromises = data
      // .filter(item => item.locNick === 'aaatest') // for testing, filter to just aaatest
      .map(async (item, idx) => {
        const { locNick, location, zoneFee, items } = item
        const { toBeEmailed } = location
        const invoice = makeQbInvoice(items, location, products, zoneFee)

        if (item.location.invoicing === 'no invoice') {
          return { locNick, response: "", action: "none", message: "does not get invoiced", shouldRetry: false }
        }
        if (!invoice) {
          return { locNick, response: "", action: "transform", message: "Error: could not convert order to invoice", needsRetry: true }
        }

        await sleep(idx * 500)
        return QB.invoice
          .get({ DocNumber: invoice.DocNumber, accessToken })
          .then(response => {
            const { Id, SyncToken, EmailStatus } = response?.data ?? {}
            const shouldDelete = item.items.every(item => item.qty === 0)
            return EmailStatus === "EmailSent" ?
                { locNick, response, action: "query", message: "email already sent", needsRetry: false }
              : shouldDelete && !Id ?
                { locNick, response, action: "query", message: "no invoice to delete", needsRetry: false }
              : shouldDelete && !!Id ?
                handleDelete(Id, SyncToken, accessToken, locNick)
              : handleCreate(invoice, Id, SyncToken, accessToken, locNick, shouldSendEmail, toBeEmailed)
          })
        
      })

    const settledResults = await Promise.allSettled(resultPromises)
    return settledResults.map(res => res.value)

  }

  const updateOrders = async ({ updateInputs }) => {
    setIsLoading(true)
    updateLocalData(await submitMutations({ updateInputs }))
    setIsLoading(false)
  }

  return { 
    data,
    products: useMemo(() => !!PRD ? keyBy(PRD, P => P.prodNick) : undefined, [PRD]),
    LPO,
    batchSubmitQbInvoices,
    updateOrders,
    setIsLoading
  }

}



const PageInvoicing = () => {
  const todayDT = DT.today()
  const [reportDT, setReportDT] = useState(todayDT)
  const isToday = reportDT.toMillis() === todayDT.toMillis()
  const isTomorrow = reportDT.toMillis() === todayDT.plus({ days: 1 }).toMillis()

  const { data, products, LPO, batchSubmitQbInvoices, updateOrders, setIsLoading } = 
    useInvoicingData({ reportDT, shouldFetch: true })

  const [showHelp, setShowHelp] = useState(false)
  const [locNick, setLocNick] = useState(null)
  const [invoiceChanges, setInvoiceChanges] = useState(null)

  const [showResultDialog, setShowResultDialog] = useState(false)
  const [resultDialogData, setResultDialogData] = useState(null)

  const handleDateChange = e => {
    setReportDT(DT.fromJs(e.value))
    setShowHelp(false)
    setLocNick(null)
    setInvoiceChanges(null)
  }
  const handleLocNickChange = e => {
    setShowHelp(false)
    setLocNick(e.value)
    setInvoiceChanges(data?.find(item => item.locNick === e.value)?.items ?? null)
  }
  const goToMainScreen = () => {
    setShowHelp(false)
    setLocNick(null)
    setInvoiceChanges(null)
  }
  const goToHelpScreen = () => {
    setShowHelp(true)
    setLocNick(null)
    setInvoiceChanges(null)
  }
  const selectedOrderDetails = data?.find(item => item.locNick === locNick)

  const handleBatchSyncQb = shouldSendEmail => {
    const doTheThing = async () => {
      setIsLoading(true)
      const settledResults = await batchSubmitQbInvoices({ shouldSendEmail })
      setIsLoading(false)
      console.log("settled results:", settledResults)

      const resultsBySuccess = groupByObject(settledResults, result => result.needsRetry ? "Fail" : "Ok")
      const getResultSummary = (resultItems) => {
        const resByMessage = groupByObject(resultItems, item => item.message)
        return mapValues(resByMessage, msgGroup => msgGroup.length)
      }
      const resultData = mapValues(resultsBySuccess, resultGroup => getResultSummary(resultGroup))
      setShowResultDialog(true)
      setResultDialogData(Object.assign(resultData, { "Total Orders": settledResults.length }))
    }
    const shouldWarn = (shouldSendEmail && !isToday) || (!shouldSendEmail && !isTomorrow)

    confirmDialog({
      header: <div>Confirm Sync Qb {shouldSendEmail && "+ Email"} {shouldWarn && <i className="pi pi-exclamation-triangle" />} </div>,
      message: () => {
        return (
          <ul style={{fontSize: "1rem"}}>
            {shouldSendEmail && !isToday &&
              <li>This Task is usually meant for today's orders.</li>
            }
            {!shouldSendEmail && !isTomorrow &&
              <li>This Task is usually meant for tomorrow's orders.</li>
            }
            <li>Make sure entries are all correctly saved before continuing.</li>
          </ul>
        )
      },
      accept: doTheThing,
      acceptLabel: "Continue",
      rejectLabel: "Cancel",
      style: {width: "25rem"}
    })

  }

  const itemTemplate = option => {
    if (!option.location) return option.locNick
    const { locNick, locName, shouldDelete } = option

    const opacity = shouldDelete ? "0.8" : ""
    const infoIcon = option.location.invoicing === "no invoice" ? <i className="pi pi-ban" />
      : option.shouldEmail ? <i className="pi pi-at" />
      : <i className="pi pi-file" />
      
    return <div style={{display: "grid", gridTemplateColumns: "1fr 1.25rem 1.25rem", columnGap: ".5rem"}}>

      <div style={{opacity}}>
        <div>{locName}</div>
        <pre style={{fontSize: ".8rem", margin: "0rem"}}>
          {locNick}
        </pre>
      </div>

      <div style={{alignSelf: "center", opacity}}>
        {infoIcon}
      </div>

      <div style={{alignSelf: "center", opacity}}>
        {option.shouldDelete ? <i className="pi pi-trash" /> : ""}
      </div>

    </div>
 
  }

  const startScreen = 
    <>
      <div style={{ maxWidth: "20rem", padding: "1rem", marginBottom: "2rem", background: `var(--bpb-orange-vibrant-${isToday ? '050' : '100'})`, border: "solid 1px var(--bpb-surface-content-border)", borderRadius: "3px" }}>
        <div style={{display: "flex", alignItems: "center", gap: "1rem"}}>
          <Button label="Batch Sync QB + Email" onClick={() => handleBatchSyncQb(true)} style={{fontSize: "1.25rem"}} />{!isToday && <i className="pi pi-exclamation-triangle" style={{fontSize: "1.5rem"}} />}
        </div>
        <p>For today's orders, usually.</p>
      </div>
      
      <div style={{ maxWidth: "20rem", padding: "1rem", marginBottom: "2rem", background: `var(--bpb-orange-vibrant-${isTomorrow ? '050' : '100'})`, border: "solid 1px var(--bpb-surface-content-border)", borderRadius: "3px" }}>
        <div style={{display: "flex", alignItems: "center", gap: "1rem"}}>
          <Button label="Batch Sync QB" onClick={() => handleBatchSyncQb(false)} style={{fontSize: "1.25rem"}} />{!isTomorrow && <i className="pi pi-exclamation-triangle" style={{fontSize: "1.5rem"}} />}
        </div>
        <p>For tomorrow's orders, usually.</p>
      </div>

      <p>See help for more details.</p>
      <ConfirmDialog />
    </>

  const orderTemplate = (invoiceChanges, selectedOrderDetails) => {
    if (!invoiceChanges || !selectedOrderDetails) return undefined

    const { locName, location, zoneFee, items:invoiceBase } = selectedOrderDetails
    const { invoicing, zoneNick } = location
    const { route, delivFee } = getHeaderProps(invoiceBase)
    const invoiceNum = `${reportDT.toFormat('MMddyyyy')}${selectedOrderDetails.locNick.slice(0, 13)}`
    const updateInputs = invoiceChanges.filter((_, idx) => 0
      || invoiceBase[idx].delivFee !== invoiceChanges[idx].delivFee
      || invoiceBase[idx].qtyShort !== invoiceChanges[idx].qtyShort
      || invoiceBase[idx].rate     !== invoiceChanges[idx].rate
    )
    const hasChanges = updateInputs.length > 0

    const setAttributeAtIndex = (value, attribute, index) => {
      let newState = structuredClone(invoiceChanges)
      newState[index][attribute] = value
      setInvoiceChanges(newState)
    }
    const setDelivFee = (value) => {
      let newState = setHeaderProps(structuredClone(invoiceChanges), { delivFee: value })
      setInvoiceChanges(newState)
    }

    return <>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <Button label="back to main" icon="pi pi-arrow-left" className="p-button-text" onClick={goToMainScreen} />
        <div style={{display: hasChanges ? "" : "none", padding: ".2rem 1rem .2rem 1rem", borderRadius: "1rem", background: "#FFECB3" }}>Changes pending...</div>
      </div>
      <h2 style={{color: "var(--bpb-text-color)"}} onClick={() => console.log(invoiceBase)}>{locName}</h2>
      <span style={{fontSize: "1.25rem", color: "var(--bpb-text-color)"}}>Invoice Number: {invoicing === 'no invoice' ? "N/A" : invoiceNum}</span>
      <DataTable
        value={invoiceChanges}
        // size="small"
        responsiveLayout="scroll"
        footer={() => <div style={{textAlign: "right"}}>Total: {USDollar.format(sumBy(invoiceChanges, order => (order.qty - order.qtyShort) * order.rate))}</div>}
      >
        <Column header="Product" 
          body={row => <>
            <div>{products?.[row.prodNick]?.prodName ?? row.prodNick}</div>
            <pre style={{fontSize: ".8rem", margin: "0rem"}}>{row.prodNick}</pre>
          </>} 
        />
        <Column header="Qty" field="qty" />
        <Column header="Short"      
          body={(row, options) => 
            <InputNumber 
              value={row.qtyShort} 
              onValueChange={e => {
                setAttributeAtIndex(e.value, 'qtyShort', options.rowIndex)
              }}
              onBlur={e => {
                if (e.target.value === "") {
                  setAttributeAtIndex(0, 'qtyShort', options.rowIndex)
                }
              }}
              min={0} 
              max={row.qty} 
              inputStyle={{width: "4rem"}}
            />
          } 
        />
        <Column header="Total Delivered" body={row => row.qty - (row.qtyShort ?? 0)} />
        <Column header="Unit Price" 
          body={(row, options) => 
            <InputNumber 
              value={row.rate} 
              onValueChange={e => 
                setAttributeAtIndex(e.value, 'rate', options.rowIndex)
              }
              onBlur={e => {
                if (e.target.value === "") {
                  setAttributeAtIndex(0, 'rate', options.rowIndex)
                }
              }}
              min={0} mode="currency" currency="USD" locale="en-US" 
              tooltip={`Default Rate: ${USDollar.format(products?.[row.prodNick].wholePrice)}\nCustomer Default Rate: ${LPO?.find(ovr => ovr.locNick === row.locNick && ovr.prodNick === row.prodNick)?.wholePrice ? USDollar.format(LPO?.find(ovr => ovr.locNick === row.locNick && ovr.prodNick === row.prodNick)?.wholePrice) : 'same'}`} 
              tooltipOptions={{ position: "left" }}
              inputStyle={{width: "4.75rem"}} 
            />
          } 
        />
        <Column header="Subtotal" body={row => USDollar.format((row.qty - row.qtyShort) * row.rate)} />

      </DataTable>

      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={{color: "var(--bpb-text-color)", marginBlock: "1rem"}}>
          Delivery Fee: {route !== 'deliv' || ['slopick', 'atownpick'].includes(zoneNick)
            ? "N/A for pick-up order"
            : <InputNumber 
                value={delivFee} 
                placeholder={USDollar.format(zoneFee) + ' (auto)'} 
                onValueChange={e => setDelivFee(e.value)} 
                min={0} mode="currency" currency="USD" locale="en-US"
                inputStyle={{width: "7rem"}} 
              />
          }
        </div>
        <Button label="Save Changes" disabled={!hasChanges} 
          onClick={() => {
            if (!products || !invoiceChanges || !hasChanges) return 
            // console.log(updateInputs)
            // console.log(JSON.stringify(makeQbInvoice(invoiceChanges, location, products, zoneFee), null, 2))
            updateOrders({ updateInputs })
          }} 
          disabled={!products || !invoiceChanges || !hasChanges}
        />
      </div>


    </>
  }

  return(
    <div style={{ padding: "2rem", margin: "auto"}}>
      <p>Using v3. <a href="/Billing">Go to latest version</a></p>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", paddingInline: "1rem", background: isToday ? todayColor : notTodayColor, borderRadius: "3px", marginBottom: "3px"}}>
        <div>
          <h1 style={{color: "var(--bpb-text-color)", display: "inline-block", marginBlock: ".5rem"}}>Invoicing {reportDT.toFormat('MM/dd/yyyy')}</h1>
          <CustomCalendarInput reportDT={reportDT} onChange={handleDateChange} />
        </div>
        <div style={{display: "flex", gap: "2rem"}}>
          <Button label="Help" className="p-button-text" icon="pi pi-question-circle" iconPos="right" onClick={goToHelpScreen}/>
        </div>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "24rem 1fr", columnGap: "3px", height: "fit-content"}}>

        <ListBox 
          options={data}
          value={locNick}
          optionValue='locNick'
          itemTemplate={itemTemplate}
          onChange={handleLocNickChange}
          listStyle={{ height: "calc(100vh - 23rem - 4px)" }}
          style={{border: "none"}}
        />

        <ScrollPanel style={{ height: "calc(100vh - 23rem)", width: "100%", background: "var(--bpb-surface-content)", borderRadius: "3px"}}>
          <div style={{padding: "1rem"}}>
            {
              orderTemplate(invoiceChanges, selectedOrderDetails) 
                ?? (showHelp ? helpTemplate(goToMainScreen) : startScreen)
            }
          </div>
        </ScrollPanel>
      </div>
      <Dialog visible={showResultDialog} header="Results" onHide={() => setShowResultDialog(false)}>
        <pre>
          {JSON.stringify(resultDialogData, null, 2)}
        </pre>
      </Dialog>
    </div>
  )

}

export { PageInvoicing as default }



const CustomCalendarInput = ({ reportDT, onChange }) => {
  const calendarRef = useRef()
  return <div style={{display: "inline-block", marginLeft: "1rem"}}>
    <Button 
      icon="pi pi-calendar"
      className="p-button-rounded" 
      onClick={() => calendarRef.current.show()}
    />
    <Calendar 
      value={reportDT.toJSDate()}
      ref={calendarRef}
      onChange={onChange} 
      inputStyle={{visibility: "hidden", width:"0", height: "0", padding: "0"}}
      panelStyle={{transform: "translate(-.8rem, 0rem)"}}
    />
  </div>
}



const helpTemplate = (goToMainScreen) =>
  <div style={{color: "var(--bpb-text-color)"}}>
    <Button label="back to main" icon="pi pi-arrow-left" className="p-button-text" onClick={goToMainScreen} />
    <h2>How to Use This Page</h2>

    <p>Locations with orders for the selected date are on the left. Click on an item to see details. Clicking again will deselect the customer and return to the main screen.</p>
    <p>Location detail pages will allow you to make adjustments to the day's orders (see below for more info).</p>
    <p>Buttons on the main page execute daily batch jobs (see below for more info).</p>

    <br/>
    <h2>Edit An Order</h2>

    <p>Select an order to edit any qtys shorted, set a custom unit price, or a custom delivery fee. To edit other parts of an order, use the Ordering page. <b>Selecting away from the current order will undo any pending changes.</b></p>
    
    <h3>Qty Short (Experimental Feature)</h3>
    <p>Our usual method for handling invoice adjustments, especially in the case of shorted qtys, is to simply adjust the order qty. This corrects the billed amount, but this stealthy change may be tricky for customers to review and audit. Recording a separate qty short will create a separate invoice line with a negative qty, and hence a negative subtotal. The invoice will still bill the correct amount, but in a more explicit way.</p>

    <h3>Unit Price</h3>
    <p>Set a custom price in a one-off fashion here. To set a permanent custom price for a particular customer/product, go to Settings -  Customer Product Setup.</p>
    <p>To convert an order to a sample, set the price to 0. Customers who use the ordering page will see the item marked as a sample and will be unable to edit the qty.</p>

    <br/>
    <h2>Batch Jobs</h2>
    <p>Each batch job is typically executed once a day.</p>

    <h3>Sync QB (Formerly "Export CSV")</h3>
    <p>Where applicable, this will send order data from our system to QuickBooks, generating invoices there. Re-running this job will completely overwrite previous QuickBooks data with new data derived from what our system sends over. If an order is marked for deletion here, Sync QB will attempt to delete the corresponding QuickBooks invoice.</p>
    <p>This job can be executed once you're confident that no further orders for tomorrow will be placed. High St. and High St. Osos will usually be the last of these orders to come in.</p>
    
    <h3>Sync QB + Email (Formerly "Email Invoices") </h3>
    <p>Performs the same syncing described above, and also sends an electronic invoice to customers set to receive them. This happens for most customers.</p>
    <p>Once an invoice is shared with a customer by email, we typically do not make further changes to that document. Instead, we make corrections to a customer's account directly through the QuickBooks app, usually by making credit memos. To prevent unwanted changes, <b>Sync QB will not make changes to QB invoices that have already been emailed</b>. Moreover, the emailing routine will not send additional emails after the first one is successfully sent.</p>
    <p>This job can be executed once you're confident that no further adjustments are needed for the current day's orders.</p>

    <br/>
    <h2>Icon Key</h2>
    <ul>
      <li><i className="pi pi-fw pi-at" /> Will sync with QB if email not sent. Will send email if not marked for deletion.</li>
      <li><i className="pi pi-fw pi-file" /> Will sync with QB. Will not send email.</li>
      <li><i className="pi pi-fw pi-ban" /> Will not sync with QB. Will not send email. For special locations that don't get invoiced.</li>
      <li><i className="pi pi-fw pi-trash" /> Marked for deletion (all items have 0 qty). Sync QB will delete existing invoice data if email not already sent.</li>
    </ul>

  </div>


