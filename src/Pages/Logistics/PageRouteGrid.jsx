import { useEffect, useMemo, useRef, useState } from "react"
import { useLocations } from "../../data/location/useLocations"
import { useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData"
import { useRoutes } from "../../data/route/useRoutes"
import { compareBy, groupByArrayRdc, groupByObject, keyBy } from "../../utils/collectionFns"
import { DT } from "../../utils/dateTimeFns"
import { tablePivot, tablePivotFlatten } from "../../utils/tablePivot"
import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { ListBox } from "primereact/listbox"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { useProducts } from "../../data/product/useProducts"

import jsPDF from "jspdf"
import "jspdf-autotable"
import { truncate } from "lodash"

const useRouteGridData = ({ reportDT, shouldFetch }) => {
  const { data:R0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT, useHolding: false, shouldFetch })
  const { data:LOC } = useLocations({ shouldFetch })
  const { data:RTE } = useRoutes({ shouldFetch })
  const { data:PRD } = useProducts({ shouldFetch })

  const products = useMemo(() => !!PRD ? keyBy(PRD, P => P.prodNick) : undefined, [PRD])

  const calculateGridData = () => {
    if (!R0Orders || !LOC || !RTE) return undefined

    const locations = keyBy(LOC, L => L.locNick)
    const routes = keyBy(RTE, R => R.routeNick)

    return R0Orders
      .filter(order => order.isWhole === true && order.qty !== 0)
      .reduce(groupByArrayRdc(order => order.meta.routeNick), [])
      .map(routeGroup => 
        tablePivot(
          routeGroup, 
          { 
            locNick:     order => order.locNick,
            locName:     order => locations[order.locNick].locName,
            displayName: order => truncate(locations[order.locNick].locName, { length: 16 }),
            routeNick:   order => order.meta.routeNick,
            driver:      order => routes[order.meta.routeNick].driver
          }, 
          'prodNick', 
          cellData => cellData[0].qty
        ).sort(
          compareBy(row => locations[row.rowProps.locNick].delivOrder)
        )

      )
      .sort(compareBy(grid => routes[grid[0].rowProps.routeNick].printOrder))

  }

  return { 
    data: useMemo(calculateGridData, [R0Orders, LOC, RTE]),
    products,
  }

}

const exportDeliveryListsAndInvoices = (
  pivotTables, 
  reportDT, 
  products
) => {

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
    const { true:bpbTable=[], false:regTable=[] } = groupByObject(
      tablePivotFlatten(pivotTable), 
      row => ['backporch', 'bpbkit', 'bpbextras'].includes(row.rowProps.locNick)
    )

    const [bpbColumns, regColumns] = [bpbTable, regTable].map(table => {
      const pivotKeys = Object.keys(table[0]?.colProps ?? [])        
        .sort()
        .sort(compareBy(prodNick => products[prodNick]?.doughNick))
        .sort(compareBy(prodNick => products[prodNick]?.packGroup))

      return [
        { header: "Location", dataKey: "displayName" },
        pivotKeys.map(prodNick => (
          { header: prodNick, dataKey: prodNick}
        ))
      ]

    })

    if (index > 0) doc.addPage()
    doc.setFontSize(20);
    doc.text(`${pivotTable[0].rowProps.locNick} ${reportDT.toFormat('MM/dd/yyyy')}`, 10, 20);
    if (bpbTable.length) renderTable(bpbTable, bpbColumns)
    if (regTable.length) renderTable(regTable, regColumns)

  })

  doc.save(``)

}

const PageRouteGrid = () => {
  const [reportDT, setReportDT] = useState(DT.today())

  const { data:pivotDataByRouteNick, products={} } = useRouteGridData({ reportDT, shouldFetch: true })

  const [routeNick, setRouteNick] = useState('')
  useEffect(() => {
    if (!!pivotDataByRouteNick) {
      setRouteNick('AM Pastry')
      console.log(pivotDataByRouteNick)
    }
  }, [pivotDataByRouteNick])

  const displayRouteNicks = (pivotDataByRouteNick ?? [])
    .map(grid => grid[0].rowProps.routeNick)

  const displayTableData = !!pivotDataByRouteNick
    ? pivotDataByRouteNick.find(grid => grid[0].rowProps.routeNick === routeNick) ?? []
    : []

  const displayPivotColumnKeys = !!displayTableData && !!displayTableData.length
    ? Object.keys(displayTableData[0].colProps)
        .sort()
        .sort(compareBy(prodNick => products[prodNick]?.doughNick))
        .sort(compareBy(prodNick => products[prodNick]?.packGroup))
    : []

  const printGrids = () => {

  }


    
  const headerTemplate =
    <div>
      <h1 style={{display: "inline-block", marginBlock: ".5rem"}}>Deliveries {reportDT.toFormat('MM/dd/yyyy')}</h1>
      <CustomCalendarInput reportDT={reportDT} setReportDT={setReportDT} />
    </div>

  const printByDriverButtons =
    <div style={{display: "flex", gap: "1rem", marginBlock: ".5rem"}}>
      <Button icon="pi pi-print" label="Driver 1 (Long Driver)" />
      <Button icon="pi pi-print" label="Driver 2 (Pastry)" />
      <Button icon="pi pi-print" label="Driver 3 (South Driver)" />
    </div>

  return (
    <div style={{padding: "2rem 5rem 5rem 5rem", margin: "auto"}}>

      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", columnGap: "2rem", flexWrap: "wrap", marginBlock: "0.5rem"}}>
        {headerTemplate} 
        {printByDriverButtons}
      </div>

      <div style={{display: "grid", gridTemplateColumns: "11rem 1fr", columnGap: "2rem"}}>
        <div>
          <ListBox
            value={routeNick}
            options={displayRouteNicks}
            onChange={e => setRouteNick(e.value)}
            style={{height: "fit-content"}}
          />
          <Button label={<div>Print<br/>Current Route</div>} style={{width: "100%", marginTop: "1rem"}} />
          <Button label={<div>Print<br/>All Routes</div>}    style={{width: "100%", marginTop: "1rem"}} />
        </div>

        <DataTable
          value={displayTableData}
          responsiveLayout="scroll"
          size="small"
          showGridlines
          stripedRows
        >
          <Column header="Location" field="rowProps.locName" />
          {displayPivotColumnKeys.map(prodNick => 
            <Column header={prodNick} field={`colProps.${prodNick}.value`} key={prodNick} style={{minWidth: "3rem"}} />
          )}
        </DataTable>

      </div>
    </div>
  )


}


const CustomCalendarInput = ({ reportDT, setReportDT }) => {
  const calendarRef = useRef()
  return <div style={{display: "inline-block", marginLeft: "1rem"}}>
    <Button 
      icon="pi pi-calendar"
      className="p-button-rounded" 
      onClick={() => calendarRef.current.show()}
    />
    <Calendar 
      value={reportDT.toJSDate()}
      ref={calendarRef}
      onChange={e => setReportDT(DT.fromJs(e.value))} 
      inputStyle={{visibility: "hidden", width:"0", height: "0", padding: "0"}}
      panelStyle={{transform: "translate(-.8rem, 0rem)"}}
    />
  </div>
}

export { PageRouteGrid as default }