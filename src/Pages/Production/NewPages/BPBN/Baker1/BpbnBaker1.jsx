import React, { useState } from "react"
import { DateTime } from "luxon"

import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Button } from "primereact/button"
import { Divider } from "primereact/divider"

import { useBpbn1Data } from "../data/data"
import { useDoobieStuff } from "./data/doobieStuff"
import { useBaguetteData } from "./data/baguetteData"

import { DrilldownCellTemplate } from "../_components/DrilldownCellTemplate"
import { useListData } from "../../../../../data/_listData"
import { keyBy } from "lodash/fp"
import { DoughInputs } from "./DoughInputs"

import "./bpbnBaker1.css"
import { useExportBpbn1 } from "./useExport"
import { getTodayDT, isoToDT } from "../utils"
import { useCheckForUpdates } from "../../../../../core/checkForUpdates"

// const SKIP_DATES = ['12-24']
// const adjustDateTime = (dt) => SKIP_DATES.includes(dt.toFormat('MM-dd'))
//   ? dt.plus({ days: 1 })
//   : dt

/**
 * @param {Object} input
 * @param {'today'|'tomorrow'} [input.initialDateOption='today'] 
 */
const Bpbn1 = ({ initialDateOption='today' }) => {
  const [dateOption, setDateOption] = 
      useState(/**@type {('today'|'tomorrow')}*/(initialDateOption))
  
  const shouldFetch = true
  // const _todayDT = isoToDT('2023-12-23')
  
  const _todayDT = getTodayDT()
  const _reportDateDT = dateOption === 'today'
    ? _todayDT
    : _todayDT.plus({ days: 1 })

  const todayDT = _todayDT //adjustDateTime(_todayDT)
  const reportDateDT = _reportDateDT //adjustDateTime(_reportDateDT)

  const today = todayDT.toFormat('yyyy-MM-dd')
  const reportDate = reportDateDT.toFormat('yyyy-MM-dd')

  // console.log('today', today)

  const { rusticData, otherPrepData } = useBpbn1Data({
    currentDate: today,
    reportDate,
    shouldShowZeroes: false,
    shouldFetch,
  })

  // console.log("other prep data", otherPrepData)

  const doobieStuff = useDoobieStuff({ reportDate })

  const { data:baguetteData } = useBaguetteData({ 
    currentDate: today,
    reportDate, 
    shouldFetch 
  })
  const { 
    doughSummary, 
    mixes, 
    bins, 
    pans, 
    buckets, 
    bakeTomorrowOrders
  } = baguetteData ?? {}

  console.log("Bake Tomorrow Orders:", bakeTomorrowOrders)

  
  const { data:PRD } = useListData({ tableName: "Product", shouldFetch })
  const products = keyBy('prodNick')(PRD ?? [])

  useCheckForUpdates()

  const exportBpbn1 = useExportBpbn1({ reportDate, shouldFetch })
  
  const DateOptionButtons = () => {
    return (
      <div style={{
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        gap: "2rem",
      }}>
        <Button label="Today" 
          onClick={() => setDateOption('today')} 
          className={dateOption === 'today' ? '' : "p-button-outlined"}
        />
        <Button label="Tomorrow" 
          onClick={() => setDateOption('tomorrow')} 
          className={dateOption === 'tomorrow' ? '' : "p-button-outlined"}
        />
      </div>
    )
  } 

  const BaguetteTableTemplate = ({ value, col1Header }) => {
    return (
      <DataTable 
        value={value} 
        size="small" 
        responsiveLayout="scroll"  
        style={{marginBottom: "1rem"}}
        className={dateOption === 'tomorrow' ? 'not-today' : ''}
      >
        <Column header={col1Header} field='label' />
        <Column header="Amount" field='amount' />
      </DataTable>
    )
  }

  

  return (
    <div className="bpbn1-page-body" style={{
      maxWidth: "50rem", 
      margin: "auto", 
      paddingTop: "2.5rem",
      padding: "3rem 5rem",
    }}>

      <div style={{
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
      }}>
        <h1>What To Bake {reportDateDT.toFormat('MM/dd/yyyy')}</h1>
        <DateOptionButtons />
      </div>

      <Button label="Print AM Bake List" 
        icon="pi pi-print"
        style={{marginBottom: "1rem"}} 
        // onClick={handleExport}
        onClick={exportBpbn1}
        //disabled={true}
      />

      <DataTable 
        value={rusticData ?? []}
        size="small" 
        responsiveLayout="scroll"   
        style={{marginBottom: "5rem"}}
        className={dateOption === 'tomorrow' ? 'not-today' : ''}
      >
        <Column header="Product" field="forBake" />
        {/* <Column header="Qty" field="qty" /> */}
        <Column header="Qty" 
          body={rowData => DrilldownCellTemplate({ 
            dialogHeader: `${rowData.forBake} Orders to be Baked`,
            cellValue: rowData.qty, 
            tableData: rowData.items,
            products,
          })} 
          style={{width: "6rem"}}
        />
        <Column header="Shaped" field="shaped" />
        <Column header="Short" field="short" />
        <Column header={<span>Needed<br/>Early</span>}
          body={rowData => DrilldownCellTemplate({ 
            dialogHeader: `Early ${rowData.forBake} Orders`,
            cellValue: rowData.qtyNeededEarly, 
            tableData: rowData.itemsNeededEarly,
            products,
          })} 
          style={{width: "6rem"}}
          className={dateOption === 'tomorrow' ? 'not-today' : ''}
        />
      </DataTable>

      <h1>What To Prep</h1>

      <DataTable
        value={doobieStuff ?? []}
        size="small"
        responsiveLayout="scroll"  
        style={{marginBottom: "1rem"}}
        className={dateOption === 'tomorrow' ? 'not-today' : ''}
      >
        <Column header="Prod" field="Prod" />
        <Column header="Bucket" field="Bucket" />
        <Column header="Mix" field="Mix" />
        <Column header="Bake" field="Bake" />
      </DataTable>

      <DataTable
        value={otherPrepData ?? []}
        size="small"
        responsiveLayout="scroll"  
        style={{marginBottom: "5rem"}}
        className={dateOption === 'tomorrow' ? 'not-today' : ''}
      >
        <Column header="Product" field="prodName" />
        <Column header="Qty" 
          body={rowData => DrilldownCellTemplate({ 
            dialogHeader: <span style={{marginRight: "1rem"}}>
              {rowData.prodName} Orders to be Baked
            </span>,
            cellValue: rowData.qty, 
            tableData: rowData.items,
            products,
          })} 
          style={{width: "6rem"}}
        />
      </DataTable>

      <h1>BPBN Baguette Mix</h1>

      <div style={{
        display:"flex", 
        //justifyContent: "space-between",
        gap: "2rem",
        color: "var(--bpb-text-color)",
        background: "var(--bpb-surface-content)",
        padding: "1.75rem 1rem 1rem 1rem",
        borderRadius: "3px"
      }}>
        <DoughInputs />
        <div>
          <div>Needed: {doughSummary?.T1Needed}</div>
          <div>+ Buffer: {doughSummary?.buffer}</div>
          <div>+ Short: {doughSummary?.T0Short}</div>
          <Divider type="solid" />
          <h2>TOTAL: {doughSummary?.stickerTotal}</h2>
        </div>
      </div>

      
      {(mixes ?? []).map((mixItem, idx) => {
        return (
          <div key={`mix-${idx}`}>
            <h2>Baguette Mix #{idx+1}</h2>
            <BaguetteTableTemplate 
              value={mixItem.components} 
              col1Header="Ingredient"
            />
          </div>
        )
      })}

      <h2>Bins</h2>
      <BaguetteTableTemplate value={bins} col1Header="Product" />

      <h2>Pocket Pans</h2>
      <BaguetteTableTemplate value={pans} col1Header="Pan" />

      <h2>Bucket Sets</h2>
      <BaguetteTableTemplate value={buckets} col1Header="Sets" />

    </div>
  )
}

// const Bpbn1Backup = () => Bpbn1({ initialDateOption: 'tomorrow'})

export { Bpbn1 as default }