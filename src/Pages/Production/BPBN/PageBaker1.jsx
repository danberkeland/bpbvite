import React, { useState } from "react"

import { useProducts } from "../../../data/product/useProducts"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { DrilldownCellTemplate } from "../ComponentDrilldownCellTemplate"

import { DT } from "../../../utils/dateTimeFns"
import { keyBy, sumBy } from "../../../utils/collectionFns"

import { Button } from "primereact/button"
import { round } from "lodash"
import { useBaker1Data } from "./useBaker1Data"
import { DoughInputs } from "./ComponentDoughInputs"
import { Dialog } from "primereact/dialog"
import { exportBpbn1Pdf } from "./exportBaker1"
import { useDoughs } from "../../../data/dough/useDoughs"



const Baker1 = () => {
  const todayDT = DT.today()
  const [reportDT, setReportDT] = useState(todayDT)
  const isToday = reportDT.toMillis() === todayDT.toMillis()
  
  const [showBaguetteDialog, setShowBaguetteDialog] = useState(false)

  const {
    rusticData=[],
    doobieStuff=[],
    otherPrepData=[],
    baguetteData=[],
    baguetteSummary=[],
    mixSummary=[],
    bins=[],
    pans=[],
    buckets=[],
    nBucketSetsToMake=null
  } = useBaker1Data({ 
    reportDT,
    calculateFor: isToday ? 'today' : 'tomorrow'
  })
  console.log("early rustics", rusticData.map(row => row.earlyQty))

  const { data: DGH, submitMutations, updateLocalData } = useDoughs({ shouldFetch: true })
  
  const setToToday    = () => setReportDT(todayDT)
  const setToTomorrow = () => setReportDT(todayDT.plus({ days: 1 }))
  const generatePdf   = async () => {
    if (!DGH || !nBucketSetsToMake) {
      console.error('Data not Loaded for export')
      return
    }

    exportBpbn1Pdf({
      rusticData,
      doobieStuff,
      otherPrepData,
      mixes: mixSummary,
      bins,
      pans,
      buckets,
      displayDate: reportDT.toFormat('M/d/yyyy'),
      filename: `BPBN_Baker1_${reportDT.toFormat('yyyy-MM-dd')}.pdf`,
    })

    const updateInput = {
      id: DGH.find(D => D.doughName === 'Baguette')?.id,
      preBucketSets: nBucketSetsToMake
    }
    console.log("updateInput", updateInput)
    // updateLocalData( await submitMutations({ updateInputs: [updateInput] }))

  }

  console.log("otherPrepData", otherPrepData)

  const { data:PRD=[] } = useProducts({ shouldFetch: true})
  const products = keyBy(PRD, P => P.prodNick)

  return (
    <div style={{maxWidth: "50rem", padding: "2rem 5rem 5rem 5rem", margin: "auto"}}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <h1>What to Bake {reportDT.toFormat('MM/dd/yyyy')}</h1>
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

      <Button label="Print AM Bake List" 
        icon="pi pi-print"
        onClick={generatePdf}
        disabled={!DGH || !nBucketSetsToMake}
        style={{marginBottom: "1rem"}} 
      />

      <h2>Rustics</h2>
      <RusticTable 
        value={rusticData}
        className={isToday ? '' : 'not-today'}
        products={products}
      />


      <h2>What to Prep</h2>
      <DoobieStuffTable 
        value={doobieStuff} 
        className={isToday ? '' : 'not-today'}
      />

      <OtherPrepTable 
        value={otherPrepData}
        className={isToday ? '' : 'not-today'}
        products={products}
      />

    
      <h2>Baguette Mixes</h2>     
      <Button 
        label="ShowDetails" 
        icon="pi pi-table" 
        onClick={() => setShowBaguetteDialog(true)}
        style={{ marginBottom: "1rem" }}
      />
 
      <Dialog
        header="Order Breakdown By Weight (lbs)"
        visible={showBaguetteDialog}
        onHide={() => setShowBaguetteDialog(false)}
      >
        <BaguetteSummaryTable 
          value={baguetteData}
          className={isToday ? '' : 'not-today'}
          products={products}
        />
      </Dialog>

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
          <div>Needed: {baguetteSummary?.needed}</div>
          <div>+ Buffer: {baguetteSummary?.buffer}</div>
          <div>+ Short: {baguetteSummary?.short}</div>
          {/* <Divider type="solid" /> */}
          <h2>TOTAL: {baguetteSummary?.stickerTotal}</h2>
        </div>
      </div>

      {(mixSummary ?? []).map((mixItem, idx) => {
        return (
          <div key={`mix-${idx}`}>
            <h2>Mix #{idx+1}</h2>
            <BaguetteTableTemplate 
              value={mixItem.components} 
              col1Header="Ingredient"
              className={isToday ? '' : 'not-today'}
            />
          </div>
        )
      })}


      <h2>Bins</h2>
      <BaguetteTableTemplate 
        value={bins} 
        col1Header="Product" 
        className={isToday ? '' : 'not-today'} 
      />


      <h2>Pocket Pans</h2>
      <BaguetteTableTemplate 
        value={pans}        
        col1Header="Product" 
        className={isToday ? '' : 'not-today'} 
      />


      <h2>Bucket Sets</h2>
      <BaguetteTableTemplate 
        value={buckets} 
        col1Header="Sets" 
        className={isToday ? '' : 'not-today'} 
      />
      
    </div>
  )
}

