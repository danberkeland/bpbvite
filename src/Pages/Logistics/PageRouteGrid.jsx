import { useEffect, useMemo, useRef, useState } from "react"
import { useLocations } from "../../data/location/useLocations"
import { CombinedRoutedOrder, useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData"
import { useRoutes } from "../../data/route/useRoutes"
import { compareBy, groupByArrayRdc, groupByObject, keyBy, uniqByRdc } from "../../utils/collectionFns"
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
import { QB } from "../../data/qbApiFunctions"
import { downloadPDF } from "../../utils/pdf/downloadPDF"
import { useSettingsStore } from "../../Contexts/SettingsZustand"
import { DBProduct } from "../../data/types.d"
import { divyUp } from "../../utils/divyUp"

/**
 * If a prodNick is not included or if nPerBag is set to 0, 
 * stickers will not be generated for that item.
 */
const stickerInfo = [
  { prodNick: 'mbag',  nPerBag: 24 },
  { prodNick: 'dbag',  nPerBag: 18 },
  { prodNick: 'bag',   nPerBag: 12 },
  { prodNick: 'epi',   nPerBag: 9 },
  { prodNick: 'lglv',  nPerBag: 3 },
  { prodNick: 'lev',   nPerBag: 6 },
  { prodNick: 'lgmt',  nPerBag: 3 },
  { prodNick: 'mlti',  nPerBag: 6 },
  { prodNick: 'rye',   nPerBag: 6 },
  { prodNick: 'lgry',  nPerBag: 3 },
  { prodNick: 'oli',   nPerBag: 6 },
  { prodNick: 'bcwal', nPerBag: 6 },
  { prodNick: 'foc',   nPerBag: 3 },
  { prodNick: 'hfoc',  nPerBag: 3 },
  { prodNick: 'rbag',  nPerBag: 10 },
  { prodNick: 'rlev',  nPerBag: 4 },
  { prodNick: 'rmlti', nPerBag: 4 },
  { prodNick: 'rrye',  nPerBag: 4 },
  { prodNick: 'roli',  nPerBag: 4 },
]

const isHigueraPackProduct = (/** @type {DBProduct} */ product) => 1
  && product.doughNick !== "French"
  && ['rustic breads', 'retail', 'focaccia'].includes(product.packGroup)

const useRouteGridData = ({ reportDT, shouldFetch }) => {
  const R0 = reportDT.toFormat('yyyy-MM-dd')
  const { data:R0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 0 }), useHolding: false, shouldFetch })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: false, shouldFetch })
  const { data:LOC } = useLocations({ shouldFetch })
  const { data:RTE } = useRoutes({ shouldFetch })
  const { data:PRD } = useProducts({ shouldFetch })

  const products = useMemo(() => !!PRD ? keyBy(PRD, P => P.prodNick) : undefined, [PRD])

  const calculateGridData = () => {
    if (!R0Orders || !LOC || !RTE || !products) {
      return { data: undefined, pradoData: undefined, higueraData: undefined }
    }

    const locations = keyBy(LOC, L => L.locNick)
    const routes = keyBy(RTE, R => R.routeNick)

    const rowPartitionModel = { 
      locNick:        order => order.locNick,
      locName:        order => locations[order.locNick]?.locName ?? order.locNick,
      qbID:           order => locations[order.locNick]?.qbID ?? 'n/a',
      toBePrinted:    order => locations[order.locNick]?.toBePrinted ?? false,
      printDuplicate: order => locations[order.locNick]?.printDuplicate ?? false,
      displayName:    order => truncate(locations[order.locNick]?.locName ?? order.locNick, { length: 16 }),
      routeNick:      order => order.meta.routeNick,
      driver:         order => routes[order.meta.routeNick].driver
    }

    const routeGridPivot = tableData => 
      tablePivot(tableData, rowPartitionModel, 'prodNick', cellData => cellData[0].qty)
      
    const generateData = orderSet => orderSet
      .sort(compareBy(order => locations[order.locNick]?.delivOrder ?? 999))
      .sort(compareBy(order => routes[order.meta.routeNick].printOrder))
      .reduce(groupByArrayRdc(order => order.meta.routeNick), [])
      .map(routeGroup => routeGridPivot(routeGroup))

    const orders = R0Orders.filter(order => order.qty !== 0 && order.isWhole)
    const pradoOrders = R0Orders.filter(order => !isHigueraPackProduct(products[order.prodNick]) && order.isWhole)
    const higueraOrders = R0Orders.filter(order => isHigueraPackProduct(products[order.prodNick]))
    
    const data = generateData(orders)
    const pradoData = generateData(pradoOrders)
    const higueraData = generateData(higueraOrders)

    return { data, pradoData, higueraData }

  }

  const calculateHigueraStickerData = () => {
    if (!R0 || !R0Orders || !R1Orders || !LOC || !RTE || !products) return undefined

    const locations = keyBy(LOC, L => L.locNick)
    const routes = keyBy(RTE, R => R.routeNick)

    const isHigueraStickerOrder = (/** @type {CombinedRoutedOrder} */ order) => 1
      && isHigueraPackProduct(products[order.prodNick])
      && order.qty !== 0 
      && !['whole', 'slonat', 'backporch', 'bpbextras', 'bpbkit'].includes(order.locNick)
      && !['Pick up Carlton'].includes(order.meta.routeNick)
      && (0 // lucy orders are labeled/packed the day before delivery; focaccia orders the day of. This is still a very ad-hoc system.
        || (!['hfoc', 'foc'].includes(order.prodNick) && R0 === order.meta.routePlan.steps[0].end.date) 
        || ( ['hfoc', 'foc'].includes(order.prodNick) && R0 === order.delivDate)
      )
      // order is already assumed NOT to be a holding order

    return [...R0Orders, ...R1Orders]
      .filter(order => isHigueraStickerOrder(order))
      .map(order => {
        const nPerBag = stickerInfo.find(S => S.prodNick === order.prodNick)?.nPerBag ?? 0
        const nBags = nPerBag > 0 ? Math.ceil(order.qty / nPerBag) : 0

        const displayDate = order.delivDate === R0
          ? DT.fromIso(order.delivDate).toFormat('M/d')
          : '**' + DT.fromIso(order.delivDate).toFormat('M/d') + '**'

        return {
          locNick:     order.locNick,
          locName:     (locations[order.locNick]?.locName ?? order.locNick).split('__')[0],
          prodNick:    order.prodNick,
          prodName:    products[order.prodNick].prodName ?? order.prodNick,
          isWhole:     order.isWhole,
          totalQty:    order.qty,
          stickerQtys: divyUp(order.qty, nBags),
          routeNick:   order.meta.routeNick ?? "N/A",
          driver:      routes[order.meta.routeNick]?.driver ?? "N/A",
          delivDate:   order.delivDate,
          displayDate,
        }
      })
      .sort(compareBy(stickerItem => stickerItem.prodName))
      .sort(compareBy(stickerItem => stickerItem.locName))
      .sort(compareBy(stickerItem => locations[stickerItem.locNick]?.delivOrder ?? 999))
      .sort(compareBy(stickerItem => stickerItem.routeNick))
      .sort(compareBy(stickerItem => stickerItem.driver))
      .sort(compareBy(stickerItem => stickerItem.delivDate, 'desc'))
      .flatMap(stickerItem => {
        const { stickerQtys, ...rest } = stickerItem
        const prodStickerCount = stickerQtys.length

        return stickerQtys.map((stickerQty, idx) => ({
          ...rest,
          prodIdx: idx + 1,
          prodStickerCount,
          stickerQty
        }))

      })
      .reduce(groupByArrayRdc(order => order.locNick), [])
      .flatMap(orderStickerGroup => {
        
        return orderStickerGroup.map((stickerItem, idx) => ({
          ...stickerItem,
          stickerIdx: idx + 1,
          stickerCount: orderStickerGroup.length
        }))
      })

  }

  const exportHigueraStickers = () => {
    const stickerData = calculateHigueraStickerData()
    if (!stickerData) return

    const doc = new jsPDF({ format: [2, 4], unit: "in", orientation: "l" })
    
    stickerData.forEach((stickerItem, idx, data) => {
      const { 
        driver, 
        routeNick, 
        locName,
        prodNick,
        totalQty,
        prodIdx,
        prodStickerCount,
        stickerQty, 
        stickerIdx, 
        stickerCount,
        displayDate,
      } = stickerItem

      doc.setFontSize(16)
      doc.text(`${locName}`, 0.2, 0.35)

      doc.setFontSize(10)
      doc.text(`${stickerIdx} of ${stickerCount}`, 3.8, 0.35, { align: "right" })

      doc.text(`${driver}: ${routeNick}`, 0.2, 0.6)
      doc.text(`Date: ${displayDate}`, 3.8, 0.6, { align: "right" })

      doc.setFontSize(20)
      doc.text(
        `${stickerQty} ${prodNick}` + (prodStickerCount > 1 ? ` (Total ${totalQty}, ${prodIdx} of ${prodStickerCount})` : ''), 
        0.2, 1.1, { align: "left" }
      )

      if (idx < data.length - 1) doc.addPage([2, 4], 'landscape')
    })

    doc.save(`Higuera_Stickers_${R0}.pdf`);

  }

  return { 
    products, 
    exportHigueraStickers,
    ...useMemo(calculateGridData, [R0Orders, LOC, RTE, products]) 
  }

}

