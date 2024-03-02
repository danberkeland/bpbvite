import { API, graphqlOperation } from "aws-amplify";

import { createOrder } from "../graphqlCustom/mutations/mutations"
import { updateProduct, updateDoughBackup } from "../graphql/mutations";

import ComposeNorthList from "../Pages/Logistics/utils/composeNorthList";

import { todayPlus } from "../utils/_deprecated/todayPlus";
import { fetchSquareOrders, sqOrderToCreateOrderInput, sqOrderToLegacyOrder } from "../data/square/fetchSquareOrders";
import { CreateOrderInput } from "../data/order/types.d";
import { LegacyDatabase } from "../data/legacyData";

/**
 * 
 * @param {LegacyDatabase} db 
 * @param {boolean} ordersHasBeenChanged 
 * @param {function} setOrdersHasBeenChanged 
 * @param {string} delivDate 
 * @param {function} setIsLoading 
 * @returns 
 */
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

      // mutate productsToUpdate item to reflect expected DB changes
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

      // mutate doughsToUpdate item to reflect expected DB changes
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

  const retailOrders = orders.filter(order => order.isWhole === false)
  const squareOrders = await fetchSquareOrders()
  console.log("SQ ORDERS:", squareOrders)

  /**
   * The square order has been reformatted to align with type DBORrder
   * 
   * Lots of jank going on here. The square order is formatted for submitting
   * to the new system DB, in the new format. The retails orders come from
   * data fetched from the new system, but formatted back to the legacy format
   * to work with all the old data functions.
   * 
   * This will clean up a lot if we can move away from using the legacy database.
   * @param {CreateOrderInput} squareOrder 
   * @returns 
   */
  const hasMatchInDb = squareOrder => {
    const sqProdName = 
      products.find(P => P.nickName = squareOrder.prodNick)?.prodName ?? "Brownie"

    return retailOrders.some(dbOrder => 1
      && squareOrder.locNick === dbOrder.custName // << this is a special case where the 'nick and 'name are equal; see sqOrderToCreateOrderInput
      && (0
        || dbOrder.prodName === sqProdName
        || squareOrder.prodNick === "brn" && dbOrder.prodName === "Brownie"
      )
    )

  }
  
  let ordersToUpdate = structuredClone(orders)
  let squarePromises = []

  for (let sqOrder of squareOrders) {

    const sqCreateInput = sqOrderToCreateOrderInput(sqOrder, products)

    if (!hasMatchInDb(sqCreateInput)) {
      squarePromises.push(
        API.graphql(graphqlOperation(createOrder, { input: sqCreateInput } ))
      )

      ordersToUpdate.push(sqOrderToLegacyOrder(sqOrder, products))
    }


  }

  // const squareInputs = squareOrders
  //   .map(sqOrder => sqOrderToCreateOrderInput(sqOrder, products))
  //   .filter(reformattedOrder => !hasMatchInDb(reformattedOrder))

  // for (let input of squareInputs) {
  //   squarePromises.push(
  //     API.graphql(graphqlOperation(createOrder, { input } ))
  //   )

  //   // mutate ordersToUpdate to reflect expected DB changes
  //   ordersToUpdate.push(input)

  // }

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