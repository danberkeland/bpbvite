import { useT0T7Data } from "./data"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputNumber } from "primereact/inputnumber"
import { useEffect, useState } from "react"
import { Button } from "primereact/button"
import { useListData } from "../../../../data/_listData"
import { printCroixShapeList } from "./printPDF"

// For counting croix we introduce a new naming convention: countNick.
// countNicks are a subset of prodNicks. Products are assigned the same
// countNick if they come from the same type of shaped croissant. These
// equivalence classes help us figure out how to group orders together
// for tallying.
//
// Example: products with prodNicks 'mb', 'frmb', 'unmb' would all be assigned 
// the countNick 'mb'.

export const CroixToMake = () => {
  const productCache = useListData({ tableName: "Product", shouldFetch: true })
  const { data:tableRows } = useT0T7Data({ 
    shouldFetch: true, includeHolding: false 
  })
  console.log('tableRows:', tableRows)
  
  // sheetMake state is a dict with keys= prodNicks, values= sheetMake-numbers
  const [sheetMake, setSheetMake] = useState({}) 
  const [isEditing, setisEditing] = useState(false)
  
  useEffect(() => {
    if (!!tableRows) {
      setSheetMake(Object.fromEntries(
        tableRows.map(row => [row.countNick, row.sheetMake]) 
      ))
    }
  },[tableRows])

  if (!tableRows) return <div>Loading...</div>

  const sheetInputTemplate = (rowData) => {
    const sheetQty = sheetMake[rowData.countNick]
    const baseValue = rowData.sheetMake
    const hasChanged = sheetQty !== baseValue

    if (isEditing) return (
      <InputNumber 
        value={sheetQty}
        min={0}
        max={99}
        onFocus={e => e.target.select()}
        onKeyDown={e => {
          if (e.key === 'Escape') setSheetMake({ 
            ...sheetMake, [rowData.countNick]: baseValue
          })
        }}
        onChange={e => setSheetMake({ 
          ...sheetMake, [rowData.countNick]: Math.min(e.value, 99) 
        })}
        onBlur={e => {
          if (!sheetQty) {
            setSheetMake({ ...sheetMake, [rowData.countNick]: 0 })
          }
        }}
        readOnly={!isEditing}
        inputStyle={{
          width: "3rem",
          padding: '.25rem',
          fontWeight: hasChanged ? 'bold' : '',
        }}
        
      />
    )

    return <div style={{textAlign: 'center'}}>
      {sheetQty}
    </div>
  }

  const cumTotalTemplate = (rowData, daysAhead) => {
    const { countNick, freezerCount, batchSize, C } = rowData
    const value = freezerCount + (sheetMake[countNick] * batchSize) + C[daysAhead].totalQty
    return <div style={{
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'var(--bpb-text-color)',
      background: value >= 0
        ? 'rgb(128, 243, 159)'
        : 'rgb(209, 144, 146)',
      width: '3.75rem',
      padding: '.25rem',
      border: 'solid 1px var(--bpb-text-color)',
      borderRadius: '6px',
    }}>
      {value}
    </div>
  }

  const submitSheets = async () => {

    const updateInputs = tableRows
      .filter(row => row.sheetMake !== sheetMake[row.countNick])
      .map(row => {
        const { countNick, freezerCount, batchSize, C } = row
        const eodCount = freezerCount 
          + (sheetMake[countNick] * batchSize) 
          + C[0].totalQty
      
        return {
          prodNick: countNick,
          sheetMake: sheetMake[countNick],
          freezerClosing: eodCount,  
        }
      })

    console.log('updateItems', updateInputs)

    productCache.updateLocalData(
      await productCache.submitMutations({ updateInputs })
    )
    setisEditing(false)
  }

  const sheetMakeHasChanges = tableRows.some(row => 
    row.sheetMake !== sheetMake[row.countNick]
  )

  return(<div>
    <Button label="Print Croix Shape List" 
      onClick={() => printCroixShapeList(tableRows)}
      disabled={isEditing}
      style={{margin: '1rem'}}
    />
    
    <DataTable
      value={tableRows}
      responsiveLayout="scroll"
      // size={"small"}
      style={{ maxWidth: "55rem", padding: '1rem' }}
    >
      <Column header="Product" 
        field="countNick" 
        style={{ color: 'var(--bpb-text-color'}}  
      /> 
      <Column header={<><div>Opening </div><div>Freezer</div></>} 
        field="freezerCount" 
        style={{ color: 'var(--bpb-text-color'}}  
      />
      <Column header="Sheets" 
        body={sheetInputTemplate} 
        style={{ color: 'var(--bpb-text-color'}}  
      />
      <Column header={<><div>Closing </div><div>Freezer</div></>} body={rowData => cumTotalTemplate(rowData, 0)} />
      <Column header="TOM" body={rowData => cumTotalTemplate(rowData, 1)} />
      <Column header="2DAY" body={rowData => cumTotalTemplate(rowData, 2)} />
      <Column header="3DAY" body={rowData => cumTotalTemplate(rowData, 3)} />
      <Column header="4DAY" body={rowData => cumTotalTemplate(rowData, 4)} />

      {/* <Column header="T0" field="T.0.totalQty" /> */}
      {/* <Column header="T1" field="T.1.totalQty" /> */}
      {/* <Column header="T2" field="T.2.totalQty" /> */}
      {/* <Column header="T3" field="T.3.totalQty" /> */}
      {/* <Column header="T4" field="T.4.totalQty" /> */}
    </DataTable>

    <Button label={isEditing ? "Cancel Edit" : "Edit Sheets"}
      onClick={() => {
        setisEditing(!isEditing)
        setSheetMake(Object.fromEntries(
          tableRows.map(row => [row.countNick, row.sheetMake]) 
        ))
      }}
      style={{margin: '1rem'}}
    />

    {isEditing && 
      <Button label="Submit Changes" 
        disabled={!sheetMakeHasChanges}
        onClick={submitSheets}
        style={{margin: '1rem'}}
      />
    }
  </div>)

}