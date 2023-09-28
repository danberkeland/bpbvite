import { keyBy, uniqBy } from "lodash"
import { useListData } from "../../../../data/_listData"
import { useT0T7Data } from "./data2"


export const CroixToMake = () => {

  const { data:PRD } = useListData({ tableName: "Product", shouldFetch: true })
  const products = keyBy(PRD, 'prodNick')
  const croixProducts = PRD.filter(P => 
    ['baked pastries', 'frozen pastries'].includes(P.packGroup)
    && P.doughNick === 'Croissant'
  ) ?? []
  const croixList = uniqBy(croixProducts, 'forBake').map(P => P.forBake)

  console.log(croixList)

  const { data:T0T7Data } = useT0T7Data({ 
    shouldFetch: true, includeHolding: false 
  })

  console.log(T0T7Data)

  return(
    <div>New One</div>
  )

}

// import React, { useEffect, useMemo, useState } from "react"
// import { groupBy } from "lodash"
// import { DateTime } from "luxon"
// import { Button } from "primereact/button"
// import { DataTable } from "primereact/datatable"
// import { Column } from "primereact/column"
// import { InputNumber } from "primereact/inputnumber"
// import { sumBy } from "lodash"

// import { sum } from "lodash"
// import { flattenDeep } from "lodash"
// import { useTableData } from "./data"

// const TODAY = DateTime.now().setZone("America/Los_Angeles").startOf("day")

// // Table Templates

// const cumulativeColumnTemplate = (rowData, dayIdx) => {
//   const byRelDate = ['T0', 'T1', 'T2', 'T3', 'T4']
//     .map(TN => rowData[TN])
//     .slice(0, dayIdx + 1)

//   // break down the nested structure and sum on qty values.
//   // 'byRelDate' ('TN' attributes) have 'type' object-values.
//   // 'type' ('make/pull/stock' attributes) have 'qtyItem' object values.
//   // 'qtyItems' are simple key/value pairs with
//   // 'frozenDeliv/setoutPrado/setoutCarlton' attributes and qty values.
//   //
//   // These qtys are what we're ultimately after and want to sum up.
//   const qtys = flattenDeep(Object.values(byRelDate).map(type => 
//     Object.values(type).map(qtyItem => 
//       Object.values(qtyItem)
//     )
//   ))

//   return sum(qtys)
// }

// const sheetMakeTemplate = (rowData, sheetColumn, setSheetColumn) => {

//   return(
//     <InputNumber 
//       value={rowData.make.sheetMakeUpdate}
//       // onChange={}
//     />
//   )
// }

// // Main Component

// export const CroixToMake = () => {
//   const { tableData, dimensionData } = useTableData()

//   const [sheetColumn, setSheetColumn] = useState()

//   console.log(tableData)

//   useEffect(() => {
//     if (!tableData) return

//     const _sheetColumn = tableData.map(row => ({
//       prodNick: row.prodNick,
//       sheetMake: row.T0.make.sheetMake
//     }))

//     console.log("sheetColumn:", sheetColumn)
//     setSheetColumn(_sheetColumn)
//   }, [tableData])

//   if (!tableData || ! dimensionData) return <div>Loading...</div>
//   return(
//     <div>
//       <h1>{`Croissant Production ${TODAY.toLocaleString()}`}</h1>

//       <Button label="Print Croix Shape List" />

//       <DataTable value={tableData}>
//         <Column header="Product" field="prodNick" />
//         <Column header="freezerCount" field="T0.stock.freezerCount" />
//         <Column header="sheetMake" field="T0.make.sheetMake" />
//         {/* <Column header="makeTotal" field="T0.make.total" /> */}
//         <Column header="Σ T+0" body={rowData => cumulativeColumnTemplate(rowData, 0)} />
//         <Column header="Σ T+1" body={rowData => cumulativeColumnTemplate(rowData, 1)} />
//         <Column header="Σ T+2" body={rowData => cumulativeColumnTemplate(rowData, 2)} />
//         <Column header="Σ T+3" body={rowData => cumulativeColumnTemplate(rowData, 3)} />
//         <Column header="Σ T+4" body={rowData => cumulativeColumnTemplate(rowData, 4)} />
//       </DataTable>
//     </div>
//   )
// }



