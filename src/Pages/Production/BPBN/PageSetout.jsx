import { DT } from "../../../utils/dateTimeFns"
import { DrilldownCellTemplate } from "./ComponentDrilldownCellTemplate"
import { useSetoutData } from "./useSetoutData"

import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { useEffect } from "react"
import { useInfoQBAuths } from "../../../data/infoQBAuths/useInfoQBAuths"

/**
 * 
 * @param {Object} props
 * @param {'Prado' | 'Carlton'} props.reportLocation 
 * @returns 
 */
export const Setout = ({ reportLocation }) => {
  const reportDT = DT.today()

  const { north, south, products } = useSetoutData({ reportDT })
  const { croix, other, almond } = reportLocation === 'Prado' ? north : south

  const INQB = useInfoQBAuths({ shouldFetch: true })

  const setoutRecord = INQB.data?.find(item => 
    item.id = reportDT.toFormat('yyyy-MM-dd') + reportLocation + 'setoutTime'
  )
  

  useEffect(() => {
    confirmDialog({
      message: "Click YES to confirm these setout numbers will be used.",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      //accept: () => recordSetoutTime({ reportDate: todayISO, reportLocation}),
    })
  }, [])

  return (
    <div>
      <h1>{reportLocation} Pastry Prep {reportDT.toFormat('M/d/yyyy')}</h1>

      <h2>Set Out</h2>
      <DataTable 
        value={croix}
        size="small"
        responsiveLayout="scroll"
      >
        <Column header="Product" field="setoutKey" />
        <Column 
          header="Qty"
          body={row => DrilldownCellTemplate({
            dialogHeader: `${row.setoutKey} Orders to be Set Out`, 
            cellValue: row.total, 
            tableData: row.orders, 
            products
          })}
        />
        <Column header="Pans" field="pans" />
        <Column header="+" field="remainder" />
      </DataTable>

      <h2>Pastry Prep</h2>
      <DataTable 
        value={other}
        size="small"
        responsiveLayout="scroll"
      >
        <Column header="Product" field="rowKey" />
        <Column 
          header="Qty"
          body={row => DrilldownCellTemplate({
            dialogHeader: `${row.rowKey} Orders to be Set Out`, 
            cellValue: row.total, 
            tableData: row.orders, 
            products
          })}
        />
      </DataTable>

      {reportLocation === "Prado" && <>
        <h2>Almonds</h2>
        <DataTable 
          value={almond} 
          size="small"
          responsiveLayout="scroll"  
        >
          <Column header="Put Where" field="rowKey" />
          <Column 
            header="Qty"
            body={row => DrilldownCellTemplate({
              dialogHeader: `Almond orders for ${row.rowKey}`, 
              cellValue: row.total, 
              tableData: row.orders, 
              products
            })}
          />
        </DataTable>
      </>}
      
      <ConfirmDialog />
    </div>

  )
}