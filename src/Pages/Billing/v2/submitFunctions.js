import { groupBy, isEqual, pickBy, set, truncate } from "lodash"
import { checkQBValidation_v2, getQBInvIDandSyncToken } from "../../../helpers/QBHelpers"
import { getTimeToLive } from "../../../functions/dateAndTime"

import "./billing.css"
import axios from "axios"
import { downloadPDF } from "../../../functions/legacyFunctions/helpers/PDFHelpers"



const getIdAndSyncTokenURL = 
  "https://unfaeakk8g.execute-api.us-east-2.amazonaws.com/done"

const createQbInvoiceUrl =
  "https://9u7sp5khrc.execute-api.us-east-2.amazonaws.com/done"

// Use this for invoices with no line items?
const deleteQbInvoiceUrl =
  "https://63m47lgp1b.execute-api.us-east-2.amazonaws.com/done"

const getInvoicePdfUrl =
  "https://47i7i665dd.execute-api.us-east-2.amazonaws.com/done"




/** Submit to AppSync */
export const submitOrder = async ({ values:_values, initial, orderCache }) => {
  console.log(initial, _values)

  // const headerChanged = !isEqual(initial.header, values.header)
  // const itemsChanged = !isEqual(initial.items, values.items)

  // console.log("header changed?", headerChanged)
  // console.log("items chagned?", itemsChanged)
  
  // set delivFee to null if submitting an order with 0 items delivered.
  // QB submission will know not to apply the fee, but if the order is
  // resubmitted with items delivered, we choose to return to the default
  // delivFee instead of reapplying the nonstandard one.
  const shouldResetDelivFee = _values.items.every(item => 
    item.qty <= (item.qtyShort ?? 0)
  )

  const values = shouldResetDelivFee
    ? set(structuredClone(_values), 'header.delivFee', null)
    : _values

  const changedHeaderAttributes = pickBy(
    values.header,
    (val, key) => values.header[key] !== initial.header[key]
  )

  // updates are 'sparse-ish' -- we try to limit 
  // submitting unchanged attributes
  //
  // map first to maintain order parity between values.items, initial.items
  const updateInputs = values.items
    .map((item, idx) => {
       const shouldUpdate = item.Type === "Orders" 
        && (
          Object.keys(changedHeaderAttributes).length 
          || !isEqual(item, initial.items[idx])
        )
      
      if (!shouldUpdate) return undefined

      let changedItemAttributes = pickBy(
        item,
        (val, key) => !isEqual(val, initial.items[idx][key])
      )

      if ('qty' in changedItemAttributes) {
        changedItemAttributes.sameDayMaxQty = 
          Math.max(changedItemAttributes.qty, item.sameDayMaxQty ?? 0)
        changedItemAttributes.qtyUpdatedOn = new Date().toISOString()
      }

      return {
        ...changedHeaderAttributes,
        ...changedItemAttributes,
        id: item.id,
        updatedBy: 'bpb_admin',
        ttl: getTimeToLive(values.header.delivDate),
      }
    })
    .filter(item => item !== undefined)

  // creates are 'full-ish' updates -- try to specify values for most fields
  const createInputs = values.items
    .map((item, idx) => {
      const shouldCreate = item.Type !== "Orders"
        && (
          Object.keys(changedHeaderAttributes).length 
          || !isEqual(item, initial.items[idx])
        )
      
      if (!shouldCreate) return undefined

      return {
        ...values.header,
        ...item,
        Type: "Orders",
        sameDayMaxQty: item.qty,
        qtyUpdatedOn: new Date().toISOString(),
        updatedBy: "bpb_admin",
        ttl: getTimeToLive(values.header.delivDate),
      }
    })
    .filter(item => item !== undefined)

  const { submitMutations, updateLocalData } = orderCache

  const gqlResponse = await submitMutations({ createInputs, updateInputs })
  updateLocalData(gqlResponse)
  console.log("gqlResponse", gqlResponse)


  return gqlResponse.errors.length
    ? 1
    : 0

}



