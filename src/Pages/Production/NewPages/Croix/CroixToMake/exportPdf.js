import jsPDF from "jspdf";
import "jspdf-autotable";
import { DateTime } from "luxon";

const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')

export const printCroixShapeList = (tableRows) => {
  let finalY;
  let pageMargin = 40;
  let tableFont = 11;
  let titleFont = 14;

  const gridRows = tableRows.map(row => ({
    countNick: row.countNick,
    sheetMake: row.sheetMake,
    total: row.sheetMake * row.batchSize
  }))

  const doc = new jsPDF("l", "mm", "a4");
  doc.setFontSize(20);
  doc.text(pageMargin, 20, `What to Shape ${todayDT.toFormat('MM/dd/yyyy')}`);

  finalY = 10;

  doc.setFontSize(titleFont);

  doc.autoTable({
    body: gridRows,
    margin: pageMargin,
    columns: [
      { header: "Croix", dataKey: "countNick" },
      { header: "Sheets", dataKey: "sheetMake" },
      { header: "Total", dataKey: "total" },
      { header: "Shaper 1"},
      { header: "Shaper 2"},
      { header: "Shaper 3"},

    ],
    startY: finalY + 20,
    styles: { fontSize: tableFont },
    theme: "grid",
    headStyles: { fillColor: "#dddddd", textColor: "#111111" },
  });

  doc.save(`Croix_To_Shape_${todayDT.toFormat('yyyy-MM-dd')}.pdf`);
}
