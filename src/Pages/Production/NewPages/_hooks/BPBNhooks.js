// import { useMemo } from "react"
// import { useOrderReportByDate } from "../../../../data/productionData"
// import { useListData } from "../../../../data/_listData"
// import { groupBy, round, sortBy, sumBy, sum } from "lodash"
// import { DateTime } from "luxon"

// // 1. Shape and Bake lists for rustics
// // 2. Prep list                       
// // 3. Set Out list
// // 4. Pastry Prep                
// // 5. Baguette Dough                  

// // *****************************************************************************
// // 1. Shape and Bake lists for rustics                                   
// // *****************************************************************************

// // ***********
// // * Filters *
// // ***********

// /** i.e. is a rustic bread shaped at the carlton */
// const isCarltonRustic = (product) => {
//   const { bakedWhere, packGroup } = product
//   return (
//     bakedWhere.includes("Carlton")
//     && ["rustic breads", "retail"].includes(packGroup)
//   )
// }

// const isNorthRoute = (route) => {
//   const { RouteDepart, RouteArrive } = route

//   return RouteDepart === 'Carlton' 
//     && RouteArrive === 'Carlton'
// }

// const isNotCarltonPickup = (location, fulfillment) => {
//   const { zoneNick } = location

//   return zoneNick !== "Carlton Retail"
//     && zoneNick !== 'atownpick'
//     && fulfillment !== 'atownpick' // <<< this condition not in original test?
// }

// const canBakeAndDeliverCarltonProductSameDay = (route) => {
//   const { routeStart, RouteDepart, routeNick } = route

//   return (
//     RouteDepart === "Carlton"                                 // is north route
//     || ["Pick up Carlton", "Pick up SLO"].includes(routeNick) // is pickup
//     || (RouteDepart === "Prado" && routeStart >= 8)           // is late south
//   )
// }

// // *********
// // * Hooks *
// // *********

// /**Template hook for producing the very similar BPBN shape and bake lists. */
// const useRusticList = ({ 
//   dateDT, 
//   shouldFetch, 
//   includeHolding, 
//   format 
// }) => {
  
//   const { routedOrderData:T0orders } = useOrderReportByDate({
//     delivDateJS: dateDT.toJSDate(), 
//     includeHolding, 
//     shouldFetch, 
//   })
//   const { routedOrderData:T1orders } = useOrderReportByDate({
//     delivDateJS: dateDT.plus({ days: 1 }).toJSDate(), 
//     includeHolding, 
//     shouldFetch 
//   })

//   const composeRusticList = () => {
//     if (!T0orders || !T1orders) return undefined

//     const T0itemsToCount = T0orders.filter(order => 
//       isCarltonRustic(order.product)
//       && canBakeAndDeliverCarltonProductSameDay(order.route)
//     ).map(order => ({
//       ...order, 
//       sameDay: true
//     }))
  
//     const T1itemsToCount = T1orders.filter(order =>
//       isCarltonRustic(order.product)
//       && (canBakeAndDeliverCarltonProductSameDay(order.route) === false)
//     ).map(order => ({
//       ...order, 
//       sameDay: false
//     }))

//     const _list = T0itemsToCount.concat(T1itemsToCount)
//       .filter(order => order.qty !== 0)                                         // do we want to count negative qtys?
//     const shapeList = sortBy(_list, ['product.prodName'])                       // Sorting adds to consistency when seletcing a product to represtent a forBake group

//     if (format === "list") return shapeList 

//     const _goupedByForBake = groupBy(shapeList, order => order.product.forBake)
//     if (format === "groupedByForBake") return _goupedByForBake

//     if (format === "forBakeTotals") {
//       const _totaledByQty = Object.values(_goupedByForBake).map(fbGroup => {
//         const { product } = fbGroup[0]

//         const ordersNeededEarly = fbGroup.filter(order => {
//           const { route, location, fulfillment } = order
//           return isNorthRoute(route) 
//             && isNotCarltonPickup(location, fulfillment) 
//         })

