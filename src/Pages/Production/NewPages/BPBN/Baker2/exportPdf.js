import jsPDF from "jspdf"
import "jspdf-autotable"
import { isoToDT } from "../utils"



let pageMargin = 20
let tableToNextTitle = 4
let titleToNextTable = tableToNextTitle + 2
let titleFontSize = 14

const pdfTableConstants = {
  theme: "grid",
  headStyles: { textColor: "#111111", fillColor: "#dddddd" },
  margin: pageMargin,
  styles: { fontSize: 11 },

}

export const exportBpbn2Pdf = ({
  reportDate, 
  shapeTotals, 
  prepTotals, 
  croixSetoutTotals
}) => {
  const displayDate = isoToDT(reportDate).toFormat('M/dd/yyyy')

  const doc = new jsPDF("p", "mm", "a4");
  doc.setFontSize(20);
  doc.text(pageMargin, 20, `WhatToMake ${displayDate}`)
  doc.setFontSize(titleFontSize)

  let finalY = 20

  doc.autoTable({
    ...pdfTableConstants,
    startY: finalY + titleToNextTable,
    body: shapeTotals,
    columns: [
      { header: "Product", dataKey: "forBake" },
      { header: "Weight", dataKey: "weight" },
      { header: "Dough", dataKey: "doughNick" },
      { header: "Qty", dataKey: "qty" },
    ],
  })

  finalY = doc.previousAutoTable.finalY + tableToNextTitle

  doc.autoTable({
    ...pdfTableConstants,
    margin: pdfTableConstants.margin + 25,
    startY: finalY + titleToNextTable,
    body: prepTotals,
    columns: [
      { header: "Product", dataKey: "prodName" },
      { header: "Qty", dataKey: "qty" },
    ],
  })

  finalY = doc.previousAutoTable.finalY + tableToNextTitle;

  doc.autoTable({
    ...pdfTableConstants,
    margin: pdfTableConstants.margin + 25,
    startY: finalY + titleToNextTable,
    body: croixSetoutTotals,
    columns: [
      { header: "Set Out", dataKey: "forBake" },
      { header: "Qty", dataKey: "qty" }, // can add pans + extra counts?
    ],
  })

  doc.save(`WhatToShape_${reportDate}.pdf`)

}