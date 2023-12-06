



/** 
 * While this hook uses a lot of the same data sources as the general bpbn hook,
 * the processing is unique (and extensive!), so we keep it separate.
 */

import { filter, flow, groupBy, identity, keyBy, mapValues, sortBy, sum, sumBy, uniqBy, values } from "lodash/fp"
import { useListData } from "../../../../../../data/_listData"
import { useProdOrdersByDate } from "../../../../../../data/useT0T7ProdOrders"
import { getTodayDT, isoToDT } from "../../utils"
import { useMemo } from "react"
import { round } from "lodash"

const mapValuesWithKeys = mapValues.convert({ 'cap': false })

/** 
 * @typedef {Object} BaguetteDataReturn
 * @property {Object|undefined} data
 * @property {Object} data.bakeTomorrowOrders
 * @property {Object} data.doughSummary
 * @property {Object[]} data.mixes
 * @property {Object[]} data.bins
 * @property {Object[]} data.pans
 * @property {Object[]} data.buckets
 */

/**
 * @param {Object} input
 * @param {string} [input.currentDate] - ISO Date string. Optional override for
 * simulating the current date as something other than today. Affects relative
 * date calculations.
 * @param {string} input.reportDate - Should be set to 0 or 1 days ahead of
 * 'today', or the simulated current date (though simulating may get calculated
 * incorrectly)
 * @param {boolean} input.shouldFetch 
 * @returns {BaguetteDataReturn}
 */
export const useBaguetteData = ({
  currentDate,
  reportDate,
  shouldFetch
}) => {
  const todayDT = !!currentDate ? isoToDT(currentDate) : getTodayDT()
  const reportDateDT = isoToDT(reportDate)
  const reportRelDate = reportDateDT.diff(todayDT, 'days').days

  const [t0, t1, t2, t3] = [0,1,2,3].map(daysAhead => 
    reportDateDT.plus({ days: daysAhead }).toFormat('yyyy-MM-dd')
  ) 

  const { data:T0 } = useProdOrdersByDate({ currentDate, reportDate: t0, shouldFetch })
  const { data:T1 } = useProdOrdersByDate({ currentDate, reportDate: t1, shouldFetch })
  const { data:T2 } = useProdOrdersByDate({ currentDate, reportDate: t2, shouldFetch })
  const { data:T3 } = useProdOrdersByDate({ currentDate, reportDate: t3, shouldFetch })

  const { data:DGH } = useListData({  tableName: "DoughBackup", shouldFetch })
  const { data:PRD } = useListData({  tableName: "Product", shouldFetch })

  const calculateValue = () => {
    if (!T0 || !T1 || !T2 || !T3 || !DGH || !PRD) return undefined

    const doughs = keyBy('doughName')(DGH)
    const products = keyBy('prodNick')(PRD)
    const baguetteProducts = flow(
      filter(P => P.doughNick === "Baguette"),
      sortBy('prodName'),
      uniqBy('forBake'),
      keyBy('forBake')
    )(PRD)

    // 'baguette' generally refers to the dough type in this hook.
    // 'oli' and 'bcw' are special subsets of baguette items. They're listed
    // as using 'Baguette' dough, but the add-ins mean they need to be
    // calculated differently from other baguette products (especially when it
    // comes to scrap/recycling), so we handle them separately.

    // For now, baguette products are pretty much assumed to be baked at the
    // Carlton, so we omit any filter clause that looks for assigned routes
    // departing from the Carlton.
    const _T0 = T0.filter(order => order.isStand !== false)
    const baguetteOrders = [..._T0, ...T1, ...T2, ...T3].filter(order => 
      products[order.prodNick].doughNick === "Baguette"  
    )

    // Bake Totals for relative dates, each grouped by forBake
    const { 0:B0, 1:B1, 2:B2 } = flow(
      groupBy('bakeRelDate'),
      mapValues(orderGroup => 
        groupBy(order => products[order.prodNick].forBake)(orderGroup)
      ),
    )(baguetteOrders)
    
    const calcWeight = (order) => {
      const { packSize, weight } = products[order.prodNick]
      return round(order.qty * packSize * weight, 2)
    }

    // Dough Requirement for each forBake group, on T0, T1, and T2
    const [D0, D1, D2] = [B0, B1, B2].map(BN => 
      mapValues(sumBy(calcWeight))(BN)
    )

    // for T0, grouped by forBake
    const doughPreshaped = mapValues(
      P => round(P.preshaped * P.weight, 2)
    )(baguetteProducts)

    const doughShort = mapValuesWithKeys((preshapedWeight, forBake) => {
      const difference = round((D0[forBake] ?? 0) - preshapedWeight, 2)
      return Math.max(difference, 0)
    })(doughPreshaped)
    
    // An oddball rule: Being short oli or bcw adds to our dough needs,
    // but having extra on hand does not mean we can recycle back into
    // baguette dough, so they get omitted from the surplus tally.
    const doughSurplus = mapValuesWithKeys((preshapedWeight, forBake) => {
      if (['Olive Herb', 'Blue Cheese Walnut'].includes(forBake)) return 0
      const difference = round(preshapedWeight - (D0[forBake] ?? 0), 2)
      return Math.max(difference, 0)
    })(doughPreshaped)
      
    // console.log('bake reqs', B0, B1, B2)
    // console.log('dough reqs', D0, D1, D2)
    // console.log('preshaped', doughPreshaped)

    // console.log("short", doughShort)
    // console.log("surplus", doughSurplus)


    // ****** calculate dough needed for T1 ******
    
    const D1Total = sum(Object.values(D1))
    const T0ShortTotal = round(sum(Object.values(doughShort)), 1)
    const bufferWeight = doughs['Baguette'].buffer ?? 0
    
    const requiredTotal = round(D1Total + bufferWeight + T0ShortTotal, 1)
    
    // const T0ScrapTotal = round(sum(Object.values(doughSurplus)), 1)
    // const scrapToUse = Math.min(T0ScrapTotal, D1Total * 0.2)
    const scrapToUse = Math.min(doughs['Baguette'].oldDough, D1Total * 2)

    // const mixTotal = requiredTotal - scrapToUse
    // const nMixes = Math.ceil(mixTotal / 210)
    const totalBucketSets = reportRelDate === 0
      ? doughs['Baguette'].bucketSets
      : doughs['Baguette'].preBucketSets
      // : reportRelDate === 1
      //   ? doughs['Baguette'].preBucketSets
      //   : 0 // hook shouldn't be executed for days other than today/tomorrow
    
    const mixes = getMixes({ 
      requiredTotal,
      scrapToUse,
      totalBucketSets, 
    })

    const [bins, pans] = getBinsAndPans({ B1, products })

    const D2Total = sum(Object.values(D2))

    // the following number will be saved in the database under the
    // baguette dough item's preBucketSets attribute.
    const nBucketSets = round(D2Total / 82)
    const buckets = [
      { label: "Bucket Sets",   amount: nBucketSets },
      { label: "Water Buckets", amount: Math.ceil(nBucketSets / 2) }
    ]

    const doughSummary = {
      T1Needed: round(D1Total, 2),
      buffer: bufferWeight,
      T0Short: T0ShortTotal,
      stickerTotal: requiredTotal,
      //T0Scrap: T0ScrapTotal,
    }

    return {
      doughSummary,
      bakeTomorrowOrders: B1,
      mixes,
      bins,
      pans,
      buckets,
      nBucketSets,
    }

  }


  return { data: useMemo(calculateValue, [T0, T1, T2, T3, PRD, DGH]) }

}


