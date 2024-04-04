import React, { useState } from "react"

import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"

import { DrilldownCellTemplate } from "../ComponentDrilldownCellTemplate"

import { useProducts } from "../../../data/product/useProducts"
import { useBaker2Data } from "./useBaker2Data"

import { exportBaker2 } from "./exportBaker2"

import { DT } from "../../../utils/dateTimeFns"
import { keyBy } from "../../../utils/collectionFns"
import { useCheckForUpdates } from "../../../core/checkForUpdates"

const Baker2 = () => {

  const checkForUpdatesCompleted = useCheckForUpdates()
  
  const todayDT = DT.today()
  const [reportDT, setReportDT] = useState(todayDT)
  const isToday = reportDT.toMillis() === todayDT.toMillis()

  const { rusticShapeData, otherPrepData, croixSetoutData } = useBaker2Data({ reportDT, shouldFetch: checkForUpdatesCompleted })
  const { data:PRD=[], submitMutations, updateLocalData } = useProducts({ shouldFetch: true })
  const products = keyBy(PRD, P => P.prodNick)

  const submitPrepreshapes = async () => {
    const updateInputs = rusticShapeData?.map(row => ({
      prodNick: row.representativeProdNick,
      prepreshaped: row.qty
    }))
    console.log(updateInputs)
    updateLocalData(await submitMutations({ updateInputs }))
  }

  return (
    <div style={{maxWidth: "50rem", padding: "2rem 5rem 5rem 5rem", margin: "auto"}}>
      
      <h1>What to Shape {reportDT.toFormat('MM/dd/yyyy')}</h1>
      <Button 
        label="Print Prep List" 
        icon="pi pi-print" 
        style={{marginBottom: "1rem"}} 
        onClick={() => {
          submitPrepreshapes()
          exportBaker2({
            reportDT,
            rusticShapeData: rusticShapeData?.filter(row => row.qty !== 0),
            otherPrepData,
            croixSetoutData,
          })
        }}
        disabled={!rusticShapeData || !otherPrepData || !croixSetoutData}
      />

      <div>Using v3 <a href="/Production/BPBNBaker2/v2">Go to previous version</a></div>

      <DataTable 
        value={(rusticShapeData ?? []).filter(row => row.qty !== 0)}
        size="small" 
        responsiveLayout="scroll"   
        className={isToday ? '' : 'not-today'}
        style={{marginTop: "1rem"}}
      >
        <Column header="Product" field="forBake" />
        <Column header="Weight"  field="weight" />
        <Column header="Dough"   field="doughNick" />
        <Column header="Qty" 
          body={rowData => DrilldownCellTemplate({ 
            dialogHeader: `${rowData.forBake} Orders to be Baked`,
            cellValue: rowData.qty, 
            tableData: rowData.items,
            products,
          })} 
          style={{width: "6rem"}}
        />
        <Column 
          header="synced?"
          body={row => row.productRep.prepreshaped === row.qty
            ? <i className="pi pi-check-circle" style={{color:"green", paddingLeft: "1rem"}} />
            : <i className="pi pi-times" style={{color:"red", paddingLeft: "1rem"}} />
          }  
        />
      </DataTable>

      <h2>Other Prep</h2>
      <DataTable 
        value={otherPrepData}
        size="small"
        responsiveLayout="scroll"
        style={{marginTop: "1rem"}}
        className={isToday ? '' : 'not-today'}
      >
        <Column header="Product" field="prodName"   />
        <Column header="Qty"
          body={rowData => DrilldownCellTemplate({
            dialogHeader: `${rowData.prodName} Orders to be Shaped`,
            cellValue: rowData.qty,
            tableData: rowData.items,
            products
          })}
          style={{width: "6rem"}}
        />

      </DataTable>

      <h2>Croissant Setout</h2>
      <DataTable 
        value={croixSetoutData}
        size="small"
        responsiveLayout="scroll"
        style={{marginTop: "1rem"}}
        className={isToday ? '' : 'not-today'}
      >
        <Column header="Product" field="setoutKey" />
        <Column header="Qty"
          body={rowData => DrilldownCellTemplate({
            dialogHeader: `${rowData.shapeType} Orders to be Shaped`,
            cellValue: rowData.total,
            tableData: rowData.orders,
            products
          })}
          style={{width: "6rem"}}
        />

      </DataTable>
    </div>
  )

}

export { Baker2 as default } 