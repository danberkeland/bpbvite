import { useT0T7Data } from "./data"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputNumber } from "primereact/inputnumber"
import { useEffect, useState } from "react"
import { Button } from "primereact/button"
import { useListData } from "../../../../data/_listData"
import { printCroixShapeList } from "./exportPdf"
import { sortBy, sumBy } from "lodash"
import { DateTime } from "luxon"
import { Dialog } from "primereact/dialog"

// For counting croix we introduce a new naming convention: countNick.
// countNicks are a subset of prodNicks. Products are assigned the same
// countNick if they come from the same type of shaped croissant. These
// equivalence classes help us figure out how to group orders together
// for tallying.
//
// Example: products with prodNicks 'mb', 'frmb', 'unmb' would all be assigned 
// the countNick 'mb'.

const todayDT = DateTime.now()
  .setZone('America/Los_Angeles')
  .startOf('day')
  
const today = todayDT.toFormat('MM/dd/yyyy')
const relDateToDate = relDate => todayDT.plus({ days: relDate }).toFormat('MM/dd/yyyy')
const relDateToWeekday = relDate => todayDT.plus({ days: relDate }).toFormat('EEE')

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

  const CumTotalTemplate = ({ rowData, daysAhead }) => {
    const [showDialog, setShowDialog] = useState(false)
    const { countNick, freezerCount, batchSize, C } = rowData
    const value = freezerCount 
      + (sheetMake[countNick] * batchSize) 
      + C[daysAhead].totalQty

    const tableData = sortBy(
      rowData.T[daysAhead].items.filter(item => item.qty !== 0),
      ['delivDate', 'prodNick', 'locNick']
    )

    return(<>    
      <div 
        style={{
          fontWeight: 'bold',
          textAlign: 'center',
          background: value >= 0
            ? 'rgb(128, 243, 159)'
            : 'rgb(209, 144, 146)',
          width: '3.75rem',
          padding: '.25rem',
          border: 'solid 1px var(--bpb-text-color)',
          borderRadius: '6px',
          
        }}
        onClick={() => setShowDialog(true)}
      >
        {value}
      </div>

      <Dialog 
        visible={showDialog} 
        onHide={() => setShowDialog(false)}
        header={<>
          <div>Orders Consuming {countNick}</div>
          <div>On {relDateToWeekday(daysAhead)}, {todayDT.plus({ days: daysAhead}).toFormat('M/dd')} (T +{daysAhead})</div>
        </>}
      >
        <DataTable value={tableData} 
          size="small"
          //responsiveLayout="scroll"
          scrollable
          scrollHeight="35rem"
          style={{width: "40rem"}}
        >
          <Column header="delivDate" field="delivDate" />
          {/* <Column header="delivDate" field="routeMeta.routeNick" /> */}
          <Column header="location" body={row => row.locNick.split('__')[0]} />
          <Column header="product" field="prodNick" />
          <Column header="qty" field="qty" 
            footer={() => `Σ = ${sumBy(tableData, 'qty')}`} 
            style={{maxWidth: "4.5rem"}}
          />
          <Column header="retail?" 
            body={row => !row.isWhole ? 'true' : ''} 
            style={{maxWidth: "4rem"}}  
          />
          <Column header="holding?" 
            body={row => row.isStand === false ? 'true' : ''} 
            style={{maxWidth: "5rem"}}  
          />
        </DataTable>
      </Dialog>
    </>)
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
    <h1 style={{marginLeft: "1rem"}}>Croissant Production {today}</h1>
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
        footer={`Σ = ${sumBy(Object.values(sheetMake))}`}
      />
      <Column header={<><div>Closing </div><div>Freezer</div></>} 
        body={rowData => CumTotalTemplate({ rowData, daysAhead: 0})} 
        style={{ color: 'var(--bpb-text-color'}}  
      />
      <Column header="TOM" 
        body={rowData => CumTotalTemplate({ rowData, daysAhead: 1})} 
        style={{ color: 'var(--bpb-text-color'}}
      />
      <Column header="2DAY" 
        body={rowData => CumTotalTemplate({ rowData, daysAhead: 2})} 
        style={{ color: 'var(--bpb-text-color'}}  
      />
      <Column header="3DAY" 
        body={rowData => CumTotalTemplate({ rowData, daysAhead: 3})} 
        style={{ color: 'var(--bpb-text-color'}}
      />
      <Column header="4DAY" 
        body={rowData => CumTotalTemplate({ rowData, daysAhead: 4})} 
        style={{ color: 'var(--bpb-text-color'}}
      />

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