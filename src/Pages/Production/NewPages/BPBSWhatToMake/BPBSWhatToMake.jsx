import { DateTime } from "luxon"
import { useBpbsWtmData } from "./data"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Dialog } from "primereact/dialog"
import { useState } from "react"
import { useListData } from "../../../../data/_listData"
import { keyBy } from "lodash"

const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
const today = todayDT.toFormat('yyyy-MM-dd')
const todayDisplay = todayDT.toFormat('MM/dd/yyyy')

export const BPBSWhatToMake = () => {

  const { data:WtmData } = useBpbsWtmData({ shouldFetch: true, reportRelDate: 0 })
  const { data:PRD } = useListData({ tableName: "Product", shouldFetch: true })
  

  if (!WtmData || !PRD) return <div>Loading...</div>


  const { 
    northPocketData, freshData, shelfData, freezerData, pretzelData,
  } = WtmData

  
  const products = keyBy(PRD, 'prodNick')

  return(<>
    <h1>BPBS What to Make {todayDisplay}</h1>

    <Button>Print What to Make List</Button>

    <h2>Send Pockets North</h2>
    <DataTable value={northPocketData} size="small">
      <Column header="Product" field="rowKey" />
      <Column header="Total" 
        body={(rowData => ExpandableCellTemplate({
          dialogHeader: 'Orders for Carlton Pickup',
          colKey: 'totalCol',
          rowData,
          products,
        }))}  
      />
    </DataTable>

    <h2>Make Fresh</h2>
    <DataTable value={freshData} size="small">
      <Column header="Product" field="rowKey" />
      <Column header="Total Deliv" field="makeTotalCol.totalEa"
        body={(rowData => ExpandableCellTemplate({
          dialogHeader: 'Bake & Deliver Today',
          colKey: 'makeTotalCol',
          rowData,
          products,
        }))}  
      />
      <Column header="Make Total" field="totalDelivCol.totalEa"
        body={(rowData => ExpandableCellTemplate({
          dialogHeader: 'Total Requirements',
          colKey: 'makeTotalCol',
          rowData,
          products,
        }))}  
      />
      <Column header="Bag For Tomorrow" field="bagTomorrowCol.totalEa"
        body={(rowData => ExpandableCellTemplate({
          dialogHeader: 'Bake Ahead for Tomorrow',
          colKey: 'bagTomorrowCol',
          rowData,
          products,
        }))}  
      />
    </DataTable>

    <h2>Make For Shelf</h2>
    <DataTable value={shelfData} size="small">
      <Column header="Product" field="rowKey" />
      <Column header="Total Deliv" field="totalDelivCol.totalEa" 
        body={(rowData => ExpandableCellTemplate({
          dialogHeader: 'Deliveries',
          colKey: 'totalDelivCol',
          rowData,
          products,
        }))}  
      />
      <Column header="Need Early" field="needEarlyCol.totalEa" />
      <Column header="Make Total" field="makeTotalCol.totalEa" 
        body={(rowData => ExpandableCellTemplate({
          dialogHeader: 'Today & Tomorrow Orders',
          colKey: 'makeTotalCol',
          rowData,
          products,
        }))}  
      />
    </DataTable>

    <h2>Pretzels</h2>
    <DataTable 
      value={pretzelData.filter(row => 
        ['ptz', 'pzb', 'unpz'].includes(row.productRep.prodNick)
        || row.bakeCol.totalEa > 0
        || row.shapeCol.orders.totalEa > 0
        || row.bagCol.orders.totalEa > 0
        // || true // uncomment to disable filter
      )} 
      size="small"
    >
      <Column header="Product" field="rowKey" />
      <Column header="Bake Today" field="bakeCol.totalEa" 
        body={(rowData => ExpandableCellTemplate({
          dialogHeader: 'To be Baked Today',
          colKey: 'bakeCol',
          rowData,
          products,
        }))}  
      />
      <Column header="Shape for Tomorrow" field="shapeCol.totalEa" 
        body={(rowData => ExpandableCellTemplate({
          dialogHeader: 'To be Baked Tomorrow',
          colKey: 'shapeCol',
          rowData,
          products,
        }))}  
      />
      <Column header="Bag EOD" field="bagCol.totalEa" 
        body={(rowData => ExpandableCellTemplate({
          dialogHeader: 'Bag EOD',
          colKey: 'bagCol',
          rowData,
          products,
        }))}  
      />
    </DataTable>

    <h2>Make For Freezer</h2>
    <DataTable value={freezerData} size="small">
      <Column header="Product" field="rowKey" />
      <Column header="Total Deliv" field="totalDelivCol.totalEa" 
        body={(rowData => ExpandableCellTemplate({
          dialogHeader: 'Deliveries',
          colKey: 'totalDelivCol',
          rowData,
          products,
        }))}  
      />
      <Column header="Need Early" field="needEarlyCol.totalEa" />
      <Column header="Make Total" field="makeTotalCol.totalEa" 
        body={(rowData => ExpandableCellTemplate({
          dialogHeader: 'Today & Tomorrow Orders',
          colKey: 'makeTotalCol',
          rowData,
          products,
        }))}  
      />
    </DataTable>

  
  </>)

}



const ExpandableCellTemplate = ({ 
  dialogHeader='', 
  colKey, 
  rowData, 
  products,
}) => {
  const [showDialog, setShowDialog] = useState(false)
  const hasContent = !!rowData[colKey].orders.length

  return <>
    <div 
      onClick={() => {
        if (hasContent) setShowDialog(true)}
      }
      style={{
        display: "flex",
        cursor: hasContent ? "pointer" : ''
      }}
    >
      <span style={{flex: '0 0 3rem'}}>{rowData[colKey].totalEa}</span>
      {rowData[colKey].orders.length ? <i className="pi pi-fw pi-clone"/> : ''}
    </div>
    <Dialog
      header={dialogHeader} 
      visible={showDialog} 
      onHide={() => setShowDialog(false)}
    >
      <DataTable value={rowData[colKey].orders} size="small">
        <Column header="Product"   field="prodNick" />
        <Column header="Route"     field="routeMeta.routeNick" />
        <Column header="Location"  field="locNick" />
        <Column header="delivDate" body={row => row.delivDate.slice(5)} />
        <Column header="Qty (ea)"  body={rowData => rowData.qty * products[rowData.prodNick].packSize} />
      </DataTable>
    </Dialog>
  </>
}