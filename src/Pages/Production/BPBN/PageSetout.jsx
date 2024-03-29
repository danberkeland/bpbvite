import { DT } from "../../../utils/dateTimeFns"
import { DrilldownCellTemplate } from "./ComponentDrilldownCellTemplate"
import { useSetoutData } from "./useSetoutData"

import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { useEffect } from "react"
import { useInfoQBAuths } from "../../../data/infoQBAuths/useInfoQBAuths"
import { DateTime } from "luxon"
import { exportSetout } from "./exportSetout"

/** @type {React.CSSProperties} */
const greenChipStyle = {
  width: "fit-content",
  marginTop: ".5rem",
  padding: ".2rem 1rem .2rem 1rem",
  borderRadius: "1rem",
  color: "var(--bpb-text-color)",
  background: "#9af79d",
  boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2),"
    +" 0 1px 1px 0 rgba(0, 0, 0, 0.14), "
    +"0 1px 3px 0 rgba(0, 0, 0, 0.12)",
  textAlign: "center"
}
/** @type {React.CSSProperties} */
const grayChipStyle = {
  width: "fit-content",
  marginTop: ".5rem",
  padding: ".2rem 1rem .2rem 1rem",
  borderRadius: "1rem",
  color: "var(--bpb-text-color)",
  background: "rgba(220, 220, 220, 0.5)",
  boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2),"
    +" 0 1px 1px 0 rgba(0, 0, 0, 0.14), "
    +"0 1px 3px 0 rgba(0, 0, 0, 0.12)",
  textAlign: "center"
}
// /** @type {React.CSSProperties} */
// const yellowChipStyle = {
//   width: "fit-content",
//   marginTop: ".5rem",
//   padding: ".2rem 1rem .2rem 1rem",
//   background: "#FFECB3",
//   border: "solid #d9a300",
//   borderRadius: "1rem",
//   borderWidth: "0px",
//   color: "var(--bpb-text-color)",
//   boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2),"
//     +" 0 1px 1px 0 rgba(0, 0, 0, 0.14), "
//     +"0 1px 3px 0 rgba(0, 0, 0, 0.12)",
//   textAlign: "center"
// }

/**
 * @param {Object} props
 * @param {'Prado' | 'Carlton'} props.reportLocation 
 */
const Setout = ({ reportLocation }) => {
  const reportDT = DT.today()

  const { croix=[], other=[], almond=[], products={} } = useSetoutData({ reportDT })

  const INQB = useInfoQBAuths({ shouldFetch: true })

  const setoutRecord = INQB.data?.find(item => 
    item.id = reportDT.toFormat('yyyy-MM-dd') + reportLocation + 'setoutTime'
  )
  // const afterSetoutOrders = !setoutRecord 
  //   ? []
  //   : [...croix, ...other, ...almond].flatMap(row =>
  //     row.orders.filter(order => order.qtyUpdatedOn > setoutRecord.updatedAt)  
  //   )  

  useEffect(() => {
    confirmDialog({
      message: "Click YES to confirm these setout numbers will be used.",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      //accept: () => recordSetoutTime({ reportDate: todayISO, reportLocation}),
    })
  }, [])

  return (
    <div style={{padding: "2rem 5rem 5rem 5rem", width: "50rem", margin: "auto" }}>
      <h1>{reportLocation} Pastry Prep {reportDT.toFormat('M/d/yyyy')}</h1>

      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <Button 
          label="Print Carlton Setout List" 
          onClick={() => exportSetout({
            reportLocation,
            reportDT,
            croix,
            other,
            almond
          })}  
        />
        {!!setoutRecord 
          ? <div style={greenChipStyle}>Setout recorded at {DT.fromIsoTs(setoutRecord.updatedAt).toLocaleString(DateTime.TIME_SIMPLE)}</div>
          : <div style={grayChipStyle}>Setout not yet recorded for today</div>
        }
      </div>
      {/* {!!afterSetoutOrders.length && <div style={yellowChipStyle}>After-setout changes detected</div>} */}

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

export { Setout as default }