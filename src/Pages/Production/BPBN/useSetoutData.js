import { useMemo } from "react"
import { useProducts } from "../../../data/product/useProducts"
import { useCombinedRoutedOrdersByDate } from "../../../data/production/useProductionData"
import { calculateSetoutCarlton } from "./dataSetout"


export const useSetoutData = ({ reportDT, shouldFetch }) => {

  const { data:PRD } = useProducts({ shouldFetch })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ 
    delivDT: reportDT.plus({ days: 1 }), 
    useHolding: true,  
    shouldFetch 
  })

  return useMemo(
    () => calculateSetoutCarlton(PRD, R1Orders), 
    [PRD, R1Orders]
  )

}