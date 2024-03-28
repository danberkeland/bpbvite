import React, { useState, useEffect, useContext } from "react";

import { InputText } from "primereact/inputtext";

import ComposeDough from "./Utils/composeDough";
import ComposeWhatToMake from "./BPBSWhatToMakeUtils/composeWhatToMake";

import { updateDough, updateDoughBackup } from "../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

import jsPDF from "jspdf";
import "jspdf-autotable";

import styled from "styled-components";
import { todayPlus } from "../../utils/_deprecated/dateTimeHelpers";
import { bagStickerSet } from "./Utils/bagStickerSet";
import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { useLegacyFormatDatabase } from "../../data/legacyData";
import { checkForUpdates } from "../../core/checkForUpdates";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
  row-gap: 10px;
  padding: 5px;
`;

const ThreeColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 0.75fr;
  column-gap: 10px;
  row-gap: 10px;
  padding: 5px;
`;

const ButtonStyle = styled.button`  /* background-color: #4CAF50; */
  background-color: hsl(97.26, 51.67%, 40%);
  color: white;
  font-size: 20px;
  border: solid 1px hsl(97.26, 51.67%, 35%);
  border-radius: 15px;
  box-shadow: 3px 6px 3px hsla(97.26, 10%, 52.94%, .8);
  &:hover {
    background-color: hsl(97.26, 51.67%, 35%);
  }
  &:active {
    background-color: #3E8E41;
    box-shadow: 1px 1px 3px hsla(97.26, 10%, 52.94%, .8);
    transform: translateY(4px);
  }
  `

const addUp = (acc, val) => {
  return acc + val;
};

const clonedeep = require("lodash.clonedeep");
const compose = new ComposeDough();
const composePretzel = new ComposeWhatToMake()

