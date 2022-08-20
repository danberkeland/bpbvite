import React, { useContext } from "react";

import { SettingsContext } from "../../Contexts/SettingsContext";

import {
  grabOldOrd,
  checkExistsNewOrd,
  updateNewOrd,
  createNewOrd,
} from "./OrderingHelpers";

import { Button } from "primereact/button";

import { grabOldProd } from "../Products/ProductHelpers";
import { grabOldLoc } from "../Locations/LocationHelpers";

function Ordering() {
  const { setIsLoading } = useContext(SettingsContext);

  const remap = async () => {

    
    
    let prods = await grabOldProd()
    let locs = await grabOldLoc()


    setIsLoading(true);
    grabOldOrd()
      .then((oldOrd) => {
        console.log("oldOrd",oldOrd)
        for (let old of oldOrd) {
          checkExistsNewOrd(old.id).then((exists) => {
            console.log("exists",exists)
            if (exists) {
              updateNewOrd(old, prods, locs);
            } else {
              createNewOrd(old,prods, locs);
            }
          });
        }
      })
      .then((e) => {
        setIsLoading(false);
        console.log("Ordering DB updated");
      });
  };

  return (
    <React.Fragment>
      <Button label="remap Orders" onClick={remap} />
    </React.Fragment>
  );
}

export default Ordering;
