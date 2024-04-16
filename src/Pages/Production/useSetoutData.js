import { useMemo } from "react"
import { useProducts } from "../../data/product/useProducts"
import { useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData"
import { calculateSetoutCarlton, calculateSetoutPrado } from "./dataSetout"
import { DateTime } from "luxon"

/**
 * @param {Object} input
 * @param {DateTime} input.reportDT
 * @param {'Prado'|'Carlton'} input.reportLocation
 * @param {boolean} input.shouldFetch 
 */
export const useSetoutData = ({ reportDT, reportLocation, shouldFetch }) => {

  const { data:PRD } = useProducts({ shouldFetch })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true, shouldFetch })
  const { data:R2Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 2 }), useHolding: true, shouldFetch: shouldFetch && reportLocation === 'Prado' })
  const { data:R3Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 3 }), useHolding: true, shouldFetch: shouldFetch && reportLocation === 'Prado' })

  return useMemo(
    () => reportLocation === 'Prado' 
      ? calculateSetoutPrado(PRD, R1Orders, R2Orders, R3Orders)
      : calculateSetoutCarlton(PRD, R1Orders), 
    [reportLocation, PRD, R1Orders, R2Orders, R3Orders]
  )

}

/*

Setout for non-almond croix can be derived from orders as follows:

Filter all orders to products with doughNick === 'Croissant', excluding orders
for bpbExtras. From there...

BPBN Setout:
* T+1 orders for baked pastries except al, with fulfillment out of the Carlton
* Half qty of any order for 'backporch' for T+1

BPBS Setout:
* T+1 orders for baked pastries except al, with fulfillment out of Prado
* Half qty of any order for 'backporch' for T+1
* Add T+2 orders for fral to pl total
* Add T+2 orders for al fulfilled from Prado to pl total
* Add T+3 forders for al fulfilled from the Carlton to pl total

*/