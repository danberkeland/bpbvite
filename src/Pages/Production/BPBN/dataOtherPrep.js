import { CombinedRoutedOrder } from "../../../data/production/useProductionData"
import { DBProduct } from "../../../data/types.d"
import { compareBy, groupByArrayRdc, keyBy, sumBy } from "../../../utils/collectionFns"

/**
 * @param {CombinedRoutedOrder[] | undefined} T0Orders 
 * @param {CombinedRoutedOrder[] | undefined} T1Orders 
 * @param {DBProduct[] | undefined} PRD 
 * @param {string} bakeDate 
 */
export const calculateOtherPrep = (T0Orders, T1Orders, PRD, bakeDate) => {
  if (!T0Orders ||!T1Orders || !PRD) return undefined

  const products = keyBy(PRD, P => P.prodNick)

  //  Filter/Query functions
  // ========================
  const calculateBakeDate = (/** @type {CombinedRoutedOrder} */ order) =>
    order.meta.routePlan.steps[0].begin.date

  const calculateBakePlace = (/** @type {CombinedRoutedOrder} */ order) =>
    order.meta.routePlan.steps[0].end.place

  const testIsOtherPrepPastry = (/** @type {DBProduct} */ product) => 1
    && ["baked pastries", "frozen pastries"].includes(product.packGroup)
    && product.doughNick !== "Croissant"

  const testIsFocaccia = (/** @type {DBProduct} */ product) => 
    product.doughNick === "Ciabatta"

  const shouldInclude = (order) => 1
    && calculateBakeDate(order)  === bakeDate
    && calculateBakePlace(order) === "Carlton" // Means the product can be prepped at the carlton, and the actual order WILL be prepped at the carlton
    && (0
      || testIsOtherPrepPastry(products[order.prodNick]) === true
      || testIsFocaccia(products[order.prodNick]) === true
    )

  //  Transform
  // ===========
  /** @param {CombinedRoutedOrder} order */
  const calcEa = order => order.qty * products[order.prodNick].packSize

  /** @param {CombinedRoutedOrder[]} rowOrders */
  const formatRow = rowOrders => {
    const { prodNick, prodName } = products[rowOrders[0].prodNick]

    return {
      prodNick,
      prodName,
      items: rowOrders,
      qty: sumBy(rowOrders, order => calcEa(order))
    }

  }
  
  //  Pipeline 
  // ==========
  return [...T0Orders, ...T1Orders]
    .filter(order => shouldInclude(order))
    .reduce(groupByArrayRdc(order => order.prodNick), [])
    .map(rowOrders => formatRow(rowOrders))
    .sort(compareBy(row => row.prodName))

}