
import { groupByArray } from "./collectionFns/groupByArray"
import { groupByArrayIsEqual } from "./collectionFns/groupByArrayIsEqual"
import { uniqBy } from "./collectionFns/uniqBy"
import { mapValues } from "./objectFns/mapValues"

// Not sure if this kinds of type documentation 
// is going to create good autocompletion...

/**
 * @typedef {Object} TableItem
 */

/**
 * @typedef {keyof TableItem} TableItemKey
 */

/**
 * @typedef {TableItem[]} TableData
 */


/**
 * @typedef {{ value: (number|string|boolean|null), items: Object[] }} PivotColumnValue
 */

/**
 * @typedef {Object.<[k: string], PivotColumnValue>} PivotColumns 
 */

/**
 * @typedef {{ rowKey: string, columns: PivotColumns }} PivotRow
 */
/**
 * @typedef {PivotRow[]} PivotTable
 */

/**
 * 
 * @param {TableData} data 
 * @param {TableItemKey} rowPartitionAttribute
 * @param {TableItemKey} pivotColumnAttribute
 * @param {(o: Object[]) => (number|string|boolean|null)} [valueFn] - Function that aggregates cell items to a single (displayable) value -- e.g. sumBy, countBy, first value...
 * @returns {PivotTable}
 */
export function tablePivotSimple(
  data, 
  rowPartitionAttribute, 
  pivotColumnAttribute,
  valueFn=(() => null),  
) {
  if (rowPartitionAttribute === pivotColumnAttribute) {
    console.warn("Row and Column attribute args must be different")
    return []
  }

  // template lets us make sure all pivot 
  // column attributes are present in all rows.
  // Sparse data can be hard to work with.
  const pivotColumnsTemplate = Object.fromEntries(
    uniqBy(data, item => item[pivotColumnAttribute])
      .map(item => [item[pivotColumnAttribute], { items: [], value: null }])
  )

  const partitionByRowKey = items => groupByArray(items, item => item[rowPartitionAttribute])
  const partitionByColKey = items => groupByArray(items, item => item[pivotColumnAttribute])

  const partedRows = partitionByRowKey(data)

  /**@type {PivotTable} */
  const pivotedRows = partedRows.map(rowGroup => {

    const pivotData = Object.fromEntries(
      partitionByColKey(rowGroup).map(colGroup => [
        colGroup[0][pivotColumnAttribute], 
        { 
          items: colGroup, 
          value: valueFn(colGroup) 
        },
      ])
    )

    return {
      rowKey: rowGroup[0][rowPartitionAttribute],
      columns: {
        ...pivotColumnsTemplate,
        ...pivotData
      }
    }

  })

  return pivotedRows

}

/** @typedef {Object<[k: string], (number | string | boolean | null)>} ObjectSimple */
/** @typedef {(a: any) => number | string | boolean | null} IterFn */
/** 
 * @typedef {Object<[k:string], (a: any) => number | string | boolean | null>} RowPartitionModel */

/**
 * @template T
 * @param {T[]} data 
 * @param {RowPartitionModel} rowPartitionModel 
 * @param {string} pivotColumnAttribute 
 * @param {(a: any[]) => (number | string | boolean)} valueFn 
 * @returns 
 */
export function tablePivot(
  data, 
  rowPartitionModel, 
  pivotColumnAttribute, 
  valueFn
) {

  const pivotColumnsTemplate = Object.fromEntries(
    uniqBy(data, item => item[pivotColumnAttribute])
      .map(item => [item[pivotColumnAttribute], { items: [], value: null }])
  )
  console.log("pivotColumnsTemplate", pivotColumnsTemplate)
  

  const preppedRows = data.map(row => ({
    rowProps: mapValues(rowPartitionModel, iterFn => iterFn(row)),
    row,
  }))

  const partitionedRows = groupByArrayIsEqual(preppedRows, row => row.rowProps)

  const pivotedRows = partitionedRows.map(rowGroup => {

    const pivotData = Object.fromEntries(
      groupByArray(
        rowGroup.map(row => row.row), 
        item => item[pivotColumnAttribute]
      ).map(colGroup => [
        colGroup[0][pivotColumnAttribute], 
        { 
          items: colGroup.map(row => row.row), 
          value: valueFn(colGroup) 
        },
      ])
    )

    // console.log(pivotData)
    return {
      rowProps: rowGroup[0].rowProps,
      colProps: {
        ...pivotColumnsTemplate,
        ...pivotData,
      }
    }
  })

  return pivotedRows

}


/**
 * Standard pivot creates nested row structures to separate row & column namespaces,
 * and to allow pivot cells to retain item records that correspond to their aggregated value.
 * 
 * This flattening function, well, flattens the rows. Column props have their values reduced to just the aggregate value.
 * 
 * WARNING: function does not handle collisions between row property keys and column property keys.
 */
export function tablePivotFlatten(pivotData) {

  return pivotData.map(pivotRow => {
    return { 
      ...pivotRow.rowProps, 
      ...mapValues(pivotRow.colProps, item => item.value) 
    }
  })
}