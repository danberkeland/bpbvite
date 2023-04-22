import React, { useState, useEffect, useContext } from "react";


import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";


import ComposeDough from "./Utils/composeDough";
// import { todayPlus } from "../../helpers/dateTimeHelpers";

import { getMixInfo } from "./BPBNBaker1Parts/GetMixInfo";
import { binInfo } from "./BPBNBaker1Parts/BinInfo";
import { panAmount } from "./BPBNBaker1Parts/PanAmount";
import { bucketAmount } from "./BPBNBaker1Parts/BucketAmount";

import { BagMixesScreen } from "./BPBNBaker1Parts/BagMixesScreen";
import { revalidateLegacyDatabase, useLegacyFormatDatabase } from "../../data/legacyData";

// import styled from "styled-components";
import { useSettingsStore } from "../../Contexts/SettingsZustand";

import { TwoColumnGrid, WholeBox, WholeBoxPhone } from "./_styles"
import { API, graphqlOperation } from "aws-amplify";
import { updateDoughBackup } from "../../graphql/mutations";

const clonedeep = require("lodash.clonedeep");
const compose = new ComposeDough();

function BPBNBaker1Dough({
  doughs,
  setDoughs,
  setDoughComponents,
  infoWrap,
  setBagAndEpiCount,
  setOliveCount,
  setBcCount,
  setBagDoughTwoDays,
  deliv
}) {

  const [mixes, setMixes] = useState([]);
  const [bin, setBin] = useState([]);
  const [pans, setPans] = useState([]);
  const [buckets, setBuckets] = useState([]);

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  });

  
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const { data: database } = useLegacyFormatDatabase();

  
  useEffect(() => {
    gatherDoughInfo(database, deliv);
  }, [deliv, database]); // eslint-disable-line react-hooks/exhaustive-deps


  const gatherDoughInfo = (database,deliv) => {
    setIsLoading(true)
    try{
    console.log("deliv1",deliv)
    let doughData = compose.returnDoughBreakDown(database, "Carlton",deliv);
    setDoughs(doughData.Baker1Dough);
    setDoughComponents(doughData.Baker1DoughComponents);
    setBagAndEpiCount(doughData.bagAndEpiCount);
    setOliveCount(doughData.oliveCount);
    setBcCount(doughData.bcCount);
    setBagDoughTwoDays(doughData.bagDoughTwoDays);
    setIsLoading(false)
    } catch {}
  };

  useEffect(() => {
    if (doughs[0] && infoWrap) {
      setMixes(getMixInfo(doughs, infoWrap)[4]);
      setBin(binInfo(doughs, infoWrap));
      setPans(panAmount(doughs, infoWrap));
      setBuckets(bucketAmount(doughs, infoWrap));
    }
  }, [doughs, infoWrap]);

  


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
      revalidateLegacyDatabase()
    } catch (error) {
      console.log("error on fetching Dough List", error);
    }
    
  };

  const doughMixList = (dough) => {
    console.log("myDough",dough)
    let doughTotal = (
      Number(dough.needed) +
      Number(dough.buffer) +
      Number(dough.short)
    ).toFixed(2);

    let doughName = dough.doughName;
    let doughNeeded = dough.needed;
    let doughShort = Number(dough.short);

    return (
      <React.Fragment key={dough.id + "_firstFrag"}>
        <div style={{
          paddingInline: "1rem",
          backgroundColor: "hsl(37, 100%, 80%)",
          paddingBlock: ".5rem",
          border: "solid 1px hsl(37, 67%, 60%)",
          borderRadius: "3px",
        }}>
        <h3>
          {doughName}: (need {doughNeeded} lb.) TOTAL:
          {doughTotal} SHORT: {doughShort}
        </h3>
        <TwoColumnGrid key={dough.id + "_first2Col"}>
          <div>
            <TwoColumnGrid key={dough.id + "_second2Col"}>
              <span>Old Dough:</span>
              <div className="p-inputgroup">
                <InputText
                  key={dough.id + "_oldDough"}
                  id={dough.id + "_oldDough"}
                  placeholder={dough.oldDough}
                  onChange={updateDoughDB}
                  onBlur={updateDoughDB}
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
                  onChange={updateDoughDB}
                  onBlur={updateDoughDB}
                />
                <span className="p-inputgroup-addon">lb.</span>
              </div>
            </TwoColumnGrid>
            <TwoColumnGrid key={dough.id + "_third2Col"}>
              <span>Actual Bucket Sets:</span>
              <div className="p-inputgroup">
                <InputText
                  key={dough.id + "_bucketSets"}
                  id={dough.id + "_bucketSets"}
                  placeholder={dough.bucketSets}
                  onChange={updateDoughDB}
                  onBlur={updateDoughDB}
                />
                <span className="p-inputgroup-addon">sets</span>
              </div>
            </TwoColumnGrid>
          </div>
        </TwoColumnGrid>
        </div>

        <BagMixesScreen mixes={mixes} doughs={doughs} infoWrap={infoWrap} deliv={deliv}/>
      </React.Fragment>
    );
  };

  const innards = (
    <React.Fragment>
      <h1>BPBN Baguette Mix</h1>
      {doughs[0] && doughMixList(doughs[0])}

      <h2>Bins</h2>
      <DataTable value={bin} className="p-datatable-sm">
        <Column field="title" header="Product"></Column>
        <Column field="amount" header="Amount"></Column>
      </DataTable>

      <h2>Pocket Pans</h2>
      <DataTable value={pans} className="p-datatable-sm">
        <Column field="title" header="Pan"></Column>
        <Column field="amount" header="Amount"></Column>
      </DataTable>

      <h2>Bucket Sets</h2>
      <DataTable value={buckets} className="p-datatable-sm">
        <Column field="title" header="Bucket Sets"></Column>
        <Column field="amount" header="Amount"></Column>
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
    </React.Fragment>
  );
}

export default BPBNBaker1Dough;
