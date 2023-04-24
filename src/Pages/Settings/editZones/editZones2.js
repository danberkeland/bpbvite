import React, { useEffect, useMemo, useState } from "react";

import styled from "styled-components";

import ZoneList from "./ZoneList";
import Info from "./Info";
import Buttons from "./Buttons";
import { useListData } from "../../../data/_listData";
import { sortBy } from "lodash";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";


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

function EditZones() {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const [selectedZone, setSelectedZone] = useState();

  const zoneCache = useListData({ tableName:"Zone", shouldFetch: "true"})
  const displayData = useMemo(() => {
    if (zoneCache.data) return sortBy(zoneCache.data, ["zoneNick"])
  }, [zoneCache.data])

  useEffect(() => {
    console.log(!!zoneCache.data)
    setIsLoading(!zoneCache.data)
  }, [zoneCache.data])


  return (
    <React.Fragment>
      <MainWrapper>

        <ZoneList
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
          zones={displayData || []}
        />
        
        <React.Fragment>
          <DescripWrapper>
            <GroupBox id="Info">
              <Info
                selectedZone={selectedZone}
                setSelectedZone={setSelectedZone}
              />
            </GroupBox>
          </DescripWrapper>
        </React.Fragment>

        <DescripWrapper>
          <Buttons
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
          />
        </DescripWrapper>
      </MainWrapper>
      <pre>{JSON.stringify(displayData, null, 2)}</pre>
    </React.Fragment>
  );
}
export default EditZones;
