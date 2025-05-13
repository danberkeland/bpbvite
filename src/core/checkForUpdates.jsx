
import { 
  SqOrderResponseItem,
  sqOrderToCreateOrderInputV2, 
  useSquareOrders 
} from "../data/square/fetchSquareOrders";

import { useOrders } from "../data/order/useOrders";
import { useProducts } from "../data/product/useProducts";
import { useRef } from "react";
import { useDoughs } from "../data/dough/useDoughs";
import { DT } from "../utils/dateTimeFns";
import { CombinedRoutedOrder, useCombinedRoutedOrdersByDate } from "../data/production/useProductionData";
import { 
  groupByArrayRdc, 
  sumBy 
} from "../utils/collectionFns";
import { ListDataCache } from "../data/_listData";
import { DBDoughBackup, DBOrder, DBProduct } from "../data/types.d";


/**For croissant orders, maps back to the shaped type consumed at setout*/
const shapeTypeByProdNick = {
  pl: 'pl', frpl: 'pl', al: 'pl', fral: 'pl',
  ch: 'ch', frch: 'ch',
  pg: 'pg', frpg: 'pg',
  sf: 'sf', frsf: 'sf',
  mb: 'mb', frmb: 'mb', unmb: 'mb',
  mini: 'mini', frmini: 'mini',
}

/**
 * 
 * @param {boolean} shouldCheck 
 * @returns {boolean} Indicates if all checks have been completed
 */
export const useCheckForUpdates = (shouldCheck=true) => {
  const tomorrowDT = DT.today().plus({ days: 1 })
  const tomorrow = tomorrowDT.toFormat('yyyy-MM-dd')
  
  const productCache = useProducts({ shouldFetch: shouldCheck })
  const doughCache   = useDoughs({ shouldFetch: shouldCheck })
  const orderCache   = useOrders({ shouldFetch: shouldCheck })

  const { data:squareOrders } = useSquareOrders({ shouldFetch: shouldCheck })
  const { data:T0Orders } = useCombinedRoutedOrdersByDate({ delivDT: tomorrowDT, useHolding: false, shouldFetch: shouldCheck })
  const { data:T1Orders } = useCombinedRoutedOrdersByDate({ delivDT: tomorrowDT, useHolding: true,  shouldFetch: shouldCheck })

  // useEffect-like hooks; these functions do not fetch data. Fns return a boolean to indicate if check has been completed
  const completedCheckBucket   = useCheckBucket(doughCache, tomorrow, shouldCheck)
  const completedCheckCroix    = useCheckCroix(productCache, T0Orders, T1Orders, tomorrow, shouldCheck)
  const completedCheckPreshape = useCheckPreshape(productCache, tomorrow, shouldCheck && completedCheckCroix)
  const completedCheckSquare   = useSyncSquareOrders(productCache.data, squareOrders, orderCache, shouldCheck)

  console.log('squareOrders', squareOrders)

  return 1 
    && completedCheckBucket 
    && completedCheckCroix 
    && completedCheckPreshape 
    && completedCheckSquare
  
}

// defining handlers here so that the check fns don't need to be async.
const handleUpdate = async (updateInputs, submitMutations, updateLocalData) =>
  updateLocalData(await submitMutations({ updateInputs }))

const handleCreate = async (createInputs, submitMutations, updateLocalData) =>
  updateLocalData(await submitMutations({ createInputs }))

/**
 * @param {ListDataCache<DBProduct>} productCache 
 * @param {CombinedRoutedOrder[] | undefined} T0Orders 
 * @param {CombinedRoutedOrder[] | undefined} T1Orders 
 * @param {string} tomorrow 
 * @param {boolean} shouldCheck 
 */
