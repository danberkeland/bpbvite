import React, { useEffect, useMemo } from "react"
import { DataTable } from "primereact/datatable"
import { DT } from "../../utils/dateTimeFns"

import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { InputText } from "primereact/inputtext"

import { useState } from "react"
import { Dialog } from "primereact/dialog"
import { sumBy } from "../../utils/collectionFns"
import { DrilldownCellTemplate } from "./ComponentDrilldownCellTemplate"

import { useBucketsData } from "./useBucketsData"
import { printBucketStickers } from "./exportBucketStickers"
import { debounce, round } from "lodash"
import { useDoughs } from "../../data/dough/useDoughs"
import { useCheckForUpdates } from "../../core/checkForUpdates"
import { printBaguette65Stickers } from "./exportBPBSBaguette65Stickers"

/** @type {React.CSSProperties} */
const printButtonStyle = { 
  borderRadius: "1rem", 
  fontSize: "1.1rem", 
  background: "rgb(89, 155, 49)", 
  border: "solid 1px rgb(78, 135, 43)" 
}

const setAtIdx = (state, setState) => {
  return (newValue, idx) => {
    let newState = [...state]
    newState[idx] = newValue
    setState(newState)
  }
}

const fixDoughName = doughName => doughName === "Ciabatta" ? "Focaccia" : doughName

/** 
 * Avoid the need to wrap with useCallback by passing everything the function
 * needs as an argument so that it can be extracted from the React component.
 */
const debouncedUpdateDough = debounce(
  async (
    updateItem, 
    baseItem, 
    eventTarget, 
    submitMutations, 
    updateLocalData,
  ) => {

    if (Object.keys(updateItem).some(key => baseItem[key] !== updateItem[key])) {
      const response = await submitMutations({ updateInputs: [updateItem] })
      console.log("response", response)
      updateLocalData(response)
      eventTarget.blur()
    }

  },
  5000
)

/**
 * 
 * @param {Object} props
 * @param {'Carlton'|'Prado'} props.mixedWhere 
 */
