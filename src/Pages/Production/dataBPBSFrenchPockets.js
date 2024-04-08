import { CombinedRoutedOrder } from "../../data/production/useProductionData"
import { DBProduct } from "../../data/types.d";
import { compareBy, groupByArrayRdc, groupByObject, keyBy, sumBy, uniqByRdc } from "../../utils/collectionFns";










/** 
 * fudge frfr props so that orders end up at the end of the "French" grouping 
 * in the shelf product table. "Fudging" is only meant to modify values for 
 * groupBy/filter tests; we don't intend to return/display values that differ 
 * from DB values.
 */
const fudgeFrfrProps = (/**  @type {DBProduct} */ product) => product.prodNick === 'frfr' 
  ? { ...product, prodName: "ZZZ", forBake: "French", readyTime: 15 } 
  : product

/** 'Rectified Linear Unit' function -- converts negative numbers to 0 */
const relu = (x) => x > 0 ? x : 0

/**
 * @param {string} R0 - delivDate of R0Orders
 * @param {CombinedRoutedOrder[] | undefined} R0Orders 
 * @param {CombinedRoutedOrder[] | undefined} R1Orders
 * @param {DBProduct[] | undefined} PRD 
 */
export const calculateFrenchPockets = (R0, R0Orders, R1Orders, PRD) => {
  if (!PRD || !R0Orders || !R1Orders) return undefined

  const products = keyBy(PRD, P => P.prodNick)
  const calcEa = order => order.qty * products[order.prodNick].packSize 

  const T0frenchOrders = R0Orders.filter(order => 1 
    && products[order.prodNick].doughNick === "French"
  )
  const T1frenchOrders = R1Orders.filter(order => 1 
    && products[order.prodNick].doughNick === "French"
    && order.meta.routePlan.steps[0].end.date === R0
  )
  const frenchOrdersByWeight = groupByObject([...T0frenchOrders, ...T1frenchOrders], 
    order => products[order.prodNick].weight
  )

  const frenchProducts = PRD
    .filter(P => P.doughNick === "French")
    .sort(compareBy(P => P.prodName))

  // neededEa needs to be calculated by forBake first, 
  // then aggregated by weight group.
  const neededEaByWeight = frenchProducts
    .reduce(groupByArrayRdc(P => fudgeFrfrProps(P).forBake), [])
    .map(forBakeGroup => {
      const productRep = forBakeGroup[0]
      const { forBake, batchSize, currentStock, packSize, weight } = productRep
      const currentStockEa = (currentStock ?? 0) * packSize
      const bakeExtraTotal = sumBy(forBakeGroup, P => (P.bakeExtra ?? 0))
      const R0FreshEa = sumBy(
        R0Orders.filter(order => 1
          && fudgeFrfrProps(products[order.prodNick]).forBake === forBake
          && order.delivDate === order.meta.routePlan.steps[0].end.date
          && order.delivDate === R0
        ), 
        calcEa
      )
      const R0BaggedEa = sumBy(
        R0Orders.filter(order => 1
          && fudgeFrfrProps(products[order.prodNick]).forBake === forBake
          && order.delivDate !== order.meta.routePlan.steps[0].end.date
          && order.delivDate === R0
        ), 
        calcEa
      )
      const R1BaggedEa = sumBy(
        R1Orders.filter(order => 1
          && fudgeFrfrProps(products[order.prodNick]).forBake === forBake
          && order.meta.routePlan.steps[0].end.date === R0
        ),
        calcEa
      )

      const baseTotalEa = relu(R0BaggedEa + R1BaggedEa - currentStockEa) + R0FreshEa
      const totalEa = Math.ceil((baseTotalEa + bakeExtraTotal) / batchSize) * batchSize
      
      return { weight, totalEa }

    })
    .reduce(groupByArrayRdc(item => item.weight), [])
    .map(group => ({ [group[0].weight]: sumBy(group, item => item.totalEa) }))
    .reduce((prev, curr) => Object.assign(prev, curr), {})

  return frenchProducts
    .reduce(uniqByRdc(P => P.weight), [])
    .sort(compareBy(P => P.weight))
    .map(productRep => {
      const {prodNick, weight, preshaped, prepreshaped } = productRep
      const neededItems = frenchOrdersByWeight[weight] ?? []
      const neededEa = neededEaByWeight[weight]

      return {
        prodNick,
        weight,
        preshaped,
        prepreshaped,
        neededEa,
        neededItems,
        surplusEa: preshaped - neededEa,
        overEa: relu(preshaped - neededEa),
        underEa: relu(neededEa - preshaped)
      }
    })
}

//  French Pocket Data
// ====================
// This dataset brings together 2 components.
//
// * Product data contains preshape and prepreshape info, which tells us what
// we have on hand to meed order demands. These values always point to the 
// current (and next) day.
//
// * Order data gets aggregated to determine production requirements for a given
// date, based on the delivery dates we query for.