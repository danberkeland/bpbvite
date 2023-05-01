import React from "react"
import { useBPBNbakeList } from "../_hooks/BPBNhooks"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"

export const WhatToMake = ({ dateDT, displayDate }) => {
  const bakeTotals = useBPBNbakeList({ dateDT, format: 'forBakeTotals' })

  return (
    <div style={{marginTop: "2rem"}}>
      <h2>{`What to Bake ${displayDate}`}</h2>

      <DataTable 
        value={bakeTotals || []}
        size="small"
      >
        <Column header="Product" field="forBake"/>
        <Column header="Qty" field="qty"/>
        <Column header="Shaped" field="preshaped"/>
        <Column header="Short" body={shortColumnTemplate} />
        <Column header="Need Early" body={row => row.needEarly || ''} />
      </DataTable>

      {/* <pre>{JSON.stringify(bakeList.filter(order => order.isStand !== true), null, 2)}</pre> */}
    </div>
  )
}

const shortColumnTemplate = (rowData) => {
  const surplus = rowData.preshaped - rowData.qty
  return surplus > 0 ? `Over ${surplus}`
    : surplus < 0 ? `Short ${surplus * -1}`
    : ''
}