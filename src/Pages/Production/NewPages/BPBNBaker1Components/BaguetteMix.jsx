import React from "react"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { DoughInputs } from "./BaguetteMixComponents/DoughInputs"

import { useBPBNbaguetteDoughSummary } from "../_hooks/BPBNhooks"

import { DateTime } from "luxon"


const TODAY = DateTime.now().setZone('America/Los_Angeles').startOf('day')

export const BaguetteMix = ({ dateDT, displayDate }) => {
  const bagSummary = useBPBNbaguetteDoughSummary({ dateDT })

  return (
    <div style={{marginTop: "2rem"}}>
      <h2>{`Baguette Mix ${displayDate}`}</h2>
      <div 
        style={{
          width: "100%", 
          padding: "1rem",
          backgroundColor: "hsl(37, 100%, 80%)",
          border: "solid 1px hsl(37, 67%, 60%)",
          borderRadius: "3px",
        }}
      >
        {!bagSummary && <div>Loading...</div>}
        {bagSummary && <>
          <h2 style={{margin: ".5rem", paddingBottom: "1rem"}}>
            {`TOTAL: ${bagSummary.stickerTotal}`}
          </h2>
          <div>{`Needed: ${bagSummary.B1neededWeight} lb.`}</div>
          <div>{`+ Buffer: ${bagSummary.dough.buffer}`}</div>
          <div>{`+ Short estimation: ${bagSummary.B0shortWeight}`}</div>
          <div>{`(Scrap estimation: ${bagSummary.B0scrapWeight})`}</div>
        </>}
        <DoughInputs />
      </div>

      {bagSummary && 
        bagSummary.mixes.filter(item => item.nParts > 0).map((mix, idx) => {
          return (
            <div key={`mix-formula-${idx}`}>
              <h2>{`Baguette Mix #${mix.mixNumber}`}</h2>
              <DataTable
                value={mix.components}
                size="small"
              >
                <Column header='Ingredient' field="label" />
                <Column header='Amount' field="amount" />
              </DataTable>
            </div>

          )

        }
      )}

      <h2>Bins</h2>
      <DataTable value={bagSummary?.bins ?? []} className="p-datatable-sm">
        <Column field="label" header="Product"></Column>
        <Column field="amount" header="Amount"></Column>
      </DataTable>

      <h2>Pocket Pans</h2>
      <DataTable value={bagSummary?.pans ?? []} className="p-datatable-sm">
        <Column field="label" header="Pan"></Column>
        <Column field="amount" header="Amount"></Column>
      </DataTable>

      <h2>Bucket Sets</h2>
      <DataTable value={bagSummary?.buckets ?? []} className="p-datatable-sm">
        <Column field="label" header="Bucket Sets"></Column>
        <Column field="amount" header="Amount"></Column>
      </DataTable>

      {/* <pre>{JSON.stringify(bagSummary, null, 2)}</pre> */}
    </div>
  )
}

// Obsolete code: for reference only *******************************************

// import React from "react";
// import { DateTime } from "luxon";
// import { useOrderReportByDate } from "../../../../data/productionData";
// import { groupBy } from "../../../../functions/groupBy"
// import { DataTable } from "primereact/datatable"
// import { Column } from "primereact/column";
// import { sumBy } from "lodash";
// import { useLogisticsDimensionData } from "../../../../data/productionData";
// import { InputText } from "primereact/inputtext";

// // ***CONSTANTS***
// const REPORT_DATE = DateTime.now().setZone('America/Los_Angeles').startOf('day')

// // ***FILTERS***
// const isCarltonRustic = (product) => {
//   const { bakedWhere, packGroup } = product
//   return bakedWhere.includes("Carlton") && !bakedWhere.includes("Prado") 
//     && (["rustic breads", "retail"].includes(packGroup))
// }

// /** Assumes the route is associated with an order 
//  * for a product baked at the Carlton. Taken from 
//  * './WhatToMake.js'
//  */
// const canBakeAndDeliverCarltonProductSameDay = (route) => {
//   const { routeStart, RouteDepart, routeNick } = route

