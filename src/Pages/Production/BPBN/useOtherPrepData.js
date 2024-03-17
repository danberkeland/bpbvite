import { DateTime } from "luxon"
import { useProducts } from "../../../data/product/useProducts"
import { CombinedRoutedOrder, useCombinedRoutedOrdersByDate } from "../../../data/production/useProductionData"
import { DBProduct } from "../../../data/types.d"
import { compareBy, groupByArrayRdc, groupByObject, keyBy, sumBy } from "../../../utils/collectionFns"
import { useMemo } from "react"

/**
 * Despite being called 'prep', this list describes a baking task, so in most
 * cases the bake date will be the same as the delivery date.
 * 
 * Holding orders not included
 * @param {Object} input
 * @param {DateTime} input.bakeDT Query the correct orders by determining which date these orders will be baked, which will vary depending on the task
 */
export const useOtherPrepData = ({ bakeDT }) => {
  const bakeDate = bakeDT.toFormat('yyyy-MM-dd')
  
  const { data:T0Orders } = useCombinedRoutedOrdersByDate({ delivDT: bakeDT.plus({ days: 0 }), useHolding: false })
  const { data:T1Orders } = useCombinedRoutedOrdersByDate({ delivDT: bakeDT.plus({ days: 1 }), useHolding: false })
  const { data:PRD }      = useProducts({ shouldFetch: true })

  // *** Filter/Query functions ***

  const calculateBakeDate = (/** @type {CombinedRoutedOrder} */ order) =>
    order.meta.routePlan.steps[0].begin.date

  const calculateBakePlace = (/** @type {CombinedRoutedOrder} */ order) =>
    order.meta.routePlan.steps[0].end.place

  const testIsOtherPrepPastry = (/** @type {DBProduct} */ product) => 1
    && ["baked pastries", "frozen pastries"].includes(product.packGroup)
    && product.doughNick !== "Croissant"

  const testIsFocaccia = (/** @type {DBProduct} */ product) => 
    product.doughNick === "Ciabatta"

  // ******************
  // * Main Transform *
  // ******************

  const calculateOtherPrep = () => {
    if (!T0Orders ||!T1Orders || !PRD) return undefined

    const products = keyBy(PRD, P => P.prodNick)

    const { false:orders=[], true:unroutedOrders=[] } = groupByObject(
      [...T0Orders, ...T1Orders],
      order => order.meta.routeNick === "NOT ASSIGNED"
    )
    if (unroutedOrders.length) console.warn("Unrouted Orders:", unroutedOrders)

    // *** Pipeline Functions ***

    const shouldInclude = (order) => 1
      && calculateBakeDate(order)  === bakeDate
      && calculateBakePlace(order) === "Carlton" // Means the product can be prepped at the carlton, and the actual order WILL be prepped at the carlton
      && (0
        || testIsOtherPrepPastry(products[order.prodNick]) === true
        || testIsFocaccia(products[order.prodNick]) === true
      )

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
      .reduce(groupByArrayRdc(order => order.prodNick), [])
      .map(rowOrders => formatRow(rowOrders))
      .sort(compareBy(row => row.prodName))

  }

  return { data: useMemo(calculateOtherPrep, [T0Orders, T1Orders, PRD, bakeDate]) }

}