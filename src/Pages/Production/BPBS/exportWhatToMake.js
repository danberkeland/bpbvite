import jsPDF from "jspdf";
import "jspdf-autotable";

const getFrenchPocketColumns = isToday => [
  { header: "Pocket Size", dataKey: "weight" },
  { header: "Available",   dataKey: isToday ? "preshaped" : "prepreshaped" },
  { header: "Need Today",  dataKey: "neededEa" },
].concat(
  isToday ? [{ header: "Surplus(+)/Short(-)", dataKey: "surplusEa" }] : []
)

const freshColumns = [
  { header: "Fresh Product", dataKey: "rowKey" },
  { header: "Total Deliv",   dataKey: "T0Ea" },
  { header: "Early",         dataKey: "earlyEa" },
  { header: "Bag EOD",       dataKey: "T1Ea" },
]

const shelfColumns = [
  { header: "Shelf Product", dataKey: "rowKey" },
  { header: "Total Deliv",   dataKey: "delivEa" },
  { header: "Need Today",    dataKey: "needTodayEa" },
  { header: "Make Total",    dataKey: "totalEa" },
]

const pretzelColumns = [
  { header: "Pretzel Product", dataKey: "rowKey" },
  { header: "Bake Today",      dataKey: "bakeEa" },
  { header: "Shape Today",     dataKey: "shapeEa" },
  { header: "Bag EOD",         dataKey: "bagEa" },
]

const freezerColumns = [
  { header: "Freezer Product", dataKey: "rowKey" },
  { header: "Total Deliv",     dataKey: "delivEa" },
  { header: "Need Today",      dataKey: "needTodayEa" },
  { header: "Make Total",      dataKey: "totalEa" },
]

export const exportWhatToMake = ({
  reportDT,
  isToday,
  frenchPocketData,
  freshData,
  shelfData,
  pretzelData,
  freezerData,
}) => {
  const margin = 40
  
  const doc = new jsPDF("portrait", "mm", "letter")
  let startY = 30

  const renderTable = (body, columns) => {
    doc.autoTable({
      body,
      margin,
      columns,
      startY,
      styles: { fontSize: 11 },
      theme: "grid",
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    })
    startY = doc.previousAutoTable.finalY + 10
  }

  doc.setFontSize(20);
  doc.text(`What to Make ${reportDT.toFormat('MM/dd/yyyy')}`, margin, 20)

  renderTable(frenchPocketData, getFrenchPocketColumns(isToday))
  doc.setFontSize(11)
  doc.text("Early column counts AM North & Sandos orders", margin, startY)
  startY += 3
  renderTable(freshData, freshColumns)
  renderTable(shelfData, shelfColumns)
  doc.addPage()
  doc.text([
    'What to Make',
    reportDT.toFormat('MM/dd/yyyy'),
  ], 176, 20, { align: "right" })
  startY = 30
  renderTable(pretzelData, pretzelColumns)
  renderTable(freezerData, freezerColumns)

  doc.save(`BPBS_WhatToMake_${reportDT.toFormat('yyyy-MM-dd')}.pdf`);

}