//   return (
//     (RouteDepart === "Carlton" || ["Pick up Carlton", "Pick up SLO"].includes(routeNick))
//     || (RouteDepart === "Prado" && routeStart >= 8)
//   )
// }

// // Baguette Mixes
// //
// // Calculate demand by counting up orders for T+1, T+2,
// //   ...where product.doughNick === "Baguette"
// //   ...group by product.forBake
// //   ...sum each group over weight
// // 
// // We want total weight for Olive and BC Walnut specifically.
// // Otherwise we want the total dough weight (including oli & bcw)
// //
// // Adjust total (needed) dough by subtracting old dough, adding
// // buffer amount.
// //
// // Calculate dough component weights by multiplying adjusted
// // total weight.
// //
// // Split dough components into the user-supplied number of
// // bucket mixes (not a straightforward calculation)

// // Naming convention:
// // T0, T1, T2, ... means today, tomorrow, the day after tomorrow...
// //  Typically describes things required for a given day's delivery.
// //
// // B0, B1, ... refers specifically to today's bake, tomorrow's bake, ...
// //  Describes things that are required for that day's bake.
// //  Often corresponds to orders for multiple delivery dates.
// //
// // Variable names using 'baguette' refer to any product using
// // baguette *dough*.

// export const BaguetteMix = ({ reportDate }) => {
//   // Fetch Orders
//   const { routedOrderData:T0prodOrders } = useOrderReportByDate({
//     delivDateJS: REPORT_DATE.plus({ days: 0 }).toJSDate(), 
//     includeHolding: true, 
//     shouldFetch: true 
//   })
//   const { routedOrderData:T1prodOrders } = useOrderReportByDate({
//     delivDateJS: REPORT_DATE.plus({ days: 1 }).toJSDate(), 
//     includeHolding: true, 
//     shouldFetch: true 
//   })
//   const { routedOrderData:T2prodOrders } = useOrderReportByDate({
//     delivDateJS: REPORT_DATE.plus({ days: 2 }).toJSDate(), 
//     includeHolding: true, 
//     shouldFetch: true 
//   }) 

//   // let doughComponents = this.returnDoughComponents(database)
//   const { data:dimensionData } = useLogisticsDimensionData(true)

//   if (!T0prodOrders || !T1prodOrders || !T2prodOrders || !dimensionData) {
//     return <div>Loading...</div>
//   }

//   const { doughs, doughComponents, products } = dimensionData

//   // ********************************************
//   // * CALCULATE DOUGH REQUIREMENTS FROM ORDERS *
//   // ********************************************

//   // "Baguette orders to be baked today"
//   const B0baguetteOrders = T0prodOrders.filter(order => {
//     const { product, route } = order
//     return order.isStand !== false && product.doughNick === "Baguette"
//       && isCarltonRustic(product)
//       && canBakeAndDeliverCarltonProductSameDay(route)

//   }).concat(T1prodOrders.filter(order => {
//     const { product, route } = order
//     return order.isStand !== false && product.doughNick === "Baguette"
//       && isCarltonRustic(product)
//       && !canBakeAndDeliverCarltonProductSameDay(route)

//   }))

//   // "Baguette orders to be baked tomorrow"
//   const B1baguetteOrders = T1prodOrders?.filter(order => {
//     const { product, route } = order
//     return product.doughNick === "Baguette"
//       && isCarltonRustic(product)
//       && canBakeAndDeliverCarltonProductSameDay(route)

//   }).concat(T2prodOrders.filter(order => {
//     const { product, route } = order
//     return product.doughNick === "Baguette"
//       && isCarltonRustic(product)
//       && !canBakeAndDeliverCarltonProductSameDay(route)

//   }))

//   // ***optional feature***
//   // Not in original calculation, but we can use the following to show the
//   // breakdown of dough needs by forBake group (which indicates the type of
//   // shaped item)
//   // const B1bagOrdersByForBake = Object.values(
//   //   groupBy(B1baguetteOrders, ['product.forBake'])
//   // )
//   // const B1totalReqByForBake = B1bagOrdersByForBake.map(group => {
//   //   const total = sumBy(group, order => order.qty)
//   //   return ([group[0].product.forBake, total])
//   // })
//   // **********************
  