function BPBNBuckets({ loc }) {
  const [delivDate, setDelivDate] = useState(todayPlus()[0]);
  const [doughs, setDoughs] = useState([]);
  const [doughComponents, setDoughComponents] = useState([]);

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
      ).then((db) => gatherDoughInfo(db));
      console.log('database', database)
  }, [database]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.log("todayPlus", todayPlus()[0]);
    if (todayPlus()[0] === "2023-12-23") {
      setDelivDate("2023-12-24");
    } else {
      setDelivDate(todayPlus()[0]);
    }
  }, []);

  const gatherDoughInfo = (database) => {
    let doughData = compose.returnDoughBreakDown(database, loc, delivDate);
    let pretzelInfo = composePretzel.returnOnlyPretzel(database, delivDate)
    const index = doughData.doughs.findIndex(item => item.doughName === "Pretzel Bun");
    
    const totalPretzelWeight = pretzelInfo.pretzels.reduce((sum, item) => {
      const itemWeight = item.makeTotal * item.weight;
      return sum + itemWeight;
    }, 0);
    
    try {doughData.doughs[index].needed = totalPretzelWeight} catch {}
    
    let finalDoughs = doughData.doughs.filter((dou) => dou.mixedWhere === loc);
    setDoughs(finalDoughs);
    setDoughComponents(doughData.doughComponents);
  };

  const handleChange = (e) => {
    if (e.code === "Enter") {
      updateDoughDB(e);
    }
  };

  const handleBlur = (e) => {
    updateDoughDB(e);
  };

  const handleBagClick = () => {
    bagStickerSet();
  };

  const updateDoughDB = async (e) => {
    let id = e.target.id.split("_")[0];
    let attr = e.target.id.split("_")[1];
    let qty = e.target.value;

    let doughsToMod = clonedeep(doughs);
    doughsToMod[doughsToMod.findIndex((dgh) => dgh.id === id)][attr] = qty;
    setDoughs(doughsToMod);

    let updateDetails = {
      id: id,
      [attr]: qty,
    };

    try {
      await API.graphql(
        graphqlOperation(updateDoughBackup, { input: { ...updateDetails } })
      );
    } catch (error) {
      console.log("error on fetching Dough List", error);
    }
  };

  const handleClick = (e, amt, old) => {
    let factor = 1;
    amt = Number(amt);
    old = Number(old);

    if ((amt + old) / 3 < old) {
      let oldAmt = amt + old;
      amt = amt + old - oldAmt / 3;
      factor = factor / oldAmt;
      old = oldAmt / 3;
      console.log(factor);
    }

    let doughName = e.target.id.split("_")[0];
    let components = doughComponents.filter((dgh) => dgh.dough === doughName);
    console.log("components", components);
    let dough = doughs[doughs.findIndex((dgh) => dgh.doughName === doughName)];
    let wetWeight = Number(dough.hydration);
    let wetList = components
      .filter((dgh) => dgh.componentType === "wet")
      .map((it) => it.amount);
    let wetTotals;
    wetList.length > 0 ? (wetTotals = wetList.reduce(addUp)) : (wetTotals = 0);
    let dryList = components
      .filter((dgh) => dgh.componentType === "dry")
      .map((it) => it.amount);
    let dryTotals;
    dryList.length > 0 ? (dryTotals = dryList.reduce(addUp)) : (dryTotals = 0);
    let levList = components
      .filter((dgh) => dgh.componentType === "lev")
      .map((it) => it.amount);
    console.log("levList", levList);
    let levTotals;
    levList.length > 0 ? (levTotals = levList.reduce(addUp)) : (levTotals = 0);
    let dryplusList = components
      .filter((dgh) => dgh.componentType === "dryplus")
      .map((it) => it.amount);
    let dryplusTotals;
    dryplusList.length > 0
      ? (dryplusTotals = dryplusList.reduce(addUp))
      : (dryplusTotals = 0);
    let postList = components
      .filter((dgh) => dgh.componentType === "post")
      .map((it) => it.amount);
    let postTotals;
    postList.length > 0
      ? (postTotals = postList.reduce(addUp))
      : (postTotals = 0);
    let dryWeight =
      (100 / (100 + wetWeight + levTotals + dryplusTotals + postTotals)) * amt;

    const doc = new jsPDF({
      orientation: "l",
      unit: "in",
      format: [2, 4],
    });

    let ct = 0.7;
    let dryFilt = components.filter((dgh) => dgh.componentType === "dry");
    if (dryFilt.length > 0) {
      doc.setFontSize(14);
      doc.text(`${doughName} - Dry`, 0.2, 0.36);
      doc.setFontSize(10);
      doc.text(`${(amt + old).toFixed(2)} lb. Batch`, 2.9, 0.36);

      doc.setFontSize(12);
      for (let item of dryFilt) {
        doc.text(`${item.componentName}`, 1.2, ct);
        doc.text(
          `${((item.amount / dryTotals) * dryWeight).toFixed(2)}`,
          0.3,
          ct
        );
        doc.text(`lb.`, 0.8, ct);
        ct += 0.24;
      }
    }
    let dryplusFilt;
    console.log("dough", dough);
    if (dough.saltInDry) {
      dryplusFilt = components.filter(
        (dgh) =>
          dgh.componentType === "dryplus" && dgh.componentName !== "Yeast"
      );
    } else {
      dryplusFilt = components.filter(
        (dgh) =>
          dgh.componentType === "dryplus" &&
          dgh.componentName !== "Salt" &&
          dgh.componentName !== "Yeast"
      );
    }

    if (dryplusFilt.length > 0) {
      for (let item of dryplusFilt) {
        doc.text(`${item.componentName}`, 1.2, ct);
        doc.text(`${(item.amount * dryWeight * 0.01).toFixed(2)}`, 0.3, ct);
        doc.text(`lb.`, 0.8, ct);
        ct += 0.24;
      }
    }

    let wetFilt = components.filter((dgh) => dgh.componentType === "wet");
    if (wetFilt.length > 0) {
      doc.addPage({
        format: [2, 4],
        orientation: "l",
      });
      doc.setFontSize(14);
      doc.text(`${doughName} - Wet`, 0.2, 0.36);
      doc.setFontSize(10);
      doc.text(`${(amt + old).toFixed(2)} lb. Batch`, 2.9, 0.36);

      doc.setFontSize(12);
      let ct = 0.7;
      for (let item of wetFilt) {
        doc.text(`${item.componentName}`, 1.2, ct);
        doc.text(
          `${((item.amount / wetTotals) * wetWeight * dryWeight * 0.01).toFixed(
            2
          )}`,
          0.3,
          ct
        );
        doc.text(`lb.`, 0.8, ct);
        ct += 0.24;
      }
    }

    let levNameList = Array.from(
      new Set(
        components
          .filter((com) => com.componentType === "lev")
          .map((it) => it.componentName)
      )
    );
    for (let lev of levNameList) {
      let levFilt = doughComponents.filter((dgh) => dgh.dough === lev);

      let levList = doughComponents
        .filter((dgh) => dgh.dough === lev)
        .map((it) => it.amount);
      let levTotals;
      levList.length > 0
        ? (levTotals = levList.reduce(addUp))
        : (levTotals = 0);

      let levPercent =
        components[components.findIndex((comp) => comp.componentName === lev)]
          .amount * 0.01;

      if (levFilt.length > 0) {
        doc.addPage({
          format: [2, 4],
          orientation: "l",
        });
        doc.setFontSize(14);
        doc.text(`${doughName} - ${lev}`, 0.2, 0.36);
        doc.setFontSize(10);
        doc.text(`${(amt + old).toFixed(2)} lb. Batch`, 2.9, 0.36);

        doc.setFontSize(12);
        let ct = 0.7;
        for (let item of levFilt) {
          doc.text(`${item.componentName}`, 1.2, ct);
          doc.text(
            `${((item.amount / levTotals) * levPercent * dryWeight).toFixed(
              2
            )}`,
            0.3,
            ct
          );
          doc.text(`lb.`, 0.8, ct);
          ct += 0.24;
        }
      }
    }
    let postFilt = components.filter((dgh) => dgh.componentType === "post");
    if (postFilt.length > 0) {
      doc.addPage({
        format: [2, 4],
        orientation: "l",
      });
      doc.setFontSize(14);
      doc.text(`${doughName} - Add ins`, 0.2, 0.36);
      doc.setFontSize(10);
      doc.text(`${(amt + old).toFixed(2)} lb. Batch`, 2.9, 0.36);

      doc.setFontSize(12);
      let ct = 0.7;
      for (let item of postFilt) {
        doc.text(`${item.componentName}`, 1.2, ct);
        doc.text(`${(item.amount * dryWeight * 0.01).toFixed(2)}`, 0.3, ct);
        doc.text(`lb.`, 0.8, ct);
        ct += 0.24;
      }
    }
    let saltyeastFilt;

    if (dough.saltInDry) {
      saltyeastFilt = components.filter(
        (dgh) =>
          dgh.componentType === "dryplus" && dgh.componentName === "Yeast"
      );
    } else {
      saltyeastFilt = components.filter(
        (dgh) =>
          dgh.componentType === "dryplus" &&
          (dgh.componentName === "Salt" || dgh.componentName === "Yeast")
      );
    }

    if (saltyeastFilt.length > 0) {
      doc.addPage({
        format: [2, 4],
        orientation: "l",
      });
      doc.setFontSize(14);
      doc.text(`${doughName} - Salt & Yeast`, 0.2, 0.36);
      doc.setFontSize(10);
      doc.text(`${(amt + old).toFixed(2)} lb. Batch`, 2.9, 0.36);

      doc.setFontSize(12);
      let ct = 0.7;
      for (let item of saltyeastFilt) {
        doc.text(`${item.componentName}`, 1.2, ct);
        doc.text(`${(item.amount * dryWeight * 0.01).toFixed(2)}`, 0.3, ct);
        doc.text(`lb.`, 0.8, ct);
        ct += 0.24;
      }
      doc.text(`Old Dough`, 1.2, ct);
      doc.text(`${old.toFixed(2)}`, 0.3, ct);
      doc.text(`lb.`, 0.8, ct);
    }

    doc.save(`${doughName}Stickers.pdf`);
  };

  return (
    <React.Fragment>
      <WholeBox>
        <h1>{loc} Dough Stickers</h1>

        {loc === 'Carlton' && <a href="/Production/BPBNBuckets/v2">Go to new version</a>}

        {doughs.map((dough) => (
          <React.Fragment key={dough.id + "_firstFrag"}>
            <h3>
              {dough.doughName}: (need {dough.needed} lb.) TOTAL:
              {Number(Number(dough.needed) + Number(dough.buffer))}
            </h3>
            <ThreeColumnGrid key={dough.id + "_first2Col"}>
              <div>
                <TwoColumnGrid key={dough.id + "_second2Col"}>
                  <span>Old Dough:</span>
                  <div className="p-inputgroup">
                    <InputText
                      key={dough.id + "_oldDough"}
                      id={dough.id + "_oldDough"}
                      placeholder={dough.oldDough}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <span className="p-inputgroup-addon">lb.</span>
                  </div>
                </TwoColumnGrid>
                <TwoColumnGrid key={dough.id + "_third2Col"}>
                  <span>Buffer Dough:</span>
                  <div className="p-inputgroup">
                    <InputText
                      key={dough.id + "_buffer"}
                      id={dough.id + "_buffer"}
                      placeholder={dough.buffer}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <span className="p-inputgroup-addon">lb.</span>
                  </div>
                </TwoColumnGrid>
              </div>
              <ButtonStyle
                key={dough.id + "_print"}
                id={dough.doughName + "_print"}
                onClick={(e) =>
                  handleClick(
                    e,
                    (
                      Number(dough.buffer) +
                      Number(dough.needed) -
                      Number(dough.oldDough)
                    ).toFixed(2),
                    Number(dough.oldDough).toFixed(2)
                  )
                }
                label="Print Sticker Set"
                className="p-button-rounded p-button-lg"
                icon="pi pi-print"
              >
                Print Today Set
              </ButtonStyle>
              <ButtonStyle
                key={dough.id + "_print"}
                id={dough.doughName + "_print"}
                onClick={(e) => handleClick(e, dough.batchSize, 0)}
                label="Print Sticker Set"
                className="p-button-rounded p-button-lg"
                icon="pi pi-print"
              >
                Print Default Set
              </ButtonStyle>
              <ButtonStyle
                key={dough.id + "_print"}
                id={dough.doughName + "_print"}
                onClick={(e) =>
                  handleClick(
                    e,
                    (
                      (Number(dough.buffer) +
                        Number(dough.needed) -
                        Number(dough.oldDough)) /
                      2
                    ).toFixed(2),
                    (Number(dough.oldDough) / 2).toFixed(2)
                  )
                }
                label="Print Sticker Set"
                className="p-button-rounded p-button-lg"
                icon="pi pi-print"
              >
                Half Batch
              </ButtonStyle>
            </ThreeColumnGrid>
          </React.Fragment>
        ))}
        {loc === "Prado" && (
          <React.Fragment>
            <h3>Baguette (65 lb. - 54 baguettes)</h3>
            <ThreeColumnGrid>
              <ButtonStyle
                id="printBagStickers"
                onClick={handleBagClick}
                className="p-button-rounded p-button-lg"
                icon="pi pi-print"
              >
                Print 65 lb. Baguette Sticker Set
              </ButtonStyle>
            </ThreeColumnGrid>
          </React.Fragment>
        )}
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBNBuckets;
