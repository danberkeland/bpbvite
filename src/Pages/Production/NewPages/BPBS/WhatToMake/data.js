import { flatten, groupBy, keyBy,  sortBy, sumBy, uniqBy } from "lodash"
import { DateTime } from "luxon"
import { useMemo } from "react"

import { useListData } from "../../../../../data/_listData"
import { useT0T7ProdOrders } from "../../../../../data/useT0T7ProdOrders"

/** 'Rectified Linear Unit' function -- converts negative numbers to 0 */
const relu = (x) => x > 0 ? x : 0

// Filter Functions **********************************************************

const isHoldingOrder = (order) => order.isStand === false

// change from legacy version: exclude pretzel products
const isFreshProduct = (product) => product.readyTime < 15
  && product.bakedWhere.includes("Prado")
  && product.packGroup !== "frozen pastries"
  && product.packGroup !== "baked pastries"
  && product.doughNick !== "Pretzel Bun"    

const canSendPocketsNorth = (product) => isFreshProduct(product)
  && product.bakedWhere.includes("Carlton")
  && product.freezerThaw !== true;

const shouldSendPocketsNorth = (product, order) => 
  canSendPocketsNorth(product) 
    && order.routeMeta.routeNick === "Pick up Carlton"

const isBaggedProduct = (product) => product.bakedWhere.includes("Prado")
  && product.readyTime >= 15
  && product.packGroup !== "frozen pastries"
  && product.packGroup !== "baked pastries"
  && product.doughNick !== "Pretzel Bun"

const isShelfProduct = (product) => isBaggedProduct(product)
    && product.freezerThaw !== true;

const isFreezerProduct = (product) => isBaggedProduct(product)
    && product.freezerThaw === true

const isPretzelProduct = (product) => product.bakedWhere.includes("Prado")
  && product.doughNick === "Pretzel Bun" 



