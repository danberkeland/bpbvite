import { API, graphqlOperation } from "aws-amplify";

import { createOrder } from "../customGraphQL/mutations"
import { updateProduct, updateDoughBackup } from "../graphql/mutations";

import ComposeNorthList from "../Pages/Logistics/utils/composeNorthList";

import { todayPlus } from "../helpers/dateTimeHelpers";
import { getTtl } from "../functions/dateAndTime";
// import { groupBy, keyBy, filter, flow, mapValues, sumBy, uniqBy, sortBy, map, identity } from "lodash/fp";

const LOC_ID_BPBN = "16VS30T9E7CM9"
const SQ_URL = "https://8eo1jrov6a.execute-api.us-east-2.amazonaws.com/done"

export const checkForUpdates = async (
  db,
  ordersHasBeenChanged,
  setOrdersHasBeenChanged,
  delivDate,
  setIsLoading
) => {
  setIsLoading(true);

  let tomorrow = todayPlus()[1];
  let today = todayPlus()[0];

  // const [products, customers, routes, standing, orders, doughs, altPricing] = db;
  const products = db[0]
  const orders = db[4]
  const doughs = db[5]



  // ********************
  // * NORTH CROISSANTS *
  // ********************

  const compose = new ComposeNorthList()
  
  let setoutArray = compose.getBakedTomorrowAtCarlton(today, db);               // deprecated; need to replace method
  let frozenDelivsArray = compose.getFrozensLeavingCarlton(today, db);          // deprecated; need to replace method

  // Test if product is the one that should hold inventory info.
  // This rule is so brittle we might as well explicitly list the items.
  const isInventoryCroixProduct = product => 1
    && product.packGroup === "baked pastries" 
    && product.doughType === "Croissant"
    && product.nickName  !== "unmb"
    && product.nickName  !== "al"

  let productsToUpdate = structuredClone(products)
  let croixPromises = []

  for (let prod of productsToUpdate) {
    if (1
      && isInventoryCroixProduct(prod) 
      && prod.freezerNorthFlag !== tomorrow
    ) {

      const frozenQty = 
        frozenDelivsArray.find(item => item.prod === prod.prodNick)?.qty ?? 0

      const setoutQty = 
        setoutArray.find(item => item.prod === prod.prodNick)?.qty ?? 0
  
      const newNorthClosingQty = 0
        + prod.freezerNorthClosing 
        + 12 * (Math.ceil(
          (setoutQty + frozenQty - prod.freezerNorthClosing) / 12
        ))
        - (setoutQty + frozenQty) 
  
  
      croixPromises.push(API.graphql(graphqlOperation(updateProduct, { 
        input: {
          prodNick:            prod.nickName,
          freezerCount:        prod.freezerClosing,
          freezerNorth:        prod.freezerNorthClosing,
          freezerNorthClosing: newNorthClosingQty,
          freezerNorthFlag:    tomorrow,
          sheetMake: 0,
        } 
      })))

      // mutate productsToUpdate item
      prod.freezerNorthFlag    = tomorrow
      prod.freezerNorth        = prod.freezerNorthClosing
      prod.freezerNorthClosing = newNorthClosingQty

    }

  }
  
  if (croixPromises.length) {
    await Promise.all(croixPromises).then(results => {
      console.log("freezer north update results:", results)
      if (results.some(res => !!res.errors)) {
        console.log(
          "error on creating croix Orders:", 
          results.filter(r => !!r.errors)
        )
      }
    }).catch(error => 
      console.error("error on creating Orders", error)
    )
  }


  // ***** Preshapes/Pockets *****

  let otherProductPromises = []

  for (let product of productsToUpdate) {
    if (product.updatePreDate !== tomorrow) {

      otherProductPromises.push(API.graphql(graphqlOperation(updateProduct, { 
        input: { 
          prodNick:      product.nickName,
          preshaped:     product.prepreshaped,
          prepreshaped:  product.prepreshaped,
          updatePreDate: tomorrow,
        }
      
      })))

      // mutate productsToUpdate item
      product.updatePreDate = tomorrow
      product.preshaped     = product.prepreshaped

    }
  } 

  if (otherProductPromises.length) {
    await Promise.all(otherProductPromises).then(results => {
      console.log("other preshape update results:", results)
      if (results.some(r => !!r.errors)) {
        console.log(
          "error on updating preshapes:", 
          results.filter(r => !!r.errors)
        )
      } else {console.log("preshape update good")}
    }).catch(error => 
      console.error("error on creating Orders", error)
    )
  }


  // ***** dough bucket sets *****

  let doughsToUpdate = structuredClone(doughs)
  let doughPromises  = []

  for (let dough of doughsToUpdate) {
    if (dough.updatePreBucket!== tomorrow) {
      doughPromises.push(
        API.graphql(graphqlOperation(updateDoughBackup, { 
          input: {
            id:              dough.id,
            bucketSets:      dough.preBucketSets,
            preBucketSets:   dough.preBucketSets,
            updatePreBucket: tomorrow,
          }
        }))
      )

      // mutate doughsToUpdate item
      dough.updatePreBucket = tomorrow
      dough.bucketSets      = dough.preBucketSets

    }
  }

  if (doughPromises.length) {
    await Promise.all(doughPromises).then(results => {
      console.log("dough bucketSets update results:", results)
      if (results.some(res => !!res.errors)) {
        console.log(
          "error on creating Orders:", 
          results.filter(r => !!r.errors)
        )
      }
    }).catch(error => 
      console.error("error on dough update", error)
    )
  }

  // ***** Square/retail orders *****

  const squareOrders = await fetch(SQ_URL).then(response => {
    console.log("fetch sq:", response.status + (response.ok ? " ok" : ''))
    return response.json()

  }).then(json => {
    if (json?.errorMessage) {
      console.warn(
        "The ol' response 200 error:", 
        json
      )
      return []
    } else return JSON.parse(json) // Yo dawg, I heard you like JSON

  }).catch(error => 
    console.error("Unhandled Error:", error)
  )
  
  const sqOrderToDbOrder = (sqOrder, products) => {
    const product = products.find(P => sqOrder.item.includes(P.squareID))
    const delivDate = sqOrder.delivDate.split("T")[0]

    return {
      qty:       Number(sqOrder.qty),
      delivDate,
      locNick:   sqOrder.custName + "__" + sqOrder.id,
      route:     sqOrder.location === LOC_ID_BPBN ? "atownpick" : "slopick",
      isWhole:   false,
      ItemNote:  "paid",
      prodNick:  product?.prodNick ?? "brn",
      ttl:       delivDate ? getTtl(new Date(sqOrder.delivDate)) : null,
      updatedOn: new Date().toISOString(),
      updatedBy: "bpb_admin",
    }

  }

  const retailOrders = orders.filter(order => order.isWhole === false)
  const noMatchInDb = squareOrder => 
    !retailOrders.some(dbOrder => 1
      && squareOrder.locNick.includes(dbOrder.custName)
      && (0
        || dbOrder.prodName === squareOrder.prodName 
        || dbOrder.prodName === "Brownie"
      )
  )

  const squareInputs = squareOrders
    .map(sqOrder => sqOrderToDbOrder(sqOrder, products))
    .filter(reformattedOrder => noMatchInDb(reformattedOrder))
  
  let ordersToUpdate = structuredClone(orders)
  let squarePromises = []

  for (let input of squareInputs) {
    squarePromises.push(
      API.graphql(graphqlOperation(createOrder, { input } ))
    )

    // mutate ordersToUpdate
    ordersToUpdate.push(input)

  }

  if (squarePromises.length) {
    await Promise.all(squarePromises).then(results => {
      console.log("sq order create results:", results)
      if (results.some(r => !!r.errors)) {
        console.log(
          "error on creating Orders:", 
          results.filter(r => !!r.errors)
        )
      } 
    }).catch(error => 
      console.error("error on creating Orders", error)
    )
  }
  
  let DBToMod = structuredClone(db)
  DBToMod[4] = ordersToUpdate
  DBToMod[5] = doughsToUpdate
  DBToMod[0] = productsToUpdate
  
  setIsLoading(false)
  return DBToMod

}





