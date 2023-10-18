import { flatten, keyBy,  sortBy } from "lodash"
import { DateTime } from "luxon"
import { useMemo } from "react"

import { useListData } from "./_listData"
import { getRouteOptions } from "../Pages/Ordering/Orders/data/productHooks"

// A hook to power all production/logistics reports. A bit overpowered for 
// some reports, but with programmatic routing we can view several reports
// without re-fetching data. 
//
// returns routed production orders for T+0 to T+7, relative to the
// input reportDate (a yyyy-MM-dd formatted string)
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
export const useT0T7ProdOrders = ({ shouldFetch, reportDate }) => {

  const { data:cart } = useListData({ tableName: "Order", shouldFetch })
  const { data:standing } = useListData({ tableName: "Standing", shouldFetch })

  const { data:PRD } = useListData({ tableName: "Product", shouldFetch })
  const { data:LOC } = useListData({ tableName: "Location", shouldFetch })
  const { data:RTE } = useListData({ tableName: "Route", shouldFetch })
  const { data:ZRT } = useListData({ tableName: "ZoneRoute", shouldFetch })

  const calculateValue = () => {
    if (!cart || !standing || !PRD || !LOC || !RTE || !ZRT) return undefined

    console.log("cart length:", cart.length)
    console.log("standing length:", standing.length)

    const reportDateDT = DateTime.fromFormat(
      reportDate, 'yyyy-MM-dd', { zone: 'America/Los_Angeles'}
    )
    const dateList = makeDateList({ startDateDT: reportDateDT, nDays:8 })

    return combineOrdersOnDates({ 
      dateList, cart, standing, PRD, LOC, RTE, ZRT 
    })

  }

  return { 
    data: useMemo(
      calculateValue, 
      [reportDate, cart, standing, PRD, LOC, RTE, ZRT]
    )
  }

}



/** report date in yyyy-MM-dd format */
export const useProdOrdersByDate = ({ reportDate, shouldFetch }) => {

  const dayOfWeek = DateTime.fromFormat(
    reportDate, 
    'yyyy-MM-dd', 
    { zone: 'America/Los_Angeles'}
  ).toFormat('EEE')

  const { data:cart } = useListData({ 
    tableName: "Order", 
    customQuery: "orderByDelivDate",
    variables: { delivDate: reportDate, limit: 5000 },
    shouldFetch 
  })
  const { data:standing } = useListData({ 
    tableName: "Standing", 
    customQuery: "standingByDayOfWeek",
    variables: { dayOfWeek: dayOfWeek, limit: 5000 },
    shouldFetch,
  })

  const { data:PRD } = useListData({ tableName: "Product", shouldFetch })
  const { data:LOC } = useListData({ tableName: "Location", shouldFetch })
  const { data:RTE } = useListData({ tableName: "Route", shouldFetch })
  const { data:ZRT } = useListData({ tableName: "ZoneRoute", shouldFetch })

  const calculateValue = () => {
    if (!cart || !standing || !PRD || !LOC || !RTE || !ZRT) return undefined

    console.log("cart length:", cart.length)
    console.log("standing length:", standing.length)

    const reportDateDT = DateTime.fromFormat(
      reportDate, 'yyyy-MM-dd', { zone: 'America/Los_Angeles'}
    )
    const dateList = makeDateList({ startDateDT: reportDateDT, nDays:1 })

    return combineOrdersOnDates({ 
      dateList, cart, standing, PRD, LOC, RTE, ZRT 
    })

  }

  return { 
    data: useMemo(
      calculateValue, 
      [reportDate, cart, standing, PRD, LOC, RTE, ZRT]
    )
  }

}



/** 
 * Make a list of dates in various formats starting from the start date,
 * spanning the specified number of days. This helps label group cart and
 * standing orders consistenly so that they can be combined appropriately
 * into "an order".
 */
const makeDateList = ({ startDateDT, nDays }) => {
  
  return [...Array(nDays).keys()].map(daysAhead => ({
    delivDate: startDateDT.plus({ days: daysAhead }).toFormat('yyyy-MM-dd'),
    dayOfWeek: startDateDT.plus({ days: daysAhead }).toFormat('EEE'),
    weekdayNum: startDateDT.plus({ days: daysAhead }).toFormat('E') % 7,
    relDate: daysAhead,
  }))
}

/**
 * Standing data and cart data for matching days need to be present
 * to combine correctly.
*/
const combineOrdersOnDates = ({ 
  dateList, cart, standing, PRD, LOC, RTE, ZRT 
}) => {

  const products = keyBy(PRD, 'prodNick')
  const locations = keyBy(LOC, 'locNick')
  const routes = keyBy(RTE, 'routeNick')
  const zoneRoutes = sortBy(ZRT, 'routeStart')

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

      // simulate a pickup location for retail orders, or when a deliv customer
      // chooses a pickup alternate option
      const pickupOverride = {
        locNick: order.locNick, 
        locName: order.locNick, 
        latestFirstDeliv: 7, 
        latestFinalDeliv: 13,
        zoneNick: order.route === 'atownpick' ? 'atownpick' : 'slopick'
      }

      const routeMeta = getRouteOptions({
        product: products[order.prodNick],
        location: order.isWhole && order.route === 'deliv' 
          ? locations[order.locNick]
          : pickupOverride,
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
        relDate,
        routeMeta,
        bakeRelDate,
        delivLeadTime,
        forBake: products[order.prodNick].forBake
      }
    }).filter(order => order.qty !== 0)

  })

  return flatten(ordersByDate)

}