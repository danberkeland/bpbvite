import { API, graphqlOperation } from "aws-amplify";

import { listStandingBackups, getStanding } from "../../graphql/queries";
import { updateStanding, createStanding } from "../../graphql/mutations";

// *********************************
// Helpers for current Products Page
// *********************************

// ***********
// Old GraphQL
// ***********

export const grabOldStanding = async () => {
  const loc = await API.graphql(
    graphqlOperation(listStandingBackups, {
      limit: "5000",
    })
  );
  return loc.data.listStandingBackups.items;
};

export const checkExistsNewStanding = async (old) => {
  try {
    let stand = await API.graphql(graphqlOperation(getStanding, { id: old }));
    console.log("prod", stand.data.getStanding);

    return stand.data.getStanding ? true : false;
  } catch (error) {
    console.log("Standing Does not exist", error);
    return false;
  }
};

// const convertDelivDate = (d) => {
//   let brokenDate = d.split("/");
//   let delivDate = brokenDate[2] + "-" + brokenDate[0] + "-" + brokenDate[1];
//   return delivDate;
// };

const convertCust = (custName, custList) => {
  console.log("custListConvert", custList);
  let locNick;
  for (let c of custList) {
    if (c.locName === custName) {
      locNick = c.locNick;
    }
  }
  return locNick;
};

const convertProd = (prodName, prodList) => {
  let prodNick;
  for (let p of prodList) {
    if (p.prodName === prodName) {
      prodNick = p.prodNick;
    }
  }
  return prodNick;
};

const createNewOld = (i, old, custList, prodList) => {
  let newOld = {}
  let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  console.log("old[daysOfWeek[i]]", old[daysOfWeek[i]]);
  
  newOld.locNick = convertCust(old.custName, custList);
  newOld.prodNick = convertProd(old.prodName, prodList);
  newOld.dayOfWeek = daysOfWeek[i];
  newOld.updatedBy = "Dan Berkeland";
  newOld.qty = old[daysOfWeek[i]];
  newOld.isWhole = true;
  newOld.route = "deliv";
  newOld.startDate = "2023-02-06";
  newOld.updatedBy = "Dan Berkeland";
  newOld.createdAt = old.createdAt;
  newOld.isStand = old.isStand;
  newOld.updatedAt = old.updatedAt;

 

  return newOld;
};

export const updateNewStanding = async (old, custList, prodList) => {
  for (let i = 0; i < 7; i++) {
    let newOld = createNewOld(i, old, custList, prodList);

    console.log("updateOld", newOld);
    try {
      await API.graphql(
        graphqlOperation(updateStanding, { input: { ...newOld } })
      );
    } catch (error) {
      console.log("error on updating standing", error);
    }
  }
};

export const createNewStanding = async (old, custList, prodList) => {
  // let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < 7; i++) {
    let newOld = createNewOld(i, old, custList, prodList);
    console.log("createOld", newOld);
    try {
      await API.graphql(
        graphqlOperation(createStanding, { input: { ...newOld } })
      );
    } catch (error) {
      console.log("error on creating standing", error);
    }
  }
};
