import React from "react"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"

export const WhatToMake = ({ bakeTotals }) => {

  return (
    <div style={{marginTop: "2rem"}}>
      <DataTable 
        value={bakeTotals || []}
        size="small"
      >
        <Column header="Product" field="forBake"/>
        <Column header="Qty" field="qty"/>
        <Column header="Shaped" field="preshaped"/>
        <Column header="Short" field="shortText" />
        <Column header="Need Early" field="needEarly" />
      </DataTable>

      {/* <pre>{JSON.stringify(bakeList.filter(order => order.isStand !== true), null, 2)}</pre> */}
    </div>
  )
}

// const shortColumnTemplate = (rowData) => {
//   const surplus = rowData.preshaped - rowData.qty
//   return surplus > 0 ? `Over ${surplus}`
//     : surplus < 0 ? `Short ${surplus * -1}`
//     : ''
// }