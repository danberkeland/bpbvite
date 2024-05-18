import { useEffect, useState } from "react"
import { DT } from "../../utils/dateTimeFns"
import { useWhatToMake } from "./useBPBSWhatToMakeData"
import { DrilldownCellTemplate } from "./ComponentDrilldownCellTemplate"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { InputNumber } from "primereact/inputnumber"
import { confirmDialog } from "primereact/confirmdialog"
import { exportWhatToMake } from "./exportBPBSWhatToMake"
import { useCheckForUpdates } from "../../core/checkForUpdates"

/**
 * @param {Object} props
 * @param {'today'|'tomorrow'} props.reportDay
 */
const PageBPBSWhatToMake = ({ reportDay='today' }) => {

  const checkForUpdatesCompleted = useCheckForUpdates()

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
    submitProducts,
    updateProductCache,
  } = useWhatToMake({ reportDT, shouldFetch: checkForUpdatesCompleted })
  const isAllLoaded = !!freshData && !!shelfData && !!freezerData && pretzelData && frenchPocketData

  // console.log("freshData", freshData)
  // console.log("shelfData", shelfData)
  // console.log("freezerData", freezerData)
  // console.log("pretzelData", pretzelData)
  // console.log("frenchPocketData", frenchPocketData)

  const [surplus, setSurplus] = useState([])
  useEffect(() => {
    if (!!frenchPocketData) {
      setSurplus(frenchPocketData.map(row => row.surplusEa))
    }
  }, [frenchPocketData])
  const setSurplusAtIdx = (newValue, idx) => 
    setSurplus(Object.assign([...surplus], { [idx]: newValue })) // because arrays are objects lol

  const exportPdf = () => exportWhatToMake({
    reportDT,
    isToday,
    frenchPocketData,
    freshData,
    shelfData,
    pretzelData,
    freezerData,
  })

  const pocketInputTemplate = (row, options) => {
    const qtyChanged = 1
      && !!frenchPocketData?.[options.rowIndex]
      && surplus[options.rowIndex] !== frenchPocketData[options.rowIndex].surplusEa

    return (
      <InputNumber 
        value={surplus[options.rowIndex]}
        onFocus={e => e.target.select()}
        onChange={e => setSurplusAtIdx(e.value, options.rowIndex)}
        onKeyDown={e => {
          if (e.code === "Enter") e.currentTarget.blur()
        }}
        onBlur={async () => {
          if (!frenchPocketData) return

          const { preshaped, surplusEa } = frenchPocketData[options.rowIndex]
          const newSurplus = surplus[options.rowIndex] ?? 0
          setSurplusAtIdx(newSurplus, options.rowIndex)

          const submitItem = {
            prodNick: row.prodNick,
            preshaped: preshaped - surplusEa + newSurplus
          }
          console.log("submitItem:", submitItem)
          updateProductCache( 
            await submitProducts({ updateInputs: [submitItem] })
          )
        }}
        disabled={!isToday}
        inputStyle={{
          width: "4rem",
          fontWeight: qtyChanged ? "bold" : undefined,
          background: qtyChanged ? "#FFECB3" : undefined
        }}
      />
    )
  }
    
  

  return (
    <div style={{ padding: "2rem 5rem 5rem 5rem", width: "50rem", margin: "auto" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h1 style={{display: "inline-block", marginTop: "0"}}>BPBS What to Make<br/>{reportDT.toFormat('MM/dd/yyyy')}{!isToday ? ' (Backup)' : ''}</h1>
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

      <Button 
        label="Print What to Make List" 
        icon="pi pi-print" 
        onClick={exportPdf}
        disabled={!isAllLoaded}
        style={{ marginBottom: "1rem" }} 
      />

      <h2 onClick={() => console.log(frenchPocketData)}>Pocket Count</h2>
      <DataTable 
        value={frenchPocketData ?? []}
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
          body={rowData => DrilldownCellTemplate({
            dialogHeader: 'Bake & Deliver Today',
            cellValue: rowData.neededEa,
            tableData: rowData.neededItems,
            products,
          })}  
        />
        <Column header="Short(-)/Surplus(+)"
          body={(row, options) => pocketInputTemplate(row, options)}
        />
      </DataTable>

      <h2 onClick={() => console.log(freshData)}>Make Fresh</h2>
      <FreshTable 
        value={freshData ?? []}
        className={isToday ? '' : 'not-today'}
        products={products}
      />

      <h2 onClick={() => console.log(shelfData)}>Make For Shelf</h2>
      <ShelfFreezerTable 
        value={shelfData ?? []}
        className={isToday ? '' : 'not-today'}
        products={products}
      />
      
      <h2 onClick={() => console.log(freezerData)}>Make For Freezer</h2>
      <ShelfFreezerTable 
        value={freezerData ?? []}
        className={isToday ? '' : 'not-today'}
        products={products}
      />

      <h2 onClick={() => console.log(freezerData)}>Pretzels</h2>
      <PretzelTable 
        value={pretzelData ?? []}
        className={isToday ? '' : 'not-today'}
        products={products}
      />
    </div>
  )

}

export { PageBPBSWhatToMake as default }


const FreshTable = ({ value, className, products }) =>
  <DataTable 
    value={value} 
    size="small"
    responsiveLayout="scroll"   
    style={{marginBottom: "2rem"}}
    className={className}
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
        dialogHeader: 'Pick up Carlton/AM North Orders',
        cellValue: rowData.earlyEa,
        tableData: rowData.earlyItems,
        products,
      }))}  
    />
    <Column header="Bag EOD" 
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

const PretzelTable = ({ value, className, products }) =>
  <DataTable
    value={value}
    size="small"
    responsiveLayout="scroll"   
    style={{marginBottom: "2rem"}}
    className={className}
  >
    <Column header="Product" field="rowKey" />

    <Column header="Shape for Tomorrow"
      body={rowData => DrilldownCellTemplate({
        dialogHeader: 'Deliveries',
        cellValue: rowData.shapeEa,
        tableData: rowData.shapeItems,
        products,
      })}  
    />
    <Column header="Bag EOD"
      body={rowData => DrilldownCellTemplate({
        dialogHeader: 'Today & Tomorrow Orders',
        cellValue: rowData.bagEa,
        tableData: rowData.bagItems,
        products,
      })}  
    />
    <Column header="Make Total"
      body={rowData => DrilldownCellTemplate({
        dialogHeader: 'Deliveries',
        cellValue: rowData.bakeEa,
        tableData: rowData.bakeItems,
        products,
      })}  
    />
  </DataTable>


const ShelfFreezerTable = ({ value, className, products }) =>
  <DataTable
    value={value}
    size="small"
    responsiveLayout="scroll"   
    style={{marginBottom: "2rem"}}
    className={className}
    // className={isToday ? '' : 'not-today'}
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
    {/* <Column header="Need Early"
      body={rowData => DrilldownCellTemplate({
        dialogHeader: 'Today & Tomorrow Orders',
        cellValue: rowData.earlyEa,
        tableData: rowData.earlyItems,
        products,
      })}  
    /> */}
    <Column header="Need Today" field="needTodayEa" />
    <Column header="Make Total" field="totalEa"
      body={rowData => DrilldownCellTemplate({
        dialogHeader: <div>Today & tomorrow orders - <br />EOD qtys subtract if applicable</div>,
        dialogFooter: <div style={{fontWeight: "bold"}}>EOD count (Ea): {rowData.currentStockEa ?? 0}</div>,
        cellValue: rowData.totalEa,
        tableData: rowData.totalItems,
        products,
      })}  
    />
  </DataTable>