//         const qty = sumBy(fbGroup, order => order.qty * order.product.packSize)
//         const preshaped = product.preshaped || 0 
//         const surplus = preshaped - qty
//         const shortText = surplus > 0 ? `Over ${surplus}`
//           : surplus < 0 ? `Short ${surplus * -1}`
//           : ''
//         const qtyNeededEarly = sumBy(
//           ordersNeededEarly, 
//           order => order.qty * order.product.packSize
//         )

//         return ({
//           prodNick: product.prodNick,                    
//           forBake: product.forBake,
//           weight: product.weight,
//           doughNick: product.doughNick,
//           qty,
//           preshaped,                      // intended for bakeList
//           shortText,                      // intended for bakeList
//           needEarly: qtyNeededEarly || '' // intended for bakeList
//         })
//       })

//       return _totaledByQty
//     }

//     console.warn(`Input 'format: ${format}' not recognized.`)
//     return undefined

//   } // end composeRusticList

//   return useMemo(composeRusticList, [T0orders, T1orders, format])

// }

// // Emulates 'composeWhatToMake'
// /**
//  * @typedef {Object} DateTime Luxon DateTime object
//  * @typedef {'list' | 'groupedByForBake' | 'forBakeTotals'} FormatOption
//  */

// /**
//  * Counts are for rustic bread products made at the Carlton.
//  * 
//  * Shaping happens 1 day prior to baking, so shape totals for a given day are
//  * almost equal to the bake totals for the next day. Only difference is we do
//  * include holding orders for prep tasks.
//  * 
//  * Note, this hook is read only, and only returns data. No destructuring or 
//  * aliasing (like '{ data:shapeList }') is required.
//  * @function
//  * @param {DateTime} input
//  * @param {number} input.dateDT - Luxon DateTime specifying which date we are 
//  * shaping for. For accurate results be sure to use .startOf('day').
//  * @param {boolean} [input.shouldFetch=true] - For external control of fetch 
//  * timing.
//  * @param {FormatOption} input.format - Option to
//  * choose the format of the cached/returned data.
//  * @returns {Object[]} A list of order items that contribute to the input 
//  * date's rustic shape totals.
//  */
// export const useBPBNshapeList = ({ dateDT, 
//   format="list", 
//   shouldFetch=true 
// }) => {
//   return useRusticList({ 
//     dateDT: dateDT.plus({ days: 1}),
//     format,
//     shouldFetch,
//     includeHolding: true
//   })
    
// }

// // Emulates 'composeWhatToBake'
// /**
//  * Counts are for rustic bread products made at the Carlton.
//  * 
//  * The counts for the input date are derived from the same day's orders (ones 
//  * that can be baked and delivered on the same day) and from the next day's 
//  * orders (ones that cannot be baked and delivered on the same day). Holding
//  * orders are not counted here.
//  * 
//  * Note, this hook is read only, and only returns data. No destructuring or 
//  * aliasing (like '{ data:bakeList }') is required.
//  * @param {DateTime} dateDT Luxon DateTime specifying which date we are
//  * baking for. For accurate results be sure to use .startOf('day').
//  * @param {boolean} [input.shouldFetch=true] - For external control of fetch 
//  * timing.
//  * @param {FormatOption} input.format - Option to
//  * choose the format of the cached/returned data.
//  * @returns {Object[]} A list of order items that contribute to the input 
//  * date's rustic bake totals.
//  */
// export const useBPBNbakeList = ({ dateDT, 
//   format="list", 
//   shouldFetch=true 
// }) => {
//   return useRusticList({ 
//     dateDT: dateDT.plus({ days: 0}),
//     format,
//     shouldFetch,
//     includeHolding: false
//   })

// }

// // *****************************************************************************
// // 2. Prep List                                                          
// // *****************************************************************************

// // ***********
// // * Filters *
// // ***********

// const isInPrepCategory = (product) => {
//   let { packGroup, doughNick } = product
//   return doughNick !== "Croissant"
//     && !(["rustic breads", "retail", "cafe menu"].includes(packGroup))
// }

