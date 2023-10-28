import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportSpecialOrderPdf = ({
  data,
  header,
  filename
}) => {
  if (!data) {
    console.warn("Cannot print: data not found")
    return
  }
  let finalY;
  let pageMargin = 10;
  let tableToNextTitle = 12;
  let titleToNextTable = tableToNextTitle + 4;
  let tableFont = 11;
  let titleFont = 14;

  const doc = new jsPDF("l", "mm", "a4");
  doc.setFontSize(20);
  doc.text(
    pageMargin,
    20,
    header
  );

  finalY = 20;

  doc.setFontSize(titleFont);
  
  doc.autoTable({
    body: data.body,
    columns: data.columns,
    startY: finalY + titleToNextTable,
    styles: { fontSize: tableFont },
    theme: "grid"
  });

  doc.save(filename);
};