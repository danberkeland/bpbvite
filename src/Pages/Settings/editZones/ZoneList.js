import React, { useEffect } from "react";

import { listZones } from "../../../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";

import { sortAtoZDataByIndex } from "../../../helpers/sortDataHelpers";

import styled from "styled-components";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ScrollPanel } from "primereact/scrollpanel";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";

const ListWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  margin: auto;
  width: 100%;
  height: 100vh;
  background: #ffffff;
`;

const ZoneList = ({ selectedZone, setSelectedZone, zones, setZones }) => {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);

  useEffect(() => {
    setIsLoading(true);
    fetchZones();
    setIsLoading(false);
  }, [zones]);

  const fetchZones = async () => {
    try {
      const zoneData = await API.graphql(
        graphqlOperation(listZones, {
          limit: "50",
        })
      );
      const zoneList = zoneData.data.listZones.items;
      sortAtoZDataByIndex(zoneList, "zoneNick");
      let noDelete = zoneList.filter((zone) => zone["_deleted"] !== true);

      setZones(noDelete);
    } catch (error) {
      console.log("error on fetching Cust List", error);
    }
  };

  const handleSelection = (e) => {
    setSelectedZone(e.value);
  };

  return (
    <ListWrapper>
      <ScrollPanel style={{ width: "100%", height: "100vh" }}>
        {zones && (
          <DataTable
            value={zones}
            className="p-datatable-striped"
            selection={selectedZone}
            onSelectionChange={handleSelection}
            selectionMode="single"
            dataKey="zoneNick"
          >
            <Column
              field="zoneName"
              header="Zones"
              sortable
              filter
              filterPlaceholder="Search by name"
            ></Column>
          </DataTable>
        )}
      </ScrollPanel>
    </ListWrapper>
  );
};

export default ZoneList;
