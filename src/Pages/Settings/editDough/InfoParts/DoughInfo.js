import React from "react";

import "primeflex/primeflex.css";

import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';

// import { setValu_e, fixValu_e } from "../../../../helpers/formHelper_s";

import styled from "styled-components";

const InfoBoxes = styled.div`
  display: flex;
  width: 100%;
  margin: auto;
  padding: 10px;
  justify-content: space-around;
`;

const Title = styled.div`
  display: flex;
  font-weight: bold;
  font-size: 1.4em;
  `


const setValue = (value, selected) => {
  if (value.code === "Enter") {
    let itemToUpdate = structuredClone(selected);
    value.target.value === "true" ? value.target.value = true : 
    itemToUpdate[value.target.id] = value.target.value;
    document.getElementById(value.target.id).value = "";
    return itemToUpdate;
  }
};

const fixValue = (value, selected) => {
  let itemToUpdate = structuredClone(selected);
  if (value.target.value !== "") {
    value.target.value === "true" ? value.target.value = true : 
    itemToUpdate[value.target.id] = value.target.value;
  }
  document.getElementById(value.target.id).value = "";
  return itemToUpdate;
};

const DoughInfo = ({ selectedDough, setSelectedDough, setIsModified }) => {
  const InputStyle = {
    width: "50px",
    backgroundColor: "#E3F2FD",
    fontWeight: "bold",
  };

  const onEnter = (e) => {
    if (e.code === "Enter") {
      setSelectedDough(setValue(e, selectedDough));
      setIsModified(true);
    }
  };

  const onExit = (e) => {
    console.log("choices",e,selectedDough,e.target.id)
    setSelectedDough(fixValue(e, selectedDough));
    setIsModified(true);
  };

  const InfoInput = ({ id }) => {
    return (
      <InputText
        id={id}
        style={InputStyle}
        placeholder={selectedDough[id]}
        onKeyUp={onEnter}
        onBlur={onExit}
      />
    );
  };
  const mixedWhere = [
    {label: 'Carlton', value: 'Carlton'},
    {label: 'Prado', value: 'Prado'},
    
];

const isBakeReady = [
  {label: 'yes', value: true},
  {label: 'no', value: false},
];

const saltInDry = [
  {label: 'yes', value: true},
  {label: 'no', value: false},
];

  const InfoDrop = ({ id, options }) => {
    return (
      <Dropdown
        id={id}
        options = {options}
        value={selectedDough[id]}
        onChange={onExit}
      />
    );
  };

  return (
    <React.Fragment>
      <div className="p-grid p-ai-center">
      <Title>
        <div className="p-col">
          <div>Dough Name: {selectedDough.doughName}</div>
        </div>
      </Title>
      <InfoBoxes>
        <div className="p-col">
          <label htmlFor="mixedWhere">Where:</label>
          <InfoDrop id="mixedWhere" options={mixedWhere}/>
        </div>
        <div className="p-col">
          <label htmlFor="isBakeReady">One Day from scale to bake?</label>
          <InfoDrop id="isBakeReady" options={isBakeReady}/>
        </div>
        <div className="p-col">
          <label htmlFor="saltInDry">Include Salt with Dry?</label>
          <InfoDrop id="saltInDry" options={saltInDry}/>
        </div>
      </InfoBoxes>
      <InfoBoxes>
        <div className="p-col">
          <label htmlFor="hydration">Hydration</label>
          <InfoInput id="hydration" />%
        </div>
        <div className="p-col">
          <label htmlFor="batchSize">Default Bulk:</label>
          <InfoInput id="batchSize" />
          lb.
        </div>
        <div className="p-col">
          <label htmlFor="buffer">Buffer:</label>
          <InfoInput id="buffer" />
          lb.
        </div>
      </InfoBoxes>
      
      </div>
    </React.Fragment>
  );
};

export default DoughInfo;
