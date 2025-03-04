import React from "react";

// import { listZones } from "../../../graphql/queries";

// import { API, graphqlOperation } from "aws-amplify";

// import { sortAtoZDataByIndex } from "../../../utils/_deprecated/utils";

import styled from "styled-components";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ScrollPanel } from "primereact/scrollpanel";
// import { useSettingsStore } from "../../../Contexts/SettingsZustand";

const ListWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  margin: auto;
  width: 100%;
  height: 100vh;
 
`;

const ZoneList = ({ selectedZone, setSelectedZone, zones }) => {

  return (
    <ListWrapper>
      <ScrollPanel style={{ width: "100%", height: "100vh" }}>
        {zones && (
          <DataTable
            value={zones}
            className="p-datatable-striped"
            selection={selectedZone}
            onSelectionChange={e => setSelectedZone(e.value)}
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
