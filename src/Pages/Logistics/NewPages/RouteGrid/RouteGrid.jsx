import { useRouteGrid } from "./data"
import { useListData } from "../../../../data/_listData"

import { ListBox } from "primereact/listbox"
import { Calendar } from "primereact/calendar"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup"

import { useState } from "react"
import { DateTime } from "luxon"
import { keyBy, pickBy, sortBy } from "lodash"
import { 
  exportRouteGridPdf, 
  exportInvoicePdf, 
  exportSingleInvoice
} from "./exportPdf"

import "./routeGrid.css"
import { useSettingsStore } from "../../../../Contexts/SettingsZustand"

const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')

export const RouteGrid = () => {
  
  const [routeNick, setRouteNick] = useState('AM Pastry')

  const [reportDateJS, setReportDateJS] = useState(new Date())
  const reportDateDT = DateTime.fromJSDate(reportDateJS)
    .setZone('America/Los_Angeles')
    .startOf('day')
  const reportDateISO = reportDateDT.toFormat('yyyy-MM-dd')
  const reportWeekdayNum = (reportDateDT.toFormat('E') % 7) + 1 // in our wacky format Sun = 1, Sat = 7
  const reportDateIsToday = reportDateISO === todayDT.toFormat('yyyy-MM-dd')

  const { data:gridData } = useRouteGrid({ 
    reportDate: reportDateDT.toFormat('yyyy-MM-dd'), shouldFetch: true
  })
  const { data:RTE } = useListData({ tableName: "Route", shouldFetch: true })
  const { data:LOC } = useListData({ tableName: "Location", shouldFetch: true })

  const setIsLoading = useSettingsStore((state) => state.setIsLoading)

  if ( !gridData || !RTE || !LOC ) return <div>Loading...</div>

  const { tableData, pdfGrids } = gridData 
  const routes = keyBy(RTE, "routeNick")
  const locations = keyBy(LOC, "locNick")

  console.log("tableData", tableData)
  // console.log("pdfGrids", pdfGrids)
  // console.log(RTE)
  // console.log("LOC:", LOC)

  const routeOptions = sortBy(RTE, 'printOrder')
    .filter(R => tableData.hasOwnProperty(R.routeNick))
    .map(R => ({
      label: R.routeNick,
      value: R.routeNick,
      disabled: !R.RouteSched.includes(reportWeekdayNum.toString())
    }))

  // 'partial application' technique allows us to call the function while
  // specifying only the inputs that change from one call to the next.
  const exportInvoice = ({ location }) => exportSingleInvoice({
    location, delivDate: reportDateISO, setIsLoading
  })
  const exportInvoices = ({ gridData, fileName }) => exportInvoicePdf({
    gridData, fileName, routes, locations, reportDateDT, setIsLoading
  })
  const exportGrids = ({ gridData, fileName }) => exportRouteGridPdf({ 
    gridData, fileName, reportDateDT 
  })


  const exportInvoiceWithConfirm = ({ event, location }) => {
    if (location.toBePrinted === true) {

      exportInvoice({ location })
    } else {
      
      confirmPopup({
        target: event.currentTarget,
        message: <span>
          This customer doesn't get a printed invoice. <br />Print anyway?
        </span>,
        icon: 'pi pi-exclamation-triangle',
        accept: () => exportInvoice({ location }),
      })
    }
  }


  const printColumnTemplate = (row) => 
    <i className="pi pi-fw pi-print" 
      onClick={event => exportInvoiceWithConfirm({ 
        event, location: locations[row.locNick] 
      })}
      style={{ cursor: "pointer"}}
    />

  return (<>
    <div style={{
      marginBottom: "10rem",
      display: "grid",
      gridTemplateColumns: "10rem 1fr",
      gap: "0 2rem",
      margin: "6rem"
    }}>
      <div>
        <ConfirmPopup />
        {/* <h2>Routes:</h2> */}
        <Calendar 
          value={reportDateJS}
          onChange={e => {
            setRouteNick('AM Pastry')
            setReportDateJS(e.value)}
          }
          inputStyle={{width: "8rem", height: "2.5rem"}}
          showIcon iconPos="left" icon="pi pi-fw pi-calendar"
        />

        <ListBox 
          value={routeNick}
          options={routeOptions}
          onChange={e => {if (e.value) setRouteNick(e.value)}}
          style={{width:"10rem", marginTop: "1rem"}}
        />

        <Button label={<span>Print <br/>Current Route</span>}
          onClick={() => {
            const gridData = pickBy(
              pdfGrids, 
              (value, key) => key === routeNick
            )
            const fStr = `${reportDateISO}_${routeNick.replace(" ", "_")}`
            exportGrids({ gridData, fileName: fStr + '_Route_Grid.pdf' })
            exportInvoices({ gridData, fileName: fStr + '_Invoices.pdf' })
          }}      
          style={{width: "100%", marginTop: "1rem"}}
        />

        <Button label={<span>Print <br/>All Routes</span>}
          onClick={() => {
            const gridData = pdfGrids
            const fStr = `${reportDateISO}_All`
            exportGrids({ gridData, fileName: fStr + '_Route_Grids.pdf' })
            exportInvoices({ gridData, fileName: fStr + '_Invoices.pdf' })
          }} 
          style={{width: "100%", marginTop: "1rem"}}
        />
      </div>

      <div>
        <div style={{height: "3.5rem", display: "flex", alignItems: "flex-Start", gap: "1rem"}}>
          <Button label="Driver 1 (Long Driver)"
            onClick={() => {
              const gridData = pickBy(
                pdfGrids, 
                routeGridObj => routeGridObj.driver === "Long Driver"
              )
              const fStr = `${reportDateISO}_Long_Driver`
              exportGrids({ gridData, fileName: fStr + '_Route_Grids.pdf' })
              exportInvoices({ gridData, fileName: fStr + '_Invoices.pdf' })
            }}
            icon="pi pi-fw pi-print"
          />

          <Button label="Driver 2 (Pastry)"
            onClick={() => {
              const gridData = pickBy(
                pdfGrids, 
                routeGridObj => routeGridObj.driver === "AM Pastry"
              )
              const fStr = `${reportDateISO}_AM_Pastry`
              exportGrids({ gridData, fileName: fStr + '_Route_Grids.pdf' })
              exportInvoices({ gridData, fileName: fStr + '_Invoices.pdf' })
            }}
            icon="pi pi-fw pi-print"
          />

          <Button label="Driver 3 (South Driver)"
            onClick={() => {
              const gridData = pickBy(
                pdfGrids, 
                routeGridObj => routeGridObj.driver === "AM South"
              )
              const fStr = `${reportDateISO}_AM_South`
              exportGrids({ gridData, fileName: fStr + '_Route_Grids.pdf' })
              exportInvoices({ gridData, fileName: fStr + '_Invoices.pdf' })
            }}
            icon="pi pi-fw pi-print"
          />
        </div>

        <DataTable
          value={tableData?.[routeNick]?.rows ?? []}
          showGridlines stripedRows size="small"
          className={reportDateIsToday ? 'today-table' : 'not-today-table'}

        >
          <Column body={printColumnTemplate} style={{width: "2rem"}} frozen />
          <Column header="Location" field="locNameShort" frozen />
          {(tableData?.[routeNick]?.prodNickList ?? []).map(prodNick => {
            return (
              <Column 
                key={`${prodNick}-col`} 
                header={prodNick} 
                field={`${prodNick}.qty`}
              />
            )
          })}
        </DataTable>
      </div>
    </div>
  </>)
}


