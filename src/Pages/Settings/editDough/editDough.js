import React, { useContext, useEffect, useState } from "react";

import styled from "styled-components";

import DoughList from "./DoughList";
import Info from "./Info";
import Buttons from "./Buttons";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";
import { useLegacyFormatDatabase } from "../../../data/legacyData";

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

function EditDoughs() {
  const [selectedDough, setSelectedDough] = useState();
  const [doughs, setDoughs] = useState(null);
  const [doughComponents, setDoughComponents] = useState(null);

  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const ordersHasBeenChanged = useSettingsStore(
    (state) => state.ordersHasBeenChanged
  );
  const setOrdersHasBeenChanged = useSettingsStore(
    (state) => state.setOrdersHasBeenChanged
  );
  const { data: database } = useLegacyFormatDatabase();

  const [
    products = [],
    customers = [],
    routes = [],
    standing = [],
    orders = [],
  ] = database || [];

  return (
    <React.Fragment>
      <MainWrapper>
        <DoughList
          selectedDough={selectedDough}
          setSelectedDough={setSelectedDough}
          doughs={doughs}
          setDoughs={setDoughs}
          doughComponents={doughComponents}
          setDoughComponents={setDoughComponents}
          setIsModified={setOrdersHasBeenChanged}
        />
        {selectedDough && (
          <React.Fragment>
            <DescripWrapper>
              <GroupBox id="Info">
                <Info
                  selectedDough={selectedDough}
                  setSelectedDough={setSelectedDough}
                  doughComponents={doughComponents}
                  setDoughComponents={setDoughComponents}
                  isModified={ordersHasBeenChanged}
                  setIsModified={setOrdersHasBeenChanged}
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
            setDoughs={setDoughs}
            doughComponents={doughComponents}
            setDoughComponents={setDoughComponents}
            isModified={ordersHasBeenChanged}
            setIsModified={setOrdersHasBeenChanged}
          />
        </DescripWrapper>
      </MainWrapper>
    </React.Fragment>
  );
}
export default EditDoughs;
