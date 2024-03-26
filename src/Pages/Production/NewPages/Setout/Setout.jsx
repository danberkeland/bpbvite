import React, { useEffect } from "react"

import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"

import { keyBy } from "lodash"
import { DateTime } from "luxon"

import { useListData } from "../../../../data/_listData"
import { useSetoutData } from "./data"
import { exportPastryPrepPdf } from "./exportPdf"

import { recordSetoutTime, submitPrepreshaped } from "./submitFunctions"
import { DrilldownCellTemplate } from "../BPBN/_components/DrilldownCellTemplate"
import { useCheckForUpdates } from "../../../../core/checkForUpdates"

const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
// const todayDT = _todayDT.toFormat('MM-dd') === '12-24'
//   ? _todayDT.plus({ days: 1 }) : _todayDT
//console.log(_todayDT.toFormat('MM-dd'))
const todayISO = todayDT.toFormat('yyyy-MM-dd')
const todayUS = todayDT.toFormat('MM/dd/yyyy')

const SetoutByLocation = ({ reportLocation }) => {

  const { data:setoutData } = useSetoutData({ reportDate: todayISO })
  const { north, south } = setoutData ?? {}
  // console.log('north', north)
  // console.log('south', south)

  const productCache = useListData({ tableName: "Product", shouldFetch: true })
  const products = keyBy(productCache?.data, 'prodNick')

  useCheckForUpdates()

  useEffect(() => {
    confirmDialog({
      message: "Click YES to confirm these setout numbers will be used.",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => recordSetoutTime({ reportDate: todayISO, reportLocation}),
    })
  }, [])

  return (
    <div style={{
      maxWidth:"40rem", 
      margin: "auto",
      padding: "2rem 5rem"
    }}>
      <h1>{reportLocation} Pastry Prep {todayUS}</h1>
      <Button label={`Print ${reportLocation} Prep List`} 
        onClick={() => {
          exportPastryPrepPdf({
            reportLocation: reportLocation,
            reportDateUS: todayUS,
            reportDateISO: todayISO,
            data: reportLocation === "Prado" ? south : north
          })

          // scream test commencing 12-02-2023:
          // submitPrepreshaped({ 
          //   croixData: reportLocation === "Prado"
          //     ? setoutData?.south?.nonAlmondCroix
          //     : setoutData?.north?.nonAlmondCroix, 
          //   productCache 
          // })
        }}
      />
      
      <h2>Set Out</h2>
      <DataTable 
        value={reportLocation === "Prado"
          ? south?.nonAlmondCroix
          : north?.nonAlmondCroix
        }
        size="small"
        responsiveLayout="scroll"
      >
        <Column header="Product" field="setoutKey" />
        <Column header="Qty"
          body={rowData => DrilldownCellTemplate({
            dialogHeader: `${rowData.setoutKey} Orders to be Set Out`, 
            cellValue: rowData.total, 
            tableData: rowData.orders, 
            products
          })}
        />
        <Column header="Pans" field="pans" />
        <Column header="+" field="remainder" />
      </DataTable>

      <h2>Pastry Prep</h2>
      <DataTable 
        value={reportLocation === "Prado"
          ? south?.otherPastries
          : north?.otherPastries
        }
        size="small"
        responsiveLayout="scroll"
      >
        <Column header="Product" field="rowKey" />
        <Column header="Qty"
          body={rowData => DrilldownCellTemplate({
            dialogHeader: `${rowData.rowKey} Orders to be Set Out`, 
            cellValue: rowData.total, 
            tableData: rowData.orders, 
            products
          })}
        />
      </DataTable>

      {reportLocation === "Prado" && <>
        <h2>Almonds</h2>
        <DataTable 
          value={south?.almondCroix} 
          size="small"
          responsiveLayout="scroll"  
        >
          <Column header="Put Where" field="rowKey" />
          <Column header="Qty"
            body={rowData => DrilldownCellTemplate({
              dialogHeader: `Almond orders for ${rowData.rowKey}`, 
              cellValue: rowData.total, 
              tableData: rowData.orders, 
              products
            })}
          />
        </DataTable>
      </>}

      <ConfirmDialog />
    </div>
  )
}

export { SetoutByLocation }
// export const BPBSSetout = () => <SetoutByLocation reportLocation="Prado" />
// export const BPBNSetout = () => <SetoutByLocation reportLocation="Carlton" />