import { DateTime } from "luxon";
import { useProducts } from "../../../data/product/useProducts"
import { CombinedRoutedOrder, useCombinedRoutedOrdersByDate } from "../../../data/production/useProductionData"
import { DBProduct } from "../../../data/types.d";
import { compareBy, groupByArrayRdc, groupByObject, groupByObjectRdc, keyBy, sumBy } from "../../../utils/collectionFns";
import { useMemo } from "react";

/** fudge frfr props so that it ends up at the end of the "French" grouping in the shelf product table. */
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

const isShelfProduct = (/** @type {DBProduct} */ product) => 1
  && product.readyTime >= 15
  && product.bakedWhere.includes("Prado")
  && product.packGroup !== "frozen pastries"
  && product.packGroup !== "baked pastries"
  && product.packGroup !== "cafe menu"
  && product.doughNick !== "Pretzel Bun"
  && product.freezerThaw !== true

const isFreezerProduct = (/** @type {DBProduct} */ product) => 1
  && product.readyTime >= 15
  && product.bakedWhere.includes("Prado")
  && product.packGroup !== "frozen pastries"
  && product.packGroup !== "baked pastries"
  && product.packGroup !== "cafe menu"
  && product.doughNick !== "Pretzel Bun"
  && product.freezerThaw === true

const isPretzelProduct = (/** @type {DBProduct} */ product) => 0
  || (1
    && product.bakedWhere.includes("Prado")
    && product.doughNick === "Pretzel Bun"
  )
  || product.prodNick === 'pslt'

const assignListType = (/** @type {DBProduct} */ product) => {
  if (product.prodNick === 'frfr') return "shelf"   // special exception
  if (isPretzelProduct(product))   return "pretzel"
  if (isFreshProduct(product))     return "fresh"
  if (isShelfProduct(product))     return "shelf"
  if (isFreezerProduct(product))   return "freezer"
  return "other"
}

/**
 * 
 * @param {Object} input
 * @param {DateTime} input.reportDT 
 */
export const useWhatToMake = ({ reportDT }) => {
  const [R0, R1, R2] = [0, 1, 2].map(days => reportDT.plus({ days }).toFormat('yyyy-MM-dd'))
 
  const { data:R0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 0 }), useHolding: false, shouldFetch: true })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true,  shouldFetch: true })
  // const { data:R2Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 2 }), useHolding: true,  shouldFetch: true })

  const { data:PRD } = useProducts({ shouldFetch: true })

  const freshData = useMemo(
    () => calculateFresh(R0, R1, R0Orders, R1Orders, PRD),
    [R0, R1, R0Orders, R1Orders, PRD]
  )

  const { shelfData, freezerData } = useMemo(
    () => calculateBagged(R0, R1, R0Orders, R1Orders, PRD),
    [R0, R1, R0Orders, R1Orders, PRD]
  )
  
  
  return { 
    freshData, 
    shelfData,
    PRD 
  }
}

/** 
 * In most cases the rowKey is the product's forBake.
 * We make an exception for frfr and change the forBake to 'French'
 * so that it is grouped with other french stick products
 */
const getRowKey = (/** @type {DBProduct} */ product) => 
  product.prodNick === 'frfr' ? 'French' : product.forBake                      // *French Exception

/**
 * @param {string} R0 - delivDate of R0Orders
 * @param {string} R1 - delivDate of R1Orders
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
      const T0Items = freshB0OrdersByRowKey[rowKey]?.filter(order => order.delivDate === R0) ?? []
      const T1Items = freshB0OrdersByRowKey[rowKey]?.filter(order => order.delivDate === R1) ?? []
      const neededItems = freshB0OrdersByRowKey[rowKey] ?? []
      const earlyItems = T0Items.filter(order => order.meta.routeNick === 'Pick up Carlton' || order.locNick === 'sandos')

      return {
        rowKey,
        productRep,
        currentStock,
        preshaped,
        prepreshaped,
        bakeExtraTotal: sumBy(forBakeGroup, P => (P.bakeExtra ?? 0)),

        T0Items,
        T0Ea: sumBy(T0Items, order => calcEa(order)),
        T1Items,
        T1Ea: sumBy(T1Items, order => calcEa(order)),
        neededItems,
        neededEa: sumBy(neededItems, order => calcEa(order)),
        earlyItems,
        earlyEa: sumBy(earlyItems, order => calcEa(order)),
      }
    })

}


/**
 * @param {string} R0 - delivDate of R0Orders
 * @param {string} R1 - delivDate of R1Orders
 * @param {CombinedRoutedOrder[] | undefined} R0Orders 
 * @param {CombinedRoutedOrder[] | undefined} R1Orders 
 * @param {DBProduct[] | undefined} PRD 
 */
const calculateBagged = (R0, R1, R0Orders, R1Orders, PRD) => {
  if (!R0 || !R1 || !R0Orders || !R1Orders || !PRD) return {}

  const products = keyBy(PRD, P => P.prodNick)
  const calcEa = order => order.qty * products[order.prodNick].packSize

  const orders = [...R0Orders, ...R1Orders]
  const frfrOrders = orders.filter(order => 1    
    && order.meta.routePlan.steps[0].end.date === R0
    && order.prodNick === 'frfr'    
  )

  // Routed orders have a 'scheduled' bake date, but we add the capacity to
  // fudge it here. To do this, we ignore the route plan and instead look at
  // orders for today and tomorrow & compare them to stock availability
  const [shelfR0Orders, shelfR1Orders] = [R0Orders, R1Orders].map(RNOrders =>
    RNOrders.filter(order => isBaggedProduct(fudgeFrfrProps(products[order.prodNick])))
  )

  const [frfrOrdersByRowKey, shelfR0OrdersByRowKey, shelfR1OrdersByRowKey] = 
    [frfrOrders, shelfR0Orders, shelfR1Orders].map(orderSet =>
      groupByObject(orderSet, order => fudgeFrfrProps(products[order.prodNick]).forBake)
    )

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

      const frItems = frfrOrdersByRowKey[rowKey] ?? []
      const T0Items = shelfR0OrdersByRowKey[rowKey] ?? []
      const T1Items = shelfR1OrdersByRowKey[rowKey] ?? []
      const frEa = sumBy(frItems, calcEa)
      const T0Ea = sumBy(T0Items, calcEa)
      const T1Ea = sumBy(T1Items, calcEa)

      const earlyItems = frItems.filter(order => 
        order.meta.routeNick === 'Pick up Carlton' || order.locNick === 'sandos'
      )
      const earlyEa = sumBy(earlyItems, calcEa)

      const delivItems = [...frItems, ...T0Items]
      const delivEa = frEa + T0Ea

      const totalItems = [...frItems, ...T0Items, ...T1Items]
      const needTodayEa = relu(T0Ea - currentStockEa) + frEa
      const bakeTotalEa = Math.ceil((relu(T0Ea + T1Ea - currentStockEa) + bakeExtraTotal) / batchSize) * batchSize

      //  Table Row
      // ===========
      return {
        rowKey,
        productRep,
        currentStock,
        preshaped,
        prepreshaped,
        bakeExtraTotal,

        earlyEa,
        earlyItems,

        delivEa,
        delivItems,

        totalItems,
        needTodayEa,
        bakeTotalEa,
        
      }
    })

  const { false:shelfData, true:freezerData } = groupByObject(
    tableData, 
    row => !!fudgeFrfrProps(row.productRep).freezerThaw
  )

  return { shelfData, freezerData }
}
