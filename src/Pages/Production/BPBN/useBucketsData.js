import { useDoughs } from "../../../data/dough/useDoughs"
import { useDoughComponents } from "../../../data/doughComponent/useDoughComponents"
import { useProducts } from "../../../data/product/useProducts"
import { useCombinedRoutedOrdersByDate } from "../../../data/production/useProductionData"
import { useMemo } from "react"
import { calculateBucketsData } from "./dataBuckets"
import { DateTime } from "luxon"
import { keyBy } from "../../../utils/collectionFns"

/**
 * 
 * @param {Object} input
 * @param {DateTime} input.reportDT
 * @param {'Prado' | 'Carlton' | undefined} input.mixedWhere 
 * @returns 
 */
export const useBucketsData = ({ reportDT, mixedWhere }) => {

  const { data:PRD } = useProducts({ shouldFetch: true })
  const { data:DGH } = useDoughs({ shouldFetch: true })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true, shouldFetch: true })
  const { data:R2Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 2 }), useHolding: true, shouldFetch: true })
  const { data:R3Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 3 }), useHolding: true, shouldFetch: true })
  const [R1, R2] = [1, 2].map(days => reportDT.plus({ days }).toFormat('yyyy-MM-dd'))
  
  const { data:DCP } = useDoughComponents({ shouldFetch: true})

  const doughList = useMemo(() => {
    return !!mixedWhere 
      ? calculateBucketsData(PRD, DGH, R1Orders, R2Orders, R3Orders, R1, R2)?.filter(row => row.mixedWhere === mixedWhere)
      : calculateBucketsData(PRD, DGH, R1Orders, R2Orders, R3Orders, R1, R2)
  }, [PRD, DGH, R1Orders, R2Orders, R3Orders, R1, R2])

  const products = useMemo(
    () => !!PRD ? keyBy(PRD, P => P.prodNick) : undefined,
    [PRD]  
  )

  return {
    doughList,
    products,
    doughComponents: DCP
  }

}
