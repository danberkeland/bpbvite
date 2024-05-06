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

const PageBPBSMixPocket = () => {
  const reportDT = DT.today()

  const {
    frenchMixItem,
    doughComponents,
    frenchPocketDataR0,
    frenchPocketDataR1,
    products,
    submitDoughs,
    updateDoughCache,
    submitProducts,
    updateProductCache
  } = useMixPocketData({ reportDT, shouldFetch: true })

  const [shortage, setShortage] = useState()
  const [oldDough, setOldDough] = useState()
  const [buffer,   setBuffer]   = useState()
  const [surplusQtys, setSurplusQtys] = useState([])
  const setSurplusQtyAtIdx = (newValue, idx) => setSurplusQtys(
    Object.assign([...surplusQtys], { [idx]: newValue })
  )

  useEffect(() => {
    if (!!frenchMixItem && !!frenchPocketDataR0) {
      setShortage(0)
      setOldDough(frenchMixItem.oldDough)
      setBuffer(frenchMixItem.buffer)
      setSurplusQtys(frenchPocketDataR0.map(item => item.surplusEa))
    }
  }, [frenchMixItem])

  const totalMixWeight = 0 
    + (frenchMixItem?.needed ?? 0) 
    + Number(buffer ?? 0)
    + Number(shortage ?? 0)
    - sumBy((frenchPocketDataR0 ?? []).map((row, idx) => row.weight * surplusQtys[idx]), x => x)

              // value: surplusQtys[options.rowIndex],
            // setValue: newValue => setSurplusQtyAtIdx(newValue, options.rowIndex),
  const surplusInputTemplate = ({ index }) => {
    return <InputNumber 
      value={surplusQtys[index]}
      min={-9999}
      max={9999}
      onFocus={e => e.target.select()}
      onValueChange={e => {
        if (!frenchPocketDataR0) return 

        const diff = (e.value ?? 0) - frenchPocketDataR0[index].surplusEa
        console.log("diff", diff)
        console.log("old preshape", frenchPocketDataR0[index].preshaped)
        console.log("new preshape", frenchPocketDataR0[index].preshaped + diff)

        setSurplusQtyAtIdx(e.value, index)

        
      }}
      inputStyle={{width: "4rem"}}
    />
  }

  const pocketInputTemplate = ({ index }) => {
    const qtyChanged = 1
      && !!frenchPocketDataR0?.[index]
      && surplusQtys[index] !== frenchPocketDataR0[index].surplusEa

    return (
      <InputNumber 
        value={surplusQtys[index]}
        onFocus={e => e.target.select()}
        onValueChange={e => setSurplusQtyAtIdx(e.value, index)}
        onKeyDown={e => { if (e.code === "Enter") e.currentTarget.blur() }}
        // onBlur={async () => {
        //   if (!frenchPocketDataR0) return

        //   const { preshaped, surplusEa, prodNick } = frenchPocketDataR0[index]
        //   const newSurplus = surplusQtys[index] ?? 0
        //   setSurplusQtyAtIdx(newSurplus, index)

        //   const submitItem = {
        //     prodNick,
        //     preshaped: preshaped - surplusEa + newSurplus
        //   }
        //   console.log("submitItem:", submitItem)
        //   // updateProductCache( 
        //   //   await submitProducts({ updateInputs: [submitItem] })
        //   // )
        // }}
        inputStyle={{
          width: "4rem",
          fontWeight: qtyChanged ? "bold" : undefined,
          background: qtyChanged ? "#FFECB3" : undefined
        }}
      />
    )
  }

  return (
    <div style={{maxWidth: "50rem", padding: "2rem 5rem 5rem 5rem", margin: "auto"}}>
      <h1>BPBS French Mix/Pocket</h1>
      <p>Using v2 <a href="/Production/BPBSMixPocket">Go to previous version</a></p>
      <div style={{marginBlock: "1rem"}}>

        <h2>Adjust Mix Total</h2>
        <div style={{
          marginBottom: "2rem", 
          background: "var(--bpb-orange-vibrant-200)", 
          padding: "1rem 1rem 1rem 1rem", 
          borderRadius: ".25rem",
        }}>
          
          <div style={{padding: ".5rem"}}>
            {/* <InputLabel htmlFor="shortage"  text="Short Today:">
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
            </InputLabel> */}

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
                      submitDoughs, 
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
                      submitDoughs, 
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
            <div>Need For Tomorrow:</div> <div>{(frenchMixItem?.needed ?? 0).toFixed(2)} lb.</div>
          </div>

          <div style={{padding: ".5rem", textAlign: "right", fontSize: "1.5rem", color: "var(--bpb-text-color)", fontWeight: "bold"}}>
            TOTAL: {totalMixWeight.toFixed(2)} lb.
          </div>
        </div>
      </div>

      <h2>Adjust Pockets</h2>
      <DataTable
        value={frenchPocketDataR1 ?? []}
        style={{marginBottom: "2rem"}}
      >
        <Column field="weight"    header="Pocket Size" />
        <Column field="preshaped" header="Available Today" />
        <Column header="Need for Tomorrow" field="neededEa" />
        <Column header="Surplus Today (+/-)" 
          body={(_, options) => pocketInputTemplate({
            index: options.rowIndex
            // value: surplusQtys[options.rowIndex],
            // setValue: newValue => setSurplusQtyAtIdx(newValue, options.rowIndex),
          })}
        />
        
        <Column header="Prep For Tomorrow" // header="Pocket Today" 
          body={(row, options) => 0
            + row.neededEa 
            - (surplusQtys[options.rowIndex] ?? 0)
          }
          bodyStyle={{fontWeight: "bold"}}
        />
        <Column header="Pan Count" field="pansText"
          // body={row => {
          //   const panCount = panCountByWeight[row.weight]
          //   const pans = Math.floor(row.neededEa / panCount)
          //   const remainder = row.neededEa % panCount
          //   return `(${panCount}/pan) ${pans} +${remainder}`
          // }}
          style={{width: "9.5rem"}}
        />
      </DataTable>

      <h2>Print Stickers</h2>
        <div style={{
          marginBottom: "2rem", 
          background: "var(--bpb-orange-vibrant-200)", 
          padding: "1rem 1rem 1rem 1rem", 
          borderRadius: ".5rem",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gridTemplateRows: "6rem", 
            columnGap: "1rem", 
            rowGap: ".5rem",
            margin: ".5rem"
          }}>
            {[1,2,3,4].map(nMixes => (
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
                        splitNumber: nMixes,
                        pocketLines: (frenchPocketDataR1 ?? []).map(row => row.stickerPansText)
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
  )

}

export { PageBPBSMixPocket as default }


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

