import { flatten, groupBy, keyBy, mapValues, sortBy, sumBy, uniqBy } from "lodash"
import { DateTime } from "luxon"
import { useMemo } from "react"

import { useListData } from "../../../../data/_listData"
import { getRouteOptions } from "../../../Ordering/Orders/data/productHooks"

// A hook to power all production/logistics reports. A bit overpowered for 
// some reports, but with programmatic routing we can view several reports
// without re-fetching data. 
//
// returns routed production orders for T+0 to T+7, relative to the
// input reportDate (yyyy-MM-dd formatted string)
//
// To keep the hook versatile, we avoid premature filtering.
//
// Holding orders are included for all dates, but can be omitted on the fly
// by filtering with 'isStand === false'.
//
// orders for bpbextras is included as well. 
//
// returns a flattened list of cart & standing items, souped-up with extra 
// indexes that allow for easy grouping/filtering.

// Possible future improvement could be to clean up the routeMeta object

const useT0T7ProdOrders = ({ shouldFetch, reportDate }) => {

  const { data:cart } = useListData({ tableName: "Order", shouldFetch })
  const { data:standing } = useListData({ tableName: "Standing", shouldFetch })

  const { data:PRD } = useListData({ tableName: "Product", shouldFetch })
  const { data:LOC } = useListData({ tableName: "Location", shouldFetch })
  const { data:RTE } = useListData({ tableName: "Route", shouldFetch })
  const { data:ZRT } = useListData({ tableName: "ZoneRoute", shouldFetch })

  const composeData = () => {
    if (!cart || !standing || !PRD || !LOC || !RTE || !ZRT) return undefined

    const products = keyBy(PRD, 'prodNick')
    const locations = keyBy(LOC, 'locNick')
    const routes = keyBy(RTE, 'routeNick')
    const zoneRoutes = sortBy(ZRT, 'routeStart')
  
    const reportDateDT = DateTime.fromFormat(
      reportDate, 'yyyy-MM-dd', { zone: 'America/Los_Angeles'}
    )

    const dateList = [0, 1, 2, 3, 4, 5, 6, 7].map(daysAhead => ({
      delivDate: reportDateDT.plus({ days: daysAhead }).toFormat('yyyy-MM-dd'),
      dayOfWeek: reportDateDT.plus({ days: daysAhead }).toFormat('EEE'),
      weekdayNum: reportDateDT.plus({ days: daysAhead }).toFormat('E') % 7,
      relDate: daysAhead
    }))
    
    console.log(dateList)
    const ordersByDate = dateList.map(dateObj => {
      const { delivDate, dayOfWeek, relDate, weekdayNum } = dateObj

      const cartDict = keyBy(
        cart.filter(C => C.delivDate === delivDate),
        item => `${item.locNick}#${item.prodNick}`
      )
      const standingDict = keyBy(
        standing.filter(S => S.isStand === true && S.dayOfWeek === dayOfWeek), 
        item => `${item.locNick}#${item.prodNick}`
      )
      const holdingDict = keyBy(
        standing.filter(S => S.isStand === false && S.dayOfWeek === dayOfWeek), 
        item => `${item.locNick}#${item.prodNick}`
      )

      const orders = { ...holdingDict, ...standingDict, ...cartDict }

      return Object.values(orders).map(order => {

        const routeMeta = getRouteOptions({
          product: products[order.prodNick],
          location: order.isWhole 
            ? locations[order.locNick]
            // Those pesky retail orders need a mock location set for them
            : {
              locNick: order.locNick, 
              locName: order.locNick, 
              latestFirstDeliv: 7, 
              latestFinalDeliv: 13,
              zoneNick: order.route === 'atownpick' ? 'atownpick' : 'slopick'
            },
          routeDict: routes,
          ZRT: zoneRoutes
        })[weekdayNum % 7][0]

        const delivLeadTime = 
          routeMeta.adjustedLeadTime - products[order.prodNick].leadTime
        const bakeRelDate = relDate - delivLeadTime

        return {
          ...order,
          delivDate,
          dayOfWeek,
          weekdayNum,
          relDate, // ...                                for col indexing
          routeMeta,
          bakeRelDate, // ...                            for filtering
          delivLeadTime,
          forBake: products[order.prodNick].forBake // for row indexing
        }
      }).filter(order => order.qty !== 0)
    })

    console.log(ordersByDate)
    return flatten(ordersByDate)
  }

  return { data: useMemo(composeData, [cart, standing, PRD, LOC, RTE, ZRT])}

}



