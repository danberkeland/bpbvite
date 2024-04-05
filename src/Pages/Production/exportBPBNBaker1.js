import jsPDF from "jspdf"
import "jspdf-autotable"

const rusticColumns = [
  { header: "Product",    dataKey: "forBake" },
  { header: "Qty",        dataKey: "qty" },
  { header: "Shaped",     dataKey: "shaped" },
  { header: "Short",      dataKey: "short" },
  { header: "Need Early", dataKey: "earlyQty" },
]

const doobieColumns = [
  { header: "Product", dataKey: "Prod" },
  { header: "Bucket",  dataKey: "Bucket" },
  { header: "Mix",     dataKey: "Mix" },
  { header: "Bake",    dataKey: "Bake" },
]

const otherPrepColumns = [
  { header: "Product", dataKey: "prodName" },
  { header: "Qty",     dataKey: "qty" },
]

const baguetteColumns = [
  { header: "Item",   dataKey: "label" },
  { header: "Amount", dataKey: "amount" },
]

export const exportBpbn1Pdf = ({ 
  reportDT,
  rusticData,
  doobieStuff,
  otherPrepData,
  mixes,
  bins,
  pans,
  buckets,
}) => {
  const margin = 20
  
  const doc = new jsPDF("portrait", "mm", "letter")
  let finalY = 20
  const renderTable = (title, body, columns) => {
    doc.setFontSize(14);
    doc.text(title, margin, finalY + 12);
    doc.autoTable({
      columns,
      body,
      theme: "grid",
      headStyles: {fillColor: "#dddddd", textColor: "#111111"},
      margin,
      startY: finalY + 16,
      styles: { fontSize: 11 },
    })
    finalY = doc.previousAutoTable.finalY + 12
  }
  
  doc.setFontSize(20)
  doc.text(`What To Bake ${reportDT.toFormat('MM/dd/yyyy')}`, margin, 20)

  renderTable(`Bake List`,    rusticData,    rusticColumns)
  renderTable(`Doobie Stuff`, doobieStuff,   doobieColumns)
  renderTable(`Prep List`,    otherPrepData, otherPrepColumns)

  doc.addPage()
  finalY = 20

  mixes.forEach((mix) => {
    if (mix.mixNumber === 3) {
      doc.addPage()
      finalY = 20
    }
    renderTable(`Baguette Mix #${mix.mixNumber}`, mix.components, baguetteColumns)
  })

  doc.addPage()
  finalY = 20

  renderTable(`Bins`,        bins,    baguetteColumns)
  renderTable(`Pocket Pans`, pans,    baguetteColumns)
  renderTable(`Bucket Sets`, buckets, baguetteColumns)

  doc.save(`BPBN_Baker1_${reportDT.toFormat('yyyy-MM-dd')}.pdf`)

}