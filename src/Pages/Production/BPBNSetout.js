import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import ToolBar from "./BPBNBaker1Parts/Toolbar";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import { useLegacyFormatDatabase } from "../../data/legacyData";
import { useSettingsStore } from "../../Contexts/SettingsZustand";

import ComposePastryPrep from "./Utils/composePastryPrep";

import {
  updateProduct,
  updateInfoQBAuth,
  createInfoQBAuth,
} from "../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

import { WholeBox, ButtonContainer, ButtonWrapper, h1Style, h2Style } from "./_styles";
import { 
  BPBSSetout as BPBSSetoutNew, 
  BPBNSetout as BPBNSetoutNew 
} from "./NewPages/BPBSSetout/Setout";


let today = todayPlus()[0];

const compose = new ComposePastryPrep();

function BPBNSetOutLegacy({ loc }) {
  const [setOut, setSetOut] = useState([]);
  const [delivDate, setDelivDate] = useState(todayPlus()[0]);
  const [pastryPrep, setPastryPrep] = useState([]);
  const [almondPrep, setAlmondPrep] = useState([]);

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
    console.log("Got here to confirm!");
    confirmDialog({
      message: "Click YES to confirm these setout numbers will be used.",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => setoutTimeInStone(),
    });
  }, []);

  useEffect(() => {
    gatherPastryPrepInfo(database);
  }, [delivDate, database]); // eslint-disable-line react-hooks/exhaustive-deps

  const setoutTimeInStone = async () => {
    let addDetails = {
      id: delivDate + loc + "setoutTime",
      infoContent: "updated",
      infoName: loc + "setoutTime",
    };
    try {
      await API.graphql(
        graphqlOperation(updateInfoQBAuth, { input: { ...addDetails } })
      );
      console.log('QBInfo Updated')
    } catch (error) {
      try {
        await API.graphql(
          graphqlOperation(createInfoQBAuth, { input: { ...addDetails } })
        );
        console.log('QBInfo Created')
      } catch (error) {
        console.log("error on updating info", error);
      }
    }
  };

  const gatherPastryPrepInfo = (database) => {
    setIsLoading(true);
    try {
      let pastryPrepData = compose.returnPastryPrepBreakDown(
        delivDate,
        database,
        loc
      );
      setSetOut(pastryPrepData.setOut);
      setPastryPrep(pastryPrepData.pastryPrep);
      setAlmondPrep(pastryPrepData.almondPrep);
      setIsLoading(false);
    } catch {}
  };

  const checkDateAlert = (delivDate) => {
    if (delivDate !== today) {
      confirmDialog({
        message:
          "This is not the list for TODAY.  Are you sure this is the one you want to print?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => exportPastryPrepPdf(),
      });
    } else {
      exportPastryPrepPdf();
    }
  };

  const exportPastryPrepPdf = async () => {
    for (let set of setOut) {
      let addDetails = {
        prodNick: set.prodNick,
        prepreshaped: set.qty,
      };
      try {
        await API.graphql(
          graphqlOperation(updateProduct, { input: { ...addDetails } })
        );
      } catch (error) {
        console.log("error on updating product", error);
      }
    }
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
      `${loc} Pastry Prep ${convertDatetoBPBDate(delivDate)}`
    );

    finalY = 20;

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Set Out`);

    doc.autoTable({
      body: setOut,
      margin: pageMargin,
      columns: [
        { header: "Frozen Croissants", dataKey: "prodNick" },
        { header: "Qty", dataKey: "qty" },
        { header: "Pans", dataKey: "pans" },
        { header: "+", dataKey: "pansextra" },
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
        { header: "Pastry Prep", dataKey: "prodNick" },
        { header: "Qty", dataKey: "qty" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
      theme: "grid",
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    });

    if (loc === "Prado") {
      finalY = doc.previousAutoTable.finalY;

      doc.autoTable({
        body: almondPrep,
        margin: pageMargin,
        columns: [
          { header: "Almond Prep", dataKey: "prodNick" },
          { header: "Qty", dataKey: "qty" },
        ],
        startY: finalY + titleToNextTable,
        styles: { fontSize: tableFont },
        theme: "grid",
        headStyles: { fillColor: "#dddddd", textColor: "#111111" },
      });
    }

    doc.save(`SetOut${loc}${delivDate}.pdf`);
  };

  return (
    <React.Fragment>
      <ConfirmDialog />
      <WholeBox>
        <h1>
          {loc} PASTRY PREP {convertDatetoBPBDate(delivDate)}
        </h1>
        <ToolBar delivDate={delivDate} setDelivDate={setDelivDate} />
        <Button type="button"
          label={`Print ${loc} Prep List`}
          onClick={(e) => checkDateAlert(delivDate)}
          data-pr-tooltip="PDF"
          style={{width: "fit-content", marginBlock: "1rem"}}
        />

        <h2>Set Out</h2>
        <DataTable value={setOut} className="p-datatable-sm">
          <Column field="prodNick" header="Product"></Column>
          <Column field="qty" header="Qty"></Column>
          <Column field="pans" header="Pans"></Column>
          <Column field="pansextra" header="+"></Column>
        </DataTable>

        <h2>Pastry Prep</h2>
        <DataTable value={pastryPrep} className="p-datatable-sm">
          <Column field="prodNick" header="Product"></Column>
          <Column field="qty" header="Qty"></Column>
        </DataTable>
        {loc === "Prado" && (
          <React.Fragment>
            <h3>Almonds</h3>
            <DataTable value={almondPrep} className="p-datatable-sm">
              <Column field="prodNick" header="Product"></Column>
              <Column field="qty" header="Qty"></Column>
            </DataTable>
          </React.Fragment>
        )}
      </WholeBox>
    </React.Fragment>
  );
}



const BPBNSetOut = ({ loc }) => {
  const [showLegacy, setShowLegacy] = useState()

  return (<>
    <Button label="Use Old Version" 
      onClick={() => setShowLegacy(true)}
      style={{margin: "1rem"}}
    />
    <Button label="Use New Version" 
      onClick={() => setShowLegacy(false)}
      style={{margin: "1rem"}}
    />
    
    <div style={{marginTop: "2rem"}}>
      {showLegacy === true && <BPBNSetOutLegacy loc={loc} />}
      {showLegacy === false && 
        <div style={{
          display: "flex",
          justifyContent: "center"
        }}>
          {loc === "Prado" && <BPBSSetoutNew />}
          {loc === "Carlton" && <BPBNSetoutNew />}
        </div>
      }
    </div>
  </>)
}

export default BPBNSetOut