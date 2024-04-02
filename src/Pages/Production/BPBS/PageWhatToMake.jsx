import { useState } from "react"
import { DT } from "../../../utils/dateTimeFns"
import { useWhatToMake } from "./useWhatToMake"
import { DrilldownCellTemplate } from "../ComponentDrilldownCellTemplate"
import { keyBy } from "lodash"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"





const WhatToMake = () => {
  const [reportDT, setReportDT] = useState(DT.today())

  const { 
    freshData,
    shelfData,
    PRD,
  } = useWhatToMake({ reportDT })

  const products = keyBy(PRD, P => P.prodNick)

  return (
    <div style={{ padding: "2rem 5rem 5rem 5rem", width: "50rem", margin: "auto" }}>
      <h1>BPBS What to Make {reportDT.toFormat('M/d/yyyy')}</h1>

      <h2 onClick={() => console.log(freshData)}>Make Fresh</h2>
      <DataTable 
        value={freshData ?? []} 
        size="small"
      >
        <Column header="Product" field="rowKey" />
        <Column header="Total Deliv"
          body={rowData => DrilldownCellTemplate({
            dialogHeader: 'Bake & Deliver Today',
            cellValue: rowData.T0Ea,
            tableData: rowData.T0Items,
            products,
          })}  
        />
        <Column header="Needed Early" 
          body={(rowData => DrilldownCellTemplate({
            dialogHeader: 'Carlton (Going North) & Sandos Orders',
            cellValue: rowData.earlyEa,
            tableData: rowData.earlyItems,
            products,
          }))}  
        />
        <Column header="Bag For Tomorrow" 
          body={(rowData => DrilldownCellTemplate({
            dialogHeader: 'Bake Ahead for Tomorrow',
            cellValue: rowData.T1Ea,
            tableData: rowData.T1Items,
            products,
          }))}  
        />
        <Column header="Make Total" 
          body={(rowData => DrilldownCellTemplate({
            dialogHeader: 'Total Requirements',
            cellValue: rowData.neededEa,
            tableData: rowData.neededItems,
            products,
          }))}  
        />
      </DataTable>

      <h2 onClick={() => console.log(shelfData)}>Make For Shelf</h2>
      <DataTable 
        value={shelfData} 
        size="small"
      >
        <Column header="Product" field="rowKey" />
        <Column header="Total Deliv"
          body={rowData => DrilldownCellTemplate({
            dialogHeader: 'Deliveries',
            cellValue: rowData.delivEa,
            tableData: rowData.delivItems,
            products,
          })}  
        />
        <Column header="Need Early" field="needTodayEa" />
        <Column header="Make Total"
          body={rowData => DrilldownCellTemplate({
            dialogHeader: 'Today & Tomorrow Orders',
            cellValue: rowData.bakeTotalEa,
            tableData: rowData.totalItems,
            products,
          })}  
        />
        {/* <Column header="Need Extra Early" 
          body={(rowData => ExpandableCellTemplate({
            dialogHeader: 'Fresh Items To Be Baked and Sent North',
            colKey: 'needExtraEarlyCol',
            rowData,
            products,
          }))}  
          headerStyle={{...headerStyle}}
        /> */}
      </DataTable>


    </div>
  )

}

export { WhatToMake as default }