import { DateTime } from "luxon";
import { useProducts } from "../../../data/product/useProducts"
import { CombinedRoutedOrder, useCombinedRoutedOrdersByDate } from "../../../data/production/useProductionData"
import { DBProduct } from "../../../data/types.d";
import { compareBy, groupByArrayRdc, groupByObject, keyBy, sumBy, uniqByRdc } from "../../../utils/collectionFns";
import { useMemo } from "react";

/** 
 * fudge frfr props so that orders end up at the end of the "French" grouping 
 * in the shelf product table. "Fudging" is only meant to modify values for 
 * groupBy/filter tests; we don't intend to return/report values that differ 
 * from DB values.
 */
const fudgeFrfrProps = (/**  @type {DBProduct} */ product) => product.prodNick === 'frfr' 
  ? { ...product, prodName: "ZZZ", forBake: "French", readyTime: 15 } 
  : product

//  Filter Functions
// ==================

// const isHoldingOrder = (order) => order.isStand === false

/** 'Rectified Linear Unit' function -- converts negative numbers to 0 */
const relu = (x) => x > 0 ? x : 0

// change from legacy version: exclude pretzel products
const isFreshProduct = (/** @type {DBProduct} */ product) => 1
  && product.readyTime < 15
  && product.bakedWhere.includes("Prado")
  && product.packGroup !== "frozen pastries"
  && product.packGroup !== "baked pastries"
  && product.doughNick !== "Pretzel Bun"
  && product.prodNick  !== 'pslt'

const isBaggedProduct = (/** @type {DBProduct} */ product) => 1
  && product.readyTime >= 15
  && product.bakedWhere.includes("Prado")
  && product.packGroup !== "frozen pastries"
  && product.packGroup !== "baked pastries"
  && product.packGroup !== "cafe menu"
  && product.doughNick !== "Pretzel Bun"

// const isShelfProduct = (/** @type {DBProduct} */ product) => 1
//   && product.readyTime >= 15
//   && product.bakedWhere.includes("Prado")
//   && product.packGroup !== "frozen pastries"
//   && product.packGroup !== "baked pastries"
//   && product.packGroup !== "cafe menu"
//   && product.doughNick !== "Pretzel Bun"
//   && product.freezerThaw !== true

// const isFreezerProduct = (/** @type {DBProduct} */ product) => 1
//   && product.readyTime >= 15
//   && product.bakedWhere.includes("Prado")
//   && product.packGroup !== "frozen pastries"
//   && product.packGroup !== "baked pastries"
//   && product.packGroup !== "cafe menu"
//   && product.doughNick !== "Pretzel Bun"
//   && product.freezerThaw === true

const isPretzelProduct = (/** @type {DBProduct} */ product) => 0
  || (1
    && product.bakedWhere.includes("Prado")
    && product.doughNick === "Pretzel Bun"
  )
  || product.prodNick === 'pslt'

// const assignListType = (/** @type {DBProduct} */ product) => {
//   if (product.prodNick === 'frfr') return "shelf"   // special exception
//   if (isPretzelProduct(product))   return "pretzel"
//   if (isFreshProduct(product))     return "fresh"
//   if (isShelfProduct(product))     return "shelf"
//   if (isFreezerProduct(product))   return "freezer"
//   return "other"
// }

/**
 * 
 * @param {Object} input
 * @param {DateTime} input.reportDT 
 */
export const useWhatToMake = ({ reportDT }) => {
  const [R0, R1] = [0, 1].map(days => reportDT.plus({ days }).toFormat('yyyy-MM-dd'))
 
  const { data:R0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 0 }), useHolding: false, shouldFetch: true })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true,  shouldFetch: true })
  const { data:R2Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 2 }), useHolding: true,  shouldFetch: true })

  const { data:PRD } = useProducts({ shouldFetch: true })
  const products = useMemo(() => 
    !!PRD ? keyBy(PRD, P => P.prodNick) : undefined,
    [PRD]
  )

  const freshData = useMemo(
    () => calculateFresh(R0, R1, R0Orders, R1Orders, PRD),
    [R0, R1, R0Orders, R1Orders, PRD]
  )

  const { shelfData, freezerData } = useMemo(
    () => calculateBagged(R0, R1, R0Orders, R1Orders, PRD),
    [R0, R1, R0Orders, R1Orders, PRD]
  )

  const pretzelData = useMemo(
    () => calculatePretzel(R0, R1, R0Orders, R1Orders, R2Orders, PRD),
    [R0, R1, R0Orders, R1Orders, R2Orders, PRD]
  )

  const frenchPocketData = useMemo(
    () => calculateFrenchPockets(R0, R0Orders, R1Orders, PRD), 
    [R0, R0Orders, R1Orders, PRD]
  )

  return { 
    freshData, 
    shelfData,
    freezerData,
    pretzelData,
    frenchPocketData,
    products, 
  }
}


/**
 * @param {string} R0 - delivDate of R0Orders; the report date
 * @param {string} R1 - delivDate of R1Orders; the day after the report date
 * @param {CombinedRoutedOrder[] | undefined} R0Orders 
 * @param {CombinedRoutedOrder[] | undefined} R1Orders 
 * @param {DBProduct[] | undefined} PRD 
 */
