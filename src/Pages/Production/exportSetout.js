import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportSetout = ({ 
  reportLocation, 
  reportDT,
  croix,
  other,
  almond,
}) => {

  const pageMargin = 60
  const tableToNextTitle = 12
  const titleToNextTable = tableToNextTitle + 4
  const tableFont = 11
  const titleFont = 14

  const doc = new jsPDF("portrait", "mm", "letter")
  doc.setFontSize(20)
  doc.text(`${reportLocation} Pastry Prep ${reportDT.toFormat('M/d/yyyy')}`, pageMargin, 20)

  let finalY = 20

  doc.setFontSize(titleFont);
  doc.text('Set Out', pageMargin, finalY + tableToNextTitle);
  doc.autoTable({
    body: croix,
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
    body: other,
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

  if (!!almond?.length) {
    finalY = doc.previousAutoTable.finalY;
    doc.autoTable({
      body: almond,
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

  doc.save(`Setout_${reportLocation}_${reportDT.toFormat('yyyy-MM-dd')}.pdf`)

}