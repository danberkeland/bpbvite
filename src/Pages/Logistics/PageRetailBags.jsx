import { useMemo } from "react"
import { useProducts } from "../../data/product/useProducts"
import { useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData"

import jsPDF from "jspdf"
import "jspdf-autotable"

import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { DrilldownCellTemplate } from "../Production/ComponentDrilldownCellTemplate"

import { DT } from "../../utils/dateTimeFns"
import { compareBy, groupByObject, keyBy, sumBy } from "../../utils/collectionFns"


const useRetailBagsData = ({ reportDT, shouldFetch }) => {
  const { data:R0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 0 }), useHolding: false, shouldFetch })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true , shouldFetch })
  const { data:PRD } = useProducts({ shouldFetch })

  const calculateRetailData = () => {
    if (!R0Orders || !R1Orders || !PRD) return { data: undefined, products: undefined }

    const products = keyBy(PRD, P => P.prodNick)

    const retailProducts = PRD.filter(P => P.packGroup === 'retail')
    const R0RetailOrders = R0Orders.filter(order => products[order.prodNick].packGroup === 'retail')
    const R0RetailOrdersByProdNick = groupByObject(R0RetailOrders, order => order.prodNick)
    const R1RetailOrders = R1Orders.filter(order => products[order.prodNick].packGroup === 'retail')
    const R1RetailOrdersByProdNick = groupByObject(R1RetailOrders, order => order.prodNick)

    const data = retailProducts
      .map(P => ({
        prodNick: P.prodNick,
        prodName: P.prodName,
        R0Items: R0RetailOrdersByProdNick[P.prodNick] ?? [],
        R0TotalQty: sumBy(R0RetailOrdersByProdNick[P.prodNick] ?? [], order => order.qty),
        R1Items: R1RetailOrdersByProdNick[P.prodNick] ?? [],
        R1TotalQty: sumBy(R1RetailOrdersByProdNick[P.prodNick] ?? [], order => order.qty),
      }))
      .sort(compareBy(row => row.prodName))
      // .sort(compareBy(row => !row.prodName.includes('(Retail)')))
      .filter(row => products[row.prodNick].doughNick !== '')

    return { data, products }
  }

  return useMemo(calculateRetailData, [R0Orders, R1Orders, PRD])
}

const exportRetailBagsPdf = (retailData, reportDT) => {

  const doc = new jsPDF("landscape", "mm", "letter")
  doc.setFontSize(20)
  doc.text(`Retail Bags ${reportDT.toFormat('MM/dd/yyyy')}`, 10, 20)

  doc.autoTable({
    body: retailData,
    columns: [
      { header: "Product", dataKey: "prodName" },
      { header: `NEED TODAY ${reportDT.toFormat('M/d')}`, dataKey: "R0TotalQty" },
      { header: `PREP FOR TOMORROW ${reportDT.plus({ days: 1 }).toFormat('M/d')}`, dataKey: "R1TotalQty" },
    ],
    startY: 30,
    margin: { right: 100 },
    styles: { fontSize: 11 },
  });

  doc.save(`RetailBags_${reportDT.toFormat('yyyy-MM-dd')}.pdf`);
}

const PageRetailBags = () => {
  const reportDT = DT.today()
  const { data:retailData, products } = useRetailBagsData({ reportDT, shouldFetch: true })

  return (
    <div style={{ padding: "2rem 5rem 5rem 5rem", width: "50rem", margin: "auto" }}>
      <h1>Retail Bags for {reportDT.toFormat('MM/dd/yyyy')}</h1>

      <Button label="Print Retail Bag List" icon="pi pi-print" 
        onClick={() => exportRetailBagsPdf(retailData, reportDT)}
        style={{marginBottom: "2rem"}}
      />

      <DataTable
        value={retailData ?? []}
        responsiveLayout="scroll"
        size="small"
      >
        <Column header="Product" field="prodName" />
        <Column header={`Need Today ${reportDT.toFormat('M/d')}`} 
          body={row => DrilldownCellTemplate({
            dialogHeader: `${row.prodName} Orders for Today`,
            cellValue: row.R0TotalQty,
            valueType: "qty",
            tableData: row.R0Items,
            products
          })}
        />
        <Column header={`Prep for Tomorrow ${reportDT.plus({ days: 1 }).toFormat('M/d')}`} 
          body={row => DrilldownCellTemplate({
            dialogHeader: `${row.prodName} Orders for Tomorrow`,
            cellValue: row.R1TotalQty,
            valueType: "qty",
            tableData: row.R1Items,
            products
          })}
        />
      </DataTable>
    </div>
  )
}

export { PageRetailBags as default }