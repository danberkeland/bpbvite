import React, { useContext, useEffect, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { SettingsContext } from "../../Contexts/SettingsContext";

import { Button } from "primereact/button";
import { testingGrQL } from "../../restAPIs";

import { remap, remapStanding } from "./Remaps";

function Ordering() {
  const { setIsLoading } = useContext(SettingsContext);
  const [mockOrder, setMockOrder] = useState({});

  useEffect(() => {
    testingGrQL("whole", "08/20/2022", "Sat").then((result) => {
      setMockOrder(result);
    });
  }, []);

  return (
    <React.Fragment>
      <Button label="remap Orders" onClick={remap(setIsLoading)} disabled />
      <Button
        label="remap Standing"
        onClick={remapStanding(setIsLoading)}
        disabled
      />
      <div>
        <div className="card">
          <DataTable value={mockOrder} responsiveLayout="scroll">
            <Column field="prod" header="Product"></Column>
            <Column field="qty" header="Qty"></Column>
            <Column field="type" header="Type"></Column>
            <Column field="rate" header="Rate"></Column>
          </DataTable>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Ordering;
