import React, { useContext } from "react";

import { SettingsContext } from "../../Contexts/SettingsContext";

import {
  grabOldProd,
  checkExistsNewProd,
  updateNewProd,
  createNewProd,
} from "./ProductHelpers";

import { Button } from "primereact/button";

function Products() {
  const { setIsLoading } = useContext(SettingsContext);

  const remap = () => {
    setIsLoading(true);
    grabOldProd()
      .then((oldProd) => {
        for (let old of oldProd) {
          checkExistsNewProd(old.nickName).then((exists) => {
            if (exists) {
              updateNewProd(old);
            } else {
              createNewProd(old);
            }
          });
        }
      })
      .then((e) => {
        setIsLoading(false);
        console.log("Product DB updated");
      });
  };

  return (
    <React.Fragment>
      <Button label="remap Products" onClick={remap} />
    </React.Fragment>
  );
}

export default Products;
