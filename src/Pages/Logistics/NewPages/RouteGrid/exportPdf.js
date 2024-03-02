import jsPDF from "jspdf"
import "jspdf-autotable"
import { sortBy, uniqBy, groupBy, orderBy } from "lodash"
import { checkQBValidation_v2 } from "../../../../data/QBHelpers"
import axios from "axios"
import { downloadPDF } from "../../../../utils/pdf/downloadPDF"

/** Designed to work with the gridData object made with the useRouteGrid hook. */
export const exportRouteGridPdf = ({ gridData, reportDateDT, fileName }) => {

  const sortedRouteNicks = orderBy(
    Object.keys(gridData), 
    routeNick => gridData[routeNick].printOrder,
    'asc'
  )

  const doc = new jsPDF({ format: 'letter', orientation: 'landscape' }) // ("l", "mm", "a4")
  let isFirstPage = true
  for (let routeNick of sortedRouteNicks) {

    const { columns, body } = gridData[routeNick]
    
    if (!isFirstPage) doc.addPage('letter', 'landscape') //("a4", "l") 
    isFirstPage = false

    // **** Janky Hack to deal with large BPB Orders ***

    // separates bpb type rows into their own table so that pivot columns
    // don't become too cluttered and break formatting.

    const _body = body.filter(row => 
      !['backporch', 'bpbkit', 'bpbextras'].includes(row.locNick) 
    )
    const bpbBody = body.filter(row => 
      ['backporch', 'bpbkit', 'bpbextras'].includes(row.locNick) 
    )

    const _columns = bpbBody.length
      ? columns.filter(column => 
          column.header === "Location"
          || _body.some(row => row.hasOwnProperty(column.header)) // pivot column headers match prodNick keys in each row object 
        )
      : columns
    const bpbColumns = columns.filter(column => 
      column.header === "Location"
      || bpbBody.some(row => row.hasOwnProperty(column.header))
    )

    if (bpbBody.length) {
      doc.autoTable({
        columns: bpbColumns,
        body: bpbBody,
        theme: "grid",
        headStyles: { fillColor: "#dddddd", textColor: "#111111" },
        margin: { top: 26 },
        styles: { fontSize: 12 },
      })
    }

    // **** End Janky Hack ****
    
    doc.setFontSize(20);
    doc.text(10, 20, `${routeNick} ${reportDateDT.toFormat('MM/dd/yyyy')}`);
    doc.autoTable({
      columns: _columns,
      body: _body,
      theme: "grid",
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
      margin: { top: 26 },
      styles: { fontSize: 12 },
    })

        
  } // end for...

  doc.save(fileName)
}




