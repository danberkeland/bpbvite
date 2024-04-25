import { CombinedRoutedOrder } from "../../data/production/useProductionData"
import { DBProduct } from "../../data/types.d"
import { compareBy, groupByArrayRdc, groupByObject, keyBy, sumBy } from "../../utils/collectionFns"


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

/**
 * @param {CombinedRoutedOrder} order 
 * @param {{[x: string]: DBProduct}} products 
 */
const filterToSetoutItems = (order, products) => 1
  && isPastry(products[order.prodNick])
  && (0
    || !isBakedCroix(products[order.prodNick])
    || order.locNick !== 'bpbextras'
  )

//  Some Absolute Brain-Rot that needs to be deprecated and deleted ASAP
// ======================================================================
/**
 * use with flatMap
 * @param {CombinedRoutedOrder} order 
 * @param {{[x: string]: DBProduct}} products 
 */
const splitBackporchCroixOrder = (order, products) => 
  order.locNick === 'backporch' && isBakedCroix(products[order.prodNick])
    ? [
      {
        ...order,
        qty: Math.ceil( order.qty / 2),
        // meta: { ...order.meta, routeNick: "Pick up Carlton" } // original order will be assigned "Pick up Carlton" already
      },
      {
        ...order,
        qty: Math.ceil( order.qty / 2),
        meta: { ...order.meta, routeNick: "Pick up Carlton " } // The trailing space will get this item grouped with Prado orders instead.
      }
    ]
    : order

/**
 * Partition the order set to a sufficient granularity all at
 * once, as opposed to the previous strategy that used
 * sucessive partitionings ('simpler', but more numerous). 
 * @param {string} datePrefix 
 * @param {CombinedRoutedOrder} order 
 * @param {{[x: string]: DBProduct}} products
 */
const classifyPastryOrder = (datePrefix, order, products) => {
  const { packGroup, doughNick, bakedWhere } = products[order.prodNick]

  // const bakePlace = order.meta.routePlan.steps[0].end.place
  // const northOrSouth = bakePlace === 'Carlton' ? 'North'
  //   : bakePlace === 'Prado' ? 'South'
  //   : undefined

  // FUTURE: may need to add a Higuera location
  const bakePlace = bakedWhere.length === 1 ? bakedWhere[0]
    : order.meta.routeNick === 'Pick up Carlton' ? 'Carlton'
    : 'Prado'

  const frozenOrBaked = 
    packGroup === 'frozen pastries' ? 'Frozen' :
    packGroup === 'baked pastries' ? 'Baked' :
    undefined
  
  const pastryType = isRetailBrownie(order) ? undefined
    : doughNick === 'Croissant' && ['fral', 'al'].includes(order.prodNick) ? 'Almond'
    : doughNick === 'Croissant' ? 'Croix'
    : 'Other'

  if (!bakePlace || !frozenOrBaked || !pastryType) return undefined
  return `${datePrefix}${bakePlace}${frozenOrBaked}${pastryType}`

}

/**
 * @param {CombinedRoutedOrder[]} orders 
 * @param {{[x: string]: DBProduct}} products
 */
const calculateSetoutCroix = (orders, products) => orders
  .reduce(groupByArrayRdc(order => shapeTypeByProdNick[order.prodNick]), [])
  .map(shapeTypeGroup => {
    const shapeType = shapeTypeByProdNick[shapeTypeGroup[0].prodNick]
    const totalEa = sumBy(shapeTypeGroup, order => order.qty * products[order.prodNick].packSize)

    return {
      setoutKey: shapeType,
      total: totalEa,
      pans: Math.floor(totalEa / panQtyByShapeType[shapeType]),
      remainder: totalEa % panQtyByShapeType[shapeType],
      orders: shapeTypeGroup,
    }
  })
  .sort(compareBy(row => row.setoutKey))

/**
 * @param {CombinedRoutedOrder[]} orders 
 * @param {{[x: string]: DBProduct}} products
 */
const calculateSetoutOther = (orders, products) => orders
  .reduce(groupByArrayRdc(order => order.prodNick), [])
  .map(prodNickGroup => ({
    rowKey: prodNickGroup[0].prodNick,
    total: sumBy(prodNickGroup, order => order.qty * products[order.prodNick].packSize),
    orders: prodNickGroup,
  }))
  .sort(compareBy(row => row.rowKey))


/**
 * When generating a report for a date R0, we should collect orders from
 * dates R1, R2, and R3, which are 1, 2, and 3 days after R0, respectively.
 * @param {DBProduct[] | undefined} PRD 
 * @param {CombinedRoutedOrder[] | undefined} R1Orders 
 * @param {CombinedRoutedOrder[] | undefined} R2Orders 
 * @param {CombinedRoutedOrder[] | undefined} R3Orders 
 * @returns
 */
