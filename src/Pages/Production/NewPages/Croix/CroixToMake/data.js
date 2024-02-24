import { DateTime } from "luxon";
import { useListData } from "../../../../../data/_listData";
import { flatten, groupBy, keyBy, mapValues, sortBy, sumBy } from "lodash";
import { useMemo } from "react";

import { getRouteOptions } from "../../../../Ordering/Orders/data/productHooks"

const croixBucketMap = {
  pl: 'pl', frpl: 'pl', al: 'pl', fral: 'pl',
  ch: 'ch', frch: 'ch',
  pg: 'pg', frpg: 'pg',
  sf: 'sf', frsf: 'sf',
  mb: 'mb', frmb: 'mb', unmb: 'mb',
  mini: 'mini', frmni: 'mini',
}
const countNicks = ['pl', 'ch', 'pg', 'sf', 'mini', 'mb']

const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
const dateList = [0, 1, 2, 3, 4, 5, 6, 7].map(daysAhead => {
  const dateDT = todayDT.plus({ days: daysAhead })

  return {
    relDate: daysAhead,
    delivDate: dateDT.toFormat('yyyy-MM-dd'),
    dayOfWeek: dateDT.toFormat('EEE'),
    weekdayNum: dateDT.toFormat('E')
  }

})

/**
 * @param {Object} input
 * @param {boolean} input.shouldFetch  
 */
export const useT0T7Data = ({ shouldFetch }) => {
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
    // console.log('zoneRoutes:', zoneRoutes.map(zr => ({
    //   zoneNick: zr.zoneNick,
    //   routeNick: zr.routeNick
    // })))

    const isCroissant = (prodNick) => {
      const { doughNick, packGroup } = products[prodNick]

      return doughNick === 'Croissant' 
        && ['baked pastries', 'frozen pastries'].includes(packGroup)
    }
    // console.log(PRD.filter(P => isCroissant(P.prodNick)).map(P => ({
    //   prodNick: P.prodNick,
    //   batchSize: P.batchSize,
    // })))

    const _cart = cart.filter(C => isCroissant(C.prodNick))
    const _standing = standing.filter(S => isCroissant(S.prodNick))

    const ordersByDate = dateList.map(dateObj => {
      const { delivDate, dayOfWeek, relDate, weekdayNum } = dateObj

      const cartDict = keyBy(
        _cart.filter(C => C.delivDate === delivDate),
        item => `${item.locNick}#${item.prodNick}`
      )
      const standingDict = keyBy(
        _standing.filter(S => S.isStand === true && S.dayOfWeek === dayOfWeek), 
        item => `${item.locNick}#${item.prodNick}`
      )
      const holdingDict = keyBy(
        _standing.filter(S => S.isStand === false && S.dayOfWeek === dayOfWeek), 
        item => `${item.locNick}#${item.prodNick}`
      )

      // console.log(cartDict)
      // console.log(standingDict)
      // console.log(holdingDict)

      // holding orders are only considered for future dates
      const orders = relDate === 0
        ? { ...standingDict, ...cartDict } 
        : { ...holdingDict, ...standingDict, ...cartDict }

      return Object.values(orders).map(order => ({
        ...order,
        countNick: croixBucketMap[order.prodNick],
        delivDate,
        dayOfWeek,
        weekdayNum,
        relDate,
        routeMeta: getRouteOptions({
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
      })).filter(order => order.locNick !== 'bpbextras') // WHYYYY?????????????? Just legacy code things.
    })

    // const orders = flatten(ordersByDate)
    // console.log("ORDERS:", orders)

    const frozenCroixProdNicks = PRD.filter(P => 
      P.doughNick === 'Croissant' && P.packGroup === 'frozen pastries'
        && P.prodNick !== 'fral'
    ).map(P => P.prodNick)

    const bakedCroixProdNicks = PRD.filter(P => 
      P.doughNick === 'Croissant' && P.packGroup === 'baked pastries'
        && P.prodNick !== 'al'
    ).map(P => P.prodNick)

    // console.log('frozenCroixProdNicks', frozenCroixProdNicks)
    // console.log('bakedCroixProdNicks', bakedCroixProdNicks)

    // relDate := the date relative to the current day (todayDT)
    //
    // We are calculating consumption totals for T+0 to T+4, but we need our
    // data to look ahead as far as T+7 to make that calculation.
    const frCroixConsumptionProjection = [0, 1, 2, 3, 4].map(relDate => {
      // non-almond frozen croix are consumed by current-day frozen orders.
      const T0Frozen = ordersByDate[relDate].filter(order =>
        frozenCroixProdNicks.includes(order.prodNick)        
      )

      // non-almond frozen croix are consumed by next-day baked orders.
      //
      // qty is tweaked to observe the 'split in half & round up' rule found in 
      // legacy setout functions, which applies only to backporch orders.
      const T1Baked = ordersByDate[relDate + 1].filter(order => 
        bakedCroixProdNicks.includes(order.prodNick)
      ).map(order => ({
        ...order,
        qty: order.locNick === "backporch"
          ? Math.ceil(order.qty / 2) * 2
          : order.qty,
      }))

      // frozen plains are set out for frozen almond orders 2 days ahead.
      const T2Fral = ordersByDate[relDate + 2].filter(order =>
        order.prodNick === 'fral'
      )

      // al (baked almond croissants):
      //
      // legacy rules say frozen plains are set out 2 days ahead for al orders
      // that are delivered from Prado (South), and 3 days ahead for al orders 
      // that are delivered from the Carlton (North)
      const T2SouthAl = ordersByDate[relDate + 2].filter(order =>
        order.prodNick === 'al' 
          && order.routeMeta.route.RouteDepart === "Prado"
      )
      const T3NorthAl = ordersByDate[relDate + 3].filter(order =>
        order.prodNick === 'al'
          && order.routeMeta.route.RouteDepart === "Carlton"
      )

      return [
        ...T0Frozen, ...T1Baked, ...T2Fral, ...T2SouthAl, ...T3NorthAl
      ].map(order => ({...order, countRelDate: relDate }))

    })

    const byCountNickByCountRelDate = groupBy(
      flatten(frCroixConsumptionProjection),
      order => `${order.countNick}#${order.countRelDate}`
    )

    // table cells hold all the order order records that were aggregated
    // in the totalQty
    const tableCells = mapValues(
      byCountNickByCountRelDate,  
      group => ({
        countNick: group[0].countNick,
        countRelDate: group[0].countRelDate,
        totalQty: sumBy(group, 'qty') * -1,
        items: group,
      })
    )

    const tableRows = sortBy(countNicks).map(countNick => {
      const { 
        freezerCount, freezerClosing, 
        freezerNorth, freezerNorthClosing, 
        sheetMake, batchSize,
      } = products[countNick]

      //console.log(freezerCount, freezerClosing, freezerNorth, freezerNorthClosing, sheetMake, batchSize)

      // packaging up the relevant tableCells for each countNick row
      const T = [0, 1, 2, 3, 4].map(countRelDate => 
        tableCells[`${countNick}#${countRelDate}`]  
      )

      // cumulative total CN is the sum of totalQtys for T0 to TN.
      const C = [0, 1, 2, 3, 4].map(countRelDate => {

        return {
          totalQty: sumBy(T.slice(0, countRelDate + 1), 'totalQty')
        }
      })

      return {
        countNick,
        freezerCount, freezerClosing,
        freezerNorth, freezerNorthClosing,
        sheetMake, batchSize,
        T, C
      }
    })

    return tableRows

  }

  return { data: useMemo(composeData, [cart, standing, PRD, LOC, RTE, ZRT])}
  
}