// /**Baked only at the Carlton */
// const isExclusiveNorthProduct = (product) => 
//   product.bakedWhere.includes("Carlton") && product.bakedWhere.length === 1

// /**Baked at the Carlton and possibly elsewhere */
// const isNonexclusiveNorthProduct = (product) =>
//   product.bakedWhere.includes("Carlton")

// const isFulfilledFromCarlton = (route) => 
//   route.RouteDepart === "Carlton" // || route.routeNick === "Pick up Carlton"   // <<< Old code; Pick up Carlton has a RouteDepart value of "Carlton" 

// /**
//  * Deliver P0, same as prep day === input date T0.
//  * 
//  * Logic for determining whether or not delivery date === bake date varies by
//  * product type. This test applies to BPBN prep items.
// */
// const isDeliveredP0item = (product) => product.readyTime < 14


// /**
//  * Deliver P1, the day after prep P0 === input date T0.
//  * 
//  * Logic for determining whether or not delivery date === bake date varies by
//  * product type. This test applies to BPBN prep items.
// */
// const isDeliveredP1item = (product) => !isDeliveredP0item(product)

// // *********
// // * Hooks *
// // *********

// // Emulates 'composeWhatToPrep'
// /**
//  * This is kind of an ad hoc category of products prepped at the Carlton. 
//  * Counts are derived from non-production orders for the input date and the
//  * day after.
//  * @param {*} param0 
//  */
// export const useBPBNprepList = ({ 
//   dateDT, 
//   format="list",
//   shouldFetch=true 
// }) => {
//   const { routedOrderData:T0orders } = useOrderReportByDate({
//     delivDateJS: dateDT.toJSDate(), 
//     includeHolding: false, 
//     shouldFetch 
//   })
//   const { routedOrderData:T1orders } = useOrderReportByDate({
//     delivDateJS: dateDT.plus({ days: 1 }).toJSDate(), 
//     includeHolding: false, 
//     shouldFetch 
//   })

//   const composePrepList = () => {
//     if (!T0orders || !T1orders) return undefined

//     // Deliver/fulfill today
//     const D0prepItemsToCount = T0orders.filter(order => {
//       const { product, route } = order
      
//       return isDeliveredP0item(product)
//       && isInPrepCategory(product)
//       && (
//           isExclusiveNorthProduct(product)
//           || (
//             isNonexclusiveNorthProduct(product) 
//             && isFulfilledFromCarlton(route)
//           )
//       )
//     })

//     // Deliver/fulfill tomorrow
//     const D1prepItemsToCount = T1orders.filter(order => {
//       const { product, route } = order
      
//       return isDeliveredP1item(product)
//       && isInPrepCategory(product)
//       && (
//           isExclusiveNorthProduct(product)
//           || (
//             isNonexclusiveNorthProduct(product) 
//             && isFulfilledFromCarlton(route)
//           )
//       )
//     })

//     const _list = D0prepItemsToCount.concat(D1prepItemsToCount)
//       .filter(order => order.qty !== 0)
//     const prepList = sortBy(_list, ['product.prodName'])

//     if (format === 'list') return prepList
    
//     const _groupedByForbake = groupBy(prepList, order => order.product.forBake)

//     if (format === 'groupedByForBake') return _groupedByForbake

//     if (format === 'forBakeTotals') {
//       const _totaledByQty = Object.values(_groupedByForbake).map(fbGroup => ({
//         prodNick: fbGroup[0].product.prodNick,
//         prodName: fbGroup[0].product.prodName,
//         forBake: fbGroup[0].product.forBake,
//         qty: sumBy(fbGroup, order => order.qty * order.product.packSize)
//       }))

//       return _totaledByQty
//     }

//     console.warn(`Input 'format: ${format}' not recognized.`)
//     return undefined

//   } // end composePrepList

//   return useMemo(composePrepList, [T0orders, T1orders, format])

// }


// // *****************************************************************************
// // 3. Set Out list                                                       
// // *****************************************************************************

// // *********
// // * Hooks *
// // *********