//   // Product's preshaped values get updated @ ~3AM to represent 
//   // totals preshaped for B0, aka T0's bake. Triggered by
//   // BPBN baker 2's (?) printing report.
//   //
//   // Calculations for dough 'short' requires (reuses) "What to Bake" totals.
//   const productsByForBake = groupBy( 
//     sortBy( products, ['prodName']) , 
//     ['forBake']
//   )


//   console.log(productsByForBake)

//   const B0bagOrdersByForBake = Object.values(groupBy(B0baguetteOrders, ['product.forBake']))
//   const B0prepSummary = B0bagOrdersByForBake.map(group => {
//     const { product: { forBake, weight, packSize } } = group[0]
    
//     const prodWithPreshapeQty = productsByForBake[forBake].find(prod => prod.preshaped !== null)
//     const qtyPreshaped = prodWithPreshapeQty ? prodWithPreshapeQty.preshaped : 0
    
//     const totalNeeded = sumBy(group, order => order.qty)

//     return ({
//       forBake: forBake,
//       weight: weight,
//       packSize: packSize,
//       qtyNeeded: totalNeeded,
//       qtyPreshaped: qtyPreshaped,
//       surplusQty: Math.max(qtyPreshaped - totalNeeded, 0),
//       shortQty: Math.max(totalNeeded - qtyPreshaped, 0)
//     })
//   })

//   // *** calculating short dough ***
//   // - BCW and Olive can't be prepped on B0, so shouldn't add to the short total,
//   //   even if there is a defecit of preshaped
//   //
//   // - We assume items with different forBake names do not have the same type of
//   //   preshape and therefore are not interchangeable (ie a surplus for one cannot
//   //   be used to make up for a defecit in the other).
//   const doughShort = sumBy(
//     B0prepSummary.filter(item => 
//       !['Olive Herb', 'Blue Cheese Walnut'].includes(item.forBake)
//     ),
//     item => item.shortQty * item.weight * item.packSize
//   )

//   // *** new: calculating surplus dough ***
//   // Seems like surplus/unused preshaped dough could be mixed though in the next
//   // batch, affecting the required mix amount, but I don't see that calculation
//   // in the old code...
//   // We should also assume bcw and oli dough is not generally reusable. Should we
//   // Track any extra preshaped as a separate total? Seems like we should classify
//   // as a different dough type once the 'stuff' is mixed into the dough.
//   const doughExtra = sumBy(
//     B0prepSummary.filter(item => 
//       !['Olive Herb', 'Blue Cheese Walnut'].includes(item.forBake)
//     ),
//     item => item.surplusQty * item.weight * item.packSize
//   )

  
//   // ***Calculate dough needed for B1***
//   // This is the 'main' dough requirement for today's mix.
//   //
//   // May also want to count by forBake group before getting
//   // the total across all baguette dough products.
//   const B1baguetteOrdersByForBake = Object.values(groupBy(B1baguetteOrders, ['product.forBake']))
//   const B1baguetteTotalsByForBake = B1baguetteOrdersByForBake.map(forBakeGroup => {
//     const totalQty = sumBy(forBakeGroup, order => order.qty * order.product.packSize)
//     const totalWeight = Number((totalQty * forBakeGroup[0].product.weight).toFixed(2))
    
//     return ({
//       forBake: forBakeGroup[0].product.forBake,
//       totalQty,
//       totalWeight
//     })
//   })

//   const baguetteDough = doughs["Baguette"]
//   const B1doughNeeded = sumBy(B1baguetteTotalsByForBake, item => item.totalWeight)
//   const stickerTotal = B1doughNeeded + baguetteDough.buffer + doughShort

//   console.log("B1 requirement by forBake", B1baguetteTotalsByForBake)
//   console.log("B1 dough needed (lbs):", B1doughNeeded)

//   console.log("B0 summary:", B0prepSummary)
//   console.log("B0 Short Preshaped weight:", doughShort)
//   console.log("B0 Surplus Preshaped weight:", doughExtra)
  
//   // ******************************
//   // * CALCULATE MIXES BY FORMULA *
//   // ******************************

