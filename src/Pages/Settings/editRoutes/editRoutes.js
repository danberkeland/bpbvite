import React, { useState, useMemo } from "react";

import styled from "styled-components";


import RouteList from "./RouteList";
import Info from "./Info";
import Buttons from "./Buttons";
import { useListData } from "../../../data/_listData";
import { sortBy } from "lodash";

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
  margin: 1rem;
  padding: 1rem 1.5rem;
  background: var(--bpb-orange-vibrant-100);
`;

function EditRoutes() {
  const [selectedRoute, setSelectedRoute] = useState();
  const [routes, setRoutes] = useState(null);

  const routeCache = useListData({ 
    tableName: "Route", 
    shouldFetch: true 
  })

  const zoneRouteCache = useListData({
    tableName: "ZoneRoute",
    shouldFetch: true
  })

  const zoneCache = useListData({
    tableName: "Zone",
    shouldFetch: true
  })

  const tableData = useMemo(() => {
    if (!routeCache.data || !zoneRouteCache.data || !zoneCache.data) return undefined

    let joinedData = routeCache.data.map(route => {
      const zones = zoneRouteCache.data.filter(zr => 
        zr.routeNick === route.routeNick
      ).map(zr => zr.zoneNick)

      return { ...route, zones }
    })

    return sortBy(joinedData, ['routeNick'])

  }, [routeCache.data, zoneRouteCache.data, zoneCache.data])

  const zoneList = useMemo(() => {
    if (zoneCache.data) return sortBy(zoneCache.data, ["zoneName"])
  }, [zoneCache.data])

  return (
      <MainWrapper>
        <RouteList
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
          routes={tableData || []}
        />
        {selectedRoute && (
          <DescripWrapper>
            <GroupBox id="Info" style={{gap: "1rem"}}>
              <Info
                selectedRoute={selectedRoute}
                setSelectedRoute={setSelectedRoute}
                routes={routes}
                setRoutes={setRoutes}
                zoneList={zoneList.map(z => z.zoneNick) || []}
              />
            </GroupBox>
          </DescripWrapper>
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
  );
}
export default EditRoutes;