// /** Copy prepreshaped values to preshaped once a day */
// export const preshapedFlip = async ({ productCache, todayDT }) => {

//   const { data:PRD, submitMutations, updateLocalData } = productCache

//   if (!PRD) {
//     console.error("Cannot execute preshaped flip: Data not loaded.")
//     return
//   }

//   const tomorrowISO = todayDT.plus({ days: 1 }).toFormat('yyyy-MM-dd')

//   const updateInputs = PRD
//     .filter(P => P.updatePreDate !== tomorrowISO)
//     .map(P => ({
//       prodNick: P.prodNick,
//       preshaped: P.prepreshaped, // <<< move prepreshaped to preshaped
//       prepreshaped: P.prepreshaped,
//       updatePreDate: tomorrowISO,
//     }))

//   updateLocalData( await submitMutations({ updateInputs }) )

// }



// /** Copy preBucketSets values to bucketSets once a day */ 
// export const doughFlip = async ({ doughCache, todayDT }) => {

//   const { data:DGH, submitMutations, updateLocalData } = doughCache

//   if (!DGH) {
//     console.error("Cannot execute dough flip: Data not loaded.")
//     return
//   }

//   const tomorrowISO = todayDT.plus({ days: 1 }).toFormat('yyyy-MM-dd')

//   const updateInputs = DGH
//     .filter(D => D.updatePreBucket !== tomorrowISO)
//     .map(D => ({
//       id: D.id,
//       bucketSets: D.preBucketSets, // <<< move preBuckesSets to bucketSets
//       preBucketSets: D.preBucketSets,
//       updatePreBucket: tomorrowISO,
//     }))

