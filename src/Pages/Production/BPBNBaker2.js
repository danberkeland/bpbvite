import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import ToolBar from "../Logistics/ByRoute/Parts/Toolbar";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";

import ComposeWhatToMake from "./Utils/composeWhatToMake";
import ComposePastryPrep from "./Utils/composePastryPrep";
import ComposeWhatToPrep from "./Utils/composeWhatToPrep";

import { updateProduct } from "../../graphql/mutations";
import { useLegacyFormatDatabase } from "../../data/legacyData";
import { useSettingsStore } from "../../Contexts/SettingsZustand";

import { API, graphqlOperation } from "aws-amplify";

import { WholeBox } from "./_styles";

const compose = new ComposeWhatToMake();
const composePastry = new ComposePastryPrep();
const composePrep = new ComposeWhatToPrep();

let finalY;
let pageMargin = 20;
let tableToNextTitle = 4;
let titleToNextTable = tableToNextTitle + 2;
let tableFont = 11;
let titleFont = 14;

const buildTable = (title, doc, body, col) => {
  doc.autoTable({
    theme: "grid",
    headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    body: body,
    margin: pageMargin + 25,
    columns: col,
    startY: finalY + titleToNextTable,
    styles: { fontSize: tableFont },
  });
};

function BPBNBaker2() {
  const [setOut, setSetOut] = useState([]);
  const [delivDate, setDelivDate] = useState(todayPlus()[0]);
  const [whatToMake, setWhatToMake] = useState([]);
  const [pastryPrep, setPastryPrep] = useState([]);
  const [infoWrap, setInfoWrap] = useState({});
  const [whatToPrep, setWhatToPrep] = useState();

  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const { data: database } = useLegacyFormatDatabase();

  useEffect(() => {
    console.log("todayPlus", todayPlus()[0]);
    if (todayPlus()[0] === "2022-12-24") {
      setDelivDate("2022-12-25");
    } else {
      setDelivDate(todayPlus()[0]);
    }
  }, []);

  useEffect(() => {
    gatherWhatToPrepInfo(database);
    gatherWhatToMakeInfo(database);
    gatherPastryPrepInfo(database);
  }, [delivDate, database]); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherWhatToPrepInfo = (database) => {
    setIsLoading(true);
    try {
      let whatToPrepData = composePrep.returnWhatToPrepBreakDown(
        delivDate,
        database
      );
      setWhatToPrep(whatToPrepData.whatToPrep);
      setIsLoading(false);
    } catch {}
  };

  useEffect(() => {
    setInfoWrap({
      whatToPrep: whatToPrep,
    });
  }, [whatToPrep]);

  const gatherWhatToMakeInfo = (database) => {
    setIsLoading(true);
    try {
      let whatToMakeData = compose.returnWhatToMakeBreakDown(
        database,
        delivDate
      );
      console.log("WHAT TO MAKE:", whatToMakeData);
      setWhatToMake(whatToMakeData.whatToMake);
      setIsLoading(false);
    } catch {}
  };

  const gatherPastryPrepInfo = (database) => {
    setIsLoading(true);
    try {
      let pastryPrepData = composePastry.returnPastryPrepBreakDown(
        delivDate,
        database,
        "Carlton"
      );
      setSetOut(pastryPrepData.setOut);
      setPastryPrep(pastryPrepData.pastryPrep);
      setIsLoading(false);
    } catch {}
  };

  const exportPastryPrepPdf = async (infoWrap) => {
    setIsLoading(true);

    for (let set of setOut) {
      console.log("set", set);

      let addDetails = {
        prodNick: set.prodNick,
        prepreshaped: set.qty,
      };

      console.log("addDetails", addDetails);

      // try {
      //   await API.graphql(
      //     graphqlOperation(updateProduct, { input: { ...addDetails } })
      //   );
      // } catch (error) {
      //   console.log("error on updating product", error);
      // }
    }

    for (let make of whatToMake) {
      let addDetails = {
        prodNick: make.prodNick,
        prepreshaped: make.qty,
      };

      // try {
      //   await API.graphql(
      //     graphqlOperation(updateProduct, { input: { ...addDetails } })
      //   );
      // } catch (error) {
      //   console.log("error on updating product", error);
      // }
    }

    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(20);
    doc.text(pageMargin, 20, `WhatToMake ${convertDatetoBPBDate(delivDate)}`);

    finalY = 20;

    doc.setFontSize(titleFont);

    doc.autoTable({
      theme: "grid",
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
      body: whatToMake,
      margin: pageMargin,
      columns: [
        { header: "Product", dataKey: "forBake" },
        { header: "Weight", dataKey: "weight" },
        { header: "Dough", dataKey: "dough" },
        { header: "Qty", dataKey: "qty" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY + tableToNextTitle;

    let col = [
      { header: "Product", dataKey: "prodName" },
      { header: "Qty", dataKey: "qty" },
    ];
    buildTable("", doc, infoWrap.whatToPrep, col);

    finalY = doc.previousAutoTable.finalY + tableToNextTitle;

    doc.autoTable({
      body: setOut,
      margin: pageMargin + 25,
      columns: [
        { header: "Set Out", dataKey: "prodNick" },
        { header: "Qty", dataKey: "qty" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
      theme: "grid",
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    });
    /*
    finalY = doc.previousAutoTable.finalY;

    doc.autoTable({
      body: pastryPrep,
      margin: pageMargin+25,
      columns: [
        { header: "Pastry Prep", dataKey: "prodNick" },
        { header: "Qty", dataKey: "qty" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
      theme: "grid"
    });
    */
    doc.save(`WhatToShape${delivDate}.pdf`);
    setIsLoading(false);
  };

  return (
    <React.Fragment>
      <ConfirmDialog />
      <WholeBox>
        <h1>What To Shape {convertDatetoBPBDate(delivDate)}</h1>
        <ToolBar delivDate={delivDate} setDelivDate={setDelivDate} />
        <Button
          label="Print Prep List"
          type="button"
          onClick={(e) => exportPastryPrepPdf(infoWrap)}
          data-pr-tooltip="PDF"
          style={{ width: "fit-content", marginBlock: "1rem" }}
        />

        <h2>What To Shape</h2>
        <DataTable value={whatToMake} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="weight" header="Weight"></Column>
          <Column field="dough" header="Dough"></Column>
          <Column field="qty" header="Qty"></Column>
        </DataTable>
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBNBaker2;