const exportInvoices = async (
  pivotTables,
  reportDT,
  fileIdString,
  setIsLoading,
) => {
  if (!pivotTables) return
  setIsLoading(true)

  // invoice list should be sorted by route.printOrder > location.delivOrder.
  // pivot tables already accomplish this.
  const invoiceRows = pivotTables
    .flat()
    .filter(row => row.rowProps.toBePrinted)
    .reduce(uniqByRdc(row => row.rowProps.locNick), []) // a location may show up on 2 routes (e.g. lincoln)
  
  // proper qbID's are positive integer strings
  const badIdRows = invoiceRows.filter(row => !(row.rowProps.qbID.match(/^\d+$/)))
  if (badIdRows.length) console.warn(
    "Bad IDs encountered:", 
    badIdRows.map(L => ({ locNick: L.locNick, qbID: L.qbID }))
  )
  
  const hasTimeout = (response) => 1
    && typeof response?.data?.errorMessage === 'string'
    && response.data.errorMessage.includes("Task timed out")
  
  const accessToken = await QB.getAccessToken()
  const delivDate = reportDT.toFormat('yyyy-MM-dd')
  if (!accessToken) {
    console.warn('Failed to grant access'); return
  }
  
  let pdfResponses = await Promise.all(
    invoiceRows.map(row => QB.invoice.getPdf({ CustomerId: row.rowProps.qbID, delivDate, accessToken })
  ))

  for (let i = 1; i <= 5; i++) {
    const timeouts = pdfResponses.filter(response => hasTimeout(response))
    if (timeouts.length === 0) {
      console.log("No timeouts encountered.")
      break
    }

    console.log("Some requests timed out:", timeouts)
    console.log(`Retry attempt ${i} of 5...`)

    const retryPromises = pdfResponses.map((response, index) => hasTimeout(response)
      ? QB.invoice.getPdf({ CustomerId: invoiceRows[index].rowProps.qbID, delivDate, accessToken })
      : response
    )
    pdfResponses = await Promise.all(retryPromises)
    console.log("...with retrys:", pdfResponses)
    
  }

  // keep location data associated with pdf responses. 
  // At this point the arrays correspond by index.
  const responsesWithLocations = pdfResponses.map((pdfResponse, index) => ({
    pdfResponse,
    locNick: invoiceRows[index].rowProps.locNick,
    routeNick: invoiceRows[index].rowProps.routeNick,
    printDuplicate: invoiceRows[index].rowProps.printDuplicate
  }))

  const { true:successes=[], false:failures=[] } = groupByObject(
    responsesWithLocations,
    rwl => typeof rwl.pdfResponse.data === 'string'
  )

  console.log(`Fetch success count: ${successes.length}/${pdfResponses.length}`)

  if (failures.length) {
    console.error("Fetch failed for:", 
      Object.fromEntries(failures.map(rwl => [rwl.locNick, rwl.pdfResponse.data]))
    )

    if (failures.some(rwl => hasTimeout(rwl.pdfResponse))) {
      alert(
        "Fetch timed out for the following locations:\n\n"
        + failures
            .filter(rwl => hasTimeout(rwl.pdfResponse))
            .map(rwl => `${rwl.routeNick} > ${rwl.locNick}`)
            .join('\n')
        + "\n\nTry grabbing these invoices individually."
      )
    }

  }

  const pdfs = successes.flatMap(rwl => 
    rwl.printDuplicate ? [rwl, rwl] : rwl
  ).map(rwl => rwl.pdfResponse.data)

  downloadPDF(pdfs, `${fileIdString}_Invoices_${reportDT.toFormat('yyyy-MM-dd')}`)
  setIsLoading(false)
  
}