const Buckets = ({ mixedWhere }) => {

  const checkForUpdatesCompleted = useCheckForUpdates()

  const reportDT = useMemo(() => DT.today(), [])

  const { submitMutations, updateLocalData } = useDoughs({ shouldFetch: true })
  const { doughList, products={}, doughComponents:DCP=[] } = 
    useBucketsData({ reportDT, shouldFetch: checkForUpdatesCompleted, mixedWhere })

  const [showTable,      setShowTable]      = useState([])
  const [oldDoughValues, setOldDoughValues] = useState([])
  const [bufferValues,   setBufferValues]   = useState([])
  const setShowTableAtIdx      = setAtIdx(showTable,      setShowTable)
  const setOldDoughValuesAtIdx = setAtIdx(oldDoughValues, setOldDoughValues)
  const setBufferValuesAtIdx   = setAtIdx(bufferValues,   setBufferValues)

  useEffect(() => {
    if (!!doughList) {
      setOldDoughValues(doughList.map(row => row.oldDough))
      setBufferValues(doughList.map(row => row.buffer))
    }
  }, [doughList])
  
  return (
    <div style={{width: "60rem", margin:"auto", padding: "2rem 5rem 5rem 5rem"}}>

      <h1>{mixedWhere} Dough Stickers</h1>
      {!doughList && <h2>Loading...</h2>}
      {(doughList ?? []).map((row, idx) => 
        <div 
          key={row.doughName} 
          style={{
            marginBlock: "1rem", 
            background: "var(--bpb-orange-vibrant-200)", 
            padding: "0rem 1rem 1rem 1rem", 
            borderRadius: ".5rem"
          }}
        >
          <div style={{
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            color: "var(--bpb-text-color)" 
          }}>
            <h2 style={{display: "inline"}}>{fixDoughName(row.doughName)}</h2>
            
            <div>
              <span style={{fontSize: "1.5rem", fontWeight: "bold"}}>
                (need {row.needed.toFixed(2)} lb.) TOTAL: {(row.needed + row.buffer).toFixed(2)}
              </span>
              
              <Button 
                icon="pi pi-table" 
                label="Details"
                onClick={() => setShowTableAtIdx(true, idx)} 
                style={{marginLeft: "2rem"}}
              />
            </div>
          </div>
  
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1.75fr 1fr 1fr 0.75fr", 
            columnGap: "1rem", 
            rowGap: "1rem" 
          }}>
            
            <div> 
              <InputLabel htmlFor="old-dough-input" text="Old Dough: ">
                <InputText 
                  id="old-dough-input" 
                  value={oldDoughValues[idx] ?? ''}
                  inputMode="numeric"
                  keyfilter="pnum"
                  onFocus={e => e.target.select()}
                  onChange={e => {
                    if (/^\d{0,4}$|^\d{0,4}\.\d{0,2}$/.test(e.target.value)) {
                      setOldDoughValuesAtIdx(e.target.value, idx)
                      debouncedUpdateDough(
                        { id: row.id, oldDough: Number(e.target.value ?? 0) },
                        row,
                        e.target,
                        submitMutations, 
                        updateLocalData,
                      )
                    }
                  }}
                  onKeyDown={e => {
                    if (e.code === "Enter") e.currentTarget.blur()
                    if (e.code === "Escape") {
                      setOldDoughValuesAtIdx(row.oldDough, idx)
                      debouncedUpdateDough.cancel()
                      e.currentTarget.blur()
                    }
                  }}
                  onBlur={() => debouncedUpdateDough.flush()}
                  style={{ maxWidth: "7rem", borderRight: "none" }} 
                />
              </InputLabel>
  
              <InputLabel htmlFor="buffer-input" text="Buffer Dough: ">
                <InputText 
                  id="buffer-input" 
                  value={bufferValues[idx] ?? ''}
                  inputMode="numeric"
                  keyfilter="pnum"
                  onFocus={e => e.target.select()}
                  onChange={e => {
                    if (/^\d{0,4}$|^\d{0,4}\.\d{0,2}$/.test(e.target.value)) {
                      setBufferValuesAtIdx(e.target.value, idx)
                      debouncedUpdateDough(
                        { id: row.id, buffer: Number(e.target.value ?? 0) },
                        row,
                        e.target,
                        submitMutations, 
                        updateLocalData,
                      )
                    }
                  }} 
                  onKeyDown={e => {
                    if (e.code === "Enter") e.currentTarget.blur()
                    if (e.code === "Escape") {
                      setBufferValuesAtIdx(row.buffer, idx)
                      debouncedUpdateDough.cancel()
                      e.currentTarget.blur()
                    }
                  }}
                  onBlur={() => debouncedUpdateDough.flush()}
                  style={{ maxWidth: "7rem", borderRight: "none" }} 
                />
              </InputLabel>
            </div>
  
            <Button label="Print Today Set"
              onClick={() => printBucketStickers(
                row, 
                row.needed + bufferValues[idx], 
                oldDoughValues[idx], 
                DCP
              )}
              style={printButtonStyle}
            />
            <Button label="Print Default Set"
              onClick={() => printBucketStickers(row, row.batchSize, 0, DCP)}
              style={printButtonStyle}         
            /> 
            <Button label="Half Batch"
              onClick={() => printBucketStickers(
                row, 
                round((row.needed + bufferValues[idx]) / 2, 2), 
                oldDoughValues[idx], 
                DCP
              )}
              style={printButtonStyle}      
            /> 
            
          </div>


  
          <Dialog
            visible={showTable[idx]}
            onHide={() => setShowTableAtIdx(false, idx)}
            header={`${row.doughName} Dough - Prep for Baking Today +${row.targetRelDate}`}
            headerStyle={{gap: "1rem"}}
          >
            <DataTable 
              value={row.summary}
              responsiveLayout="scroll"
            >
              <Column header="forBake" field="forBake" footer="Total:" />
              <Column header="Needed (lb.)" 
                body={r => DrilldownCellTemplate({
                  dialogHeader: `${r.forBake} Orders to be Baked Today +${row.targetRelDate}`,
                  cellValue: (r.neededEa * r.weight).toFixed(1),
                  tableData: r.items,
                  products
                })}
                footer={options => sumBy(options.props.value ?? [], row => row.neededEa * row.weight).toFixed(2)}  
              />
  
            </DataTable>
          </Dialog>
        </div>
      )}

      {mixedWhere === 'Prado' && 
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBlock: "1rem", 
          background: "var(--bpb-orange-vibrant-200)", 
          padding: "1rem", 
          borderRadius: ".5rem"
        }}>
          <h2 style={{ display: "inline-block" }}>Baguette (65 lb. - 54 baguettes)</h2>
          <Button label="Print 65 lb. Set" onClick={printBaguette65Stickers} style={printButtonStyle} />
        </div>
      }
    </div>
  )
}

export { Buckets as default }


/** Custom component just for templating/formatting */
const InputLabel = ({ text, htmlFor, children }) => 
  <div style={{ 
    width: "100%", 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBlock: ".5rem" 
  }}>
    <label htmlFor={htmlFor} style={{fontWeight: "bold", color: "var(--bpb-text-color)" }}>{text}</label>
    <div className="p-inputgroup" style={{width: "fit-content"}}>
      {children}
      <span className="p-inputgroup-addon">lb.</span>
    </div>
  </div>