// /** emulates composePastryPrep */
// export const useBPBNcroixSetoutList = ({ 
//   dateDT, 
//   format="list", 
//   shouldFetch=true
// }) => {

//   const { routedOrderData:T1ProdOrders } = useOrderReportByDate({
//     delivDateJS: dateDT.plus({ days: 1 }).toJSDate(),
//     includeHolding: true,
//     shouldFetch
//   }) 

//   const composeCroixSetout = () => {
//     if (!T1ProdOrders) return undefined

//     const T1croixOrdersToCount = T1ProdOrders.filter(order => {
//       const { prodNick, locNick, product, route } = order
//       const RouteDepart = route?.RouteDepart

//       return (
//         (RouteDepart === "Carlton" || locNick === "backporch") &&               // <<< deleted 'routeNick === "Pick Up Carlton"' from group of OR conditions
//         locNick !== "bpbextras" &&
//         product.packGroup === "baked pastries" &&
//         product.doughNick === "Croissant" &&
//         prodNick !== "al"
//       )
//     })
    
//     const croixSetoutList = T1croixOrdersToCount.map(order => 
//       order.locNick === 'backporch'
//         ? { ...order, qty: Math.ceil(order.qty / 2)}
//         : order
//     ).map(order => 
//       order.prodNick === 'unmb'
//         ? { ...order, prodNick: 'mb' }
//         : order
//     )
//     if (format === 'list') return sortBy(croixSetoutList, ['prodNick'])

//     const _byProdNick = groupBy(croixSetoutList, order => order.prodNick)
//     if (format === 'groupedByProdNick') return _byProdNick

//     if (format === 'prodNickTotals') {
//       const prodNickTotals = Object.values(_byProdNick).map(pnGroup => {
//         const { prodNick } = pnGroup[0]
//         const qty = sumBy(pnGroup, order => order.qty * order.product.packSize)
//         const qtyPerPan = prodNick === 'mini' ? 15
//           : prodNick === 'mb' ? 6
//           : 12
//         const pans = Math.floor(qty / qtyPerPan)
//         const panRemainder = qty % qtyPerPan

//         return ({
//           prodNick,
//           qty,
//           pans,
//           panRemainder
//         })
//       })

//       return sortBy(prodNickTotals, ['prodNick'])
//     }

//     console.warn(`Input 'format: ${format}' not recognized.`)
//     return undefined

//   } // end composeCroixSetout

//   return useMemo(composeCroixSetout, [T1ProdOrders, format])

// }

// // *****************************************************************************
// // 4. Pastry Prep
// // *****************************************************************************

// export const useBPBNpastryPrepList =({
//   dateDT, 
//   format="list", 
//   shouldFetch=true
// }) => {
//   const { routedOrderData:T1prod } = useOrderReportByDate({
//     delivDateJS: dateDT.plus({ days: 1}).toJSDate(),
//     includeHolding: true,
//     shouldFetch
//   })

//   const composePastryPrep = () => {
//     if (!T1prod) return undefined

//     const pastryPrepList = T1prod.filter(order => {
//       const { 
//         product, 
//         routeNick, 
//         route 
//       } = order
//       const { packGroup, doughNick } = product
//       const RouteDepart = route?.RouteDepart

//       const isNonCroixPastry = packGroup === "baked pastries" 
//         && doughNick !== "Croissant"
  
//       return isNonCroixPastry && (
//         isExclusiveNorthProduct(product)
//         || (
//           isNonexclusiveNorthProduct(product) 
//           && (RouteDepart === "Carlton" || routeNick === "Pick Up SLO")         // Not sure how to interpret this part; copied from old code
//         )
//       )

//     })// end pastryPrepList

//     const _list = sortBy(pastryPrepList, order => order.prodNick)
//     if (format === 'list') return _list

//     const _byProdNick = groupBy(_list, order => order.prodNick)
//     if (format === 'groupedByProdNick') return _byProdNick

//     if (format === 'prodNickTotals') {
//       const _totals = Object.values(_byProdNick).map(pnGroup => ({
//         prodNick: pnGroup[0].prodNick,
//         qty: sumBy(pnGroup, order => order.qty)
//       }))

