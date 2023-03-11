import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import ToolBar from "./BPBNBaker1Parts/Toolbar";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";

import ComposeWhatToBake from "./Utils/composeWhatToBake";

import BPBNBaker1Dough from "./BPBNBaker1Dough";
import BPBNBaker1WhatToPrep from "./BPBNBaker1WhatToPrep.js";

import { ExportPastryPrepPdf } from "./BPBNBaker1Parts/ExportPastryPrepPdf";

import styled from "styled-components";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const WholeBoxPhone = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
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

const compose = new ComposeWhatToBake();

const { DateTime } = require("luxon");
let yes =
  DateTime.now().setZone("America/Los_Angeles").ordinal % 2 === 0
    ? true
    : false;

//for push7

const doobieStuffx = [
  {
    Prod: "Doobie Buns",
    Bucket: "YES",
    Mix: yes ? "YES" : "YES",
    Bake: yes ? "NO" : "NO",
  },
  {
    Prod: "Siciliano",
    Bucket: "YES",
    Mix: yes ? "NO" : "NO",
    Bake: yes ? "YES" : "YES",
  },
];

const doobieStuff = [
  {
    Prod: "Doobie Buns",
    Bucket: "YES",
    Mix: yes ? "NO" : "NO",
    Bake: yes ? "YES" : "YES",
  },
  {
    Prod: "Siciliano",
    Bucket: "YES",
    Mix: yes ? "YES" : "YES",
    Bake: yes ? "NO" : "NO",
  },
];

function BPBNBaker1() {
  const [delivDate, setDelivDate] = useState(todayPlus()[0]);

  const [whatToMake, setWhatToMake] = useState();
  const [whatToPrep, setWhatToPrep] = useState();
  const [doughs, setDoughs] = useState([]);
  const [doughComponents, setDoughComponents] = useState([]);
  const [bagAndEpiCount, setBagAndEpiCount] = useState([]);
  const [oliveCount, setOliveCount] = useState([]);
  const [bcCount, setBcCount] = useState([]);
  const [bagDoughTwoDays, setBagDoughTwoDays] = useState([]);
  const [infoWrap, setInfoWrap] = useState({});

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  });

  useEffect(() => {
    if (todayPlus()[0] === "2022-12-24") {
      setDelivDate("2022-12-25");
    } else {
      setDelivDate(todayPlus()[0]);
    }
  }, []);

  useEffect(() => {
    setInfoWrap({
      whatToMake: whatToMake,
      whatToPrep: whatToPrep,
      bagAndEpiCount: bagAndEpiCount,
      oliveCount: oliveCount,
      bcCount: bcCount,
      bagDoughTwoDays: bagDoughTwoDays,
    });
  }, [
    whatToMake,
    whatToPrep,
    oliveCount,
    bcCount,
    bagDoughTwoDays,
    bagAndEpiCount,
  ]);

  useEffect(() => {
    
    // Compose database as below with delivDates for chosen delvDate and next day, 
    // and packGroup of "rustic breads" or "retail".
    // and where: ["Carlton"]


    // getOrderList(delivDate)
    // getOrderList(delivDate+1)
    // concat
    // attach route info

    let database = [
      {
        delivDate: "2023-03-10",
        locNick: "Novo",
        forBake: "Baguette",
        qty: 10,
        packSize: 1,
        preshaped: 150,
        routeStart: 8.5,
        routeDepart: "Prado",
        routeArrive: "Prado",
        zone: "Downtown SLO",
        packGroup: "rustic breads",
        where: ["Carlton"],
      },
      {
        delivDate: "2023-03-10",
        locNick: "slonat",
        forBake: "Baguette",
        qty: 15,
        packSize: 1,
        preshaped: 150,
        routeStart: 8.5,
        routeDepart: "Prado",
        routeArrive: "Prado",
        zone: "Downtown SLO",
        packGroup: "retail",
        where: ["Carlton"],
      },
      {
        delivDate: "2023-03-10",
        locNick: "thill",
        forBake: "Baguette",
        qty: 20,
        packSize: 1,
        preshaped: 150,
        routeStart: 6.5,
        routeDepart: "Carlton",
        routeArrive: "Carlton",
        zone: "Paso",
        packGroup: "rustic breads",
        where: ["Carlton"],
      },
      {
        delivDate: "2023-03-11",
        locNick: "lucys",
        forBake: "Baguette",
        qty: 4,
        packSize: 1,
        preshaped: 150,
        routeStart: 6.5,
        routeDepart: "Prado",
        routeArrive: "Prado",
        zone: "Avila",
        packGroup: "rustic breads",
        where: ["Carlton"],
      },
      {
        delivDate: "2023-03-11",
        locNick: "lucys",
        forBake: "Real Lev",
        qty: 6,
        packSize: 1,
        preshaped: 6,
        routeStart: 6.5,
        routeDepart: "Prado",
        routeArrive: "Prado",
        zone: "Avila",
        packGroup: "rustic breads",
        where: ["Carlton"],
      },
    ];

    gatherWhatToMakeInfo(database);
  }, [delivDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherWhatToMakeInfo = (database) => {
    let whatToMakeData = compose.returnWhatToMakeBreakDown(delivDate, database);
    setWhatToMake(whatToMakeData.whatToMake);
  };

  const handlePrint = () => {
    ExportPastryPrepPdf(delivDate, doughs, infoWrap, doobieStuff);
  };

  const header = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={handlePrint}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print AM Bake List
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );

  const innards = (
    <React.Fragment>
      <h1>What To Bake {convertDatetoBPBDate(delivDate)}</h1>
      <ToolBar delivDate={delivDate} setDelivDate={setDelivDate} />
      <div>{width > breakpoint ? header : ""}</div>

      <DataTable value={whatToMake} className="p-datatable-sm">
        <Column field="forBake" header="Product"></Column>
        <Column field="qty" header="Qty"></Column>
        <Column field="shaped" header="Shaped"></Column>
        <Column field="short" header="Short"></Column>
        <Column field="needEarly" header="Need Early"></Column>
      </DataTable>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {width > breakpoint ? (
        <WholeBox>{innards}</WholeBox>
      ) : (
        <WholeBoxPhone>{innards}</WholeBoxPhone>
      )}

      <BPBNBaker1WhatToPrep
        whatToPrep={whatToPrep}
        setWhatToPrep={setWhatToPrep}
        deliv={delivDate}
        doobieStuff={doobieStuff}
      />
      <BPBNBaker1Dough
        doughs={doughs}
        setDoughs={setDoughs}
        doughComponents={doughComponents}
        setDoughComponents={setDoughComponents}
        setBagAndEpiCount={setBagAndEpiCount}
        setOliveCount={setOliveCount}
        setBcCount={setBcCount}
        setBagDoughTwoDays={setBagDoughTwoDays}
        infoWrap={infoWrap}
        deliv={delivDate}
      />
    </React.Fragment>
  );
}

export default BPBNBaker1;
