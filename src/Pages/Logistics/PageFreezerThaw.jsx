import { useMemo } from "react"
import { useProducts } from "../../data/product/useProducts"
import { useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData"
import { chunk, compareBy, groupByArrayRdc, keyBy, sumBy } from "../../utils/collectionFns"
import { DT } from "../../utils/dateTimeFns"
import { DataTable } from "primereact/datatable"
import { DrilldownCellTemplate } from "../Production/ComponentDrilldownCellTemplate"

import jsPDF from "jspdf"
import "jspdf-autotable"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { useCheckForUpdates } from "../../core/checkForUpdates"

const useFreezerThawData = ({ reportDT, shouldFetch }) => {
  const { data:R0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT, useHolding: false, shouldFetch })
  const { data:PRD } = useProducts({ shouldFetch })

  const calculateFreezerThaw = () => {
    if (!R0Orders || !PRD) return { data: undefined, products: undefined }

    const products = keyBy(PRD, P => P.prodNick)
    const data = R0Orders
      .filter(order => products[order.prodNick].freezerThaw)
      .reduce(groupByArrayRdc(order => order.prodNick), [])
      .map(group => ({
        prodNick: group[0].prodNick,
        prodName: products[group[0].prodNick].prodName,
        totalQty: sumBy(group, order => order.qty),
        items: group,
      }))
      .sort(compareBy(row => row.prodName))

    return { data, products }
  }

  return useMemo(calculateFreezerThaw, [R0Orders, PRD])

}

const printFreezerThawSticker = (freezerThawData, reportDT) => {
  const [height, width] = [2, 4]

  const listXPos = [0.4, 0.4, 0.4, 0.4, 2.2, 2.2, 2.2, 2.2]
  const listYPos = [0.8, 1.1, 1.4, 1.7, 0.8, 1.1, 1.4, 1.7]
  const doc = new jsPDF({ orientation: "l", unit: "in", format: [height, width] })

  chunk(freezerThawData, 8).forEach((chunk, chunkIdx) => {
    if (chunkIdx > 0) {
      doc.addPage([height, width], "landscape")
    }
    doc.setFontSize(16)
    doc.text('Pull From Freezer (Packs)',   0.2, 0.36)
    doc.text(reportDT.toFormat('M/d'), width - 0.2, 0.36, { align: "right" })

    chunk.forEach((row, idx) => {  
      doc.text(String(row.totalQty), listXPos[idx],       listYPos[idx])
      doc.text(row.prodNick,         listXPos[idx] + 0.4, listYPos[idx])
    })
  })

  doc.save(`Freezer_Thaw_${reportDT.toFormat('yyyy-MM-dd')}.pdf`)

}

const PageFreezerThaw = () => {
  const reportDT = DT.today()
  const checkCompleted = useCheckForUpdates()
  const { data:freezerThawData, products } = useFreezerThawData({ reportDT, shouldFetch: checkCompleted })
  
  return (
    <div style={{padding: "2rem 5rem 5rem 5rem", maxWidth: "40rem", margin: "auto" }}>
      <h1>Freezer Thaw {reportDT.toFormat('MM/dd/yyyy')}</h1>

      <Button 
        label="Print Sticker" icon="pi pi-print"
        onClick={() => printFreezerThawSticker(freezerThawData, reportDT)}  
        style={{marginBottom: "2rem"}}
      />

      <DataTable
        value={freezerThawData ?? []}
        responsiveLayout="scroll"
      >
        <Column header="Product" field="prodName" />
        <Column header="Qty (Packs)" 
          body={row => DrilldownCellTemplate({
            dialogHeader: `${row.prodName} Orders for Today`,
            cellValue: row.totalQty,
            valueType: "qty",
            tableData: row.items,
            products
          })}
        />
      </DataTable>
    </div>
  )
}

export { PageFreezerThaw as default }