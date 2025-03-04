import React, { useState } from "react";

import "primeflex/primeflex.css";

import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";

import {
  getCompList,
  getFlourWeight,
  getItemPercent,
  handleInput,
} from "./utils";

import styled from "styled-components";

const AddButtons = styled.div`
  display: flex;
  width: 60%;
  margin: auto;
  padding: 10px;
  justify-content: space-around;
`;

const clonedeep = require("lodash.clonedeep");

const addIngs = [
  { addIng: "Salt" },
  { addIng: "Yeast" },
  { addIng: "Sugar" },
  { addIng: "Milk Powder" },
  { addIng: "Gluten Powder" },
  { addIng: "Malt Syrup" },
  { addIng: "Barley Malt Flour" },
  { addIng: "Croix Scraps"}
];

const Additions = ({
  selectedDough,
  setSelectedDough,
  doughComponents,
  setDoughComponents,
  setIsModified,
}) => {
  const [selectedAdd, setSelectedAdd] = useState("");

  const additions = getCompList("dryplus", doughComponents, selectedDough);

  const handleAddPick = (e) => {
    setSelectedAdd(e.value.addIng);
  };

  const handleAddAdd = () => {
    let listToMod = clonedeep(doughComponents);
    let newItem = {
      dough: selectedDough.doughName,
      componentType: "dryplus",
      componentName: selectedAdd,
      amount: 0,
    };

    listToMod.push(newItem);
    setDoughComponents(listToMod);
  };

  const directWeight = (e) => {
    let fl = getFlourWeight(e, doughComponents, selectedDough);
    let percent = getItemPercent(e, doughComponents, selectedDough);
    return (fl * percent * 0.01).toFixed(2);
  };

  return (
    <React.Fragment>
      <div className="datatable-templating-demo">
        <div className="card">
          {additions.length > 0 ? (
            <DataTable value={additions} className="p-datatable-sm">
              <Column field="ing" header="Additions"></Column>
              <Column
                className="p-text-center"
                header="% flour weights"
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
                body={directWeight}
              ></Column>
              <Column
                className="p-text-center"
                header="Total %"
                body={(e) => getItemPercent(e, doughComponents, selectedDough)}
              ></Column>
            </DataTable>
          ) : (
            ""
          )}
        </div>
      </div>
      <AddButtons className="addDryPlus">
        <Dropdown
          id="addIng"
          optionLabel="addIng"
          options={addIngs}
          style={{ width: "50%" }}
          onChange={handleAddPick}
          placeholder={selectedAdd !== "" ? selectedAdd : "Select a Add Mix"}
        />
        <Button
          className="p-button-rounded p-button-outlined"
          icon="pi pi-plus"
          onClick={handleAddAdd}
        />
      </AddButtons>
    </React.Fragment>
  );
};

export default Additions;