export const useBpbsWtmData = ({ shouldFetch, reportRelDate }) => {
  if (![0, 1].includes(reportRelDate)) {
    console.error("What To Make only supported for today or tomorrow")
  }

  // Filters
  const isForCurrentDay = (order) => order.relDate === reportRelDate
  const isForNextDay = (order) => order.relDate === reportRelDate + 1

  const today = DateTime.now()
    .setZone('America/Los_Angeles')
    .startOf('day')
    .toFormat('yyyy-MM-dd')

  const { data:prodOrders } = useT0T7ProdOrders({ shouldFetch, reportDate: today })
  const { data:PRD } = useListData({ tableName: "Product", shouldFetch })

  const composeData = () => {
    if (!prodOrders || !PRD) return undefined

    const products = keyBy(PRD, 'prodNick')

    // assignListType makes a special exception for 
    // High French (prodNick: frfr), moving it from fresh to shelf.
    const { freezer=[], fresh=[], pretzel=[], shelf=[] } = groupBy( 
      prodOrders.map(order => ({
        ...order, 
        listType: assignListType(products[order.prodNick])
      })), 
      'listType'
    )

    const { freshOrders=[], northPockets=[] } = groupBy(
      fresh,
      order => shouldSendPocketsNorth(products[order.prodNick], order)
        ? 'northPockets'
        : 'freshOrders'
    )
    
    // *********
    // * FRESH *
    // *********

    const assignFreshCol = (order) => {

    }

    const _fresh = fresh.filter(order => 
      (isForCurrentDay(order) && order.delivLeadTime === 0 && !isHoldingOrder(order))
      || (isForNextDay(order) && order.delivLeadTime === 1)
    ).map(order => ({
      ...order,
      rowKey: order.forBake,
      colKey: isForNextDay(order) ? 'bag'
        : shouldSendPocketsNorth(products[order.prodNick], order) ? 'pocket'
        : 'deliv'
    }))

    const freshOrderCells = mapValues(
      groupBy(_fresh, order => `${order.rowKey}#${order.colKey}`), 
      group => ({
        rowKey: group[0].rowKey,
        colKey: group[0].colKey,
        totalPk: sumBy(group, 'qty'),
        totalEa: sumBy(group, order => order.qty * products[order.prodNick].packSize),
        items: group,
      })
    )

    // specially omit High St French from the list. It will show on the
    // shelf list.
    const freshProductForBakes = sortBy(uniqBy(
      PRD.filter(P => 
        isFreshProduct(P) && P.forBake !== "High French"
      ).map(P => P.forBake)
    ))
    
    const freshCellTemplate = { totalPk: 0, totalEa: 0, items: [] }
    const freshOrderData = freshProductForBakes.map(forBake => ({
      forBake,
      0: freshOrderCells[`${forBake}#0`] ?? { ...freshCellTemplate },              
      1: freshOrderCells[`${forBake}#1`] ?? { ...freshCellTemplate },          
    }))
    
    // *****************
    // * NORTH POCKETS *
    // *****************

    let northPocketCells = groupBy(
      northPockets.filter(order => isForCurrentDay(order) 
        && order.delivLeadTime === 0 
        && !isHoldingOrder(order)
      ),
      order => `${order.forBake}#${order.relDate - reportRelDate}`
    )
    northPocketCells = mapValues(
      northPocketCells, 
        group => ({
        forBake: group[0].forBake,
        delivLeadTime: group[0].delivLeadTime,
        totalPk: sumBy(group, 'qty'),
        totalEa: sumBy(group, order => order.qty * products[order.prodNick].packSize),
        items: group,
      })
    )
    
    const northPocketForBakes = sortBy(uniqBy(
      PRD.filter(P => canSendPocketsNorth(P)).map(P => P.forBake)
    ))
    const northPocketTemplate = { totalPk: 0, totalEa: 0, items: [] }
    const northPocketData = northPocketForBakes.map(forBake => ({
      forBake,
      0: northPocketCells[`${forBake}#0`] ?? { ...northPocketTemplate },              
    }))

    // *********
    // * SHELF *
    // *********

    // frfr should only be counted for the current day
    let shelfCells = groupBy(
      shelf.filter(order => 
        (isForCurrentDay(order) && !isHoldingOrder(order))
        || (isForNextDay(order) && !isFreshProduct(products[order.prodNick]))
      ),
      order => `${order.forBake}#${order.relDate - reportRelDate}`
    )
    shelfCells = mapValues(
      shelfCells, 
      group => ({
        forBake: group[0].forBake,
        delivLeadTime: group[0].delivLeadTime,
        totalPk: sumBy(group, order => 
          !isFreshProduct(products[order.prodNick]) ? order.qty : 0
        ),
        totalEa: sumBy(group, order =>
          !isFreshProduct(products[order.prodNick])
            ? order.qty * products[order.prodNick].packSize
            : 0
        ),
        freshTotalPk: sumBy(group, order => 
          isFreshProduct(products[order.prodNick]) ? order.qty : 0
        ),
        freshTotalEa: sumBy(group, order => 
          isFreshProduct(products[order.prodNick])
            ? order.qty * products[order.prodNick].packSize 
            : 0
        ),
        items: group,
      })
    )
    
    // Add High French to the list. It will be added specially with
    // regular french, always appearing as a 'need early' quantity.
    const shelfProductsByForBake = groupBy(
      PRD.filter(P => isShelfProduct(P) || P.forBake === 'High French'), 
      'forBake'
    )

    const shelfProductInfo = mapValues(
      shelfProductsByForBake,
      group => ({
        bakeExtra: sumBy(group, 'bakeExtra'),
        currentStock: sortBy(PRD, 'prodName')
          .find(P => P.forBake === group[0].forBake)
          ?.currentStock ?? 0,
        batchSize: sortBy(PRD, 'prodName')
          .find(P => P.forBake === group[0].forBake)
          .batchSize,
      })
    )
    const shelfProductForBakes = Object.keys(shelfProductInfo)

    const shelfTemplate = { 
      totalPk: 0, totalEa: 0, bakeExtra: 0, currentStock: 0, items: []
    }

    // we've produced this data in mostly the same manner as with fresh
    // products, but we need to go one step further...
    const shelfData = shelfProductForBakes.map(forBake =>  {
      return ({
        forBake,
        ...shelfProductInfo[forBake],
        0: { 
          ...shelfTemplate, 
          ...shelfCells[`${forBake}#0`],
        },
        1: { 
          ...shelfTemplate, 
          ...shelfCells[`${forBake}#1`],
        },
      })
    })

    // key 0 has today's orders. The Total Deliv column will show totalEa.
    // the Amt needed early will be 

    console.log(shelfData)

    return {
      freshOrderData,   
      northPocketData,
      shelfData
    }

  }

  return { data: useMemo(composeData, [prodOrders, PRD]) }

}

