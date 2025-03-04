import { API, graphqlOperation } from "aws-amplify";

import { listOrderBackups, getOrder } from "../../graphql/queries";
import { updateOrder, createOrder } from "../../graphql/mutations";

// *********************************
// Helpers for current Products Page
// *********************************

// ***********
// Old GraphQL
// ***********

export const grabOldOrders = async () => {
  const loc = await API.graphql(
    graphqlOperation(listOrderBackups, {
      limit: "5000",
    })
  );
  return loc.data.listOrderBackups.items;
};

export const checkExistsNewOrder = async (old) => {
  try {
    let ord = await API.graphql(graphqlOperation(getOrder, { id: old }));
    console.log("prod", ord.data.getOrder);

    return ord.data.getOrder ? true : false;
  } catch (error) {
    console.log("Order Does not exist", error);
    return false;
  }
};

const convertDelivDate = (d) => {
  let brokenDate = d.split("/");
  let delivDate = brokenDate[2] + "-" + brokenDate[0] + "-" + brokenDate[1];
  return delivDate;
};

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

export const updateNewOrder = async (old, custList, prodList) => {
  delete old.timeStamp;
  old.createdOn = old.createdAt;
  old.delivDate = convertDelivDate(old.delivDate);
  old.isLate = 0;
  old.ItemNote = old.PONote;
  old.locNick = convertCust(old.custName, custList);
  old.prodNick = convertProd(old.prodName, prodList);
  old.qtyUpdatedOn = old.createdOn;
  old.sameDayMaxQty = old.qty;
  old.ttl = 1675908000;
  old.updatedBy = "Dan Berkeland";
  old.updatedOn = old.createdOn;
  delete old.prodName;
  delete old.custName;
  delete old.createdAt;
  delete old.PONote;
  delete old.updatedAt;
  console.log("updateOld", old);
  try {
    await API.graphql(graphqlOperation(updateOrder, { input: { ...old } }));
  } catch (error) {
    console.log("error on updating orders", error);
  }
};

export const createNewOrder = async (old, custList, prodList) => {
  delete old.timeStamp;
  old.createdOn = old.createdAt;
  old.delivDate = convertDelivDate(old.delivDate);
  old.isLate = 0;
  old.ItemNote = old.PONote;
  old.locNick = convertCust(old.custName, custList);
  old.prodNick = convertProd(old.prodName, prodList);
  old.qtyUpdatedOn = old.createdOn;
  old.sameDayMaxQty = old.qty;
  old.ttl = 1675908000;
  old.updatedBy = "Dan Berkeland";
  old.updatedOn = old.createdOn;
  delete old.prodName;
  delete old.custName;
  delete old.createdAt;
  delete old.PONote;
  delete old.createdOn;
  delete old.updatedAt;
  console.log("createOld", old);
  try {
    await API.graphql(graphqlOperation(createOrder, { input: { ...old } }));
  } catch (error) {
    console.log("error on creating orders", error);
  }
};
