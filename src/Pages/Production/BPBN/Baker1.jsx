import React, { useState } from "react"

import { useRusticData } from "./useRusticData"
import { useProducts } from "../../../data/product/useProducts"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { DrilldownCellTemplate } from "./DrilldownCellTemplate"

import { DT } from "../../../utils/dateTimeFns"
import { keyBy, sumBy } from "../../../utils/collectionFns"

import { Button } from "primereact/button"
import { useDoobieStuff } from "./useDoobieStuff"
import { useOtherPrepData } from "./useOtherPrepData"
import { useBaguetteDoughSummary } from "./useBaguetteDoughSummary"
import { round } from "lodash"
import { useDoughs } from "../../../data/dough/useDoughs"



const Baker1 = () => {
  const todayDT = DT.today()
  const [reportDT, setReportDT] = useState(todayDT)
  const isToday = reportDT.toMillis() === todayDT.toMillis()

  const setToToday    = () => setReportDT(todayDT)
  const setToTomorrow = () => setReportDT(todayDT.plus({ days: 1 }))
  
  const { data:rusticData } = useRusticData({
    bakeDT: reportDT,
    useHolding: false,
    preshapeType: isToday ? 'preshape' : 'prepreshape'
  })
  const { data:doobieStuff } = useDoobieStuff({ reportDT })
  const { data:otherPrepData } = useOtherPrepData({ bakeDT: reportDT })
  const { data:baguetteData } = useBaguetteDoughSummary({ reportDT })

  console.log("BAGUETTE DATA:", baguetteData)

  const { data:PRD=[] } = useProducts({ shouldFetch: true})
  const { data:DGH } = useDoughs({ shouldFetch: true })
  const baguetteDoughItem = DGH?.find(D => D.doughName === 'Baguette') ?? {}

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
      />

      <h2>Baguette Mix</h2>

      <DataTable 
        value={baguetteData ?? []}
        size="small" 
        responsiveLayout="scroll"   
      >
        <Column header="Product"
          field="forBake" 
          footer="Total:" 
        />
        <Column header="Bake Req"
          // field="weightT0"
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
        <Column header="Mix/Shape Req."
          // field="weightT1" 
          body={rowData => DrilldownCellTemplate({ 
            dialogHeader: `${rowData.forBake} Orders, Baked Today +1`,
            cellValue: rowData.weightT1, 
            tableData: rowData.itemsT1 ?? [],
            products,
          })} 
          footer={options => round(sumBy(options.props.value ?? [], row => row.weightT1), 1)}
        />        
        <Column header="Bucket Req."
          // field="weightT2" 
          body={rowData => DrilldownCellTemplate({ 
            dialogHeader: `${rowData.forBake} Orders, Baked Today +2`,
            cellValue: rowData.weightT2, 
            tableData: rowData.itemsT2 ?? [],
            products,
          })} 
          footer={options => round(sumBy(options.props.value ?? [], row => row.weightT2), 1)}
        />
      </DataTable>

      <div>

      </div>
      
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
        dialogHeader: `Early ${rowData.forBake} Orders`,
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
    <Column header="Product" field="prodName"   />
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