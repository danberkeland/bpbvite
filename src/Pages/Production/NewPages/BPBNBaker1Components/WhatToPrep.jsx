import React from "react"

import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"

import { useBPBNprepList } from "../_hooks/BPBNhooks"

export const WhatToPrep = ({ dateDT, displayDate, doobieStuff }) => {
  const prepTotals = useBPBNprepList({ dateDT, format: 'forBakeTotals' })

  return (
    <div style={{marginTop: "2rem"}}>
      <h2>{`What to Prep ${displayDate}`}</h2>

      <DataTable 
        value={doobieStuff} 
        size="small"
        tableStyle={{marginBottom: "2rem"}}
      >
        <Column field="Prod" header="Product"></Column>
        <Column field="Bucket" header="Bucket"></Column>
        <Column field="Mix" header="Mix"></Column>
        <Column field="Bake" header="Bake"></Column>
      </DataTable>

      <DataTable 
        value={prepTotals}
        size="small"
      >
        <Column header="Product" field="prodName"/>
        <Column header="Qty" field="qty"/>
      </DataTable>
    </div>
  )

}


