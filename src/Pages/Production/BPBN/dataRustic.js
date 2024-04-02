import { CombinedRoutedOrder } from "../../../data/production/useProductionData"

import { DBProduct } from "../../../data/types.d"
import { compareBy, groupByObject, keyBy, sumBy, uniqByRdc } from "../../../utils/collectionFns"

/**
 * @param {CombinedRoutedOrder[] | undefined} T0Orders 
 * @param {CombinedRoutedOrder[] | undefined} T1Orders 
 * @param {DBProduct[] | undefined} PRD 
 * @param {string} bakeDate 
 * @param {'preshape'|'prepreshape'} preshapeType
 */
export const calculateRustics = (T0Orders, T1Orders, PRD, bakeDate, preshapeType) => {
  if (!T0Orders || !T1Orders || !PRD) return undefined

  const products = keyBy(PRD, P => P.prodNick)

  //  Filter/Query functions
  // ========================
  const testIsRustic = (/** @type {DBProduct} */ product) => 
    ['Baguette', 'Country', 'Multi', 'Rye'].includes(product.doughNick)

  const calculateBakeDate = (/** @type {CombinedRoutedOrder} */ order) => 
    order.meta.routePlan.steps[0].begin.date

  const testIsNeededEarly = (/** @type {CombinedRoutedOrder} */ order) => 
    ["AM North", "Pick up Carlton"].includes(order.meta.routeNick)

  const shouldIncludeOrder = order => 1
    && testIsRustic(products[order.prodNick]) === true
    && calculateBakeDate(order) === bakeDate

  //  Transform
  // ===========
  /** @param {CombinedRoutedOrder} order */
  const calcEa = order => order.qty * products[order.prodNick].packSize

  const rusticOrders = [...T0Orders, ...T1Orders].filter(shouldIncludeOrder)
  const rusticOrdersByForBake = groupByObject(rusticOrders,
    order => products[order.prodNick].forBake
  )

  const productReps = PRD
    .filter(testIsRustic)
    .sort(compareBy((/** @type {DBProduct} */ P) => P.prodName))
    .reduce(uniqByRdc(P => P.forBake), [])
    .sort(compareBy((/** @type {DBProduct} */ P) => P.doughNick))

  return productReps.map(productRep => {
    const { prodNick, forBake, doughNick, weight, preshaped, prepreshaped } = productRep
    const rowOrders = rusticOrdersByForBake[productRep.forBake] ?? []

    const shaped = preshapeType === 'preshape' 
      ? preshaped ?? 0
      : prepreshaped ?? 0

    const qty = sumBy(rowOrders, order => calcEa(order))
    const surplus = shaped - qty
    const shortText = surplus > 0 ? `Over ${surplus}`
      : surplus < 0 ? `Short ${surplus * -1}`
      : ''

    const earlyItems = rowOrders.filter(order => testIsNeededEarly(order))
    const earlyQty = sumBy(earlyItems, order => calcEa(order))

    return {
      forBake,
      representativeProdNick: prodNick,
      productRep,
      doughNick,
      weight,
      qty,
      shaped,
      short: shortText,
      earlyItems,
      earlyQty,
      items: rowOrders,
    }
  })

}