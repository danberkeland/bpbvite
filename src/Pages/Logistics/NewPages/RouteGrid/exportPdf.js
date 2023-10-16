import jsPDF from "jspdf"
import "jspdf-autotable"
import { flatMap, flatten, mapValues, sortBy, uniqBy } from "lodash"
import { checkQBValidation, checkQBValidation_v2 } from "../../../../helpers/QBHelpers"
import axios from "axios"
import { downloadPDF } from "../../../../functions/legacyFunctions/helpers/PDFHelpers"

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
  routes, 
  locations, 
  reportDateDT 
}) => {

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

  const invoiceIds = orderedUniqLocations.filter(L => 
    L.toBePrinted === true
  ).flatMap(L => 
    L.printDuplicate ? [L.qbID, L.qbID] : L.qbID
  )

  const accessToken = await checkQBValidation_v2()

  const accessCode = "Bearer " + accessToken
  const delivDate = reportDateDT.toFormat('yyyy-MM-dd') // "transaction date"

  const pdfPromises = invoiceIds.map(qbID => axios.post(
    "https://47i7i665dd.execute-api.us-east-2.amazonaws.com/done",
    { accessCode, delivDate, custID: qbID }
  ))

  const pdfResponses = await Promise.all(pdfPromises)

  console.log("pdfResponses", pdfResponses)
  const pdfs = pdfResponses.map(resp => resp.data)

  const fileName = `${delivDate}_Invoices.pdf`

  downloadPDF(pdfs, fileName)


}
