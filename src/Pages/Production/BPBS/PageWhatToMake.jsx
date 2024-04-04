import { useEffect, useState } from "react"
import { DT } from "../../../utils/dateTimeFns"
import { useWhatToMake } from "./useWhatToMake"
import { DrilldownCellTemplate } from "../ComponentDrilldownCellTemplate"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"

/**
 * @param {Object} props
 * @param {'today'|'tomorrow'} props.reportDay
 */
const WhatToMake = ({ reportDay='today' }) => {

  const todayDT = DT.today()
  const [reportDT, setReportDT] = useState(
    todayDT.plus({ days: (reportDay === 'today' ? 0 : 1) })
  )
  const isToday = reportDT.toMillis() === todayDT.toMillis()
  const setToToday    = () => setReportDT(todayDT)
  const setToTomorrow = () => setReportDT(todayDT.plus({ days: 1 }))

  const { 
    freshData,
    shelfData,
    freezerData,
    pretzelData,
    frenchPocketData,
    products={},
  } = useWhatToMake({ reportDT })

  const [surplus, setSurplus] = useState([])
  const setSurplusAtIdx = (newValue, idx) => {
    let newState = [...surplus]
    newState[idx] = newValue
    setSurplus(newState)
  }

  // useEffect(() => {
  //   if (!!frenchPocketData) {
  //     setSurplus(frenchPocketData.map(row => row.surplusEa))
  //   }
  // }, [frenchPocketData])

  console.log("freezerData", freezerData) //.map(row => row.totalItems.map(order => order.meta.routeNick)))
  console.log("shelfData", shelfData) //.map(row => row.totalItems.map(order => order.meta.routeNick)))
  

  return (
    <div style={{ padding: "2rem 5rem 5rem 5rem", width: "52rem", margin: "auto" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <h1 style={{display: "inline-block"}}>BPBS What to Make {reportDT.toFormat('M/d/yyyy')}</h1>
        <div style={{display: "flex", gap: "1rem"}}>
          <Button 
            label="Today"    
            onClick={setToToday} 
            className={isToday ? '' : 'p-button-outlined'} 
          /> 
          <Button 
            label="Tomorrow" 
            onClick={setToTomorrow} 
            className={isToday ? 'p-button-outlined' : ''} 
          />
        </div>
      </div>
      

      <h2 onClick={() => console.log(frenchPocketData)}>Pocket Count</h2>
      <DataTable 
        value={(frenchPocketData ?? [])}
        responsiveLayout="scroll"   
        style={{marginBottom: "2rem"}}
        className={isToday ? '' : 'not-today'}
      >
        <Column header="Pocket Size" 
          field="weight" 
        />
        <Column header="Available" 
          // field="preshaped" 
          body={(row, options) => isToday
            ? row.neededEa + (surplus?.[options.rowIndex] ?? row.surplusEa)
            : row.prepreshaped
          } 
        />
        <Column header="Need Today" 
          field="neededEa"
          // body={rowData => DrilldownCellTemplate({
          //   dialogHeader: 'Bake & Deliver Today',
          //   cellValue: rowData.neededEa,
          //   tableData: rowData.neededItems,
          //   products,
          // })}  
        />
        <Column header="Short(-)/Surplus(+)" field="surplusEa" 
          //body={pocketInputTemplate}
        />
      </DataTable>

      <h2 onClick={() => console.log(freshData)}>Make Fresh</h2>
      <DataTable 
        value={freshData ?? []} 
        size="small"
        responsiveLayout="scroll"   
        style={{marginBottom: "2rem"}}
        className={isToday ? '' : 'not-today'}
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
        value={shelfData ?? []} 
        size="small"
        responsiveLayout="scroll"   
        style={{marginBottom: "2rem"}}
        className={isToday ? '' : 'not-today'}
      >
        <Column header="Product" field="rowKey" />
        <Column header="Total Deliv" field="delivEa"
          body={rowData => DrilldownCellTemplate({
            dialogHeader: 'Deliveries',
            cellValue: rowData.delivEa,
            tableData: rowData.delivItems,
            products,
          })}  
        />
        <Column header="Need Early" field="needTodayEa" />
        <Column header="Make Total" field="totalEa"
          body={rowData => DrilldownCellTemplate({
            dialogHeader: 'Today & Tomorrow Orders',
            cellValue: rowData.totalEa,
            tableData: rowData.totalItems,
            products,
          })}  
        />
      </DataTable>

      <h2 onClick={() => console.log(freezerData)}>Pretzels</h2>
      <DataTable
        value={(pretzelData ?? []).filter(row => 0
          || ['ptz', 'pzb', 'unpz'].includes(row.productRep.prodNick)
          || row.bakeEa  !== 0
          || row.shapeEa !== 0
          || row.bagEa   !== 0
        )}
        size="small"
        responsiveLayout="scroll"   
        style={{marginBottom: "2rem"}}
        className={isToday ? '' : 'not-today'}
      >
        <Column header="Product" field="rowKey" />
        <Column header="Bake Today"
          body={rowData => DrilldownCellTemplate({
            dialogHeader: 'Deliveries',
            cellValue: rowData.bakeEa,
            tableData: rowData.bakeItems,
            products,
          })}  
        />
        <Column header="Shape for Tomorrow"
          body={rowData => DrilldownCellTemplate({
            dialogHeader: 'Deliveries',
            cellValue: rowData.shapeEa,
            tableData: rowData.shapeItems,
            products,
          })}  
        />
        <Column header="Make Total"
          body={rowData => DrilldownCellTemplate({
            dialogHeader: 'Today & Tomorrow Orders',
            cellValue: rowData.bagEa,
            tableData: rowData.bagItems,
            products,
          })}  
        />
      </DataTable>


      <h2 onClick={() => console.log(freezerData)}>Make For Freezer</h2>
      <DataTable
        value={(freezerData ?? [])}
        size="small"
        responsiveLayout="scroll"   
        style={{marginBottom: "2rem"}}
        className={isToday ? '' : 'not-today'}
      >
        <Column header="Product" field="rowKey" />
        <Column header="Total Deliv" field="delivEa"
          // body={rowData => DrilldownCellTemplate({
          //   dialogHeader: 'Deliveries',
          //   cellValue: rowData.delivEa,
          //   tableData: rowData.delivItems,
          //   products,
          // })}  
        />
        <Column header="Need Early" field="needTodayEa" />
        <Column header="Make Total" field="totalEa"
          // body={rowData => DrilldownCellTemplate({
          //   dialogHeader: 'Today & Tomorrow Orders',
          //   cellValue: rowData.totalEa,
          //   tableData: rowData.totalItems,
          //   products,
          // })}  
        />
      </DataTable>

    </div>
  )

}

export { WhatToMake as default }