//       return _totals

//     }

//     console.warn(`Input 'format: ${format}' not recognized.`)
//     return undefined

//   } // end composePastryPrep

//   return useMemo(composePastryPrep, [T1prod, format])

// }




// // *****************************************************************************
// // 5. Baguette Dough
// // *****************************************************************************

// export const useBPBNbaguetteDoughSummary = ({
//   dateDT, 
//   shouldFetch=true
//   // format="list", 
// }) => {
//   const { routedOrderData:T0prod } = useOrderReportByDate({
//     delivDateJS: dateDT.plus({ days: 0 }).toJSDate(), 
//     includeHolding: true, 
//     shouldFetch 
//   })
//   const { routedOrderData:T1prod } = useOrderReportByDate({
//     delivDateJS: dateDT.plus({ days: 1 }).toJSDate(), 
//     includeHolding: true, 
//     shouldFetch 
//   })
//   const { routedOrderData:T2prod } = useOrderReportByDate({
//     delivDateJS: dateDT.plus({ days: 2 }).toJSDate(), 
//     includeHolding: true, 
//     shouldFetch 
//   })
//   const { routedOrderData:T3prod } = useOrderReportByDate({
//     delivDateJS: dateDT.plus({ days: 3 }).toJSDate(), 
//     includeHolding: true, 
//     shouldFetch 
//   }) 
  
//   const { data:doughs } = useListData({ 
//     tableName: "DoughBackup",
//     shouldFetch 
//   })

//   const { data:products } = useListData({ 
//     tableName: "Product",
//     shouldFetch 
//   })
//   const composeDoughSummary = () => {
//     if (!T0prod || !T1prod || !T2prod || !T3prod || !products || !doughs) {
//       return undefined
//     }

//     const doughsByDoughName = Object.fromEntries(
//       doughs.map(D => [D.doughName, D])
//     )
//     const productsByForBake = groupBy(products, P => P.forBake)

//     // "Baguette orders to be baked today"
//     //  - does not include holding orders
//     const B0baguetteOrders = T0prod.filter(order => {
//       const { product, route } = order
//       return order.isStand !== false && product.doughNick === "Baguette"
//         && isCarltonRustic(product)
//         && canBakeAndDeliverCarltonProductSameDay(route)

//     }).concat(T1prod.filter(order => {
//       const { product, route } = order
//       return order.isStand !== false && product.doughNick === "Baguette"
//         && isCarltonRustic(product)
//         && !canBakeAndDeliverCarltonProductSameDay(route)

//     }))

//     // "Baguette orders to be baked tomorrow"
//     // - includes holding orders
//     const B1baguetteOrders = T1prod.filter(order => {
//       const { product, route } = order
//       return product.doughNick === "Baguette"
//         && isCarltonRustic(product)
//         && canBakeAndDeliverCarltonProductSameDay(route)

//     }).concat(T2prod.filter(order => {
//       const { product, route } = order
//       return product.doughNick === "Baguette"
//         && isCarltonRustic(product)
//         && !canBakeAndDeliverCarltonProductSameDay(route)

//     }))

//     // "Baguette orders to be baked the day after tomorrow"
//     // - includes holding orders
//     // - this one will just be used at the end for estimating bucket sets
//     const B2baguetteOrders = T2prod.filter(order => {
//       const { product, route } = order
//       return product.doughNick === "Baguette"
//         && isCarltonRustic(product)
//         && canBakeAndDeliverCarltonProductSameDay(route)

//     }).concat(T3prod.filter(order => {
//       const { product, route } = order
//       return product.doughNick === "Baguette"
//         && isCarltonRustic(product)
//         && !canBakeAndDeliverCarltonProductSameDay(route)

//     }))
//     const B2baguetteTotalWeight = sumBy(
//       B2baguetteOrders, 
//       order => order.qty * order.product.weight * order.product.packSize
//     )

//     const B0bagOrdersByForBake = groupBy(
//       B0baguetteOrders, order => order.product.forBake
//     )

