import { compareBy, groupByObject } from "../../utils/collectionFns"
import { mapValues } from "../../utils/objectFns"
import { tablePivotFlatten } from "../../utils/tablePivot"

import jsPDF from "jspdf"
import "jspdf-autotable"

export const exportRouteGrids = (
  pivotTables,
  noteData,
  reportDT, 
  products,
  fileIdString,
) => {
  if (!pivotTables || !Object.keys(products).length) return

  const notesDataByRouteNick = mapValues(
    groupByObject(noteData.filter(N => N.Type === 'packList' && !!N.note), N => N.ref),
    groupArray => groupArray[0]
  )

  const doc = new jsPDF({ format: 'letter', orientation: 'landscape', unit: "mm" })
  
  const renderTable = (body, columns) => doc.autoTable({
    body, 
    columns,
    theme: "grid",
    headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    margin: { top: 26 },
    styles: { fontSize: 12 },
  })

  pivotTables.forEach((pivotTable, index) => {
    const routeNick = pivotTable[0].rowProps.routeNick
    const { true:bpbTable=[], false:regTable=[] } = groupByObject(
      pivotTable, 
      row => ['backporch', 'bpbkit', 'bpbextras'].includes(row.rowProps.locNick)
    )

    const [bpbColumns, regColumns] = [bpbTable, regTable].map(table => {
      const pivotKeys = Object.keys(table[0]?.colProps ?? {})
        .filter(prodNick => table.some(row => row.colProps[prodNick].items.length > 0))
        .sort()
        .sort(compareBy(prodNick => products[prodNick]?.doughNick))
        .sort(compareBy(prodNick => products[prodNick]?.packGroup))

      return [
        { header: "Location", dataKey: "displayName" },
        ...pivotKeys.map(prodNick => (
          { header: prodNick, dataKey: prodNick}
        ))
      ]

    })

    if (index > 0) doc.addPage()
    doc.setFontSize(20);
    doc.text(`${routeNick} ${reportDT.toFormat('MM/dd/yyyy')}`, 10, 20);
    if (bpbTable.length) renderTable(tablePivotFlatten(bpbTable), bpbColumns)
    if (regTable.length) renderTable(tablePivotFlatten(regTable), regColumns)
    if (!!notesDataByRouteNick[routeNick]) {
      doc.setFontSize(12)
      doc.text(
        20,
        doc.lastAutoTable.finalY + 15,
        ["Notes:", ""].concat(notesDataByRouteNick[routeNick].note.split('\n')),
        { maxWidth: 200 }
      )
    }

  })

  doc.save(`${fileIdString}_Grids_${reportDT.toFormat('yyyy-MM-dd')}`)

}