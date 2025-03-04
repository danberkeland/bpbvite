import jsPDF from "jspdf"
import "jspdf-autotable"

/**
 * @typedef {Object[]} PdfTableBody
 * @typedef {{ header: string, dataKey: string }} PdfTableColumn
 * @typedef {{ body: PdfTableBody, columns: PdfTableColumn[] }} PdfTable
 * @typedef {{ header: string, tables: PdfTable[], noteLines: (string[] | null) }} PdfPage
 */

/**
 * @param {string} header 
 * @param {jsPDF} doc 
 */
const renderHeader = (header, doc) => {
  doc.setFontSize(20);
  doc.text(header, 10, 20);
}

/**
 * @param {PdfTable} table
 * @param {jsPDF} doc 
 */
const renderTable = (table, doc) => {
  doc.autoTable({
    body: table.body, 
    columns: table.columns,
    theme: "grid",
    headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    margin: { top: 26 },
    styles: { fontSize: 12 },
  })
}

/**
 * 
 * @param {string[]} noteLines 
 * @param {jsPDF} doc 
 */
const renderNotes = (noteLines, doc) => {
  doc.setFontSize(12)
  doc.text(
    20,
    doc.lastAutoTable.finalY + 15,
    noteLines,
    { maxWidth: 200 }
  )
}


/**
 * 
 * @param {PdfPage[]} pages 
 * @param {string} fileName 
 */
const printGridPages = (pages, fileName) => {

  const doc = new jsPDF({ 
    format: 'letter', 
    orientation: 'landscape', 
    unit: "mm" 
  })

  pages.forEach((page, index) => {
    const { header, tables, noteLines } = page

    if (index > 0) doc.addPage()
      
    renderHeader(header, doc)
    for (let table of tables) {
      renderTable(table, doc)
    }
    if (!!noteLines) {
      renderNotes(noteLines, doc)
    }
    
  })

  doc.save(fileName)

}


export {
  printGridPages,
}