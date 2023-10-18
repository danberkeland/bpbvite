import {
  convertDatetoBPBDate,
  todayPlus,
  tomBasedOnDelivDate,
} from "../helpers/dateTimeHelpers";

import {
  updateProduct,
  updateDough,
  updateDoughBackup,
} from "../graphql/mutations";

import { createOrder } from "../customGraphQL/mutations"

//import { createOrder, updateOrder, useCartOverview } from "../data/orderData";

import { API, graphqlOperation } from "aws-amplify";

import { listNotes } from "../graphql/queries";

import { getOrdersList } from "../Pages/Production/Utils/utils";
import ComposeNorthList from "../Pages/Logistics/utils/composeNorthList";
import ComposeCroixInfo from "../Pages/Logistics/utils/composeCroixInfo";
import { getTimeToLive, getTtl } from "../functions/dateAndTime";
import { keyBy } from "lodash";
import { isEqual } from "lodash";

const clonedeep = require("lodash.clonedeep");
const { DateTime } = require("luxon");

const composer = new ComposeCroixInfo();
const compose = new ComposeNorthList();

let tomorrow = todayPlus()[1];
let today = todayPlus()[0];
let yesterday2 = todayPlus()[4];
let weekAgo = todayPlus()[5];

let yesterday = convertDatetoBPBDate(todayPlus()[4]);

const fetchFromDataBase = async (baseFunc, base, limit) => {
  try {
    const data = await API.graphql(
      graphqlOperation(baseFunc, { limit: limit })
    );

    const list = data.data[base].items;
    return list;
  } catch (error) {
    console.log(`error on fetching ${base} data`, error);
  }
};

export const fetchNotes = async () => {
  let notes = await fetchFromDataBase(listNotes, "listNotess", "1000");
  return notes;
};

export const notesData = (setIsLoading) => {
  const all = new Promise((resolve, reject) => {
    resolve(fetchNotesData(setIsLoading));
  });

  return all;
};

const fetchNotesData = async (setIsLoading) => {
  let notes = await fetchNotes();

  if (!notes) {
    return [];
  } else {
    return notes;
  }
};

