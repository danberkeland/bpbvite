import { DateTime } from "luxon"
import { useProducts } from "../../../data/product/useProducts"
import { CombinedRoutedOrder, useCombinedRoutedOrdersByDate } from "../../../data/production/useProductionData"
import { DBProduct } from "../../../data/types.d"
import { compareBy, groupByArrayRdc, groupByObject, keyBy, sumBy } from "../../../utils/collectionFns"
import { useMemo } from "react"

/**
 * @param {Object} input
 * @param {DateTime} input.bakeDT Query the correct orders by determining which date these orders will be baked, which will vary depending on the task
 * @param {boolean} [input.useHolding=false] For prep-type tasks, this should probably be set to true.
 * @param {'preshape'|'prepreshape'} [input.preshapeType='preshape'] - use 'preshape' when displaying for today, 'prepreshape' when displaying for tomorrow.
 */
export const useRusticData = ({ bakeDT, useHolding=false, preshapeType='preshape' }) => {
  const bakeDate = bakeDT.toFormat('yyyy-MM-dd')
  
  // We "know" that orders with a bake date B will have a delivery date
  // of B +0 or B +1.
  const { data:T0Orders } = useCombinedRoutedOrdersByDate({ delivDT: bakeDT.plus({ days: 0 }), useHolding })
  const { data:T1Orders } = useCombinedRoutedOrdersByDate({ delivDT: bakeDT.plus({ days: 1 }), useHolding })
  const { data:PRD }      = useProducts({ shouldFetch: true })

  // *** Filter/Query functions ***

  const testIsRustic = (/** @type {DBProduct} */ product) => 1
    && ["rustic breads", "retail"].includes(product.packGroup)
    && product.doughNick !== "French"

  const calculateBakeDate = (/** @type {CombinedRoutedOrder} */ order) => 
    order.meta.routePlan.steps[0].begin.date

  const testIsNeededEarly = (/** @type {CombinedRoutedOrder} */ order) => 
    ["AM North", "Pick up Carlton"].includes(order.meta.routeNick)

  
  // ******************
  // * Main Transform *
  // ******************

  const calculateRustics = () => {
    if (!T0Orders || !T1Orders || !PRD) return undefined

    const sortedPRD = PRD.sort(compareBy(P => P.prodName))
    const products = keyBy(PRD, P => P.prodNick)

    const { false:orders=[], true:unroutedOrders=[] } = groupByObject(
      [...T0Orders, ...T1Orders],
      order => order.meta.routeNick === "NOT ASSIGNED"
    )
    if (unroutedOrders.length) console.warn("Unrouted Orders:", unroutedOrders)

    // *** Pipeline Functions ***

    const shouldInclude = order => 1
      && testIsRustic(products[order.prodNick]) === true
      && calculateBakeDate(order) === bakeDate

    const toFormattedRow = rowOrders => {
      const { forBake, doughNick, weight } = 
        sortedPRD.find(P => P.prodNick === rowOrders[0].prodNick) ?? {}

      const representativeProduct = sortedPRD.find(P => P.forBake === forBake)  // the product that holds preshaped, prepreshaped values for all items with the same forBake

      const shaped = preshapeType === 'preshape' 
        ? representativeProduct?.preshaped ?? 0
        : representativeProduct?.prepreshaped ?? 0

      const qty = sumBy(rowOrders, order => order.qty * products[order.prodNick].packSize)

      const short = shaped - qty
      const shortText = short > 0 ? `Over ${short}`
        : short < 0 ? `Short ${short * -1}`
        : ''

      const earlyItems = rowOrders.filter(order => testIsNeededEarly(order))
      const earlyQty = sumBy(earlyItems, order => order.qty * products[order.prodNick].packSize)

      return {
        forBake,
        representativeProdNick: representativeProduct?.prodNick,
        doughNick,
        weight,
        items:  rowOrders,
        qty,
        shaped,
        short: shortText,
        earlyItems,
        earlyQty,
      }

    }

    // *** Pipeline ***

    return orders
      .filter(order => shouldInclude(order))
      .sort(compareBy(order => order.meta.routeNick))
      .sort(compareBy(order => order.meta.route.routeStart))
      .sort(compareBy(order => order.delivDate))
      .reduce(groupByArrayRdc(order => products[order.prodNick].forBake), [])
      .map(rowOrders => toFormattedRow(rowOrders))
      .sort(compareBy(row => row.forBake))
      .sort(compareBy(row => row.doughNick))

  }

  return { data: useMemo(calculateRustics, [T0Orders, T1Orders, PRD, bakeDate, preshapeType] )}

}

