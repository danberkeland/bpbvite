import React, { useState } from "react";

import "primeflex/primeflex.css";

import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";

import { getCompList, getPercent, getFlourWeight, handleInput } from "./utils";

import styled from "styled-components";

const AddButtons = styled.div`
  display: flex;
  width: 60%;
  margin: auto;
  padding: 10px;
  justify-content: space-around;
`;

const clonedeep = require("lodash.clonedeep");

const dryIngs = [
  { dryIng: "Bread Flour" },
  { dryIng: "Whole Wheat Flour" },
  { dryIng: "Rye Flour" },
  { dryIng: "Hi Gluten Flour" },
  { dryIng: "All Purpose Flour" },
  { dryIng: "Gluten Powder"}
];

const Drys = ({
  selectedDough,
  doughComponents,
  setDoughComponents,
  setIsModified,
}) => {
  const [selectedDry, setSelectedDry] = useState("");

  const drys = getCompList("dry", doughComponents, selectedDough);

  const handleDryPick = (e) => {
    setSelectedDry(e.value.dryIng);
  };

  const handleAddDry = () => {
    let listToMod = clonedeep(doughComponents);
    let newItem = {
      dough: selectedDough.doughName,
      componentType: "dry",
      componentName: selectedDry,
      amount: 0,
    };

    listToMod.push(newItem);
    setDoughComponents(listToMod);
  };

  const getDryPercent = (e) => {
    let percent = getPercent(e, "dry", doughComponents, selectedDough);
    return percent * 100;
  };

  const dryWeight = (e) => {
    let fl = getFlourWeight(e, doughComponents, selectedDough);
    let percent = getPercent(e, "dry", doughComponents, selectedDough);
    return (fl * percent).toFixed(2);
  };

  return (
    <React.Fragment>
      <div className="datatable-templating-demo">
        <div className="card">
          {drys.length > 0 ? (
            <DataTable value={drys} className="p-datatable-sm">
              <Column field="ing" header="Drys"></Column>
              <Column
                className="p-text-center"
                header="Parts Dry"
                body={(e) =>
                  handleInput(
                    e,
                    doughComponents,
                    selectedDough,
                    setDoughComponents,
                    setIsModified
                  )
                }
              ></Column>
              <Column
                className="p-text-center"
                header="Weight"
                body={dryWeight}
              ></Column>
              <Column
                className="p-text-center"
                header="100%"
                body={getDryPercent}
              ></Column>
            </DataTable>
          ) : (
            ""
          )}
        </div>
      </div>
      <AddButtons className="addDry">
        <Dropdown
          id="dryIng"
          optionLabel="dryIng"
          options={dryIngs}
          style={{ width: "50%" }}
          onChange={handleDryPick}
          placeholder={selectedDry !== "" ? selectedDry : "Select a Dry Mix"}
        />
        <Button
          className="p-button-rounded p-button-outlined"
          icon="pi pi-plus"
          onClick={handleAddDry}
        />
      </AddButtons>
    </React.Fragment>
  );
};

export default Drys;
