import { groupByObject, uniqByRdc } from "../../utils/collectionFns"

import { QB } from "../../data/qbApiFunctions"
import { downloadPDF } from "../../utils/pdf/downloadPDF"

async function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

// May want to change input pivotData to simple location data to make
// the function more versatile.

// For use on RouteGrids page

export const exportInvoices = async (
  pivotTables,
  reportDT,
  fileIdString,
  setIsLoading,
) => {
  if (!pivotTables) return
  setIsLoading(true)

  // invoice list should be sorted by route.printOrder > location.delivOrder.
  // pivot tables already accomplish this.
  const invoiceRows = pivotTables
    .flat()
    .filter(row => row.rowProps.toBePrinted)
    .reduce(uniqByRdc(row => row.rowProps.locNick), []) // a location may show up on 2 routes (e.g. lincoln)
  
  // proper qbID's are positive integer strings
  const badIdRows = invoiceRows.filter(row => !(row.rowProps.qbID.match(/^\d+$/)))
  if (badIdRows.length) console.warn(
    "Bad IDs encountered:", 
    badIdRows.map(L => ({ locNick: L.locNick, qbID: L.qbID }))
  )
  
  const hasTimeout = (response) => 1
    && typeof response?.data?.errorMessage === 'string'
    && response.data.errorMessage.includes("Task timed out")

  const hasThrottleError = (response) => 1
    && response?.data?.errorMessage?.endsWith('429')
  
  const accessToken = await QB.getAccessToken()
  const delivDate = reportDT.toFormat('yyyy-MM-dd')
  const [yyyy, mm, dd] = delivDate.split("-")

  if (!accessToken) {
    console.warn('Failed to grant access'); return
  }
  
  let pdfResponses = await Promise.all(
    invoiceRows.map(async (row, idx) => {
      await sleep(idx * 500)

      // console.log('CustomerRef', row.rowProps.qbID)
      // console.log('DocNumber', `${mm}${dd}${yyyy}${row.rowProps.locNick}`)
      // return QB.invoice.getPdf({ CustomerId: row.rowProps.qbID, delivDate, accessToken })
      return QB.invoice.getPdfByDocNumber({ 
        CustomerRef: row.rowProps.qbID, 
        DocNumber: `${mm}${dd}${yyyy}${row.rowProps.locNick}`, 
        accessToken 
      })
    }
  ))

  for (let i = 1; i <= 5; i++) {
    console.log("responses:", pdfResponses)
    const timeouts = pdfResponses.filter(response => hasTimeout(response) || hasThrottleError(response))
    if (timeouts.length === 0) {
      console.log("No timeouts encountered.")
      break
    }

    console.log("Some requests timed out or failed:", timeouts)
    console.log(`Retry attempt ${i} of 5...`)

    const retryPromises = pdfResponses.map((response, index) => (hasTimeout(response) || hasThrottleError(response))
      // ? QB.invoice.getPdf({ CustomerId: invoiceRows[index].rowProps.qbID, delivDate, accessToken })
      ? QB.invoice.getPdfByDocNumber({
          CustomerRef: invoiceRows[index].rowProps.qbID,
          DocNumber: `${mm}${dd}${yyyy}${invoiceRows[index].rowProps.locNick}`, 
          accessToken
        })
      : response
    )

    pdfResponses = await Promise.all(retryPromises)
    console.log("...with retrys:", pdfResponses)
    
  }

  // keep location data associated with pdf responses. 
  // At this point the arrays correspond by index.
  const responsesWithLocations = pdfResponses.map((pdfResponse, index) => ({
    pdfResponse,
    locNick: invoiceRows[index].rowProps.locNick,
    routeNick: invoiceRows[index].rowProps.routeNick,
    printDuplicate: invoiceRows[index].rowProps.printDuplicate
  }))

  const { true:successes=[], false:failures=[] } = groupByObject(
    responsesWithLocations,
    rwl => typeof rwl.pdfResponse.data === 'string'
  )

  console.log(`Fetch success count: ${successes.length}/${pdfResponses.length}`)

  if (failures.length) {
    console.error("Fetch failed for:", 
      Object.fromEntries(failures.map(rwl => [rwl.locNick, rwl.pdfResponse.data]))
    )

    if (failures.some(rwl => hasTimeout(rwl.pdfResponse))) {
      alert(
        "Fetch failed for the following locations:\n\n"
        + failures
            .filter(rwl => hasTimeout(rwl.pdfResponse))
            .map(rwl => `${rwl.routeNick} > ${rwl.locNick}`)
            .join('\n')
        + "\n\nTry again or grab these invoices individually."
      )
    }

  }

  const pdfs = successes.flatMap(rwl => 
    rwl.printDuplicate ? [rwl, rwl] : rwl
  ).map(rwl => rwl.pdfResponse.data)

  downloadPDF(pdfs, `${fileIdString}_Invoices_${reportDT.toFormat('yyyy-MM-dd')}`)
  setIsLoading(false)
  
}