import React, { useContext, useEffect, useRef, useState } from "react";

import styled from "styled-components";

import DoughList from "./DoughList";
import Info from "./Info";
import Buttons from "./Buttons";
import { useDoughComponents, useDoughFull } from "../../../data/doughData";

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
`;

const GroupBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  border: 1px solid lightgrey;
  width: 95%;
  margin: 5px 10px;
  padding: 5px 20px;
  background: var(--bpb-orange-vibrant-100);
`;

function EditDoughs() {
  const [selectedDough, setSelectedDough] = useState();
  const [isModified, setIsModified] = useState(null);

  const { data: doughs } = useDoughFull({ shouldFetch: true });
  const { data: doughComponents } = useDoughComponents({ shouldFetch: true });

  return (
    <React.Fragment>
      <MainWrapper>
        <DoughList
          selectedDough={selectedDough}
          setSelectedDough={setSelectedDough}
          doughs={doughs}
          doughComponents={doughComponents}
          setIsModified={setIsModified}
        />
        {selectedDough && (
          <React.Fragment>
            <DescripWrapper>
              <GroupBox id="Info">
                <Info
                  selectedDough={selectedDough}
                  setSelectedDough={setSelectedDough}
                  doughComponents={doughComponents}
                  isModified={isModified}
                  setIsModified={setIsModified}
                />
              </GroupBox>
            </DescripWrapper>
          </React.Fragment>
        )}
        <DescripWrapper>
          <Buttons
            selectedDough={selectedDough}
            setSelectedDough={setSelectedDough}
            doughs={doughs}
            doughComponents={doughComponents}
            isModified={isModified}
            setIsModified={setIsModified}
          />
        </DescripWrapper>
      </MainWrapper>
    </React.Fragment>
  );
}
export default EditDoughs;