// ******************************
// * CALCULATE MIXES BY FORMULA *
// ******************************

// An elaborate setup, but this makes the setup visual and easy to reconfigure. 
// The goal is to make each day's dough as consistent across mixes as possible. 
// This means having the same proportions of fresh dough, preferments, and old 
// dough. The mix parts table below tells us how to split up available 
// bucketSets (which contain preferments), and from there we scale out the
// remaining ingredients proportionally.


/**
 * Returns the number of bucket sets in each mix. Mixes will be proportional
 * to the number of bucket sets.
 * 
 * row# = nMixes - 1, col# = nBucketSets - 1
 */
const mixPartsTable = [
// 1 set      2 sets     3 sets     4 sets     5 sets
  [[1, 0, 0], [2, 0, 0], [3, 0, 0], [4, 0, 0], [5, 0, 0]],  // 1 mix
  [[1, 0, 0], [1, 1, 0], [2, 1, 0], [2, 2, 0], [3, 2, 0]],  // 2 mixes
  [[1, 0, 0], [1, 1, 0], [1, 1, 1], [2, 1, 1], [2, 2, 1]]   // 3 mixes
]

/** 
 * Requires 1 <= nMixes and 1 <= nBucketSets. 
 * Should we also require nBucketSets >= nMixes? A mix must have preferments...
 * 
 * Divide into equal parts in all but a few cases:
 * 
 * - 2 mixes, 3 bucket sets -- mix 1 is 2x size of mix 2
 * - 3 mixes, 4 bucket sets -- mix 2 is 2x size of mixes 2 and 3
 * - 3 mixes, 5 bucket sets -- mix 1 and 2 are 2x size of mix 3.
 * 
 * Returns PARTS, not percentages. divide by total number of parts
 * to get percentage.
 */
  const getMixParts = (nMixes, nBucketSets) => {
    if (nMixes < 1 || nBucketSets < 1) {
      console.log(`InputError: nMixes=${nMixes}, nBucketSets=${nBucketSets}`)
    }
  
    let mixParts = nBucketSets <= 5 
      ? mixPartsTable[Math.min(nMixes, 3) - 1][nBucketSets - 1]
      : [0, 1, 2].map(idx => idx <= nMixes ? 1 : 0)
  
    return mixParts
  }

  /**Hard coded values. TODO: change to database values? */
