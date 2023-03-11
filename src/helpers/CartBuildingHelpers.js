import { convertDatetoBPBDate, todayPlus } from "../helpers/dateTimeHelpers";
import { sortAtoZDataByIndex } from "../helpers/sortDataHelpers";

import { wildcardRegExp } from "wildcard-regex";

const { DateTime } = require("luxon");

const clonedeep = require("lodash.clonedeep");

const today = todayPlus()[0];

export const getFullOrders = (delivDate, database) => {
  const [products, customers, routes, standing, orders] = database;
  let buildOrders = buildCartList("*", delivDate, orders);
  let buildStand = buildStandList("*", delivDate, standing);
  let fullOrder = compileFullOrderList(buildOrders, buildStand);

  return fullOrder;
};

export const getFullProdOrders = (delivDate, database) => {
  const [products, customers, routes, standing, orders] = database;
  let buildOrders = buildCartList("*", delivDate, orders);
  let buildStand = buildProdStandList("*", delivDate, standing);
  let fullOrder = compileFullOrderList(buildOrders, buildStand);

  return fullOrder;
};

export const buildCartList = (chosen, delivDate, orders) => {
  let BPBDate = convertDatetoBPBDate(delivDate);
  let filteredOrders = clonedeep(orders);
  let builtCartList = [];
  if (filteredOrders) {
    builtCartList = filteredOrders.filter(
      (order) =>
        order["delivDate"] === BPBDate &&
        order["custName"].match(wildcardRegExp(`${chosen}`))
    );
  }
  builtCartList = builtCartList.filter(ord => ord.prodName !== '')
  return builtCartList;
};

export const buildStandList = (chosen, delivDate, standing, route, ponote) => {
  let filteredStanding = clonedeep(standing);
  let builtStandList = [];
  builtStandList = filteredStanding.filter((stand) =>
    stand["custName"].match(wildcardRegExp(`${chosen}`))
  );

  builtStandList = builtStandList.filter((stand) => stand.isStand === true);

  let convertedStandList = convertStandListtoStandArray(
    builtStandList,
    delivDate,
    route,
    ponote
  );
  return convertedStandList;
};

export const buildProdStandList = (
  chosen,
  delivDate,
  standing,
  route,
  ponote
) => {
  let filteredStanding = clonedeep(standing);
  let builtStandList = [];
  builtStandList = filteredStanding.filter((standing) =>
    standing["custName"].match(wildcardRegExp(`${chosen}`))
  );

  let convertedStandList = convertStandListtoStandArray(
    builtStandList,
    delivDate,
    route,
    ponote
  );
  return convertedStandList;
};

const convertStandListtoStandArray = (
  builtStandList,
  delivDate,
  route,
  ponote
) => {
  let dateSplit = delivDate.split("-");
  let dayOfWeek = DateTime.local(
    Number(dateSplit[0]),
    Number(dateSplit[1]),
    Number(dateSplit[2])
  ).weekdayShort;
  let convertedStandList = builtStandList.map((order) => ({
    id: null,
    version: order["_version"],
    qty: order[dayOfWeek],
    prodName: order["prodName"],
    custName: order["custName"],

    isWhole: true,
    delivDate: convertDatetoBPBDate(delivDate),
    timeStamp: order["timeStamp"],
    SO: order[dayOfWeek],
  }));
  return convertedStandList;
};

export const compileOrderList = (cartList, standList) => {
  let orderList = cartList.concat(standList);
  let clone = clonedeep(orderList)
  console.log("orderList",clone)

  // Remove old cart order from orders if it exists
  for (let i = 0; i < orderList.length; ++i) {
    for (let j = i + 1; j < orderList.length; ++j) {
      if (
        orderList[i]["prodName"] === orderList[j]["prodName"] &&
        orderList[i]["custName"] === orderList[j]["custName"] &&
        orderList[i]["delivDate"] === orderList[j]["delivDate"]
      ) {
        orderList.splice(j, 1);
      }
    }
  }
  orderList = orderList.filter(ord => ord.prodName !== '')
  let clone2 = clonedeep(orderList)
 
  console.log("orderList2",clone2)
  sortAtoZDataByIndex(orderList, "prodName");
  orderList = orderList.filter(ord => ord.prodName !== '')
  let clone3 = clonedeep(orderList)
 
  console.log("orderList3",clone3)
  
  return orderList;
};

