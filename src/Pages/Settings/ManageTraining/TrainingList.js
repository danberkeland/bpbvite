import React, { useState } from "react";

import { FilterMatchMode } from "primereact/api";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import TrainingDetails from "./TrainingDetails";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";
import { withFadeIn } from "../../../hoc/withFadeIn"; 
import { useTrainingListFull } from "../../../data/trainingData"; 

const initialState = {
  id:"",
  role: "",
  order: 0,
  heading: "",
  instruction: ""
};

function TrainingList({ selectedTraining, setSelectedTraining }) {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const setIsCreate = useSettingsStore((state) => state.setIsCreate);
  const isCreate = useSettingsStore((state) => state.isCreate);

  const [filter] = useState({
    role: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const { data:trainingList, errors:trainingListErrors } = useTrainingListFull(true);
  
  const formKeys = Object.keys(initialState)
  const tableData = trainingList?.map(item => {
    let cleanedItem = formKeys.reduce((cItem, key) => {
      if (item.hasOwnProperty(key)) return {...cItem, [key]: item[key]}
      else return {...cItem, [key]: initialState[key]}
    }, {})

    return cleanedItem
  })

  const handleClick = () => {
    setIsCreate(!isCreate);
  };

  const FadeTrainingDataTable = withFadeIn(() => {
    return (
      <div className="bpbDataTable">
        <DataTable
        className="datatable"
        value={tableData}
        selectionMode="single"
        metaKeySelection={false}
        selection={selectedTraining}
        onSelectionChange={(e) => 
          setSelectedTraining({ ...initialState, ...e.value })
        }
        sortField="order"
        sortOrder={1}
        responsiveLayout="scroll"
        filterDisplay="row"
        filters={filter}
      >
        <Column field="heading" filterPlaceholder="Search Headers" filter />
        <Column field="order"  />
      </DataTable>
      </div>
      
    );
  });

  return (
    <React.Fragment>
      {isCreate ? (
        <React.Fragment>
          <button onClick={handleClick}>+ TRAINING LIST</button>
          <TrainingDetails
            initialState={initialState}
            trainingList={trainingList.data}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <button onClick={handleClick}>+ CREATE TRAINING</button>
          {(!trainingList && !trainingListErrors) ? setIsLoading(true) : setIsLoading(false)}

          {trainingListErrors && <div>Table Failed to load</div>}
          {trainingList && <FadeTrainingDataTable />}
          <div className="bottomSpace"></div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default TrainingList;