const ingProportions = {
  BF: 0.5730,
  WW: 0.038,
  water: 0.374,
  salt: 0.013,
  yeast: 0.002,
}


/**
 * The baguette mix is scaled exactly to spec, but depending on the overall
 * size, we split the mix into discrete parts (1 to 3 parts), where each
 * part is a certain proportion of the overall mix.
 */
const getMixes = ({ 
  requiredTotal,
  scrapToUse,
  totalBucketSets, 
}) => {

  const freshDoughTotalWeight = requiredTotal - scrapToUse
  const nMixes = Math.ceil(freshDoughTotalWeight / 210)

  if (nMixes > 3) {
    console.warn(`${nMixes} mixes is not fully supported`)
  }
  if (nMixes > totalBucketSets) {
    console.warn(`Cannot split ${totalBucketSets} bucket sets ${nMixes} ways`)
  }

  const mixParts = getMixParts(nMixes, totalBucketSets)
  const totalParts = sum(mixParts)
  
  const mixSummary = mixParts.map((nParts, idx) => {
    const proportion = nParts/totalParts
    
    const nSets = round(totalBucketSets * proportion)

    const freshDoughWeight = freshDoughTotalWeight * proportion
    
    // 1 bucket set = 19.22 lb BF
    const dryBfWeight = round(
      (freshDoughWeight * ingProportions.BF) - (nSets * 19.22), 2
    )       
    const bf50 = Math.floor(dryBfWeight / 50)
    const bfExtra = round(dryBfWeight % 50, 2)

    const wwWeight = round(freshDoughWeight * ingProportions.WW, 2)

    // 1 bucket set = 19.22 lb water
    const pureWaterWeight = round(
      freshDoughWeight * ingProportions.water - (nSets * 19.22), 2
    ) 
    const water25 = Math.floor(pureWaterWeight / 25)
    const waterExtra = round(pureWaterWeight % 25, 2)

    const saltWeight = round(freshDoughWeight * ingProportions.salt, 2)
    const yeastWeight = round(freshDoughWeight * ingProportions.yeast, 2)

    return ({
      mixNumber: idx + 1,
      nParts,
      components: [
        { label: "Bucket Sets", amount: nSets },
        { label: "Old Dough", amount: round(scrapToUse * proportion, 2).toFixed(2) },
        { label: "50 lb. Bread Flour", amount: bf50 },
        { label: "25 lb. Bucket Water", amount: water25 },
        { label: "Bread Flour", amount: bfExtra.toFixed(2) },
        { label: "Whole Wheat Flour", amount: wwWeight.toFixed(2) },
        { label: "Water", amount: waterExtra.toFixed(2) },
        { label: "Salt", amount: saltWeight.toFixed(2) },
        { label: "Yeast", amount: yeastWeight.toFixed(2) },
      ]
    }) //end mixSummary
    
  })
  
  return mixSummary.filter(mix => mix.nParts > 0)

}

const getBinsAndPans = ({ B1, products }) => {

  const calcQtyEa = (order) => order.qty * products[order.prodNick].packSize
  const B1EaTotals = mapValues(sumBy(calcQtyEa))(B1)

  const bagEpiQty = (B1EaTotals['Baguette'] ?? 0) + (B1EaTotals['Epi'] ?? 0)
  const oliveQty = B1EaTotals['Olive Herb'] ?? 0
  const bcwalQty = B1EaTotals ['Blue Cheese Walnut'] ?? 0

  const bins = [
    { 
      label:"Baguette (27.7)", 
      amount: Math.ceil(bagEpiQty / 24) + " bins" 
    },
    { 
      label:"Olive",
      amount: round(oliveQty * 1.4, 2).toFixed(2) + " lb."
    },
    { 
      label:"-- Green Olives", 
      amount: "-- " + round(oliveQty * .08, 2).toFixed(2) + " lb." 
    },
    { 
      label:"-- Black Olives", 
      amount: "-- " + round(oliveQty * .08, 2).toFixed(2) + " lb."  
    },
    { 
      label:"BC Walnut", 
      amount: round(bcwalQty * 1.4, 2).toFixed(2) + " lb." 
    }, 
    { 
      label:"-- Bleu Cheese", 
      amount: "-- " + round(bcwalQty * .08, 2).toFixed(2) + " lb." 
    },
    { 
      label:"-- Toasted Walnuts", 
      amount: "-- " + round(bcwalQty * .08, 2).toFixed(2) + " lb." 
    },
  ]

  const pans = [
    { label: "Full (16 per pan)", amount: Math.floor(bagEpiQty / 16) },
    { label: "Extra",             amount: bagEpiQty % 16             },
  ]

  return [bins, pans]
}