// gridData is an object keyed by routeNicks. Each routeNick value is an
// object containing grid data shaped for pdf exports. each grid data object
// has a 'body' attribute containing array-of-object row data.
// Each row object has a locNick attribue.
//
// We can get our list of invoice customers by iterating over routeNick keys
// and over body rows.
export const exportInvoicePdf = async ({ 
  gridData, 
  fileName,
  routes, 
  locations, 
  reportDateDT,
  setIsLoading,
}) => {
  
  setIsLoading(true)

  const orderedRouteNicks = sortBy(
    Object.keys(gridData), 
    routeNick => routes[routeNick].printOrder ?? 0
  )

  // body rows are already sorted by delivOrder in the data hook
  // Note: after completing this function I decided to carry route information
  // through, so routeNicks are shoehorned into location objects. Be aware of 
  // this extra, non-standard property
  const orderedLocations = orderedRouteNicks.flatMap(routeNick => 
      gridData[routeNick].body.map(row => ({
        ...locations[row.locNick],
        routeNick
      })),
  )

  // uniqBy preserves order of first appearance. Batch print jobs should only 
  // include locations that are configured for printed invoices.
  const orderedUniqLocations = uniqBy(orderedLocations, 'locNick').filter(location => 
    location.toBePrinted === true
  )

  // proper qbID's are positive integer strings
  const locationsWithBadIDs = orderedUniqLocations.filter(location => 
    !(location.qbID.match(/^\d+$/))
  )

  if (locationsWithBadIDs.length) console.warn(
    "Bad IDs encountered:", 
    locationsWithBadIDs.map(L => ({ locNick: L.locNick, qbID: L.qbID }))
  )

  const accessToken = await checkQBValidation_v2()
  const accessCode = "Bearer " + accessToken
  const delivDate = reportDateDT.toFormat('yyyy-MM-dd') // "transaction date"

  const fetchInvoice = (qbID) => axios.post(
    "https://47i7i665dd.execute-api.us-east-2.amazonaws.com/done",
    { accessCode, delivDate, custID: qbID }
  )

  const hasTimeout = (response) => 
    typeof response?.data?.errorMessage === 'string'
      && response.data.errorMessage.includes("Task timed out")

  let pdfResponses = await Promise.all(
    orderedUniqLocations.map(L => fetchInvoice(L.qbID))
  )
  console.log("PDF responses:", pdfResponses)
  for (let i = 1; i <= 5; i++) {
    if (pdfResponses.some(response => hasTimeout(response))) {

      console.log("Some requests timed out:")
      pdfResponses.forEach((response, index) => {
        if (hasTimeout(response)) {
          console.log(orderedUniqLocations[index].locNick)
        }
      })
      console.log(`Retry attempt ${i} of 5...`)

      const retryPromises = pdfResponses.map((response, index) => 
        hasTimeout(response)
          ? fetchInvoice(orderedUniqLocations[index].qbID)
          : response
      )
      pdfResponses = await Promise.all(retryPromises)
      console.log("...with retrys:", pdfResponses)

    } else { 
      console.log("No timeouts encountered.")
      break
    }
  }

  // keep location data associated with pdf responses. 
  // At this point the arrays correspond by index.
  const responsesWithLocations = pdfResponses.map((pdfResponse, index) => ({
    pdfResponse,
    location: orderedUniqLocations[index]
  }))

  const { true:successes=[], false:failures=[] } = groupBy(
    responsesWithLocations,
    rwl => typeof rwl.pdfResponse.data === 'string'
  )

  console.log(
    `Fetch success count: ${successes.length}/${pdfResponses.length}`
  )

  if (failures.length) {
    console.error(
      "Fetch failed for:",
      Object.fromEntries(
        failures.map(rwl => [rwl.location.locNick, rwl.pdfResponse.data])
      )
    )

    if (failures.some(rwl => hasTimeout(rwl.pdfResponse))) {
      alert(
        "Fetch timed out for the following locations:\n\n"
        + failures
            .filter(rwl => hasTimeout(rwl.pdfResponse))
            .map(rwl => `${rwl.location.routeNick} > ${rwl.location.locNick}`)
            .join('\n')

        +"\n\nTry grabbing these invoices individually."
      )
    }
  }
  
  
  const pdfs = successes.flatMap(rwl => 
    rwl.location.printDuplicate ? [rwl, rwl] : rwl
  ).map(rwl => rwl.pdfResponse.data)

  downloadPDF(pdfs, fileName)
  setIsLoading(false)

}


export const exportSingleInvoice = async ({ 
  location, 
  delivDate, 
  setIsLoading 
}) => {

  setIsLoading(true)

  if (!(location.qbID.match(/^\d+$/))) {
    console.warn("Bad qbID: ", location.qbID)
  }

  const accessToken = await checkQBValidation_v2()
  const accessCode = "Bearer " + accessToken

  const fetchInvoice = (qbID) => axios.post(
    "https://47i7i665dd.execute-api.us-east-2.amazonaws.com/done",
    { accessCode, delivDate, custID: qbID }
  )

  const hasTimeout = (response) => 
    typeof response?.data?.errorMessage === 'string'
    && response.data.errorMessage.includes("Task timed out")

  let pdfResponse = await fetchInvoice(location.qbID)

  if (hasTimeout(pdfResponse)) for (let i = 1; i <= 5; i++) {

    console.log(`Request timed out: Retrying (${i}/5)...`)
    pdfResponse = await fetchInvoice(location.qbID)
  } else {
    console.log("No timeout encountered")
  }

  if (typeof pdfResponse.data !== 'string') {

    console.error(`Fetch failed for ${location.locNick}:`, pdfResponse.data)
    alert(`Fetch failed with error message:\n\n${pdfResponse.data?.errorMessage}`)
  } else {

    downloadPDF(
      [pdfResponse.data], 
      `${delivDate}_${location.locNick}_Invoice.pdf`
    )
  }
  
  setIsLoading(false)
}