const calculateFresh = (R0, R1, R0Orders, R1Orders, PRD) => {
  if (!R0 || !R1 || !R0Orders || !R1Orders || !PRD) return undefined

  const products = keyBy(PRD, P => P.prodNick)
  const calcEa = order => order.qty * products[order.prodNick].packSize

  const freshB0Orders = [...R0Orders, ...R1Orders].filter(order => 1
    && order.meta.routePlan.steps[0].end.date === R0
    && isFreshProduct(fudgeFrfrProps(products[order.prodNick])) 
  )
  const freshB0OrdersByRowKey = groupByObject(freshB0Orders, 
    order => fudgeFrfrProps(products[order.prodNick]).forBake
  )

  return PRD
    .filter(P => isFreshProduct(fudgeFrfrProps(P)))
    .sort(compareBy(P => fudgeFrfrProps(P).prodName))
    .reduce(groupByArrayRdc(P => fudgeFrfrProps(P).forBake), [])
    .map(forBakeGroup => {
      const productRep = forBakeGroup[0]
      const { currentStock, preshaped, prepreshaped } = productRep
      const rowKey = fudgeFrfrProps(productRep).forBake
      const T0Items =     (freshB0OrdersByRowKey[rowKey] ?? []).filter(order => order.delivDate === R0)
      const T1Items =     (freshB0OrdersByRowKey[rowKey] ?? []).filter(order => order.delivDate === R1)
      const neededItems =  freshB0OrdersByRowKey[rowKey] ?? []
      const earlyItems = T0Items.filter(order => order.meta.routeNick === 'Pick up Carlton' || order.locNick === 'sandos')

      return {
        rowKey,
        productRep,
        currentStock,
        preshaped,
        prepreshaped,
        bakeExtraTotal: sumBy(forBakeGroup, P => (P.bakeExtra ?? 0)),

        T0Ea: sumBy(T0Items, order => calcEa(order)),
        T0Items,
        earlyEa: sumBy(earlyItems, order => calcEa(order)),
        earlyItems,
        T1Ea: sumBy(T1Items, order => calcEa(order)),
        T1Items,
        neededEa: sumBy(neededItems, order => calcEa(order)),
        neededItems,
      }
    })

}


/**
 * @param {string} R0 - delivDate of R0Orders; the report date
 * @param {string} R1 - delivDate of R1Orders; the day after the report date
 * @param {CombinedRoutedOrder[] | undefined} R0Orders 
 * @param {CombinedRoutedOrder[] | undefined} R1Orders 
 * @param {DBProduct[] | undefined} PRD 
 */
const calculateBagged = (R0, R1, R0Orders, R1Orders, PRD) => {
  if (!R0 || !R1 || !R0Orders || !R1Orders || !PRD) return { shelfData:undefined, freezerData:undefined }

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
  console.log("fresh r0", freshR0Orders)
  console.log("bagged r0", baggedR0Orders)
  console.log("bagged r1", baggedR1Orders)

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

      const needTodayEa = relu(T0BaggedEa + T1BaggedEa - currentStockEa) + T0FreshEa

      //  Table Row
      // ===========
      return {
        rowKey,
        productRep,
        currentStock,
        preshaped,
        prepreshaped,
        bakeExtraTotal,

        delivEa: T0FreshEa + T0BaggedEa,
        delivItems: [...T0FreshItems, ...T0BaggedItems],

        earlyEa: sumBy(earlyItems, calcEa),
        earlyItems,
        
        needTodayEa,

        totalEa: Math.ceil((needTodayEa + bakeExtraTotal) / batchSize) * batchSize,
        totalItems: [...T0FreshItems, ...T0BaggedItems, ...T1BaggedItems],
      }
    })

  const { false:shelfData=[], true:freezerData=[] } = groupByObject(
    tableData, 
    row => !!fudgeFrfrProps(row.productRep).freezerThaw
  )

  return { shelfData, freezerData }
}

/**
 * @param {string} R0 - delivDate of R0Orders
 * @param {string} R1 - delivDate of R1Orders
 * @param {CombinedRoutedOrder[] | undefined} R0Orders 
 * @param {CombinedRoutedOrder[] | undefined} R1Orders
 * @param {CombinedRoutedOrder[] | undefined} R2Orders 
 * @param {DBProduct[] | undefined} PRD 
 */
const calculatePretzel = (R0, R1, R0Orders, R1Orders, R2Orders, PRD) => {
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
  
}

/**
 * @param {string} R0 - delivDate of R0Orders
 * @param {CombinedRoutedOrder[] | undefined} R0Orders 
 * @param {CombinedRoutedOrder[] | undefined} R1Orders
 * @param {DBProduct[] | undefined} PRD 
 */
const calculateFrenchPockets = (R0, R0Orders, R1Orders, PRD) => {
  if (!PRD || !R0Orders || !R1Orders) return undefined

  const products = keyBy(PRD, P => P.prodNick)
  const calcEa = order => order.qty * products[order.prodNick].packSize 

  const frenchOrders = [...R0Orders, ...R1Orders].filter(order => 1 
    && products[order.prodNick].doughNick === "French"
    && order.meta.routePlan.steps[0].end.date === R0
  )
  const frenchOrdersByWeight = groupByObject(frenchOrders, 
    order => products[order.prodNick].weight
  )

  return PRD
    .filter(P => P.doughNick === "French")
    .sort(compareBy(P => P.prodName))
    .reduce(uniqByRdc(P => P.weight), [])
    .sort(compareBy(P => P.weight))
    .map(productRep => {
      const {prodNick, weight, preshaped, prepreshaped } = productRep
      const neededItems = frenchOrdersByWeight[weight] ?? []
      const neededEa = sumBy(neededItems, calcEa)

      return {
        prodNick,
        weight,
        preshaped,
        prepreshaped,
        neededEa,
        neededItems,
        surplusEa: preshaped - neededEa
      }
    })
}