//     const B0prepSummary = Object.values(B0bagOrdersByForBake).map(group => {
//       const { product: { forBake, weight, packSize } } = group[0]
      
//       const prodWithPreshapeQty = productsByForBake[forBake]
//         .find(prod => prod.preshaped !== null)
//       const preshaped = prodWithPreshapeQty 
//         ? prodWithPreshapeQty.preshaped 
//         : 0
      
//       const qtyNeeded = sumBy(group, order => order.qty)

//       return ({
//         forBake, weight, packSize, qtyNeeded, preshaped,
//         surplusQty: Math.max(preshaped - qtyNeeded, 0),
//         shortQty: Math.max(qtyNeeded - preshaped, 0)
//       })
//     }) // end B0prepSummary

//     // *** calculating short dough ***

//     // Sum the above group summaries on short Qty.
//     // - We assume items with different forBake names do not have the same type 
//     //   of preshape and therefore are not interchangeable (ie a surplus of one 
//     //   type cannot be used to make up for a defecit in the other).
//     const doughShort = sumBy(
//       B0prepSummary,
//       item => item.shortQty * item.weight * item.packSize
//     )

//     // *** new: calculating surplus dough ***
//     // Seems like surplus/unused preshaped dough could be mixed though in the next
//     // batch, affecting the required mix amount, but I don't see that calculation
//     // in the old code...
//     // We should also assume bcw and oli preshapes cannot be recycled back into
//     // the baguette is not generally reusable. Should we track this extra as a 
//     // separate total? The 'proper' way would be to have dough entities for bcw
//     // and oli, separate from 'Baguette'.
//     const doughExtra = sumBy(
//       B0prepSummary.filter(item => 
//         !['Olive Herb', 'Blue Cheese Walnut'].includes(item.forBake)
//       ),
//       item => item.surplusQty * item.weight * item.packSize
//     )

//     // ***** Calculate dough needed for B1 *****
//     // This is the 'main' dough requirement for today's mix.
//     //
//     // May also want to count by forBake group before getting
//     // the total across all baguette dough products.

//     const B1byForBake = Object.values(
//       groupBy(B1baguetteOrders, order => order.product.forBake)
//       )
//     const B1bakeTotals = B1byForBake.map(forBakeGroup => {
//       const totalQty = sumBy(forBakeGroup, order => order.qty * order.product.packSize)
//       const totalWeight = Number((totalQty * forBakeGroup[0].product.weight).toFixed(2))
      
//       return ({
//         forBake: forBakeGroup[0].product.forBake,
//         totalQty,
//         totalWeight
//       })
//     })

//     const B1doughNeeded = sumBy(B1bakeTotals, item => item.totalWeight)
//     const bufferWeight = doughsByDoughName["Baguette"]?.buffer || 0

//     const doughSummary = {
//       dough: doughsByDoughName["Baguette"],
//       B1neededWeight: round(B1doughNeeded, 1),
//       B0shortWeight: round(doughShort, 1),
//       B0scrapWeight: round(doughExtra, 1),
//       stickerTotal: round(B1doughNeeded + bufferWeight + doughShort, 1), // may want to calculate on the fly with a buffer state variable so that total can be updated without DB update
//     }

//     const mixes = getMixes(doughSummary, dateDT)
//     const bins = getBins(B1bakeTotals)
//     const pans = getPans(B1bakeTotals)
//     const buckets = [
//       { 
//         label: "Bucket Sets", 
//         amount: round(B2baguetteTotalWeight / 82) 
//       },
//       { 
//         label: "Water Buckets", 
//         amount: Math.ceil(B2baguetteTotalWeight / 82 / 2) 
//       }
//     ]
    

//     // doughs: doughs,
//     // doughComponents: doughComponents,
//     // pockets: pockets,
//     // Baker1Dough: Baker1Dough,
//     // Baker1DoughComponents: doughComponents,
//     // Baker1Pockets: Baker1Pockets,,
//     // bagDoughTwoDays: bagDoughTwoDays,

