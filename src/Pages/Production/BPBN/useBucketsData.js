import { useDoughs } from "../../../data/dough/useDoughs"
import { useDoughComponents } from "../../../data/doughComponent/useDoughComponents"
import { useProducts } from "../../../data/product/useProducts"
import { useCombinedRoutedOrdersByDate } from "../../../data/production/useProductionData"
import { useMemo } from "react"
import { calculateBucketsData } from "./dataBuckets"


export const useBucketsData = ({ reportDT }) => {

  const { data:PRD } = useProducts({ shouldFetch: true })
  const { data:DGH } = useDoughs({ shouldFetch: true })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true })
  const { data:R2Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 2 }), useHolding: true })
  const { data:R3Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 3 }), useHolding: true })
  const [R1, R2] = [1, 2].map(days => reportDT.plus({ days }).toFormat('yyyy-MM-dd'))
  
  const { data:DCP } = useDoughComponents({ shouldFetch: true})

  return {
    doughList: useMemo(
      () => calculateBucketsData(PRD, DGH, R1Orders, R2Orders, R3Orders, R1, R2), 
      [PRD, DGH, R1Orders, R2Orders, R3Orders, R1, R2]
    ),
    products: PRD,
    doughComponents: DCP
  }
}