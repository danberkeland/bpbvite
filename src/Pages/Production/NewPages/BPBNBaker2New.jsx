import React, { useState } from "react";

import { 
  useBPBNcroixSetoutList, 
  useBPBNprepList, 
  useBPBNshapeList 
} from "./_hooks/BPBNhooks"
import { useListData } from "../../../data/_listData"

import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"

import jsPDF from "jspdf"
import "jspdf-autotable"
import { DateTime } from "luxon"

export const BPBNBaker2 = () => <div>Obsoleted</div>

// const CalendarLabel = ({ label, children }) =>  <div style={{
//   width: "fit-content",
//   color: "hsl(37, 67%, 10%)",
//   backgroundColor: "hsl(37, 100%, 80%)",
//   borderRadius: "3px"
// }}>
//   <span style={{ marginInline: ".75rem" }}>{label}</span>
//   {children}
// </div> //end CalendarLabel

// export const BPBNBaker2 = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date())
//   const dateDT = DateTime.fromJSDate(selectedDate)
//     .setZone('America/Los_Angeles')
//     .startOf('day')
//   const displayDate = dateDT.toLocaleString({
//     month: '2-digit', day: '2-digit', year: 'numeric'
//   })

//   const shapeTotals = useBPBNshapeList({ dateDT, format: 'forBakeTotals' })
//   const prepTotals = useBPBNprepList({ dateDT, format: 'forBakeTotals' })
//   const croixSetoutTotals = useBPBNcroixSetoutList({
//     dateDT, format: 'prodNickTotals'
//   })

//   const { 
//     submitMutations:submitProducts, 
//     updateLocalData:updateProductCache 
//   } = useListData({ tableName: "Product", shouldFetch: true })

//   const updatePrepreshapedTotals = async () => {
//     if (!shapeTotals || !croixSetoutTotals) {
//       console.error("Report data missing. Terminating submit")
//     }

//     const updateInputs = shapeTotals.concat(croixSetoutTotals )
//       .map(item => ({ prodNick: item.prodNick, prepreshaped: item.qty }))

//     console.log(updateInputs)
//     // updateProductCache(await submitProducts({ updateInputs }))

//   }

//   return (<>
//       <h1>What To Shape {displayDate}</h1>
//       <CalendarLabel label="Pick Delivery Date:" >
//         <Calendar 
//           value={selectedDate}
//           onChange={e => setSelectedDate(e.value)}
//           style={{ width: "6.75rem" }}
//           readOnlyInput
//         />
//       </CalendarLabel>

//       <Button
//         label="Print Prep List"
//         type="button"
//         onClick={() => { 
//           updatePrepreshapedTotals() 
//           exportPDF(displayDate, shapeTotals, prepTotals, croixSetoutTotals) 
//         }}
//         data-pr-tooltip="PDF"
//         style={{ width: "fit-content", marginTop: "2rem" }}
//       />

//       <h2>What To Shape</h2>
//       <DataTable value={shapeTotals ?? []} className="p-datatable-sm">
//         <Column field="forBake" header="Product"></Column>
//         <Column field="weight" header="Weight"></Column>
//         <Column field="doughNick" header="Dough"></Column>
//         <Column field="qty" header="Qty"></Column>
//       </DataTable>

//       {/* <h2>What To Prep</h2>
//       <DataTable value={prepTotals ?? []} className="p-datatable-sm">
//         <Column field="forBake" header="Product"></Column>
//         <Column field="qty" header="Qty"></Column>
//       </DataTable>

//       <h2>Croix Setout</h2>
//       <DataTable value={croixSetoutTotals ?? []} className="p-datatable-sm">
//         <Column field="prodNick" header="Product"></Column>
//         <Column field="qty" header="Qty"></Column>
//         <Column field="pans" header="Pans"></Column>
//         <Column field="panRemainder" header="Extra..."></Column>
//       </DataTable> */}

//   </>)
// } // end BPBNBaker2



// let pageMargin = 20
// let tableToNextTitle = 4
// let titleToNextTable = tableToNextTitle + 2
// let titleFontSize = 14

// const pdfTableConstants = {
//   theme: "grid",
//   headStyles: { textColor: "#111111", fillColor: "#dddddd" },
//   margin: pageMargin,
//   styles: { fontSize: 11 },

// }

// const exportPDF = (
//   displayDate, 
//   shapeTotals, 
//   prepTotals, 
//   croixSetoutTotals
// ) => {
//   const doc = new jsPDF("p", "mm", "a4");
//   doc.setFontSize(20);
//   doc.text(pageMargin, 20, `WhatToMake ${displayDate}`)
//   doc.setFontSize(titleFontSize)

//   let finalY = 20

//   doc.autoTable({
//     ...pdfTableConstants,
//     startY: finalY + titleToNextTable,
//     body: shapeTotals,
//     columns: [
//       { header: "Product", dataKey: "forBake" },
//       { header: "Weight", dataKey: "weight" },
//       { header: "Dough", dataKey: "doughNick" },
//       { header: "Qty", dataKey: "qty" },
//     ],
//   })

//   finalY = doc.previousAutoTable.finalY + tableToNextTitle

//   doc.autoTable({
//     ...pdfTableConstants,
//     margin: pdfTableConstants.margin + 25,
//     startY: finalY + titleToNextTable,
//     body: prepTotals,
//     columns: [
//       { header: "Product", dataKey: "forBake" },
//       { header: "Qty", dataKey: "qty" },
//     ],
//   })

//   finalY = doc.previousAutoTable.finalY + tableToNextTitle;

//   doc.autoTable({
//     ...pdfTableConstants,
//     margin: pdfTableConstants.margin + 25,
//     startY: finalY + titleToNextTable,
//     body: croixSetoutTotals,
//     columns: [
//       { header: "Set Out", dataKey: "prodNick" },
//       { header: "Qty", dataKey: "qty" }, // can add pans + extra counts?
//     ],
//   })

//   doc.save(`WhatToShape${displayDate}.pdf`)

// } // end exportPDF