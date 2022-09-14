import React from "react";

import {
  grabOldLoc,
  checkExistsNewLoc,
  updateNewLoc,
  createNewLoc,
} from "./LocationHelpers";

import { Button } from "primereact/button";
import { useSettingsStore } from "../../Contexts/SettingsZustand";

function Locations() {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);

  const remap = () => {
    setIsLoading(true);
    grabOldLoc()
      .then((oldLoc) => {
        console.log("oldLoc", oldLoc);
        for (let old of oldLoc) {
          checkExistsNewLoc(old.nickName).then((exists) => {
            console.log("exists", exists);
            if (exists) {
              updateNewLoc(old);
            } else {
              createNewLoc(old);
            }
          });
        }
      })
      .then((e) => {
        setIsLoading(false);
        console.log("Location DB updated");
      });
  };

  return (
    <React.Fragment>
      <Button label="remap Locations" onClick={remap} disabled />
    </React.Fragment>
  );
}

export default Locations;
