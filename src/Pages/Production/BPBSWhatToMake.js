import React, { useEffect, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";

import { checkForUpdates } from "../../core/checkForUpdates";
import { useLegacyFormatDatabase } from "../../data/legacyData";
import { useSettingsStore } from "../../Contexts/SettingsZustand";


import ToolBar from "./BPBNBaker1Parts/Toolbar";

import { updateProduct } from "../../graphql/mutations";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../utils/_deprecated/dateTimeHelpers";

import ComposeWhatToMake from "./BPBSWhatToMakeUtils/composeWhatToMake"

import styled from "styled-components";

import { API, graphqlOperation } from "aws-amplify";
import { DateTime } from "luxon";

import { BPBSWhatToMake as BPBSWhatToMakeNew } from "./NewPages/BPBS/WhatToMake/WhatToMake";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  padding: 0 0 100px 0;
`;


let today = todayPlus()[0];

const clonedeep = require("lodash.clonedeep");

const compose = new ComposeWhatToMake();

function BPBSWhatToMake() {
 
 
  const [youllBeShort, setYoullBeShort] = useState();
  const [freshProds, setFreshProds] = useState();
  const [delivDate, setDelivDate] = useState(todayPlus()[0]);
  const [shelfProds, setShelfProds] = useState();
  const [pretzels, setPretzels] = useState();
  const [freezerProds, setFreezerProds] = useState();
  const [pocketsNorth, setPocketsNorth] = useState();
  const [baguetteStuff, setBaguetteStuff] = useState();
  const [products, setProducts] = useState();

  const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
  const [year, month, day] = delivDate.split("-")
  const delivDateDT = DateTime.fromObject(
    {year, month, day}, 
    {zone: 'America/Los_Angeles'}
  )
  const diff = delivDateDT.diff(todayDT, "days").values.days
  const tomorrowSelected = diff === 1

  
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const ordersHasBeenChanged = useSettingsStore(
    (state) => state.ordersHasBeenChanged
  );
  const setOrdersHasBeenChanged = useSettingsStore(
    (state) => state.setOrdersHasBeenChanged
  );
  const { data: database } = useLegacyFormatDatabase();

  
  useEffect(() => {
    console.log("databaseTest", database);
    database &&
      checkForUpdates(
        database,
        ordersHasBeenChanged,
        setOrdersHasBeenChanged,
        delivDate,
        setIsLoading
      ).then((db) => gatherMakeInfo(db));
  }, [database, delivDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherMakeInfo = (database) => {
    let makeData = compose.returnMakeBreakDown(database, delivDate);
    setYoullBeShort(makeData.youllBeShort);
    setPocketsNorth(makeData.pocketsNorth);
    setFreshProds(makeData.freshProds);
    setShelfProds(makeData.shelfProds);
    setPretzels(makeData.pretzels);
    setFreezerProds(makeData.freezerProds);
    setProducts(database[0]);
    setBaguetteStuff(makeData.baguetteStuff);
  };

  const checkDateAlert = (delivDate) => {
    if (delivDate !== today) {
      confirmDialog({
        message:
          "This is not the list for TODAY. " 
          + "Are you sure this is the one you want to print?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => exportListPdf(),
      });
    } else {
      exportListPdf();
    }
  };

  const exportListPdf = () => {
    let finalY;
    let pageMargin = 40;
    let tableToNextTitle = 8;
    let titleToNextTable = tableToNextTitle;
    let tableFont = 11;
    let titleFont = 14;

    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(20);
    doc.text(pageMargin, 20, `What to Make ${convertDatetoBPBDate(delivDate)}`);

    finalY = 10;


    doc.setFontSize(titleFont);

    doc.autoTable({
      body: youllBeShort,
      margin: pageMargin,
      columns: [
        { header: "Pocket Size", dataKey: "pocketWeight" },
        { header: "Available", dataKey: "preshaped" },
        { header: "Need Today", dataKey: "need" },
        { header: "Surplus(+)/Short(-)", dataKey: "makeTotal" },
      ],
      startY: finalY + 20,
      styles: { fontSize: tableFont },
      theme: "grid",
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    });

    finalY = doc.previousAutoTable.finalY;

    
    doc.setFontSize(titleFont);

    doc.autoTable({
      body: baguetteStuff,
      margin: pageMargin,
      columns: [
        { header: "Product", dataKey: "Prod" },
        { header: "Bucket", dataKey: "Bucket" },
        { header: "Mix", dataKey: "Mix" },
        { header: "Bake", dataKey: "Bake" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
      theme: "grid",
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    });

    finalY = doc.previousAutoTable.finalY;

    doc.setFontSize(titleFont);

    doc.autoTable({
      body: pocketsNorth,
      margin: pageMargin,
      columns: [
        { header: "Pockets North", dataKey: "forBake" },
        { header: "Quantity", dataKey: "qty" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
      theme: "grid",
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    });

    finalY = doc.previousAutoTable.finalY;

    doc.setFontSize(titleFont);

    doc.autoTable({
      body: freshProds,
      margin: pageMargin,
      columns: [
        { header: "Fresh Product", dataKey: "forBake" },
        { header: "Total Deliv", dataKey: "qty" },
        { header: "Make Total", dataKey: "makeTotal" },
        { header: "Bag For Tomorrow", dataKey: "bagEOD" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
      theme: "grid",
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    });

    finalY = doc.previousAutoTable.finalY;

    doc.setFontSize(titleFont);

    doc.autoTable({
      body: shelfProds,
      margin: pageMargin,
      pageBreak: "avoid",
      columns: [
        { header: "Shelf Product", dataKey: "forBake" },
        { header: "Total Deliv", dataKey: "qty" },
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

    doc.autoTable({
      body: pretzels,
      margin: pageMargin,
      pageBreak: "avoid",
      columns: [
        { header: "Shelf Product", dataKey: "forBake" },
        { header: "Bake Today", dataKey: "qty" },
        { header: "Shape Today", dataKey: "makeTotal" },
        { header: "Bag EOD", dataKey: "bagEOD" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
      theme: "grid",
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    });

    finalY = doc.previousAutoTable.finalY;

    doc.setFontSize(titleFont);

    doc.autoTable({
      body: freezerProds,
      pageBreak: "avoid",
      margin: pageMargin,
      columns: [
        { header: "Freezer Product", dataKey: "forBake" },
        { header: "Total Deliv", dataKey: "qty" },
        { header: "Need Early", dataKey: "needEarly" },
        { header: "Make Total", dataKey: "makeTotal" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
      theme: "grid",
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    });

    doc.save(`WhatToMake${delivDate}.pdf`);
  };

  // const header = (
  //   <ButtonContainer>
  //     <ButtonWrapper>
  //       <Button
  //         type="button"
  //         onClick={(e) => checkDateAlert(delivDate)}
  //         className="p-button-success"
  //         data-pr-tooltip="PDF"
  //       >
  //         Print What To Make List
  //       </Button>
  //     </ButtonWrapper>
  //   </ButtonContainer>
  // );

  const handlePockChange = async (e2, e) => {
    let prodsToMod = clonedeep(products);
    let YoullBeCopy = clonedeep(youllBeShort);

    let ind = YoullBeCopy.findIndex((yo) => yo.pocketWeight === e.pocketWeight);
    YoullBeCopy[ind].makeTotal = Number(e2.target.value);
    YoullBeCopy[ind].short = 0 - Number(e2.target.value);
    YoullBeCopy[ind].preshaped =
      YoullBeCopy[ind].need + Number(e2.target.value);
    console.log(YoullBeCopy);
    setYoullBeShort(YoullBeCopy);

    for (let prod of prodsToMod) {
      let weight = e.pocketWeight;

      if (
        Number(prod.weight) === Number(weight) &&
        prod.doughType === "French"
      ) {
        console.log('prod', prod)
        let itemUpdate = {
          prodNick: prod.nickName,
          prodName: prod.prodName,
          preshaped: YoullBeCopy[ind].preshaped,
        };

        try {
          await API.graphql(
            graphqlOperation(updateProduct, { input: { ...itemUpdate } })
          );
        } catch (error) {
          console.log("error on updating product", error);
        }
      }
    }
    setProducts(prodsToMod);
  };

  const handlePocketInput = (e) => {
    return (
      <InputText
        id={e.pocketWeight}
        style={{
          width: "50px",
          backgroundColor: "#E3F2FD",
          fontWeight: "bold",
        }}
        placeholder={e.makeTotal}
        onKeyUp={(e2) => (e2.code === "Enter" ? handlePockChange(e2, e) : "")}
        onBlur={(e2) => handlePockChange(e2, e)}
      />
    );
  };

  return (
    <React.Fragment>
      <WholeBox>
        <h1>BPBS What To Make {convertDatetoBPBDate(delivDate)}</h1>
        <ToolBar delivDate={delivDate} setDelivDate={setDelivDate} />

        <Button
          type="button"
          onClick={(e) => checkDateAlert(delivDate)}
          //className="p-button-success"
          data-pr-tooltip="PDF"
          style={{marginBlock: "1rem", width: "fit-content"}}
        >
          Print What To Make List
        </Button>
        <ConfirmDialog />


        <React.Fragment>
          <h1>What To Prep {convertDatetoBPBDate(delivDate)}</h1>

          <h2>Pocket Count</h2>
          <DataTable value={youllBeShort} className="p-datatable-sm">
            <Column field="pocketWeight" header="Pocket Size"></Column>
            <Column field={tomorrowSelected? "prepreshaped" : "preshaped"} header="Available"></Column>
            <Column field="need" header="Need Today"></Column>
            <Column
              field="makeTotal"
              header="Surplus(+)/Short(-)"
              body={(e) => handlePocketInput(e)}
            ></Column>
          </DataTable>
        </React.Fragment>
        <h2>Baguette Production</h2>
        <DataTable value={baguetteStuff} className="p-datatable-sm">
          <Column field="Prod" header="Product"></Column>
          <Column field="Bucket" header="Bucket"></Column>
          <Column field="Mix" header="Mix"></Column>
          <Column field="Bake" header="Bake"></Column>
        </DataTable>
        <br />
        <h2>Send Pockets North</h2>
        <DataTable value={pocketsNorth} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Total Deliv"></Column>
        </DataTable>

        <h2>Make Fresh</h2>
        <DataTable value={freshProds} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Total Deliv"></Column>
          <Column field="makeTotal" header="MakeTotal"></Column>
          <Column field="bagEOD" header="Bag for Tomorrow"></Column>
        </DataTable>
        <h2>Make For Shelf</h2>
        <DataTable value={shelfProds} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Total Deliv"></Column>
          <Column field="needEarly" header="Need Early"></Column>
          <Column field="makeTotal" header="MakeTotal"></Column>
        </DataTable>
        <h2>Pretzels</h2>
        <DataTable value={pretzels} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Bake Today"></Column>
          <Column field="makeTotal" header="Shape for Tomorrow"></Column>
          <Column field="bagEOD" header="Bag EOD"></Column>
        </DataTable>
        <h2>Make For Freezer</h2>
        <DataTable value={freezerProds} className="p-datatable-sm">
          <Column field="forBake" header="Product"></Column>
          <Column field="qty" header="Total Deliv"></Column>
          <Column field="needEarly" header="Need Early"></Column>
          <Column field="makeTotal" header="MakeTotal"></Column>
        </DataTable>
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBSWhatToMake;


