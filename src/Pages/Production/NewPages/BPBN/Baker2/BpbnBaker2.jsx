import React from "react"

import { keyBy } from "lodash/fp"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"

import { DrilldownCellTemplate } from "../_components/DrilldownCellTemplate"

import { useSettingsStore } from "../../../../../Contexts/SettingsZustand"
import { useListData } from "../../../../../data/_listData"
import { useBpbn2Data } from "../data/data"
import { exportBpbn2Pdf } from "./exportPdf"
import { useCheckUpdates } from "../../../Utils/useCheckUpdates"
import { getTodayDT } from "../utils"



/**
 * A more deliberate update method for consistent updates:
 * 
 * Old method updated products found among the order list, which led to
 * inconsistent behavior:
 * 
 *  - products not found in the list would not get updated
 *    
 *    Ex: mbag are infrequently ordered. if they're present in the order
 *        list one day, but not the next, their preshape amount will
 *        linger, which will affect dough calculations by tricking the
 *        system into thinking there is extra preshaped dough to be scrapped.
 * 
 *  - the product chosen for updating could change depending on the orders
 *
 *    Ex: if only rrye orders are present in the rye row, then rrye will get
 *        the update. If only rye is present, then rye will get the update.
 *        If both are present, then rrye will get the update
 * 
 *        If the daily order lists fluctuates between including rrye and
 *        not including rrye, the updated product will change
 * 
 * New method defines a constant, "canonical" list of products for updates 
 * as follows: 
 * 
 * Include 1 product for each row that can possibly appear on the list.
 * This product is chosen from a group of products sharing the same forBake
 * value -- we choose the first product in the group after sorting by prodName.
 * 
 * When no order data is present, we still update the product with a 
 * preshape value of 0 so that inaccurate values do not linger in the system.
 */
const getUpdateInputs = ({ 
  rusticData, 
  productsToUpdate,
}) => {
  return Object.keys(productsToUpdate).map(forBake => {
    const productRepresentative = productsToUpdate[forBake]
    const rusticRow = rusticData.find(R => R.forBake === forBake)
  
    return {
      prodNick: productRepresentative.prodNick,
      prepreshaped: (!!rusticRow) ? rusticRow.qty : 0
    }
  })

}



export const Bpbn2 = () => {
  const todayDT = getTodayDT()
  const reportDate = todayDT.toFormat('yyyy-MM-dd')

  const isLoading = useSettingsStore((state) => state.isLoading);
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);

  const bpbn2data = useBpbn2Data({ 
    reportDate,
    shouldShowZeroes: false,
    shouldFetch:true 
  })

  const { 
    rusticData=[], 
    croixData=[], 
    otherPrepData=[],
    productRepsByListTypeByForBake={}, // consistent product list for mutations
  } = bpbn2data ?? {}

  // console.log("other prep data", otherPrepData)

  const { 
    data:PRD,
    submitMutations: submitProducts,
    updateLocalData: updateProductCache
  } = useListData({ tableName: "Product", shouldFetch: true})
  const products = keyBy('prodNick')(PRD ?? {})

  useCheckUpdates()
  
  const handleExportPdf = async () => {
    if (!bpbn2data) {
      console.log("Data not found.")
      return
    }

    setIsLoading(true)
    exportBpbn2Pdf({
      reportDate, 
      shapeTotals: rusticData, 
      prepTotals: otherPrepData, 
      croixSetoutTotals: croixData,
    })

    const updateInputs = getUpdateInputs({ 
      rusticData, 
      productsToUpdate: productRepsByListTypeByForBake.rustic,
    })

    console.log("updateInputs", updateInputs)
    updateProductCache( await submitProducts({ updateInputs }) )
    setIsLoading(false)
  }

  return (
    <div style={{maxWidth: "50rem", margin: "auto", padding: "2rem 5rem"}}>
      <h1>What To Shape {todayDT.toFormat('MM/dd/yyyy')}</h1>

      <Button 
        label="Print Prep List" 
        icon="pi pi-print" 
        onClick={handleExportPdf}
        disabled={isLoading}
      />

      <DataTable 
        value={rusticData}
        size="small"
        responsiveLayout="scroll"
        style={{marginTop: "1rem"}}
      >
        <Column header="Product" field="forBake"   />
        <Column header="Weight"  field="weight"    />
        <Column header="Dough"   field="doughNick" />
        <Column header="Qty"
          body={rowData => DrilldownCellTemplate({
            dialogHeader: `${rowData.forBake} Orders to be Shaped`,
            cellValue: rowData.qty,
            tableData: rowData.items,
            products
          })}
          style={{width: "6rem"}}
        />

      </DataTable>


      <h1>Other Prep</h1>
      <DataTable 
        value={otherPrepData}
        size="small"
        responsiveLayout="scroll"
        style={{marginTop: "1rem"}}
      >
        <Column header="Product" field="prodName"   />
        <Column header="Qty"
          body={rowData => DrilldownCellTemplate({
            dialogHeader: `${rowData.forBake} Orders to be Shaped`,
            cellValue: rowData.qty,
            tableData: rowData.items,
            products
          })}
          style={{width: "6rem"}}
        />

      </DataTable>

      <h1>Croissant Setout</h1>
      <DataTable 
        value={croixData}
        size="small"
        responsiveLayout="scroll"
        style={{marginTop: "1rem"}}
      >
        <Column header="Product" field="forBake"   />
        <Column header="Qty"
          body={rowData => DrilldownCellTemplate({
            dialogHeader: `${rowData.forBake} Orders to be Shaped`,
            cellValue: rowData.qty,
            tableData: rowData.items,
            products
          })}
          style={{width: "6rem"}}
        />

      </DataTable>



    </div>
  )
}