import React, { useEffect, useContext, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";
import ComposeWhatToPrep from "./Utils/composeWhatToPrep";

import styled from "styled-components";
import { useLegacyFormatDatabase } from "../../data/legacyData";
import { useSettingsStore } from "../../Contexts/SettingsZustand";

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

const compose = new ComposeWhatToPrep();

function BPBNBaker1WhatToPrep({ whatToPrep, setWhatToPrep, deliv, doobieStuff }) {

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;
  
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const { data: database } = useLegacyFormatDatabase();
  

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  });

  let delivDate = deliv



  
  useEffect(() => {
    gatherWhatToPrepInfo(database);
  }, [delivDate, database]); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherWhatToPrepInfo = (database) => {
    setIsLoading(true)
    try{
      let whatToPrepData = compose.returnWhatToPrepBreakDown(delivDate, database);
      setWhatToPrep(whatToPrepData.whatToPrep);
    setIsLoading(false)
    } catch {}
    
  };









  const innards = (
    <React.Fragment>
      <h1>What To Prep {convertDatetoBPBDate(delivDate)}</h1>

      <DataTable value={doobieStuff} className="p-datatable-sm">
        <Column field="Prod" header="Product"></Column>
        <Column field="Bucket" header="Bucket"></Column>
        <Column field="Mix" header="Mix"></Column>
        <Column field="Bake" header="Bake"></Column>
      </DataTable>
      <br/>

      <DataTable value={whatToPrep} className="p-datatable-sm">
        <Column field="prodName" header="Product"></Column>
        <Column field="qty" header="Qty"></Column>
      </DataTable>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {width > breakpoint ? (
        <WholeBox>

          {innards}</WholeBox>
      ) : (
        <WholeBoxPhone>{innards}</WholeBoxPhone>
      )}
    </React.Fragment>
  );
}

export default BPBNBaker1WhatToPrep;
