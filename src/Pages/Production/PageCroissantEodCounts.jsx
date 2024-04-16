import { DataTable } from "primereact/datatable"
import { DT } from "../../utils/dateTimeFns"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { useCroissantProduction } from "./useCroissantShapingData"
import { useProducts } from "../../data/product/useProducts"
import { keyBy } from "../../utils/collectionFns"
import { useEffect, useMemo, useState } from "react"
import { InputNumber } from "primereact/inputnumber"

const eodProdNicks = ['ch', 'mb', 'mini', 'pg', 'pl', 'sf']

const useCroissantEodData = ({ reportDT, shouldFetch }) => {
  const { croixData } = useCroissantProduction({ reportDT, shouldFetch: true})
  const { data:PRD, submitMutations, updateLocalData } = useProducts({ shouldFetch })

  const calculateCroissantEod = () => {
    if (!croixData || !PRD) return { data: undefined }

    const products = keyBy(PRD, P => P.prodNick)
    const data = eodProdNicks.map(prodNick => {
      
      const {  freezerNorth, freezerNorthClosing } = products[prodNick]
      const { freezerCount=0, sheetMake=0, batchSize=0, R0Cum=0 } = croixData.find(row => row.prodNick === prodNick) ?? {}

      return {
        prodNick,
        freezerCount,
        freezerClosing: sheetMake * batchSize + R0Cum,
        freezerNorth,
        freezerNorthClosing,
      }
    })

    return { data }
  }
  
  return {
    ...useMemo(calculateCroissantEod, [croixData, PRD]),
    submitProducts: submitMutations,
    updateProductCache: updateLocalData,
  }

}

const PageCroissantEodCounts = () => {
  const reportDT = DT.today()

  const { 
    data:eodData, 
    submitProducts, 
    updateProductCache,
  } = useCroissantEodData({ reportDT, shouldFetch: true })
  const [eodChanges, setEodChanges] = useState()
  useEffect(() => {
    if (!!eodData) setEodChanges(structuredClone(eodData))
  }, [eodData])

  const [editingAttribute, setEditingAttribute] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const submitChanges = async () => {
    if (!eodData || !eodChanges) return
    setIsSubmitting(true)
    const updateInputs = eodChanges.filter((row, idx) => 
      Object.keys(row).some(attribute => eodChanges[idx][attribute] !== eodData[idx][attribute])
    )
    updateProductCache(await submitProducts({ updateInputs }))
    setEditingAttribute('')
    setIsSubmitting(false)
  }

  const ToggleEditButton = ({ attribute }) => editingAttribute === attribute 
    ? <div style={{display: "flex", gap: "1rem"}}>
        <Button icon="pi pi-times" className="p-button-rounded p-button-outlined" 
          onClick={() => {
            setEditingAttribute('')
            setEodChanges(structuredClone(eodData))
          }} 
          disabled={isSubmitting}
        />
        <Button icon="pi pi-send"  className="p-button-rounded" 
          onClick={() => submitChanges()}
          disabled={!eodData || !eodChanges || isSubmitting || eodData.every((row, idx) => row[attribute] === eodChanges[idx][attribute])}
        />
      </div>
    : <Button 
        label="Edit" 
        onClick={() => setEditingAttribute(attribute)} 
        disabled={0
          || !eodData
          || !eodChanges
          || (!!editingAttribute && editingAttribute !== attribute)
        } 
      />

  const countBodyTemplate = ({ attribute, relatedAttribute, idx }) => 
    !!eodData && editingAttribute === attribute
      ? <InputNumber 
          value={eodChanges[idx][attribute]}
          min={0}
          max={9999}
          onChange={e => {
            let newState = structuredClone(eodChanges)
            newState[idx][attribute] = e.value
            newState[idx][relatedAttribute] = eodData[idx][relatedAttribute] + (e.value ?? 0) - eodData[idx][attribute]
            setEodChanges(newState)
          }}
          onBlur={e => {
            if (eodChanges[idx][attribute] === null) {
              let newState = structuredClone(eodChanges)
              newState[idx][attribute] = 0
              newState[idx][relatedAttribute] = eodData[idx][relatedAttribute] - eodData[idx][attribute]
              setEodChanges(newState)
            }
          }}
          inputStyle={{width: "4rem"}}
        />
      : eodChanges[idx][attribute]
  

  return (
    <div style={{padding: "2rem 5rem 5rem 5rem", width:"60rem", margin: "auto"}}>
      <h1>Croissant Freezer Count {reportDT.toFormat('MM/dd/yyyy')}</h1>

      <div style={{display: "flex", justifyContent: "space-between"}}>
        <div>
          <h2>South/Prado</h2>
          <DataTable
            value={eodChanges}
            responsiveLayout="scroll"
            size="large"
          >
            <Column 
              header="Product"
              field="prodNick"
              style={{width: "7rem"}}
            />
            <Column 
              header={<span>Opening <br/>Count</span>} 
              body={(_, options) => countBodyTemplate({ 
                attribute: 'freezerCount',
                relatedAttribute: 'freezerClosing', 
                idx: options.rowIndex, 
              })}
              footer={ToggleEditButton({ attribute: 'freezerCount' })} 
              style={{width: "7rem", padding: "0"}}
              footerStyle={{paddingBlock: "1rem"}}
            />
            <Column 
              header={<span>Closing <br/>Count</span>} 
              body={(_, options) => countBodyTemplate({ 
                attribute: 'freezerClosing', 
                relatedAttribute: 'freezerCount',
                idx: options.rowIndex 
              })}
              footer={ToggleEditButton({ attribute: 'freezerClosing' })}
              style={{width: "7rem", padding: "0"}}
              footerStyle={{paddingBlock: "1rem"}}
            />
          </DataTable>
        </div>
        <div>
          <h2>North/Carlton</h2>
          <DataTable
            value={eodChanges}
            responsiveLayout="scroll"
            size="large"
          >
            <Column 
              header="Product" 
              field="prodNick" 
              style={{width: "7rem"}}
            />
            <Column 
              header={<span>Opening <br/>Count</span>} 
              field="freezerNorth" 
              style={{width: "7rem", padding: "0"}}
            />
            <Column 
              header={<span>Closing <br/>Count</span>} 
              body={(_, options) => countBodyTemplate({ 
                attribute: 'freezerNorthClosing', 
                relatedAttribute: 'freezerNorth',
                idx: options.rowIndex 
              })}
              footer={ToggleEditButton({ attribute: 'freezerNorthClosing' })}
              style={{width: "7rem", padding: "0"}}
              footerStyle={{paddingBlock: "1rem"}}
            />
          </DataTable>
        </div>
      </div>
    </div>
  )
}

export { PageCroissantEodCounts as default }