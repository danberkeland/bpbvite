// import { DateTime } from "luxon"
import { useProdOrdersByDate } from "../../../../../data/useT0T7ProdOrders"
import { useMemo } from "react"
import { useListData } from "../../../../../data/_listData"
import { flow, groupBy, keyBy, sumBy, mapValues, sortBy, uniqBy, values, map, filter } from "lodash/fp"
import { getTodayDT, isoToDT } from "../utils"
import { getListType, partitionBpbnOrdersByListType, partitionOrdersByBakeLocation } from "./partitionFns"
import { isHoliday, scheduleForwardOnHolidays } from "../../_utils/holidayScheduling"
// import { HOLIDAYS } from "../../_constants/holidays"

// *** 1. util fns ****
const mapValuesWithKeys = mapValues.convert({ 'cap': false })

// *** Main data hook ***

/** 
 * @typedef {Object} FlagOptions 
 * @property {boolean} useRustics
 * @property {boolean} useCroix
 * @property {boolean} useOtherPrep
*/

/**@type {FlagOptions} */
const defaultFlags = {
  useRustics: true,
  useCroix: true,
  useOtherPrep: true,
}

/**
 * @typedef {Object} BpbnDataReturn
 * @property {Object[]|undefined} rusticData
 * @property {Object[]|undefined} croixData
 * @property {Object[]|undefined} otherPrepData
 * @property {Object|undefined} productRepsByListTypeByForBake
 */

/**
 * @param {Object} input
 * @param {string} [input.currentDate] - optional override for 'today'; 
 * simulates local system date.
 * @param {string} input.reportDate
 * @param {boolean} input.shouldFetch
 * @param {boolean} [input.shouldIncludeHolding=false]
 * @param {boolean} [input.shouldShowZeroes]
 * @param {FlagOptions} [input.flags=defaultFlags] - 
 * manually control which data to return for more efficient fetching
 * @returns {BpbnDataReturn} 
 */
