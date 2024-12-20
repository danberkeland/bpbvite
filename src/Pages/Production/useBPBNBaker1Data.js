import { useMemo } from "react"

import { useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData"
import { useDoughs } from "../../data/dough/useDoughs"
import { useProducts } from "../../data/product/useProducts"

import { calculateRustics } from "./dataBPBNRustic"
import { useDoobieStuff } from "./dataBPBNDoobieStuff"
import { calculateOtherPrep } from "./dataBPBNOtherPrep"
import { calculateBaguetteSummary } from "./dataBPBNBaguetteDough"

import { DateTime } from "luxon"
import { holidayShift } from "../../utils/dateAndTime/holidayShift"

/**
 * Data is only intended to be generated for the current day, and for tomorrow 
 * as a backup report.
 * @param {Object} input
 * @param {DateTime} input.reportDT
 * @param {'today' | 'tomorrow'} input.calculateFor today => use preshaped & bucketSets; tomorrow => use prepreshaped & preBucketSets
 * @param {boolean} input.shouldFetch
 */
export const useBaker1Data = ({ reportDT, calculateFor, shouldFetch }) => {
  // const [R0, R1, R2] = [0, 1, 2]
  //   .map(daysAhead => reportDT.plus({ days: daysAhead }))
  //   .map(dt => dt.toFormat('yyyy-MM-dd'))

  // const { data:T0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 0 }), useHolding: false, shouldFetch })
  // const { data:T1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true,  shouldFetch })
  // const { data:T2Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 2 }), useHolding: true,  shouldFetch })
  // const { data:T3Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 3 }), useHolding: true,  shouldFetch })

  const [D0, D1, D2, D3] = [0, 1, 2, 3]
    .map(daysAhead => reportDT.plus({ days: daysAhead }))
    .map(holidayShift)
  
  const [R0, R1, R2] = [D0, D1, D2]
    .map(dt => dt.toFormat('yyyy-MM-dd'))

  const preshapeType = calculateFor === 'today'
    ? 'preshape'
    : 'prepreshape'

  const bucketSetType = calculateFor === 'today'
    ? 'bucketSets'
    : 'preBucketSets'

  const { data:T0Orders } = useCombinedRoutedOrdersByDate({ delivDT: D0, useHolding: false, shouldFetch })
  const { data:T1Orders } = useCombinedRoutedOrdersByDate({ delivDT: D1, useHolding: true,  shouldFetch })
  const { data:T2Orders } = useCombinedRoutedOrdersByDate({ delivDT: D2, useHolding: true,  shouldFetch })
  const { data:T3Orders } = useCombinedRoutedOrdersByDate({ delivDT: D3, useHolding: true,  shouldFetch })

  const { data:DGH } = useDoughs({ shouldFetch })
  const { data:PRD } = useProducts({ shouldFetch })

  const rusticData = useMemo(
    () => calculateRustics(T0Orders, T1Orders, PRD, R0, preshapeType), 
    [T0Orders, T1Orders, PRD, R0, preshapeType] 
  )

  const { data:doobieStuff } = useDoobieStuff({ reportDT })

  const otherPrepData = useMemo(
    () => calculateOtherPrep(T0Orders, T1Orders, PRD, R0), 
    [T0Orders, T1Orders, PRD, R0]
  ) 

  const { baguetteData, baguetteSummary, mixSummary, bins, pans, buckets, nBucketSetsToMake } = useMemo(
    () => calculateBaguetteSummary(T0Orders, T1Orders, T2Orders, T3Orders, DGH, PRD, R0, R1, R2, bucketSetType), 
    [T0Orders, T1Orders, T2Orders, T3Orders, DGH, PRD, R0, R1, R2, bucketSetType]
  )

  return {
    rusticData,
    doobieStuff,
    otherPrepData,
    baguetteData,
    baguetteSummary,
    mixSummary,
    bins, 
    pans,
    buckets,
    nBucketSetsToMake,
  }

}