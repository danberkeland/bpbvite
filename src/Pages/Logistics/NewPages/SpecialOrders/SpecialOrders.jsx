import { DateTime } from "luxon"
import { useRef, useState } from "react"
import { useSpecialOrderData } from "./data"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { truncate } from "lodash"
import { Calendar } from "primereact/calendar"
import { Button } from "primereact/button"
import { exportSpecialOrderPdf } from "./exportPdf"

const flexSplitStyle = {
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "center"
}


export const SpecialOrders = () => {
  const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
  const todayISO = todayDT.toFormat('yyyy-MM-dd')

  const calendarRef = useRef()
  const [calendarDate, setCalendarDate] = useState(new Date())
  const reportDateDT = DateTime.fromJSDate(calendarDate)
    .setZone('America/Los_Angeles')
    .startOf('day')
  const reportDateUS = reportDateDT.toFormat('MM/dd/yyyy')
  const reportDate = reportDateDT.toFormat('yyyy-MM-dd')

  const { data } = useSpecialOrderData({ reportDate, shouldFetch: !!reportDate })

  return (
    <div style={{
      maxWidth: "50rem", 
      margin: "auto", 
      marginTop: "5rem", 
      marginBottom: "10rem"
    }}>
      <div style={{
        display:"flex",
        alignItems: "center",
        gap: "1rem",
        width: "fit-content",
        padding: ".75rem",
        borderRadius: ".4rem",
        background: reportDate === todayISO 
          ? "var(--bpb-surface-content)"
          : "rgba(225, 225, 225, .9)",
      }}>
        <h1 style={{margin: "0"}}>Special Orders {reportDateUS}</h1>

        <div>
        <Button 
          icon="pi pi-calendar"
          // ref={buttonRef}
          // id="calendar-button"
          className="p-button-rounded" 
          onClick={() => calendarRef.current.show()}
        />
        <Calendar 
          value={calendarDate}
          ref={calendarRef}
          onChange={e => setCalendarDate(e.value)} 
          inputStyle={{visibility: "hidden", width:"0", height: "0", padding: "0"}}
          panelStyle={{transform: "translate(-.8rem, 0rem)"}}
        />
        </div>
      </div>

      <div style={{marginTop: "3rem", ...flexSplitStyle}}>
        <h2>Carlton</h2>
        <Button 
          label="BPBN List" 
          icon="pi pi-fw pi-print" 
          onClick={() => exportSpecialOrderPdf({
            data: data?.northPdf,
            header: `BPBN Special Orders ${reportDateUS}`,
            filename: `BPBN_Special_${reportDate}.pdf`
          })}
        />
      </div>
      <SpecialOrderTable tableData={data?.northTable ?? []} keyString="north" />

      <div style={{marginTop: "3rem", ...flexSplitStyle}}>        
        <h2>Prado</h2>
        <Button 
          label="BPBS List" 
          icon="pi pi-fw pi-print"
          onClick={() => exportSpecialOrderPdf({
            data: data?.southPdf,
            header: `BPBS Special Orders ${reportDateUS}`,
            filename: `BPBS_Special_${reportDate}.pdf`
          })}
        />
      </div>
      <SpecialOrderTable tableData={data?.southTable ?? []} keyString="south" />

    </div>
  )
}



const SpecialOrderTable = ({ tableData, keyString }) => {
  const { pivotColumnKeys=[], rows=[] } = tableData

  return (
    <DataTable 
      value={rows}
      size="small"
      stripedRows
      showGridlines
      responsiveLayout="scroll"
    >
      <Column 
        header="Customer" 
        body={row => truncate(row.rowKey, { length: 16 })} 
        style={{width: "10rem"}}
      />
      {pivotColumnKeys.map(colKey => {
        return (
          <Column 
            key={keyString + colKey}
            header={colKey} 
            body={row => row[colKey]?.qty ?? ''}   
          />
        )
      })}
    </DataTable>
  )
}