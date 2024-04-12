import { DateTime } from "luxon"
import { useProducts } from "../../data/product/useProducts"
import { CombinedRoutedOrder, useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData"
import { keyBy } from "lodash"
import { groupByObject, sumBy } from "../../utils/collectionFns"
import { useMemo } from "react"

const shapeTypes = ['ch', 'mb', 'mini', 'pg', 'pl', 'sf'] // these products hold sheetMake/freezer count info.

/**For croissant orders, maps back to the shaped type consumed at setout*/
const shapeTypeByProdNick = {
  pl: 'pl', frpl: 'pl', al: 'pl', fral: 'pl',
  ch: 'ch', frch: 'ch',
  pg: 'pg', frpg: 'pg',
  sf: 'sf', frsf: 'sf',
  mb: 'mb', frmb: 'mb', unmb: 'mb',
  mini: 'mini', frmini: 'mini',
}

// "Given a croissant order, how many days before do we need to pull an item from the prado freezer"?
// We can answer this question fully by classifying orders by...
// * Where the order departs from ('Prado' or 'Carlton')
// * If the croissant is frozen or baked ('Frozen' or 'Baked')
// * If the croissant is an almond type or some other type ('Almond' or 'Croix')
// For the actual aggregation, an order should also be grouped according to how its prodNick maps to shapeType.
const freezerPullOffsetByTimingKey = {
  PradoFrozenCroix:     0,
  CarltonFrozenCroix:   0,
  PradoBakedCroix:     -1,
  CarltonBakedCroix:   -1,
  PradoFrozenAlmond:   -2,
  PradoBakedAlmond:    -2,
  CarltonFrozenAlmond: -2,
  CarltonBakedAlmond:  -3,
}

/**
 * @param {Object}   input
 * @param {DateTime} input.reportDT
 * @param {boolean}  input.shouldFetch 
 */
export const useCroissantProduction = ({ reportDT, shouldFetch }) => {
  const dtMillis = reportDT.toMillis()
  const { data:R0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 0 }), useHolding: false, shouldFetch })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true,  shouldFetch })
  const { data:R2Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 2 }), useHolding: true,  shouldFetch })
  const { data:R3Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 3 }), useHolding: true,  shouldFetch })
  const { data:R4Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 4 }), useHolding: true,  shouldFetch })
  const { data:R5Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 5 }), useHolding: true,  shouldFetch })
  const { data:R6Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 6 }), useHolding: true,  shouldFetch })
  const { data:R7Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 7 }), useHolding: true,  shouldFetch })
  const { data:PRD, submitMutations, updateLocalData, isValidating } = useProducts({ shouldFetch })

  const products = useMemo(() => !!PRD ? keyBy(PRD, P => P.prodNick) : undefined, [PRD])

  const calculateCroixConsumption = () => {
    if (!R0Orders || !R1Orders || !R2Orders || !R3Orders || !R4Orders || !R5Orders || !R6Orders || !R7Orders || !products) {
      return { croixRows: undefined, almondRows: undefined }
    }

    const dt = DateTime.fromMillis(dtMillis).setZone('America/Los_Angeles')
    const reportDTs = [0, 1, 2, 3, 4, 5, 6, 7].map(days => dt.plus({ days }))
    const reportDates = reportDTs.map(dt => dt.toFormat('yyyy-MM-dd'))
    const orders = [
      ...R0Orders, 
      ...R1Orders, 
      ...R2Orders, 
      ...R3Orders, 
      ...R4Orders, 
      ...R5Orders, 
      ...R6Orders, 
      ...R7Orders,
    ].filter(order => 1
      && products[order.prodNick].doughNick === 'Croissant'
      && order.locNick !== 'bpbextras'  
    )

    /** @param {CombinedRoutedOrder} order */
    const getAggregationKey = order => {
      const { prodNick, delivDate } = order
      const shapeType = shapeTypeByProdNick[prodNick]

      const departLocation = order.meta.routePlan.steps[0].end.place
      const bakedOrFrozen = products[prodNick].packGroup === 'baked pastries' 
        ? 'Baked'
        : 'Frozen'
      const crxType = ['al', 'fral'].includes(prodNick) ? 'Almond' : 'Croix'
      const timingKey = `${departLocation}${bakedOrFrozen}${crxType}`

      const relativeDate = reportDates.findIndex(d => d === delivDate)
      const freezerPullOffset = freezerPullOffsetByTimingKey[timingKey]
      const freezerPullRelDate = relativeDate + freezerPullOffset

      return `${shapeType}${freezerPullRelDate}`
    }

    const ordersByKey = groupByObject(orders, getAggregationKey)

    const croixData = shapeTypes.map(shapeType => {
      const { freezerCount, sheetMake, batchSize } = products[shapeType]
      const itemsByRelDate = [0, 1, 2, 3, 4].map(relDate => (ordersByKey[`${shapeType}${relDate}`] ?? []))
      const sumByRelDate = itemsByRelDate.map(RNItems => -1 * sumBy(RNItems, order => order.qty))

      // const shapeCount = sheetMake * batchSize
      const cumByRelDate = [1, 2, 3, 4, 5].map(nDays => 0
        + freezerCount 
        // + shapeCount // to be calculated with state variables
        + sumBy(sumByRelDate.slice(0, nDays), x => x)
      )

      return {
        prodNick: shapeType,
        freezerCount,
        sheetMake,
        batchSize,
        R0Items: itemsByRelDate[0],
        R1Items: itemsByRelDate[1],
        R2Items: itemsByRelDate[2],
        R3Items: itemsByRelDate[3],
        R4Items: itemsByRelDate[4],
        R0Sum: sumByRelDate[0],
        R1Sum: sumByRelDate[1],
        R2Sum: sumByRelDate[2],
        R3Sum: sumByRelDate[3],
        R4Sum: sumByRelDate[4],
        R0Cum: cumByRelDate[0],
        R1Cum: cumByRelDate[1],
        R2Cum: cumByRelDate[2],
        R3Cum: cumByRelDate[3],
        R4Cum: cumByRelDate[4],
      }
    })

    const almondItemsByRelDate = [0, 1, 2, 3, 4].map(relDate => {
      const fralOrders = orders.filter(order => order.prodNick === 'fral' && order.delivDate === reportDates[relDate])
      const alOrders   = orders.filter(order => order.prodNick === 'al'   && order.delivDate === reportDates[relDate + 1])
      return [...fralOrders, ...alOrders]
    })
    const almondSumByRelDate = almondItemsByRelDate.map(RNItems => -1 * sumBy(RNItems, order => order.qty))
    const almondCumByRelDate = [1, 2, 3, 4, 5].map(nDays => 0
      + (products['al'].freezerCount ?? 0)
      // + shapeCount // to be calculated with state variables
      + sumBy(almondSumByRelDate.slice(0, nDays), x => x)
    )

    const almondData = [{
      prodNick: 'al',
      freezerCount: products['al'].freezerCount ?? 0,
      sheetMake:    products['al'].sheetMake ?? 0,
      batchSize:    products['al'].batchSize ?? 1,
      R0Items: almondItemsByRelDate[0],
      R1Items: almondItemsByRelDate[1],
      R2Items: almondItemsByRelDate[2],
      R3Items: almondItemsByRelDate[3],
      R4Items: almondItemsByRelDate[4],
      R0Sum: almondSumByRelDate[0],
      R1Sum: almondSumByRelDate[1],
      R2Sum: almondSumByRelDate[2],
      R3Sum: almondSumByRelDate[3],
      R4Sum: almondSumByRelDate[4],
      R0Cum: almondCumByRelDate[0],
      R1Cum: almondCumByRelDate[1],
      R2Cum: almondCumByRelDate[2],
      R3Cum: almondCumByRelDate[3],
      R4Cum: almondCumByRelDate[4],
    }]

    return {
      croixData,
      almondData,
    }
  }

  const { croixData, almondData } = useMemo(
    calculateCroixConsumption, 
    [R0Orders, R1Orders, R2Orders, R3Orders, R4Orders, R5Orders, R6Orders, R7Orders, products, dtMillis]
  )

  return { 
    croixData, 
    almondData, 
    products,
    submitProducts: submitMutations,
    updateProductCache: updateLocalData,
    isValidating,
  }

}