import React, { useState, useEffect, useContext, useRef } from "react";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import ComposeCroixInfo from "./BPBSWhatToMakeUtils/composeCroixInfo";
import ComposeNorthList from "../../Logistics/utils/composeNorthList";

import { convertDatetoBPBDate, todayPlus } from "../../../utils/_deprecated/dateTimeHelpers";

import { useLegacyFormatDatabase } from "../../../data/legacyData";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";

import { API, graphqlOperation } from "aws-amplify";
import { updateProduct } from "../../../graphql/mutations";

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
  grid-template-columns: 1fr 1fr 1fr;
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

const ButtonStyle = styled.button`
  border: 0;
  background-color: #4caf50;
  color: white;
  font-size: 20px;
  border-radius: 15px;
  box-shadow: 0 9px #999;
  &:hover {
    background-color: #3e8e41;
  }
  &:active {
    background-color: #3e8e41;
    box-shadow: 0 5px #666;
    transform: translateY(4px);
  }
`;

const compose = new ComposeCroixInfo();
const compNorth = new ComposeNorthList();

const clonedeep = require("lodash.clonedeep");

function CroixCountV1() {
  const [delivDate, setDelivDate] = useState(todayPlus()[0]);
  const [mod, setMod] = useState(false);
  const [modType, setModType] = useState();
  const [openingCount, setOpeningCount] = useState();
  const [openingNorthCount, setOpeningNorthCount] = useState();
  const [closingCount, setClosingCount] = useState();
  const [closingNorthCount, setClosingNorthCount] = useState();
  const [products, setProducts] = useState();

  
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const { data: database } = useLegacyFormatDatabase({ checkForUpdates: true});

  useEffect(() => {
    console.log("databaseTest", database);
    if (database) {
      let makeData = compose.returnCroixBreakDown(database, delivDate);

      setOpeningCount(makeData.openingCount);
      setClosingCount(makeData.closingCount);
      setOpeningNorthCount(makeData.openingNorthCount);
      setClosingNorthCount(makeData.closingNorthCount);
      setProducts(makeData.products);
    }
  }, [database]); // eslint-disable-line react-hooks/exhaustive-deps

  const openingHeader = <div>Opening South</div>;
  const closeHeader = <div>Closing South</div>;

  const openingNorthHeader = <div>Opening North</div>;
  const closeNorthHeader = <div>Closing North</div>;

  const Toggle = (e, which) => {
    let newMod = clonedeep(mod);
    if (newMod === true) {
      submitNewNumbers(which);
    }
    console.log("mod", newMod);
    setMod(!newMod);
    setModType(which);
  };

  const submitNewNumbers = async (which) => {
    console.log("Submitting " + which);
    let prodToMod = clonedeep(products);
    if (which === "opening") {

      let cloneOpeningCount = clonedeep(openingCount);
      let cloneClosingCount = clonedeep(closingCount);
      setIsLoading(true);
      for (let op of openingCount) {
        for (let prod of prodToMod) {
          console.log("op", op);
          console.log("prod", prod);
          let itemUpdate;
          if (op.prod === prod.forBake) {

            let openId = cloneOpeningCount.findIndex(open => op.prod === open.prod)
            cloneOpeningCount[openId].fixed = cloneOpeningCount[openId].qty

            let closeId = cloneClosingCount.findIndex(close => op.prod === close.prod)
            cloneClosingCount[closeId].fixed = cloneClosingCount[closeId].qty

            setOpeningCount(cloneOpeningCount)
            setClosingCount(cloneClosingCount)



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
    if (which === "closing") {
     
      let cloneOpeningCount = clonedeep(openingCount);
      let cloneClosingCount = clonedeep(closingCount);
      setIsLoading(true);
      for (let op of openingCount) {
        for (let prod of prodToMod) {
          let itemUpdate;
          console.log(prod)
          if (op.prod === prod.forBake) {

            let openId = cloneOpeningCount.findIndex(open => op.prod === open.prod)
            cloneOpeningCount[openId].fixed = cloneOpeningCount[openId].qty

            let closeId = cloneClosingCount.findIndex(close => op.prod === close.prod)
            cloneClosingCount[closeId].fixed = cloneClosingCount[closeId].qty

            setOpeningCount(cloneOpeningCount)
            setClosingCount(cloneClosingCount)

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

    if (which === "openingNorth") {
      setIsLoading(true);
      for (let op of openingNorthCount) {
        for (let prod of prodToMod) {
          console.log("op", op);
          console.log("prod", prod);
          let itemUpdate;
          if (op.prod === prod.forBake) {
            itemUpdate = {
              prodNick: prod.nickName,
              freezerNorth: op.qty,
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

    if (which === "closingNorth") {
      setIsLoading(true);
      for (let op of closingNorthCount) {
        for (let prod of prodToMod) {
          let itemUpdate;
          if (op.prod === prod.forBake) {
            itemUpdate = {
              prodNick: prod.nickName,
              freezerNorthClosing: op.qty,
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



  const modifyOpening = (
    <Button
      onClick={(e) => Toggle(e, "opening")}
      className={
        mod && modType === "opening"
          ? "p-button-raised p-button-rounded p-button-danger"
          : "p-button-raised p-button-rounded p-button-success"
      }
    >
      {mod && modType === "opening" ? (
        <React.Fragment>SUBMIT</React.Fragment>
      ) : (
        <React.Fragment>MODIFY</React.Fragment>
      )}
    </Button>
  );
  const modifyClosing = (
    <Button onClick={(e) => Toggle(e, "closing")}
    className={
      mod && modType === "closing"
        ? "p-button-raised p-button-rounded p-button-danger"
        : "p-button-raised p-button-rounded p-button-success"
    }>
      {mod && modType === "closing" ? (
        <React.Fragment>SUBMIT</React.Fragment>
      ) : (
        <React.Fragment>MODIFY</React.Fragment>
      )}
    </Button>
  );

  const modifyNorthClosing = (
    <Button onClick={(e) => Toggle(e, "closingNorth")}
    className={
      mod && modType === "closingNorth"
        ? "p-button-raised p-button-rounded p-button-danger"
        : "p-button-raised p-button-rounded p-button-success"
    }
    >
      {mod && modType === "closingNorth" ? (
        <React.Fragment>SUBMIT</React.Fragment>
      ) : (
        <React.Fragment>MODIFY</React.Fragment>
      )}
    </Button>
  );

  const handleInput = (e, which) => {
    console.log("e", e);

    return (
      <InputText
        className="p-inputtext-sm"
        placeholder={e.qty}
        style={{
          width: "60px",
          backgroundColor: "#E3F2FD",
          fontWeight: "bold",
          fontSize: "1.2em",
        }}
        onKeyUp={(e2) => e2.code === "Enter" && setInfo(e2, which, e.prod)}
        onBlur={(e2) => setInfo(e2, which, e.prod)}
      />
    );
  };

  const numHolder = (e, which, day) => {
    let num = e.qty;
    if (which === "proj") {
      num = day;
    }
    return (
      <InputText
        className="p-inputtext-sm"
        disabled
        placeholder={num}
        style={{
          width: "60px",
          backgroundColor: "#E3F2FD",
          fontWeight: "bold",
          fontSize: "1.2em",
        }}
      />
    );
  };

  const setInfo = (e, which, prod) => {
    if (which === "opening") {
      console.log(e.target.value, which, prod);
      let cloneOpeningCount = clonedeep(openingCount);
      let cloneClosingCount = clonedeep(closingCount);
      for (let op of cloneOpeningCount) {
        if (op.prod === prod) {
          let ind = cloneClosingCount.findIndex((cl) => cl.prod === op.prod);
          op.qty = e.target.value;
          cloneClosingCount[ind].qty =
            cloneClosingCount[ind].fixed +
            Number(e.target.value) -
            cloneOpeningCount[ind].fixed;
        }
      }
      setClosingCount(cloneClosingCount);
      setOpeningCount(cloneOpeningCount);
    }

    if (which === "closing") {
      console.log(e.target.value, which, prod);
      let cloneOpeningCount = clonedeep(openingCount);
      let cloneClosingCount = clonedeep(closingCount);
      console.log("open", cloneOpeningCount);
      console.log("close", cloneClosingCount);
      for (let op of cloneOpeningCount) {
        if (op.prod === prod) {
          let ind = cloneClosingCount.findIndex((cl) => cl.prod === op.prod);
          op.qty =
            cloneOpeningCount[ind].fixed -
            cloneClosingCount[ind].qty +
            Number(e.target.value);
          cloneClosingCount[ind].qty = Number(e.target.value);
        }
      }
      setClosingCount(cloneClosingCount);
      setOpeningCount(cloneOpeningCount);
    }

    if (which === "openingNorth") {
      console.log(e.target.value, which, prod);
      let cloneOpeningNorthCount = clonedeep(openingNorthCount);
      let cloneClosingNorthCount = clonedeep(closingNorthCount);
      for (let op of cloneOpeningNorthCount) {
        if (op.prod === prod) {
          let ind = cloneClosingNorthCount.findIndex(
            (cl) => cl.prod === op.prod
          );
          op.qty = e.target.value;
          cloneClosingNorthCount[ind].qty =
            cloneClosingNorthCount[ind].fixed +
            Number(e.target.value) -
            cloneOpeningNorthCount[ind].fixed;
        }
      }
      setClosingNorthCount(cloneClosingNorthCount);
      setOpeningNorthCount(cloneOpeningNorthCount);
    }

    if (which === "closingNorth") {
      console.log(e.target.value, which, prod);

      let cloneClosingNorthCount = clonedeep(closingNorthCount);

      console.log("close", cloneClosingNorthCount);
      for (let op of cloneClosingNorthCount) {
        if (op.prod === prod) {
          let ind = cloneClosingNorthCount.findIndex(
            (cl) => cl.prod === op.prod
          );
          op.qty = Number(e.target.value);
          cloneClosingNorthCount[ind].qty = Number(e.target.value);
        }
      }
      setClosingNorthCount(cloneClosingNorthCount);
    }
  };

  return (
    <React.Fragment>
      <WholeBox>
        <h1>Croissant Freezer Count {convertDatetoBPBDate(delivDate)}</h1>

        <TwoColumnGrid>
          <ThreeColumnGrid>
            <BorderBox>
              <DataTable
                id="openingCount"
                value={openingCount}
                header={openingHeader}
                footer={modifyOpening}
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
                    header="Qty"
                    body={(e) => numHolder(e, "opening")}
                  ></Column>
                )}
              </DataTable>
            </BorderBox>

            <BorderBox>
              <DataTable
                id="closingCount"
                value={closingCount}
                header={closeHeader}
                footer={modifyClosing}
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
                    header="Qty"
                    id="closing"
                    body={(e) => handleInput(e, "closing")}
                  ></Column>
                ) : (
                  <Column
                    header="Qty"
                    id="closing"
                    body={(e) => numHolder(e, "closing")}
                  ></Column>
                )}
              </DataTable>
            </BorderBox>
          </ThreeColumnGrid>
          <ThreeColumnGrid>
            <BorderBox>
              <DataTable
                id="openingNorthCount"
                value={openingNorthCount}
                header={openingNorthHeader}
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

                <Column
                  header="Qty"
                  body={(e) => numHolder(e, "openingNorth")}
                ></Column>
              </DataTable>
            </BorderBox>

            <BorderBox>
              <DataTable
                id="closingNorthCount"
                value={closingNorthCount}
                header={closeNorthHeader}
                footer={modifyNorthClosing}
              >
                {mod && modType === "closingNorth" && (
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
                {mod && modType === "closingNorth" ? (
                  <Column
                    field="qty"
                    header="Qty"
                    id="closingNorth"
                    body={(e) => handleInput(e, "closingNorth")}
                  ></Column>
                ) : (
                  <Column
                    header="Qty"
                    id="closingNorth"
                    body={(e) => numHolder(e, "closingNorth")}
                  ></Column>
                )}
              </DataTable>
            </BorderBox>
          </ThreeColumnGrid>
        </TwoColumnGrid>
      </WholeBox>
    </React.Fragment>
  );
}

export default CroixCountV1;
