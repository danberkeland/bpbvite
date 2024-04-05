import { CombinedRoutedOrder } from "../../../data/production/useProductionData"
import { DBProduct } from "../../../data/types.d"
import { compareBy, groupByArrayRdc, groupByObject, keyBy, sumBy } from "../../../utils/collectionFns"


const isBaggedProduct = (/** @type {DBProduct} */ product) => 1
  && product.readyTime >= 15
  && product.bakedWhere.includes("Prado")
  && product.packGroup !== "frozen pastries"
  && product.packGroup !== "baked pastries"
  && product.packGroup !== "cafe menu"
  && product.doughNick !== "Pretzel Bun"

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
 * @param {string} R0 - delivDate of R0Orders; the report date
 * @param {string} R1 - delivDate of R1Orders; the day after the report date
 * @param {CombinedRoutedOrder[] | undefined} R0Orders 
 * @param {CombinedRoutedOrder[] | undefined} R1Orders 
 * @param {DBProduct[] | undefined} PRD 
 */
export const calculateBagged = (R0, R1, R0Orders, R1Orders, PRD) => {
  if (!R0 || !R1 || !R0Orders || !R1Orders || !PRD) return { shelfData:undefined, freezerData:undefined }

  // console.log("lincoln", [...R0Orders, ...R1Orders].filter(order => order.locNick === 'lincoln' && order.prodNick === 'fr'))

  const products = keyBy(PRD, P => P.prodNick)
  const calcEa = order => order.qty * products[order.prodNick].packSize

  const freshR0Orders = R0Orders.filter(order => 1 // "baked & delivered on the same date". In practice only frfr will be used in the returned dataset
    && isBaggedProduct(fudgeFrfrProps(products[order.prodNick]))
    && order.delivDate === order.meta.routePlan.steps[0].end.date
    && order.delivDate === R0
  )
  
  const baggedR0Orders = R0Orders.filter(order => 1 // "baked & delivered on different dates". In practice this means baked the day before delivery.
    && isBaggedProduct(fudgeFrfrProps(products[order.prodNick]))  
    && order.delivDate !== order.meta.routePlan.steps[0].end.date
    && order.delivDate === R0
  )
  
  const baggedR1Orders = R1Orders.filter(order => 1
    && isBaggedProduct(fudgeFrfrProps(products[order.prodNick]))  
    && order.meta.routePlan.steps[0].end.date === R0
  )
  // console.log("fresh r0", freshR0Orders)
  // console.log("bagged r0", baggedR0Orders)
  // console.log("bagged r1", baggedR1Orders)

  const groupByFudgedForBake = (/** @type {CombinedRoutedOrder[]} */orderSet) => 
    groupByObject(orderSet, order => fudgeFrfrProps(products[order.prodNick]).forBake)
  const freshR0OrdersByRowKey  = groupByFudgedForBake(freshR0Orders)
  const baggedR0OrdersByRowKey = groupByFudgedForBake(baggedR0Orders)
  const baggedR1OrdersByRowKey = groupByFudgedForBake(baggedR1Orders)

  // // Routed orders have a 'scheduled' bake date, but we add the capacity to
  // // fudge it here. To do this, we ignore the route plan and instead look at
  // // orders for today and tomorrow & compare them to stock availability
  // const [shelfR0Orders, shelfR1Orders] = [R0Orders, R1Orders].map(RNOrders =>
  //   RNOrders.filter(order => isBaggedProduct(fudgeFrfrProps(products[order.prodNick])))
  // )

  // const [freshR0OrdersByRowKey, shelfR0OrdersByRowKey, shelfR1OrdersByRowKey] = 
  //   [freshR0Orders, shelfR0Orders, shelfR1Orders].map(orderSet =>
  //     groupByObject(orderSet, order => fudgeFrfrProps(products[order.prodNick]).forBake)
  //   )

  const tableData = PRD
    .filter(P => isBaggedProduct(fudgeFrfrProps(P)))
    .sort(compareBy(P => fudgeFrfrProps(P).prodName))
    .reduce(groupByArrayRdc(P => fudgeFrfrProps(P).forBake), [])
    .map(rowKeyGroup => {
      const productRep = rowKeyGroup[0]
      const rowKey = fudgeFrfrProps(productRep).forBake
      const { batchSize, currentStock, preshaped, prepreshaped, packSize } = productRep
      const currentStockEa = (currentStock ?? 0) * packSize 
      const bakeExtraTotal = sumBy(rowKeyGroup, P => (P.bakeExtra ?? 0))

      const T0FreshItems  = freshR0OrdersByRowKey[rowKey] ?? []
      const T0BaggedItems = baggedR0OrdersByRowKey[rowKey] ?? []
      const T1BaggedItems = baggedR1OrdersByRowKey[rowKey] ?? []
      const T0FreshEa  = sumBy(T0FreshItems,  calcEa)
      const T0BaggedEa = sumBy(T0BaggedItems, calcEa)
      const T1BaggedEa = sumBy(T1BaggedItems, calcEa)

      const earlyItems = T0FreshItems.filter(order => 
        order.meta.routeNick === 'Pick up Carlton' || order.locNick === 'sandos'
      )

      const needTodayEa = relu(T0BaggedEa - currentStockEa) + T0FreshEa
      const baseTotalEa = relu(T0BaggedEa + T1BaggedEa - currentStockEa) + T0FreshEa
      const totalEa = Math.ceil((baseTotalEa + bakeExtraTotal) / batchSize) * batchSize

      //  Table Row
      // ===========
      return {
        rowKey,
        productRep,
        currentStock,
        currentStockEa,
        preshaped,
        prepreshaped,
        bakeExtraTotal,

        delivEa: T0FreshEa + T0BaggedEa,
        delivItems: [...T0FreshItems, ...T0BaggedItems],

        earlyEa: sumBy(earlyItems, calcEa),
        earlyItems,
        
        needTodayEa,

        totalEa,
        totalItems: [...T0FreshItems, ...T0BaggedItems, ...T1BaggedItems],
      }
    })

  const { false:shelfData=[], true:freezerData=[] } = groupByObject(
    tableData, 
    row => !!fudgeFrfrProps(row.productRep).freezerThaw
  )

  return { shelfData, freezerData }
}