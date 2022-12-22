
import {
    grabOldOrd,
    checkExistsNewOrd,
    updateNewOrd,
    createNewOrd,
    grabOldStand,
    checkExistsNewStand,
    createNewStand,
    updateNewStand,
    grabNewStand,
  } from "./OrderingHelpers";

  
import { grabOldProd } from "../Products/ProductHelpers";
import { grabOldLoc } from "../Locations/LocationHelpers";


export const remap = async (setIsLoading) => {
    let prods = await grabOldProd();
    let locs = await grabOldLoc();
  
    setIsLoading(true);
    grabOldOrd()
      .then((oldOrd) => {
        console.log("oldOrd", oldOrd);
        for (let old of oldOrd) {
          checkExistsNewOrd(old.id).then((exists) => {
            console.log("exists", exists);
            if (exists) {
              updateNewOrd(old, prods, locs);
            } else {
              createNewOrd(old, prods, locs);
            }
          });
        }
      })
      .then((e) => {
        setIsLoading(false);
        console.log("Ordering DB updated");
      });
  };
  
  export const remapStanding = async (setIsLoading) => {
    let prods = await grabOldProd();
    let locs = await grabOldLoc();
    let newStand = await grabNewStand();
  
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    setIsLoading(true);
    grabOldStand()
      .then((oldStand) => {
        console.log("oldOrd", oldStand);
        for (let old of oldStand) {
          for (let day of daysOfWeek) {
            let exists = checkExistsNewStand(newStand, old, day, prods, locs);
            if (exists) {
              updateNewStand(old, day, prods, locs, exists);
            } else {
              createNewStand(old, day, prods, locs);
            }
          }
        }
      })
      .then((e) => {
        setIsLoading(false);
        console.log("Ordering DB updated");
      });
  };
  