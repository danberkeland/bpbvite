import { convertDatetoBPBDate } from "../../utils/_deprecated/convertDatetoBPBDate";
import { IsoDate } from "../../utils/dateTimeFns";
import { uniqByN } from "../../utils/collectionFns/uniqByN";
import { compareBy } from "../../utils/collectionFns/compareBy";
import { addRoutes } from "../logistics/addRoutes";

const _getFullOrders = (delivDate, database, includeHolding=false) => {
  // const [products, customers, routes, standing, orders] = database;

  const orders = database[4].filter(order => 1
    && order.delivDate === convertDatetoBPBDate(delivDate)
    && order.prodName !== ''  
  )

  const _standing = includeHolding 
    ? database[3] 
    : database[3].filter(S => S.isStand === true)

  const standing = 
    _standing.map(standing => standingToOrder(standing, delivDate))

  return uniqByN([...orders, ...standing], [
    order => order.prodName,
    order => order.custName,
  ])
  .sort(compareBy(order => order.prodName))
  .filter(order => order.prodName !== '')

}

/**DEPRECATED: use getOrdersList if possible */
const getFullOrders = (delivDate, database) => 
  _getFullOrders(delivDate, database, false)

/**DEPRECATED: use getOrdersList if possible */
const getFullProdOrders = (delivDate, database) => 
  _getFullOrders(delivDate, database, true)


// ***** Main Function *****
//
// Use to replace anything that looks like:
//
//   getFullOrders(...);
//   zerosDelivFilter(...);
//   buildGridOrderArray(...);
//   addRoutes(...);
const getOrdersList = (delivDate, database, includeHolding=false) => {
  // const [products, customers, routes, standing, orders] = database;
  const products  = database[0]
  const customers = database[1]

  let fullOrder = _getFullOrders(delivDate, database, includeHolding)
    .filter(order => order.qty !== 0)
    .map(order => {
      const customer = customers.find(C => C.custName === order.custName)

      if (!customer) return order
      
      const zoneName = (order.route === undefined || order.route === "deliv")
        ? customer.zoneName
        : order.route

      return { ...order, zoneName }
    })
    .map(order => addDimensionPropsToOrder(
      order, 
      customers.find(C => C.custName === order.custName) ?? {}, 
      products.find(P => P.prodName === order.prodName) ?? {},
    ))


  fullOrder = addRoutes(delivDate, fullOrder, database)

  return fullOrder
}


/** 
 * Transforms standing item to match the shape of order items. 
 * Selects the qty associated with the supplied delivDate 
 */
const standingToOrder = (standingItem, delivDate) => {

  const dayOfWeek = IsoDate.toWeekdayEEE(delivDate)

  return {
    id: null,
    version:   standingItem["_version"],
    qty:       standingItem[dayOfWeek],
    prodName:  standingItem["prodName"],
    custName:  standingItem["custName"],

    isWhole:   true,
    delivDate: convertDatetoBPBDate(delivDate),
    timeStamp: standingItem["timeStamp"],
    SO:        standingItem[dayOfWeek],
  }

}

/** Adds a bunch of product and customer props. Also removes some original order props */
const addDimensionPropsToOrder = (order, customer={}, product={}) => {
  const { prodName, custName, zoneName, route, qty } = order
  const {
    doughType,
    bakedWhere,
    readyTime,
    forBake,
    preshaped,
    prepreshaped,
    updatePreDate,
    id,
    packSize,
    weight,
    currentStock,
    batchSize,
    bakeExtra,
    packGroup,
    freezerNorth,
    freezerNorthClosing,
    freezerNorthFlag,
    freezerCount,
    freezerClosing,
  } = product

  return {
    prodName,
    delivOrder: customer.delivOrder ?? 0,
    prodNick: product.nickName,
    custName,
    custNick: customer.nickName,
    zone: zoneName,
    route,
    qty,
    doughType,
    where: bakedWhere,
    when: readyTime,
    forBake,
    preshaped,
    prepreshaped,
    updatePreDate,
    prodID: id,
    packSize,
    weight,
    currentStock,
    batchSize,
    bakeExtra,
    packGroup,
    freezerNorth,
    freezerNorthClosing,
    freezerNorthFlag,
    freezerCount,
    freezerClosing,
  }
}

export {
  getOrdersList,
  getFullOrders,
  getFullProdOrders,
}