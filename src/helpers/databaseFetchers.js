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