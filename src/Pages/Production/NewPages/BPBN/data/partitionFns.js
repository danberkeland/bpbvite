import { groupBy } from "lodash/fp"


const partitionOrdersByBakeLocation = ({ orders, products, routes }) => {
  // Business Logic: Where do we bake an item?
  // If an item is only baked 'exclusively' at 1 shop location, 
  // then pick that location. Otherwise we pick based on where the product 
  // is fulfilled from, and choose that as the location. 
  //
  // This is a very simplified (jank) logic that works for us only. 
  // Not generally applicable.
  const assignBakeLocation = order => {
    const { bakedWhere } = products[order.prodNick]
    const { RouteDepart } = routes[order.routeMeta.routeNick]
    
    return bakedWhere.length === 1 ? bakedWhere[0] : RouteDepart
  }

  const { 
    Prado:bpbsOrders=[], 
    Carlton:bpbnOrders=[], 
    undefined: unhandledOrders,
  } = groupBy(assignBakeLocation)(orders)

  if (!!unhandledOrders) console.warn("Unhandled orders:", unhandledOrders)

  return { bpbsOrders, bpbnOrders }

}

/**
 * Almond croix dont show up anywhere in the bpbn lists, so we separate them
 * from the 'croix' category.
*/
const getListType = (product) => {
  let { prodNick, bakedWhere, isWhole, packGroup, doughNick } = product

  if( !bakedWhere.includes('Carlton') || !isWhole ) {
    return undefined
  } 

  if (["rustic breads", "retail"].includes(packGroup)) return "rustic"
  else if (['al', 'fral'].includes(prodNick)) return "almond"
  else if (doughNick === "Croissant") return "croix"
  else if (packGroup !== "cafe menu") return "otherPrep"
  else if (packGroup === "cafe menu") return "cafe"
  else return undefined

}

const partitionBpbnOrdersByListType = ({ bpbnOrders, products }) => {

  const { 
    rustic=[], 
    croix=[], 
    otherPrep=[],
    almond=[],
    undefined:unknownListType,
  } = groupBy(order  => getListType(products[order.prodNick]))(bpbnOrders)

  if (!!unknownListType) {
    console.warn("unhandled BPBN orders:", unknownListType)
  }

  return { rustic, croix, otherPrep, unknownListType }

}

export { 
  partitionOrdersByBakeLocation, 
  partitionBpbnOrdersByListType,
  getListType
}