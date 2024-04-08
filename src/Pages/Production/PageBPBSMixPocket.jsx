import { Button } from "primereact/button"
import { DT } from "../../utils/dateTimeFns"
import { useMixPocketData } from "./useBPBSMixPocketData"
import { InputText } from "primereact/inputtext"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { DrilldownCellTemplate } from "./ComponentDrilldownCellTemplate"
import { useEffect, useState } from "react"
import { InputNumber } from "primereact/inputnumber"
import { debounce } from "lodash"
import { printBucketStickers } from "./exportBucketStickers"
import { sumBy } from "../../utils/collectionFns"

const panCountByWeight = {
  "0.25": 48,
  "0.35": 35,
  "1.2" : 16,
}

/** @type {React.CSSProperties} */
const printButtonStyle = { 
  width: "100%",
  height: "100%",
  borderRadius: "1rem", 
  fontSize: "1.1rem", 
  background: "rgb(89, 155, 49)", 
  border: "solid 1px rgb(78, 135, 43)" 
}

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

const MixPocket = () => {
  const reportDT = DT.today()

  const {
    frenchMixItem,
    doughComponents,
    frenchPocketDataT0,
    frenchPocketData,
    products,
    submitDough,
    updateDoughCache,
  } = useMixPocketData({ reportDT, shouldFetch: true })
  console.log("INFO:")
  console.log("frenchMixItem", frenchMixItem)
  console.log("frenchPocketData", frenchPocketData)

  const [shortage, setShortage] = useState()
  const [oldDough, setOldDough] = useState()
  const [buffer,   setBuffer]   = useState()
  const [carryQty, setCarryQty] = useState([])
  const [earlyQty, setEarlyQty] = useState([])
  const setCarryQtyAtIdx = (newValue, idx) => setCarryQty(
    Object.assign([...carryQty], { [idx]: newValue })
  )
  const setEarlyQtyAtIdx = (newValue, idx) => setEarlyQty(
    Object.assign([...earlyQty], { [idx]: newValue })
  )

  useEffect(() => {
    if (!!frenchMixItem && !!frenchPocketDataT0) {
      // setShortage(sumBy(frenchPocketDataT0, row => row.underEa * row.weight))
      setOldDough(frenchMixItem.oldDough)
      setBuffer(frenchMixItem.buffer)
      setCarryQty(frenchPocketDataT0.map(item => item.surplusEa))
    }
  }, [frenchMixItem])

  const totalMixWeight = (0 
    + (frenchMixItem?.needed ?? 0) 
    + (Number(buffer) ?? 0) 
    + (Number(shortage) ?? 0)
    - sumBy((frenchPocketDataT0 ?? []).map((row, idx) => row.weight * carryQty[idx]), x => x)
  ).toFixed(2)
  const tableInputTemplate = ({ value, setValue }) => {
    return <InputNumber 
      value={value}
      min={-9999}
      max={9999}
      onFocus={e => e.target.select()}
      onValueChange={e => setValue(e.value)}
      inputStyle={{width: "4rem"}}
    />
  }

  return (
    <div style={{maxWidth: "50rem", padding: "2rem 5rem 5rem 5rem", margin: "auto"}}>
      <h1>BPBS French Mix/Pocket</h1>
  
      <div style={{marginBlock: "1rem"}}>

        <h2>Adjust Mix Total</h2>
        <div style={{
          marginBottom: "2rem", 
          background: "var(--bpb-orange-vibrant-200)", 
          padding: "1rem 1rem 1rem 1rem", 
          borderRadius: ".5rem",
        }}>
          
          <div style={{padding: ".5rem"}}>
            <InputLabel htmlFor="shortage"  text="Short Today:">
              <InputText id="shortage" 
                value={shortage ?? ''}
                inputMode="numeric"
                onFocus={e => e.target.select()}
                onChange={e => {
                  if (/^-?\d{0,4}$|^-?\d{0,4}\.\d{0,2}$/.test(e.target.value)) {
                    setShortage(e.target.value)
                  }
                }}
                onKeyDown={e => {
                  if (e.code === "Enter") e.currentTarget.blur()
                  if (e.code === "Escape") e.currentTarget.blur()
                }}
                style={{ maxWidth: "7rem", borderRight: "none" }}
                disabled={!frenchMixItem}
              />
            </InputLabel>

            <InputLabel htmlFor="old-dough" text="Old BULK Dough (to be thrown in mix):">
              <InputText id="old-dough" 
                value={oldDough ?? ''}
                inputMode="numeric"
                onFocus={e => e.target.select()}
                onChange={e => {
                  if (/^-?\d{0,4}$|^-?\d{0,4}\.\d{0,2}$/.test(e.target.value)) {
                    setOldDough(e.target.value)
                    debouncedUpdateDough(
                      { id: frenchMixItem?.id, oldDough: Number(e.target.value ?? 0) },
                      frenchMixItem?.oldDough,
                      e.target,
                      submitDough, 
                      updateDoughCache,
                    )
                  }
                }}
                onKeyDown={e => {
                  if (e.code === "Enter") e.currentTarget.blur()
                  if (e.code === "Escape") {
                    setOldDough(frenchMixItem?.oldDough)
                    debouncedUpdateDough.cancel()
                    e.currentTarget.blur()
                  }
                }}
                onBlur={() => debouncedUpdateDough.flush()}
                style={{width: "7rem"}}
                disabled={!frenchMixItem}
              />
            </InputLabel>

            <InputLabel htmlFor="buffer" text="Buffer Dough:">
              <InputText id="buffer" 
                value={buffer ?? ''}
                inputMode="numeric"
                onFocus={e => e.target.select()}
                onChange={e => {
                  if (/^-?\d{0,4}$|^-?\d{0,4}\.\d{0,2}$/.test(e.target.value)) {
                    setBuffer(e.target.value)
                    debouncedUpdateDough(
                      { id: frenchMixItem?.id, buffer: Number(e.target.value ?? 0) },
                      frenchMixItem?.buffer,
                      e.target,
                      submitDough, 
                      updateDoughCache,
                    )
                  }
                }}
                onKeyDown={e => {
                  if (e.code === "Enter") e.currentTarget.blur()
                  if (e.code === "Escape") {
                    setBuffer(frenchMixItem?.buffer)
                    debouncedUpdateDough.cancel()
                    e.currentTarget.blur()
                  }
                }}
                onBlur={() => debouncedUpdateDough.flush()}
                style={{width: "7rem"}}
                disabled={!frenchMixItem}
              />
            </InputLabel>          
          </div>

          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".5rem", color: "var(--bpb-text-color)", fontWeight: "bold"}}>
            <div>Need For Tomorrow:</div> <div>{frenchMixItem?.needed ?? 0} lb.</div>
          </div>

          <div style={{padding: ".5rem", textAlign: "right", fontSize: "1.5rem", color: "var(--bpb-text-color)", fontWeight: "bold"}}>
            TOTAL: {totalMixWeight} lb.
          </div>
        </div>

        <h2>Print Stickers</h2>
        <div style={{
          marginBottom: "2rem", 
          background: "var(--bpb-orange-vibrant-200)", 
          padding: "1rem 1rem 1rem 1rem", 
          borderRadius: ".5rem",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "7rem 2rem 2rem", 
            columnGap: "1rem", 
            rowGap: ".5rem",
            margin: ".5rem"
          }}>
            {[1,2,3,4,5,6,7,8,9].map(nMixes => (
              <Button 
                label={`${nMixes}x Mix`}
                key={`${nMixes}-mix-button`}
                style={printButtonStyle}
                onClick={() => {
                  if (!!doughComponents) {
                    printBucketStickers(
                      frenchMixItem,
                      totalMixWeight,
                      frenchMixItem?.oldDough ?? 0,
                      doughComponents,
                      {
                        dateString: reportDT.toFormat('MM/dd/yyyy'),
                        splitNumber: nMixes
                      }
                    )
                  }
                }}
                disabled={!doughComponents}
              />
            ))}
          </div>
        </div>

      </div>

      <h2>Adjust Pockets</h2>
      <DataTable
        value={frenchPocketData ?? []}
      >
        <Column field="weight"    header="Pocket Size" />
        <Column field="preshaped" header="Available Today" />
        <Column header="Surplus (+/-)" 
          body={(_, options) => tableInputTemplate({
            value: carryQty[options.rowIndex],
            setValue: newValue => setCarryQtyAtIdx(newValue, options.rowIndex),
          })}
        />
        {/* <Column header="Early/Extra" 
          body={(_, options) => tableInputTemplate({
            value: earlyQty[options.rowIndex],
            setValue: newValue => setEarlyQtyAtIdx(newValue, options.rowIndex),
          })}
        /> */}
        <Column header="Prep For Tomorrow" // header="Pocket Today" 
          field="neededEa" 
          body={(row, options) => 0
            + row.neededEa 
            - (carryQty[options.rowIndex] ?? 0)
            // + (earlyQty[options.rowIndex] ?? 0)
          }
          bodyStyle={{fontWeight: "bold"}}
          // body={rowData => DrilldownCellTemplate({
          //   dialogHeader: 'Bake & Deliver Today',
          //   cellValue: rowData.neededEa,
          //   tableData: rowData.neededItems,
          //   products,
          // })}  
        />
        <Column header="Pan Count" 
          body={row => {
            const panCount = panCountByWeight[row.weight]
            const pans = Math.floor(row.neededEa / panCount)
            const remainder = row.neededEa % panCount
            return `(${panCount}/pan) ${pans} +${remainder}`
          }}
          style={{width: "9.5rem"}}
        />
      </DataTable>


    </div>
  )

}

export { MixPocket as default }


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

