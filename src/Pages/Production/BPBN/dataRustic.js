import { CombinedRoutedOrder } from "../../../data/production/useProductionData"

import { DBProduct } from "../../../data/types.d"
import { compareBy, groupByArrayRdc, keyBy, sumBy } from "../../../utils/collectionFns"

// import { useMemo } from "react"
// import { DateTime } from "luxon"
// import { useProducts } from "../../../data/product/useProducts"
// import { useCombinedRoutedOrdersByDate } from "../../../data/production/useProductionData"
// /**
//  * @param {Object} input
//  * @param {DateTime} input.bakeDT Query the correct orders by determining which date these orders will be baked, which will vary depending on the task
//  * @param {boolean} [input.useHolding=false] For prep-type tasks, this should probably be set to true.
//  * @param {'preshape'|'prepreshape'} [input.preshapeType='preshape'] - use 'preshape' when displaying for today, 'prepreshape' when displaying for tomorrow.
//  */
// export const useRusticData = ({ bakeDT, useHolding=false, preshapeType='preshape' }) => {
//   const bakeDate = bakeDT.toFormat('yyyy-MM-dd')
  
//   // We "know" that orders with a bake date B +0 will have a delivery date
//   // of B +0 or B +1.
//   const { data:T0Orders } = useCombinedRoutedOrdersByDate({ delivDT: bakeDT.plus({ days: 0 }), useHolding })
//   const { data:T1Orders } = useCombinedRoutedOrdersByDate({ delivDT: bakeDT.plus({ days: 1 }), useHolding })
//   const { data:PRD }      = useProducts({ shouldFetch: true })

//   return { 
//     data: useMemo(
//       () => calculateRustics(T0Orders, T1Orders, PRD, bakeDate, preshapeType), 
//       [T0Orders, T1Orders, PRD, bakeDate, preshapeType] 
//     )
//   }

// }

/**
 * @param {CombinedRoutedOrder[] | undefined} T0Orders 
 * @param {CombinedRoutedOrder[] | undefined} T1Orders 
 * @param {DBProduct[] | undefined} PRD 
 * @param {string} bakeDate 
 * @param {'preshape'|'prepreshape'} preshapeType
 */
export const calculateRustics = (T0Orders, T1Orders, PRD, bakeDate, preshapeType) => {
  if (!T0Orders || !T1Orders || !PRD) return undefined

  const sortedPRD = PRD.sort(compareBy(P => P.prodName))
  const products = keyBy(PRD, P => P.prodNick)

  
  //  Filter/Query functions
  // ========================
  const testIsRustic = (/** @type {DBProduct} */ product) => 1
    && ["rustic breads", "retail"].includes(product.packGroup)
    && product.doughNick !== "French"

  const calculateBakeDate = (/** @type {CombinedRoutedOrder} */ order) => 
    order.meta.routePlan.steps[0].begin.date

  const testIsNeededEarly = (/** @type {CombinedRoutedOrder} */ order) => 
    ["AM North", "Pick up Carlton"].includes(order.meta.routeNick)

  const shouldInclude = order => 1
    && testIsRustic(products[order.prodNick]) === true
    && calculateBakeDate(order) === bakeDate


  //  Transform
  // ===========
  /** @param {CombinedRoutedOrder} order */
  const calcEa = order => order.qty * products[order.prodNick].packSize

  /** @param {CombinedRoutedOrder[]} rowOrders */
  const toFormattedRow = rowOrders => {
    const { forBake, doughNick, weight } = 
      sortedPRD.find(P => P.prodNick === rowOrders[0].prodNick) ?? {}

    /** the product that holds preshaped, prepreshaped values for all items with the same forBake */
    const representativeProduct = sortedPRD.find(P => P.forBake === forBake)

    const shaped = preshapeType === 'preshape' 
      ? representativeProduct?.preshaped ?? 0
      : representativeProduct?.prepreshaped ?? 0

    const qty = sumBy(rowOrders, order => calcEa(order))

    const short = shaped - qty
    const shortText = short > 0 ? `Over ${short}`
      : short < 0 ? `Short ${short * -1}`
      : ''

    const earlyItems = rowOrders.filter(order => testIsNeededEarly(order))
    const earlyQty = sumBy(earlyItems, order => calcEa(order))

    return {
      forBake,
      representativeProdNick: representativeProduct?.prodNick,
      doughNick,
      weight,
      qty,
      shaped,
      short: shortText,
      earlyItems,
      earlyQty,
      items:  rowOrders,
    }

  }

  //  Pipeline 
  // ==========
  return [...T0Orders, ...T1Orders]
    .filter(order => shouldInclude(order))
    .reduce(groupByArrayRdc(order => products[order.prodNick].forBake), [])
    .map(rowOrders => toFormattedRow(rowOrders))
    .sort(compareBy(row => row.forBake))
    .sort(compareBy(row => row.doughNick))

}