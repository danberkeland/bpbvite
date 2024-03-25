import React from "react"
import { DataTable } from "primereact/datatable"
import { DT } from "../../../utils/dateTimeFns"

import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { InputText } from "primereact/inputtext"

import { useState } from "react"
import { Dialog } from "primereact/dialog"
import { keyBy, sumBy } from "../../../utils/collectionFns"
import { DrilldownCellTemplate } from "./DrilldownCellTemplate"

import { useBucketsData } from "./useBucketsData"
import { printBucketStickers } from "./exportBucketStickers"
import { round } from "lodash"


const Buckets = () => {
  const reportDT = DT.today()

  const { 
    doughList,
    products:PRD=[],
    doughComponents:DCP=[],
  } = useBucketsData({ reportDT })
  
  const products = keyBy(PRD, P => P.prodNick)

  const [showTable, setShowTable] = useState([])
  const showTableAtIdx = idx => {
    let newState = [...showTable]
    newState[idx] = true
    setShowTable(newState)
  }
  const hideTableAtIdx = idx => {
    let newState = [...showTable]
    newState[idx] = false
    setShowTable(newState)
  }

  return (
    <div style={{width: "60rem", margin:"auto", padding: "2rem 5rem 5rem 5rem"}}>

      <h1>Carlton Dough Stickers</h1>
      {(doughList ?? []).filter(row => row.mixedWhere === 'Carlton').map((row, idx) => {

        return (<div key={row.doughName} style={{marginBlock: "1rem"}}>

          <h2 style={{display: "inline"}}>
            {row.doughName}: (need {row.needed.toFixed(2)} lb.) TOTAL: {(row.needed + row.buffer).toFixed(2)}
          </h2>
          <Button 
            icon="pi pi-table" 
            label="Info"
            onClick={() => showTableAtIdx(idx)} 
            style={{marginLeft: "2rem"}}
          />

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 0.75fr", columnGap: "1rem", rowGap: "1rem", margin: "1rem" }}>
            
            <div> 
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlock: ".5rem" }}>
                <div>Old Dough:</div>
                <div>
                  <div className="p-inputgroup">
                    <InputText value={row.oldDough} style={{ maxWidth: "7rem" }} />
                    <span className="p-inputgroup-addon">lb.</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlock: ".5rem" }}>
                <div>Buffer Dough:</div>
                <div>
                  <div className="p-inputgroup">
                    <InputText value={row.buffer} style={{ maxWidth: "7rem" }} />
                    <span className="p-inputgroup-addon">lb.</span>
                  </div>
                </div>
              </div>

            </div>
            <Button 
              label="Print Today Set"
              onClick={() => printBucketStickers(
                row, 
                row.needed + row.buffer - row.oldDough, 
                row.oldDough,
                DCP,
              )}
            /> 
            <Button 
              label="Print Default Set"
              onClick={() => printBucketStickers(
                row, 
                row.batchSize, 
                row.oldDough,
                DCP,
              )}
            /> 
            <Button 
              label="Half Batch"
              onClick={() => printBucketStickers(
                row, 
                round((row.needed + row.buffer - row.oldDough) / 2, 2), 
                row.oldDough,
                DCP,
              )}
            /> 
          </div>



          <Dialog
            visible={showTable[idx]}
            onHide={() => hideTableAtIdx(idx)}
            header={`${row.doughName} Dough - Prep for Baking Today +${row.targetRelDate}`}
            headerStyle={{gap: "1rem"}}
          >
            <DataTable 
              value={row.summary}
              responsiveLayout="scroll"
            >
              <Column header="forBake"      
                field="forBake" 
                footer="Total:"  
              />
              <Column header="Needed (lb.)" 
                body={rowData => DrilldownCellTemplate({
                  dialogHeader: `${rowData.forBake} Orders to Bake Today +${row.targetRelDate}`,
                  cellValue: (rowData.neededEa * rowData.weight).toFixed(1),
                  tableData: rowData.items,
                  products
                })}
                footer={options => sumBy(options.props.value ?? [], row => row.neededEa * row.weight).toFixed(2)}  
              />

            </DataTable>
          </Dialog>
        </div>)
      })}
    </div>
  )
}

export { Buckets as default }

