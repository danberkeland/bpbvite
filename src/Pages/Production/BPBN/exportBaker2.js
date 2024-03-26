import jsPDF from "jspdf"
import "jspdf-autotable"

let pageMargin = 20
let tableToNextTitle = 4
let titleToNextTable = tableToNextTitle + 2
let titleFontSize = 14

export const exportBaker2 = ({
  reportDT, 
  rusticShapeData,
  otherPrepData,
  croixSetoutData,
}) => {
  const displayDate = reportDT.toFormat('M/dd/yyyy')

  const doc = new jsPDF("p", "mm", "a4");
  doc.setFontSize(20);
  doc.text(pageMargin, 20, `WhatToMake ${displayDate}`)
  doc.setFontSize(titleFontSize)

  let finalY = 20

  doc.autoTable({
    body: rusticShapeData,
    columns: [
      { header: "Product", dataKey: "forBake" },
      { header: "Weight",  dataKey: "weight" },
      { header: "Dough",   dataKey: "doughNick" },
      { header: "Qty",     dataKey: "qty" },
    ],

    theme: "grid",
    headStyles: { textColor: "#111111", fillColor: "#dddddd" },
    styles: { fontSize: 11 },
    margin: pageMargin,
    startY: finalY + titleToNextTable,
  })

  finalY = doc.previousAutoTable.finalY + tableToNextTitle

  doc.autoTable({
    body: otherPrepData,
    columns: [
      { header: "Product", dataKey: "prodName" },
      { header: "Qty", dataKey: "qty" },
    ],

    theme: "grid",
    headStyles: { textColor: "#111111", fillColor: "#dddddd" },
    styles: { fontSize: 11 },
    margin: pageMargin + 25,
    startY: finalY + titleToNextTable,
  })

  finalY = doc.previousAutoTable.finalY + tableToNextTitle;

  doc.autoTable({
    body: croixSetoutData,
    columns: [
      { header: "Set Out", dataKey: "prodNick" },
      { header: "Qty", dataKey: "qty" }, // can add pans + extra counts?
    ],

    theme: "grid",
    headStyles: { textColor: "#111111", fillColor: "#dddddd" },
    styles: { fontSize: 11 },
    margin: pageMargin + 25,
    startY: finalY + titleToNextTable,
  })

  doc.save(`WhatToShape_${reportDT.toFormat('yyyy-MM-dd')}.pdf`)

}