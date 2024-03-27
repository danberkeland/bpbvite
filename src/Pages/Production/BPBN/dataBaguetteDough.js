import { round } from "lodash"
import { CombinedRoutedOrder } from "../../../data/production/useProductionData"
import { compareBy, groupByObjectRdc, keyBy, sumBy, uniqByRdc } from "../../../utils/collectionFns"
import { DBDoughBackup, DBProduct } from "../../../data/types.d"
import { divyUp } from "../../../utils/divyUp"
import { mapValues } from "../../../utils/objectFns"

// import { useMemo } from "react"
// import { useDoughs } from "../../../data/dough/useDoughs"
// import { useProducts } from "../../../data/product/useProducts"
// import { useCombinedRoutedOrdersByDate } from "../../../data/production/useProductionData"
// export const useBaguetteDoughSummary = ({ reportDT }) => {
//   const [R0, R1, R2] = [0, 1, 2].map(daysAhead => 
//     reportDT.plus({ days: daysAhead }).toFormat('yyyy-MM-dd')
//   )

//   const { data:T0Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 0 }), useHolding: false})
//   const { data:T1Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 1 }), useHolding: true})
//   const { data:T2Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 2 }), useHolding: true})
//   const { data:T3Orders } = useCombinedRoutedOrdersByDate({ delivDT: reportDT.plus({ days: 3 }), useHolding: true})
  
//   const { data:DGH } = useDoughs({ shouldFetch: true })
//   const { data:PRD } = useProducts({ shouldFetch: true})

//   return { data: useMemo(
//     () => calculateBaguetteSummary(T0Orders, T1Orders, T2Orders, T3Orders, DGH, PRD, R0, R1, R2), 
//     [T0Orders, T1Orders, T2Orders, T3Orders, DGH, PRD, R0, R1, R2]
//   )}

// }

/**Hard coded values. TODO: change to database values? */
const ingProportions = {
  BF:    0.573,
  WW:    0.038,
  water: 0.374,
  salt:  0.013,
  yeast: 0.002,
}

/**
 * @param {CombinedRoutedOrder[] | undefined} T0Orders 
 * @param {CombinedRoutedOrder[] | undefined} T1Orders 
 * @param {CombinedRoutedOrder[] | undefined} T2Orders 
 * @param {CombinedRoutedOrder[] | undefined} T3Orders 
 * @param {DBDoughBackup[] | undefined} DGH
 * @param {DBProduct[] | undefined} PRD
 * @param {string} R0 Report date in yyyy-MM-dd format
 * @param {string} R1 Report date +1
 * @param {string} R2 Report date +2
 * @param {'bucketSets' | 'preBucketSets'} bucketSetType
 */
