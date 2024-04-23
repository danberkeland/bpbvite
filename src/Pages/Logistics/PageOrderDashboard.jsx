import { useMemo, useState } from "react"
import { useProducts } from "../../data/product/useProducts"
import { CombinedRoutedOrder, useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData"
import { keyBy, sumBy } from "../../utils/collectionFns"
import { DT } from "../../utils/dateTimeFns"

import { DataTable } from "primereact/datatable"
import { tablePivot } from "../../utils/tablePivot"
import { Column } from "jspdf-autotable"
import { DrilldownCellTemplate } from "../Production/ComponentDrilldownCellTemplate"



const useOrderDashboardData = ({ reportDT, shouldFetch }) => {
  const dtMillis = reportDT.toMillis()
  const { data:R0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 0 }), useHolding: false, shouldFetch })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true,  shouldFetch })
  const { data:R2Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 2 }), useHolding: true,  shouldFetch })
  const { data:R3Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 3 }), useHolding: true,  shouldFetch })
  const { data:R4Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 4 }), useHolding: true,  shouldFetch })
  const { data:R5Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 5 }), useHolding: true,  shouldFetch })
  const { data:R6Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 6 }), useHolding: true,  shouldFetch })
  const { data:R7Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 7 }), useHolding: true,  shouldFetch })
  const { data:PRD }      = useProducts({ shouldFetch })

  const products = useMemo(() => !!PRD ? keyBy(PRD, P => P.prodNick) : undefined, [PRD])
    
  const data = useMemo(() => {
    if (!R0Orders || !R1Orders || !R2Orders || !R3Orders || !R4Orders || !R5Orders || !R6Orders || !R7Orders || !products) {
      return undefined
    }

    return [
      ...R0Orders,
      ...R1Orders,
      ...R2Orders,
      ...R3Orders,
      ...R4Orders,
      ...R5Orders,
      ...R6Orders,
      ...R7Orders,
    ]
  }, [R0Orders, R1Orders, R2Orders, R3Orders, R4Orders, R5Orders, R6Orders, R7Orders, products])

  return {
    data,
    products,
  }

}




// Order Dashboard
const PageOrderDashboard = () => {

  const reportDT = DT.today()
  const { data, products } = useOrderDashboardData({ reportDT, shouldFetch: true })

  //  Table Config Settings
  // ==================
  const [aggregationDate, setAggregationDate] = useState('deliv') // 'deliv|'finish'
  const [displayAmount, setDisplayAmount] = useState('qty')   // 'qty'|'ea'|'lbs'

  //  Table Config Fns
  // ==================
  const getDateValue = (/**@type {CombinedRoutedOrder}*/ order) => aggregationDate === 'deliv'
    ? order.delivDate
    : order.meta.routePlan.steps[0].end.date

  const getPivotValue = (/**@type {CombinedRoutedOrder[]|undefined}*/orders) => {
    if (!products || !orders) return 0
    
    if (orders.some(order => order === undefined)) console.log("ORDERS:", orders)
    return displayAmount === 'qty' ? sumBy(orders, order => order.qty)
      : displayAmount === 'ea' ? sumBy(orders, order => order.qty * products[order.prodNick].packSize) 
      : displayAmount === 'wt' ? sumBy(orders, order => order.qty * products[order.prodNick].packSize * products[order.prodNick].weight)
      : 0
  }
  // const getPivotValue = (/**@type {CombinedRoutedOrder[]|undefined}*/orders) => {
  //   if (!products || !orders) return ''
  //   switch (displayAmount) {
  //     case 'qty': return sumBy(orders, order => order.qty) 
  //     case 'ea':  return sumBy(orders, order => order.qty * products[order.prodNick].packSize) 
  //     case 'wt':  return sumBy(orders, order => order.qty * products[order.prodNick].packSize * products[order.prodNick].weight)
  //     default: return ''
  //   }

  // }
  //  Build Pivot Table
  // ===================
  const pivotDates = [0,1,2,3,4,5,6].map(days => reportDT.plus({ days }).toFormat('yyyy-MM-dd'))
  
  const rowPartitionModel = {
    prodNick: order => order.prodNick,
  }

  const displayData = tablePivot(
    data ?? [],
    rowPartitionModel,
    getDateValue,
    orders => getPivotValue(orders),
  )

  return (
    <div style={{ padding: "2rem 5rem 5rem 5rem", maxWidth: "80rem", margin: "auto" }}>
      <h1>Order Dashboard</h1>

      <DataTable
        value={displayData}

      >
        <Column header="prodNick" field="rowProps.prodNick" />

        {pivotDates.map((date, idx) => 
          <Column 
            header={date} 
            key={idx} 
            // field={`colProps.${date}.value`}
            body={row => {
              if ((row.colProps[date].items ?? []).some(item => item === undefined)) console.log("ERR", row.colProps[date].items)
              return DrilldownCellTemplate({
                dialogHeader: row.rowProps.prodNick,
                tableData: row.colProps[date]?.items ?? [],
                cellValue: row.colProps[date]?.value,
                products
              })}
            }
          />
        )}

      </DataTable>

    </div>
  )
}

export { PageOrderDashboard as default }