/**
 * Submit invoice objects to Quickbooks.
 * @param {Object}    input - kwargs.
 * @param {Object[]}  input.invoices - An array of invoice objects. Should have all necessary attributes except the customer's qbID and SyncToken.
 * @param {string}   [input.accessToken] - When supplied, prevents redundant fetch internally.
 * @param {boolean}  [input.deleteEmptyInvoices=true] - (default: true) When false, submits an invoice with no items/charges instead
 * @returns {Promise<any[]>} true/false values indicate whether each submission was successful.
 */
export const submitQBInvoices = async ({ 
  invoices, 
  accessToken,
  deleteEmptyInvoices=true
}) => {

  const _accessToken = accessToken 
    ? accessToken 
    : await checkQBValidation_v2()

  const accessCode = "Bearer " + accessToken
  
  if (!_accessToken) {
    console.error("failed to fetch access token")
    return [false]
  } else {
    console.log("Auth check:", truncate(_accessToken, { length:16 }))
  }


  const qbPromises = invoices.map(invoice => {

    const promise = axios.post( 
      getIdAndSyncTokenURL, 
      { accessCode, doc: invoice.DocNumber }
    ).then(response => {
      const Id = response?.data?.Id
      const SyncToken = response?.data?.SyncToken
      const isEmptyInvoice = invoice.Line.length === 1 
        && invoice.Line[0].Description === "(No Items)"

      if (!isEmptyInvoice || !deleteEmptyInvoices) {
        // create/update
        const invInfo = !!Id && Number(Id) > 0
          ? { ...invoice, Id, SyncToken }
          : invoice

        return axios.post(createQbInvoiceUrl, { accessCode, invInfo })

      } else {
        if (!!Id) {
          // delete
          const invInfo = { Id, SyncToken }
          return axios.post(deleteQbInvoiceUrl, { accessCode, invInfo })

        } else {
          // no invoice exists; no action needed
          return null
        }
      }

      
    })
    
    return promise
  })

  const qbResponses = await Promise.allSettled(qbPromises)
  console.log("QB Responses:", qbResponses)
  
  const { true:successes=[], false:failures=[] } = groupBy(
    qbResponses, 
    resp => !!resp && !resp.value.data.errorMessage
  )
  console.log(`success: ${successes.length}/${qbResponses.length}; ${failures.length} failures`)
  

  return qbResponses

  // success signals:
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

}

/** 
 * Submit a single order to AppSync, then to QB, then generate a PDF invoice when not deleting an invoice.
 * @param {Object} input - kwargs
 * @param {Object} input.values - billing object representing the form changes for a customer's order
 * @param {Object} input.initial - billing object representig inital form state.
 * @param {Object} input.orderCache - Produced by useListData. Used to submit and update cache
 * @param {Object} input.invoice - qb invoice object produced by convertOrderToInvoice(values).
 */
export const submitAndPrintInvoice = async ({ 
  values, 
  initial, 
  orderCache, 
  invoice,
}) => {

  const appSyncReturn = await submitOrder({ values, initial, orderCache })
  
  if (appSyncReturn === 1) { 
    console.error("Submit to AppSync failed; exiting...") 
    return
  }

  const accessToken = await checkQBValidation_v2()
    
  const qbResults = await submitQBInvoices({ invoices: [invoice], accessToken })
  if (qbResults.some(r => r === false)) {
    console.error("Submit to QB failed; exiting...")
    return
  }


  const isEmptyInvoice = invoice.Line[0].Description === '(No Items)'
  if (isEmptyInvoice) {
    console.log("No print for deleted invoices")
    return
  }

  const accessCode = "Bearer " + accessToken
  const delivDate = invoice.TxnDate
  const qbID = invoice.CustomerRef.value

  let pdfResponse
  for (let i = 1; i <= 5; i++) {
    pdfResponse = await axios.post(
      getInvoicePdfUrl, 
      { accessCode, delivDate, custID: qbID }
    )

    console.log("PDF response:", pdfResponse)

    if (hasTimeout(pdfResponse)) {
      console.log(`attempt ${i}/5 timed out`)
    } else {
      break
    }

  }

  if (hasTimeout(pdfResponse)) {
    console.error("PDF fetch timed out")
    return 1
  } else {
    const pdf = pdfResponse?.data
    downloadPDF([pdf], `Invoice_${values.header.locNick}_${delivDate}`)

  }

  return pdfResponse

}

const hasTimeout = (response) => 
  !! response?.data?.errorMessage?.includes?.("Task timed out")