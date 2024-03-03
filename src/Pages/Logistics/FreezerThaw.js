import React, { useEffect, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

import { convertDatetoBPBDate, todayPlus } from "../../utils/_deprecated/dateTimeHelpers";

import ComposeFreezerThaw from "./utils/composeFreezerThaw";

import styled from "styled-components";

import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { useLegacyFormatDatabase } from "../../data/legacyData";
import { checkForUpdates } from "../../core/checkForUpdates";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const compose = new ComposeFreezerThaw();

function FreezerThaw() {
  const [freezerThaw, setFreezerThaw] = useState([]); console.log("freezerThaw", freezerThaw)
  const [allProds, setAllProds] = useState([]); console.log("allProds", allProds)

  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const ordersHasBeenChanged = useSettingsStore(
    (state) => state.ordersHasBeenChanged
  );
  const setOrdersHasBeenChanged = useSettingsStore(
    (state) => state.setOrdersHasBeenChanged
  );
  const { data: database } = useLegacyFormatDatabase();

  let delivDate = todayPlus()[0];

  useEffect(() => {
    console.log("databaseTest", database);
    database &&
      checkForUpdates(
        database,
        ordersHasBeenChanged,
        setOrdersHasBeenChanged,
        delivDate,
        setIsLoading
      ).then((db) => gatherFreezerThaw(db));
  }, [database]); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherFreezerThaw = (database) => {
    let { freezerThaw, allProds } = compose.returnFreezerThaw(database);

    setFreezerThaw(freezerThaw);
    setAllProds(allProds);
  };

  const calcTotal = (e) => {
    return <div>{e.qty * e.packSize}</div>;
  };

  const footerGroup = (e) => {
    let total = 0;
    let totalBags = 0;
    for (let prod of e) {
      total += prod.qty * prod.packSize;
      totalBags += prod.qty;
    }
    return (
      <ColumnGroup>
        <Row>
          <Column
            footer="Total:"
            colSpan={1}
            footerStyle={{ textAlign: "right" }}
          />
          <Column footer={totalBags + " bags"} />
          <Column footer={total + " ea."} />
        </Row>
      </ColumnGroup>
    );
  };

  return (
    <React.Fragment>
      <WholeBox>
        <h1>Freezer Thaw {convertDatetoBPBDate(delivDate)}</h1>

        {allProds &&
          allProds.map((all) => (
            <React.Fragment>
              <h3>{all}</h3>
              <DataTable
                value={freezerThaw.filter((fil) => fil.prodName === all)}
                className="p-datatable-sm"
                footerColumnGroup={footerGroup(
                  freezerThaw.filter((fil) => fil.prodName === all)
                )}
              >
                <Column field="custName" header="Customer"></Column>
                <Column field="qty" header="Qty"></Column>
                <Column
                  field="total"
                  header="Total"
                  body={(e) => calcTotal(e)}
                ></Column>
              </DataTable>
            </React.Fragment>
          ))}
      </WholeBox>
    </React.Fragment>
  );
}

export default FreezerThaw;
