import { useState, useEffect } from "react"

import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Dialog } from "primereact/dialog"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"

import { keyBy, round, sumBy } from "lodash"
import { DateTime } from "luxon"

import { useListData } from "../../../../data/_listData"
import { useSetoutData } from "./data"
import { exportPastryPrepPdf } from "./exportPdf"

import { updateInfoQBAuth, createInfoQBAuth } from "../../../../graphql/mutations"
import { API, graphqlOperation } from "aws-amplify"

const _todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
const todayDT = _todayDT.toFormat('MM-dd') === '12-24'
  ? _todayDT.plus({ days: 1 }) : _todayDT
console.log(_todayDT.toFormat('MM-dd'))
const todayISO = todayDT.toFormat('yyyy-MM-dd')
const todayUS = todayDT.toFormat('MM/dd/yyyy')

const SetoutByLocation = ({ reportLocation }) => {

  const { data:setoutData } = useSetoutData({ reportDate: todayISO })
  const { 
    data:PRD,
    submitMutations:submitProducts,
    updateLocalData:updateProductCache,
  } = useListData({ tableName: "Product", shouldFetch: true })


  const setoutTimeInStone = async () => {
    let input = {
      id: todayISO + reportLocation + "setoutTime",
      infoContent: "updated",
      infoName: reportLocation + "setoutTime",
    };
    try {
      await API.graphql(graphqlOperation(updateInfoQBAuth, { input }))
      console.log('QBInfo Updated')
    } catch (error) {
      try {
        await API.graphql(graphqlOperation(createInfoQBAuth, { input }))
        console.log('QBInfo Created')
      } catch (error) {
        console.log("error on updating info", error);
      }
    }
  }

  useEffect(() => {
    console.log("Got here to confirm!");
    confirmDialog({
      message: "Click YES to confirm these setout numbers will be used.",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: setoutTimeInStone,
    });
  }, []);

  if (!setoutData || !PRD) return <div>Loading...</div>

  const products = keyBy(PRD, 'prodNick')
  const { north,  south } = setoutData
  // console.log('north', north)
  // console.log('south', south)

  // save main setout totals by updating the product's prepreshaped values.
  const submitPrepreshaped = async () => {
    if (!setoutData?.south?.nonAlmondCroix) {
      console.error("Error: setout data not found")
      return
    }

    const updateInputs = setoutData.south.nonAlmondCroix.map(row => ({
      prodNick: row.setoutKey,
      prepreshaped: row.total
    }))
    const response = await submitProducts({ updateInputs })
    // console.log(response)
    updateProductCache( response )

  }

  return (
    <div style={{width:"30rem", marginBottom: "10rem"}}>
      <h1>Prado Pastry Prep {todayUS}</h1>
      <Button label={`Print ${reportLocation} Prep List`} 
        onClick={() => {
          exportPastryPrepPdf({
            reportLocation: reportLocation,
            reportDateUS: todayUS,
            reportDateISO: todayISO,
            data: reportLocation === "Prado" ? south : north
          })
          submitPrepreshaped()
        }}
      />
      
      <h2>Set Out</h2>
      <DataTable 
        value={reportLocation === "Prado"
          ? south.nonAlmondCroix
          : north.nonAlmondCroix
        }
        size="small"
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
        size="small"
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
        <DataTable value={south.almondCroix} size="small">
          <Column header="Put Where" field="rowKey" />
          <Column header="Qty" field="total" 
            body={rowData => ExpandableCellTemplate({
              rowData,
              products,
            })}
          />
        </DataTable>
      </>}

      <ConfirmDialog />
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