import { flow, groupBy, filter, map, uniqBy, identity, sortBy, keyBy, values, mapValues } from "lodash/fp"
import { useListData } from "../../../../data/_listData"
import { useMemo } from "react"
import { truncate } from "lodash"

export const useSpecialOrderData = ({ reportDate, shouldFetch }) => {

  const { data:ORD } = useListData({ 
    tableName: "Order", 
    customQuery: "orderByDelivDate",
    variables: { limit: 5000, delivDate: reportDate },
    shouldFetch, 
  })

  const calculateValue = () => {
    if (!ORD) return undefined

    const { 
      atownpick:northSpecialOrders=[],
      slopick:southSpecialOrders=[]  
    } = flow(
      filter(order => order.isWhole === false),
      groupBy('route')
    )(ORD)

    const northTable = makePivotData({ 
      data: northSpecialOrders,
      rowKey: 'locNick',
      pivotColumnAttribute: 'prodNick',
    })
    const southTable = makePivotData({ 
      data: southSpecialOrders,
      rowKey: 'locNick',
      pivotColumnAttribute: 'prodNick',
    })

    const northPdf = convertToPdfData(northTable)
    const southPdf = convertToPdfData(southTable)

    // console.log("northSpecialOrders", northSpecialOrders)
    // console.log("southSpecialOrders", southSpecialOrders)
    // console.log('northTable', northTable)
    // console.log('southTable', southTable)

    return { northTable, southTable, northPdf, southPdf }

  }

  return { data: useMemo(calculateValue, [ORD]) }

}

/**
 * Warning: behavior is unknown in the event of duplicate order items for
 * the same date / location / product. Only one will be selected, but there's
 * no guarantee for which.
 * 
 * Data is an array of objects.
 */
const makePivotData = ({ data, rowKey, pivotColumnAttribute }) => {

  const pivotColumnKeys = flow(
    map(item => item[pivotColumnAttribute]),
    uniqBy(identity),
    sortBy(identity),
  )(data)

  const rows = flow(
    groupBy(rowKey),
    mapValues(rowGroup => ({ 
      isSquareOrder: rowGroup[0][rowKey].includes("__") ? "*" : "",
      rowKey: rowGroup[0][rowKey], 
      ...keyBy(pivotColumnAttribute)(rowGroup)
    })),
    values
  )(data)
    
  return { pivotColumnKeys, rows }
}


/**
 * Converts detailed data to display values only.
 * Customer names are truncated and pivot values are reduced to a simple qty.
 */
const convertToPdfData = (tableData) => {

  const columns = [
    { dataKey: 'isSquareOrder', header: "Square Order?" }, 
    { dataKey: 'rowKey', header: "Customer" }, 
    ...tableData.pivotColumnKeys.map(colKey => (
      { dataKey: colKey, header: colKey }
    ))
  ]

  const body = tableData.rows.map(row => 
    mapValues(value => typeof value === 'object'
      ? value.qty
      : truncate(value, { length: 16 })
    )(row)
  ) 
  
  return { columns, body }

}