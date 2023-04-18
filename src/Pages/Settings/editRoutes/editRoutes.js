import React, { useContext, useEffect, useState } from "react";

import styled from "styled-components";


import RouteList from "./RouteList";
import Info from "./Info";
import Buttons from "./Buttons";

const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  height: 100vh;
`;

const DescripWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  display: flex;
  flex-direction: column;
  justify-items: start;
  align-content: flex-start;
  width: 100%;
  background: #ffffff;
`;

const GroupBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  border: 1px solid lightgrey;
  width: 95%;
  margin: 5px 10px;
  padding: 5px 20px;
`;

function EditRoutes() {
  const [selectedRoute, setSelectedRoute] = useState();
  const [routes, setRoutes] = useState(null);



  return (
    <React.Fragment>
      <MainWrapper>
        <RouteList
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
          routes={routes}
          setRoutes={setRoutes}
        />
        {selectedRoute && (
          <React.Fragment>
            <DescripWrapper>
              <GroupBox id="Info">
                <Info
                  selectedRoute={selectedRoute}
                  setSelectedRoute={setSelectedRoute}
                  routes={routes}
                  setRoutes={setRoutes}
                />
              </GroupBox>
            </DescripWrapper>
          </React.Fragment>
        )}
        <DescripWrapper>
          <Buttons
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
            routes={routes}
            setRoutes={setRoutes}
          />
        </DescripWrapper>
      </MainWrapper>
    </React.Fragment>
  );
}
export default EditRoutes;