function useCheckCroix(productCache, T0Orders, T1Orders, tomorrow, shouldCheck) {

  const checkCompleted = useRef(false)
  const { data:PRD, submitMutations, updateLocalData } = productCache

  if (shouldCheck && !checkCompleted.current && !!PRD && !!T0Orders && !!T1Orders) {
    console.log("start croix check")
    /**
     * @param {CombinedRoutedOrder[]} orderSet 
     * @param {string} packGroup 
     */
    const getTotals = (orderSet, packGroup) => orderSet
      .filter(order => {
        const product = PRD.find(P => P.prodNick === order.prodNick)
        return 1
          && product?.packGroup === packGroup
          && product.doughNick === 'Croissant'
          && order.meta.route?.RouteDepart === 'Carlton'
      })
      .reduce(groupByArrayRdc(order => shapeTypeByProdNick[order.prodNick]), [])
      .map(orderGroup => ({
        shapeType: shapeTypeByProdNick[orderGroup[0].prodNick],
        qty: sumBy(orderGroup, order => order.qty),
      }))

    const frozenTotals = getTotals(T0Orders, 'frozen pastries')
    const setoutTotals = getTotals(T1Orders, 'baked pastries')

    // Selecting the right products by category is so finicky, we might rather
    // just test by ['ch', 'mb', 'mini', 'pg', 'pl', 'sf'].includes(P)
    const productsToUpdate = PRD.filter(P => 1
      && P.packGroup === "baked pastries" 
      && P.doughNick === "Croissant"
      && !['unmb'].includes(P.prodNick)
      && P.freezerNorthFlag !== tomorrow
    )

    const updateInputs = productsToUpdate.map(updateProduct => {
      const frozenQty = frozenTotals.find(item => item.shapeType === updateProduct.prodNick)?.qty ?? 0
      const setoutQty = setoutTotals.find(item => item.shapeType === updateProduct.prodNick)?.qty ?? 0

      const newNorthClosingQty = 0
        + updateProduct.freezerNorthClosing 
        + 12 * (Math.ceil((setoutQty + frozenQty - updateProduct.freezerNorthClosing) / 12))
        - (setoutQty + frozenQty) 

      return {
        prodNick:            updateProduct.prodNick,
        freezerCount:        updateProduct.freezerClosing,
        freezerNorth:        updateProduct.freezerNorthClosing,
        freezerNorthClosing: newNorthClosingQty,
        freezerNorthFlag:    tomorrow,
        sheetMake: 0,
      } 
    })
    console.log(updateInputs)
  
    handleUpdate(updateInputs, submitMutations, updateLocalData)
    // updateLocalData(await submitMutations({ updateInputs }))
    console.log("croix check completed")
    checkCompleted.current = true

  }

  return checkCompleted.current

}


/**
 * @param {ListDataCache<DBProduct>} productCache 
 * @param {string} tomorrow 
 * @param {boolean} shouldCheck 
 */
function useCheckPreshape(productCache, tomorrow, shouldCheck) {

  const checkCompleted = useRef(false)
  const { data:products, submitMutations, updateLocalData } = productCache

  if (shouldCheck && !checkCompleted.current && !!products) {
    console.log("start preshape check")

    const updateInputs = products
      .filter(P => P.updatePreDate !== tomorrow)
      .map(P => ({
        prodNick:      P.prodNick,
        preshaped:     P.prepreshaped,
        prepreshaped:  P.prepreshaped,
        updatePreDate: tomorrow,
      }))

    handleUpdate(updateInputs, submitMutations, updateLocalData)
    // updateLocalData(await submitMutations({ updateInputs }))
    console.log("preshape check completed")
    checkCompleted.current = true

  }

  return checkCompleted.current

}


/**
 * @param {ListDataCache<DBDoughBackup>} doughCache 
 * @param {string} tomorrow 
 * @param {boolean} shouldCheck 
 */
function useCheckBucket(doughCache, tomorrow, shouldCheck) {

  const checkCompleted = useRef(false)
  const { data:doughs, submitMutations, updateLocalData } = doughCache

  if (shouldCheck && !checkCompleted.current && !!doughs) {
    console.log("start bucket check")

    const updateInputs = doughs
      .filter(D => D.updatePreBucket !== tomorrow)
      .map(D => ({
        id:              D.id,
        bucketSets:      D.preBucketSets,
        preBucketSets:   D.preBucketSets,
        updatePreBucket: tomorrow
      }))

    handleUpdate(updateInputs, submitMutations, updateLocalData)
    // updateLocalData(await submitMutations({ updateInputs }))
    console.log("bucket check completed")
    checkCompleted.current = true

  }

  return checkCompleted.current

}


/**
 * @param {DBProduct[] | undefined} products 
 * @param {SqOrderResponseItem[] | undefined} squareOrders 
 * @param {ListDataCache<DBOrder>} orderCache 
 * @param {boolean} shouldCheck 
 */
function useSyncSquareOrders(products, squareOrders, orderCache, shouldCheck) {

  const checkCompleted = useRef(false)
  const { data:orders, submitMutations, updateLocalData } = orderCache

  if (shouldCheck && !checkCompleted.current && !!orders && !!products && !!squareOrders ) { 
    console.log("start square check")
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
    console.log('createInputs', createInputs)
    handleCreate(createInputs, submitMutations, updateLocalData)
    // updateLocalData(await submitMutations({ createInputs }))
    console.log("square check completed")
    checkCompleted.current = true

  }

  return checkCompleted.current
  
}