
import jsPDF from "jspdf"
import "jspdf-autotable"
import { sumBy } from "../../../../utils/collectionFns"

export const exportNorthListPdf = (
  reportDateDT,
  notes,
  croixNorth,
  shelfColKeys,
  shelfPdfData,
  amNorthKeys,
  amNorthData,
) => {
  let finalY = 25
  let pageMargin = 20
  let tableToNextTitle = 18
  let titleToNextTable = tableToNextTitle + 4
  let tableSize = 13
  let titleSize = 15

  // const doc = new jsPDF("p", "mm", "a4")
  const doc = new jsPDF("portrait", "mm","letter")

  doc.setFontSize(20)
  doc.text(pageMargin, 20, `North Driver ${reportDateDT.toFormat('MM/dd/yyyy')}`)

  doc.setFontSize(titleSize)
  doc.text(100, 43, `Driver Notes`)

  doc.autoTable({
    body: notes,
    theme: "grid",
    headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    margin: {
      left: 100,
      right: 20,
    },
    columns: [{ header: "Note", dataKey: "note" }],
    startY: finalY + titleToNextTable,
    styles: { fontSize: tableSize },
  })
  const notesFinalY = doc.previousAutoTable.finalY


  // finalY = doc.previousAutoTable.finalY
  doc.setFontSize(titleSize)
  doc.text(pageMargin, 43, `Frozen and Baked Croix`)

  doc.autoTable({
    body: croixNorth,
    columns: [
      { header: "Product", dataKey: "prod" },
      { header: "Frozen", dataKey: "frozenQty" },
      { header: "Baked", dataKey: "bakedQty" },
    ],

    margin: { left: 20, right: 120 },
    startY: finalY + titleToNextTable,
    
    theme: "grid",
    styles: { fontSize: tableSize },
    headStyles: { fillColor: "#dddddd", textColor: "#111111" },
  })
  const croixFinalY = doc.previousAutoTable.finalY

  finalY = Math.max(notesFinalY, croixFinalY)

  if (shelfColKeys.length > 0) {
    // console.log("columnsShelfProdsNorth", columnsShelfProdsNorth)
    // finalY = doc.previousAutoTable.finalY

    doc.setFontSize(titleSize)
    doc.text(pageMargin, finalY + tableToNextTitle, `Shelf Products (Each; 8 bz = 1 pack)`)

    const firstColumn = { header: "Location", dataKey: "locNameShort" }
    const columns = [firstColumn].concat(shelfColKeys.map(prodNick => 
      ({ header: prodNick, dataKey: prodNick }))
    )

    const firstFooter = "TOTAL"
    const footers = [firstFooter].concat(shelfColKeys.map(prodNick =>
      sumBy(shelfPdfData, row => row[prodNick] ?? 0)
    ))


    doc.autoTable({
      body:    shelfPdfData,
      columns: columns,
      foot:    [footers], // Yes, it needs to be an array inside an array
      
      margin: { left: 20, right: 20 },
      startY: finalY + titleToNextTable,
      theme: "grid",
      styles: { fontSize: tableSize },
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
      footStyles: { fillColor: "#dddddd", textColor: "#111111" },
    })

    finalY = doc.previousAutoTable.finalY
  }


  if (amNorthKeys.length > 0) {
    doc.addPage('letter', 'landscape')
    doc.setFontSize(titleSize)
    doc.text(10, 20, `AM North: Pack at Prado (Counts Packs; 1 bz = 1 pack)`)

    const firstColumn = { header: "Location", dataKey: "locNick" }
    const columns = [firstColumn].concat(amNorthKeys.map(prodNick => 
      ({ header: prodNick, dataKey: prodNick }))
    )

    doc.autoTable({
      body:    amNorthData,
      columns: columns,
  
      margin: { top: 26 },
      // startY: finalY + titleToNextTable,
      theme: "grid",
      styles: { fontSize: tableSize },
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    })

    finalY = doc.previousAutoTable.finalY


  }



  doc.save(`LongDriverNorth_${reportDateDT.toFormat('yyyy-MM-dd')}.pdf`)
};