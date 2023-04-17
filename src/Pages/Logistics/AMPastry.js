import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import ComposeAMPastry from "./utils/composeAMPastry";

import styled from "styled-components";
import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { useLegacyFormatDatabase } from "../../data/legacyData";
import { checkForUpdates } from "../../helpers/databaseFetchers";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-content: flex-start;
`;

const ButtonWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  display: flex;
  width: 60%;
  flex-direction: row;
  justify-content: space-between;
  align-content: left;

  background: #ffffff;
`;

const compose = new ComposeAMPastry();

const getBinSize = (past) => {
  let num =
    Number(past.pl ? past.pl : 0) +
    Number(past.ch ? past.ch : 0) +
    Number(past.pg ? past.pg : 0) +
    Number(past.sf ? past.sf : 0) +
    Number(past.al ? past.al : 0) +
    Number(past.mb ? past.mb : 0) +
    Number(past.unmb ? past.unmb : 0) +
    Number(past.mini ? past.mini : 0) +
    Number(past.bb ? past.bb : 0) +
    Number(past.sco ? past.sco : 0) +
    Number(past.bd ? past.bd : 0) +
    Number(past.brn ? past.brn : 0);

  let binSize = "1 x S";

  if (num > 10) {
    let numBin = Math.ceil(num / 24);
    binSize = numBin + " x M";
    if (numBin > 4) {
      numBin = Math.ceil(num / 45);
      binSize = numBin + " x L";
    }
  }

  return binSize;
};

function AMPastry() {
  const [AMPastry, setAMPastry] = useState([]);
  const [AMOthers, setAMOthers] = useState([]);

  const [columnsAMPastry, setColumnsAMPastry] = useState([]);
  const [columnsAMOthers, setColumnsAMOthers] = useState([]);

  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const ordersHasBeenChanged = useSettingsStore(
    (state) => state.ordersHasBeenChanged
  );
  const setOrdersHasBeenChanged = useSettingsStore(
    (state) => state.setOrdersHasBeenChanged
  );
  const { data: database } = useLegacyFormatDatabase();

  let delivDate = todayPlus()[0];

  const createDynamic = (cols) => {
    const dynamicColumns = cols.map((col, i) => {
      return (
        <Column
          npmkey={col.field}
          field={col.field}
          header={col.header}
          key={col.field}
          style={col.width}
        />
      );
    });
    return dynamicColumns;
  };

  const dynamicColumnsAMPastry = createDynamic(columnsAMPastry);
  const dynamicColumnsAMOthers = createDynamic(columnsAMOthers);

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
  }, [database]); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherMakeInfo = (database) => {
    let AMPastryData = compose.returnAMPastryBreakDown(delivDate, database);
    setAMPastry(AMPastryData.AMPastry);
    setColumnsAMPastry(AMPastryData.columnsAMPastry);
    setAMOthers(AMPastryData.AMOthers);
    setColumnsAMOthers(AMPastryData.columnsAMOthers);
  };

  const exportAMPastryStickers = () => {
    const doc = new jsPDF({
      orientation: "l",
      unit: "in",
      format: [2, 4],
    });

    let ind = 0;
    let AMPastryData = AMPastry.filter(
      (cust) => cust.customer !== "BPB Extras"
    );
    for (let past of AMPastryData) {
      ind += 1;
      let binSize = getBinSize(past);
      doc.setFontSize(14);
      doc.text(
        `${past.customer} ${convertDatetoBPBDate(delivDate)}`,
        0.1,
        0.36
      );
      doc.text(`${binSize}`, 3.4, 1.8);

      doc.setFontSize(12);
      past.bb
        ? doc.text(`BB: ${past.bb}`, 0.2, 0.72)
        : doc.text(`BB: ----`, 0.2, 0.72);
      past.brn
        ? doc.text(`Brn: ${past.brn}`, 0.2, 0.98)
        : doc.text(`Brn: ----`, 0.2, 0.98);
      past.bd
        ? doc.text(`Bd: ${past.bd}`, 0.2, 1.24)
        : doc.text(`Bd: ----`, 0.2, 1.24);
      past.sco
        ? doc.text(`Sco: ${past.sco}`, 0.2, 1.5)
        : doc.text(`Sco: ----`, 0.2, 1.5);

      past.pg
        ? doc.text(`PG: ${past.pg}`, 1.46, 0.72)
        : doc.text(`PG: ----`, 1.46, 0.72);
      past.sf
        ? doc.text(`SF: ${past.sf}`, 1.46, 0.98)
        : doc.text(`SF: ----`, 1.46, 0.98);
      past.pl
        ? doc.text(`Pl: ${past.pl}`, 1.46, 1.24)
        : doc.text(`Pl: ----`, 1.46, 1.24);
      past.ch
        ? doc.text(`ch: ${past.ch}`, 1.46, 1.5)
        : doc.text(`ch: ----`, 1.46, 1.5);

      past.al
        ? doc.text(`Al: ${past.al}`, 2.72, 0.72)
        : doc.text(`Al: ----`, 2.72, 0.72);
      past.unmb
        ? doc.text(`unmb: ${past.unmb}`, 2.72, 0.98)
        : doc.text(`unmb: ----`, 2.72, 0.98);
      past.mb
        ? doc.text(`mb: ${past.mb}`, 2.72, 1.24)
        : doc.text(`mb: ----`, 2.72, 1.24);
      past.mini
        ? doc.text(`Mini: ${past.mini}`, 2.72, 1.5)
        : doc.text(`Mini: ----`, 2.72, 1.5);
      if (ind < AMPastry.length) {
        doc.addPage({
          format: [2, 4],
          orientation: "l",
        });
      }
    }

    doc.save(`TestSticker.pdf`);
  };

  const exportAMPastryPDF = () => {
    let finalY;
    let pageMargin = 10;
    let tableToNextTitle = 12;
    let titleToNextTable = tableToNextTitle + 4;
    let tableFont = 11;

    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(20);
    doc.text(pageMargin, 20, `AM Pastry ${convertDatetoBPBDate(delivDate)}`);

    finalY = 20;
    if (columnsAMPastry.length > 0) {
      doc.autoTable({
        body: AMPastry,
        columns: columnsAMPastry,
        startY: finalY + titleToNextTable,
        styles: { fontSize: tableFont },
      });
    }

    doc.save(`AMPastry${delivDate}.pdf`);
  };

  const header = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={exportAMPastryStickers}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print AM Pastry Stickers
        </Button>
        <Button
          type="button"
          onClick={exportAMPastryPDF}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print AM Pastry List
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );

  return (
    <React.Fragment>
      <WholeBox>
        <h1>AM Pastry Pack {convertDatetoBPBDate(delivDate)}</h1>
        <div>{header}</div>

        {AMPastry.length > 0 && (
          <React.Fragment>
            <h3>AM Pastry</h3>
            <DataTable
              className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
              value={AMPastry}
            >
              {dynamicColumnsAMPastry}
            </DataTable>{" "}
            {/*
            <h3>AM Others</h3>
            <DataTable
              className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
              value={AMOthers}
            >
              {dynamicColumnsAMOthers}
            </DataTable>{" "} */}
          </React.Fragment>
        )}
      </WholeBox>
    </React.Fragment>
  );
}

export default AMPastry;
