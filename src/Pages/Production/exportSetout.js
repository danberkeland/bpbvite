import jsPDF from "jspdf";
import "jspdf-autotable";

const croixColumns = [
  { header: "Set Out Croissants", dataKey: "setoutKey" },
  { header: "Qty", dataKey: "total" },
  { header: "Pans", dataKey: "pans" },
  { header: "+", dataKey: "remainder" },
]

const otherColumns = [
  { header: "Pastry Prep", dataKey: "rowKey" },
  { header: "Qty", dataKey: "total" },
]

const frozenColumns = [
  { header: "Frozen Pastry Prep", dataKey: "rowKey" },
  { header: "Qty", dataKey: "total" },
]

const almondColumns = [
  { header: "Almond Prep", dataKey: "rowKey" },
  { header: "Qty", dataKey: "total" },
]

export const exportSetout = ({ 
  reportLocation, 
  reportDT,
  croix,
  other,
  frozen,
  almond,
}) => {
  const pageMargin = 58

  const doc = new jsPDF("portrait", "mm", "letter")
  let finalY = 20

  const renderTable = (body, columns) => {
    doc.autoTable({
      body,
      columns,
      theme: "grid",
      headStyles: { textColor: "#111111", fillColor: "#dddddd" },
      styles: { fontSize: 11 },
      margin: pageMargin,
      startY: finalY + 16,
    })
    finalY = doc.previousAutoTable.finalY
  }

  doc.setFontSize(20)
  doc.text(`${reportLocation} Pastry Prep ${reportDT.toFormat('MM/dd/yyyy')}`, pageMargin, 20)

  renderTable(croix, croixColumns)
  renderTable(other, otherColumns)
  if (!!frozen) { renderTable(frozen, frozenColumns) }
  if (!!almond) { renderTable(almond, almondColumns) }

  doc.save(`Setout_${reportLocation}_${reportDT.toFormat('yyyy-MM-dd')}.pdf`)

}