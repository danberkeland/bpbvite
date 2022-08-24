import React, { useContext } from "react";

import { SettingsContext } from "../../Contexts/SettingsContext";

import {
  grabOldZone,
  checkExistsNewZone,
  updateNewZone,
  createNewZone,
  grabOldRoute,
  checkExistsNewRoute,
  updateNewRoute,
  createNewRoute,
  grabZoneRoute,
  checkExistsNewZoneRoute,
  createNewZoneRoute
} from "./SettingsHelpers";

import { Button } from "primereact/button";


function Settings() {
  const { setIsLoading } = useContext(SettingsContext);

  const remapZones = async () => {

    
    setIsLoading(true);
    grabOldZone()
      .then((oldZone) => {
        console.log("oldZone",oldZone)
        for (let old of oldZone) {
          checkExistsNewZone(old.zoneName).then((exists) => {
            console.log("exists",exists)
            if (exists) {
              updateNewZone(old);
            } else {
              createNewZone(old);
            }
          });
        }
      })
      .then((e) => {
        setIsLoading(false);
        console.log("Zone DB updated");
      });
  };

  const remapRoutes = async () => {

    
    setIsLoading(true);
    grabOldRoute()
      .then((oldRoute) => {
        console.log("oldRoute",oldRoute)
        for (let old of oldRoute) {
          checkExistsNewRoute(old.routeName).then((exists) => {
            console.log("exists",exists)
            if (exists) {
              updateNewRoute(old);
            } else {
              createNewRoute(old);
            }
          });
        }
      })
      .then((e) => {
        setIsLoading(false);
        console.log("Route DB updated");
      });
  };


  const remapZoneRoute = async () => {

    
    setIsLoading(true);

    let zones = await grabOldZone()
    let routes = await grabOldRoute()
    let zoneRoute = await grabZoneRoute()

    console.log("zones", zones)
    console.log("routes",routes)
    console.log("zoneRoute",zoneRoute)

    for (let rte of routes){
      for (let serve of rte.RouteServe){
        console.log("routeServe", rte.routeName, serve)
        let exists = checkExistsNewZoneRoute(zoneRoute,rte.routeName, serve)
          
        if (!exists) {
            await createNewZoneRoute(rte.routeName, serve);
          }   
      }
    }
    setIsLoading(false);

   
  };


  return (
    <React.Fragment>
      <Button label="remap Zones" onClick={remapZones} disabled/>
      <Button label="remap Routes" onClick={remapRoutes} disabled/>
      <Button label="remap ZoneRoute" onClick={remapZoneRoute} disabled/>

    </React.Fragment>
  );
}

export default Settings;
