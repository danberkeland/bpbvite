import React from "react"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { useSpecialPacking } from "./useSpecialPackingData"
import { useWindowSize } from "../../utils/useWindowSize"
import { DT } from "../../utils/dateTimeFns"
import { formatHours } from "../../utils/dateAndTime/formatHours"

const PivotTableTemplate = ({ pivotData, windowWidth }) => pivotData.length
  ? <DataTable value={pivotData ?? []} size="small" responsiveLayout="scroll">
      {windowWidth > 800 && [
        <Column key={0} header='Driver' field='rowProps.driver'                            style={{ width: "7rem"}} />,
        <Column key={1} header='Route'  field='rowProps.routeNick'                         style={{ width: "7rem"}} />,
        <Column key={2} header='Start'  body={row => formatHours(row.rowProps.routeStart)} style={{ width: "4.5rem"}}/>,
      ]}
      <Column header='Location' field='rowProps.locNick' style={{ width: "7rem"}} />
      {Object.keys(pivotData?.[0]?.colProps ?? {}).map((field, idx) => (
        <Column key={idx} header={field} field={`colProps.${field}.value`} />
      ))}
    </DataTable>
  : <p>(No items to report)</p>

const PageSpecialPacking = () => {
  const { width } = useWindowSize()
  const reportDT = DT.today()
  const { R0Pretzel, R1Pretzel, R1French, R0Frozen, R1Frozen } = 
    useSpecialPacking({ reportDT, shouldFetch: true })

  return (
    <div style={{ maxWidth: "65rem", padding: "2rem 5rem 5rem 5rem", margin: "auto" }}>
      <h1>BPBS Special Packing {reportDT.toFormat('MM/dd/yyyy')}</h1>
      <p>Note: tables are not meant to display each customer's entire order.</p>
    
      <h2>Pretzel Items for Today</h2>
      <PivotTableTemplate pivotData={R0Pretzel} windowWidth={width} />

      <h2>Pretzel Items for Tomrrow</h2>
      <PivotTableTemplate pivotData={R1Pretzel} windowWidth={width} />

      <h2>Other Items for Tomorrow</h2>
      <p>Items that aren't shelved by default (ficelles, dutch sticks, etc.)</p>
      <PivotTableTemplate pivotData={R1French} windowWidth={width} />

      <h2>Frozen Pastries for Today</h2>
      <PivotTableTemplate pivotData={R0Frozen} windowWidth={width} />

      <h2>Frozen Pastries for Tomorrow</h2>
      <p>Warning: Order counts may change between now and tomorrow's delivery.</p>
      <PivotTableTemplate pivotData={R1Frozen} windowWidth={width} />
    </div>
  )
}

export { PageSpecialPacking as default }