export const compileFullOrderList = (cartList, standList) => {
  let orderList = cartList.concat(standList);

  // Remove old cart order from orders if it exists
  for (let i = 0; i < orderList.length; ++i) {
    for (let j = i + 1; j < orderList.length; ++j) {
      if (
        orderList[i]["prodName"] === orderList[j]["prodName"] &&
        orderList[i]["custName"] === orderList[j]["custName"]
      ) {
        orderList.splice(j, 1);
      }
    }
  }

  sortAtoZDataByIndex(orderList, "prodName");
  orderList = orderList.filter(ord => ord.prodName !== '')
  return orderList;
};

export const buildCurrentOrder = (
  chosen,
  delivDate,
  orders,
  standing,
  route,
  ponote
) => {
  let cartList = buildCartList(chosen, delivDate, orders);
  console.log("cartList",cartList)
  let standList = buildStandList(chosen, delivDate, standing, route, ponote);
  console.log("standList",standList)
  let currentOrderList = compileOrderList(cartList, standList);
  console.log("currentOrderList", currentOrderList);
  currentOrderList = currentOrderList.filter(ord => ord.prodName !== '')
  return currentOrderList;
};

export const testEntryForProduct = (entry) => {
  return /\d+\s\w+/g.test(entry);
};

export const createArrayofEnteredProducts = (entry) => {
  const array = [...entry.matchAll(/\d+\s\w+/g)];
  let enteredProducts = array.map((item) => item[0].split(" "));
  return enteredProducts;
};

export const createOrdersToUpdate = (
  products,
  enteredProducts,
  chosen,
  ponote,
  route,
  orderTypeWhole,
  delivDate
) => {
  let ordersToUpdate = [];
  for (let product of products) {
    for (let enteredItem of enteredProducts) {
      if (product["nickName"] === enteredItem[1]) {
        let newOrder = {
          qty: Number(enteredItem[0]),
          prodName: product["prodName"],
          custName: chosen,
          PONote: ponote,
          route: route,
          SO: 0,
          isWhole: orderTypeWhole,
          delivDate: convertDatetoBPBDate(delivDate),
        };
        ordersToUpdate.push(newOrder);
      }
    }
  }
  return ordersToUpdate;
};

export const buildOrdersToModify = (
  orders,
  chosen,
  delivDate,
  ordersToUpdate,
  custOrderList,
  ponote,
  route
) => {
  let ordersToModify = [...orders];
  for (let orderToUpdate of ordersToUpdate) {
    for (let custOrder of custOrderList) {
      if (orderToUpdate["prodName"] === custOrder["prodName"]) {
        let index = ordersToModify.findIndex(
          (order) =>
            order["prodName"] === custOrder["prodName"] &&
            order["custName"] === chosen &&
            order["delivDate"] === convertDatetoBPBDate(delivDate)
        );
        if (index >= 0) {
          ordersToModify[index]["qty"] = orderToUpdate["qty"];
        } else {
          orderToUpdate["SO"] = custOrder["SO"];
          orderToUpdate.ponote = ponote;
          orderToUpdate.route = route;
          ordersToModify.push(orderToUpdate);
        }
      }
    }
  }
  return ordersToModify;
};

export const addUpdatesToOrders = (
  chosen,
  delivDate,
  ordersToUpdate,
  ordersToModify
) => {
  for (let ord of ordersToUpdate) {
    let index = ordersToModify.findIndex(
      (order) =>
        order["prodName"] === ord["prodName"] &&
        order["custName"] === chosen &&
        order["delivDate"] === convertDatetoBPBDate(delivDate)
    );
    if (index < 0) {
      ordersToModify.push(ord);
    }
  }
  return ordersToModify;
};