//   updateLocalData( await submitMutations({ updateInputs }) )

// }



// /** uses product & order caches generated by useListData */
// export const syncSquareOrders = async ({ productCache, orderCache }) => {

//   const BPBN_LOC_ID = "16VS30T9E7CM9"

//   const { data:PRD } = productCache
//   const { 
//     data:ORD, 
//     submitMutations:submitOrders, 
//     updateLocalData:updateOrderCache 
//   } = orderCache

//   if (!PRD || !ORD) {
//     console.error("Cannot execute sync Square: data not loaded.")
//     return
//   }

//   const productsBySquareID = keyBy('squareID')(PRD)
//   const retailOrders = ORD.filter(order => order.isWhole === false)

//   console.log("Fetching Square Orders...")
//   const url = "https://8eo1jrov6a.execute-api.us-east-2.amazonaws.com/done"
//   const squareOrders = await fetch(url)
//     .then(response => response.json()) // .json() is an async method apparently
//     .then(data => JSON.parse(data))
//   console.log("Square orders:", squareOrders)

//   const createCandidates = squareOrders.map(order => {

//     const delivDate = order.delivDate.split('T')[0]
//     const squareID = order.item
//     const prodNick = productsBySquareID[squareID]?.prodNick ?? "brn"

//     return {
//       locNick: `${order.custName}__${order.id}`,
//       delivDate,
//       isWhole: false,
//       route: order.location === BPBN_LOC_ID ? "atownpick" : "slopick",
//       ItemNote: "paid",
//       prodNick,
//       qty: Number(order.qty),
//       updatedBy: "bpb_admin",
//       ttl: getTimeToLive(delivDate) ?? null,
//     }
//   })

//   const createInputs = createCandidates.filter(cItem => 
//     retailOrders.findIndex(order =>
//       order.locNick === cItem.locNick
//       && (order.prodNick === cItem.prodNick || order.prodNick === 'brn')
//     ) === -1
//   )

//   console.log("Submitting to Orders:", createInputs)
//   updateOrderCache( await submitOrders({ createInputs }))
  
// }



// const shapeNickMap = {
//   pl: 'pl', frpl: 'pl', al: 'pl', fral: 'pl',
//   ch: 'ch', frch: 'ch',
//   pg: 'pg', frpg: 'pg',
//   sf: 'sf', frsf: 'sf',
//   mb: 'mb', frmb: 'mb', unmb: 'mb',
//   mini: 'mini', frmni: 'mini',
// }