export { Baker1 as default }



const RusticTable = ({ value, className, products }) =>
  <DataTable 
    value={value ?? []}
    size="small" 
    responsiveLayout="scroll"   
    className={className}
  >
    <Column header="Product" field="forBake" />
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
    <Column header="Short"  field="short" />
    <Column header={<span>Needed<br/>Early</span>}
      body={rowData => DrilldownCellTemplate({ 
        dialogHeader: `Early ${rowData.forBake} Orders: AM North & Pick up Carlton`,
        cellValue: rowData.earlyQty, 
        tableData: rowData.earlyItems,
        products,
      })} 
      style={{width: "6rem"}}
    />
  </DataTable>



const DoobieStuffTable = ({ value, className }) => 
  <DataTable
    value={value ?? []}
    size="small"
    responsiveLayout="scroll"  
    style={{marginBottom: "1rem"}}
    className={className}
  >
    <Column header="Prod"   field="Prod" />
    <Column header="Bucket" field="Bucket" />
    <Column header="Mix"    field="Mix" />
    <Column header="Bake"   field="Bake" />
  </DataTable>



const OtherPrepTable = ({ value, className, products }) =>
  <DataTable 
    value={value}
    size="small"
    responsiveLayout="scroll"
    style={{marginTop: "1rem"}}
    className={className}
  >
    <Column header="Product" field="prodName" />
    <Column header="Qty"
      body={rowData => DrilldownCellTemplate({
        dialogHeader: `${rowData.prodName} Orders to be Shaped`,
        cellValue: rowData.qty,
        tableData: rowData.items,
        products
      })}
      style={{width: "6rem"}}
    />
  </DataTable>


const BaguetteSummaryTable = ({ value, className, products }) => 
  <DataTable 
    value={value}
    size="small" 
    responsiveLayout="scroll"   
    className={className}
  >
    <Column header="Product"
      field="forBake" 
      footer="Total:" 
    />
    <Column header="Bake Req."
      body={rowData => DrilldownCellTemplate({ 
        dialogHeader: `${rowData.forBake} Orders, Baked Today`,
        cellValue: rowData.weightT0, 
        tableData: rowData.itemsT0 ?? [],
        products,
      })} 
      style={{width: "5rem"}}
      footer={options => round(sumBy(options.props.value ?? [], row => row.weightT0), 1)}
    />
    <Column header="preshaped" 
      field="preshapedWeightT0" 
      style={{width: "5rem"}}
      footer={options => round(sumBy(options.props.value ?? [], row => row.preshapedWeightT0), 1)} 
    />
    <Column header="surplus"
      field="extraT0"
      style={{width: "5rem"}}
      footer={options => round(sumBy(options.props.value ?? [], row => row.extraT0), 1)}
    />
    <Column header="short"
      field="shortT0" 
      style={{width: "5rem"}}
      footer={options => round(sumBy(options.props.value ?? [], row => row.shortT0), 1)}
    />
    <Column header="Shape Req."
      body={rowData => DrilldownCellTemplate({ 
        dialogHeader: `${rowData.forBake} Orders, Baked Today +1`,
        cellValue: rowData.weightT1, 
        tableData: rowData.itemsT1 ?? [],
        products,
      })} 
      footer={options => round(sumBy(options.props.value ?? [], row => row.weightT1), 1)}
    />        
    <Column header="Bucket Req."
      body={rowData => DrilldownCellTemplate({ 
        dialogHeader: `${rowData.forBake} Orders, Baked Today +2`,
        cellValue: rowData.weightT2, 
        tableData: rowData.itemsT2 ?? [],
        products,
      })} 
      footer={options => round(sumBy(options.props.value ?? [], row => row.weightT2), 1)}
    />
  </DataTable>



const BaguetteTableTemplate = ({ value, col1Header, className }) => {
  return (
    <DataTable 
      value={value} 
      size="small" 
      responsiveLayout="scroll"  
      style={{marginBottom: "1rem"}}
      className={className}
    >
      <Column header={col1Header} field='label' />
      <Column header="Amount" field='amount' />
    </DataTable>
  )
}