import { Column } from "primereact/column"
import { DT } from "../../utils/dateTimeFns"

import { DataTable } from "primereact/datatable"
import { useSetoutData } from "./useSetoutData"
import { useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData"
import { useProducts } from "../../data/product/useProducts"
import { compareBy, groupByArrayRdc, keyBy, sumBy } from "../../utils/collectionFns"
import { useMemo } from "react"
import { DrilldownCellTemplate } from "./ComponentDrilldownCellTemplate"
import { useDoobieStuff } from "./dataBPBNDoobieStuff"

import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button } from "primereact/button"

const dataTableStaticProps = {
  size: "small",
  responsiveLayout: "scroll"  ,
  style: {marginBottom: "2rem"},
}

const useCarltonProductionData = ({ reportDT, shouldFetch }) => {

  const { data:R0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT, useHolding: false, shouldFetch })
  const { data:PRD } = useProducts({ shouldFetch: true })

  const calculateBakedPastries = () => {
    if (!R0Orders || !PRD) return undefined

    const products = keyBy(PRD, P => P.prodNick)
    return R0Orders
      .filter(order => 1
        && order.meta.routePlan.steps[0].end.place === 'Carlton'
        && products[order.prodNick].packGroup === 'baked pastries'
        && products[order.prodNick].doughNick !== 'Croissant'
        && order.qty !== 0
      )
      .sort(compareBy(order => order.prodNick))
      .reduce(groupByArrayRdc(order => order.prodNick), [])
      .map(orders => {
        const { prodNick } = orders[0]
        return {
          rowKey: prodNick,
          total: sumBy(orders, order => order.qty * products[prodNick].packSize),
          orders,
        }
      })
    
  }

  const { croix, other, frozen, products } = useSetoutData({ reportDT, reportLocation: 'Carlton', shouldFetch })

  return {
    croix, 
    other: other?.filter(row => !['snik', 'chch', 'oat', 'pbck', 'dbfdg'].includes(row.rowKey)), 
    frozen, 
    pastryBake: useMemo(calculateBakedPastries, [R0Orders, PRD]),
    doobieStuff: useDoobieStuff({ reportDT }).data.filter(item => item.Prod === 'Doobie Buns'),
    products,
  }

}

const pastryBakeColumns = [
  { header: "Pastries to Bake", dataKey: "rowKey" },
  { header: "Qty", dataKey: "total" },
]

const doobieColumns = [
  { header: "Product", dataKey: "Prod" },
  { header: "Bucket",  dataKey: "Bucket" },
  { header: "Mix",     dataKey: "Mix" },
  { header: "Bake",    dataKey: "Bake" },
]

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

const exportCarltonProduction = (reportDT, pastryBake, doobieStuff, croix, other, frozen) => {
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
  doc.text(`Carlton Production ${reportDT.toFormat('MM/dd/yyyy')}`, pageMargin, 20)

  renderTable(pastryBake, pastryBakeColumns)
  renderTable(doobieStuff, doobieColumns)
  renderTable(croix, croixColumns)
  renderTable(other, otherColumns)
  if (!!frozen) { renderTable(frozen, frozenColumns) }

  doc.save(`Carlton_Production_${reportDT.toFormat('yyyy-MM-dd')}.pdf`)
}

const PageBPBNCarltonProduction = () => {
  const reportDT = DT.today()

  const { pastryBake, doobieStuff, croix, other, frozen, products } 
    = useCarltonProductionData({ reportDT, shouldFetch: true })


  return (
    <div style={{padding: "2rem 5rem 5rem 5rem", width: "50rem", margin: "auto"}}>
      <h1>Carlton Production {reportDT.toFormat('MM/dd/yyyy')}</h1>
      <Button 
        icon="pi pi-print" 
        label="Print List" 
        onClick={() => exportCarltonProduction(reportDT, pastryBake, doobieStuff, croix, other, frozen)} 
        disabled={!pastryBake || !croix}
      />

      <h2>Bake Today</h2>
      <DataTable value={pastryBake ?? []} {...dataTableStaticProps}>
        <Column header="Product" field="rowKey" />
        <Column 
          header="Qty"
          body={row => DrilldownCellTemplate({
            dialogHeader: `${row.rowKey} Orders to be Set Out`, 
            cellValue: row.total, 
            tableData: row.orders, 
            products
          })}
        />
      </DataTable>

      <DataTable value={doobieStuff ?? []} {...dataTableStaticProps}>
        <Column header="Prod"   field="Prod" />
        <Column header="Bucket" field="Bucket" />
        <Column header="Mix"    field="Mix" />
        <Column header="Bake"   field="Bake" />
      </DataTable>

      <h2>Prep For Tomorrow</h2>
      <h3>Set Out</h3>
      <DataTable value={croix ?? []} {...dataTableStaticProps}>
        <Column header="Product" field="setoutKey" />
        <Column 
          header="Qty"
          body={row => DrilldownCellTemplate({
            dialogHeader: `${row.setoutKey} Orders to be Set Out`, 
            cellValue: row.total, 
            tableData: row.orders, 
            products
          })}
        />
        <Column header="Pans" field="pans" />
        <Column header="+" field="remainder" />
      </DataTable>

      <h3>Pastry Prep</h3>
      <DataTable value={other ?? []} {...dataTableStaticProps}>
        <Column header="Product" field="rowKey" />
        <Column 
          header="Qty"
          body={row => DrilldownCellTemplate({
            dialogHeader: `${row.rowKey} Orders to be Set Out`, 
            cellValue: row.total, 
            tableData: row.orders, 
            products
          })}
        />
      </DataTable>

      <h3>Frozen Pastry Prep</h3>
      <DataTable value={frozen ?? []} {...dataTableStaticProps}>
        <Column header="Product" field="rowKey" />
        <Column 
          header="Qty"
          body={row => DrilldownCellTemplate({
            dialogHeader: `Almond orders for ${row.rowKey}`, 
            cellValue: row.total, 
            tableData: row.orders, 
            products
          })}
        />
      </DataTable>
    </div>
  )

}

export { PageBPBNCarltonProduction as default }