// export const croixCountFlip = ({ orderCache, productCache }) => {

//   const { data:ORD } = orderCache   // useT0T7prodOrders
//   const { data:PRD } = productCache // useListData with table "Product"

//   if (!PRD || !ORD) {
//     console.error("Cannot execute croix flip: data not loaded.")
//     return
//   }

//   const products = keyBy('prodNick')(PRD) 

//   console.log("ORD:", ORD)
  
//   const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
//   // const t0 = todayDT.toFormat('yyyy-MM-dd')
//   // const t1 = todayDT.plus({ days: 1 }).toFormat('yyyy-MM-dd')

//   const [t0, t1, t2, t3] = [0, 1, 2, 3].map(daysAhead => 
//     todayDT.plus({ days: daysAhead + 1 }).toFormat('yyyy-MM-dd')
//   )

//   const adjustBackporchQty = (order) => order.locNick === "backporch" 
//     ? { ...order, qty: Math.ceil(order.qty / 2)}
//     : order

//   const southBakedOrders = ORD
//     .filter(order => order.delivDate === t1
//       && products[order.prodNick].doughNick === "Croissant"
//       && products[order.prodNick].packGroup === "baked pastries"
//       && order.prodNick !== 'al'
//       && order.locNick !== 'bpbextras'
//       && (
//         order.routeMeta.route.RouteDepart === "Prado"
//         || order.locNick === "backporch"
//       )
//     )
//     .map(adjustBackporchQty)

//   const northBakedOrders = ORD
//     .filter(order => order.delivDate === t1
//       && products[order.prodNick].doughNick === "Croissant"
//       && products[order.prodNick].packGroup === "baked pastries"
//       && order.prodNick !== 'al'
//       && order.locNick !== 'bpbextras'
//       && (
//         order.routeMeta.route.RouteDepart === "Carlton"
//         || order.locNick === "backporch"
//       )
//     )
//     .map(adjustBackporchQty)

//   const southFrozenOrders = ORD
//     .filter(order => order.delivDate === t0
//       && products[order.prodNick].doughNick === "Croissant"
//       && products[order.prodNick].packGroup === "frozen pastries"
//       && order.prodNick !== 'fral'
//       && order.locNick !== 'bpbextras'
//       && order.isStand !== false
//       && order.routeMeta.route.RouteDepart === "Prado"
//     )

//   const northFrozenOrders = ORD
//     .filter(order => order.delivDate === t0
//       && products[order.prodNick].doughNick === "Croissant"
//       && products[order.prodNick].packGroup === "frozen pastries"
//       && order.prodNick !== 'fral'
//       && order.locNick !== 'bpbextras'
//       && order.isStand !== false
//       && order.routeMeta.route.RouteDepart === "Carlton"
//     )

//   const [
//     southBaked, 
//     northBaked, 
//     southFrozen, 
//     northFrozen
//   ] = [
//     southBakedOrders, 
//     northBakedOrders, 
//     southFrozenOrders, 
//     northFrozenOrders
//   ].map(orders => 
//     flow(
//       groupBy(order => shapeNickMap[order.prodNick]),
//       mapValues(group => ({
//         total: sumBy('qty')(group),
//         items: group
//       }))
//     )(orders)
//   )
//   console.log("southBaked", southBaked)
//   console.log("northBaked", northBaked)
//   console.log("southFrozen", southFrozen)
//   console.log("northFrozen", northFrozen)

//   // applies to south freezer count, but is derived from all fral orders
//   const southFralOrders = ORD.filter(order => 
//     order.delivDate === t2 
//     && order.prodNick === 'fral'
//     && order.locNick !== 'bpbextras'
//   )

//   const southAlOrders = ORD.filter(order => 
//     order.delivDate === t2 
//     && order.prodNick === 'al'
//     && order.locNick !== 'bpbextras'
//     && order.routeMeta.route.RouteDepart === 'Prado'
//   )

//   const northAlOrders = ORD.filter(order => 
//     order.delivDate === t3 
//     && order.prodNick === 'al'
//     && order.locNick !== 'bpbextras'
//     && order.routeMeta.route.RouteDepart === 'Carlton'
//   )