// note on naming conventions:
//
// T0 & T1 are used to mark the date relative to reportRelDate, which in turn
// is relative to the actual current date. The reportRelDate can be set to
// 0 or 1 generate lists for Today (for morning bakes) or for tomorrow
// (for exporting backups).
export const useBpbsWtmData = ({ shouldFetch, reportDate, reportRelDate }) => {
  if (![0, 1].includes(reportRelDate)) {
    console.error("What To Make only supported for today or tomorrow")
  }

  // const today = DateTime.now()
  //   .setZone('America/Los_Angeles')
  //   .startOf('day')
  //   .toFormat('yyyy-MM-dd')
  
  const { data:_prodOrders } = useT0T7ProdOrders({ shouldFetch, reportDate })
  const { data:_PRD } = useListData({ tableName: "Product", shouldFetch })

  const composeData = () => {
    if (!_prodOrders || !_PRD) return undefined

    const assignListType = (product) => {
      if (product.prodNick === 'frfr') return "shelf" // special exception
      if (isPretzelProduct(product)) return "pretzel"
      if (isFreshProduct(product)) return "fresh"
      if (isShelfProduct(product)) return "shelf"
      if (isFreezerProduct(product)) return "freezer"
      return "other"
    }

    const PRD = sortBy(_PRD, 'prodName')
      .map(P => ({ 
        ...P, 
        listType: assignListType(P),
        rowKey: P.prodNick === 'frfr' ? 'French' : P.forBake
      }))

    const products = keyBy(PRD, 'prodNick')

    const productsByRowKey = groupBy(
      PRD.filter(P => P.prodNick !== 'frfr'),
      'rowKey'
    )

    const tableRows = Object.values(productsByRowKey).map(rowKeyGroup => ({
      rowKey: rowKeyGroup[0].rowKey,
      listType: rowKeyGroup[0].listType,
      currentStock: rowKeyGroup[0].currentStock,
      preshaped: rowKeyGroup[0].preshaped,
      prepreshaped: rowKeyGroup[0].prepreshaped,
      bakeExtraTotal: sumBy(rowKeyGroup, 'bakeExtra'),
      productRep: rowKeyGroup[0],
    }))

    const { fresh, shelf, freezer, pretzel } = groupBy(
      tableRows,
      'listType'
    )

    const northPockets = fresh.filter(row => 
      canSendPocketsNorth(row.productRep)
    )

    // We only ever need to look at orders for the given day and the next day.
    // holding orders for the given date should be excluded.
    const __prodOrders = _prodOrders
      .filter(order => 
        (reportRelDate <= order.relDate || order.relDate <= reportRelDate + 2)
        && !(order.relDate === reportRelDate && isHoldingOrder(order)) 
      ).map(order => ({
        ...order, 
        listType: assignListType(products[order.prodNick]),
        rowKey: order.prodNick === 'frfr' 
          ? 'French' 
          : products[order.prodNick].forBake
      }))

    const prodOrders = sortBy(
      __prodOrders, 
      [
        'delivDate', 
        'routeMeta.route.routeStart', 'routeMeta.routeNick',
        'locNick', 
        'prodNick'
      ]
    )
    const ordersByRowKey = groupBy(prodOrders, 'rowKey')

    /** Convert pks to ea by multiplying by the product's pack size */
    const calcEa = (order) => order.qty * products[order.prodNick].packSize

    // delivLeadTime is calculated in the T0T7 hook:
    // * 0 means the order is baked on the delivDate
    // * 1 means the order is baked the day before the delivDate 

    // *************** North Pockets ***************
    const northPocketData = northPockets.map(row => {
      const orders = (ordersByRowKey[row.rowKey] ?? []).filter(order => 
        order.relDate === reportRelDate
        && order.delivLeadTime === 0
        && shouldSendPocketsNorth(products[order.prodNick], order)
      )
      return {
        ...row,
        makeTotalCol: {
          orders,
          totalEa: sumBy(orders, order => calcEa(order))
        }
      }
    })

    // *************** Fresh ***************
    const freshData = fresh.map(row => {
      const T0Orders = (ordersByRowKey[row.rowKey] || []).filter(order => 
        order.relDate === reportRelDate
        && order.delivLeadTime === 0
        && !shouldSendPocketsNorth(products[order.prodNick], order)
      )
      const T0TotalEa = sumBy(T0Orders, order => calcEa(order))

      const T1Orders = (ordersByRowKey[row.rowKey] || []).filter(order => 
        order.relDate === reportRelDate + 1
        && order.delivLeadTime === 1
        && !shouldSendPocketsNorth(products[order.prodNick], order)
      )
      const T1TotalEa = sumBy(T1Orders, order => calcEa(order))

      return {
        ...row,
        totalDelivCol: {
          orders: T0Orders,
          totalEa: T0TotalEa,
        },
        bagTomorrowCol: {
          orders: T1Orders,
          totalEa: T1TotalEa,
        },
        makeTotalCol: {
          orders: [...T0Orders, ...T1Orders],
          totalEa: T0TotalEa + T1TotalEa,
        }
      }

    })

    // *************** Shelf & Freezer ********************
    
    // same process/final structure for both shelf and freezer data, so we
    // map the process over each table
    const [shelfData, freezerData] = [shelf, freezer].map(table => 
      table.map(row => {
        const { batchSize, currentStock, packSize } = row.productRep
        const currentStockEa = (currentStock ?? 0) * packSize


        const { 
          'true.0':_T0Fresh=[], 
          'false.0':T0BaggedOrders=[],
          'false.1':T1BaggedOrders=[], 
        } = groupBy(
          ordersByRowKey[row.rowKey], 
          order => `${isFreshProduct(products[order.prodNick])}`
           + '.' + `${order.relDate - reportRelDate}`
        )

        const T0FreshOrders = _T0Fresh.filter(order => 
          order.delivLeadTime === 0
        )

        const T0FTotal = sumBy(T0FreshOrders, order => calcEa(order))
        const T0BTotal = sumBy(T0BaggedOrders, order => calcEa(order))
        const T1BTotal = sumBy(T1BaggedOrders, order => calcEa(order))

        const makeTotalNeededEa = 
          relu(T0BTotal + T1BTotal - currentStockEa) + T0FTotal

        const makeTotalwithExtrasEa = 
          makeTotalNeededEa + row.bakeExtraTotal

        const makeTotalRoundedEa = 
          Math.ceil(makeTotalwithExtrasEa / batchSize) * batchSize

        return {
          ...row,
          totalDelivCol: {
            orders: [...T0BaggedOrders, ...T0FreshOrders],
            totalEa: T0FTotal + T0BTotal,
          },
          needEarlyCol: {
            totalEa: relu(T0BTotal - currentStockEa) + T0FTotal
          },
          makeTotalCol: {
            orders: [...T0FreshOrders, ...T0BaggedOrders, ...T1BaggedOrders],
            baggedTotalEa: T0BTotal + T1BTotal,
            freshTotalEa: T0FTotal,
            baseTotalEa: makeTotalwithExtrasEa,
            extraTotalEa: makeTotalwithExtrasEa,
            totalEa: makeTotalRoundedEa,
          },
          _sums: {   
            currentStockEa,     
            T0FTotal,
            T0BTotal,
            T1BTotal,
          }
        }

      })
    )

    // *************** pretzel ********************
    
    const pretzelData = pretzel.map(row => {
      const rowOrders = ordersByRowKey[row.rowKey] || []

      const T0Bake = rowOrders.filter(order => 
        order.bakeRelDate === reportRelDate
      )
      const T0BakeTotalEa = sumBy(T0Bake, order => calcEa(order))

      const T1Bake = rowOrders.filter(order => 
        order.bakeRelDate === reportRelDate + 1
      )
      const T1BakeTotalEa = sumBy(T1Bake, order => calcEa(order))

      const T1DelayedOrders = T0Bake.filter(order => order.delivLeadTime === 1)

      const T1DelayedTotalEa = sumBy(T1DelayedOrders, order => calcEa(order))


      return {
        ...row,
        bakeCol: {
          orders: T0Bake,
          totalEa: T0BakeTotalEa,
        },
        shapeCol: {
          orders: T1Bake,
          totalEa: T1BakeTotalEa,
        },
        bagCol: {
          orders: T1DelayedOrders,
          totalEa: T1DelayedTotalEa,
        }
      }

    })

    // *************** French Pockets ********************

    const frenchPocketProductReps = sortBy(
      uniqBy(PRD.filter(P => P.doughNick === "French"), 'weight'),
      'weight'
    )
    // console.log("frenchPocketProductReps", frenchPocketProductReps)

    const frenchPocketRows = [
      ...northPocketData, ...freshData, ...shelfData
    ].filter(tableRow => tableRow.productRep.doughNick === "French")

    const frenchPocketRowsByWeight = groupBy(
      frenchPocketRows, 
      "productRep.weight"
    )

    const frenchPocketData = frenchPocketProductReps.map(P => {
      const pocketRows = frenchPocketRowsByWeight[P.weight]
      const orders = flatten(pocketRows.map(row => row.makeTotalCol.orders))

      const needTotalEa = sumBy(pocketRows, row => row.makeTotalCol.totalEa)

      return {
        prodNick: P.prodNick,
        weight: P.weight,
        preshaped: P.preshaped,
        prepreshaped: P.prepreshaped,
        needTodayCol: {
          totalEa: needTotalEa,
          orders
        },
        surplus: P.preshaped - needTotalEa
      }
    })

    // *************** BPBS Baguettes ********************

    // Look for baguette orders under BPB Extras. A negative qty signals that
    // baguettes should be baked on that date, mixed the day before, and
    // scaled 2 days prior. This minor amout of logic allows us to control
    // when to bake baguettes @ Prado through BPB Extras' orders.

    const bagBpbExtras = prodOrders.filter(order =>
      order.locNick === 'bpbextras' 
      && order.prodNick === 'bag'
      && order.qty < 0
    )

    const baguetteData = [{
      product: "Baguette (54 ea.)",
      bucket: bagBpbExtras.some(order => order.relDate === reportRelDate + 2)
        ? "YES" : "NO",
      mix: bagBpbExtras.some(order => order.relDate === reportRelDate + 1)
        ? "YES" : "NO",
      bake: bagBpbExtras.some(order => order.relDate === reportRelDate)
        ? "YES" : "NO",
    }]

    return {
      northPocketData,
      freshData,
      shelfData,
      freezerData,
      pretzelData,
      frenchPocketData,
      baguetteData,
    }
  }

  return { data: useMemo(composeData, [_prodOrders, _PRD, reportRelDate]) }

}