export const checkForUpdates = async (
  db,
  ordersHasBeenChanged,
  setOrdersHasBeenChanged,
  delivDate,
  setIsLoading
) => {
  setIsLoading(true);

  const [products, customers, routes, standing, orders, doughs, altPricing] =
    db;

  console.log("Checking if Orders Have been changed");
  let prodsToUpdate = clonedeep(products);
  let doughsToUpdate = clonedeep(doughs);
  let ordersToUpdate = clonedeep(orders);

  if (ordersHasBeenChanged) {
    console.log("changes");
    /*
      console.log("Yes they have! deleting old orders");
  
      let newYest = convertDatetoBPBDate(yesterday2);
      let newWeekAgo = convertDatetoBPBDate(weekAgo);
  
      for (let ord of ordersToUpdate) {
        let ind = customers.findIndex((cust) => cust.custName === ord.custName);
        let weeklyCheck = "daily";
  
        if (ind > -1) {
          weeklyCheck = customers[ind].invoicing;
        }
        if (
          (ord.delivDate === newYest && weeklyCheck === "daily") ||
          (ord.delivDate === newWeekAgo && weeklyCheck === "weekly")
        ) {
          let ordToUpdate = {
            id: ord.id,
          };
          try {
            await API.graphql(
              graphqlOperation(deleteOrder, { input: { ...ordToUpdate } })
            );
          } catch (error) {
            console.log("error on deleting Order", error);
          }
        }
      }
      */

    console.log("Yes they have!  Updating freezerNorth numbers");

    try {
      let bakedOrdersList = getOrdersList(tomBasedOnDelivDate(today), db);

      bakedOrdersList = prodsToUpdate.filter((frz) =>
        NorthCroixBakeFilter(frz)
      );
      console.log("bakedOrdersList", bakedOrdersList);

      // let projectionCount = composer.getProjectionCount(db, delivDate);      projection count doesn't need to be calculated; we just take from yesterdays closing count
      let frozenDelivsArray = compose.getFrozensLeavingCarlton(today, db);
      let setOutArray = compose.getBakedTomorrowAtCarlton(today, db);

      let promises = []
      for (let prod of bakedOrdersList) {
        //console.log('prod', prod)
        if (prod.freezerNorthFlag !== tomorrow) {
          prod.freezerNorthFlag = today;
        }

        if (prod.freezerNorthFlag === today) {
          // try {
          //   // let projectionCount = composer.getProjectionCount(db, delivDate);

          //   for (let proj of projectionCount) {
          //     if (prod.forBake === proj.prod) {
          //       prod.freezerCount = proj.today;
          //     }
          //   }
          // } catch {}

          prod.freezerNorth = prod.freezerNorthClosing;

          // let frozenDelivsArray = compose.getFrozensLeavingCarlton(today, db);
          let frozenDeliv;
          try {
            frozenDeliv =
              frozenDelivsArray[
                frozenDelivsArray.findIndex((fr) => fr.prod === prod.prodNick)
              ].qty;
          } catch {
            frozenDeliv = 0;
          }
          // let setOutArray = compose.getBakedTomorrowAtCarlton(today, db);
          let setOut;
          try {
            setOut =
              setOutArray[
                setOutArray.findIndex((set) => set.prod === prod.prodNick)
              ].qty;
          } catch {
            setOut = 0;
          }

          prod.freezerNorthClosing =
            prod.freezerNorthClosing +
            Math.ceil((setOut + frozenDeliv - prod.freezerNorthClosing) / 12) *
              12 -
            setOut -
            frozenDeliv +
            Number(prod.bakeExtra);

          prod.freezerNorthFlag = tomorrow;
          let prodToUpdate = {
            prodNick: prod.nickName,
            freezerNorth: prod.freezerNorth,
            freezerCount: prod.freezerClosing,
            freezerNorthClosing: prod.freezerNorthClosing,
            freezerNorthFlag: prod.freezerNorthFlag,
            sheetMake: 0,
          };

          // try {
          //   await API.graphql(
          //     graphqlOperation(updateProduct, { input: { ...prodToUpdate } })
          //   );
          //   console.log("update good");
          // } catch (error) {
          //   console.log("error on updating product", error);
          // }
          promises.push(API.graphql(
            graphqlOperation(updateProduct, { input: { ...prodToUpdate } })
          ))
        }
      }
      await Promise.all(promises)
        .then(results => {
          if (results.some(res => !!res.errors)) {
            console.log(
              "error on creating Orders:", 
              results.filter(r => !!r.errors)
            )
          } else {console.log("update good")}
        })
        .catch(error => console.error("error on creating Orders", error))
    } catch {}

    console.log("Yes they have!  Updating preshaped numbers");

    let promises = []
    for (let prod of prodsToUpdate) {
      //console.log('prodpreshaped', prod)
      
      if (prod.updatePreDate !== tomorrow) {
        prod.updatePreDate = today;
      }
      if (prod.updatePreDate === today) {
        prod.preshaped = prod.prepreshaped;
        prod.updatePreDate = tomorrow;
        let prodToUpdate = {
          prodNick: prod.nickName,
          preshaped: prod.preshaped,
          prepreshaped: prod.prepreshaped,
          updatePreDate: prod.updatePreDate,
        };

        // try {
        //   await API.graphql(
        //     graphqlOperation(updateProduct, { input: { ...prodToUpdate } })
        //   );
        //   console.log("update good");
        // } catch (error) {
        //   console.log("error on creating Orders", error);
        // }
        promises.push(API.graphql(
          graphqlOperation(updateProduct, { input: { ...prodToUpdate } })
        ))
      }
    }
    await Promise.all(promises)
      .then(results => {
        if (results.some(res => !!res.errors)) {
          console.log(
            "error on creating Orders:", 
            results.filter(r => !!r.errors)
          )
        } else {console.log("update good")}
      })
      .catch(error => console.error("error on creating Orders", error))

    console.log("Yes they have! Updating prepped bucket numbers");

    let dghPromises = []
    for (let dgh of doughsToUpdate) {
      //console.log("dgh", dgh);
      if (dgh.updatePreBucket !== tomorrow) {
        dgh.updatePreBucket = today;
      }
      if (dgh.updatePreBucket === today) {
        //  need to update correct prebucket set number
        dgh.bucketSets = dgh.preBucketSets;
        dgh.updatePreBucket = tomorrow;
        let doughToUpdate = {
          id: dgh.id,
          bucketSets: dgh.bucketSets,
          preBucketSets: dgh.preBucketSets,
          updatePreBucket: dgh.updatePreBucket,
        };

        // try {
        //   await API.graphql(
        //     graphqlOperation(updateDoughBackup, { input: { ...doughToUpdate } })
        //   );
        //   console.log("update good");
        // } catch (error) {
        //   console.log("error on creating Orders", error);
        // }
        dghPromises.push(API.graphql(
          graphqlOperation(updateDoughBackup, { input: { ...doughToUpdate } })
        ))
      }
    }
    await Promise.all(dghPromises)
      .then(results => {
        if (results.some(res => !!res.errors)) {
          console.log(
            "error on creating Orders:", 
            results.filter(r => !!r.errors)
          )
        } else {console.log("update good")}
      })
      .catch(error => console.error("error on creating Orders", error))

    console.log("Yes they have!  Loading new Square Orders in DB");

    let ord = await fetchSq(db);
    console.log("Fetched Sq orders:", ord)
    if (ord) {
      let promises = []
      for (let newOrd of ord) {
        //console.log("newSqOrd", newOrd);
        let qty = Number(newOrd["qty"]);
        let dt = new Date().toISOString();
        //console.log("dt", dt);
        let deliv = newOrd["delivDate"];
        let delivISO = new Date(deliv);
        let delivDate = deliv.split("T")[0];

        let locIDBPBN = "16VS30T9E7CM9";

        let rt = "slopick";
        let locNick = newOrd["custName"] + "__" + newOrd["id"];
        let prodNick;
        let prodName;
        try {
          prodNick =
            products[
              products.findIndex((prod) =>
                newOrd["item"].includes(prod.squareID)
              )
            ]["nickName"];
          prodName =
            products[
              products.findIndex((prod) =>
                newOrd["item"].includes(prod.squareID)
              )
            ]["prodName"];
        } catch {
          prodName="Brownie"
          prodNick = "brn";
        }

        if (newOrd.location === locIDBPBN) {
          rt = "atownpick";
        }

        let itemToAdd = {
          qty: qty,
          updatedOn: dt,
          isWhole: false,
          ItemNote: "paid",
          delivDate: delivDate,
          locNick: locNick,
          prodNick: prodNick,
          route: rt,
          ttl: delivDate ? getTtl(delivISO) : null,
          updatedBy: "bpb_admin",
        };

        //console.log("orders", orders);

        let ind = orders.findIndex(
          (ord) => locNick.includes(ord["custName"]) && (ord["prodName"] === prodName || ord["prodName"] === "Brownie")
        );

        if (ind === -1) {
          promises.push(API.graphql(
            graphqlOperation(createOrder, { input: { ...itemToAdd } })
          ))
          ordersToUpdate.push(itemToAdd)
          // try {
          //   createOrder(itemToAdd);
          //   ordersToUpdate.push(itemToAdd);
          // } catch (error) {
          //   console.log("error on creating Orders", error);
          // }
        }
      }
      await Promise.all(promises)
        .then(results => {
          if (results.some(res => !!res.errors)) {
            console.log(
              "error on creating Orders:", 
              results.filter(r => !!r.errors)
            )
          } else {console.log("update good")}
        })
        .catch(error => console.error("error on creating Orders", error))
    } else {
      console.log("Square orders did not load");
    }
  }
  let DBToMod = clonedeep(db);
  DBToMod[4] = ordersToUpdate;
  DBToMod[5] = doughsToUpdate;
  DBToMod[0] = prodsToUpdate;
  
  setIsLoading(false);
  return DBToMod;
};

