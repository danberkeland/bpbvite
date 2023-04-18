import React, { useEffect, useContext } from "react";


import { listRoutes } from "../../../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";

import { sortAtoZDataByIndex } from "../../../helpers/sortDataHelpers";

import styled from "styled-components";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ScrollPanel } from "primereact/scrollpanel";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";
import { useRouteListFull, useZoneRouteListFull } from "../../../data/routeData";

const ListWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  margin: auto;
  width: 100%;
  height: 100vh;
  background: #ffffff;
`;

const RouteList = ({ selectedRoute, setSelectedRoute }) => {

    
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  
  const { data:routes } = useRouteListFull({shouldFetch: true });
  console.log('routes', routes)
  
  

  const handleSelection = (e) => {
    setSelectedRoute(e.value);
  };

  return (
    <ListWrapper>
      <ScrollPanel style={{ width: "100%", height: "100vh" }}>
        {routes && (
          <DataTable
            value={routes}
            className="p-datatable-striped"
            selection={selectedRoute}
            onSelectionChange={handleSelection}
            selectionMode="single"
            dataKey="routeName"
          >
            <Column
              field="routeName"
              header="Routes"
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

export default RouteList;
