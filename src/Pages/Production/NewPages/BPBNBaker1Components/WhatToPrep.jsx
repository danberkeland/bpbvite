import React from "react"

import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"

export const WhatToPrep = ({ prepTotals, doobieStuff }) => {
  
  return (
    <div style={{marginTop: "2rem"}}>
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


