import { DateTime } from "luxon";
import { useProducts } from "../../data/product/useProducts"
import { useCombinedRoutedOrdersByDate } from "../../data/production/useProductionData"
import { keyBy } from "../../utils/collectionFns";
import { useMemo } from "react";
import { calculateFresh } from "./dataBPBSFreshProducts";
import { calculateBagged } from "./dataBPBSBaggedProducts";
import { calculatePretzel } from "./dataBPBSPretzel";
import { calculateFrenchPockets } from "./dataBPBSFrenchPockets";
import { holidayShift } from "../../utils/dateAndTime/holidayShift";

/**
 * @param {Object} input
 * @param {DateTime} input.reportDT 
 * @param {boolean} input.shouldFetch
 */
export const useWhatToMake = ({ reportDT, shouldFetch }) => {
  const [D0, D1, D2] = [0, 1, 2]
    .map(daysAhead => reportDT.plus({ days: daysAhead }))
    .map(holidayShift)

  const [R0, R1] = [D0, D1]
    .map(dt => dt.toFormat('yyyy-MM-dd'))
 
  const { data:R0Orders } = useCombinedRoutedOrdersByDate({ delivDT: D0, useHolding: false, shouldFetch })
  const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: D1, useHolding: true,  shouldFetch })
  const { data:R2Orders } = useCombinedRoutedOrdersByDate({ delivDT: D2, useHolding: true,  shouldFetch })

  // const R0 = reportDT.plus({ days: 0 }).toFormat('yyyy-MM-dd')
  // const R1 = reportDT.plus({ days: 1 }).toFormat('yyyy-MM-dd')
 
  // const { data:R0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 0 }), useHolding: false, shouldFetch })
  // const { data:R1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true,  shouldFetch })
  // const { data:R2Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 2 }), useHolding: true,  shouldFetch })

  const { 
    data:PRD,
    submitMutations:submitProducts,
    updateLocalData:updateProductCache, 
  } = useProducts({ shouldFetch: true })
  const products = useMemo(() => 
    !!PRD ? keyBy(PRD, P => P.prodNick) : undefined,
    [PRD]
  )

  const freshData = useMemo(
    () => calculateFresh(R0, R1, R0Orders, R1Orders, PRD),
    [R0, R1, R0Orders, R1Orders, PRD]
  )

  const { shelfData, freezerData } = useMemo(
    () => calculateBagged(R0, R1, R0Orders, R1Orders, PRD),
    [R0, R1, R0Orders, R1Orders, PRD]
  )

  const pretzelData = useMemo(
    () => calculatePretzel(R0, R1, R0Orders, R1Orders, R2Orders, PRD),
    [R0, R1, R0Orders, R1Orders, R2Orders, PRD]
  )

  const frenchPocketData = useMemo(
    () => calculateFrenchPockets(R0, R0Orders, R1Orders, PRD), 
    [R0, R0Orders, R1Orders, PRD]
  )

  return { 
    freshData, 
    shelfData,
    freezerData,
    pretzelData,
    frenchPocketData,
    products,
    submitProducts,
    updateProductCache,
  }
}