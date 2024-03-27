import { useMemo } from "react"
import { useProducts } from "../../../data/product/useProducts"
import { CombinedRoutedOrder, useCombinedRoutedOrdersByDate } from "../../../data/production/useProductionData"
import { DBProduct } from "../../../data/types.d"
import { compareBy, groupByArrayRdc, groupByObject, keyBy, sumBy } from "../../../utils/collectionFns"

/**For croissant orders, maps back to the shaped type consumed at setout*/
const shapeTypeByProdNick = {
  pl: 'pl', frpl: 'pl', al: 'pl', fral: 'pl',
  ch: 'ch', frch: 'ch',
  pg: 'pg', frpg: 'pg',
  sf: 'sf', frsf: 'sf',
  mb: 'mb', frmb: 'mb', unmb: 'mb',
  mini: 'mini', frmini: 'mini',
}

const panQtyByShapeType = { ch: 12, mb: 6, mini: 15, pg: 12, pl: 12, sf: 12 }

//  Filter Functions
// ==================
const isPastry = (/** @type {DBProduct} */ product) =>
  ['frozen pastries', 'baked pastries'].includes(product.packGroup)

const isBakedCroix = (/** @type {DBProduct} */ product) =>
  product.doughNick === 'Croissant' && product.packGroup === 'baked pastries'

/**
 * retail brownies serve as a placeholder for cafe items and shouldn't be 
 * counted for setout. Differentiate between square retail orders & a potential
 * special order for brownies by checking for the "__" substring, 
 * which separates the (Square) purchaser's name from the id token string.
 */
const isRetailBrownie = (/** @type {CombinedRoutedOrder} */order) => 1
  && order.isWhole === false
  && order.locNick.includes("__")
  && order.prodNick === 'brn'


export const useSetoutData = ({ reportDT }) => {

  const { data:PRD } = useProducts({ shouldFetch: true })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true,  shouldFetch: true })
  const { data:R2Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 2 }), useHolding: true,  shouldFetch: true })
  const { data:R3Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 3 }), useHolding: true,  shouldFetch: true })
  
  const calculateSetout = () => {
    if (!PRD || !R1Orders || !R2Orders || !R3Orders) {
      return { 
        north: { croix: undefined, other: undefined, almond: undefined }, 
        south: { croix: undefined, other: undefined, almond: undefined },  
      }
    }

    const products = keyBy(PRD, P => P.prodNick)
    const [_R1, _R2, _R3] = [R1Orders, R2Orders, R3Orders]
      .map(RNOrders => RNOrders
        .filter(order => 1
          && isPastry(products[order.prodNick])
          && (0
            || !isBakedCroix(products[order.prodNick])
            || order.locNick !== 'bpbextras'
          )
        )
        .map(order => order.locNick === 'backporch'
          ? ({ ...order, qty: Math.ceil(order.qty / 2)})
          : order
        )
        // sort???
      )

    /**
     * Here we partition out our order set to the necessary granularity in one
     * fell swoop, as opposed to the previous implementation that used
     * sucessive partitionings ('simpler', but more numerous).
     * @param {string} datePrefix 
     * @param {CombinedRoutedOrder} order 
     */
    const classifyOrder = (datePrefix, order) => {
      const { packGroup, doughNick } = products[order.prodNick]

      const bakePlace = order.meta.routePlan.steps[0].end.place
      const northOrSouth = bakePlace === 'Carlton' ? 'North'
        : bakePlace === 'Prado' ? 'South'
        : undefined

      const frozenOrBaked = 
        packGroup === 'frozen pastries' ? 'Frozen' :
        packGroup === 'baked pastries' ? 'Baked' :
        undefined
      
      const pastryType = isRetailBrownie(order) ? undefined
        : doughNick === 'Croissant' && ['fral', 'al'].includes(order.prodNick) ? 'Almond'
        : doughNick === 'Croissant' ? 'Croix'
        : 'Other'

      if (!bakePlace || !frozenOrBaked || !pastryType) return undefined
      return `${datePrefix}${northOrSouth}${frozenOrBaked}${pastryType}`

    }

    // Warning: this setup assumes orders are baked and delivered 
    // on the same day. This *should* be a reasonable assumption.
    const { 
      R1NorthFrozenAlmond=[], R1NorthBakedCroix=[], R1NorthBakedOther=[],                     
      R1SouthFrozenAlmond=[], R1SouthBakedCroix=[], R1SouthBakedOther=[], R1SouthBakedAlmond=[], 
    } = groupByObject(_R1, order => classifyOrder("R1", order))
    const { 
      R2NorthFrozenAlmond=[], R2NorthBakedAlmond=[], 
      R2SouthFrozenAlmond=[], R2SouthBakedAlmond=[], 
    } = groupByObject(_R2, order => classifyOrder("R2", order))
    const { 
      R3NorthBakedAlmond=[]
    } = groupByObject(_R3, order => classifyOrder("R3", order))

    //  Pipeline Functions/Transformations
    // ====================================
    const calcEa = (/** @type {CombinedRoutedOrder} */ order) =>
      order.qty * products[order.prodNick].packSize

    const calculateSetoutCroix = orders => orders
      .reduce(groupByArrayRdc(order => shapeTypeByProdNick[order.prodNick]), [])
      .map(shapeTypeGroup => {
        const shapeType = shapeTypeByProdNick[shapeTypeGroup[0].prodNick]
        const totalEa = sumBy(shapeTypeGroup, order => calcEa(order))

        return {
          setoutKey: shapeType,
          total: totalEa,
          pans: Math.floor(totalEa / panQtyByShapeType[shapeType]),
          remainder: totalEa,
          orders: shapeTypeGroup,
        }
      })
      .sort(compareBy(row => row.setoutKey))

    const calculateSetoutOther = orders => orders
      .reduce(groupByArrayRdc(order => order.prodNick), [])
      .map(prodNickGroup => ({
        rowKey: prodNickGroup[0].prodNick,
        total: sumBy(prodNickGroup, order => calcEa(order)),
        orders: prodNickGroup,
      }))
      .sort(compareBy(row => row.rowKey))

    //  North Setout
    // ==============
    const northSetoutCroix = calculateSetoutCroix(R1NorthBakedCroix)
    const northSetoutOther = calculateSetoutOther(R1NorthBakedOther)

    //  South Setout
    // ==============
    const southSetoutCroix = calculateSetoutCroix([
      ...R1SouthBakedCroix, 
      ...R2SouthFrozenAlmond, // almond orders get tallied as plains for setout
      ...R2NorthFrozenAlmond, 
      ...R2SouthBakedAlmond, 
      ...R3NorthBakedAlmond
    ])
    const southSetoutOther = calculateSetoutOther(R1SouthBakedOther)

    const freezerAlmondOrders = [
      ...R1SouthFrozenAlmond, 
      ...R1NorthFrozenAlmond, 
      ...R2NorthBakedAlmond
    ]
    const southSetoutAlmond = [
      {
        rowKey: 'refrigerator',
        total: sumBy(R1SouthBakedAlmond, order => calcEa(order)),
        orders: R1SouthBakedAlmond
      },
      {
        rowKey: 'freezer',
        total: sumBy(freezerAlmondOrders, order => calcEa(order)),
        orders: freezerAlmondOrders
      },
    ]

    return {
      north: {
        croix:  northSetoutCroix,
        other:  northSetoutOther,
        almond: undefined
      },
      south: {
        croix:  southSetoutCroix,
        other:  southSetoutOther,
        almond: southSetoutAlmond,
      },
      products,
    }

  }

  return useMemo(calculateSetout, [PRD, R1Orders, R2Orders, R3Orders])

}