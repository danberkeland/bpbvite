import jsPDF from "jspdf"
import "jspdf-autotable"

const pageMargin = 20
const tableToNextTitle = 4
const titleToNextTable = tableToNextTitle + 2
const titleFontSize = 14

export const exportBaker2 = ({
  reportDT, 
  rusticShapeData,
  otherPrepData,
  croixSetoutData,
}) => {

  const doc = new jsPDF("p", "mm", "a4");
  doc.setFontSize(20);
  doc.text(`WhatToMake ${reportDT.toFormat('M/dd/yyyy')}`, pageMargin, 20)
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
      { header: "Set Out", dataKey: "setoutKey" },
      { header: "Qty", dataKey: "total" }, // can add pans + extra counts?
    ],

    theme: "grid",
    headStyles: { textColor: "#111111", fillColor: "#dddddd" },
    styles: { fontSize: 11 },
    margin: pageMargin + 25,
    startY: finalY + titleToNextTable,
  })

  doc.save(`WhatToShape_${reportDT.toFormat('yyyy-MM-dd')}.pdf`)

}