const useBpbnData = ({ 
  currentDate,
  reportDate, 
  shouldFetch,
  shouldIncludeHolding=false,
  shouldShowZeroes=false,
  flags=defaultFlags
}) => {
  const todayDT = !!currentDate ? isoToDT(currentDate) : getTodayDT()
  const today = todayDT.toISODate()
  const reportDateDT = isoToDT(reportDate)
  const reportRelDate = reportDateDT.diff(todayDT, 'days').days

  // fetching T0 data is a minimum if anything is to be fetched at all
  const _shouldFetch = shouldFetch 
    && (flags.useRustics || flags.useCroix || flags.useOtherPrep)

  const fetchDates = [reportDateDT]
    .concat(scheduleForwardOnHolidays([reportDateDT.plus({ days: 1 })]))
    .map(dt => dt.toFormat('yyyy-MM-dd'))

  // const fetchDates = scheduleForwardOnHolidays(
  //   [0,1].map(daysAhead => reportDateDT.plus({ days: daysAhead }))
  // )
    
  const { data:T0 } = useProdOrdersByDate({ 
    currentDate,
    reportDate: fetchDates[0], //.toFormat('yyyy-MM-dd'),
    shouldFetch: _shouldFetch, 
    shouldAddRoutes: true 
  })

  const shouldFetchT1 = shouldFetch && (flags.useRustics || flags.useOtherPrep)
  const { data:T1 } = useProdOrdersByDate({ 
    currentDate,
    reportDate: fetchDates[1], //.toFormat('yyyy-MM-dd'), 
    shouldFetch: shouldFetchT1, 
    shouldAddRoutes: true 
  })
  const { data:PRD } = useListData({ 
    tableName: "Product", 
    shouldFetch: _shouldFetch 
  })
  const { data:RTE } = useListData({ 
    tableName: "Route", 
    shouldFetch: _shouldFetch 
  })



  const calculateValue = () => {
    if (!T0 || (shouldFetchT1 && !T1) || !PRD || !RTE) return undefined

    const products = keyBy('prodNick')(PRD)
    const routes = keyBy('routeNick')(RTE)

    /**multiply order quantity by pack size */
    const getQtyEa = (order) => order.qty * products[order.prodNick].packSize

    const bakeOrders = [
      ...(T0 ?? []).filter(order => order.delivLeadTime === 0), 
      ...(T1 ?? []).filter(order => order.delivLeadTime === 1)
    ].filter(order => 
      //order.bakeRelDate === reportRelDate 
      order.qty !== 0
      && (shouldIncludeHolding || order.isStand !== false)
    )

    const { bpbnOrders } = partitionOrdersByBakeLocation({
      orders: bakeOrders, products, routes
    })

    const { rustic, croix, otherPrep } 
      = partitionBpbnOrdersByListType({ bpbnOrders, products })

    // More accurately, 'preshapesByListTypeByForBake'
    //
    // preshapes can be be used for multiple products. 
    // Bucketing products by preshape type is the same as grouping by 
    // their 'forBake' name, at least with bpbn products...
    //
    // We choose one product to be the 'representative' of the group, which 
    // holds the preshape and prepreshape values. The rule for selecting this 
    // representative is to take the first product when sorted by prodName.
    // 
    // we hold on to this representative prodNick while bucketing so that we
    // can be sure to update the correct product's (pre)preshape value.
    const preshapes = flow(
      sortBy('prodName'),
      uniqBy('forBake'), // uniqBy returns the first of each type encountered.
      groupBy(getListType),
      mapValues(keyBy('forBake')),
    )(PRD)

    const _rusticTemplate = !flags.useRustics ? [] : flow(
      mapValues(product => {
        const { 
          prodNick, forBake, weight, doughNick, preshaped, prepreshaped
        } = product
        const preshapedQty = reportRelDate === 0 
          ? preshaped
          : prepreshaped

        return {
          prodNick,
          forBake,
          qty: 0,
          items: [],
          weight,
          doughNick,
          shaped: preshapedQty,
          short: "",
          qtyNeededEarly: 0,
          itemsNeededEarly: []
        }
      })
    )(preshapes.rustic)

   const _rusticData = !flags.useRustics ? [] : flow(
      map(order => isHoliday(order.delivDate) || isHoliday(today)
        ? ({ ...order, qty: 0})
        : order
      ),
      groupBy(order => products[order.prodNick].forBake),
      mapValuesWithKeys((rowGroup, key) => {
        const totalQty = sumBy(getQtyEa)(rowGroup)
        const { prodNick, preshaped, prepreshaped, weight, doughNick } 
          = preshapes.rustic[key]

        const preshapedQty = reportRelDate === 0 
          ? preshaped
          : prepreshaped

        const shortQty = totalQty - preshapedQty
        const shortText = 
          shortQty > 0 ? `Short ${shortQty}`
          : shortQty < 0 ? `Over ${shortQty * -1}`
          : ''

        // Feels jank. Better to filter by routeStart time && not pickup ?
        const earlyOrders = rowGroup.filter(order => {
          const route = routes[order.routeMeta.routeNick]
          return (0
            || route.routeNick === 'Pick up Carlton'
            || route.routeNick === 'AM North'
            // route.RouteDepart === 'Carlton'
            // && route.RouteArrive === 'Carlton'
            // && route.routeNick !== 'Pick up Carlton'
          )
        })
        const qtyNeededEarly = sumBy(getQtyEa)(earlyOrders) || ''

        return {
          prodNick,                       // for reliable mutations
          productRep: {
            preshaped,
            prepreshaped,
          },
          forBake: key,
          qty: totalQty,
          items: sortBy([
            'delivDate',
            'routeMeta.route.routeStart',
            'routeMeta.routeNick'
          ])(rowGroup),
          weight,
          doughNick,
          shaped: preshapedQty,           // for bake list only
          short: shortText,               //  "
          qtyNeededEarly,                 //  "
          itemsNeededEarly: sortBy([      //  "
            'delivDate',
            'routeMeta.route.routeStart',
            'routeMeta.routeNick'
          ])(earlyOrders)  
        }
      }),
    )(rustic)

    const rusticData = flow(values, sortBy('forBake'))(
      shouldShowZeroes
        ? { ..._rusticTemplate, ..._rusticData }
        : _rusticData
    )

    const _croixTemplate = !flags.useCroix ? [] : flow(
      mapValues(product => {

        return {
          forBake: product.forBake,
          qty: 0,
          items: []
        }
      })
    )(preshapes.croix)
    
    // console.log(fetchDates.map(dt => dt.toISODate()))
    // console.log("bake orders", bakeOrders.filter(order => order.prodNick === 'pg').map(order => order.delivDate))
    // console.log("CROIX DATA:", croix.map(order => [order.delivDate, order.prodNick, order.locNick]))
    const _croixData = !flags.useCroix ? [] : flow(
      map(order => order.locNick === 'backporch' 
        ? ({ ...order, qty: Math.ceil(order.qty / 2)})
        : order
      ),
      // map(order => isHoliday(order.delivDate)
      //   ? ({...order, qty:0})
      //   : order
      // ),
      filter(order => order.delivDate === reportDate),
      groupBy(order => products[order.prodNick].forBake),
      mapValuesWithKeys((orderGroup, key) => {

        return {
          forBake: key,
          //prodName: products[key].prodName,
          qty: sumBy(getQtyEa)(orderGroup),
          items: orderGroup
        }
      }),
    )(croix)

    const croixData = flow(values, sortBy('forBake'))(
      shouldShowZeroes
        ? { ..._croixTemplate, ..._croixData }
        : _croixData
    )

    const _otherPrepTemplate = !flags.useOtherPrep ? [] : flow( 
      mapValues(product => {

        return {
          prodNick: product.prodNick,
          prodName: product.prodName,
          qty: 0,
          items: []
        }
      }),
    )(preshapes.other)

    const _otherPrepData = !flags.useOtherPrep ? [] : flow( 
      map(order => isHoliday(order.delivDate) || isHoliday(today)
        ? ({...order, qty:0})
        : order
      ),
      groupBy('prodNick'),
      mapValuesWithKeys((orderGroup, key) => {

        return {
          prodNick: key,
          prodName: products[key].prodName,
          qty: sumBy(getQtyEa)(orderGroup),
          items: orderGroup
        }
      }),
    )(otherPrep)

    const otherPrepData = flow(values, sortBy('prodName'))(
      shouldShowZeroes
        ? { ..._otherPrepTemplate, ..._otherPrepData }
        : _otherPrepData
    )

    // console.log("Rustic data:", rusticData)
    // console.log("Croix data:", croixData)
    // console.log("Other data:", otherPrepData)
    // console.log("preshapes:", preshapes)
    return { 
      rusticData, 
      croixData, 
      otherPrepData, 
      productRepsByListTypeByForBake:preshapes 
    }

  }

  const { rusticData, croixData, otherPrepData, productRepsByListTypeByForBake } = 
    useMemo(calculateValue, [reportDate, T0, T1, PRD, RTE]) ?? {}

  return { rusticData, croixData, otherPrepData, productRepsByListTypeByForBake } 

}