//   const [
//     southFral, 
//     southAl, 
//     northAl,
//   ] = [
//     southFralOrders,
//     southAlOrders,
//     northAlOrders,
//   ].map(orders => 
//     flow(
//       groupBy(order => shapeNickMap[order.prodNick]),
//       mapValues(group => ({
//         total: sumBy('qty')(group),
//         items: group
//       }))
//     )(orders)
//   )
//   console.log(southFral, southAl, northAl)

//   const isBakedCroix = (product) => 
//     product.packGroup === "baked pastries" 
//     && product.doughNick === "Croissant"

//   // shapeNicks are prodNicks that get mapped to prodNicks found in the
//   // following collection. Items with the same shapeNick start off as the same
//   // shape/frozen croissant type.
//   const croixCountProducts = flow(
//     filter(isBakedCroix),
//     map(P => shapeNickMap[P.prodNick]),
//     uniqBy(identity),
//     sortBy(identity),
//     map(shapeNick => products[shapeNick]),
//     keyBy('prodNick')
//   )(PRD)
//   console.log("croixCountProducts", croixCountProducts)
  
//   // today's opening count should be set to yesterday's closing count
//   const newFreezerNorthCounts = mapValues(P => 
//     P.freezerNorthClosing
//   )(croixCountProducts)

//   // predict the closing count by counting inflow vs outflow
//   const newFreezerNorthClosingCounts = mapValues(P => {
//     const frozen = northFrozen[P.prodNick]?.total ?? 0
//     const baked = northBaked[P.prodNick]?.total ?? 0
//     const stock = P.freezerNorthClosing
//     //const bakeExtra = P.bakeExtra ?? 0

//     const inflow =  Math.ceil(Math.max(frozen + baked - stock, 0) / 12) * 12
//     const outflow = frozen + baked

//     const newClosingCount = stock + inflow - outflow // + bakeExtra // not sure the bakeExtra is needed
//     return newClosingCount

//   })(croixCountProducts)

//   // today's opening count should be set to yesterday's closing count
//   const newFreezerCounts = mapValues(P => 
//     P.freezerClosing
//   )(croixCountProducts)

//   // predict the closing count by counting inflow vs outflow
//   // almond-type objects only have the pl attribute; count will be 0 for
//   // other products
//   const newFreezerClosingCounts = mapValues(P => {
//     const nFrozen = northFrozen[P.prodNick]?.total ?? 0
//     const nBaked = northBaked[P.prodNick]?.total ?? 0
//     const sendNorth = nFrozen + nBaked

//     const sFrozen = southFrozen[P.prodNick]?.total ?? 0
//     const sBaked = southBaked[P.prodNick]?.total ?? 0
//     const fral = southFral[P.prodNick]?.total ?? 0
//     const t2Al = southAl[P.prodNick]?.total ?? 0
//     const t3Al = northAl[P.prodNick]?.total ?? 0
//     const stock = P.freezerClosing

//     const outflow = sendNorth + sFrozen + sBaked + fral + t2Al + t3Al
//     const newClosingCount = stock - outflow
//     return newClosingCount

//   })(croixCountProducts) // TODO

//   console.log("newFreezerNorthCounts", newFreezerNorthCounts)
//   console.log("newFreezerNorthClosingCounts", newFreezerNorthClosingCounts)

//   console.log("newFreezerCounts", newFreezerCounts)
//   console.log("newFreezerClosingCounts", newFreezerClosingCounts)

//   const updateInputs = Object.values(croixCountProducts).map(P => {
//     return {
//       prodNick: P.prodNick,
//       freezerCount: newFreezerCounts[P.prodNick],
//       freezerClosing: newFreezerClosingCounts[P.prodNick],
//       freezerNorth: newFreezerNorthCounts[P.prodNick],
//       freezerNorthClosing: newFreezerNorthClosingCounts[P.prodNick],
//       sheetMake: 0,
//     }
//   })

//   console.log("updateInputs", updateInputs)
//   return updateInputs

// }