// Combined orders are where we start when collecting info from the Order and
// Standing tables for production/ordering/billing purposes. They are a mostly
// 'raw' representation of customer's effective orders for a given date; the
// only augmentation is we ensure that items have both delivDate and dayOfWeek 
// attributes with equivalent values.
//
// The main point is to apply 'override' logic so that when holding, standing,
// and cart items collide on the same order, we pick the correct one to 
// represent the customer's order state.
//
// We want to be able to apply this logic to batches of order data that may span
// multiple customers and dates. Data remains organized as a flat array of
// objects.
//
// From here, we can apply further transformations for more specific purposes.
//
// Note: holding orders are always included at this stage! They can be filtered
// out later if the context requires it.
//
// If something strange happens in the database, we may get duplicate items
// (e.g. same customer / date / product). We build in a rule that says the
// most recently updated item is the 'correct' one. If duplicates are
// encountered, we return them as a separate flat list. If desired, we can
// use that data to trigger automatic deletions.


import { flatten, flow, groupBy, map, mapValues, sortBy, values } from "lodash/fp"
import { getTodayDT, isoToDT } from "../../Pages/Production/NewPages/BPBN/utils"
import { useListData } from "../_listData"
import { useMemo } from "react"


/**When duplicates exist, pick the most recently updated item*/
const keyOrdersWithDupes = (delivDate, itemList) => {

  const groupedItems = flow(
    groupBy(I => `${delivDate}#${I.locNick}#${I.prodNick}`),
    mapValues(grp => sortBy(I => I.updatedOn || I.updatedAt)(grp)),
  )(itemList)
  //console.log('groupedItems', groupedItems)

  /**@type {Object} */
  const keyedItems = mapValues(grp => grp[grp.length - 1])(groupedItems)

  /**@type {Object[]} */
  const dupeItems = flow(
    values,
    map(grp => grp.slice(0, -1)),
    flatten
  )(groupedItems)

  return [keyedItems, dupeItems]

}

/**
 * Compiles order & standing data.
 * @param {Object[]} orderItems - as produced from querying Order table
 * @param {Object[]} standingItems - as produced from querying Standing table
 * @param {string[]} dates - list of 'yyyy-MM-dd' date strings.
 */
const combineOrdersOnDates = (
  orderItems, 
  standingItems, 
  dates, 
) => {

  const dateTimes = dates.map(date => isoToDT(date))

  const { standing=[], holding=[] } = 
    groupBy(I => I.isStand ? 'standing' : 'holding')(standingItems)

  const combinedOrdersWithDupesByDate = dateTimes.map(DT => {
    const delivDate = DT.toFormat('yyyy-MM-dd')
    const dayOfWeek = DT.toFormat('EEE')

    const [orderDict, orderDupes] = 
      keyOrdersWithDupes(delivDate, orderItems.filter(I => I.delivDate === delivDate))

    const [standDict, standDupes] =
      keyOrdersWithDupes(delivDate, standing.filter(I => I.dayOfWeek === dayOfWeek))

    const [holdDict, holdDupes] = 
      keyOrdersWithDupes(delivDate, holding.filter(I => I.dayOfWeek === dayOfWeek))

    const combined = values({ ...holdDict, ...standDict, ...orderDict })
      .map(order => ({ ...order, delivDate, dayOfWeek }))
    
    const dupes = [ ...orderDupes, ...standDupes, ...holdDupes ]

    return [combined, dupes]

  })

  const combinedOrders = combinedOrdersWithDupesByDate.flatMap(item => item[0])
  const duplicateOrders = combinedOrdersWithDupesByDate.flatMap(item => item[1])
  
  return [combinedOrders, duplicateOrders]

}

export const useCombinedOrders = ({ shouldFetch=true }) => {
  const todayDT = getTodayDT()
  const dates = [0,1,2,3,4,5,6].map(daysAhead => 
    todayDT.plus({ days: daysAhead}).toFormat('yyyy-MM-dd')
  )

  const { data:ORD } = useListData({ 
    tableName: "Order", 
    shouldFetch, 
  })
  const { data:STND } = useListData({ 
    tableName: "Standing", 
    shouldFetch,
  })

  const [combinedOrders, duplicateOrders] = 
    combineOrdersOnDates(ORD ?? [], STND ?? [], dates)

  if (duplicateOrders.length) {
    console.warn('duplicates found:', duplicateOrders)
  }

  return combinedOrders

}

// query doesnt seem to be working...

// export const useCombinedOrdersByLocNickByDelivDate = ({
//   locNick, delivDate, shouldFetch=true
// }) => {
//   const dayOfWeek = isoToDT(delivDate).toFormat('EEE')
//   console.log(locNick, delivDate, dayOfWeek)

//   const { data:ORD } = useListData({ 
//     tableName: "Order", 
//     customQuery: "orderByLocByDelivDate",
//     variables: { locNick, delivDate, limit: 5000 },
//     shouldFetch, 
//   })
//   const { data:STND } = useListData({ 
//     tableName: "Standing", 
//     customQuery: "standingByLocByDayOfWeek",
//     variables: { locNick, dayOfWeek, limit: 5000 },
//     shouldFetch,
//   })

//   console.log(ORD, STND)
//   const [combinedOrders, duplicateOrders] = 
//     combineOrdersOnDates(ORD ?? [], STND ?? [], [delivDate])

//   if (duplicateOrders.length) {
//     console.warn('duplicates found:', duplicateOrders)
//   }

//   return combinedOrders

// }

export const useCombinedOrdersByDelivDate = ({
  delivDate, shouldFetch=true
}) => {
  const dayOfWeek = isoToDT(delivDate).toFormat('EEE')

  const { data:ORD } = useListData({ 
    tableName: "Order", 
    customQuery: "orderByDelivDate",
    variables: { delivDate, limit: 5000 },
    shouldFetch, 
  })
  const { data:STND } = useListData({ 
    tableName: "Standing", 
    customQuery: "standingByDayOfWeek",
    variables: { dayOfWeek, limit: 5000 },
    shouldFetch,
  })

  const [combinedOrders, duplicateOrders] = 
    combineOrdersOnDates(ORD ?? [], STND ?? [], [delivDate])

  if (duplicateOrders.length) {
    console.warn('duplicates found:', duplicateOrders)
  }

  return combinedOrders

}


export const useCombinedOrdersByLoc = ({ locNick, shouldFetch=true }) => {
  const todayDT = getTodayDT()


  const { data:ORD } = useListData({ 
    tableName: "Order", 
    customQuery: "orderByLocByDelivDate",
    variables: { locNick, limit: 5000 },
    shouldFetch, 
  })
  const { data:STND } = useListData({ 
    tableName: "Standing", 
    customQuery: "standingByLocByDayOfWeek",
    variables: { locNick, limit: 5000 },
    shouldFetch,
  })


  // if (duplicateOrders.length) {
  //   console.warn('duplicates found:', duplicateOrders)
  // }

  const calculateValue = () => {
    if (!ORD || !STND) return undefined

    const dates = [0,1,2,3,4,5,6,7].map(daysAhead => 
      todayDT.plus({ days: daysAhead }).toFormat('yyyy-MM-dd')
    )
    return combineOrdersOnDates(ORD, STND, dates)

  }

  // [combinedOrders, duplicateOrders]
  return useMemo(calculateValue, [ORD, STND])

}