const fetchSq = async () => {
  try {
    let response = await fetch(
      "https://8eo1jrov6a.execute-api.us-east-2.amazonaws.com/done"
    );

    let newOrders = await response.json();
    newOrders = JSON.parse(newOrders);
    return newOrders;
  } catch {
    console.log("Error on Square load");
  }
};

const NorthCroixBakeFilter = (ord) => {
  return ord.packGroup === "baked pastries" && ord.doughType === "Croissant";
};




// I think the most reliable strategy would be to calculate both
// closing counts from the new current day's orders.

// We should be able to use combined order data for the current day, or from
// a range of days so that we can use whatever SWR cache is available,
// so filter orders by date!
const freezerNorthFlip = async ({ productCache, orders }) => {

  const { data: PRD } = productCache

  const todayDT = DateTime.now.setZone('America/Los_Angeles').startOf('day')
  const tomorrowDT = todayDT.plus({ days: 1 })

  // freezerNorth

  const updateItems = PRD.filter(product => 

    product.packGroup === "baked pastries" 
    && product.doughNick === "Croissant"
    && product.freezerNorthFlag !== tomorrowDT.toFormat('yyyy-MM-dd')
  ).map(product => {



    return {
      prodNick: product.prodNick,
      freezerCount: product.freezerClosing,
      freezerNorth: product.freezerNorthClosing,
      // freezerClosing: '???'
      freezerNorthClosing: "???", // prod.freezerNorthClosing,
      freezerNorthFlag: tomorrowDT.toFormat('yyyy-MM-dd'),
      sheetMake: 0,
    }
  })

}



/** Copy prepreshaped values to preshaped once a day */
export const preshapedFlip = async ({ productCache, todayDT }) => {

  const { data:PRD, submitMutations, updateLocalData } = productCache

  const tomorrowISO = todayDT.plus({ days: 1 }).toFormat('yyyy-MM-dd')

  const updateInputs = PRD
    .filter(P => P.updatePreDate !== tomorrowISO)
    .map(P => ({
      prodNick: P.prodNick,
      preshaped: P.prepreshaped, // <<< move prepreshaped to preshaped
      prepreshaped: P.prepreshaped,
      updatePreDate: tomorrowISO,
    }))

  updateLocalData( await submitMutations({ updateInputs }) )

}



