import { DataTable } from "primereact/datatable"
import { DT } from "../../utils/dateTimeFns"
import { useCroissantProduction } from "./useCroissantShapingData"
import { Column } from "primereact/column"
import { DrilldownCellTemplate } from "./ComponentDrilldownCellTemplate"
import { useEffect, useRef, useState } from "react"
import { Button } from "primereact/button"
import { InputNumber } from "primereact/inputnumber"
import { useCheckForUpdates } from "../../core/checkForUpdates"
import { exportCroissantProduction } from "./exportCroissantProduction"
import { sumBy } from "../../utils/collectionFns"
import { round } from "lodash"

/** @type {React.CSSProperties} */
const greenCellStyle = {
  fontWeight: "bold", 
  color: "rgba(0,0,0,.7)",
  background: "lightgreen", 
  padding: ".38rem", 
  border: "solid 1px green", 
  borderRadius: "3px",
}

/** @type {React.CSSProperties} */
const redCellStyle = {
  fontWeight: "bold", 
  color: "rgba(0,0,0,.7)",
  background: "lightcoral", 
  padding: ".38rem", 
  border: "solid 1px firebrick", 
  borderRadius: "3px",
}

/** @type {React.CSSProperties} */
const grayCellStyle = {
  fontWeight: "bold", 
  color: "rgba(0,0,0,.7)",
  background: "lightgray", 
  padding: ".38rem", 
  border: "solid 1px dimgray", 
  borderRadius: "3px",
}