//   // FUTURE chage  REPORT_DATE.toMillis() to the input date
//   // use 'preBucketSets' if the report date is for T+1
//   const nBucketSets = REPORT_DATE.toMillis() === DateTime.now().setZone('America/Los_Angeles').startOf('day').plus({ days: 1 }).toMillis()
//     ? baguetteDough.preBucketSets
//     : baguetteDough.bucketSets

//   const nMixes = Math.ceil(stickerTotal / 210);

//   // const freshTotal = stickerTotal - baguetteDough.oldDough // <<< May need to change old dough calculation
//   const ingProportions = {
//     BF: 0.5730,
//     WW: 0.038,
//     water: 0.374,
//     salt: 0.013,
//     yeast: 0.002,
//   }

//   // Here we generate arrays of length 3 whose values 
//   // apply to mix #1, mix #2, & mix #3.
//   const mixParts = getMixParts(nMixes, nBucketSets) // returns array of length 3
//   const totalParts = mixParts.reduce((a, b) => a + b, 0)
  
  
//   // const maxOldDoughProportions = [0.2, 1, 1]

//   const mixSummary = mixParts.map((nParts, idx) => {
//     const proportion = nParts/totalParts
//     const mixNumber = idx + 1
//     const currentMixWeight = proportion * stickerTotal // after all the wacky calculations with old dough, buckets, we want the total weight to be this for the current mix.

//     const nSets = Math.round(proportion * nMixes)

//     const oldDoughForFirstMix = Math.min(baguetteDough.oldDough * proportion, currentMixWeight * .2)

//     // if we push some of the old dough off of the first mix, we want to distribute it 
//     // among the remaining mixes according to the number of parts.
//     // Ex: in a [2, 1, 1] scenario any spillover old dough from the first mix would be equally distributed between mixes 2 and 3.
//     // Ex: in a [2, 2, 1] scenario any spillover would be distributed 2/3 for mix 2 and 1/3 for mix 3.
//     const old = idx === 0 
//       ? oldDoughForFirstMix 
//       : (baguetteDough.oldDough - oldDoughForFirstMix) * nParts / (mixParts[1] + mixParts[2])

//     const freshDoughWeight = currentMixWeight - old

//     const dryBfWeight = (freshDoughWeight * ingProportions.BF) - (nSets * 19.22) // 1 bucket set = 19.22 lb BF
//     const bf50 = Math.floor(dryBfWeight / 50)
//     const bfExtra = dryBfWeight % 50
    
//     const wwWeight = freshDoughWeight * ingProportions.WW

//     const pureWaterWeight = freshDoughWeight * ingProportions.water - (nSets * 19.22) // 1 bucket set = 19.22 lb water
//     const water25 = Math.floor(pureWaterWeight / 25)
//     const waterExtra = pureWaterWeight % 25

//     const saltWeight = freshDoughWeight * ingProportions.salt
//     const yeastWeight = freshDoughWeight * ingProportions.yeast
    
//     return ({
//       mixNumber: idx + 1,
//       nParts: nParts,
//       components: [
//         { title: "Bucket Sets", amount: nSets },
//         { title: "Old Dough", amount: Number(old.toFixed(2)) },
//         { title: "50 lb. Bread Flour", amount: Number(bf50.toFixed(2)) },
//         { title: "25 lb. Bucket Water", amount: Number(water25.toFixed(2)) },
//         { title: "Bread Flour", amount: Number(bfExtra.toFixed(2)) },
//         { title: "Whole Wheat Flour", amount: Number(wwWeight.toFixed(2)) },
//         { title: "Water", amount: Number(waterExtra.toFixed(2)) },
//         { title: "Salt", amount: Number(saltWeight.toFixed(2)) },
//         { title: "Yeast", amount: Number(yeastWeight.toFixed(2)) },
//       ]
//     }) 

//   }) // end mixSummary

//   // ******************
//   // * CALCULATE BINS *
//   // ******************

//   // *************************
//   // * CALCULATE POCKET PANS *
//   // *************************

//   // *************************
//   // * CALCULATE BUCKET SETS *
//   // *************************

//   return(<>
//     <h2>{`Baguette Mix ${reportDate.toLocaleString()}`}</h2>

