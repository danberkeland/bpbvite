// define the "cart order" object.
//
// A 'cart order' can be thought of as the 'effective' order for a customer on a
// given date. It is built by combining items from the Order and Standing
// tables.
//
// A '(fulfillment) routed' order has some buisiness logic applied to it in 
// order to calculate some preferred, valid fulfillment route/method for each 
// item in the order. For future, we may write this computed value to order
// items to save computation and allow for alteratives.
//
// Routing logic may assign different routes to different items in the same
// cart order.
//
 

import { flatten, flow, groupBy, map, mapValues, sortBy, values } from "lodash/fp"
import { isoToDT } from "../../Pages/Production/NewPages/BPBN/utils"



/**When duplicates exist, pick the most recently updated item*/
const keyOrdersWithDupes = (itemList) => {

  const groupedItems = flow(
    groupBy(I => `${I.locNick}#${I.prodNick}`),
    mapValues(grp => sortBy(I => I.updatedOn || I.updatedAt)(grp)),
  )(itemList)

  /**@type {Object} */
  const keyedItems = mapValues(grp => grp[grp.length])(groupedItems)

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
 * @param {boolean} [includeHolding]
 */
const combineOrdersOnDates = (
  orderItems, 
  standingItems, 
  dates, 
  includeHolding=false,
) => {

  const dateTimes = dates.map(date => isoToDT(date))

  const { standing, holding } = 
    groupBy(I => I.isStand ? 'standing' : 'holding')(standingItems)

  const combinedOrdersWithDupesByDate = dateTimes.map(DT => {
    const delivDate = DT.toFormat('yyyy-MM-dd')
    const dayOfWeek = DT.toFormat('EEE')


    const [orderDict, orderDupes] = 
      keyOrdersWithDupes(orderItems.filter(I => I.delivDate === delivDate))

    const [standDict, standDupes] =
      keyOrdersWithDupes(standing.filter(I => I.dayOfWeek === dayOfWeek))

    const [holdDict, holdDupes] = 
      keyOrdersWithDupes(holding.filter(I => I.dayOfWeek === dayOfWeek))

    const _combined = includeHolding
      ? { ...holdDict, ...standDict, ...orderDict }
      : { ...holdDict, ...standDict }

    const combined = values(_combined).map(order => 
      ({ ...order, delivDate, dayOfWeek })
    )

    const dupes = [ ...orderDupes, ...standDupes, ...holdDupes]

    return [combined, dupes]
  })

  const combinedOrders = combinedOrdersWithDupesByDate.flatMap(item => item[0])
  const duplicateOrders = combinedOrdersWithDupesByDate.flatMap(item => item[1])
  
  return [combinedOrders, duplicateOrders]

}


