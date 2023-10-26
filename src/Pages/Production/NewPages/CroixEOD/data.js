// data & functions to calculate the EOD at both north and south locations.
//
// functions here expect orders to be combined and routed like those 
// generated by useT0T7ProdOrders. We expect a flat list of orders that 
// covers T0 and T1. Holding orders are not required but will be filtered
// out anyway.

import { DateTime } from "luxon"
import { useT0T7ProdOrders } from "../../../../data/useT0T7ProdOrders"
import { useListData } from "../../../../data/_listData"
import { useMemo } from "react"
import { keyBy} from "lodash"

import { flow, pickBy, mapValues, mapKeys, groupBy, sumBy, merge, filter, map } from "lodash/fp"

// maps different croissant type products back to their original shaped type.
// we label orders by these 'shapeNicks' to help us aggregate qtys.

const shapeNickMap = {
  pl: 'pl', frpl: 'pl', al: 'pl', fral: 'pl',
  ch: 'ch', frch: 'ch',
  pg: 'pg', frpg: 'pg',
  sf: 'sf', frsf: 'sf',
  mb: 'mb', frmb: 'mb', unmb: 'mb',
  mini: 'mini', frmni: 'mini',
}
const mapToShapeNick = (prodNick) => shapeNickMap[prodNick]

const isBakedCroix = (product) => product.packGroup === "baked pastries" 
  && product.doughNick === "Croissant"


// can take any superset of T0 & T1 orders. Holding orders are not required.
const calculateCroixSentNorth = ({ T0T1Orders, products }) => {
  console.log("products", products)

  const freezerCounts = flow(
    pickBy(isBakedCroix),
    mapValues(product => ({ total: product.freezerNorth })),
    mapKeys(mapToShapeNick),
  )(products)  

  const emptyData = mapValues(P => ({ total: 0, items: []}))(freezerCounts)

  const isT0FrozenNorthCroixOrder = (order) => {
    const product = products[order.prodNick]

    return order.relDate === 0
      && product.packGroup === "frozen pastries"
      && product.doughNick === "Croissant"
      && order.isStand !== false
      && order.routeMeta.route.RouteDepart === "Carlton"
  }

  const _frozenOrders = flow(
    filter(isT0FrozenNorthCroixOrder),
    map(order => ({ ...order, shapeNick: shapeNickMap[order.prodNick] })),
    groupBy('shapeNick'),
    mapValues(group => ({ total: sumBy('qty')(group), items: group }))
  )(T0T1Orders)
  const frozenOrders = { ...emptyData, ..._frozenOrders }

  const isT1BakedNorthCroixOrder = (order) => {
    const product = products[order.prodNick]

    return order.relDate === 1
      && product.packGroup === "baked pastries"
      && product.doughNick === "Croissant"
      && order.isStand !== false
      && order.routeMeta.route.RouteDepart === "Carlton"

  }

  const _bakedOrders = flow(
    filter(isT1BakedNorthCroixOrder),
    map(order => ({ ...order, shapeNick: shapeNickMap[order.prodNick] })),
    groupBy('shapeNick'),
    mapValues(group => ({ total: sumBy('qty')(group), items: group }))
  )(T0T1Orders)
  const bakedOrders = { ...emptyData, ..._bakedOrders }
  

  const calculateSendNorthTotal = (value, shapeNickKey) => {
    const fr = frozenOrders[shapeNickKey].total
    const bk = bakedOrders[shapeNickKey].total
    const stock = freezerCounts[shapeNickKey].total

    return Math.ceil(Math.max(fr + bk - stock, 0) / 12) * 12
  }

  console.log("emptyData", emptyData)
  const northEodCounts = 
    mapValues.convert({cap: false})(calculateSendNorthTotal)(emptyData)

  return {
    bakedOrders,
    freezerCounts,
    frozenOrders,
    northEodCounts,
  }
}




export const useNorthEodData = () => {
  const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')

  const { data:orders } = useT0T7ProdOrders({ 
    shouldFetch: true, 
    reportDate: todayDT.toFormat('yyyy-MM-dd'),
  })
  const { data:PRD } = useListData({ 
    tableName: "Product", 
    shouldFetch: true 
  })
 


  const calculateValue = () => {
    if (!orders || !PRD) return undefined

    const products = keyBy(PRD, 'prodNick')
    
    console.log(products, orders)
    const croixSentNorth = 
      calculateCroixSentNorth({ T0T1Orders: orders, products })
    console.log("croixSentNorth:", croixSentNorth)




  }



  return { data: useMemo(calculateValue, [orders, PRD])}
}