//     <div 
//       style={{
//         width: "100%", 
//         padding: "1rem",
//         backgroundColor: "hsl(37, 100%, 80%)",
//         border: "solid 1px hsl(37, 67%, 60%)",
//         borderRadius: "3px",
//       }}
//     >
//       <h2 style={{margin: ".5rem", paddingBottom: "1rem"}}>
//         {`Baguette (need ${B1doughNeeded} lb) TOTAL: ${stickerTotal} SHORT: ${doughShort}`}
//       </h2>

//       <div style={{width: "15rem", display: "flex", justifyContent: "space-between", alignItems: "center", margin: ".5rem"}}>
//         <span>Old Dough:</span> 
//         <InputText style={{width: "3rem"}} value={baguetteDough.oldDough} />
//       </div>
//       <div style={{width: "15rem", display: "flex", justifyContent: "space-between", alignItems: "center", margin: ".5rem"}}>
//         <span>Buffer Dough:</span> <InputText style={{width: "3rem"}} value={baguetteDough.buffer} />
//       </div>
//       <div style={{width: "15rem", display: "flex", justifyContent: "space-between", alignItems: "center", margin: ".5rem"}}>
//         <span>Actual Bucket Sets:</span> 
//         <InputText style={{width: "3rem"}} value={baguetteDough.preBucketSets} />
//       </div>
//     </div>

//     {mixSummary.filter(item => item.nParts > 0).map(mix => {
      
//       return(
//         <>
//           <h2>{`Baguette Mix #${mix.mixNumber}`}</h2>
//           <DataTable
//             value={mix.components}
//             size="small"
//             tableStyle={{maxWidth: "20rem"}}
//           >
//             <Column header='Ingredient' field="title" />
//             <Column header='Amount' field="amount" />
//           </DataTable>
//         </>
//       )
//     })}


//     <pre>{JSON.stringify(baguetteDough, null, 2)}</pre>
//   </>)
// }


// /** Requires 1 <= nMixes and 1 <= nBucketSets. Should we also require nBucketSets >= nMixes?
//  * Can't have a mix without preferments...
//  * 
//  * In less cryptic terms, we want to split the total dough
//  * into mixes of equal size in all but a handful of special cases:
//  * 
//  * - 2 mixes, 3 bucket sets -- mix 1 is 2x size of mix 2
//  * - 3 mixes, 4 bucket sets -- mix 2 is 2x size of mixes 2 and 3
//  * - 3 mixes, 5 bucket sets -- mix 1 and 2 are 2x size of mix 3.
//  * 
//  * Returns PARTS, not percentages. divide by total number of parts
//  * to get percentage.
//  */
// const getMixParts = (nMixes, nBucketSets) => {
//   if (nMixes < 1 || nBucketSets < 1) {
//     console.log(`InputError: nMixes=${nMixes}, nBucketSets=${nBucketSets}`)
//   }

//   let mixParts = nBucketSets <= 5 
//     ? mixPartsTable[Math.max(nMixes, 3) - 1][nBucketSets - 1]
//     : [null, null, null].map((item, idx) => nMixes > idx ? 0 : 1)

//   return mixParts
// }


// /**Returns relative size of each mix. Not normalized.
//  * 
//  * nMixes = rows, nBucketSets = columns
//  */
// const mixPartsTable = [
//   [[1, 0, 0], [1, 0, 0] ,[1, 0, 0], [1, 0, 0] ,[1, 0, 0]],
//   [[1, 1, 0], [1, 1, 0], [2, 1, 0], [1, 1, 0] ,[1, 1, 0]],
//   [[1, 1, 1], [1, 1, 1], [1, 1, 1], [2, 1, 1], [2, 2, 1]]
// ]







//   // let baguetteDough
//   // if (!!dimensionData) {
//   //   const { doughs, doughComponents, products } = dimensionData
//   //   console.log("doughs", doughs)

//   //   // since we're looking at only baguette dough, we know isBakeReady
//   //   // will always be true since it's a dough attribute. however, we should
//   //   // also catch orders for T+2 where the product cannot be baked and
//   //   // delivered the same day.

