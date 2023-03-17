import React, { useState, useEffect } from "react";
import { useProductionDataByDate } from "../../data/productionData";

import { Calendar } from "primereact/calendar"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { useLegacyFormatDatabase } from "../../data/legacyData";

import ComposeProductGrid from "../../functions/legacyFunctions/utils/composeProductGrid"
import { dateToYyyymmdd } from "../../functions/dateAndTime";

const compose = new ComposeProductGrid()

function Production() {
  
  const [calendarDate, setCalendarDate] = useState(new Date())
  const delivDate = dateToYyyymmdd(calendarDate)
  const [orderList, setOrderList] = useState()

  const { data:database } = useLegacyFormatDatabase()

  useEffect(() => {
    if (database) {
      const _prodGridData = compose.returnProdGrid(database, delivDate)
      setOrderList(_prodGridData.prodGrid)
      console.log("database:", database)
      console.log("prodGrid:", _prodGridData.prodGrid)
    }
  }, [database, delivDate])

  return(
    <div style={{padding: "1rem", marginBottom: "6rem"}}>
      <Calendar 
        touchUI={true}
        value={calendarDate}
        onChange={(e) => setCalendarDate(e.value)}
        readOnlyInput // prevent keyboard input of invalid date string
      />
      <DataTable
        value={orderList} 
        responsiveLayout
      >
        <Column filter header="Zone" field="zone" />
        <Column filter header="Location" field="custName" />
        <Column filter header="Product" field="prodName"/>
        <Column header="Qty" field="qty" />
        <Column filter header="Route" field="route" />

      </DataTable>
    </div>
  )

// }

  
}

export default Production;

