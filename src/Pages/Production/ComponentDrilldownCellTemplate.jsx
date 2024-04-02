import React, { useState } from "react"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Dialog } from "primereact/dialog"

import { formatHours } from "../../utils/dateAndTime/formatHours"
import { round, sumBy, truncate } from "lodash"
import { compareBy } from "../../utils/collectionFns"


/**
 * 
 * @param {Object} input
 * @param {any} [input.dialogHeader]
 * @param {string|number|null} input.cellValue
 * @param {Object[]} input.tableData
 * @param {Object} input.products 
 * @returns 
 */
export const DrilldownCellTemplate = ({ 
  dialogHeader,
  cellValue, 
  tableData, 
  products 
}) => {
  const [show, setShow] = useState(false)
  const hasContent = !!tableData.length

  const cellTemplate = 
    <div 
      onClick={() => {if (hasContent) setShow(true)}}
      style={{
        cursor: hasContent ? "pointer" : '',
        //textAlign: "right"
      }}
    >
      <div style={{display: "inline-block", width: "2.5rem"}}>
        {cellValue}
      </div>
      <i className={`pi pi-fw ${hasContent ? 'pi-clone' : ''}`}/>
    </div>

  return(
    <div>
      {cellTemplate}
      <Dialog 
        visible={show}
        onHide={() => setShow(false)}
        header={dialogHeader}
        headerStyle={{gap: "1rem"}}
      >
        <DataTable
          value={tableData
            .filter(order => order.qty !== 0)
            .sort(compareBy(order => order.prodNick))
            .sort(compareBy(order => order.locNick))
            .sort(compareBy(order => order.meta.routeNick))
            .sort(compareBy(order => order.meta.route.routeStart))
            .sort(compareBy(order => order.delivDate))
          }
          size="small"
          responsiveLayout="scroll"
          scrollHeight="50rem"
          footer={() => <div style={{textAlign: "right"}}>
            Total: {round(sumBy(tableData ?? [], rowData => rowData.qty * products[rowData.prodNick].packSize), 1)} Ea.
          </div>}
        >
          <Column header="delivDate" body={row => row.delivDate.slice(5)} />
          <Column header="Route" field="meta.routeNick" />
          <Column header="Start"     
            body={row => formatHours(row.meta.route.routeStart)} 
          />
          {/* <Column header="Location" field="locNick" /> */}
          <Column header="Location" 
            body={row => {
              const { locNick } = row
              const strParts = locNick.split('__')
              return strParts.length === 1
                ? strParts[0]
                : strParts[0] + '__' + truncate(strParts[1], { length:10 })
            }} 
          />

          <Column header="Product" field="prodNick" />
          <Column header="Ea."  
            body={rowData => rowData.qty * products[rowData.prodNick].packSize}
          />

        </DataTable>
      </Dialog>
    </div>
  )
}