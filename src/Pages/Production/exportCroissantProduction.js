import jsPDF from "jspdf"
import "jspdf-autotable"

export const exportCroissantProduction = ({
  reportDT,
  croixData,
}) => {

  const gridRows = croixData.map(row => ({
    prodNick: row.prodNick,
    sheetMake: row.sheetMake,
    total: row.sheetMake * row.batchSize
  }))

  const doc = new jsPDF("landscape", "mm", "letter");

  doc.setFontSize(20);
  doc.text(`What to Shape ${reportDT.toFormat('MM/dd/yyyy')}`, 40, 20);

  doc.autoTable({
    body: gridRows,
    margin: 40,
    columns: [
      { header: "Croix", dataKey: "prodNick" },
      { header: "Sheets", dataKey: "sheetMake" },
      { header: "Total", dataKey: "total" },
      { header: "Shaper 1"},
      { header: "Shaper 2"},
      { header: "Shaper 3"},
    ],
    startY: 30,
    styles: { fontSize: 11 },
    theme: "grid",
    headStyles: { fillColor: "#dddddd", textColor: "#111111" },
  });

  doc.save(`Croix_To_Shape_${reportDT.toFormat('yyyy-MM-dd')}.pdf`);

}