/** Copy preBucketSets values to bucketSets once a day */ 
export const doughFlip = async ({ doughCache, todayDT }) => {

  const { data:DGH, submitMutations, updateLocalData } = doughCache

  const tomorrowISO = todayDT.plus({ days: 1 }).toFormat('yyyy-MM-dd')

  const updateInputs = DGH
    .filter(D => D.updatePreBucket !== tomorrowISO)
    .map(D => ({
      id: D.id,
      bucketSets: D.preBucketSets, // <<< move preBuckesSets to bucketSets
      preBucketSets: D.preBucketSets,
      updatePreBucket: tomorrowISO,
    }))

  updateLocalData( await submitMutations({ updateInputs }) )

}



/** uses product & order caches generated by useListData */
export const syncSquareOrders = async ({ productCache, orderCache }) => {

  const BPBN_LOC_ID = "16VS30T9E7CM9"

  const { data:PRD=[] } = productCache
  const { 
    data:ORD=[], 
    submitMutations:submitOrders, 
    updateLocalData:updateOrderCache 
  } = orderCache

  const productsBySquareID = keyBy(PRD, 'squareID')
  const retailOrders = ORD.filter(order => order.isWhole === false)

  console.log("Fetching Square Orders...")
  const fetchURL = "https://8eo1jrov6a.execute-api.us-east-2.amazonaws.com/done"
  const squareOrders = await fetch(fetchURL)
    .then(response => response.json()) // .json() is an async method apparently
    .then(data => JSON.parse(data))
  console.log("Square orders:", squareOrders)

  const createCandidates = squareOrders.map(order => {

    const delivDate = order.delivDate.split('T')[0]
    const squareID = order.item
    const prodNick = productsBySquareID[squareID]?.prodNick ?? "brn"

    return {
      locNick: `${order.custName}__${order.id}`,
      delivDate,
      isWhole: false,
      route: order.location === BPBN_LOC_ID ? "atownpick" : "slopick",
      ItemNote: "paid",
      prodNick,
      qty: Number(order.qty),
      updatedBy: "bpb_admin",
      ttl: getTimeToLive(delivDate) ?? null,
    }
  })

  const createInputs = createCandidates.filter(cItem => 
    retailOrders.findIndex(order =>
      order.locNick === cItem.locNick
      && (order.prodNick === cItem.prodNick || order.prodNick === 'brn')
    ) === -1
  )

  console.log("Submitting to Orders:", createInputs)
  updateOrderCache( await submitOrders({ createInputs }))
  
}



const testSyncSquareOrders = ({ createCandidates, legacyItems }) => {
  const versionsMatch = createCandidates.every((input, idx) =>
    isEqual(createCandidates[idx], legacyItems[idx])
  )
  console.log("Versions produce same output?", versionsMatch)
  console.log("createCandidates", createCandidates)
  console.log("legacyItems", legacyItems)

  return versionsMatch
}

const getLegacySquareSubmitItems = ({ ord, products }) => {
  console.log("Yes they have!  Loading new Square Orders in DB");

  //let ord = await fetchSq();
  console.log("Fetched Sq orders:", ord)
  if (ord) {
    let promises = []
    for (let newOrd of ord) {
      //console.log("newSqOrd", newOrd);
      let qty = Number(newOrd["qty"]);
      let dt = new Date().toISOString();
      //console.log("dt", dt);
      let deliv = newOrd["delivDate"];
      let delivISO = new Date(deliv);
      let delivDate = deliv.split("T")[0];

      let locIDBPBN = "16VS30T9E7CM9";

      let rt = "slopick";
      let locNick = newOrd["custName"] + "__" + newOrd["id"];
      let prodNick;
      let prodName;
      try {
        prodNick =
          products[
            products.findIndex((prod) =>
              newOrd["item"].includes(prod.squareID)
            )
          ]["nickName"];
        prodName =
          products[
            products.findIndex((prod) =>
              newOrd["item"].includes(prod.squareID)
            )
          ]["prodName"];
      } catch {
        prodName="Brownie"
        prodNick = "brn";
      }

      if (newOrd.location === locIDBPBN) {
        rt = "atownpick";
      }

      let itemToAdd = {
        qty: qty,
        //updatedOn: updateTimestamp,
        isWhole: false,
        ItemNote: "paid",
        delivDate: delivDate,
        locNick: locNick,
        prodNick: prodNick,
        route: rt,
        ttl: delivDate ? getTtl(delivISO) : null,
        updatedBy: "bpb_admin",
      };

      promises.push(itemToAdd)
    }

    return promises
  }
}
