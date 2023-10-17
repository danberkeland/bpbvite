import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportPastryPrepPdf = ({ reportLocation, reportDateUS, reportDateISO, data }) => {
  const mainSetout = data.nonAlmondCroix
  const pastryPrep = data.otherPastries
  const almondPrep = data.almondCroix

  // for (let set of setOut) {
  //   let addDetails = {
  //     prodNick: set.prodNick,
  //     prepreshaped: set.qty,
  //   };
  //   try {
  //     await API.graphql(
  //       graphqlOperation(updateProduct, { input: { ...addDetails } })
  //     );
  //   } catch (error) {
  //     console.log("error on updating product", error);
  //   }
  // }

  let finalY;
  let pageMargin = 60;
  let tableToNextTitle = 12;
  let titleToNextTable = tableToNextTitle + 4;
  let tableFont = 11;
  let titleFont = 14;

  const doc = new jsPDF("p", "mm", "a4");
  doc.setFontSize(20);
  doc.text(
    pageMargin,
    20,
    `${reportLocation} Pastry Prep ${reportDateUS}`
  );

  finalY = 20;

  doc.setFontSize(titleFont);
  doc.text(pageMargin, finalY + tableToNextTitle, `Set Out`);

  doc.autoTable({
    body: mainSetout,
    margin: pageMargin,
    columns: [
      { header: "Frozen Croissants", dataKey: "setoutKey" },
      { header: "Qty", dataKey: "total" },
      { header: "Pans", dataKey: "pans" },
      { header: "+", dataKey: "remainder" },
    ],
    startY: finalY + titleToNextTable,
    styles: { fontSize: tableFont },
    theme: "grid",
    headStyles: { fillColor: "#dddddd", textColor: "#111111" },
  });

  finalY = doc.previousAutoTable.finalY;

  doc.autoTable({
    body: pastryPrep,
    margin: pageMargin,
    columns: [
      { header: "Pastry Prep", dataKey: "rowKey" },
      { header: "Qty", dataKey: "total" },
    ],
    startY: finalY + titleToNextTable,
    styles: { fontSize: tableFont },
    theme: "grid",
    headStyles: { fillColor: "#dddddd", textColor: "#111111" },
  });

  if (reportLocation === "Prado") {
    finalY = doc.previousAutoTable.finalY;

    doc.autoTable({
      body: almondPrep,
      margin: pageMargin,
      columns: [
        { header: "Almond Prep", dataKey: "rowKey" },
        { header: "Qty", dataKey: "total" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
      theme: "grid",
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    });
  }

  doc.save(`SetOut_${reportLocation}_${reportDateISO}.pdf`);
};