export const PageCroissantProduction = () => {
  const reportDT = DT.today()

  const checkForUpdatesCompleted = useCheckForUpdates()
  const { 
    croixData, 
    almondData, 
    products, 
    submitProducts,
    updateProductCache,
    isValidating,
  } = useCroissantProduction({ reportDT, shouldFetch: checkForUpdatesCompleted})

  // 'cum' := consumption as cumulative total; 
  // 'sum' := consumption as daily sum/total
  const [displayMode, setDisplayMode] = useState('cum') 

  const [isEditingCroix, setIsEditingCroix] = useState(false)
  const [sheetMakes,     setSheetMakes]     = useState([])
  const toggleEditCroix = () => setIsEditingCroix(!isEditingCroix)
  const setSheetMakeAtIdx = (newValue, idx) => {
    console.log(newValue)
    setSheetMakes(Object.assign([...sheetMakes], { [idx]: newValue }))
  }
  const submitSheetMakes = async () => {
    if (!croixData) return
    const updateInputs = sheetMakes
      .map((_, idx) => ({
        prodNick: croixData[idx].prodNick,
        sheetMake: sheetMakes[idx],
        freezerClosing: sheetMakes[idx] * croixData[idx].batchSize + croixData[idx].R0Cum,
      }))
      .filter((item, idx) => item.sheetMake !== croixData[idx].sheetMake)

    console.log("updateInputs", updateInputs)
    updateProductCache(await submitProducts({ updateInputs }))
    toggleEditCroix()
  }

  const [isEditingAlmond, setIsEditingAlmond] = useState(false)
  const [almondPrepQtys,  setAlmondPrepQtys]  = useState([])
  const toggleEditAlmond = () => setIsEditingAlmond(!isEditingAlmond)
  const setAlmondPrepQtyAtIdx = (newValue, idx) =>
    setAlmondPrepQtys(Object.assign([...almondPrepQtys], { [idx]: newValue }))
  const submitAlmondPrepQtys = async () => {
    if (!almondData) return
    const updateInputs = almondPrepQtys
      .map((_, idx) => ({
        prodNick: almondData[idx].prodNick,
        sheetMake: almondPrepQtys[idx],
        freezerClosing: almondPrepQtys[idx] * almondData[idx].batchSize + almondData[idx].R0Cum,
      }))
      .filter((item, idx) => item.sheetMake !== almondData[idx].sheetMake)

    console.log("updateInputs", updateInputs)
    updateProductCache(await submitProducts({ updateInputs }))
    toggleEditAlmond()
  }
  useEffect(() => {
    if (!!croixData && !!almondData) {
      setSheetMakes(croixData.map(row => row.sheetMake))
      setAlmondPrepQtys(almondData.map(row => row.sheetMake))
    }
  }, [croixData, almondData])

  const colHeaders = [
    displayMode === 'cum' 
      ? 'Closing Count' 
      : <div>Today</div>,
    <div>{reportDT.plus({ days: 1 }).toFormat('EEE')}<br/>{reportDT.plus({ days: 1 }).toFormat('M/d')}</div>,
    <div>{reportDT.plus({ days: 2 }).toFormat('EEE')}<br/>{reportDT.plus({ days: 2 }).toFormat('M/d')}</div>,
    <div>{reportDT.plus({ days: 3 }).toFormat('EEE')}<br/>{reportDT.plus({ days: 3 }).toFormat('M/d')}</div>,
    <div>{reportDT.plus({ days: 4 }).toFormat('EEE')}<br/>{reportDT.plus({ days: 4 }).toFormat('M/d')}</div>,
  ]

  const sheetInputTemplate = (rowData, idx) => {
    const hasChanged = sheetMakes[idx] !== rowData.sheetMake
    return (
      <InputNumber 
        value={sheetMakes[idx]}
        min={0}
        max={999}
        onFocus={e => e.target.select()}
        onKeyDown={e => {
          if (e.key === 'Escape') setSheetMakeAtIdx(rowData.sheetMake, idx)
        }}
        onChange={e => setSheetMakeAtIdx(Math.min(e.value ?? 0, 99), idx)}
        onBlur={e => {
          if (!e.target.value) setSheetMakeAtIdx(0, idx)
        }}
        readOnly={!isEditingCroix}
        inputStyle={{
          width: "3rem",
          fontWeight: hasChanged ? 'bold' : '',
          marginBlock: "0"
        }}
        
      />
    )
  }

  const almondInputTemplate = (rowData, idx) => {
    const hasChanged = almondPrepQtys[idx] !== rowData.sheetMake
    return (
      <InputNumber 
        value={almondPrepQtys[idx]}
        min={0}
        max={999}
        onFocus={e => e.target.select()}
        onKeyDown={e => {
          if (e.key === 'Escape') setAlmondPrepQtyAtIdx(rowData.sheetMake, idx)
        }}
        onChange={e => setAlmondPrepQtyAtIdx(Math.min(e.value ?? 0, 999), idx)}
        onBlur={e => {
          if (!e.target.value) setAlmondPrepQtyAtIdx(0, idx)
        }}
        readOnly={!isEditingAlmond}
        inputStyle={{
          width: "3rem",
          fontWeight: hasChanged ? 'bold' : '',
          marginBlock: "0"
        }}
        
      />
    )
  }

  return (
    <div style={{padding: "2rem 5rem 5rem 5rem", width: "65rem", margin: "auto"}}>
      <h1>Croissant Production {reportDT.toFormat('MM/dd/yyyy')}</h1>

      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <Button label="Print Shape List" 
          icon="pi pi-print" 
          onClick={() => exportCroissantProduction({ reportDT, croixData })}
          disabled={!croixData}
        />

        <div style={{display: "flex", gap: "1rem"}}>
          <Button label="Inventory Projection" onClick={() => setDisplayMode('cum')} className={displayMode === 'sum' ? 'p-button-outlined' : ''} disabled={!croixData} />
          <Button label="Daily Consumption"    onClick={() => setDisplayMode('sum')} className={displayMode === 'cum' ? 'p-button-outlined' : ''} disabled={!croixData} />
        </div>
      </div>

      <DataTable 
        value={croixData ?? []}
        style={{marginBlock: "2rem"}}
        size="large"
        responsiveLayout="scroll"
      >
        <Column header="Product"       field="prodNick"     />
        <Column header="Opening Count" field="freezerCount" footer={`${displayMode === 'sum' ? 'Δ' : 'Σ'} Sheets:`} style={{width: "7.5rem"}} />
        <Column header="Sheets"  
          body={(row, options) => isEditingCroix 
            ? sheetInputTemplate(row, options.rowIndex)
            : (sheetMakes[options.rowIndex] ?? row.sheetMake)
          }    
          style={{paddingBlock: "0rem"}}
          footer={() => `+ ${sumBy(sheetMakes, x => x)}`}
          footerStyle={{padding: "1rem"}}
        />
        {[0,1,2,3,4].map(relDate => 
          <Column 
            key={relDate} 
            header={colHeaders[relDate]} 
            body={(row, options) => {
              const cumTotal = (sheetMakes[options.rowIndex] ?? row.sheetMake) * row.batchSize + row[`R${relDate}Cum`]
              const sumTotal = row[`R${relDate}Sum`]

              return DrilldownCellTemplate({
                dialogHeader: `Orders consuming ${row.prodNick} stock on ${reportDT.plus({ days: relDate }).toFormat('M/d')}`,
                cellValue: displayMode === 'cum' ? cumTotal : sumTotal,
                cellStyle: displayMode === 'cum' ? (cumTotal >= 0 ? greenCellStyle : redCellStyle) : grayCellStyle,
                tableData: row[`R${relDate}Items`],
                products
              })
            }}
            style={{width: "8rem", paddingBlock: "0rem"}}
            footer={() => displayMode === 'sum' 
              ? round(sumBy(croixData ?? [], row => row[`R${relDate}Sum`] / row.batchSize), 1)
              : round(sumBy((croixData ?? []).map((row, idx) => ((sheetMakes[idx] ?? row.sheetMake) * row.batchSize + row[`R${relDate}Cum`]) / row.batchSize), x => x), 1)
            }
          />
        )}
      </DataTable>

      <Button 
        label={isEditingCroix ? "Cancel Edit" : "Edit Sheets"} onClick={toggleEditCroix} 
        disabled={!croixData || isEditingAlmond}
      />
      {isEditingCroix && <Button 
        label="Submit Changes" 
        style={{marginLeft: "2rem"}}
        disabled={isValidating || !croixData || croixData.every((_, idx) => croixData[idx].sheetMake === sheetMakes[idx])}
        onClick={submitSheetMakes}
      />}

      <h2 style={{marginTop: "4rem"}}>Almonds</h2>
      <p>Closing Count = Total in Freezer at EOD</p>
      <DataTable
        value={almondData ?? []}
        style={{marginBlock: "2rem"}}
        size="large"
        responsiveLayout="scroll"
      >
        <Column header="Product"       field="prodNick" />
        <Column header="Opening Count" field="freezerCount" />
        <Column header="Prepped Today" 
          body={(row, options) => isEditingAlmond 
            ? almondInputTemplate(row, options.rowIndex)
            : (almondPrepQtys[options.rowIndex] ?? row.sheetMake)
          }   
          style={{paddingBlock: "0rem"}}
        />
        {[0,1,2,3,4].map(relDate => 
          <Column 
            key={relDate} 
            header={colHeaders[relDate]} 
            body={(row, options) => {
              const cumTotal = (almondPrepQtys[options.rowIndex] ?? row.sheetMake) * row.batchSize + row[`R${relDate}Cum`]
              const sumTotal = row[`R${relDate}Sum`]

              return DrilldownCellTemplate({
                dialogHeader: `Orders consuming ${row.prodNick} stock on ${reportDT.plus({ days: relDate }).toFormat('M/d')}`,
                cellValue: displayMode === 'cum' ? cumTotal : sumTotal,
                cellStyle: displayMode === 'cum' ? (cumTotal >= 0 ? greenCellStyle : redCellStyle) : grayCellStyle,
                tableData: row[`R${relDate}Items`],
                products
              })
            }}
            style={{width: "8rem", paddingBlock: "0rem"}}
          />
        )}
      </DataTable>
      <Button 
        label={isEditingAlmond ? "Cancel Edit" : "Edit Prepped" }
        onClick={toggleEditAlmond}
        disabled={!almondData || isEditingCroix}  
      />
      {isEditingAlmond && <Button 
        label="Submit Changes" 
        style={{marginLeft: "2rem"}}
        disabled={isValidating || !almondData || almondData.every((_, idx) => almondData[idx].sheetMake === almondPrepQtys[idx])}
        onClick={submitAlmondPrepQtys}
      />}
    </div>
  )
}