// Filter functions:
//
// Meant to work on order data produced by the useT0T7ProdOrders hook.
// That is, filters make use of custom attributes added to order data.
// If the hook changes, these filters may need to be updated.
//
// special attributes currently used:
//
// - order.routeMeta.routeNick

const isHoldingOrder = (order) => order.isStand === false

// const deliveryLeadTime = (order, product) => 
//   order.routeMeta.adjustedLeadTime - product.leadTime

const isFreshProduct = (product) => product.readyTime < 15
  && product.bakedWhere.includes("Prado")
  && product.packGroup !== "frozen pastries"
  && product.packGroup !== "baked pastries"
  && product.doughNick !== "Pretzel Bun"    // added to make mutually exclusive with pretzel products

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

const assignListType = (product) => {
  if (product.prodNick === 'frfr') return "shelf"
  if (isPretzelProduct(product)) return "pretzel" 
  if (isFreshProduct(product)) return "fresh"
  if (isShelfProduct(product)) return "shelf"
  if (isFreezerProduct(product)) return "freezer"
}






export const useBpbsWtmData2 = ({ shouldFetch, reportRelDate }) => {
  if (![0, 1].includes(reportRelDate)) {
    console.error("What To Make only supported for today or tomorrow")
  }

  // Filters
  const isForCurrentDay = (order) => order.relDate === reportRelDate
  const isForNextDay = (order) => order.relDate === reportRelDate + 1

  const today = DateTime.now()
    .setZone('America/Los_Angeles')
    .startOf('day')
    .toFormat('yyyy-MM-dd')

  const { data:prodOrders } = useT0T7ProdOrders({ shouldFetch, reportDate: today })
  const { data:PRD } = useListData({ tableName: "Product", shouldFetch })

  const composeData = () => {
    if (!prodOrders || !PRD) return undefined

    const products = keyBy(PRD, 'prodNick')

    // assignListType makes a special exception for 
    // High French (prodNick: frfr), moving it from fresh to shelf.
    const { freezer=[], fresh=[], pretzel=[], shelf=[] } = groupBy( 
      prodOrders.map(order => ({
        ...order, 
        listType: assignListType(products[order.prodNick])
      })), 
      'listType'
    )

    const { freshOrders=[], northPockets=[] } = groupBy(
      fresh,
      order => shouldSendPocketsNorth(products[order.prodNick], order)
        ? 'northPockets'
        : 'freshOrders'
    )
    
    // *********
    // * FRESH *
    // *********

    const _freshOrders = freshOrders.filter(order => 
      (isForCurrentDay(order) && order.delivLeadTime === 0 && !isHoldingOrder(order))
      || (isForNextDay(order) && order.delivLeadTime === 1)
    )

    //const freshRows

   
    return {
      _freshOrders
    }

  }

  return { data: useMemo(composeData, [prodOrders, PRD]) }

}