import jsPDF from "jspdf"
import "jspdf-autotable"

let finalY
let pageMargin = 20
let tableToNextTitle = 12
let titleToNextTable = tableToNextTitle + 4
let tableFont = 11
let titleFont = 14

const rusticColumns = [
  { header: "Product", dataKey: "forBake" },
  { header: "Qty", dataKey: "qty" },
  { header: "Shaped", dataKey: "shaped" },
  { header: "Short", dataKey: "short" },
  { header: "Need Early", dataKey: "qtyNeededEarly" },
]

const doobieColumns = [
  { header: "Product", dataKey: "Prod" },
  { header: "Bucket", dataKey: "Bucket" },
  { header: "Mix", dataKey: "Mix" },
  { header: "Bake", dataKey: "Bake" },
]

const otherPrepColumns = [
  { header: "Product", dataKey: "prodName" },
  { header: "Qty", dataKey: "qty" },
]

const baguetteColumns = [
  { header: "Item", dataKey: "label" },
  { header: "Amount", dataKey: "amount" },
]

const buildTable = (title, doc, body, col) => {
  doc.setFontSize(titleFont);
  doc.text(pageMargin, finalY + tableToNextTitle, title);
  doc.autoTable({
    theme: "grid",
    headStyles: {fillColor: "#dddddd", textColor: "#111111"},
    body: body,
    margin: pageMargin,
    columns: col,
    startY: finalY + titleToNextTable,
    styles: { fontSize: tableFont },
  })
}

export const exportBpbn1Pdf = ({ 
  rusticData,
  doobieStuff,
  otherPrepData,
  mixes,
  bins,
  pans,
  buckets,
  displayDate,
  filename,
}) => {
  const doc = new jsPDF("p", "mm", "a4")
  doc.setFontSize(20)
  doc.text(pageMargin, 20, `What To Bake ${displayDate}`)

  finalY = 20

  buildTable(`Bake List`, doc, rusticData, rusticColumns)
  finalY = doc.previousAutoTable.finalY + tableToNextTitle

  buildTable(`Doobie Stuff`, doc, doobieStuff, doobieColumns)
  finalY = doc.previousAutoTable.finalY + tableToNextTitle

  buildTable(`Prep List`, doc, otherPrepData, otherPrepColumns)
  finalY = doc.previousAutoTable.finalY + tableToNextTitle

  doc.addPage()
  finalY = 20

  mixes.forEach(mix => {
    buildTable(
      `Baguette Mix #${mix.mixNumber}`, 
      doc, 
      mix.components, 
      baguetteColumns
    )
    finalY = doc.previousAutoTable.finalY + tableToNextTitle

  })

  doc.addPage()
  finalY = 20

  buildTable(`Bins`, doc, bins, baguetteColumns)
  finalY = doc.previousAutoTable.finalY + tableToNextTitle

  buildTable(`Pocket Pans`, doc, pans, baguetteColumns)
  finalY = doc.previousAutoTable.finalY + tableToNextTitle

  buildTable(`Bucket Sets`, doc, buckets, baguetteColumns)
  finalY = doc.previousAutoTable.finalY + tableToNextTitle

  doc.save(filename)

}


