import jsPDF from "jspdf"
import "jspdf-autotable"

const rusticColumns = [
  { header: "Product", dataKey: "forBake" },
  { header: "Weight",  dataKey: "weight" },
  { header: "Dough",   dataKey: "doughNick" },
  { header: "Qty",     dataKey: "qty" },
]

const otherPrepColumns = [
  { header: "Product", dataKey: "prodName" },
  { header: "Qty", dataKey: "qty" },
]

const croixSetoutColumns = [
  { header: "Set Out", dataKey: "setoutKey" },
  { header: "Qty", dataKey: "total" }, // can add pans + extra counts?
]

export const exportBaker2 = ({
  reportDT, 
  rusticShapeData,
  otherPrepData,
  croixSetoutData,
}) => {

  const doc = new jsPDF("portrait", "mm", "letter");
  let finalY = 20

  const renderTable = (body, columns, margin) => {
    doc.autoTable({
      body,
      columns,
      theme: "grid",
      headStyles: { textColor: "#111111", fillColor: "#dddddd" },
      styles: { fontSize: 11 },
      margin: margin ?? 20,
      startY: finalY + 6,
    })
    finalY = doc.previousAutoTable.finalY + 4
  }

  doc.setFontSize(20);
  doc.text(`WhatToMake ${reportDT.toFormat('MM/dd/yyyy')}`, 20, 20)
  
  renderTable(rusticShapeData, rusticColumns)
  renderTable(otherPrepData,   otherPrepColumns, 45)
  renderTable(croixSetoutData, croixSetoutColumns, 45)
  
  doc.save(`WhatToShape_${reportDT.toFormat('yyyy-MM-dd')}.pdf`)

}