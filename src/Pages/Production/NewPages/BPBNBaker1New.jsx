import React, { useState } from "react"

import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { WhatToMake } from "./BPBNBaker1Components/WhatToMake"
import { WhatToPrep } from "./BPBNBaker1Components/WhatToPrep"
import { BaguetteMix } from "./BPBNBaker1Components/BaguetteMix"

import { useBPBNbakeList } from "./_hooks/BPBNhooks"
import { useBPBNprepList } from "./_hooks/BPBNhooks"
import { useBPBNbaguetteDoughSummary } from "./_hooks/BPBNhooks"

import { DateTime } from "luxon"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { useListData } from "../../../data/_listData"

export const BPBNBaker1 = () => <div>Obsolete</div>


// const CalendarLabel = ({ label, children }) =>  <div style={{
//   width: "fit-content",
//   color: "hsl(37, 67%, 10%)",
//   backgroundColor: "hsl(37, 100%, 80%)",
//   borderRadius: "3px"
// }}>
//   <span style={{ marginInline: ".75rem" }}>{label}</span>
//   {children}
// </div> //end CalendarLabel

// // *************
// // * COMPONENT *
// // *************

// // TODOs: 
// // - Tweak submission of preBucketSets.
// //   New code only updates baguette preBucketSets. 
// //   Legacy code seems to update all doughs. Is this necessary?
// export const BPBNBaker1 = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date())
//   const dateDT = DateTime.fromJSDate(selectedDate)
//     .setZone('America/Los_Angeles')
//     .startOf('day')
//   const displayDate = dateDT.toLocaleString({
//     month: '2-digit', day: '2-digit', year: 'numeric'
//   })

//   const bakeTotals = useBPBNbakeList({ dateDT, format: 'forBakeTotals' })
//   const prepTotals = useBPBNprepList({ dateDT, format: 'forBakeTotals' })
//   const bagSummary = useBPBNbaguetteDoughSummary({ dateDT })
//   const isLoading = (!bakeTotals || !prepTotals || !bagSummary)

//   const doughCache = useListData({ 
//     tableName: "DoughBackup", shouldFetch: true
//   })

//   const commitBucketSets = async () => {
//     let addDetails = {
//       id: bagSummary.dough.id,
//       preBucketSets: bagSummary.buckets[0].amount
//     }

//     console.log("addDetails", addDetails)
//     // doughCache.updateLocalData(
//     //   await doughCache.submitMutations({ updateInputs: [addDetails]})
//     // )

//   }

//   return (<>
//     <h1>BPBN Baker 1</h1>

//     <CalendarLabel label="Pick Delivery Date:" >
//       <Calendar 
//         value={selectedDate}
//         onChange={e => setSelectedDate(e.value)}
//         style={{ width: "6.75rem" }}
//         readOnlyInput
//       />
//     </CalendarLabel>

//     <Button
//       type="button"
//       label="Print AM Bake List"
//       onClick={() => {
//         exportBPBN1(
//           displayDate, bakeTotals, doobieStuff, prepTotals, bagSummary
//         )
//         commitBucketSets()
//       }}
//       data-pr-tooltip="PDF"
//       style={{width: "fit-content", marginBlock: "2rem"}}
//       disabled={isLoading}
//     />

//     <h2>{`What to Bake ${displayDate}`}</h2>
//     <WhatToMake bakeTotals={bakeTotals} />

//     <h2>{`What to Prep ${displayDate}`}</h2>
//     <WhatToPrep 
//       prepTotals={prepTotals}
//       doobieStuff={doobieStuff}
//     />
    
//     <h2>{`Baguette Mix ${displayDate}`}</h2>
//     <BaguetteMix bagSummary={bagSummary} />

//   </>)
// }

// let yes = DateTime.now()
//   .setZone("America/Los_Angeles")
//   .ordinal % 2 === 0