export const calculateBaguetteSummary = (T0Orders, T1Orders, T2Orders, T3Orders, DGH, PRD, R0, R1, R2, bucketSetType) => {
  if (!T0Orders || !T1Orders || !T2Orders || !T3Orders || !DGH || !PRD) return {}

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
  
  const calculateBakeDate = (/** @type {CombinedRoutedOrder} */ order) =>
    order.meta.routePlan.steps[0].begin.date

  const [B0Orders, B1Orders, B2Orders] = [R0, R1, R2].map(RN => 
    baguetteOrders
      .filter(order => calculateBakeDate(order) === RN) // RN := report date +N days
      .reduce(groupByObjectRdc(order => products[order.prodNick].forBake), {})
  )

  const calcWeight = order => {
    const { packSize, weight } = products[order.prodNick]
    return round(order.qty * packSize * weight, 2)
  }

  //  Baguette Data
  // ===============
  const baguetteData = baguetteDoughProducts.map(P => {
    const { preshaped, weight, forBake } = P

    const preshapedWeightT0 = round((preshaped ?? 0) * weight, 1)
    const [weightT0, weightT1, weightT2] = 
      [B0Orders, B1Orders, B2Orders].map(BNOrders => round(
        sumBy(BNOrders[forBake] ?? [], calcWeight), 1
      ))

    // An oddball rule: Being short oli or bcw adds to our dough needs,
    // but having extra on hand does not mean we can recycle back into
    // baguette dough, so they get omitted from the surplus tally.
    const extraT0 = ['Olive Herb', 'Blue Cheese Walnut'].includes(forBake)
      ? 0
      : Math.max(0, round(preshapedWeightT0 - weightT0, 1))
    
    const shortT0 = Math.max(0, round(weightT0 - preshapedWeightT0, 1))

    return {
      forBake,
      preshapedWeightT0, extraT0, shortT0,
      weightT0, weightT1, weightT2,
      itemsT0: B0Orders[forBake],
      itemsT1: B1Orders[forBake],
      itemsT2: B2Orders[forBake],
    }

  })
  const weightT1 = sumBy(baguetteData, row => row.weightT1)
  const weightT2 = sumBy(baguetteData, row => row.weightT2)
  const shortT0  = sumBy(baguetteData, row => row.shortT0)

  const { oldDough, bucketSets, preBucketSets, buffer } = doughs['Baguette']
  

  const mixTotal = weightT1 + shortT0 + buffer

  const oldDoughTotal = Math.min(oldDough, mixTotal * 0.2)
  const freshTotal = mixTotal - oldDoughTotal
  
  const nBucketSets = bucketSetType === 'bucketSets'
    ? bucketSets
    : preBucketSets
  
  const nMixes = Math.ceil(mixTotal / 210)
  const mixParts = divyUp(nBucketSets, nMixes).filter(qty => qty > 0)

  //  Baguette Summary
  // ==================
  const baguetteSummary = {
    needed: round(weightT1, 2),
    buffer,
    short: shortT0,
    stickerTotal: round(weightT1 + shortT0 + buffer, 2),
  }

  //  Mix Summary
  // =============
  const mixSummary = mixParts.map((nParts, idx) => {
    // nParts === number of bucket sets to use in the mix

    const proportion = nParts / nBucketSets
    const freshDoughWeight = freshTotal * proportion
    
    // 1 bucket set = 19.22 lb BF
    const dryBfWeight = round(
      (freshDoughWeight * ingProportions.BF) - (nParts * 19.22), 2
    )       
    const bf50 = Math.floor(dryBfWeight / 50)
    const bfExtra = round(dryBfWeight % 50, 2)

    const wwWeight = round(freshDoughWeight * ingProportions.WW, 2)

    // 1 bucket set = 19.22 lb water
    const pureWaterWeight = round(
      freshDoughWeight * ingProportions.water - (nParts * 19.22), 2
    ) 
    const water25 = Math.floor(pureWaterWeight / 25)
    const waterExtra = round(pureWaterWeight % 25, 2)

    const saltWeight = round(freshDoughWeight * ingProportions.salt, 2)
    const yeastWeight = round(freshDoughWeight * ingProportions.yeast, 2)

    return ({
      mixNumber: idx + 1,
      nParts,
      components: [
        { label: "Bucket Sets",         amount: nParts },
        { label: "Old Dough",           amount: round(oldDoughTotal * proportion, 2) },
        { label: "50 lb. Bread Flour",  amount: bf50 },
        { label: "25 lb. Bucket Water", amount: water25 },
        { label: "Bread Flour",         amount: round(bfExtra, 2) },
        { label: "Whole Wheat Flour",   amount: round(wwWeight, 2) },
        { label: "Water",               amount: round(waterExtra, 2) },
        { label: "Salt",                amount: round(saltWeight, 2) },
        { label: "Yeast",               amount: round(yeastWeight, 2) },
      ]
    }) //end mixSummary
    
  })

  //  Bins & Pans
  // =============
  const calcQtyEa = (order) => order.qty * products[order.prodNick].packSize
  const B1EaTotals = mapValues(B1Orders, orderGroup => sumBy(orderGroup, calcQtyEa))

  const bagEpiQty = (B1EaTotals['Baguette'] ?? 0) + (B1EaTotals['Epi'] ?? 0)
  const oliveQty = B1EaTotals['Olive Herb'] ?? 0
  const bcwalQty = B1EaTotals ['Blue Cheese Walnut'] ?? 0

  const bins = [
    { label: "Baguette (27.7)",    amount: Math.ceil(bagEpiQty / 24) + " bins" },
    { label: "Olive",              amount:    `${round(oliveQty * 1.4, 2)} lb.` },
    { label: "-- Green Olives",    amount: `-- ${round(oliveQty * .08, 2)} lb.` },
    { label: "-- Black Olives",    amount: `-- ${round(oliveQty * .08, 2)} lb.` },
    { label: "BC Walnut",          amount:    `${round(bcwalQty * 1.4, 2)} lb.` }, 
    { label: "-- Bleu Cheese",     amount: `-- ${round(bcwalQty * .08, 2)} lb.` },
    { label: "-- Toasted Walnuts", amount: `-- ${round(bcwalQty * .08, 2)} lb.` },
  ]

  const pans = [
    { label: "Full (16 per pan)",  amount: Math.floor(bagEpiQty / 16) },
    { label: "Extra",              amount: bagEpiQty % 16 },
  ]

  //  Buckets & BucketSets
  // ======================

  // the following number will be saved in the database under the
  // baguette dough item's preBucketSets attribute.
  const nBucketSetsToMake = round(weightT2 / 82)
  const buckets = [
    { label: "Bucket Sets",   amount: nBucketSetsToMake },
    { label: "Water Buckets", amount: Math.ceil(nBucketSetsToMake / 2) }
  ]

  return {
    baguetteData,
    baguetteSummary,
    mixSummary,
    bins, 
    pans,
    buckets,
    nBucketSetsToMake,
  }

}