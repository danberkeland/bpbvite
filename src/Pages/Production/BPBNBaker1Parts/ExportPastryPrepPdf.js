import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate } from "../../../helpers/dateTimeHelpers";
import { mixFormula } from "./MixFormula";
import { getMixInfo } from "./GetMixInfo";

import { binInfo } from "./BinInfo";
import { panAmount } from "./PanAmount";
import { bucketAmount } from "./BucketAmount";
import { updateDough } from "../../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

let finalY;
let pageMargin = 20;
let tableToNextTitle = 12;
let titleToNextTable = tableToNextTitle + 4;
let tableFont = 11;
let titleFont = 14;

const buildTable = (title, doc, body, col) => {
  doc.setFontSize(titleFont);
  doc.text(pageMargin, finalY + tableToNextTitle, title);
  doc.autoTable({
    theme: "grid",
    headStyles: {fillColor: "#dddddd", textColor: "#111111"},
    body: body,
    margin: pageMargin,
    columns: col,
    startY: finalY + titleToNextTable,
    styles: { fontSize: tableFont },
  });
};

export const ExportPastryPrepPdf = async (delivDate, doughs, infoWrap, doobieStuff) => {
  
  for (let dgh of doughs) {
    console.log("dgh",dgh)
    let addDetails = {
      id: dgh.id,
      preBucketSets: bucketAmount(doughs, infoWrap)[0].amount,
    };

    try {
      await API.graphql(
        graphqlOperation(updateDough, { input: { ...addDetails } })
      );
    } catch (error) {
      console.log("error on updating product", error);
    }

  }

  let mixes = getMixInfo(doughs, infoWrap)[4];

  const doc = new jsPDF("p", "mm", "a4");
  doc.setFontSize(20);
  doc.text(pageMargin, 20, `What To Bake ${convertDatetoBPBDate(delivDate)}`);

  finalY = 20;

  let col = [
    { header: "Product", dataKey: "forBake" },
    { header: "Qty", dataKey: "qty" },
    { header: "Shaped", dataKey: "shaped" },
    { header: "Short", dataKey: "short" },
    { header: "Need Early", dataKey: "needEarly" },
  ];
  buildTable(`Bake List`, doc, infoWrap.whatToMake, col);

  finalY = doc.previousAutoTable.finalY + tableToNextTitle;

  col = [
    { header: "Product", dataKey: "Prod" },
    { header: "Bucket", dataKey: "Bucket" },
    { header: "Mix", dataKey: "Mix" },
    { header: "Bake", dataKey: "Bake" },
  ];
  buildTable(`Doobie Stuff`, doc, doobieStuff, col);

  finalY = doc.previousAutoTable.finalY + tableToNextTitle;

  col = [
    { header: "Product", dataKey: "prodName" },
    { header: "Qty", dataKey: "qty" },
  ];
  buildTable(`Prep List`, doc, infoWrap.whatToPrep, col);

  finalY = doc.previousAutoTable.finalY + tableToNextTitle;

  doc.addPage();
  finalY = 20;

  col = [
    { header: "Item", dataKey: "title" },
    { header: "Amount", dataKey: "amount" },
  ];

  for (let i = 0; i < mixes; i++) {
    buildTable(
      `Baguette Mix #${i + 1}`,
      doc,
      mixFormula(doughs, infoWrap, i),
      col
    );

    finalY = doc.previousAutoTable.finalY + tableToNextTitle;
  }

  doc.addPage();
  finalY = 20;

  buildTable(`Bins`, doc, binInfo(doughs, infoWrap), col);
  finalY = doc.previousAutoTable.finalY + tableToNextTitle;

  buildTable(`Pans`, doc, panAmount(doughs, infoWrap), col);
  finalY = doc.previousAutoTable.finalY + tableToNextTitle;

  buildTable(`Buckets`, doc, bucketAmount(doughs, infoWrap), col);
  finalY = doc.previousAutoTable.finalY + tableToNextTitle;

  doc.save(`BPBN_Baker1_${delivDate}.pdf`);
};
