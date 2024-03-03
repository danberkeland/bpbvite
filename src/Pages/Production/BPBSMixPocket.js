import React, { useState, useEffect } from "react";


import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import ComposeDough from "./Utils/composeDough";
import ComposeWhatToMake from "./BPBSWhatToMakeUtils/composeWhatToMake"
import { todayPlus, convertDatetoBPBDate } from "../../utils/_deprecated/dateTimeHelpers";
import { updateDoughBackup } from "../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

import jsPDF from "jspdf";
import "jspdf-autotable";

import styled from "styled-components";
import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { useLegacyFormatDatabase } from "../../data/legacyData";
import { checkForUpdates } from "../../core/checkForUpdates";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
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
  grid-template-columns: 3fr 1fr 1fr 1fr;
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
const shortage = new ComposeWhatToMake()

function BPBSMixPocket() {
  
  const [delivDate, setDelivDate] = useState(todayPlus()[0]);

  const [ pockets, setPockets ] = useState([])
  const [ doughs, setDoughs ] = useState([]);
  const [ doughComponents, setDoughComponents ] = useState([]);
  const [ shortWeight, setShortWeight ] = useState(0);

  let twoDay  = todayPlus()[2];

  useEffect(() => {
    console.log("todayPlus",todayPlus()[0])
    if (todayPlus()[0] === '2023-12-24'){
      setDelivDate('2023-12-25')
    } else {
      setDelivDate(todayPlus()[0])
    }
  },[])

  useEffect(() => {
    try{
      console.log("pockets",pockets)
      let total = 0
      for (let pock of pockets){
        total = total + pock.pocketSize*pock.qty
      }
      console.log("Total",total.toFixed(2))

      let newDoughs = clonedeep(doughs)
      let ind = doughs.findIndex(dg => dg.doughName === "French")
      console.log("ind",ind)
      
      newDoughs[ind].needed = total.toFixed(2)
      console.log("newDoughs",newDoughs)
      setDoughs(newDoughs)


    }catch{}
  },[pockets])
 
  
  
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
      ).then((db) => gatherDoughInfo(db, delivDate));
  }, [database]); // eslint-disable-line react-hooks/exhaustive-deps

  
  const gatherDoughInfo = (database,delivDate) => {
    let doughData = compose.returnDoughBreakDown(database, "Prado",delivDate);
    let shortageData = shortage.getYoullBeShort(database,delivDate)
    setDoughs(doughData.doughs);
    console.log("doughs",doughData)
    setDoughComponents(doughData.doughComponents);
    setPockets(doughData.pockets)
    let short = 0
    console.log("shortage",shortageData)
    for (let data of shortageData){
      console.log("data",data)
      let shortNum
      data.short>0 ? shortNum = data.short : shortNum = 0
      short = (short + (Number(data.pocketWeight)*Number(shortNum)))
    }
    setShortWeight(short.toFixed(2))
  };

  const handleChange = (e) => {
    if (e.code === "Enter") {
      updateDoughDB(e);
    }
  };

  const handleBlur = (e) => {
    updateDoughDB(e);
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

  const handleClick = (e, amt, mixNumber, oldDough, neededDough) => {
    let oldStuff
    console.log("oldDough",oldDough)
    console.log("amt",amt*.2)
    if (oldDough<(amt*.2)){
      oldStuff = oldDough
    } else {
      oldStuff = amt*.2
    }
    console.log("oldStuff",oldStuff)
    amt = amt - oldStuff
    amt = amt/mixNumber
    let oldStuffDiv = oldStuff/mixNumber
    console.log("oldStuffDiv",oldStuffDiv)
    let doughName = e.target.id.split("_")[0];
    let components = doughComponents.filter((dgh) => dgh.dough === doughName);
    let wetWeight = Number(
      doughs[doughs.findIndex((dgh) => dgh.doughName === doughName)].hydration
    );
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
      doc.setFontSize(10)
      doc.text(`${mixNumber} x ${amt.toFixed(2)} lb. Batch`,2.6,.36)
      doc.text(
        `${convertDatetoBPBDate(delivDate)}`,
        2.6,
        1.75
      );
      doc.setFontSize(12);
      for (let item of dryFilt) {

        if (((item.amount / dryTotals) * dryWeight)>50){
          let itemAmount = ((item.amount / dryTotals) * dryWeight)
          let bags = Math.floor(itemAmount/50)
          item.amount = dryTotals * ((dryWeight-(50 * bags))/dryWeight)
          doc.text(`50 lb. bag ${item.componentName}`, 1.2, ct);
        doc.text(
          `${bags}`,
          0.3,
          ct
        );
        
        ct += 0.24;
        }
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

    let dryplusFilt = components.filter(
      (dgh) =>
        dgh.componentType === "dryplus" &&
        dgh.componentName !== "Salt" &&
        dgh.componentName !== "Yeast"
    );
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
      doc.setFontSize(10)
      doc.text(`${mixNumber} x ${amt.toFixed(2)} lb. Batch`,2.6,.36)
      doc.text(
        `${convertDatetoBPBDate(delivDate)}`,
        2.6,
        1.75
      );
      doc.setFontSize(12);
      let ct = 0.7;
      for (let item of wetFilt) {
        
        if (((item.amount / wetTotals) * (wetWeight * dryWeight * 0.01))>30){
          let itemAmount = ((item.amount / wetTotals) * (wetWeight * dryWeight * 0.01))
          let bags = Math.floor(itemAmount/30)
          item.amount = wetTotals * (((wetWeight* dryWeight * 0.01)-(30 * bags))/(wetWeight* dryWeight * 0.01))
          doc.text(`30 lb. buckets ${item.componentName}`, 1.2, ct);
        doc.text(
          `${bags}`,
          0.3,
          ct
        );
        
        ct += 0.24;
        }
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
        doc.setFontSize(10)
        doc.text(`${mixNumber} x ${amt.toFixed(2)} lb. Batch`,2.6,.36)

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
      doc.setFontSize(10)
      doc.text(`${mixNumber} x ${amt.toFixed(2)} lb. Batch`,2.6,.36)
      doc.text(
        `${convertDatetoBPBDate(delivDate)}`,
        2.6,
        1.75
      );
      doc.setFontSize(12);
      let ct = 0.7;
      for (let item of postFilt) {
        doc.text(`${item.componentName}`, 1.2, ct);
        doc.text(`${(item.amount * dryWeight * 0.01).toFixed(2)}`, 0.3, ct);
        doc.text(`lb.`, 0.8, ct);
        ct += 0.24;
      }
    }

    let saltyeastFilt = components.filter(
      (dgh) =>
        dgh.componentType === "dryplus" &&
        (dgh.componentName === "Salt" ||
        dgh.componentName === "Yeast")
    );

    
    console.log("salty",saltyeastFilt)
    if (saltyeastFilt.length > 0) {
      doc.addPage({
        format: [2, 4],
        orientation: "l",
      });
      doc.setFontSize(14);
      doc.text(`${doughName} (Old Dough ${oldStuffDiv.toFixed(0)} lb.)`, 0.2, 0.36);
      doc.setFontSize(10)
      doc.text(`${mixNumber} x ${amt.toFixed(2)} lb. Batch`,2.6,.36)
      doc.text(
        `${convertDatetoBPBDate(delivDate)}`,
        2.6,
        1.75
      );
      doc.setFontSize(12);
      let ct = 0.7;
      for (let item of saltyeastFilt) {
        doc.text(`${item.componentName}`, 1.2, ct);
        doc.text(`${(item.amount * dryWeight * 0.01).toFixed(2)}`, 0.3, ct);
        doc.text(`lb.`, 0.8, ct);
        ct += 0.24;
      }
    }
    if (doughName === "French"){
    doc.addPage({
      format: [2, 4],
      orientation: "l",
    });
    ct = 0.7;
    doc.text(
      `${convertDatetoBPBDate(delivDate)}`,
      2.6,
      1.75
    );
    for (let item of pockets){

      let pan
    let per
    let extra
    if (item.pocketSize < 1.25){
      per = 16
    }
    if (item.pocketSize <= .35){
      per = 35
    }
    if (item.pocketSize <= .25){
      per = 48
    }
    pan = Math.floor(item.qty/per)
    extra = item.qty%per


      doc.text(`${item.pocketSize}`, 1.2, ct);
        doc.text(`${item.qty}`, 0.3, ct);
        doc.text(`x.`, 0.8, ct);
        doc.text(`${"("+per+"/pan) "+pan+" +"+extra}`,1.8,ct)
        ct += 0.24;
    }
  }

    doc.save(`${doughName}Stickers.pdf`);
  };

  const handleInput = (e) => {
    console.log("firstE",e)
    let weight = e.pocketSize
    return (
      <InputText
        id={e.weight}
        key={e.weight}
        style={{
          width: "50px",
          //backgroundColor: "#E3F2FD",
          color: "hsl(37, 100%, 5%)",
          fontWeight: "bold",
        }}
        placeholder="0"
        onKeyUp={(e) => e.code === "Enter" ? handlePockChange(e,weight) : ''}
        onBlur={(e) => handlePockChange(e,weight)}
      />
    );
  }

  const handlePockChange = (e,weight) => {
    let value = e.target.value
    console.log("pockets",pockets)
    let copyPockets = clonedeep(pockets)
    let ind = copyPockets.findIndex(cop => cop.pocketSize === weight)
    console.log("ind",ind)
    if (ind>-1){
      copyPockets[ind].carryPocket = value
    }
    
    setPockets(copyPockets)
  }

  const handleExtraInput = (e) => {
    console.log("firstE",e)
    let weight = e.pocketSize
    return (
      <InputText
        id={e.weight+"2"}
        key={e.weight+"2"}
        style={{
          width: "50px",
          //backgroundColor: "#E3F2FD",
          color: "hsl(37, 100%, 5%)",
          fontWeight: "bold",
        }}
        placeholder ={e.late}
        onKeyUp={(e) => e.code === "Enter" ? handleExtraPockChange(e,weight) : ''}
        onBlur={(e) => handleExtraPockChange(e,weight)}
      />
    );
  }

  const handleExtraPockChange = (e,weight) => {
    let value = e.target.value
    let copyPockets = clonedeep(pockets)
    let ind = copyPockets.findIndex(cop => cop.pocketSize === weight)
    console.log("ind",ind)
    if (ind>-1){
      copyPockets[ind].late = Number(value)
     
    }
    setPockets(copyPockets)
  }

  const calcTotal = (e) => {
    let final = Number(e.qtyFixed)-Number(e.carryPocket)+Number(e.late)
    e.qty = final
    return (<div>{final}</div>)
  }

  const calcPanTotal = (e) => {
    console.log("epan",e)
    let final = Number(e.qtyFixed)-Number(e.carryPocket)+Number(e.late)
    let pan
    let per
    let extra
    if (e.pocketSize < 1.25){
      per = 16
    }
    if (e.pocketSize <= .35){
      per = 35
    }
    if (e.pocketSize <= .25){
      per = 48
    }
    pan = Math.floor(final/per)
    extra = final%per
  
    return (<div>{"("+per+"/pan)  "+pan+"  +"+extra}</div>)
  }

  const handleShortChange = (e) => {
    if (e.code === "Enter") {
      setShortWeight(Number(e.target.value));
    }
  };

  const handleShortBlur = (e) => {
    setShortWeight(Number(e.target.value));
  };


  return (
    <React.Fragment>
      <WholeBox>
        <h1>BPBS French Mix/Pocket</h1>
        {doughs.filter(dgh => dgh.doughName==="French").map((dough) => (
          <React.Fragment key={dough.id + "_firstFrag"}>
            <h3>
              {dough.doughName}: (for tomorrow {dough.needed} lb.) + (short Today {shortWeight} lb.) + (buffer {dough.buffer} lb.) = TOTAL: 
              {Number(Number(shortWeight) + Number(dough.needed) + Number(dough.buffer))}
            </h3>
            <ThreeColumnGrid key={dough.id + "_first2Col"}>
              <div>
              <TwoColumnGrid key={dough.id + "_second2Col"}>
                  <span>Shortage:</span>
                  <div className="p-inputgroup">
                    <InputText
                      key={dough.id + "_oldDough"}
                      id={dough.id + "_oldDough"}
                      placeholder={shortWeight}
                      onChange={handleShortChange}
                      onBlur={handleShortBlur}
                      style={{color: "hsl(37, 100%, 5%)"}}
                    />
                    <span className="p-inputgroup-addon">lb.</span>
                  </div>
                </TwoColumnGrid>
                <TwoColumnGrid key={dough.id + "_second2Col"}>
                  <span>Old BULK Dough (to be thrown in mix):</span>
                  <div className="p-inputgroup">
                    <InputText
                      key={dough.id + "_oldDough"}
                      id={dough.id + "_oldDough"}
                      placeholder={dough.oldDough}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{color: "hsl(37, 100%, 5%)"}}
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
                      style={{color: "hsl(37, 100%, 5%)"}}
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
                    Number(dough.buffer) +
                      Number(dough.needed) + Number(shortWeight),
                      1,
                      Number(dough.oldDough)
                  )
                }
                label="Print 1x Set"
                className="p-button-rounded p-button-lg"
                icon="pi pi-print"
              >
                1x Mix
              </ButtonStyle>
              <ButtonStyle
                key={dough.id + "_print"}
                id={dough.doughName + "_print"}
                onClick={(e) =>
                  handleClick(
                    e,
                    Number(dough.buffer) +
                      Number(dough.needed) + Number(shortWeight),
                     
                      2,
                      Number(dough.oldDough)
                      
                  )
                }
                label="Print 2x Set"
                className="p-button-rounded p-button-lg"
                icon="pi pi-print"
              >
                2x Mix
              </ButtonStyle>
              <ButtonStyle
                key={dough.id + "_print"}
                id={dough.doughName + "_print"}
                onClick={(e) =>
                  handleClick(
                    e,
                    Number(dough.buffer) +
                      Number(dough.needed) + Number(shortWeight),
                      3,
                      Number(dough.oldDough)
                  )
                }
                label="Print 3x Set"
                className="p-button-rounded p-button-lg"
                icon="pi pi-print"
              >
                3x Mix
              </ButtonStyle>
              <ButtonStyle
                key={dough.id + "_print"}
                id={dough.doughName + "_print"}
                onClick={(e) =>
                  handleClick(
                    e,
                    Number(dough.buffer) +
                      Number(dough.needed) + Number(shortWeight),
                      4,
                      Number(dough.oldDough)
                  )
                }
                label="Print 4x Set"
                className="p-button-rounded p-button-lg"
                icon="pi pi-print"
              >
                4x Mix
              </ButtonStyle>
              <ButtonStyle
                key={dough.id + "_print"}
                id={dough.doughName + "_print"}
                onClick={(e) =>
                  handleClick(
                    e,
                    Number(dough.buffer) +
                      Number(dough.needed) + Number(shortWeight),
                      5,
                      Number(dough.oldDough)
                  )
                }
                label="Print 5x Set"
                className="p-button-rounded p-button-lg"
                icon="pi pi-print"
              >
                5x Mix
              </ButtonStyle>
              <ButtonStyle
                key={dough.id + "_print"}
                id={dough.doughName + "_print"}
                onClick={(e) =>
                  handleClick(
                    e,
                    Number(dough.buffer) +
                      Number(dough.needed) + Number(shortWeight),
                      6,
                      Number(dough.oldDough)
                  )
                }
                label="Print 6x Set"
                className="p-button-rounded p-button-lg"
                icon="pi pi-print"
              >
                6x Mix
              </ButtonStyle>
              <ButtonStyle
                key={dough.id + "_print"}
                id={dough.doughName + "_print"}
                onClick={(e) =>
                  handleClick(
                    e,
                    Number(dough.buffer) +
                      Number(dough.needed) + Number(shortWeight),
                      7,
                      Number(dough.oldDough)
                  )
                }
                label="Print 7x Set"
                className="p-button-rounded p-button-lg"
                icon="pi pi-print"
              >
                7x Mix
              </ButtonStyle>
              <ButtonStyle
                key={dough.id + "_print"}
                id={dough.doughName + "_print"}
                onClick={(e) =>
                  handleClick(
                    e,
                    Number(dough.buffer) +
                      Number(dough.needed) + Number(shortWeight),
                      8,
                      Number(dough.oldDough)
                  )
                }
                label="Print 8x Set"
                className="p-button-rounded p-button-lg"
                icon="pi pi-print"
              >
                8 Mix
              </ButtonStyle>
              <ButtonStyle
                key={dough.id + "_print"}
                id={dough.doughName + "_print"}
                onClick={(e) =>
                  handleClick(
                    e,
                    Number(dough.buffer) +
                      Number(dough.needed) + Number(shortWeight),
                      9,
                      Number(dough.oldDough)
                  )
                }
                label="Print 9x Set"
                className="p-button-rounded p-button-lg"
                icon="pi pi-print"
              >
                9x Mix
              </ButtonStyle>
              
            </ThreeColumnGrid>
          </React.Fragment>
        ))}
        <WholeBox>
            <h3>French Pockets</h3>
            <DataTable value={pockets} className="p-datatable-sm">
            <Column
              className="p-text-center"
              header="Carry Pockets"
              body={(e) => handleInput(e)}
            ></Column>
              <Column field="pocketSize" header="Pocket Size"></Column>
              <Column field="prepped" header="Pre Shaped"></Column>
              <Column
              className="p-text-center"
              header="Early/Extra"
              field="qty"
              body={(e) => handleExtraInput(e)}
            ></Column>
            
             
              <Column field="qty" header="Pocket Today" body={(e) => calcTotal(e)}></Column>
              <Column field="pan" header="Pan Count" body={(e) => calcPanTotal(e)}></Column>
            </DataTable>
          </WholeBox>
      </WholeBox>
    </React.Fragment>
  );
}

export default BPBSMixPocket;
