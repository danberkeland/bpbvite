import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import ToolBar from "../Production/BPBNBaker1Parts/Toolbar";

import {
  convertDatetoBPBDate,
  todayPlus,
} from "../../functions/legacyFunctions/helpers/dateTimeHelpers";
import { checkForUpdates } from "../../helpers/databaseFetchers";
import { useLegacyFormatDatabase } from "../../data/legacyData";

import ComposeWhatToBake from "./Utils/composeWhatToBake";

import BPBNBaker1Dough from "./BPBNBaker1Dough";
import BPBNBaker1WhatToPrep from "./BPBNBaker1WhatToPrep.js";

import { ExportPastryPrepPdf } from "./BPBNBaker1Parts/ExportPastryPrepPdf";

import styled from "styled-components";
import { useSettingsStore } from "../../Contexts/SettingsZustand";

import {
  WholeBox,
  WholeBoxPhone,
  h1Style,
} from "./_styles";

const compose = new ComposeWhatToBake();

const { DateTime } = require("luxon");
let yes =
  DateTime.now().setZone("America/Los_Angeles").ordinal % 2 === 0
    ? true
    : false;

//for push7

const doobieStuff = [
  {
    Prod: "Doobie Buns",
    Bucket: "YES",
    Mix: yes ? "NO" : "NO",
    Bake: yes ? "NO" : "NO",
  },
  {
    Prod: "Siciliano",
    Bucket: "YES",
    Mix: yes ? "NO" : "NO",
    Bake: yes ? "NO" : "NO",
  },
];

const doobieStuffx = [
  {
    Prod: "Doobie Buns",
    Bucket: "YES",
    Mix: yes ? "NO" : "NO",
    Bake: yes ? "NO" : "NO",
  },
  {
    Prod: "Siciliano",
    Bucket: "YES",
    Mix: yes ? "NO" : "NO",
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

  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const ordersHasBeenChanged = useSettingsStore(
    (state) => state.ordersHasBeenChanged
  );
  const setOrdersHasBeenChanged = useSettingsStore(
    (state) => state.setOrdersHasBeenChanged
  );
  const { data: database } = useLegacyFormatDatabase();

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  });

  useEffect(() => {
    if (todayPlus()[0] === "2023-12-24") {
      setDelivDate("2023-12-25");
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

  const gatherWhatToMakeInfo = (db) => {
    setIsLoading(true);
    try {
      let whatToMakeData = compose.returnWhatToMakeBreakDown(delivDate, db);
      setWhatToMake(whatToMakeData.whatToMake);
      setIsLoading(false);
    } catch {}
  };

  useEffect(() => {
    console.log("databaseTest", database);
    database &&
      checkForUpdates(
        database,
        ordersHasBeenChanged,
        setOrdersHasBeenChanged,
        delivDate,
        setIsLoading
      ).then((db) => gatherWhatToMakeInfo(db));
  }, [database]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePrint = () => {
    ExportPastryPrepPdf(delivDate, doughs, infoWrap, doobieStuff);
  };

  const header = (
        <Button
          type="button"
          label="Print AM Bake List"
          onClick={handlePrint}
          data-pr-tooltip="PDF"
          style={{width: "fit-content", marginBlock: "1rem"}}
        />

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
