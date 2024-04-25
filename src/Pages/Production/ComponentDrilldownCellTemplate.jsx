import React, { useState } from "react"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Dialog } from "primereact/dialog"

import { formatHours } from "../../utils/dateAndTime/formatHours"
import { round, sumBy, truncate } from "lodash"
import { compareBy } from "../../utils/collectionFns"
import { CombinedRoutedOrder } from "../../data/production/useProductionData"

// string hashing function from: https://www.30secondsofcode.org/js/s/hash-string-into-number/
const sdbm = str => {
  let arr = str.split('');
  return arr.reduce(
    (hashCode, currentVal) =>
      (hashCode =
        currentVal.charCodeAt(0) +
        (hashCode << 6) +
        (hashCode << 16) -
        hashCode),
    0
  );
};

const randInts = [...Array(64)].map(() => Math.floor(((Math.random()* 3)^2)/3))
const getStableRandInt3 = inputString => randInts.at(sdbm(inputString) % 64)
const flavorText = ['lol', 'nice', '😎']

/**
 * Meant specifically for drilling down on routed order data
 * @param {Object} input
 * @param {import("primereact/dialog").DialogTemplateType} [input.dialogHeader]
 * @param {import("primereact/dialog").DialogTemplateType} [input.dialogFooter]
 * @param {string|number|null} input.cellValue
 * @param {'qty'|'ea'|'wt'} [input.valueType]
 * @param {React.CSSProperties} [input.cellStyle]
 * @param {CombinedRoutedOrder[]} input.tableData
 * @param {Object} input.products  
 */
export const DrilldownCellTemplate = ({ 
  dialogHeader,
  dialogFooter,
  valueType='ea',
  cellValue, 
  cellStyle={},
  tableData,
  products 
}) => {
  const [show, setShow] = useState(false)
  const displayData = tableData
    .filter(order => order.qty !== 0)
    .sort(compareBy(order => order.prodNick))
    .sort(compareBy(order => order.locNick))
    .sort(compareBy(order => order.meta.routeNick))
    .sort(compareBy(order => order.meta.route.routeStart))
    .sort(compareBy(order => order.delivDate))

  const hasContent = !!displayData.length

  const valueTypeHeaderMap = {
    qty: <div>Qty<br />(Pks.)</div>,
    ea: 'Ea.',
    wt: <div>Weight<br />(Lbs.)</div>,
  }
  const valueFunctionMap = {
    qty: row => row.qty,
    ea: (row, products) => row.qty * products[row.prodNick].packSize,
    wt: (row, products) => row.qty * products[row.prodNick].packSize * products[row.prodNick].weight
  }

  const cellTemplate = 
    <div 
      onClick={() => {if (hasContent) setShow(true)}}
      style={{
        cursor: hasContent ? "pointer" : '',
        //textAlign: "right"
        ...cellStyle
      }}
    >
      <div style={{display: "inline-block", width: "2.5rem"}}>
        {cellValue}
      </div>
      {cellValue !== 69 && <i className={`pi pi-fw ${hasContent ? 'pi-clone' : ''}`}/>}
      {cellValue === 69 && <div style={{display: "inline-block"}}>{flavorText[getStableRandInt3(products[tableData?.[0]?.prodNick]?.prodName ?? tableData?.[0]?.prodNick ?? 'x') ?? 0]}</div>}
    </div>

  return(
    <div>
      {cellTemplate}
      <Dialog 
        visible={show}
        onHide={() => setShow(false)}
        header={dialogHeader}
        footer={dialogFooter}
        headerStyle={{gap: "1rem"}}
      >
        <DataTable
          value={displayData}
          size="small"
          responsiveLayout="scroll"
          scrollHeight="50rem"
          footer={() => <div style={{textAlign: "right"}} onClick={() => console.log(displayData)}>
            Total: {round(sumBy(displayData ?? [], rowData => valueFunctionMap[valueType](rowData, products)), 1)}
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
          <Column header={valueTypeHeaderMap[valueType]}  
            body={rowData => round(valueFunctionMap[valueType](rowData, products), 1)}
          />

        </DataTable>
      </Dialog>
    </div>
  )
}