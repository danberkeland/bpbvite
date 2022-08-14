import React, { useContext } from "react";

import { SettingsContext } from "../../Contexts/SettingsContext";

import {
  grabOldLoc,
  checkExistsNewLoc,
  updateNewLoc,
  createNewLoc,
} from "./LocationHelpers";

import { Button } from "primereact/button";

function Locations() {
  const { setIsLoading } = useContext(SettingsContext);

  const remap = () => {
    setIsLoading(true);
    grabOldLoc()
      .then((oldLoc) => {
        for (let old of oldLoc) {
          checkExistsNewLoc(old.nickName).then((exists) => {
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
      <Button label="remap Locations" onClick={remap} />
    </React.Fragment>
  );
}

export default Locations;
