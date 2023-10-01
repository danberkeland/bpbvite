import useSWR from 'swr'
import gqlFetcher from "../../../../data/_fetchers"
import { getProduct } from "../../../../data/swr2.x.x/gqlQueries/queries"

import { useListData } from "../../../../data/_listData"
import { cloneDeep, isEqual, keyBy, sortBy } from 'lodash'
import { useEffect, useMemo, useState } from 'react'

import { DataTable } from "primereact/datatable"
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import { DateTime } from 'luxon'


const countProdNicks = ['ch', 'mb', 'mini', 'pg', 'pl', 'sf']
const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
const today = todayDT.toFormat('MM/dd/yyyy')

const footerStyle = {
  height: "81px", 
  background: "var(--bpb-surface-content-header)"
}

const useCroixProductData = () => {

  const { 
    data:PRD,
    submitMutations,
    updateLocalData, 
  } = useListData({ tableName: "Product", shouldFetch: true })

  const composeData = () => {

    if (!PRD) return  undefined 

    const croixProducts = PRD.filter(P => 
      countProdNicks.includes(P.prodNick)
    ).map((P, idx) => ({
      //index: idx,
      prodNick: P.prodNick,
      freezerCount: P.freezerCount,
      freezerClosing: P.freezerClosing,
      freezerNorth: P.freezerNorth,
      freezerNorthClosing: P.freezerNorthClosing,
    }))
    
    return keyBy(croixProducts, 'prodNick')
  }

  return { 
    data: useMemo(composeData, [PRD]),
    submitMutations,
    updateLocalData
  }

}


export const CroixCount = () => {
  const { 
    data:countData, 
    submitMutations, 
    updateLocalData 
  } = useCroixProductData()

  const [editMode, setEditMode] = useState('none')
  const [counts, setCounts] = useState()


  const resetCounts = () => setCounts(cloneDeep(countData))

  useEffect(() => {if (!!countData) resetCounts()}, [countData])

  // console.log(countData)
  // console.log(counts)

  if (!countData || !counts) return <div>Loading...</div>



  const countHeaderTemplate = ({ attribute, headerText }) => {

    return <span style={{
      display: "flex", alignItems: "center"
    }}>
      {headerText}
      {editMode !== attribute
        ? <EditButton 
            onClick={() => setEditMode(attribute)}
            disabled={editMode !== 'none' && editMode !== attribute} 
          />
        : <CancelButton 
            onClick={() => {
              setEditMode('none')
              resetCounts()
            }} 
          />
      }
    </span>
  }

  const countColumnTemplate = ({ rowData, attribute, syncAtt }) => {
    const { prodNick } = rowData

    const countValue = counts?.[prodNick][attribute]
    const baseValue = countData[prodNick][attribute]
    const baseSyncValue = countData[prodNick][syncAtt]

    if (editMode !== attribute) return countValue

    const handleChange = (newValue) => {
      //console.log(prodNick, newValue, baseValue, baseSyncValue)
      const newSyncValue = baseSyncValue + newValue - baseValue

      let newCounts = structuredClone(counts)
      newCounts[prodNick][attribute] = newValue
      newCounts[prodNick][syncAtt] = newSyncValue
      setCounts(newCounts)
    }

    return <InputNumber 
      value={countValue}
      max={9999}
      onFocus={e => e.target.select()}
      onChange={e => handleChange(Math.min(e.value, 9999))}
      onKeyDown={e => {
        if (e.key === "Escape") {
          handleChange(baseValue)
          e.target.blur()
        } else if (e.key === "Enter") e.target.blur()
        
      }}
      onBlur={e => {if (countValue === null) handleChange(baseValue)}}
      inputStyle={{width: "4rem"}}
    />
  }

  const countFooterTemplate = ({ attribute }) => {

    if (editMode === attribute) return(
      <Button label="Submit" 
        disabled={isEqual(countData, counts)}
        onClick={async () => {
          updateLocalData( await submitMutations(
            { updateInputs: Object.values(counts) }
          ))
          setEditMode('none')
        }}
      />
    )
  }


  return(<div>
    
    <h1><div>Croissant Freezer Count</div><div>{today}</div></h1>

    <div>
      <div>
        <h2>South Freezer</h2>
        <DataTable 
          value={sortBy(Object.values(countData), 'prodNick')} 
          size="large"
          style={{width: "25rem"}}
        >
          <Column header="Product" 
            field="prodNick"
            bodyStyle={{fontWeight: "bold"}} 
            footerStyle={footerStyle} 
          />
          <Column field="freezerCount" 
            header={() => countHeaderTemplate(
              { attribute: "freezerCount", headerText: "Open" }
            )}
            body={rowData => countColumnTemplate({ 
              rowData, attribute: "freezerCount", syncAtt: "freezerClosing", 
            })}
            bodyStyle={{paddingBlock: "0rem", width: "8.25rem"}}
            footer={rowData => countFooterTemplate(
              { attribute: "freezerCount"}
            )}
            footerStyle={footerStyle}
          />
          <Column field="freezerClosing"
            header={() => countHeaderTemplate(
              { attribute: "freezerClosing", headerText: "Close" }
            )} 
            body={rowData => countColumnTemplate({ 
              rowData, attribute: "freezerClosing", syncAtt: "freezerCount", 
            })}
            bodyStyle={{paddingBlock: "0rem", width: "8.25rem"}}
            footer={rowData => countFooterTemplate(
              { attribute: "freezerClosing"}
            )}
            footerStyle={footerStyle}
          />
        </DataTable>
      </div>

      <div style={{margin: "4rem 0 6rem 0"}}>
        <h2>North Freezer</h2>
        <DataTable 
          value={sortBy(Object.values(countData), 'prodNick')} 
          size="large"
          style={{width: "25rem"}}
        >
          <Column header="Product" 
            field="prodNick" 
            bodyStyle={{fontWeight: "bold"}} 
            footerStyle={footerStyle}
          />
          <Column header="Open"
            body={rowData => counts[rowData.prodNick].freezerNorth}
            bodyStyle={{paddingBlock: "0rem", width: "8.25rem"}}
            //footer={''}
            footerStyle={footerStyle}
          />
          <Column field="freezerNorthClosing"
            header={() => countHeaderTemplate(
              { attribute: "freezerNorthClosing", headerText: "Close" }
            )}
            body={rowData => countColumnTemplate({ 
              rowData, 
              attribute: "freezerNorthClosing", 
              syncAtt: "freezerNorth", 
            })}
            bodyStyle={{paddingBlock: "0rem", width: "8.25rem"}}
            footer={rowData => countFooterTemplate(
              { attribute: "freezerNorthClosing"}
            )}
            footerStyle={footerStyle}
          />
        </DataTable>
      </div>
    </div>
  </div>)
  
}


const EditButton = ({ onClick, disabled }) => <Button 
  icon="pi pi-pencil"
  className="p-button-rounded" 
  style={{marginLeft: ".5rem"}}
  onClick={onClick}
  disabled={disabled}
/>

const CancelButton = ({ onClick }) => <Button 
  icon="pi pi-times" // pi pi-times-circle ?
  className="p-button-rounded" 
  style={{marginLeft: ".5rem"}}
  onClick={onClick}
/>