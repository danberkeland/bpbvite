import React from "react";


import {
  grabOldProd,
  checkExistsNewProd,
  updateNewProd,
  createNewProd,
} from "./ProductHelpers";


const remapProduct = () => {

  grabOldProd()
    .then((oldProd) => {
      console.log("oldProd",oldProd)
      for (let old of oldProd) {
        console.log('oldFed', old)
        checkExistsNewProd(old.nickName).then((exists) => {
          console.log("exists",exists)
          if (exists) {
            updateNewProd(old);
          } else {
            createNewProd(old);
          }
        });
      }
    })
    .then((e) => {
      console.log("Product DB updated");
    });
};


function EODCounts() {
  return <React.Fragment>
    <button onClick={remapProduct} >REMAP Products</button>
    <button onClick={remapLocations}>REMAP Locations</button>
    <button>REMAP Orders</button>
    <button>REMAP Standing</button>
    <button>REMAP Routes</button>
  </React.Fragment>;
}

export default EODCounts;