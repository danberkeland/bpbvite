import React from "react";


import {
  grabOldProd,
  checkExistsNewProd,
  updateNewProd,
  createNewProd,
} from "./ProductHelpers";


import {
  grabOldLoc,
  checkExistsNewLoc,
  updateNewLoc,
  createNewLoc,
} from "./LocationHelpers";


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

const remapLocation = () => {
 
  grabOldLoc()
    .then((oldLoc) => {
      console.log("oldLoc",oldLoc)
      for (let old of oldLoc) {
        checkExistsNewLoc(old.nickName).then((exists) => {
          console.log("exists",exists)
          if (exists) {
            updateNewLoc(old);
          } else {
            createNewLoc(old);
          }
        });
      }
    })
    .then((e) => {
      
      console.log("Location DB updated");
    });
};


function EODCounts() {
  return <React.Fragment>
    <button onClick={remapProduct} >REMAP Products</button>
    <button onClick={remapLocation}>REMAP Locations</button>
    <button>REMAP Orders</button>
    <button>REMAP Standing</button>
    <button>REMAP Routes</button>
  </React.Fragment>;
}

export default EODCounts;