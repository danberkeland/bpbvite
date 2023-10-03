import { DateTime } from "luxon"
import { useBpbsWtmData } from "./data"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Dialog } from "primereact/dialog"
import { useState } from "react"
import { useListData } from "../../../../data/_listData"
import { keyBy } from "lodash"

// const reportDate = '2023-10-05'
// const reportDateDT = DateTime.fromFormat(delivDate, 'yyyy-MM-dd', { zone: 'America/Los_Angeles'})

const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')


export const BPBSWhatToMake = () => {

  const { data:WtmData } = useBpbsWtmData({ shouldFetch: true, reportRelDate: 0 })
  const { data:PRD } = useListData({ tableName: "Product", shouldFetch: true })
  
  if (!WtmData || !PRD) return <div>Loading...</div>
  console.log("WTMData:", WtmData)
  const { freshOrderData, northPocketData } = WtmData
  const products = keyBy(PRD, 'prodNick')

  const ExpandableCellTemplate = ({ rowData, colKey }) => {
    const [showDialog, setShowDialog] = useState(false)    
    const relDateText = colKey === 0 ? 'Today' : 'Tomorrow'

    return <>
      <div onClick={() => setShowDialog(true)}>
        {rowData[colKey].totalEa}
      </div>
      <Dialog
        header={`${rowData.forBake} orders for ${relDateText}`} 
        visible={showDialog} 
        onHide={() => setShowDialog(false)}
      >
        <DataTable value={rowData[colKey].items}>
          <Column header="Product"   field="prodNick" />
          <Column header="Route"     field="routeMeta.routeNick" />
          <Column header="Location"  field="locNick" />
          <Column header="delivDate" field="delivDate" />
          <Column header="Qty (ea)"  body={rowData => rowData.qty * products[rowData.prodNick].packSize} />
        </DataTable>
      </Dialog>
    </>
  }

  return (<div>
    <h1>What to Make</h1>

    <h2>Send Pockets North</h2>
    <DataTable value={northPocketData} size="small">
      <Column header="Product" field="forBake" />
      <Column header="Total"
        body={rowData => ExpandableCellTemplate({ rowData, colKey: 0 })}
      />

    </DataTable>

    <h2>MakeFresh</h2>
    <DataTable value={freshOrderData} size="small">
      <Column header="Product" field="forBake" />
      <Column header="Total Deliv" 
        body={rowData => ExpandableCellTemplate({ rowData, colKey: 0 })}
      />
      <Column header="Make Total" 
        body={row => row[0].totalEa + row[1].totalEa} 
      />
      <Column header="Bag For Tomorrow" 
        body={rowData => ExpandableCellTemplate({ rowData, colKey: 1 })}
      />
    </DataTable>
  
    <h2>Make For Shelf</h2>

  
  </div>)


}