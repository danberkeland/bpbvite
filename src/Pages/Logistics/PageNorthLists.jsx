import React from "react"
import { useNorthListData } from "./useNorthListsData"
import { useDriverNotes } from "./useDriverNotes"
import { DT } from "../../utils/dateTimeFns"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { exportNorthListPdf } from "./exportNorthListsPdf"
import { useCheckForUpdates } from "../../core/checkForUpdates"



const NorthLists = () => {
  const reportDateDT = DT.today().plus({ days: 0 })
  const reportDate = reportDateDT.toFormat('yyyy-MM-dd')

  const { data:notes } = useDriverNotes({ reportDate })
  const { 
    useCalcCroixNorth,
    useCalcShelfProds,
    useAMNorthPradoPack,
  } = useNorthListData({ reportDT: reportDateDT })

  const croixNorth = useCalcCroixNorth()

  const { 
    pivotTable:shelfPivotTable, 
    columnKeys:shelfColKeys, 
    flatTable:shelfPdfData 
  } = useCalcShelfProds()

  const { 
    pivotTable:AMNorthPradoPivotTable, 
    columnKeys:AMNorthPradoColKeys, 
    flatTable:AMNorthPradoPdfData 
  } = useAMNorthPradoPack()

  // console.log("croixNorth", croixNorth)
  // console.log("shelfProds", shelfPivotTable)
  // console.log("shelfKeys", shelfColKeys)
  // console.log("flatTable", shelfPdfData)
  // console.log("AMNorthPradoPivotTable", AMNorthPradoPivotTable)
  // console.log("AMNorthPradoColKeys", AMNorthPradoColKeys)
  // console.log("AMNorthPradoPdfData", AMNorthPradoPdfData)

  useCheckForUpdates()

  return (
    <div style={{margin: "auto", paddingInline: "10%", paddingBottom: "10rem"}}>
      <h1>Long Driver List {reportDateDT.toFormat('MM/dd/yyyy')}</h1>

      <a href="/logistics/NorthLists/v1" >Link to Old Version</a>

      <div style={{marginTop: "1rem", marginBottom: "2rem" }}>
        <Button 
          label="Print North List" 
          icon="pi pi-print" 
          onClick={() => exportNorthListPdf(
            reportDateDT, 
            notes, 
            croixNorth, 
            shelfColKeys, shelfPdfData,
            AMNorthPradoColKeys,
            AMNorthPradoPdfData,
          )}
        />
      </div>

      <DataTable 
        value={notes}
        className="p-datatable-sm"
        responsiveLayout="scroll"
        style={{marginBottom: "2rem"}}
      >
        <Column 
          header="Notes" 
          field="note"
          bodyStyle={{whiteSpace: "pre-wrap"}}
        />
      </DataTable>

      <h2>Frozen and Baked Croissants</h2>
      <DataTable
        value={croixNorth}
        className="p-datatable-sm"
        responsiveLayout="scroll"
        style={{marginBottom: "2rem"}}
      >
        <Column header="Product" field="prodNick"  />
        <Column header="Frozen"  field="frozenQty" />
        <Column header="Baked"   field="bakedQty"  />
      </DataTable>

      <h2>Shelf Products</h2>
      <p style={{ fontWeight: "bold" }}>Counts Packs (example: 1 bz = 1 pack = 8 ea)</p>
      <DataTable
        value={shelfPivotTable}
        className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
        responsiveLayout="scroll"
        style={{marginBottom: "2rem"}}
      >
        <Column 
          header="Location" 
          field="rowProps.locNameShort"  
          style={{width: "10rem"}}  
        />
        {shelfColKeys.map(prodNick => 
          <Column 
            header={prodNick} 
            body={row => row.colProps?.[prodNick].value} 
            key={`shelf-col-${prodNick}`}
          />)
        }
      </DataTable>

      <h2>AM North: Pack at Prado</h2>
      <p style={{ fontWeight: "bold" }}>Counts Packs (example: 1 bz = 1 pack = 8 ea)</p>
      <DataTable
        value={AMNorthPradoPivotTable}
        className="p-datatable-gridlines p-datatable-sm p-datatable-striped"        
        responsiveLayout="scroll"
        style={{marginBottom: "2rem"}}
      >
        <Column 
          header="Location" 
          field="rowProps.locNameShort"  
          style={{width: "10rem"}}  
        />        
        {AMNorthPradoColKeys.map(prodNick => 
          <Column 
            header={prodNick} 
            body={row => row.colProps?.[prodNick].value} 
            style={{maxWidth: "3rem"}}
            key={`AM-col-${prodNick}`}
          />)
        }
      </DataTable>



    </div>
  )


}

export { NorthLists as default } 