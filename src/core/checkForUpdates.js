import { API, graphqlOperation } from "aws-amplify";

import { createOrder } from "../graphqlCustom/mutations/mutations"
import { updateProduct, updateDoughBackup } from "../graphql/mutations";

import ComposeNorthList from "../Pages/Logistics/utils/composeNorthList";

import { todayPlus } from "../utils/_deprecated/todayPlus";
import { SqOrderResponseItem, fetchSquareOrders, sqOrderToCreateOrderInput, sqOrderToCreateOrderInputV2, sqOrderToLegacyOrder, useSquareOrders } from "../data/square/fetchSquareOrders";
import { CreateOrderInput } from "../data/order/types.d";
import { LegacyDatabase } from "../data/legacyData";
import { ListDataCache } from "../data/_listData";
import { useOrders } from "../data/order/useOrders";
import { useProducts } from "../data/product/useProducts";
import { useEffect, useRef, useState } from "react";
import { useDoughs } from "../data/dough/useDoughs";
import { DT } from "../utils/dateTimeFns";

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
        frozenDelivsArray.find(item => item.prod === prod.nickName)?.qty ?? 0
      

      const setoutQty = 
        setoutArray.find(item => item.prod === prod.nickName)?.qty ?? 0

      console.log(prod.nickName)
      console.log("frozenQty", frozenQty)
      console.log("setoutQty", setoutQty)
  
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
    if (dough.updatePreBucket !== tomorrow) {
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
   * @returns {boolean}
   */
  const hasMatchInDb = squareOrder => {
    const squareOrderProdName = 
      products.find(P => P.nickName === squareOrder.prodNick)?.prodName

    return retailOrders.some(dbOrder => 1
      && squareOrder.locNick === dbOrder.custName // << this is a special case where the 'nick and 'name are equal; see sqOrderToCreateOrderInput
      && dbOrder.prodName === squareOrderProdName
    )
  }
  console.log("retailOrders", retailOrders)
  
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


export const useCheckForUpdates = () => {

  usePreshapeFlip()
  useBucketFlip()
  useSyncSquareOrders()

}


function usePreshapeFlip() {

  const checkCompleted = useRef(false)
  const tomorrow = DT.today().plus({ days: 1 }).toFormat('yyyy-MM-dd')
  const { 
    data:products, 
    submitMutations, 
    updateLocalData 
  } = useProducts({ shouldFetch: true })

  useEffect(() => {
    if (!products || checkCompleted.current) return

    const updateInputs = products
      .filter(D => D.updatePreDate !== tomorrow)
      .map(P => ({
        prodNick:      P.prodNick,
        preshaped:     P.prepreshaped,
        prepreshaped:  P.prepreshaped,
        updatePreDate: tomorrow,
      }))

    const handleMutate = async (updateInputs) =>
      updateLocalData(await submitMutations({ updateInputs }))

    handleMutate(updateInputs)
    checkCompleted.current = true
    console.log("preshape check completed")

  }, [products, submitMutations, updateLocalData, checkCompleted.current])

}

function useBucketFlip() {

  const checkCompleted = useRef(false)
  const tomorrow = DT.today().plus({ days: 1 }).toFormat('yyyy-MM-dd')
  const { 
    data:doughs, 
    submitMutations, 
    updateLocalData 
  } = useDoughs({ shouldFetch: true })

  useEffect(() => {
    if (!doughs || checkCompleted.current) return

    const updateInputs = doughs
      .filter(D => D.updatePreBucket !== tomorrow)
      .map(D => ({
        id:              D.id,
        bucketSets:      D.preBucketSets,
        preBucketSets:   D.preBucketSets,
        updatePreBucket: tomorrow
      }))

    const handleMutate = async (updateInputs) =>
      updateLocalData(await submitMutations({ updateInputs }))

    handleMutate(updateInputs)
    checkCompleted.current = true
    console.log("dough check completed")

  }, [doughs, submitMutations, updateLocalData, checkCompleted.current])

}

function useSyncSquareOrders() {

  const checkCompleted = useRef(false)

  const { 
    data:orders, 
    submitMutations, 
    updateLocalData 
  } = useOrders({ shouldFetch: true })

  const { data:products } = useProducts({ shouldFetch: true })
  const { data:squareOrders } = 
    useSquareOrders({ shouldFetch: !checkCompleted.current })


  useEffect(() => {
    if (!orders || !products || !squareOrders || checkCompleted.current) return 

    console.log("square orders", squareOrders)

    const retailOrders = orders.filter(order => order.isWhole === false)
    const newRetailOrders = squareOrders.map(squareOrder =>
      sqOrderToCreateOrderInputV2(squareOrder, products)
    )

    const createInputs = newRetailOrders.filter(newOrder => 
      !retailOrders.some(retailOrder => 1
        && retailOrder.locNick   === newOrder.locNick  // locNick will have transaction ID embedded, so no need to match on delivDate, route
        && retailOrder.prodNick  === newOrder.prodNick
      )  
    )

    const handleMutate = async createInputs => updateLocalData(
      await submitMutations({ createInputs })
    )

    checkCompleted.current = true
    handleMutate(createInputs)
    console.log("square check completed")

  }, [orders, products, squareOrders, submitMutations, updateLocalData])
  


}