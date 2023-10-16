import jsPDF from "jspdf"
import "jspdf-autotable"
import { sortBy, uniqBy } from "lodash"
import { checkQBValidation_v2 } from "../../../../helpers/QBHelpers"
import axios from "axios"
import { downloadPDF } from "../../../../functions/legacyFunctions/helpers/PDFHelpers"
import { groupBy } from "lodash"

/** Designed to work with the gridData object made with the useRouteGrid hook. */
export const exportRouteGridPdf = ({ gridData, reportDateDT, fileName }) => {
    
  const doc = new jsPDF("l", "mm", "a4")
  let isFirstPage = true
  for (let routeNick of Object.keys(gridData)) {

    const { columns, body } = gridData[routeNick]
    
    if (!isFirstPage) doc.addPage("a4", "l") 
    isFirstPage = false

    // **** Janky Hack to deal with large BPB Orders ***

    // separates bpb type rows into their own table so that pivot columns
    // don't become too cluttered.

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
    routeNick => routes[routeNick].printOrder
  )

  // body rows are sorted by delivOrder in the data hook
  const orderedLocNicks = orderedRouteNicks.flatMap(routeNick => 
      gridData[routeNick].body.map(row => row.locNick),
  )
  // uniqBy preserves order of first appearance 
  const orderedUniqLocations = uniqBy(orderedLocNicks).map(locNick => 
    locations[locNick]
  )

  const locationsWithBadIDs = orderedUniqLocations.filter(location => 
    !(location.qbID.match(/^\d+$/))
  )

  if (locationsWithBadIDs.length) console.warn(
    "Bad IDs found: ", 
    Object.fromEntries(
      locationsWithBadIDs.map(L => [L.locNick, L.qbID])
    )
  )

  const accessToken = await checkQBValidation_v2()
  const accessCode = "Bearer " + accessToken
  const delivDate = reportDateDT.toFormat('yyyy-MM-dd') // "transaction date"

  const pdfPromises = orderedUniqLocations.map(location => axios.post(
    "https://47i7i665dd.execute-api.us-east-2.amazonaws.com/done",
    { accessCode, delivDate, custID: location.qbID }
  ))

  const pdfResponses = await Promise.all(pdfPromises)
  // console.log("pdfResponses", pdfResponses)

  // keep location data associated with the generated responses.
  const responsesWithLocations = pdfResponses.map((pdfResponse, index) => ({
    pdfResponse,
    location: orderedUniqLocations[index]
  }))

  const { true:successes=[], false:failures=[] } = groupBy(
    responsesWithLocations,
    rwl => typeof rwl.pdfResponse.data === 'string'
  )

  if (successes.length) console.log(
    "Fetch succeeded for:", 
    successes.map(rwl => rwl.location.locNick),
  )

  if (failures.length) console.error(
    "Fetch failed for:",
    Object.fromEntries(
      failures.map(rwl => [rwl.location.locNick, rwl.pdfResponse.data])
    )
  )
  
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

  const pdfResponse = await axios.post(
    "https://47i7i665dd.execute-api.us-east-2.amazonaws.com/done",
    { accessCode, delivDate, custID: location.qbID }
  )

  if (typeof pdfResponse.data !== 'string') {

    console.error(`Fetch failed for ${location.locNick}:`, pdfResponse.data)
  } else {

    downloadPDF(
      [pdfResponse.data], 
      `${delivDate}_${location.locNick}_Invoice.pdf`
    )
    setIsLoading(false)

  }



  
}