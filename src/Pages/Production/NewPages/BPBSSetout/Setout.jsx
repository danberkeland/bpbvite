import { useState } from "react"

import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Dialog } from "primereact/dialog"

import { keyBy, round, sumBy } from "lodash"
import { DateTime } from "luxon"

import { useListData } from "../../../../data/_listData"
import { useSetoutData } from "./data"
import { exportPastryPrepPdf } from "./exportPdf"

const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
const todayISO = todayDT.toFormat('yyyy-MM-dd')
const todayUS = todayDT.toFormat('MM/dd/yyyy')

const SetoutByLocation = ({ reportLocation }) => {

  const { data:setoutData } = useSetoutData({ reportDate: todayISO })
  const { data:PRD } = useListData({ tableName: "Product", shouldFetch: true })

  if (!setoutData || !PRD) return <div>Loading...</div>

  const products = keyBy(PRD, 'prodNick')
  const { north,  south } = setoutData
  console.log('north', north)
  console.log('south', south)

  return (
    <div style={{width:"30rem", marginBottom: "10rem"}}>
      <h1>Prado Pastry Prep {todayUS}</h1>
      <Button label={`Print ${reportLocation} Prep List`} 
        onClick={() => exportPastryPrepPdf({
          reportLocation: reportLocation,
          reportDateUS: todayUS,
          reportDateISO: todayISO,
          data: reportLocation === "Prado" ? south : north
        })}
      />
      
      <h2>Set Out</h2>
      <DataTable 
        value={reportLocation === "Prado"
          ? south.nonAlmondCroix
          : north.nonAlmondCroix
        }
      >
        <Column header="Product" field="setoutKey" />
        <Column header="Qty" field="total" 
          body={rowData => ExpandableCellTemplate({
            rowData,
            products,
          })}
        />
        <Column header="Pans" field="pans" />
        <Column header="+" field="remainder" />
      </DataTable>

      <h2>Pastry Prep</h2>
      <DataTable 
        value={reportLocation === "Prado"
          ? south.otherPastries
          : north.otherPastries
        }
      >
        <Column header="Product" field="rowKey" />
        <Column header="Qty" field="total" 
          body={rowData => ExpandableCellTemplate({
            rowData,
            products,
          })}
        />
      </DataTable>

      {reportLocation === "Prado" && <>
        <h2>Almonds</h2>
        <DataTable value={south.almondCroix}>
          <Column header="Put Where" field="rowKey" />
          <Column header="Qty" field="total" 
            body={rowData => ExpandableCellTemplate({
              rowData,
              products,
            })}
          />
        </DataTable>
      </>}

    </div>
  )
}


/**takes a decimal number representation of time and formats as a sring
 * 
 * ex: formatHours(8.25) // "8:15am"
 */
const formatHours = (timeFloat) => {
  const hour = Math.floor(Number(timeFloat)) || 0
  const minute = round((Number(timeFloat) - hour) * 60) || 0
  return DateTime.fromObject({ hour, minute }).toFormat('h:mm')
}

const ExpandableCellTemplate = ({ 
  dialogHeader='',  
  rowData, 
  products,
}) => {
  const [showDialog, setShowDialog] = useState(false)
  const hasContent = !!rowData.orders.length

  const tableSum = sumBy(
    rowData.orders, 
    order => order.qty * products[order.prodNick].packSize
  )

  return <>
    <div 
      onClick={() => {if (hasContent) setShowDialog(true)}}
      style={{
        cursor: hasContent ? "pointer" : '',
        //textAlign: "right"
      }}
    >
      <div style={{display: "inline-block", width: "2.75rem"}}>
        {rowData.total}
      </div>
      <i className={`pi pi-fw ${hasContent ? 'pi-clone' : ''}`}/>
    </div>
    <Dialog
      header={dialogHeader} 
      visible={showDialog} 
      onHide={() => setShowDialog(false)}
    >
      <DataTable value={rowData.orders} 
        size="small"
        footer={<div style={{textAlign: "right"}}>Total: {tableSum}</div>}
      >
        <Column header="delivDate" body={row => row.delivDate.slice(5)} />
        <Column header="Route" field="routeMeta.routeNick" />
        <Column header="Start"     
          body={row => formatHours(row.routeMeta.route.routeStart)} 
        />
        <Column header="Location" field="locNick" />
        <Column header="Product" field="prodNick" />
        <Column header="Ea."  
          body={rowData => rowData.qty * products[rowData.prodNick].packSize}
        />
      </DataTable>
    </Dialog>
  </>
}

export const BPBSSetout = () => <SetoutByLocation reportLocation="Prado" />
export const BPBNSetout = () => <SetoutByLocation reportLocation="Carlton" />