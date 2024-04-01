import React, { useEffect, useState, useContext, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../utils/_deprecated/dateTimeHelpers";
import ComposeRetailBags from "./utils/composeRetailBags";

import styled from "styled-components";
import { useLegacyFormatDatabase } from "../../data/legacyData";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const ButtonWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  display: flex;
  width: 40%;
  flex-direction: row;
  align-content: center;

`;

const printButtonStyle = {
  backgroundColor: "hsl(97.26, 51.67%, 40%)",
  border: "solid 1px hsl(97.26, 51.67%, 35%)",
  fontSize: "1.25rem",
}

const compose = new ComposeRetailBags();

function RetailBags() {
  const [retailBags, setRetailBags] = useState();
  if (!!retailBags) {console.log("RETAIL BAGS:", retailBags)}

  const { data: database } = useLegacyFormatDatabase({ checkForUpdates: true });

  let delivDate = todayPlus()[0];
  let tomorrow = todayPlus()[1];

  useEffect(() => {
    // console.log("databaseTest", database);
    if (database) {
      let retailBagData = compose.returnRetailBags(database);
      setRetailBags(retailBagData.retailBags);
    }
  }, [database]);


  const exportListPdf = () => {
    let finalY;
    let pageMargin = 10;
    let tableToNextTitle = 12;
    let titleToNextTable = tableToNextTitle + 4;
    let tableFont = 11;
    let titleFont = 14;

    const doc = new jsPDF("l", "mm", "a4");
    doc.setFontSize(20);
    doc.text(pageMargin, 20, `Retail Bags ${convertDatetoBPBDate(delivDate)}`);

    finalY = 20;

    doc.setFontSize(titleFont);
    doc.text(
      pageMargin,
      finalY + tableToNextTitle,
      `Prep Date: ${convertDatetoBPBDate(tomorrow)}`
    );

    doc.autoTable({
      body: retailBags,
      columns: [
        { header: "Product", dataKey: "prodName" },
        { header: "NEED TODAY", dataKey: "qty" },
        { header: "PREP FOR TOMORROW", dataKey: "tomQty" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    doc.save(`RetailBags${delivDate}.pdf`);
  };

  return (
    <React.Fragment>
      <WholeBox>
        <h1>Retail Bags for {convertDatetoBPBDate(delivDate)}</h1>
        <ButtonWrapper>
          <Button
            type="button"
            onClick={exportListPdf}
            className="p-button-success"
            data-pr-tooltip="PDF"
            style={printButtonStyle}
          >
            Print Retail Bag List
          </Button>
        </ButtonWrapper>

        <h2>Prep Date: {convertDatetoBPBDate(tomorrow)}</h2>
        <DataTable value={retailBags} className="p-datatable-sm">
          <Column field="prodName" header="Product"></Column>
          <Column field="qty" header="NEED TODAY"></Column>
          <Column field="tomQty" header="PREP FOR TOMORROW"></Column>
        </DataTable>
      </WholeBox>
    </React.Fragment>
  );
}

export default RetailBags;
