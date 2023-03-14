import React from "react";
import { useProductionDataByDate } from "../../data/productionData";

import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"

function Production() {
  const delivDateJS = new Date()
  const { data:productionData } = useProductionDataByDate(delivDateJS, true)

  console.log(productionData)

  if (!productionData) return <div>Loading...</div>

  //return <pre>{JSON.stringify(productionData, null, 2)}</pre>

  return(
    <div style={{padding: "1rem", marginBottom: "6rem"}}>
      <DataTable
        value={productionData.filter(i => !i.type.startsWith('H')) || []} 
        responsiveLayout
      >
        <Column filter header="Fulfillment" field="route" />
        <Column filter header="Zone" field="location.zoneNick" />
        <Column filter header="Location" field="location.locName" />
        <Column filter header="Type" field="type" />
        <Column filter header="Product" field="product.prodName"/>
        <Column filter header="Valid Routes" body={rowData => <div>{rowData.zoneRoutes.filter(zr => zr.status.isValid).map(zr => zr.routeNick).join(', ')}</div>} />


      </DataTable>
    </div>
  )

}

export default Production;

