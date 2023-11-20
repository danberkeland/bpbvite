import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportBpbsWtmPdf = ({
  WTM,
  reportDateISO,
  reportDateUS, 
  reportRelDate
}) => {
  let finalY;
  let pageMargin = 40;
  let tableToNextTitle = 8;
  let titleToNextTable = tableToNextTitle;
  let tableFont = 11;
  let titleFont = 14;

  const doc = new jsPDF("p", "mm", "a4");
  doc.setFontSize(20);
  doc.text(pageMargin, 20, `What to Make ${reportDateUS}`);

  finalY = 10;


  doc.setFontSize(titleFont);

  // flatten
  const frenchPocketTableData = WTM.frenchPocketData.map(row => {
    const { weight, preshaped, prepreshaped, needTodayCol, surplus} = row
    return { 
      weight, 
      preshaped, 
      prepreshaped, 
      needToday: needTodayCol.totalEa,
      surplus, 
    }
  })

  const availableDataKey = reportRelDate === 0 ? "preshaped" : "prepreshaped"
  let frenchPocketColumns = [
    { header: "Pocket Size", dataKey: "weight" },
    { header: "Available", dataKey: availableDataKey },
    { header: "Need Today", dataKey: "needToday" },
  ]
  if (reportRelDate == 0) frenchPocketColumns.push(
    { header: "Surplus(+)/Short(-)", dataKey: "surplus" }
  )
  doc.autoTable({
    body: frenchPocketTableData,
    margin: pageMargin,
    columns: frenchPocketColumns,
    startY: finalY + 20,
    styles: { fontSize: tableFont },
    theme: "grid",
    headStyles: { fillColor: "#dddddd", textColor: "#111111" },
  });

  finalY = doc.previousAutoTable.finalY;

  
  doc.setFontSize(titleFont);

  doc.autoTable({
    body: WTM.baguetteData,
    margin: pageMargin,
    columns: [
      { header: "Product", dataKey: "product" },
      { header: "Bucket", dataKey: "bucket" },
      { header: "Mix", dataKey: "mix" },
      { header: "Bake", dataKey: "bake" },
    ],
    startY: finalY + titleToNextTable,
    styles: { fontSize: tableFont },
    theme: "grid",
    headStyles: { fillColor: "#dddddd", textColor: "#111111" },
  });

  finalY = doc.previousAutoTable.finalY;

  doc.setFontSize(titleFont);

  const northPocketTableData = WTM.northPocketData.map(row => {
    const { rowKey, makeTotalCol } = row
    return { rowKey, makeTotal: makeTotalCol.totalEa }
  })

  doc.autoTable({
    body: northPocketTableData,
    margin: pageMargin,
    columns: [
      { header: "Pockets North", dataKey: "rowKey" },
      { header: "Quantity", dataKey: "makeTotal" },
    ],
    startY: finalY + titleToNextTable,
    styles: { fontSize: tableFont },
    theme: "grid",
    headStyles: { fillColor: "#dddddd", textColor: "#111111" },
  });

  finalY = doc.previousAutoTable.finalY;

  doc.setFontSize(titleFont);

  const freshTableData = WTM.freshData.map(row => {
    const { rowKey, totalDelivCol, makeTotalCol, bagTomorrowCol } = row
    return {
      rowKey,
      totalDeliv: totalDelivCol.totalEa,
      makeTotal: makeTotalCol.totalEa,
      bagTomorrow: bagTomorrowCol.totalEa
    }
  })
  doc.autoTable({
    body: freshTableData,
    margin: pageMargin,
    columns: [
      { header: "Fresh Product", dataKey: "rowKey" },
      { header: "Total Deliv", dataKey: "totalDeliv" },
      { header: "Make Total", dataKey: "makeTotal" },
      { header: "Bag For Tomorrow", dataKey: "bagTomorrow" },
    ],
    startY: finalY + titleToNextTable,
    styles: { fontSize: tableFont },
    theme: "grid",
    headStyles: { fillColor: "#dddddd", textColor: "#111111" },
  });

  finalY = doc.previousAutoTable.finalY;

  doc.setFontSize(titleFont);

  const shelfTableData = WTM.shelfData.map(row => {
    const { rowKey, totalDelivCol, needEarlyCol, makeTotalCol } = row
    return {
      rowKey,
      totalDeliv : totalDelivCol.totalEa,
      needEarly: needEarlyCol.totalEa,
      makeTotal: makeTotalCol.totalEa
    }
  })

  doc.autoTable({
    body: shelfTableData,
    margin: pageMargin,
    pageBreak: "avoid",
    columns: [
      { header: "Shelf Product", dataKey: "rowKey" },
      { header: "Total Deliv", dataKey: "totalDeliv" },
      { header: "Need Early", dataKey: "needEarly" },
      { header: "Make Total", dataKey: "makeTotal" },
    ],
    startY: finalY + titleToNextTable,
    styles: { fontSize: tableFont },
    theme: "grid",
    headStyles: { fillColor: "#dddddd", textColor: "#111111" },
  });

  finalY = doc.previousAutoTable.finalY;

  doc.setFontSize(titleFont);

  const pretzelTableData = WTM.pretzelData.filter(row => 
    ['ptz', 'pzb', 'unpz'].includes(row.productRep.prodNick)
    || row.bakeCol.totalEa > 0
    || row.shapeCol.orders.totalEa > 0
    || row.bagCol.orders.totalEa > 0
  ).map(row => {
    const { rowKey, bakeCol, shapeCol, bagCol } = row
    return {
      rowKey,
      bake: bakeCol.totalEa,
      shape: shapeCol.totalEa,
      bag: bagCol.totalEa
    }
  })

  doc.autoTable({
    body: pretzelTableData,
    margin: pageMargin,
    pageBreak: "avoid",
    columns: [
      { header: "Shelf Product", dataKey: "rowKey" },
      { header: "Bake Today", dataKey: "bake" },
      { header: "Shape Today", dataKey: "shape" },
      { header: "Bag EOD", dataKey: "bag" },
    ],
    startY: finalY + titleToNextTable,
    styles: { fontSize: tableFont },
    theme: "grid",
    headStyles: { fillColor: "#dddddd", textColor: "#111111" },
  });

  finalY = doc.previousAutoTable.finalY;

  doc.setFontSize(titleFont);

  const freezerTableData = WTM.freezerData.map(row => {
    const { rowKey, totalDelivCol, needEarlyCol, makeTotalCol } = row
    return {
      rowKey,
      totalDeliv : totalDelivCol.totalEa,
      needEarly: needEarlyCol.totalEa,
      makeTotal: makeTotalCol.totalEa
    }
  })

  doc.autoTable({
    body: freezerTableData,
    pageBreak: "avoid",
    margin: pageMargin,
    columns: [
      { header: "Freezer Product", dataKey: "rowKey" },
      { header: "Total Deliv", dataKey: "totalDeliv" },
      { header: "Need Early", dataKey: "needEarly" },
      { header: "Make Total", dataKey: "makeTotal" },
    ],
    startY: finalY + titleToNextTable,
    styles: { fontSize: tableFont },
    theme: "grid",
    headStyles: { fillColor: "#dddddd", textColor: "#111111" },
  });

  doc.save(`BPBS_WhatToMake_${reportDateISO}.pdf`);
};