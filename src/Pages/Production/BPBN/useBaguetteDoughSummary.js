import { round } from "lodash"
import { useDoughs } from "../../../data/dough/useDoughs"
import { useProducts } from "../../../data/product/useProducts"
import { CombinedRoutedOrder, useCombinedRoutedOrdersByDate } from "../../../data/production/useProductionData"
import { compareBy, groupByObjectRdc, keyBy, sumBy, uniqByRdc } from "../../../utils/collectionFns"
import { useMemo } from "react"


export const useBaguetteDoughSummary = ({ reportDT }) => {
  const [R0, R1, R2] = [0, 1, 2].map(daysAhead => 
    reportDT.plus({ days: daysAhead }).toFormat('yyyy-MM-dd')
  )

  const { data:T0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 0 }), useHolding: false})
  const { data:T1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true})
  const { data:T2Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 2 }), useHolding: true})
  const { data:T3Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 3 }), useHolding: true})
  
  const { data:DGH } = useDoughs({ shouldFetch: true })
  const { data:PRD } = useProducts({ shouldFetch: true})

  // *** Filter/Query functions ***

  const calculateBakeDate = (/** @type {CombinedRoutedOrder} */ order) =>
  order.meta.routePlan.steps[0].begin.date

  const calculateDoughSummary = () => {
    if (!T0Orders || !T1Orders || !T2Orders || !T3Orders || !DGH || !PRD) return undefined

    const doughs = keyBy(DGH, D => D.doughName)
    const products = keyBy(PRD, P => P.prodNick)
    const baguetteDoughProducts = PRD
      .filter(P => P.doughNick === "Baguette")
      .sort(compareBy(P => P.prodName))
      .reduce(uniqByRdc(P => P.forBake), [])

    const baguetteOrders = 
      [...T0Orders, ...T1Orders, ...T2Orders, ...T3Orders].filter(order => 
        products[order.prodNick].doughNick === "Baguette"  
      )

    const [B0Orders, B1Orders, B2Orders] = [R0, R1, R2].map(RN => 
      baguetteOrders
        .filter(order => calculateBakeDate(order) === RN) // RN := report date +N days
        .reduce(groupByObjectRdc(order => products[order.prodNick].forBake), {})
    )
    console.log("BN ORDERS:", [B0Orders, B1Orders, B2Orders])

    const calcWeight = order => {
      const { packSize, weight } = products[order.prodNick]
      return round(order.qty * packSize * weight, 2)
    }

    const doughData = baguetteDoughProducts.map(P => {
      const { preshaped, weight, forBake } = P

      const preshapedWeight = round((preshaped ?? 0) * weight, 1)
      const [weightT0, weightT1, weightT2] = 
        [B0Orders, B1Orders, B2Orders].map(BNOrders => round(
          sumBy(BNOrders[forBake] ?? [], calcWeight), 1
        ))

      // An oddball rule: Being short oli or bcw adds to our dough needs,
      // but having extra on hand does not mean we can recycle back into
      // baguette dough, so they get omitted from the surplus tally.
      const extraT0 = ['Olive Herb', 'Blue Cheese Walnut'].includes(forBake)
        ? 0
        : Math.max(0, round(preshapedWeight - weightT0, 1))
      
      const shortT0 = Math.max(0, round(weightT0 - preshapedWeight, 1))

      return {
        forBake,
        preshapedWeightT0: preshapedWeight,
        extraT0,
        shortT0,
        weightT0,
        weightT1,
        weightT2,
        itemsT0: B0Orders[forBake],
        itemsT1: B1Orders[forBake],
        itemsT2: B2Orders[forBake],
      }

    })

    const { oldDough, bucketSets, preBucketSets } = doughs['Baguette']
    


    return doughData

  }

  return { data: useMemo(
    calculateDoughSummary, 
    [T0Orders, T1Orders, T2Orders, T3Orders, DGH, PRD, R0, R1, R2]
  )}

}