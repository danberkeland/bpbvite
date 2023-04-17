import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import ToolBar from "./ByRoute/Parts/Toolbar";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import ComposeSpecialOrders from "./utils/composeSpecialOrders";

import styled from "styled-components";
import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { useLegacyFormatDatabase } from "../../data/legacyData";
import { checkForUpdates } from "../../helpers/databaseFetchers";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
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
  width: 40%;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;

  background: #ffffff;
`;

const compose = new ComposeSpecialOrders();

function SpecialOrders() {
 
  const [delivDate, setDelivDate] = useState(todayPlus()[0]);
  const [BPBNSpecialOrders, setBPBNSpecialOrders] = useState();
  const [BPBSSpecialOrders, setBPBSSpecialOrders] = useState();
  const [columnsNorth, setColumnsNorth] = useState([]);
  const [columnsSouth, setColumnsSouth] = useState([]);

  
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const ordersHasBeenChanged = useSettingsStore(
    (state) => state.ordersHasBeenChanged
  );
  const setOrdersHasBeenChanged = useSettingsStore(
    (state) => state.setOrdersHasBeenChanged
  );
  const { data: database } = useLegacyFormatDatabase();


  

  const dynamicColumnsNorth = columnsNorth.map((col, i) => {
    return (
      <Column
        npmkey={col.field}
        field={col.field}
        header={col.header}
        style={col.width}
      />
    );
  });

  const dynamicColumnsSouth = columnsSouth.map((col, i) => {
    return (
      <Column
        npmkey={col.field}
        field={col.field}
        header={col.header}
        style={col.width}
      />
    );
  });

  
  useEffect(() => {
    console.log("databaseTest", database);
    database &&
      checkForUpdates(
        database,
        ordersHasBeenChanged,
        setOrdersHasBeenChanged,
        delivDate,
        setIsLoading
      ).then((db) => gatherSpecialOrdersInfo(db));
  }, [database]); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherSpecialOrdersInfo = (database) => {
    let colNorth = compose.returnSpecialNorthColumns(database,delivDate);
    let colSouth = compose.returnSpecialSouthColumns(database,delivDate);
    let BPBNSpecials = compose.returnBPBNSpecialOrders(database,delivDate);
    let BPBSSpecials = compose.returnBPBSSpecialOrders(database,delivDate);
    setBPBNSpecialOrders(BPBNSpecials.specialOrders);
    setBPBSSpecialOrders(BPBSSpecials.specialOrders);
    setColumnsNorth(colNorth.columns);
    setColumnsSouth(colSouth.columns);
  };

 
  const exportListPdfNorth = () => {
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
      `BPBN Special Orders ${convertDatetoBPBDate(delivDate)}`
    );

    finalY = 20;

    doc.setFontSize(titleFont);
    

    doc.autoTable({
      body: BPBNSpecialOrders,
      columns: columnsNorth,
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
      theme: "grid"
    });

    doc.save(`BPBNSpecial${delivDate}.pdf`);
  };

  const exportListPdfSouth = () => {
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
      `BPBS Special Orders ${convertDatetoBPBDate(delivDate)}`
    );

    finalY = 20;

    doc.setFontSize(titleFont);
    
    doc.autoTable({
      body: BPBSSpecialOrders,
      columns: columnsSouth,
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
      theme: "grid"
    });

    doc.save(`BPBSSpecial${delivDate}.pdf`);
  };

  const headerNorth = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={exportListPdfNorth}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print BPBN Special Orders List
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );

  const headerSouth = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={exportListPdfSouth}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print BPBS Special Orders List
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );

  return (
    <React.Fragment>
      <WholeBox>
        <h1>Carlton Special Orders for {convertDatetoBPBDate(delivDate)}</h1>
        <ToolBar delivDate={delivDate} setDelivDate={setDelivDate} />
        <div>{headerNorth}</div>
        <DataTable
          className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
          value={BPBNSpecialOrders}
        >
          {dynamicColumnsNorth}
        </DataTable>
      </WholeBox>
      <WholeBox>
        <h1>Prado Special Orders for {convertDatetoBPBDate(delivDate)}</h1>
        <ToolBar delivDate={delivDate} setDelivDate={setDelivDate} />
        <div>{headerSouth}</div>
        <DataTable
          className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
          value={BPBSSpecialOrders}
        >
          {dynamicColumnsSouth}
        </DataTable>
      </WholeBox>
    </React.Fragment>
  );
}

export default SpecialOrders;