const calculateSetoutPrado = (PRD, R1Orders, R2Orders, R3Orders) => {
  if (!PRD || !R1Orders || !R2Orders || !R3Orders) {
    return { 
      north: { croix: undefined, other: undefined, almond: undefined }, 
      south: { croix: undefined, other: undefined, almond: undefined },  
    }
  }

  const products = keyBy(PRD, P => P.prodNick)
  const [_R1, _R2, _R3] = [R1Orders, R2Orders, R3Orders]
    .map(RNOrders => RNOrders
      .filter(order => filterToSetoutItems(order, products))
      .flatMap(order => splitBackporchCroixOrder(order, products))
    )

  // Warning: this setup assumes orders are baked and delivered 
  // on the same day. This *should* be a reasonable assumption.
  const { 
    R1PradoBakedCroix=[], 
    R1PradoBakedOther=[], 
    R1PradoBakedAlmond=[], 
    R1PradoFrozenAlmond=[], 
    R1CarltonFrozenAlmond=[],                  
  } = groupByObject(_R1, order => classifyPastryOrder("R1", order, products))
  const { 
    R2CarltonFrozenAlmond=[], R2CarltonBakedAlmond=[], 
    R2PradoFrozenAlmond=[], R2PradoBakedAlmond=[], 
  } = groupByObject(_R2, order => classifyPastryOrder("R2", order, products))
  const { 
    R3CarltonBakedAlmond=[]
  } = groupByObject(_R3, order => classifyPastryOrder("R3", order, products))


  //  Prado Setout
  // ==============
  const pradoSetoutCroix = calculateSetoutCroix(
    [
      ...R1PradoBakedCroix, 
      ...R2PradoFrozenAlmond, // almond orders get counted as plains for setout
      ...R2CarltonFrozenAlmond, 
      ...R2PradoBakedAlmond, 
      ...R3CarltonBakedAlmond,
    ],
    products
  )
  const pradoSetoutOther = calculateSetoutOther(
    R1PradoBakedOther, 
    products
  )

  const freezerAlmondOrders = [
    ...R1PradoFrozenAlmond, 
    ...R1CarltonFrozenAlmond, 
    ...R2CarltonBakedAlmond
  ]
  const pradoSetoutAlmond = [
    {
      rowKey: 'refrigerator',
      total: sumBy(R1PradoBakedAlmond, order => order.qty * products[order.prodNick].packSize),
      orders: R1PradoBakedAlmond
    },
    {
      rowKey: 'freezer',
      total: sumBy(freezerAlmondOrders, order => order.qty * products[order.prodNick].packSize),
      orders: freezerAlmondOrders
    },
  ]

  const pradoSetoutCookie = R1Orders
    .filter(order => 1
      && ['chch', 'snik'].includes(order.prodNick)
      && !(order.isWhole === false && order.meta.routeNick === 'Pick up Carlton')
    )
    .reduce(groupByArrayRdc(order => order.prodNick), [])
    .map(orderGroup => ({
      rowKey: orderGroup[0].prodNick,
      total: sumBy(orderGroup, order => order.qty * products[order.prodNick].packSize),
      orders: orderGroup
    }))



  return {
    croix:  pradoSetoutCroix,
    other:  pradoSetoutOther,
    almond: pradoSetoutAlmond,
    cookie: pradoSetoutCookie,
    products,
  }

}


/**
 * When generating a report for a date R0, we should collect orders from
 * date R1, the day after R0.
 * @param {DBProduct[] | undefined} PRD 
 * @param {CombinedRoutedOrder[] | undefined} R1Orders 
 * @returns
 */
const calculateSetoutCarlton = (PRD, R1Orders) => {
  if (!PRD || !R1Orders) {
    return { croix: undefined, other: undefined, almond: undefined, products: undefined }
  }

  const products = keyBy(PRD, P => P.prodNick)
  const R1SetoutItems = R1Orders
    .filter(order => filterToSetoutItems(order, products))
    .flatMap(order => splitBackporchCroixOrder(order, products))
    .filter(order => !(['chch', 'snik'].includes(order.prodNick)))  // Stupid cookie bs. Current intended behavior is for cookies not to show up on carlton setout.

  const { R1CarltonBakedCroix=[], R1CarltonBakedOther=[] } = groupByObject(
    R1SetoutItems,
    order => classifyPastryOrder("R1", order, products)
  )

  return { 
    croix: calculateSetoutCroix(R1CarltonBakedCroix, products), 
    other: calculateSetoutOther(R1CarltonBakedOther, products), 
    almond: undefined,
    cookie: undefined,
    products,
  }

}

export {
  calculateSetoutPrado,
  calculateSetoutCarlton,
}