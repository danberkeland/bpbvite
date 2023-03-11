import React from "react";


import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import {mixFormula} from './MixFormula'


export const BagMixesScreen = ({ mixes, doughs, infoWrap, deliv }) => {

  return (
    <React.Fragment>
      <h2>Baguette Mix #1</h2>
      <DataTable
        value={mixFormula(doughs, infoWrap, 0, deliv)}
        className="p-datatable-sm"
      >
        <Column field="title" header="Ingredient"></Column>
        <Column field="amount" header="Amount"></Column>
      </DataTable>

      {mixes > 1 && (
        <React.Fragment>
          <h2>Baguette Mix #2</h2>
          <DataTable
            value={mixFormula(doughs, infoWrap, 1, deliv)}
            className="p-datatable-sm"
          >
            <Column field="title" header="Ingredient"></Column>
            <Column field="amount" header="Amount"></Column>
          </DataTable>
        </React.Fragment>
      )}
      {mixes > 2 && (
        <React.Fragment>
          <h2>Baguette Mix #3</h2>
          <DataTable
            value={mixFormula(doughs, infoWrap, 2, deliv)}
            className="p-datatable-sm"
          >
            <Column field="title" header="Ingredient"></Column>
            <Column field="amount" header="Amount"></Column>
          </DataTable>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
