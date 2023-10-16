import { useRouteGrid } from "./data"
import { useListData } from "../../../../data/_listData"

// import { ListBox } from "primereact/listbox"
import { Calendar } from "primereact/calendar"
import { Dropdown } from "primereact/dropdown"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"

import { useState } from "react"
import { DateTime } from "luxon"
import { keyBy, pickBy, sortBy } from "lodash"
import { exportInvoicePdf, exportRouteGridPdf, exportSingleInvoice } from "./exportPdf"

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
  // console.log(LOC)
  const routeOptions = sortBy(RTE, ['routeStart', 'routeNick'])
    .filter(R => tableData.hasOwnProperty(R.routeNick))
    .map(R => ({
      label: R.routeNick,
      value: R.routeNick,
      disabled: !R.RouteSched.includes(reportWeekdayNum.toString())
    }))

  return (
    <div style={{marginBottom: "10rem"}}>
      <Dropdown 
        value={routeNick}
        options={routeOptions}
        onChange={e => {if (e.value) setRouteNick(e.value)}}
        style={{width:"10rem"}}
      />

      <Calendar 
        value={reportDateJS}
        onChange={e => {
          setRouteNick('AM Pastry')
          setReportDateJS(e.value)}
        }
      />

      <DataTable
        value={tableData?.[routeNick]?.rows ?? []}
        showGridlines
        stripedRows
        size="small"
        className={reportDateIsToday ? 'today-table' : 'not-today-table'}
      >
        <Column 
          body={row => {
            return (
              <div 
                onClick={() => exportSingleInvoice({ 
                  location: locations[row.locNick ], 
                  delivDate: reportDateISO,
                  setIsLoading
                })}
                style={{ cursor: "pointer"}}
              >
                <i className="pi pi-fw pi-print" />
              </div>

            ) 
          }} 
        />
        <Column header="Location" field="locNameShort" bodyStyle={{width: "8rem"}}/>
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

      <Button label="Print All Routes" 
        onClick={() => {
          exportRouteGridPdf({ 
            gridData: pdfGrids, 
            fileName: `${reportDateISO}_All_Routes.pdf`,
            reportDateDT 
          })
          exportInvoicePdf({ 
            gridData: pdfGrids, 
            fileName: `${reportDateISO}_All_Invoices.pdf`,
            routes, locations, reportDateDT, setIsLoading
          })
        } 
        } 
      />

      <Button label="Print Current Route"
        onClick={() => {
          const gridData = pickBy(pdfGrids, (value, key) => key === routeNick)
          exportRouteGridPdf({ 
            gridData, 
            fileName: `${reportDateISO}_${routeNick.replace(" ", "_")}_Route.pdf`, 
            reportDateDT 
          })
          exportInvoicePdf({ 
            gridData, 
            fileName: `${reportDateISO}_${routeNick.replace(" ", "_")}_Invoices.pdf`,
            routes, locations, reportDateDT, setIsLoading
          })
        }}      
      />

      <Button label="Driver 1 (Long Driver)"
        onClick={() => {
          const gridData = pickBy(pdfGrids, routeGridObj => routeGridObj.driver === "Long Driver")
          exportRouteGridPdf({
            gridData: gridData,
            fileName: `${reportDateISO}_Long_Driver_Routes.pdf`,
            reportDateDT
          })
          exportInvoicePdf({ 
            gridData, 
            fileName: `${reportDateISO}_Long_Driver_Invoices.pdf`,
            routes, locations, reportDateDT, setIsLoading
          })
        }}
        disabled={true}
      />

      <Button label="Driver 2 (Pastry)"
        onClick={() => {
          const gridData = pickBy(pdfGrids, routeGridObj => routeGridObj.driver === "AM Pastry")
          exportRouteGridPdf({
            gridData: gridData,
            fileName: `${reportDateISO}_AM_Pastry_Routes.pdf`,
            reportDateDT
          })
          exportInvoicePdf({ 
            gridData, 
            fileName: `${reportDateISO}_AM_Pastry_Invoices.pdf`,
            routes, locations, reportDateDT, setIsLoading
          })
        }}    
        disabled={true} 
      />

      <Button label="Driver 3 (South Driver)"
        onClick={() => {
          const gridData = pickBy(pdfGrids, routeGridObj => routeGridObj.driver === "AM South")
          exportRouteGridPdf({
            gridData: gridData,
            fileName: `${reportDateISO}_AM_South_Routes.pdf`,
            reportDateDT
          })
          exportInvoicePdf({ 
            gridData, 
            fileName: `${reportDateISO}_AM_South_Invoices.pdf`,
            routes, locations, reportDateDT, setIsLoading
          })
        }}
        disabled={true}
      />

    </div>

  )
}