// ***********
// * Exports *
// ***********

// Bpbn production reports use *mostly* the same data in different places. 
// The variations are significant enough that we have the dilemma of choosing:
//
//  - a big messy data hook that requires input flags to control the internal
//    logic appropriately for the given context
//  - several slightly smaller hooks with a lot of repeated code
//
// We opted for the first solution and will keep it contained to this module.
//
// Exports are functions that call the main hook with the appropriate 
// configurations for each page.
//
// WARNINGS:
//
// this data uses preshape and prepreshape counts on the BPBN1 rustic list,
// using preshape for today, prepreshape for tomorrow. We cannnot display
// a meaningful value in any other location and for any other date. Take care
// if you try invoking the main data hook with a different configuration,
// especially if you plan to use rustic data.

/**For Bpbn1 report */
export const useBpbn1Data = ({ 
  currentDate,
  reportDate, 
  shouldShowZeroes, 
  shouldFetch 
}) => useBpbnData({ 
  currentDate,
  reportDate, 
  shouldFetch, 
  shouldShowZeroes,
  shouldIncludeHolding: false,
  flags: {
    useRustics: true,
    useCroix: false,
    useOtherPrep: true,
  }
})

/**For Bpbn2 report. Should only be called for the current day!*/
export const useBpbn2Data =({ 
  reportDate, 
  shouldShowZeroes, 
  shouldFetch 
}) => {
  const reportDateDT = isoToDT(reportDate)
  const [R0, R1] = [reportDateDT]
    .concat(scheduleForwardOnHolidays([reportDateDT.plus({ days: 1 })]))
    .map(dt => dt.toFormat('yyyy-MM-dd'))

  const { otherPrepData } = useBpbnData({
    reportDate: R0,
    shouldShowZeroes,
    shouldFetch,
    shouldIncludeHolding: false,
    flags: {
      useRustics: false,
      useCroix: false,
      useOtherPrep: true,
    }
  })

  const { 
    rusticData, 
    croixData,
    productRepsByListTypeByForBake
  } = useBpbnData({
    // reportDate: isoToDT(reportDate).plus({ days: 1 }).toFormat('yyyy-MM-dd'),
    reportDate: R1,
    shouldShowZeroes,
    shouldFetch,
    shouldIncludeHolding: true,
    flags: {
      useRustics: true,
      useCroix: true,
      useOtherPrep: false,
    }
  })

  if (!otherPrepData || !rusticData) return undefined
  
  return {    
    rusticData, 
    otherPrepData,
    croixData,
    productRepsByListTypeByForBake
  }

}


/**For BPBNSetout report */
export const useBpbnCroixSetoutData = ({ reportDate, shouldFetch }) => useBpbnData({
  reportDate: isoToDT(reportDate).plus({ days: 1 }).toFormat('yyyy-MM-dd'),
  shouldFetch,
  shouldIncludeHolding: true,
  flags: {
    useRustics: false,
    useCroix: true,
    useOtherPrep: true,
  }
})