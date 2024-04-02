import { useMemo } from "react"
import { useProducts } from "../../../data/product/useProducts"
import { useCombinedRoutedOrdersByDate } from "../../../data/production/useProductionData"
import { calculateSetoutCarlton } from "./dataSetout"


export const useSetoutData = ({ reportDT }) => {

  const { data:PRD } = useProducts({ shouldFetch: true })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true,  shouldFetch: true })
  // const { data:R2Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 2 }), useHolding: true,  shouldFetch: true })
  // const { data:R3Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 3 }), useHolding: true,  shouldFetch: true })

  // return useMemo(
  //   () => calculateSetout(PRD, R1Orders, R2Orders, R3Orders), 
  //   [PRD, R1Orders, R2Orders, R3Orders]
  // )
  return useMemo(
    () => calculateSetoutCarlton(PRD, R1Orders), 
    [PRD, R1Orders]
  )

}