import { DateTime } from "luxon"
import { useProducts } from "../../../data/product/useProducts"
import { CombinedRoutedOrder, useCombinedRoutedOrdersByDate } from "../../../data/production/useProductionData"
import { DBProduct } from "../../../data/types.d"
import { compareBy, groupByArrayRdc, groupByObject, keyBy, sumBy } from "../../../utils/collectionFns"
import { useMemo } from "react"

/**
 * Despite being called 'prep', this list describes a baking task, so in most
 * cases the bake date will be the same as the delivery date.
 * @param {Object} input
 * @param {DateTime} input.bakeDT Query the correct orders by determining which date these orders will be baked, which will vary depending on the task
 */
export const useCroixSetoutData = ({ bakeDT }) => {
  const bakeDate = bakeDT.toFormat('yyyy-MM-dd')
  
  // With current setup, we should expect baking & delivery to 
  // always land on the same day, but we'll keep the look-ahead just incase.
  const { data:T0Orders } = useCombinedRoutedOrdersByDate({ delivDT: bakeDT.plus({ days: 0 }), useHolding: true })
  const { data:T1Orders } = useCombinedRoutedOrdersByDate({ delivDT: bakeDT.plus({ days: 1 }), useHolding: true })
  const { data:PRD }      = useProducts({ shouldFetch: true })

  // *** Filter/Query functions ***

  const calculateBakeDate = (/** @type {CombinedRoutedOrder} */ order) =>
    order.meta.routePlan.steps[0].begin.date

  const calculateBakePlace = (/** @type {CombinedRoutedOrder} */ order) =>
    order.meta.routePlan.steps[0].end.place

  const testIsSetoutPastry = (/** @type {DBProduct} */ product) => 1
    && product.packGroup === "baked pastries"
    && product.doughNick === "Croissant"
    && product.prodNick  !== "al"

  // ******************
  // * Main Transform *
  // ******************

  const calculateCroixSetout = () => {
    if (!T0Orders ||!T1Orders || !PRD) return undefined

    const products = keyBy(PRD, P => P.prodNick)

    const { false:orders=[], true:unroutedOrders=[] } = groupByObject(
      [...T0Orders, ...T1Orders],
      order => order.meta.routeNick === "NOT ASSIGNED"
    )
    if (unroutedOrders.length) console.warn("Unrouted Orders:", unroutedOrders)

    // *** Pipeline Functions ***

    const shouldInclude = (/** @type {CombinedRoutedOrder} */ order) => 1
      && calculateBakeDate(order)  === bakeDate
      && calculateBakePlace(order) === "Carlton" // Means the product CAN be prepped at the carlton, and the actual order WILL be prepped at the carlton
      && testIsSetoutPastry(products[order.prodNick]) === true

    const adjustBackporchQty = order => order.locNick === 'backporch'
      ? { ...order, qty: Math.ceil(order.qty / 2) }
      : order

    const formatRow = rowOrders => {
      const { prodNick, prodName, packSize } = products[rowOrders[0].prodNick]

      return {
        prodNick,
        prodName,
        items: rowOrders,
        qty: sumBy(rowOrders, order => order.qty * packSize)
      }

    }
    
    // *** Pipline ***

    return orders
      .filter(order => shouldInclude(order))
      .map(order => adjustBackporchQty(order))
      .reduce(groupByArrayRdc(order => order.prodNick), [])
      .map(rowOrders => formatRow(rowOrders))
      .sort(compareBy(row => row.prodName))

  }

  return { data: useMemo(calculateCroixSetout, [T0Orders, T1Orders, PRD, bakeDate]) }

}