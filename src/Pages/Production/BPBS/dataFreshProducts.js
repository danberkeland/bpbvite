import { CombinedRoutedOrder } from "../../../data/production/useProductionData"
import { DBProduct } from "../../../data/types.d"
import { compareBy, groupByArrayRdc, groupByObject, keyBy, sumBy } from "../../../utils/collectionFns"

// change from legacy version: exclude pretzel products
const isFreshProduct = (/** @type {DBProduct} */ product) => 1
  && product.readyTime < 15
  && product.bakedWhere.includes("Prado")
  && product.packGroup !== "frozen pastries"
  && product.packGroup !== "baked pastries"
  && product.doughNick !== "Pretzel Bun"
  && product.prodNick  !== 'pslt'

/** 
 * fudge frfr props so that orders end up at the end of the "French" grouping 
 * in the shelf product table. "Fudging" is only meant to modify values for 
 * groupBy/filter tests; we don't intend to return/display values that differ 
 * from DB values.
 */
const fudgeFrfrProps = (/**  @type {DBProduct} */ product) => product.prodNick === 'frfr' 
  ? { ...product, prodName: "ZZZ", forBake: "French", readyTime: 15 } 
  : product



  
/**
 * @param {string} R0 - delivDate of R0Orders; the report date
 * @param {string} R1 - delivDate of R1Orders; the day after the report date
 * @param {CombinedRoutedOrder[] | undefined} R0Orders 
 * @param {CombinedRoutedOrder[] | undefined} R1Orders 
 * @param {DBProduct[] | undefined} PRD 
 */
export const calculateFresh = (R0, R1, R0Orders, R1Orders, PRD) => {
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

        T0Ea: sumBy(T0Items, order => calcEa(order)), // "Total Deliv"
        T0Items,
        earlyEa: sumBy(earlyItems, order => calcEa(order)),
        earlyItems,
        T1Ea: sumBy(T1Items, order => calcEa(order)), // "Bag for EOD"
        T1Items,
        neededEa: sumBy(neededItems, order => calcEa(order)),
        neededItems,
      }
    })

}