import { CombinedRoutedOrder } from "../../../data/production/useProductionData"
import { DBProduct } from "../../../data/types.d"
import { compareBy, groupByObject, keyBy, sumBy } from "../../../utils/collectionFns"


const isPretzelProduct = (/** @type {DBProduct} */ product) => 0
  || (1
    && product.bakedWhere.includes("Prado")
    && product.doughNick === "Pretzel Bun"
  )
  || product.prodNick === 'pslt'





  








  
/**
 * @param {string} R0 - delivDate of R0Orders
 * @param {string} R1 - delivDate of R1Orders
 * @param {CombinedRoutedOrder[] | undefined} R0Orders 
 * @param {CombinedRoutedOrder[] | undefined} R1Orders
 * @param {CombinedRoutedOrder[] | undefined} R2Orders 
 * @param {DBProduct[] | undefined} PRD 
 */
export const calculatePretzel = (R0, R1, R0Orders, R1Orders, R2Orders, PRD) => {
  if (!R0 || !R1 || !R0Orders || !R1Orders || !R2Orders || !PRD) return undefined

  const products = keyBy(PRD, P => P.prodNick)
  const calcEa = order => order.qty * products[order.prodNick].packSize

  const B0FreshOrders = R0Orders.filter(order => 1
    && isPretzelProduct(products[order.prodNick])
    && order.meta.routePlan.steps[0].end.date === R0
  )
  const B0BaggedOrders = R1Orders.filter(order => 1
    && isPretzelProduct(products[order.prodNick])
    && order.meta.routePlan.steps[0].end.date === R0
  )

  const B1Orders = [...R1Orders, ...R2Orders].filter(order => 1
    && isPretzelProduct(products[order.prodNick])
    && order.meta.routePlan.steps[0].end.date === R1
  )

  const groupByProdNick = orders => groupByObject(orders, order => order.prodNick)
  const bakeOrdersByProdNick = 
    groupByProdNick([...B0FreshOrders, ...B0BaggedOrders])

  const shapeOrdersByProdNick =
    groupByProdNick(B1Orders.filter(order => order.prodNick !== 'pslt'))

  const baggedOrdersByProdNick = 
    groupByProdNick(B0BaggedOrders)

  return PRD
    .filter(isPretzelProduct)
    .sort(compareBy(P => P.prodName))
    .map(productRep => {
      const { prodNick, forBake } = productRep
      const bakeItems  = bakeOrdersByProdNick[prodNick] ?? []
      const shapeItems = shapeOrdersByProdNick[prodNick] ?? []
      const bagItems   = baggedOrdersByProdNick[prodNick] ?? []

      return {
        rowKey: forBake,
        productRep,
        bakeEa: sumBy(bakeItems, calcEa),
        bakeItems,
        shapeEa: sumBy(shapeItems, calcEa),
        shapeItems,
        bagEa: sumBy(bagItems, calcEa),
        bagItems,
      }
    })
    .filter(row => 0 // cleans up displayed rows
      || ['ptz', 'pzb', 'unpz'].includes(row.productRep.prodNick)
      || row.bakeEa  !== 0
      || row.shapeEa !== 0
      || row.bagEa   !== 0
    )
  
}