// const doobieStuff = [
//   {
//     Prod: "Doobie Buns",
//     Bucket: "YES",
//     Mix: yes ? "YES" : "YES",
//     Bake: yes ? "NO" : "NO",
//   },
//   {
//     Prod: "Siciliano",
//     Bucket: "YES",
//     Mix: yes ? "NO" : "NO",
//     Bake: yes ? "YES" : "YES",
//   },
// ]

// // const doobieStuffx = [
// //   {
// //     Prod: "Doobie Buns",
// //     Bucket: "YES",
// //     Mix: yes ? "NO" : "NO",
// //     Bake: yes ? "YES" : "YES",
// //   },
// //   {
// //     Prod: "Siciliano",
// //     Bucket: "YES",
// //     Mix: yes ? "YES" : "YES",
// //     Bake: yes ? "NO" : "NO",
// //   },
// // ]



// let finalY
// let pageMargin = 20
// let tableToNextTitle = 12
// let titleToNextTable = tableToNextTitle + 4
// let tableFont = 11
// let titleFont = 14

// const buildTable = (title, doc, body, col) => {
//   doc.setFontSize(titleFont);
//   doc.text(pageMargin, finalY + tableToNextTitle, title);
//   doc.autoTable({
//     theme: "grid",
//     headStyles: {fillColor: "#dddddd", textColor: "#111111"},
//     body: body,
//     margin: pageMargin,
//     columns: col,
//     startY: finalY + titleToNextTable,
//     styles: { fontSize: tableFont },
//   })
// }

// const exportBPBN1 = (
//   displayDate, bakeTotals, doobieStuff, prepTotals, bagSummary
// ) => {
//   const doc = new jsPDF("p", "mm", "a4")
//   doc.setFontSize(20)
//   doc.text(pageMargin, 20, `What To Bake ${displayDate}`)

//   finalY = 20

//   let col = [
//     { header: "Product", dataKey: "forBake" },
//     { header: "Qty", dataKey: "qty" },
//     { header: "Shaped", dataKey: "preshaped" },
//     { header: "Short", dataKey: "shortText" },
//     { header: "Need Early", dataKey: "needEarly" },
//   ];
//   buildTable(`Bake List`, doc, bakeTotals, col)

//   finalY = doc.previousAutoTable.finalY + tableToNextTitle

//   col = [
//     { header: "Product", dataKey: "Prod" },
//     { header: "Bucket", dataKey: "Bucket" },
//     { header: "Mix", dataKey: "Mix" },
//     { header: "Bake", dataKey: "Bake" },
//   ]
//   buildTable(`Doobie Stuff`, doc, doobieStuff, col)

//   finalY = doc.previousAutoTable.finalY + tableToNextTitle

//   col = [
//     { header: "Product", dataKey: "prodName" },
//     { header: "Qty", dataKey: "qty" },
//   ];
//   buildTable(`Prep List`, doc, prepTotals, col)

//   finalY = doc.previousAutoTable.finalY + tableToNextTitle
//   doc.addPage();
//   finalY = 20;

//   col = [
//     { header: "Item", dataKey: "label" },
//     { header: "Amount", dataKey: "amount" },
//   ]

//   bagSummary.mixes.forEach(mix => {
//     buildTable(`Baguette Mix #${mix.mixNumber}`, doc, mix.components, col)
//     finalY = doc.previousAutoTable.finalY + tableToNextTitle

//   })

//   buildTable(`Bins`, doc, bagSummary.bins, col)
//   finalY = doc.previousAutoTable.finalY + tableToNextTitle

//   buildTable(`Pocket Pans`, doc, bagSummary.pans, col)
//   finalY = doc.previousAutoTable.finalY + tableToNextTitle

//   buildTable(`Bucket Sets`, doc, bagSummary.buckets, col)
//   finalY = doc.previousAutoTable.finalY + tableToNextTitle

//   doc.save(`BPBN_Baker1_${displayDate}.pdf`)

// } // end exportBPBN1