//     return {
//       ...doughSummary,
//       B1bakeTotals,
//       mixes,
//       bins,
//       pans,
//       buckets,
//     }

//   } // end composeDoughSummary

//   return useMemo(
//     composeDoughSummary, 
//     [T0prod, T1prod, T2prod, T3prod, doughs, products, dateDT]
//   )

// }


// // ******************************
// // * CALCULATE MIXES BY FORMULA *
// // ******************************

// // Kind of an overly-elaborate setup, but the intent is to make the setup
// // visual and easy to reconfigure if needed. The goal here is to make each
// // day's dough as consistent across mixes as possible. This means having the
// // same proportions of fresh dough, preferments, and old dough. The mix parts
// // table below tells us how to split up available bucketSets (which contain
// // preferments) so that we can scale each mix consistently to these sets.
// /**
//  * Returns relative size of each mix. Not normalized.
//  * 
//  * row# = nMixes - 1, col# = nBucketSets - 1
//  */
// const mixPartsTable = [
//   [[1, 0, 0], [1, 0, 0] ,[1, 0, 0], [1, 0, 0], [1, 0, 0]],
//   [[1, 1, 0], [1, 1, 0], [2, 1, 0], [1, 1, 0], [1, 1, 0]],
//   [[1, 1, 1], [1, 1, 1], [1, 1, 1], [2, 1, 1], [2, 2, 1]]
// ]

// /** 
//  * Requires 1 <= nMixes and 1 <= nBucketSets. 
//  * Should we also require nBucketSets >= nMixes?
//  * Can't have a mix without preferments...
//  * 
//  * In less cryptic terms, we want to split the total dough
//  * into mixes of equal size in all but a handful of special cases:
//  * 
//  * - 2 mixes, 3 bucket sets -- mix 1 is 2x size of mix 2
//  * - 3 mixes, 4 bucket sets -- mix 2 is 2x size of mixes 2 and 3
//  * - 3 mixes, 5 bucket sets -- mix 1 and 2 are 2x size of mix 3.
//  * 
//  * Returns PARTS, not percentages. divide by total number of parts
//  * to get percentage.
//  */
//   const getMixParts = (nMixes, nBucketSets) => {
//     if (nMixes < 1 || nBucketSets < 1) {
//       console.log(`InputError: nMixes=${nMixes}, nBucketSets=${nBucketSets}`)
//     }
  
//     let mixParts = nBucketSets <= 5 
//       ? mixPartsTable[Math.min(nMixes, 3) - 1][nBucketSets - 1]
//       : [null, null, null].map((item, idx) => nMixes > idx ? 0 : 1)
  
//     return mixParts
//   }

// // copied hard-coded values from old system. 
// // Can switch to DB values in the future.
// const ingProportions = {
//   BF: 0.5730,
//   WW: 0.038,
//   water: 0.374,
//   salt: 0.013,
//   yeast: 0.002,
// }

// const getMixes = (doughSummary, dateDT) => {
//   const { 
//     dough: { oldDough, buffer, bucketSets, preBucketSets }, 
//     B0shortWeight, B1neededWeight
//   } = doughSummary
  
//   const totalNeeded = B1neededWeight + buffer + B0shortWeight
//   const oldDoughToUse = Math.min(oldDough, totalNeeded * 0.2)
//   const stickerTotal = totalNeeded - oldDoughToUse
//   const nMixes = Math.ceil(stickerTotal / 210)
  
//   // FUTURE chage  REPORT_DATE.toMillis() to the input date
//   // use 'preBucketSets' if the report date is for T+1
//   const TODAY = DateTime.now().setZone('America/Los_Angeles').startOf('day')
//   const nBucketSets = dateDT.toMillis() === TODAY.plus({ days: 1 }).toMillis()
//     ? preBucketSets
//     : bucketSets

//   // Here we generate arrays of length 3 whose values 
//   // apply to mix #1, mix #2, & mix #3.
//   const mixParts = getMixParts(nMixes, nBucketSets) // returns length 3 array
//   console.log("mixParts", mixParts)
//   const totalParts = sum(mixParts)
  
