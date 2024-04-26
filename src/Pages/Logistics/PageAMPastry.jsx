import { DataTable } from "primereact/datatable"
import { DT } from "../../utils/dateTimeFns"
import { useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData"
import { useProducts } from "../../data/product/useProducts"
import { keyBy } from "lodash"
import { tablePivot, tablePivotFlatten } from "../../utils/tablePivot"
import { useLocations } from "../../data/location/useLocations"
import { compareBy, sumBy } from "../../utils/collectionFns"
import { useMemo } from "react"
import { Column } from "primereact/column"
import { Button } from "primereact/button"

import jsPDF from "jspdf"
import "jspdf-autotable"

const useAMPastryData = ({ reportDT, shouldFetch }) => {
  const { data:R0Orders } = useCombinedRoutedOrdersByDate({ 
    delivDT: reportDT, 
    useHolding: false, shouldFetch 
  })
  const { data:PRD } = useProducts({ shouldFetch })
  const { data:LOC } = useLocations({ shouldFetch })

  const calculateAMPastry = () => {
    if (!R0Orders || !PRD || !LOC) {
      return { data: undefined, pivotColumnKeys: undefined }
    }
    
    const products = keyBy(PRD, P => P.prodNick)
    const locations = keyBy(LOC, L => L.locNick)
    const orders = R0Orders.filter(order => 1
      && order.meta.route?.RouteDepart === 'Prado' 
      && products[order.prodNick].packGroup === 'baked pastries'
      && order.isWhole
      && order.qty !== 0
    )
    .sort(compareBy(order => locations[order.locNick].delivOrder, "desc"))
    .sort(compareBy(order => order.meta.routeNick))

    const data = tablePivot(
      orders,
      { 
        locNick: order => order.locNick,
        locName: order => locations[order.locNick]?.locName ?? order.locNick,
        routeNick: order => order.meta.routeNick,
        driver: order => order.meta.route.driver,
      },
      order => order.prodNick,
      items => items[0].qty,
    )

    const pivotColumnKeys = Object.keys(data[0].colProps)
      .sort()
      .sort(compareBy(prodNick => products[prodNick].doughNick, 'desc'))

    return { data, pivotColumnKeys }
  }

  return useMemo(calculateAMPastry, [R0Orders, PRD, LOC])
}


const exportAMPastryStickers = (pivotData, reportDT) => {
  const [width, height] = [4, 2]
  const doc = new jsPDF({ orientation: "l", unit: "in", format: [height, width] })

  const displayNameModel = [
    { prodNick: "bb",   displayName: "BB:",   y: 0.72, x1: 0.20, x2: 0.65 },
    { prodNick: "brn",  displayName: "Brn:",  y: 0.98, x1: 0.20, x2: 0.65 },
    { prodNick: "bd",   displayName: "Bd:",   y: 1.24, x1: 0.20, x2: 0.65 },
    { prodNick: "sco",  displayName: "Sco:",  y: 1.50, x1: 0.20, x2: 0.65 },
    { prodNick: "pg",   displayName: "PG:",   y: 0.72, x1: 1.46, x2: 1.91 },
    { prodNick: "sf",   displayName: "SF:",   y: 0.98, x1: 1.46, x2: 1.91 },
    { prodNick: "pl",   displayName: "Pl:",   y: 1.24, x1: 1.46, x2: 1.91 },
    { prodNick: "ch",   displayName: "ch:",   y: 1.50, x1: 1.46, x2: 1.91 },
    { prodNick: "al",   displayName: "Al:",   y: 0.72, x1: 2.72, x2: 3.37 },
    { prodNick: "unmb", displayName: "unmb:", y: 0.98, x1: 2.72, x2: 3.37 },
    { prodNick: "mb",   displayName: "mb:",   y: 1.24, x1: 2.72, x2: 3.37 },
    { prodNick: "mini", displayName: "Mini:", y: 1.50, x1: 2.72, x2: 3.37 },
  ]


  const renderSticker1 = (pivotRow) => {
    const total = sumBy(Object.values(pivotRow.colProps), cell => cell.value)
    const binSize = total > 96 ? Math.ceil(total / 45) + ' x L'
      : total > 10 ? Math.ceil(total / 24) + ' x M'
      : '1 x S'

    doc.setFontSize(10)
    doc.setTextColor('#000000')
    doc.text(`${pivotRow.rowProps.driver} :: ${pivotRow.rowProps.routeNick}`, 0.2, height - 0.2)

    doc.setFontSize(14);
    doc.text(pivotRow.rowProps.locName, 0.2, 0.36)
    doc.text(reportDT.toFormat('MM/dd/yy'), width - 0.2, 0.36, { align: 'right' })

    doc.text(`${binSize}`, width - 0.2, height - 0.2, { align: "right" });
    
    displayNameModel.forEach(item => {
      const qty = String(pivotRow.colProps[item.prodNick]?.value ?? '----') 
      doc.setTextColor(qty === '----' ? '#AAAAAA' : '#000000')
      doc.text(item.displayName, item.x1, item.y)
      doc.text(qty, item.x2, item.y)
    })

  }

  pivotData
    .filter(row => row.rowProps.locNick !== 'bpbextras')
    .forEach((pivotRow, idx) => {
      if (idx > 0) { doc.addPage() }
      renderSticker1(pivotRow)
    })

  doc.save(`Pastry_Stickers_${reportDT.toFormat('yyyy-MM-dd')}.pdf`)

}

const exportAMPastryTable = (pivotData, pivotColumnKeys, reportDT) => {
  const body = tablePivotFlatten(pivotData)
  const columns = [
    { header: "Customer", dataKey: "locNick" },
    ...pivotColumnKeys.map(prodNick => (
      { header: prodNick, dataKey: prodNick })
    )
  ]

  const doc = new jsPDF({ orientation: "portrait", unit: "in", format: "letter" })

  doc.setFontSize(20);
  doc.text(`AM Pastry ${reportDT.toFormat('MM/dd/yyyy')}`, 0.50, 0.67);
  doc.autoTable({ body, columns, startY: 1, styles: { fontSize: 11 } })
  doc.save(`Pastry_List_${reportDT.toFormat('yyyy-MM-dd')}.pdf`)
}

const PageAMPastry = () => {
  const reportDT = DT.today()

  const { data:pivotData, pivotColumnKeys } = useAMPastryData({ reportDT, shouldFetch: true })

  return (
    <div style={{padding: "2rem 5rem 5rem 5rem", maxWidth: "64rem", margin: "auto"}}>
      <h1>AM Pastry Pack {reportDT.toFormat('MM/dd/yyyy')}</h1>
      <p>Using v2 <a href="/Logistics/AMPastry/v1">Go to previous version</a></p>
      <div style={{ paddingBottom: "2rem", display: "flex", gap: "4rem" }}>
        <Button label="Print Stickers" onClick={() => exportAMPastryStickers(pivotData, reportDT)} />
        <Button label="Print List" onClick={() => exportAMPastryTable(pivotData, pivotColumnKeys, reportDT)} />
      </div>

      <DataTable
        value={pivotData}
        size="small"
        stripedRows
        showGridlines
        responsiveLayout="scroll"
      >
        <Column header="Customer" field="rowProps.locNick" />
        {pivotColumnKeys?.map(prodNick =>
          <Column key={prodNick} header={prodNick} field={`colProps.${prodNick}.value`} style={{width: "4rem"}} />
        )}
      </DataTable>
    </div>
  )
}

export { PageAMPastry as default }