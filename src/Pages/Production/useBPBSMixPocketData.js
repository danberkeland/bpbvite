import { useDoughs } from "../../data/dough/useDoughs"
import { useDoughComponents } from "../../data/doughComponent/useDoughComponents"
import { useProducts } from "../../data/product/useProducts"
import { useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData"
import { useMemo } from "react"
import { calculateBucketsData } from "./dataBuckets"
import { DateTime } from "luxon"
import { keyBy } from "../../utils/collectionFns"
import { calculateFrenchPockets } from "./dataBPBSFrenchPockets"
import { holidayShift } from "../../utils/dateAndTime/holidayShift"

/**
 * @param {Object} input
 * @param {DateTime} input.reportDT
 * @param {boolean} input.shouldFetch  
 */
export const useMixPocketData = ({ reportDT, shouldFetch }) => {
  const [D0, D1, D2, D3] = [0, 1, 2, 3]
    .map(daysAhead => reportDT.plus({ days: daysAhead }))
    .map(holidayShift)

  const [R0, R1, R2] = [D0, D1, D2]
    .map(dt => dt.toFormat('yyyy-MM-dd'))

  const { data:R0Orders } = useCombinedRoutedOrdersByDate({ delivDT: D0, useHolding: false, shouldFetch })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: D1, useHolding: true,  shouldFetch })
  const { data:R2Orders } = useCombinedRoutedOrdersByDate({ delivDT: D2, useHolding: true,  shouldFetch })
  const { data:R3Orders } = useCombinedRoutedOrdersByDate({ delivDT: D3, useHolding: true,  shouldFetch })

  // const R0 = reportDT.plus({ days: 0 }).toFormat('yyyy-MM-dd')
  // const R1 = reportDT.plus({ days: 1 }).toFormat('yyyy-MM-dd')
  // const R2 = reportDT.plus({ days: 2 }).toFormat('yyyy-MM-dd')

  // const { data:R0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 0 }), useHolding: false, shouldFetch })
  // const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true,  shouldFetch })
  // const { data:R2Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 2 }), useHolding: true,  shouldFetch })
  // const { data:R3Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 3 }), useHolding: true,  shouldFetch })

  const { data:PRD, submitMutations:submitProducts, updateLocalData:updateProductCache } = useProducts({ shouldFetch })
  const { data:DGH, submitMutations:submitDoughs,   updateLocalData:updateDoughCache } = useDoughs({ shouldFetch })
  
  // What is this -- bucket measurements? mix measurements? both?
  const mixList = useMemo(() => {
    return calculateBucketsData(
      PRD, 
      DGH?.filter(D => D.doughName === 'French'), 
      R1Orders, R2Orders, R3Orders, R1, R2
    )
  }, [PRD, DGH, R1Orders, R2Orders, R3Orders, R1, R2])

  const frenchPocketDataR0 = useMemo(
    () => calculateFrenchPockets(R0, R0Orders, R1Orders, PRD), 
    [R0, R0Orders, R1Orders, PRD]
  )

  // calculate needed amt for tomorrow
  const frenchPocketDataR1 = useMemo(
    () => calculateFrenchPockets(R1, R1Orders, R2Orders, PRD), 
    [R1, R1Orders, R1Orders, PRD]
  )

  const products = useMemo(
    () => !!PRD ? keyBy(PRD, P => P.prodNick) : undefined,
    [PRD]  
  )

  return {
    frenchMixItem: mixList?.[0],
    doughComponents: useDoughComponents({ shouldFetch })?.data,
    frenchPocketDataR0,
    frenchPocketDataR1,
    products,
    submitDoughs,
    updateDoughCache,
    submitProducts,
    updateProductCache,
  }

}