//   const mixSummary = mixParts.map((nParts, idx) => {
//     const mixNumber = idx + 1
//     const proportion = nParts/totalParts
    
//     const nSets = round(proportion * nBucketSets)

//     const freshDoughWeight = stickerTotal * proportion
    
//     // 1 bucket set = 19.22 lb BF
//     const dryBfWeight = round(
//       (freshDoughWeight * ingProportions.BF) - (nSets * 19.22), 2
//     )       
//     const bf50 = Math.floor(dryBfWeight / 50)
//     const bfExtra = round(dryBfWeight % 50, 2)

//     const wwWeight = round(freshDoughWeight * ingProportions.WW, 2)

//     // 1 bucket set = 19.22 lb water
//     const pureWaterWeight = round(
//       freshDoughWeight * ingProportions.water - (nSets * 19.22), 2
//     ) 
//     const water25 = Math.floor(pureWaterWeight / 25)
//     const waterExtra = round(pureWaterWeight % 25, 2)

//     const saltWeight = round(freshDoughWeight * ingProportions.salt, 2)
//     const yeastWeight = round(freshDoughWeight * ingProportions.yeast, 2)

//     return ({
//       mixNumber,
//       nParts,
//       components: [
//         { label: "Bucket Sets", amount: nSets },
//         { label: "Old Dough", amount: round(oldDoughToUse * proportion, 2) },
//         { label: "50 lb. Bread Flour", amount: bf50 },
//         { label: "25 lb. Bucket Water", amount: water25 },
//         { label: "Bread Flour", amount: bfExtra },
//         { label: "Whole Wheat Flour", amount: wwWeight },
//         { label: "Water", amount: waterExtra },
//         { label: "Salt", amount: saltWeight },
//         { label: "Yeast", amount: yeastWeight },
//       ]
//     }) //end mixSummary
    
//   })
  
//   return mixSummary.filter(M => M.nParts > 0)

// }


// const getBins = (B1bakeTotals) => {
//   //console.log("B1bakeTotals", B1bakeTotals)
//   const oliveQty = B1bakeTotals
//     .find(T => T.forBake === "Olive Herb").totalQty
//   const bcwalQty = B1bakeTotals
//     .find(T => T.forBake === "Blue Cheese Walnut").totalQty

//   const baguetteQty = B1bakeTotals
//     .find(T => T.forBake === "Baguette").totalQty
//   const epiQty = B1bakeTotals
//     .find(T => T.forBake === "Epi").totalQty

//   return ([
//     { 
//       label:"Baguette (27.7)", 
//       amount: Math.ceil((baguetteQty + epiQty) / 24) + " bins" },
//     { 
//       label:"Olive",
//       amount: round(oliveQty * 1.4, 2) + " lb."
//     },
//     { 
//       label:"-- Green Olives", 
//       amount: "-- " + round(oliveQty * .08, 2) + " lb." 
//     },
//     { 
//       label:"-- Black Olives", 
//       amount: "-- " + round(oliveQty * .08, 2) + " lb."  
//     },
//     { 
//       label:"BC Walnut", 
//       amount: bcwalQty * 1.4 + " lb." 
//     }, 
//     { 
//       label:"-- Bleu Cheese", 
//       amount: "-- " + round(bcwalQty * .08, 2) + " lb." },
//     { 
//       label:"-- Toasted Walnuts", 
//       amount: "-- " + round(bcwalQty * .08, 2) + " lb." 
//     },
//   ])

// }

// const getPans = (B1bakeTotals) => {
//   const baguetteQty = B1bakeTotals
//     .find(T => T.forBake === "Baguette").totalQty
//   const epiQty = B1bakeTotals
//     .find(T => T.forBake === "Epi").totalQty

//   return [
//     { 
//       label: "Full (16 per pan)", 
//       amount: Math.floor((baguetteQty + epiQty) / 16) 
//     },
//     { 
//       label: "Extra", 
//       amount: (baguetteQty + epiQty) % 16
//     },
//   ]
// }