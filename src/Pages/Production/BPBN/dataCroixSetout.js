// import { CombinedRoutedOrder } from "../../../data/production/useProductionData"
// import { DBProduct } from "../../../data/types.d"
// import { compareBy, groupByArrayRdc, groupByObject, keyBy, sumBy } from "../../../utils/collectionFns"

// /**
//  * @param {CombinedRoutedOrder[] | undefined} T0Orders 
//  * @param {CombinedRoutedOrder[] | undefined} T1Orders 
//  * @param {DBProduct[] | undefined} PRD 
//  * @param {string} bakeDate 
//  */
// export const calculateCroixSetout = (T0Orders, T1Orders, PRD, bakeDate) => {
//   if (!T0Orders ||!T1Orders || !PRD) return undefined

//   const products = keyBy(PRD, P => P.prodNick)

//   // *** Filter/Query functions ***

//   const calculateBakeDate = (/** @type {CombinedRoutedOrder} */ order) =>
//     order.meta.routePlan.steps[0].begin.date

//   const calculateBakePlace = (/** @type {CombinedRoutedOrder} */ order) =>
//     order.meta.routePlan.steps[0].end.place

//   const testIsSetoutPastry = (/** @type {DBProduct} */ product) => 1
//     && product.packGroup === "baked pastries"
//     && product.doughNick === "Croissant"
//     && product.prodNick  !== "al"

//   const shouldInclude = (/** @type {CombinedRoutedOrder} */ order) => 1
//     && calculateBakeDate(order)  === bakeDate
//     && calculateBakePlace(order) === "Carlton" // Means the product CAN be prepped at the carlton, and the actual order WILL be prepped at the carlton
//     && testIsSetoutPastry(products[order.prodNick]) === true

//   // *** Pipeline Functions ***

//   const adjustBackporchQty = order => order.locNick === 'backporch'
//     ? { ...order, qty: Math.ceil(order.qty / 2) }
//     : order

//   const formatRow = rowOrders => {
//     const { prodNick, prodName, packSize } = products[rowOrders[0].prodNick]

//     return {
//       prodNick,
//       prodName,
//       items: rowOrders,
//       qty: sumBy(rowOrders, order => order.qty * packSize)
//     }

//   }
  
//   // *** Pipline ***

//   return [...T0Orders, ...T1Orders]
//     .filter(order => shouldInclude(order))
//     .map(order => adjustBackporchQty(order))
//     .reduce(groupByArrayRdc(order => order.prodNick), [])
//     .map(rowOrders => formatRow(rowOrders))
//     .sort(compareBy(row => row.prodName))

// }