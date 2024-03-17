import React, { useState } from "react"

import { useRusticData } from "./useRusticData"
import { useProducts } from "../../../data/product/useProducts"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Dialog } from "primereact/dialog"

import { DT } from "../../../utils/dateTimeFns"
import { keyBy } from "../../../utils/collectionFns"
import { formatHours } from "../../../utils/dateAndTime/formatHours"
import { truncate } from "lodash"
import { Button } from "primereact/button"
// Enhances data with product info



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
      >
        <DataTable
          value={tableData}
          size="small"
          // scrollable
          responsiveLayout="scroll"
          scrollHeight="50rem"
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