//   //   // **OLD & BUSTED***
//   //   // Only looks at T1 orders since isBakeReady is true for Baguette dough,
//   //   // so no conditional check needed. Also fails to look up relevant T+2
//   //   // orders.
//   //   //
//   //   // const relevantOrders = doughs["Baguette"].isBakeReady
//   //   //   ? T1prodOrders.filter(order => order.product.doughNick === "Baguette")
//   //   //   : T2prodOrders.filter(order => order.product.doughNick === "Baguette")

    
//   //   //   return order.qty * order.product.weight * order.product.packSize
//   //   // }).toFixed(2))

//   //   // "baguette" refers to doughNick, not the specific product
//   //   const T1baguetteOrdersToCount = T1prodOrders.filter(order => {
//   //     const { product, route } = order

//   //     return product.doughNick === "Baguette"
//   //       && isCarltonRustic(product)
//   //       && canBakeAndDeliverCarltonProductSameDay(route)
//   //   })
//   //   const T2baguetteOrdersToCount = T2prodOrders.filter(order => {
//   //     const { product, route } = order

//   //     return product.doughNick === "Baguette"
//   //       && isCarltonRustic(product)
//   //       && !canBakeAndDeliverCarltonProductSameDay(route)
//   //   }) 
//   //   const baguetteOrdersToCount = T1baguetteOrdersToCount.concat(
//   //     T2baguetteOrdersToCount
//   //   )




//   //   // let Baker1Dough = this.returnDoughs(baguette, database, loc, tomorrow, twoDay)
//   //   // const needed = Number(sumBy(relevantOrders, order => {
//   //   const needed = sumBy(baguetteOrdersToCount, order => {
//   //     return order.qty * order.product.weight * order.product.packSize
//   //   })    

//   //   // ***OLD & BUSTED***
//   //   //
//   //   // example logged data:
//   //   //   needed: 258.94; preshaped: 2995.28
//   //   //
//   //   // const preshaped = sumBy(relevantOrders, order => {
//   //   //   const { product: { preshaped, weight, packSize } } = order
//   //   //   return Number(preshaped) * weight * packSize
//   //   // }).toFixed(2)

//   //   // ***NEW HOTNESS***
//   //   //
//   //   // example logged data:
//   //   //   needed 258.94; preshaped: 121.28
//   //   //
//   //   const baguetteProducts = Object.values(products).filter(prod => prod.doughNick === "Baguette")
//   //   const forBakeGroups = Object.values(groupBy(baguetteProducts, ['forBake']))
//   //   const preshaped = Number(sumBy(forBakeGroups, group => {
//   //     const { preshaped, weight, packSize } = group[0]
//   //     return (preshaped * weight * packSize)
//   //   }).toFixed(2))

//   //   const short = Math.max(needed - preshaped, 0)

//   //   baguetteDough = { 
//   //     ...doughs["Baguette"], 
//   //     needed,
//   //     preshaped,
//   //     short,
//   //     oldDough: 0,
//   //     buffer: 0,
//   //     batchSize: 0,
//   //     bucketSets: 0,
//   //   }

//   // } // end if

//   // // let bagAndEpiCount = this.returnbagAndEpiCount(tomorrow, database, loc);                  < need
//   // // let oliveCount = this.returnoliveCount(tomorrow, database, loc);                          < need
//   // // let bcCount = this.returnbcCount(tomorrow, database, loc);                                < need

//   // const prodsToCount = T1prodOrders?.filter(order => {
//   //   let { product } = order
//   //   return isCarltonRustic(product) && order.product.doughNick === "Baguette"
//   // }) ?? []

//   // const prodsToCountByForBake = Object.values(groupBy(prodsToCount, ['product.forBake']))
//   // console.log(prodsToCountByForBake)
//   // const forBakeTotals = Object.fromEntries(
//   //   prodsToCountByForBake.map(group => {
//   //     return ([group[0].product.forBake, { total: sumBy(group, order => order.qty) }])
//   //   })
//   // )

//   //   // may require more than just the total qty -- check how the totals are used
//   //   // before deciding to add 'short' and 'needEarly' amounts.

//   // console.log(forBakeTotals)

//   // // let bagDoughTwoDays = this.returnBagDoughTwoDays(twoDay, database, loc)
//   //   // get total weight from T+2 prod orders with doughNick === "Baguette"
//   //   // && 'isCarltonRustic'

