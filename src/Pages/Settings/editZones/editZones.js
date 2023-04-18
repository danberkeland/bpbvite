import React, { useState } from "react";

import styled from "styled-components";

import ZoneList from "./ZoneList";
import Info from "./Info";
import Buttons from "./Buttons";
import {
  useRouteListFull,
  useZoneRouteListFull,
} from "../../../data/routeData";

const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 0.5fr;
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

function EditZones() {
  const [selectedZone, setSelectedZone] = useState(1);
  const [zones, setZones] = useState(null);

  return (
    <React.Fragment>
      <MainWrapper>
        <ZoneList
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
          zones={zones}
          setZones={setZones}
        />
        {selectedZone && (
          <React.Fragment>
            <DescripWrapper>
              <GroupBox id="Info">
                <Info
                  selectedZone={selectedZone}
                  setSelectedZone={setSelectedZone}
                  zones={zones}
                  setZones={setZones}
                />
              </GroupBox>
            </DescripWrapper>
          </React.Fragment>
        )}
        <DescripWrapper>
          <Buttons
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
            zones={zones}
            setZones={setZones}
          />
        </DescripWrapper>
      </MainWrapper>
    </React.Fragment>
  );
}
export default EditZones;
