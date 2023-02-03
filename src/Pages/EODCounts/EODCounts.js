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



import {
  grabOldOrders,
  checkExistsNewOrder,
  updateNewOrder,
  createNewOrder,
} from "./OrderHelpers";


import {
  grabOldStanding,
  checkExistsNewStanding,
  updateNewStanding,
  createNewStanding,
} from "./StandingHelpers";

import { useProductList } from "../Ordering/Data/productData";
import { useLocationList } from "../Ordering/Data/locationData";


const remapProduct = (custList, prodList) => {

  grabOldProd()
    .then((oldProd) => {
      console.log("oldProd",oldProd)
      for (let old of oldProd) {
        console.log('oldFed', old)
        checkExistsNewProd(old.nickName).then((exists) => {
          console.log("exists",exists)
          if (exists) {
            updateNewProd(old, custList);
          } else {
            createNewProd(old, prodList);
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

const remapOrders = (custList, prodList) => {
 
  grabOldOrders()
    .then((oldOrders) => {
      console.log('oldOrders', oldOrders)
      for (let old of oldOrders) {
        checkExistsNewOrder(old.id).then((exists) => {
          console.log("exists",exists)
          if (exists) {
            updateNewOrder(old, custList, prodList);
          } else {
            createNewOrder(old, custList, prodList);
          }
        });
      }
    })
    .then((e) => {
      
      console.log("Location DB updated");
    });
};



const remapStanding = (custList, prodList) => {
 
  grabOldStanding()
    .then((oldStanding) => {
      console.log('oldStanding', oldStanding)
      for (let old of oldStanding) {
        checkExistsNewStanding(old.id).then((exists) => {
          console.log("exists",exists)
          if (exists) {
            updateNewStanding(old, custList, prodList);
          } else {
            createNewStanding(old, custList, prodList);
          }
        });
      }
    })
    .then((e) => {
      
      console.log("Standing DB updated");
    });
};


function EODCounts() {

  let custList = useLocationList(true)
  let prodList = useProductList(true)

  const handleRemapOrders = () => {
    console.log('custList', custList.data)
    console.log('prodList', prodList.data)
    remapOrders(custList.data, prodList.data)
  }

  const handleRemapStanding = () => {
    console.log('custList', custList.data)
    console.log('prodList', prodList.data)
    remapStanding(custList.data, prodList.data)
  }


  return <React.Fragment>
    <button onClick={remapProduct} >REMAP Products</button>
    <button onClick={remapLocation}>REMAP Locations</button>
    <button onClick={handleRemapOrders}>REMAP Orders</button>
    <button onClick={handleRemapStanding}>REMAP Standing</button>
    <button>REMAP Routes</button>
  </React.Fragment>;
}

export default EODCounts;