//   // const T2baguetteOrders = T2prodOrders?.filter(order => {
//   //   const { product } = order
//   //   return product.doughNick === "Baguette" && isCarltonRustic(product)
//   // }) ?? []

//   // const T2bagDoughNeeded = sumBy(T2baguetteOrders, order => order.qty * order.product.weight * order.product.packSize)

//   // console.log(baguetteDough)







// // setDoughs(doughData.Baker1Dough);
// // setDoughComponents(doughData.Baker1DoughComponents);
// // setBagAndEpiCount(doughData.bagAndEpiCount);
// // setOliveCount(doughData.oliveCount);
// // setBcCount(doughData.bcCount);
// // setBagDoughTwoDays(doughData.bagDoughTwoDays);
// // setIsLoading(false)

// // baker1Dough: 

// // make a dough object for baguette
// // uses only dough name and isBakeReady attributes
// // will hold other values to track as we calculate on the front end
//   // doughName: dgh,
//   // isBakeReady:
//   //   doughs[doughs.findIndex((dg) => dg.doughName === dgh)].isBakeReady,
//   // oldDough: 0,
//   // buffer: 0,
//   // needed: 0,
//   // batchSize: 0,
//   // short: 0,
//   // bucketSets: 0,





// //*******************

// // Just get dough object with a joined 'doughComponents' attribute -- call it component
// // we can add calculated values as needed

// // 'dough needed' is a sum over qty * weight * packSize,
// // summed over T1ProdOrders filtered to products of the given dough type if isBakeReady === true,
// // or summed over T2ProdOrders if bakeReady === false

// // 'preshaped' is 


// // getPreshapedDoughAmt = (doughName, orders) => {
// //   let qtyAccToday = 0;
// //   let qtyArray = orders
// //     .filter((ord) => ord.doughType === doughName)
// //     .map((ord) => Number(ord.preshaped) * ord.weight * ord.packSize);
// //   if (qtyArray.length > 0) {
// //     qtyAccToday = qtyArray.reduce(addUp);
// //   }
// //   return qtyAccToday;
// // };




// // **************************************************
// // in BPBNBaker1Dough

// // let doughData = compose.returnDoughBreakDown(database, "Carlton",deliv);

// // setDoughs(doughData.Baker1Dough);
// // setDoughComponents(doughData.Baker1DoughComponents);
// // setBagAndEpiCount(doughData.bagAndEpiCount);
// // setOliveCount(doughData.oliveCount);
// // setBcCount(doughData.bcCount);
// // setBagDoughTwoDays(doughData.bagDoughTwoDays);
// // setIsLoading(false)

//   // *****************************************************
//   // in returnDoughBreakDown

//   // let doughs = this.returnDoughs(bag, database, loc, tomorrow, twoDay);                     < Not needed
//   // let Baker1Pockets = this.returnBaker1Pockets(database, loc, tomorrow);                    < Not needed
//   // let pockets = this.returnPockets(database, loc,today, tomorrow,twoDay);                   < Not needed

//   // let doughComponents = this.returnDoughComponents(database);                               < need; same as baker1DoughComponents
//   // let Baker1Dough = this.returnDoughs(baguette, database, loc, tomorrow, twoDay);           < need
//   // let bagAndEpiCount = this.returnbagAndEpiCount(tomorrow, database, loc);                  < need
//   // let oliveCount = this.returnoliveCount(tomorrow, database, loc);                          < need
//   // let bcCount = this.returnbcCount(tomorrow, database, loc);                                < need
//   // let bagDoughTwoDays = this.returnBagDoughTwoDays(twoDay, database, loc);                  < need

//     // ***************
//     // doughComponents

//     // - Literally just fetch the doughComponents table. In this special case we just
//     //    need baguette dough, but fetching everything is fine

