import React, { useState, useEffect, useRef } from "react";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CroixToMake as CroixToMakeNew } from "../NewPages/Croix/CroixToMake/CroixToMake";

import ComposeCroixInfo from "./BPBSWhatToMakeUtils/composeCroixInfo";

import { convertDatetoBPBDate, todayPlus } from "../../../utils/_deprecated/dateTimeHelpers";


import jsPDF from "jspdf";
import "jspdf-autotable";

import { useLegacyFormatDatabase } from "../../../data/legacyData";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";

import { updateProduct } from "../../../graphql/mutations";
import { confirmDialog } from 'primereact/confirmdialog'

import { API, graphqlOperation } from "aws-amplify";

import styled from "styled-components";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  column-gap: 10px;
  row-gap: 10px;
  padding: 5px;
`;

const ThreeColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.4fr 1fr;
  column-gap: 5px;
  row-gap: 10px;
  padding: 0px;
`;

const BorderBox = styled.div`
  border-style: solid;
  border-width: 1px;
  border-color: grey;
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


const compose = new ComposeCroixInfo();

const clonedeep = require("lodash.clonedeep");

function CroixToMakeLegacy() {

  const [
    delivDate, 
    // setDelivDate
  ] = useState(todayPlus()[0]);
  const [mod, setMod] = useState(false);
  const [modType, setModType] = useState();
  const [openingCount, setOpeningCount] = useState();
  const [makeCount, setMakeCount] = useState([]);
  const [closingCount, setClosingCount] = useState();
  const [projectionCount, setProjectionCount] = useState();
  const [products, setProducts] = useState();
  const [sheetTotal, setSheetTotal] = useState(0);

  useEffect(() => {
    let ct = 0
    for (let make of makeCount){
      ct += Number(make.qty)
    }
    setSheetTotal(ct)
  },[makeCount])

  
  useEffect(() => {
    confirmDialog({
      message:
        "Please make sure that MAKE TODAY numbers at the end of the day reflect what actually got made to today so tomorrow's count will be accurate.  Muchas Gracis!.",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      
    });
  },[])

  
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const { data:database } = useLegacyFormatDatabase({ checkForUpdates: true });

  useEffect(() => {
    console.log("databaseTest", database);
    if (database) {
      let makeData = compose.returnCroixBreakDown(database, delivDate);
      setOpeningCount(makeData.openingCount);
      setMakeCount(makeData.makeCount);
      setClosingCount(makeData.closingCount);
      console.log("prj",makeData.projectionCount)
      setProjectionCount(makeData.projectionCount);
      setProducts(makeData.products);
      console.log("makeData.openingCount", makeData.openingCount)
    }
  }, [database]); // eslint-disable-line react-hooks/exhaustive-deps


  const openingHeader = <div>Opening Freezer</div>;

  const makeHeader = <div>MAKE TODAY</div>;

  const closeHeader = <div>Closing Freezer</div>;

  const projectionHeader = <div>EOD Projections</div>;

  const Toggle = (e, which) => {
   
    let newMod = clonedeep(mod);
    if (newMod === true) {
      submitNewNumbers(which);
    }
    
    setMod(!newMod);
    setModType(which);
  };

  const submitNewNumbers = async (which) => {
  
    let prodToMod = clonedeep(products);
    if (which === "opening") {
      setIsLoading(true);
      for (let op of openingCount) {
        for (let prod of prodToMod) {
         
          let itemUpdate;
          if (op.prod === prod.forBake) {
            itemUpdate = {
              prodNick: prod.nickName,
              freezerCount: op.qty,
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
      }
      setIsLoading(false);
    }
    if (which === "sheets") {
      setIsLoading(true);
      for (let op of makeCount) {
        for (let prod of prodToMod) {
         
          let itemUpdate;
          if (op.prod === prod.forBake) {
            console.log("makeCount",makeCount)
            console.log("projection",projectionCount)
            // find product in projectionCount
            let projInd = projectionCount.findIndex(proj => proj.prod === op.prod)
            let freezerClosing = projectionCount[projInd].today+Number(op.total)
            // set freezerClosing to proj.today

            itemUpdate = {
              prodNick: prod.nickName,
              sheetMake: op.qty,
              freezerClosing: freezerClosing
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
      }
    
      setIsLoading(false);
    }
    if (which === "closing") {
      setIsLoading(true);
      for (let op of openingCount) {
        for (let prod of prodToMod) {
          let itemUpdate;
          if (op.prod === prod.forBake) {
            itemUpdate = {
              prodNick: prod.nickName,
              freezerCount: op.qty,
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
      }
      
      setIsLoading(false);
    }
  };

  const modifySheets = (
    <React.Fragment>
      <TwoColumnGrid>
      <div>{sheetTotal}</div>
      <Button onClick={(e) => Toggle(e, "sheets")}>
      {mod && modType === "sheets" ? (
        <React.Fragment>SUBMIT</React.Fragment>
      ) : (
        <React.Fragment>MODIFY</React.Fragment>
      )}
    </Button>
      </TwoColumnGrid>
      
    </React.Fragment>
    
  );
  const modifyOpening = (
    <Button onClick={(e) => Toggle(e, "opening")}>
      {mod && modType === "opening" ? (
        <React.Fragment>SUBMIT</React.Fragment>
      ) : (
        <React.Fragment>MODIFY</React.Fragment>
      )}
    </Button>
  );
  const modifyClosing = (
    <Button onClick={(e) => Toggle(e, "closing")}>
      {mod && modType === "closing" ? (
        <React.Fragment>SUBMIT</React.Fragment>
      ) : (
        <React.Fragment>MODIFY</React.Fragment>
      )}
    </Button>
  );

  const handleInput = (e, which) => {
  
    return (
      <InputText
        className="p-inputtext-sm"
        placeholder={e.qty}
        style={{
          width: "60px",
          backgroundColor: "#E3F2FD",
          fontWeight: "bold",
          fontSize: "1.2em"

        }}
        onKeyUp={(e2) => e2.code === "Enter" && setInfo(e2, which, e.prod)}
        onBlur={(e2) => setInfo(e2, which, e.prod)}
      />
    );
  };

  const numHolder = (e, which, day) => {

    
    let num = e.qty;
    if (which === "proj") {
      let indToMake = makeCount.findIndex(pro => pro.prod === e.prod)
      let toMake = makeCount[indToMake].total
      num = day+toMake;

    }
    let col = "#E3F2FD"
    if (num<0){
      col = "#FFC0CB"
    }
    return (
      <InputText
        className="p-inputtext-sm"
        disabled
        placeholder={num}
        style={{
          width: "80px",
          backgroundColor: col,
          color: "#000000",
          fontWeight: "bold",
          fontSize: "1.2em"

        }}
      />
    );
  };

  const setInfo = (e, which, prod) => {
    if (which === "opening") {
      
      let cloneOpeningCount = clonedeep(openingCount);
      let cloneClosingCount = clonedeep(closingCount);
      for (let op of cloneOpeningCount) {
        if (op.prod === prod) {
          let ind = cloneClosingCount.findIndex((cl) => cl.prod === op.prod);
          op.qty = e.target.value;
          cloneClosingCount[ind].qty =
            cloneClosingCount[ind].fixed + Number(e.target.value) - cloneOpeningCount[ind].fixed
        }
      }
      setClosingCount(cloneClosingCount)
      setOpeningCount(cloneOpeningCount);
    }
    if (which === "sheets") {
     
      let ind2 = products.findIndex((pro) => pro.forBake === prod);
      let cloneMakeCount = clonedeep(makeCount);
      let cloneClosingCount = clonedeep(closingCount);
      for (let op of cloneMakeCount) {
        if (op.prod === prod) {
          let ind = cloneClosingCount.findIndex((cl) => cl.prod === op.prod);
          op.qty = e.target.value;
          cloneClosingCount[ind].qty =
            cloneClosingCount[ind].fixed +
            products[ind2].batchSize * Number(e.target.value) -
            products[ind2].batchSize * cloneMakeCount[ind].fixed;
          cloneMakeCount[ind].total = products[ind2].batchSize * Number(e.target.value)
        }
      }
      setClosingCount(cloneClosingCount);
      setMakeCount(cloneMakeCount);
    }
    if (which === "closing") {
     
      let cloneOpeningCount = clonedeep(openingCount);
      let cloneClosingCount = clonedeep(closingCount);
     
      for (let op of cloneOpeningCount) {
        if (op.prod === prod) {
          let ind = cloneClosingCount.findIndex((cl) => cl.prod === op.prod);
          op.qty =
            cloneOpeningCount[ind].fixed -
            cloneClosingCount[ind].qty +
            Number(e.target.value);
          cloneClosingCount[ind].qty = Number(e.target.value)
        }
      }
      setClosingCount(cloneClosingCount)
      setOpeningCount(cloneOpeningCount);
    }
  };

  
  const exportListPdf = () => {
    let finalY;
    let pageMargin = 40;
    let tableFont = 11;
    let titleFont = 14;

    const doc = new jsPDF("l", "mm", "a4");
    doc.setFontSize(20);
    doc.text(pageMargin, 20, `What to Shape ${convertDatetoBPBDate(delivDate)}`);

    finalY = 10;

    doc.setFontSize(titleFont);

    doc.autoTable({
      body: makeCount,
      margin: pageMargin,
      columns: [
        { header: "Croix", dataKey: "prod" },
        { header: "Sheets", dataKey: "qty" },
        { header: "Total", dataKey: "total" },
        { header: "Shaper 1"},
        { header: "Shaper 2"},
        { header: "Shaper 3"},

      ],
      startY: finalY + 20,
      styles: { fontSize: tableFont },
      theme: "grid",
      headStyles: { fillColor: "#dddddd", textColor: "#111111" },
    });

    doc.save(`WhatToMake${delivDate}.pdf`);
  };


  const header = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={(e) => exportListPdf()}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print Croix Shape List
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );


  return (
    <React.Fragment>
      <WholeBox>
        <h1>Croissant Production {convertDatetoBPBDate(delivDate)}</h1>
        <div>{header}</div>
        <TwoColumnGrid>
          <ThreeColumnGrid>
            <BorderBox>
              <DataTable
                id="openingCount"
                value={openingCount}
                header={openingHeader}
                //footer={modifyOpening}
              >
                <Column
                  style={{
                    width: "90px",
                    backgroundColor: "#E3F2FD",
                    fontWeight: "bold",
                  }}
                  field="prod"
                  header="Product"
                ></Column>
                {mod && modType === "opening" ? (
                  <Column
                    header="Qty"
                    id="opening"
                    body={(e) => handleInput(e, "opening")}
                  ></Column>
                ) : (
                  <Column
                    id="qty"
                    header="Qty"
                    body={(e) => numHolder(e, "opening")}
                  ></Column>
                )}
              </DataTable>
            </BorderBox>
            <BorderBox>
              <DataTable
                id="makeCount"
                value={makeCount}
                header={makeHeader}
                footer={modifySheets}
              >
                {mod && modType === "sheets" && (
                  <Column
                    style={{
                      width: "90px",
                      backgroundColor: "#E3F2FD",
                      fontWeight: "bold",
                    }}
                    field="prod"
                    header="Prod"
                  ></Column>
                )}
                {mod && modType === "sheets" ? (
                  <Column
                    field="qty"
                    header="Sheets"
                    id="sheets"
                    body={(e) => handleInput(e, "sheets")}
                  ></Column>
                ) : (
                  <Column
                    id="qty"
                    header="Sheets"
                    body={(e) => numHolder(e, "sheets")}
                  ></Column>
                )}

                {((!mod && modType === "sheets") || modType !== "sheets") && (
                  <Column field="total" header="Total"></Column>
                )}
              </DataTable>
            </BorderBox>
            <BorderBox>
              <DataTable
                id="closingCount"
                value={projectionCount}
                header={closeHeader}
                //footer={modifyClosing}
              >
                {mod && modType === "closing" && (
                  <Column
                    style={{
                      width: "90px",
                      backgroundColor: "#E3F2FD",
                      fontWeight: "bold",
                    }}
                    field="prod"
                    header="Prod"
                  ></Column>
                )}
                {mod && modType === "closing" ? (
                  <Column
                    field="qty"
                    header="Qty"
                    id="closing"
                    body={(e) => handleInput(e, "closing")}
                  ></Column>
                ) : (
                  <Column
                    header="Qty"
                    id="closing"
                    body={(e) => numHolder(e, "proj", e.today)}
                  ></Column>
                )}
              </DataTable>
            </BorderBox>
          </ThreeColumnGrid>
          <BorderBox>
            <DataTable value={projectionCount} header={projectionHeader}>
              <Column
                style={{
                  width: "90px",
                  backgroundColor: "#E3F2FD",
                  fontWeight: "bold",
                }}
                field="prod"
                header="Product"
              ></Column>
              <Column
                header="TOM"
                body={(e) => numHolder(e, "proj", e.tom)}
              ></Column>
              <Column
                header="2DAY"
                body={(e) => numHolder(e, "proj", e["2day"])}
              ></Column>
              <Column
                header="3DAY"
                body={(e) => numHolder(e, "proj", e["3day"])}
              ></Column>
              <Column
                header="4DAY"
                body={(e) => numHolder(e, "proj", e["4day"])}
              ></Column>
            </DataTable>
          </BorderBox>
        </TwoColumnGrid>
      </WholeBox>
    </React.Fragment>
  );
}

const CroixToMake = () => {
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
      {showLegacy === true && <CroixToMakeLegacy />}
      {showLegacy === false && 
        <div style={{
          display: "flex",
          justifyContent: "center"
        }}>
          <CroixToMakeNew />
        </div>
      }
    </div>
  </>)
}

export default CroixToMake;
