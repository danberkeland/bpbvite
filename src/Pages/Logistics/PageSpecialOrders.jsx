import { useMemo, useRef, useState } from "react"

import jsPDF from "jspdf"
import "jspdf-autotable"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"

import { DT } from "../../utils/dateTimeFns"
import { groupByObject } from "../../utils/collectionFns"
import { useOrdersByDelivDate } from "../../data/order/useOrders"
import { tablePivot, tablePivotFlatten } from "../../utils/tablePivot"
import { truncate } from "lodash"
import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"

const useSpecialOrdersData = ({ reportDT, shouldFetch }) => {
  const { data:ORD } = useOrdersByDelivDate({ delivDate: reportDT.toFormat('yyyy-MM-dd'), shouldFetch })

  const calculateSpecialOrders = () => {
    if (!ORD) return { pradoData: undefined, carltonData: undefined }

    const retailOrders = ORD.filter(order => order.isWhole === false && order.qty !== 0)
    const { slopick:pradoOrders=[], atownpick:carltonOrders=[] } = groupByObject(retailOrders, order => order.route)
    
    const rowPartitionModel = {
      locNick: order => order.locNick,
      displayName: order => truncate(order.locNick.split('__')[0], { length: 18 }),
      isSquareOrder: order => order.locNick.includes('__') ? '*' : '',
      isHigueraPack: order => order.locNick.includes('Online') ? '*' : '',
    }

    const [pradoData, carltonData] = [pradoOrders, carltonOrders].map(orders => 
      tablePivot(orders, rowPartitionModel, order => order.prodNick, items => items[0].qty)
    )

    return { pradoData, carltonData }
    
  }

  return useMemo(calculateSpecialOrders, [ORD])

}

const exportSpecialOrderTablePdf = (pivotData, reportLocationStr, reportDT) => {
  const printData = tablePivotFlatten(pivotData)
  console.log(printData)
  
  const pivotColumns = Object.keys(pivotData[0]?.colProps).sort()
  const columns = [
    { header: "Sq?",      dataKey: "isSquareOrder" },
    { header: "Hi",  dataKey: "isHigueraPack"},
    { header: "Customer", dataKey: "displayName" },
    ...pivotColumns.map(prodNick => (
      { header: prodNick, dataKey: prodNick }
    ))
  ] 

  const doc = new jsPDF("l", "mm", "a4");

  doc.setFontSize(20);
  doc.text(`${reportLocationStr} Special Orders ${reportDT.toFormat('MM/dd/yyyy')}`, 10, 20)

  doc.autoTable({
    body: printData,
    columns,
    startY: 36,
    styles: { fontSize: 11 },
    columnStyles: {
      isSquareOrder: { cellWidth: 20, halign: 'center' },
      rowKey: { cellWidth: 40 }
    },
    theme: "grid"
  });

  doc.save(`${reportLocationStr}_Special_Orders_${reportDT.toFormat('yyyy-MM-dd')}.pdf`)
}

const PageSpecialOrders = () => {
  const todayDT = DT.today()
  const [reportDT, setReportDT] = useState(todayDT)
  const { pradoData, carltonData } = 
    useSpecialOrdersData({ reportDT, shouldFetch: true })

  console.log(pradoData, carltonData)

  const printCarlton = () => exportSpecialOrderTablePdf(carltonData, "BPBN", reportDT)
  const printPrado   = () => exportSpecialOrderTablePdf(pradoData,   "BPBS", reportDT)

  return (
    <div style={{padding: "2rem 5rem 5rem 5rem", margin: "auto"}}>
      <div style={{
        display:"flex",
        alignItems: "center",
        gap: "1rem",
        width: "fit-content",
        padding: ".75rem",
        borderRadius: ".4rem",
        background: reportDT.toMillis() === todayDT.toMillis() 
          ? "var(--bpb-surface-content)"
          : "rgba(225, 225, 225, .9)",
      }}>
        <h1 style={{margin: "0"}}>Special Orders {reportDT.toFormat('MM/dd/yyyy')}</h1>
        <CustomCalendarInput reportDT={reportDT} setReportDT={setReportDT} />
      </div>

      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <h2>Carlton</h2>
        <Button label="BPBN List" icon="pi pi-print" onClick={printCarlton} />
      </div>
      <PivotTableTemplate pivotData={carltonData} />

      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <h2>Prado</h2>
        
        <Button label="BPBS List" icon="pi pi-print" onClick={printPrado} />
      </div>
      <h3>Ignore if "Higuera Pack" is checked.  Otherwise, pack and take to Higuera by 7 AM.</h3>
      <PivotTableTemplate pivotData={pradoData} hig/>
      
    </div>
  )
}

export { PageSpecialOrders as default }



const PivotTableTemplate = ({ pivotData, hig }) =>       
  <DataTable
    value={pivotData ?? []}
    size="small"
    stripedRows
    showGridlines
    responsiveLayout="scroll"
  >
    <Column 
      header={<span>Square<br/>Order?</span>} 
      body={row => !!row?.rowProps?.isSquareOrder ? <i className="pi pi-check" /> : ''} 
      style={{width: "3rem", textAlign: "center"}} 
    />
    {hig && (
  <Column 
    header={<span>Higuera<br/>Pack?</span>} 
    body={row => !!row?.rowProps?.isHigueraPack ? <i className="pi pi-check" /> : ''} 
    style={{ width: "3rem", textAlign: "center" }} 
  />
)}
    <Column 
      header="Customer" 
      field="rowProps.displayName" 
      style={{width: "10rem"}} 
    />
    {Object.keys(pivotData?.[0]?.colProps ?? []).sort().map(prodNick => 
      <Column header={prodNick} field={`colProps.${prodNick}.value`}/>
    )}
  </DataTable>


const CustomCalendarInput = ({ reportDT, setReportDT }) => {
  const calendarRef = useRef()
  return <div>
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