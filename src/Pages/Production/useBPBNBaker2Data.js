import { useMemo } from "react"

import { useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData"
import { useProducts } from "../../data/product/useProducts"

import { calculateRustics } from "./dataBPBNRustic"
import { calculateOtherPrep } from "./dataBPBNOtherPrep"

import { DateTime } from "luxon"
import { calculateSetoutCarlton } from "./dataSetout"

/**
 * Data is only intended to be generated for the current day and for tomorrow 
 * as a backup report. When calling data for the current day, be sure to specify 
 * using 'preshape' counts for dough caclulations and 'prepreshape' counts
 * for the tomorrow/backup report.
 * @param {Object} input
 * @param {DateTime} input.reportDT
 * @param {boolean} input.shouldFetch
 */
export const useBaker2Data = ({ reportDT, shouldFetch }) => {
  const [R0, R1] = [0, 1].map(daysAhead => reportDT.plus({ days: daysAhead }).toFormat('yyyy-MM-dd'))

  const { data:T0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 0 }), useHolding: false, shouldFetch })
  const { data:T1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true, shouldFetch })
  const { data:T2Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 2 }), useHolding: true, shouldFetch })
  
  const { data:PRD } = useProducts({ shouldFetch})

  // Shaped today => baked tomorrow; include holding orders
  const rusticShapeData = useMemo(
    () => calculateRustics(T1Orders, T2Orders, PRD, R1, 'preshape'), // preshapeType isn't actually used for this list. 
    [T1Orders, T2Orders, PRD, R1] 
  )

  // Context is misleading; this list hilights items to be BAKED on the report date.
  // Exact same info appears on Baker1 list.
  const otherPrepData = useMemo(
    () => calculateOtherPrep(T0Orders, T1Orders, PRD, R0), 
    [T0Orders, T1Orders, PRD, R0]
  ) 

  // Setout today => bake tomorrow
  const croixSetoutData = useMemo(
    () => calculateSetoutCarlton(PRD, T1Orders),
    [T1Orders, PRD]
  )?.croix

  return {
    rusticShapeData,
    otherPrepData,
    croixSetoutData,
  }

}