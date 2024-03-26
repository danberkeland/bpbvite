/// doughs, , doughcomponents

import { keyBy } from "lodash"
import { CombinedRoutedOrder } from "../../../data/production/useProductionData"
import { compareBy, sumBy, uniqByRdc } from "../../../utils/collectionFns"
import { DBDoughBackup, DBProduct } from "../../../data/types.d"

/**
 * @param {DBProduct[] | undefined} PRD 
 * @param {DBDoughBackup[] | undefined} DGH 
 * @param {CombinedRoutedOrder[] | undefined} R1Orders 
 * @param {CombinedRoutedOrder[] | undefined} R2Orders 
 * @param {CombinedRoutedOrder[] | undefined} R3Orders 
 * @param {string} R1 - the day after the report date, in 'yyyy-MM-dd' format
 * @param {string} R2 - two days after the report date, in 'yyyy-MM-dd' format
 * @returns 
 */
export const calculateBucketsData = (PRD, DGH, R1Orders, R2Orders, R3Orders, R1, R2) => {
  if (!PRD || !DGH || !R1Orders || !R2Orders || !R3Orders) return undefined

  const products = keyBy(PRD, P => P.prodNick)

  const calculateBakeDate = (/** @type {CombinedRoutedOrder} */ order) =>
    order.meta.routePlan.steps[0].begin.date

  console.log("malformed orders:")
  console.log([...R1Orders, ...R2Orders, ...R3Orders].filter(order => order.meta.routePlan.steps[0] === undefined))
  
  const B1Orders = [...R1Orders, ...R2Orders].filter(order => calculateBakeDate(order) === R1)
  const B2Orders = [...R2Orders, ...R3Orders].filter(order => calculateBakeDate(order) === R2)

  const preshapeProducts = PRD
    .sort(compareBy(P => P.prodName))
    .reduce(uniqByRdc(P => P.forBake), [])

  return DGH.map(D => {
    const ordersToCount = D.isBakeReady ? B1Orders : B2Orders

    //  Summary Data
    // ==============
    const summary = preshapeProducts.filter(P => 
      P.doughNick === D.doughName
    ).map(preshapeProduct => {
      const { forBake, preshaped, weight } = preshapeProduct
      
      const forBakeOrders = ordersToCount.filter(order => 
        products[order.prodNick].forBake === forBake
      )
      const neededEa = sumBy(forBakeOrders, 
        order => order.qty * products[order.prodNick].packSize
      )

      return {
        forBake,
        weight,
        neededEa,
        preshaped,
        shortEa: Math.max(0, neededEa - preshaped),
        surplusEa: Math.max(0, preshaped - neededEa),
        items: forBakeOrders
      }

    })

    return {
      ...D,
      summary,
      needed: sumBy(summary, item => item.neededEa * item.weight),
      short:  sumBy(summary, item => item.shortEa  * item.weight), // not used?
      targetDate:    D.isBakeReady ? R1 : R2,
      targetRelDate: D.isBakeReady ? 1  : 2,
    }

  })

}
