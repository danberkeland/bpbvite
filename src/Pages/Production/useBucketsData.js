import { useDoughs } from "../../data/dough/useDoughs"
import { useDoughComponents } from "../../data/doughComponent/useDoughComponents"
import { useProducts } from "../../data/product/useProducts"
import { useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData"
import { useMemo } from "react"
import { calculateBucketsData } from "./dataBuckets"
import { DateTime } from "luxon"
import { keyBy } from "../../utils/collectionFns"
import { holidayShift } from "../../utils/dateAndTime/holidayShift"

/**
 * @param {Object} input
 * @param {DateTime} input.reportDT
 * @param {boolean} input.shouldFetch  
 * @param {'Carlton' | 'Prado'} input.mixedWhere  
 */
export const useBucketsData = ({ reportDT, shouldFetch, mixedWhere }) => {
  const [D1, D2, D3] = [1, 2, 3]
    .map(daysAhead => reportDT.plus({ days: daysAhead }))
    .map(holidayShift)

  const [R1, R2] = [D1, D2]
    .map(dt => dt.toFormat('yyyy-MM-dd'))
    
  const { data:PRD } = useProducts({ shouldFetch })
  const { data:DGH } = useDoughs({ shouldFetch })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: D1, useHolding: true, shouldFetch })
  const { data:R2Orders } = useCombinedRoutedOrdersByDate({ delivDT: D2, useHolding: true, shouldFetch })
  const { data:R3Orders } = useCombinedRoutedOrdersByDate({ delivDT: D3, useHolding: true, shouldFetch })
  // const R1 = reportDT.plus({ days: 1 }).toFormat('yyyy-MM-dd')
  // const R2 = reportDT.plus({ days: 2 }).toFormat('yyyy-MM-dd')
  // const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true, shouldFetch })
  // const { data:R2Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 2 }), useHolding: true, shouldFetch })
  // const { data:R3Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 3 }), useHolding: true, shouldFetch })

  const doughList = useMemo(() => {
    return calculateBucketsData(
      PRD, 
      DGH?.filter(D => D.mixedWhere === mixedWhere), 
      R1Orders, R2Orders, R3Orders, 
      R1, R2
    )
  }, [PRD, DGH, R1Orders, R2Orders, R3Orders, R1, R2, mixedWhere])

  const products = useMemo(
    () => !!PRD ? keyBy(PRD, P => P.prodNick) : undefined,
    [PRD]  
  )

  return {
    doughList,
    doughComponents: useDoughComponents({ shouldFetch })?.data,
    products,
  }

}