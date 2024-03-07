import { groupBy, isEqual, pickBy, set, truncate } from "lodash"
import { getTimeToLive } from "../../../utils/dateAndTime/getTimeToLive"

import { QB } from "../../../data/qbApiFunctions"
import { downloadPDF } from "../../../utils/pdf/downloadPDF"

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
    }
    else if (nAttempts > 0 && hasTimeout(response)) {
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

/**Implements retryOnTimeout for our needs */
const withRetry = (submitFn) => 
  retryOnTimeout({ submitFn, nAttempts: 3, delayMs: 1000 })


/** Submit to AppSync */
export const submitOrder = async ({ values:_values, initial, orderCache }) => {
  console.log(initial, _values)

  // const headerChanged = !isEqual(initial.header, values.header)
  // const itemsChanged = !isEqual(initial.items, values.items)

  // console.log("header changed?", headerChanged)
  // console.log("items chagned?", itemsChanged)
  
  // set delivFee to null if submitting an order with 0 items delivered.
  // QB submission will know not to apply the fee, but if the order is
  // resubmitted with items delivered, we would rather return to the default
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

/**
 * DEPRECIATED
 * 
 * Submit invoice objects to Quickbooks. 
 * @param {Object}    input - kwargs.
 * @param {Object[]}  input.invoices - An array of invoice objects. Should 
 * have all necessary attributes except the customer's qbID and SyncToken.
 * @param {string}    input.accessToken 
 * @param {boolean}  [input.deleteEmptyInvoices=true] - (default: true) 
 * When false, submits an invoice with no items/charges instead.
 * @returns {Promise<any[]>} - Resolves to an array containing QB responses, 
 * or null values when no order & no invoice exists.
 */
const submitQBInvoices = async ({ 
  invoices, 
  accessToken,
  deleteEmptyInvoices=true
}) => {

  const promises = invoices.map(invoice => {
    const isEmptyInvoice = invoice.Line.length === 1 
      && invoice.Line[0].Description === "(No Items)"

    const promise = QB.invoice.get({ DocNumber: invoice.DocNumber, accessToken })
      .then(response => {
        const Id = response?.data?.Id
        const SyncToken = response?.data?.SyncToken

        if (!isEmptyInvoice || !deleteEmptyInvoices) {
          const _invoice = !!Id && Number(Id) > 0
            ? { ...invoice, Id, SyncToken } // update
            : invoice                       // create

          return QB.invoice.create({ invoice: _invoice, accessToken })

        } else if (!!Id) {
          return QB.invoice.delete({ Id, SyncToken, accessToken })

        } else {
          // no invoice exists; nothing to delete
          return null
        }

      })
    
    return promise

  })

  return Promise.allSettled(promises)
}


// todo: replace submitQBInvoices with more up to date code. 
// model after batch submit function
/** 
 * Submit a single order to AppSync, then to QB, then generate a PDF invoice 
 * when not deleting an invoice.
 * @param {Object} input - kwargs
 * @param {Object} input.values - 
 * billing object representing the form changes for a customer's order
 * @param {Object} input.initial - 
 * billing object representig inital form state.
 * @param {Object} input.orderCache - 
 * Produced by useListData. Used to submit and update cache
 * @param {Object} input.invoice - 
 * qb invoice object produced by convertOrderToInvoice(values).
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

  const accessToken = await QB.getAccessToken()
  console.log("accessToken:", truncate(accessToken, { length: 16 }))
    
  const qbResponses = await submitQBInvoices({ 
    invoices: [invoice], 
    accessToken 
  })
  console.log(qbResponses)

  const qbResults = qbResponses.map(response => {
    if (response === null) return null

    const data = response.value.data
    if (!!data.errorMessage) return "error"
    if (data.Invoice.status === "Deleted") return "deleted"
    if (data.Invoice.Id) return "created"
    return ('unhandled exception')
  })
  console.log("results", qbResults)
  const result = qbResults[0]
  if (result !== 'created') {
    console.log("No PDF to print; exiting...")
    return
  }

  let pdfResponse
  for (let i = 1; i <= 5; i++) {
    pdfResponse = await QB.invoice.getPdf({ 
      CustomerId: invoice.CustomerRef.value, 
      delivDate: invoice.TxnDate, 
      accessToken 
    })
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
    downloadPDF([pdf], `Invoice_${values.header.locNick}_${invoice.TxnDate}`)

  }
      

}


/**
 * Take a batch of orders form our system and save them as Invoices in QB.
 * Designed to work with data produced for the billing page.
 * @param {Object} kwargs
 * @param {Object} kwargs.billingDataByLocNick - Data as produced by useBillingDataByDate
 * @param {Function} kwargs.convertOrderToInvoice - as produced by useBillingDataByDate 
 * @param {Object} kwargs.locations - Data produced by useListData, keyed by locNick
 * @param {boolean} [kwargs.shouldSendEmail] - flag to send emails after submitting invoices
 */
export const batchSubmitQbInvoices = async ({ 
  billingDataByLocNick,
  convertOrderToInvoice,
  locations,
  shouldSendEmail=false,
}) => {

  const locNicks = Object.keys(billingDataByLocNick)

  const { noInvoiceLocNicks=[], createLocNicks=[], deleteLocNicks=[] } = groupBy(
    locNicks,
    locNick => {
      if (locations[locNick].invoicing === "no invoice") {
        return "noInvoiceLocNicks"
      }
      if (billingDataByLocNick[locNick].items.every(item => item.qty === 0)) {
        return "deleteLocNicks"
      }
      return "createLocNicks"
    }
  )

  console.log("Authenticating")
  const accessToken = (createLocNicks.length || deleteLocNicks.length)
    ? await QB.getAccessToken()
    : null
  console.log("Access Token:", truncate(accessToken, {length:16}))

  const noInvoiceResults = noInvoiceLocNicks.map(locNick => ({
    locNick, action: "no action", result: "does not get invoiced"
  }))

  const deleteResults = deleteLocNicks.map(locNick => {
    const invoice = convertOrderToInvoice({ 
      cartOrder:billingDataByLocNick[locNick] 
    })
    
    return QB.invoice
      .get({ DocNumber: invoice.DocNumber, accessToken })
      .then(response => {
        if (!response?.data?.Id) {
          return { locNick, action: "no action", result: "has no invoice/order"}
        }
        const { Id, SyncToken } = response.data

        return withRetry(
          QB.invoice.delete({ Id, SyncToken, accessToken })
        ).then(response =>  handleDeleteResponse({ response, locNick }))

      })

  })


  const createResults = createLocNicks.map(locNick => {
    const invoice = convertOrderToInvoice({ 
      cartOrder:billingDataByLocNick[locNick] 
    })

    return QB.invoice.get({ 
      DocNumber: invoice.DocNumber, 
      accessToken 
    }).then(response => {
      // console.log("GET response", response)
      const { Id, SyncToken } = response?.data ?? {}
      
      return withRetry(QB.invoice.create({ 
        invoice: Id ? { ...invoice, Id, SyncToken } : invoice,
        accessToken 
      })).then(response => {
        // console.log("CREATE resp", response)

        const data = response?.data
        if (!data) {
          return { locNick, action: "create", result: "unknown error" }

        }
        if (!!data.errorMessage) {
          return { locNick, action: "create", result: data.errorMessage }

        }

        if (shouldSendEmail) {
          if (locations[locNick].toBeEmailed) {
            return QB.invoice.sendEmail({ 
              InvoiceId: response.data.Invoice.Id, 
              accessToken 
            }).then(response => {
              // console.log("EMAIL resp", response)
              const result = handleEmailResponse({ response, locNick })
              return result
            })

          } else {
            return { locNick, action: "create only", result: "success"}

          }
        } else {
          return { locNick, action: "create", result: "success"}
        }

      })
    })
  })

  const resultPromises = [
    ...noInvoiceResults, 
    ...deleteResults, 
    ...createResults
  ]

  return resultPromises

}

/**Parse responses and convert to a summary result object */
const handleDeleteResponse = ({ response, locNick }) => {
  {
    if (response === null) return { 
      locNick, 
      action: "get", 
      result: "no invoice" 
    }
    const data = response?.data
    if (!data) {
      return { 
        locNick, 
        action: "delete", 
        result: "unknown error"
       }

    }
    if (!!data.errorMessage) {
      return { 
        locNick, 
        action: "delete", 
        result: data.errorMessage 
      }

    }
    else return { 
      locNick, 
      action: "delete", 
      result: "success"
    }
  }
}

/**Parse responses and convert to a summary result object */
const handleEmailResponse = ({ response, locNick }) => {
  if (!!response.result) return response

  const data = response?.data
  if (!data) {
    return { 
      locNick, 
      action: "create & email", 
      result: "unknown error"
    }
  }
  if (!!data.errorMessage) {
    return { 
      locNick, 
      action: "create & email", 
      result: data.errorMessage }
  }
  return { 
    locNick, 
    action: "create & email", 
    result: "success" 
  }
}






