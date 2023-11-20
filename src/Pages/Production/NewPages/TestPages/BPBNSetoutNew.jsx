// Notes:
//
// Data transformations were getting runtime errors because of Wild Field's 
// 'NOT ASSIGNED' standing order. 'NOT ASSIGNED' orders do not get a route 
// object attached to them, in which case the filters here will fail to look up 
// the route's 'RouteDepart' attribute.
//
// This has been addressed by using optional chaining (e.g. route?.RouteDepart),
// which will cause conditional checks like "route?.RouteDepart === 'Carlton'" 
// to *fail* (but not crash!). While this shouldn't be an issue for BPBN pages, 
// we may need a better solution for BPBS, especially when dealing with pretzel 
// prep specifically.
import React from "react";

import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"

import { 
  useBPBNcroixSetoutList, 
  useBPBNpastryPrepList 
} from "../_hooks/BPBNhooks"

import jsPDF from "jspdf"
import "jspdf-autotable"
import { DateTime } from "luxon"
import { useListData } from "../../../../data/_listData";

export const BPBNSetout = () => <div>Obsoleted</div>

// const TODAY = DateTime.now().setZone('America/Los_Angeles').startOf('day')
// const dateDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
// const displayDate = dateDT.toLocaleString({
//   month: '2-digit', day: '2-digit', year: 'numeric'
// })

// export const BPBNSetout = () => {
//   const setoutData = useBPBNcroixSetoutList({ 
//     dateDT, format: 'groupedByProdNick'
//   })

//   if (!!setoutData) console.log('setout data:', setoutData)

//   const setoutTotals = useBPBNcroixSetoutList({ 
//     dateDT, format: 'prodNickTotals'
//   })

//   const pastryPrepTotals = useBPBNpastryPrepList({
//     dateDT, format: 'prodNickTotals'
//   })

//   const { submitMutations, updateLocalData } = useListData({ 
//     tableName: "InfoQBAuth", 
//     shouldFetch: true 
//   })

//   // try both updating and creating the record
//   const commitSetoutTime = async () => {
//     let addDetails = {
//       id: dateDT.toISODate() + "Carlton" + "setoutTime",
//       infoContent: "updated",
//       infoName: "Carlton" + "setoutTime",
//     }

//     const uResp = await submitMutations({ updateInputs: [addDetails] })
//     if (uResp.errors.length) {
//       console.log("Update failed", uResp.errors)
//       const cResp = await submitMutations({ createInputs: [addDetails] })

//       if (cResp.errors.length) {
//         console.error("Create Failed", cResp.errors)
//       }
//       else {
//         updateLocalData(cResp)
//         console.log("created")
//       }
//     } else {
//       updateLocalData(uResp)
//       console.log("updated")
//     }

//   }

//   const confirmExport = () => {
//     confirmDialog({
//       message:
//         "This is not the list for TODAY. "
//         + "Are you sure this is the one you want to print?",
//       header: "Confirmation",
//       icon: "pi pi-exclamation-triangle",
//       accept: () => {
//         commitSetoutTime()
//         exportPastryPrepPDF(displayDate, setoutTotals, pastryPrepTotals)
//       }
//     })
//   }
//   return (<>
//     <h1>{`BPBN Set Out ${displayDate}`}</h1>

//     <h2>Set Out</h2>
//     <Button type="button"
//       label={`Print Carlton Prep List`}
//       onClick={() => {
//         if (TODAY.toMillis() !== dateDT.toMillis()) confirmExport()
//         else {
//           commitSetoutTime()
//           exportPastryPrepPDF(displayDate, setoutTotals, pastryPrepTotals)
//         }
//       }}
//       data-pr-tooltip="PDF"
//       style={{width: "fit-content", marginBlock: "1rem"}}
//     />
//     <DataTable size="small" value={setoutTotals}>
//       <Column header="Product" field="prodNick" />
//       <Column header="Qty" field="qty" />
//       <Column header="Pans" field="pans" />
//       <Column header="+" field="panRemainder" />
//     </DataTable>

//     <h2>Pastry Prep</h2>
//     <DataTable size="small" value={pastryPrepTotals}>
//       <Column header="Product" field="prodNick" />
//       <Column header="Qty" field="qty" />
//     </DataTable>

//     <ConfirmDialog />
//   </>)

// }


// const exportPastryPrepPDF = (displayDate, setoutTotals, pastryPrepTotals) => {
//   let finalY;
//   let pageMargin = 60;
//   let tableToNextTitle = 12;
//   let titleToNextTable = tableToNextTitle + 4;
//   let tableFont = 11;
//   let titleFont = 14;

//   const doc = new jsPDF("p", "mm", "a4");
//   doc.setFontSize(20);
//   doc.text(
//     pageMargin,
//     20,
//     `Carlton Pastry Prep ${displayDate}`
//   );

//   finalY = 20;

//   doc.setFontSize(titleFont);
//   doc.text(pageMargin, finalY + tableToNextTitle, `Set Out`);

//   doc.autoTable({
//     body: setoutTotals,
//     margin: pageMargin,
//     columns: [
//       { header: "Frozen Croissants", dataKey: "prodNick" },
//       { header: "Qty", dataKey: "qty" },
//       { header: "Pans", dataKey: "pans" },
//       { header: "+", dataKey: "panRemainder" },
//     ],
//     startY: finalY + titleToNextTable,
//     styles: { fontSize: tableFont },
//     theme: "grid",
//     headStyles: { fillColor: "#dddddd", textColor: "#111111" },
//   });

//   finalY = doc.previousAutoTable.finalY;

//   doc.autoTable({
//     body: pastryPrepTotals,
//     margin: pageMargin,
//     columns: [
//       { header: "Pastry Prep", dataKey: "prodNick" },
//       { header: "Qty", dataKey: "qty" },
//     ],
//     startY: finalY + titleToNextTable,
//     styles: { fontSize: tableFont },
//     theme: "grid",
//     headStyles: { fillColor: "#dddddd", textColor: "#111111" },
//   });

//   doc.save(`SetOutCarlton${displayDate}.pdf`);
// };