const exportGrids = (
  pivotTables,
  reportDT, 
  products,
  fileIdString,
) => {
  if (!pivotTables || !Object.keys(products).length) return

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
    doc.text(`${pivotTable[0].rowProps.routeNick} ${reportDT.toFormat('MM/dd/yyyy')}`, 10, 20);
    if (bpbTable.length) renderTable(tablePivotFlatten(bpbTable), bpbColumns)
    if (regTable.length) renderTable(tablePivotFlatten(regTable), regColumns)

  })

  doc.save(`${fileIdString}_Grids_${reportDT.toFormat('yyyy-MM-dd')}`)

}

const PageRouteGrid = () => {
  const setIsLoading = useSettingsStore(state => state.setIsLoading)

  const [reportDT, setReportDT] = useState(DT.today())

  const { data:pivotDataByRouteNick, pradoData, higueraData, products={}, exportHigueraStickers } = 
    useRouteGridData({ reportDT, shouldFetch: true })

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

  const handleExport = (data, fileIdString) => {
    exportGrids(data, reportDT, products, fileIdString)
    exportInvoices(data, reportDT, fileIdString, setIsLoading)
  }
  const exportAll     = () => handleExport(pivotDataByRouteNick, "All_Routes")
  const exportCurrent = () => handleExport(pivotDataByRouteNick?.filter(grid => grid[0].rowProps.routeNick === routeNick), routeNick.replace(/ /g, '_'))
  const exportDriver1 = () => handleExport(pivotDataByRouteNick?.filter(grid => grid[0].rowProps.driver === 'Long Driver'), 'Long_Driver')
  const exportDriver2 = () => handleExport(pivotDataByRouteNick?.filter(grid => grid[0].rowProps.driver === 'AM Pastry'), 'AM_Pastry')
  const exportDriver3 = () => handleExport(pivotDataByRouteNick?.filter(grid => grid[0].rowProps.driver === 'AM South'), 'AM_South')

  const printPrado   = () => exportGrids(pradoData,   reportDT, products, 'Prado_Pack')
  const printHiguera = () => exportGrids(higueraData, reportDT, products, 'Higuera_Pack')

  const headerTemplate =
    <div>
      <h1 style={{display: "inline-block", marginBlock: ".5rem"}}>Deliveries {reportDT.toFormat('MM/dd/yyyy')}</h1>
      <CustomCalendarInput reportDT={reportDT} setReportDT={setReportDT} />
    </div>

  const printByDriverButtons =
    <div style={{display: "flex", gap: "1rem", marginBlock: ".5rem"}}>
      <Button onClick={exportDriver1} icon="pi pi-print" label="Driver 1 (Long Driver)" />
      <Button onClick={exportDriver2} icon="pi pi-print" label="Driver 2 (Pastry)" />
      <Button onClick={exportDriver3} icon="pi pi-print" label="Driver 3 (South Driver)" />
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
          <Button onClick={exportCurrent} label={<div>Print<br/>Current Route</div>}  style={{width: "100%", marginTop: "1rem"}} />
          <Button onClick={exportAll}     label={<div>Print<br/>All Routes</div>}     style={{width: "100%", marginTop: "1rem"}} />
        
          <Button onClick={printPrado}   label={<div>Prado<br/>Pack Lists</div>}   style={{width: "100%", marginTop: "2rem"}} />
          <Button onClick={printHiguera} label={<div>Higuera<br/>Pack Lists</div>} style={{width: "100%", marginTop: "1rem"}} />
          <Button onClick={exportHigueraStickers} label={<div>Higuera<br/>Stickers</div>} style={{width: "100%", marginTop: "1rem"}} />
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