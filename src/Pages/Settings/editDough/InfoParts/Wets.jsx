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

const wetIngs = [
  { wetIng: "Water" },
  { wetIng: "Vegetable Oil" },
  { wetIng: "Egg" },
  { wetIng: "Olive Oil" },
  { wetIng: "Milk" },
];

const Wets = ({
  selectedDough,
  doughComponents,
  setDoughComponents,
  setIsModified,
}) => {
  const [selectedWet, setSelectedWet] = useState("");

  const wets = getCompList("wet", doughComponents, selectedDough);

  const handleWetPick = (e) => {
    setSelectedWet(e.value.wetIng);
  };

  const handleAddWet = () => {
    let listToMod = clonedeep(doughComponents);
    let newItem = {
      dough: selectedDough.doughName,
      componentType: "wet",
      componentName: selectedWet,
      amount: 0,
    };

    listToMod.push(newItem);
    setDoughComponents(listToMod);
  };

  const getWetPercent = (e) => {
    let hydro = Number(selectedDough.hydration);
    let percent = getPercent(e, "wet", doughComponents, selectedDough);
    return percent * hydro;
  };

  const wetWeight = (e) => {
    let fl = getFlourWeight(e, doughComponents, selectedDough);
    let hydro = Number(selectedDough.hydration);
    let percent = getPercent(e, "wet", doughComponents, selectedDough);
    return (fl * percent * hydro * 0.01).toFixed(2);
  };

  return (
    <React.Fragment>
      <div className="datatable-templating-demo">
        <div className="card">
          {wets.length > 0 ? (
            <DataTable value={wets} className="p-datatable-sm">
              <Column field="ing" header="Wets"></Column>
              <Column
                className="p-text-center"
                header="Parts Wet"
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
                body={wetWeight}
              ></Column>
              <Column
                className="p-text-center"
                header={Number(selectedDough.hydration) + "%"}
                body={getWetPercent}
              ></Column>
            </DataTable>
          ) : (
            ""
          )}
        </div>
      </div>
      <AddButtons className="addWet">
        <Dropdown
          id="wetIng"
          optionLabel="wetIng"
          options={wetIngs}
          style={{ width: "50%" }}
          onChange={handleWetPick}
          placeholder={selectedWet !== "" ? selectedWet : "Select a Wet Mix"}
        />
        <Button
          className="p-button-rounded p-button-outlined"
          icon="pi pi-plus"
          onClick={handleAddWet}
        />
      </AddButtons>
    </React.Fragment>
  );
};

export default Wets;