//     // ***********
//     // Baker1Dough via returnDoughs function
//     //
//     // iterates over dough types (though we're just interested in baguette)
//     //
//     // for each dough type, get the dough object and append 
//     // the attributes 'needed', 'preshaped', and 'short'.
//     // filter ordrers to ord.mixedWhere === loc && ord.doughName === "Baguette";
//     // 
//     // if the dough.isBakeReady === true, we calculate needed and preshaped from T+1 production orders,
//     // otherwise we calulate from T+2 production orders
//     //
//     // to calculate needed, filter orders to doughNick ('Baguette') and sum over each order's
//     // qty * product.weight * product.packSize
//     //
//     // to calculate preshaped, filter orders to doughNick and sum over 
//     // product.preshaped * product.weight * product.packSize     <<< not sure this is a meaningful calculation. preshaped is a total for the product, not split up across orders...  
//     //
//     // short = needed - preshaped (or just report as 0 if the difference is negative)
//     //
//     // 




// // // From composeDough.js, starting at line 241
// // // used in BPBNBaker1Dough.js

// // getDoughAmt = (doughName, orders) => {

// //   let qtyAccToday = 0;
// //   let qtyArray = orders
// //     .filter((ord) => ord.doughType === doughName)
// //     .map((ord) => ord.qty * ord.weight * ord.packSize);
// //   console.log("qtyArray",qtyArray)
// //   if (qtyArray.length > 0) {
// //     qtyAccToday = qtyArray.reduce(addUp);
// //   }
// //   return qtyAccToday//-61;
// // };

// // getPreshapedDoughAmt = (doughName, orders) => {
// //   let qtyAccToday = 0;
// //   let qtyArray = orders
// //     .filter((ord) => ord.doughType === doughName)
// //     .map((ord) => Number(ord.preshaped) * ord.weight * ord.packSize);
// //   if (qtyArray.length > 0) {
// //     qtyAccToday = qtyArray.reduce(addUp);
// //   }
// //   return qtyAccToday;
// // };


// // // in composeWhatToBake.js at line 36
// // // at makeAddQty (line 36)
// // // starting at line 52

// // makeAddQty = (bakedTomorrow) => {
   
// //   let makeList2 = Array.from(
// //     new Set(bakedTomorrow.map((prod) => prod.forBake))
// //   ).map((mk) => ({
// //     forBake: mk,
// //     qty: 0,
// //     shaped: 0,
// //     short: 0,
// //     needEarly: 0,
// //   }));
// //   for (let make of makeList2) {
// //     make.qty = 1;

// //     let qtyAccToday = 0;

// //     let bakeInd = bakedTomorrow.filter((frz) => make.forBake === frz.forBake);
// //     let qtyToday = bakeInd.map((ord) => ord.qty * ord.packSize);

// //     if (qtyToday.length > 0) {
// //       qtyAccToday = qtyToday.reduce(addUp);
// //     }

// //     let pocketsAccToday = 0;

// //     let pocketsToday = bakeInd.map((ord) => ord.preshaped);

// //     if (pocketsToday.length > 0) {
// //       pocketsAccToday = qtyAccToday - pocketsToday[0];
// //     }

// //     let shapedSum = bakeInd.map((ord) => ord.preshaped);

// //     if (shapedSum.length > 0) {
// //       make.shaped = shapedSum[0];
// //     }

// //     if (pocketsAccToday > 0) {
// //       make.short = "Short " + pocketsAccToday;
// //     } else if (pocketsAccToday < 0) {
// //       pocketsAccToday = -pocketsAccToday;
// //       make.short = "Over " + pocketsAccToday;
// //     } else {
// //       make.short = "";
// //     }

// //     let needEarlyAccToday = 0;

// //     let needEarlyToday = bakedTomorrow
// //       .filter(
// //         (frz) =>
// //           make.forBake === frz.forBake &&
// //           frz.routeDepart === "Carlton" &&
// //           frz.routeArrive === "Carlton" &&
// //           frz.zone !== "Carlton Retail" &&
// //           frz.zone !== "atownpick"
// //       )
// //       .map((ord) => ord.qty);

// //     if (needEarlyToday.length > 0) {
// //       needEarlyAccToday = needEarlyToday.reduce(addUp);
// //     }

// //     if (needEarlyAccToday > 0) {
// //       make.needEarly = needEarlyAccToday;
// //     } else {
// //       make.needEarly = "";
// //     }

// //     make.qty = qtyAccToday;
// //   }


// //   //makeList2[0].qty -= 54
// //   return makeList2;
// // };
