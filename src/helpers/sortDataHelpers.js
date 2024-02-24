import { convertDatetoBPBDate } from "./dateTimeHelpers";
import {
  buildCartList,
  buildStandList,
  compileOrderList,
} from "./CartBuildingHelpers";

import { cloneDeep } from "lodash";

const { DateTime, Interval } = require("luxon");

export const sortAtoZDataByIndex = (data, index) => {
  // let dataIn = cloneDeep(data)
 
  data.sort(function (a, b) {
    return a[index] > b[index] ? 1 : -1;
  });
  // let dataOut = cloneDeep(data)
  
  return data;
};

export const sortZtoADataByIndex = (data, index) => {
  data.sort(function (a, b) {
    return a[index] < b[index] ? 1 : -1;
  });
  return data;
};

export const addAnEmptyRowToTop = (data) => {
  let len = data.length;
  let newArray = [];
  for (let i = 0; i < len; i++) {
    newArray.push("");
  }
  data.unshift(newArray);
  return data;
};

export const createRetailOrderCustomers = (orders) => {
  let special = orders.filter((order) => order["isWhole"] === false);
  special = special.map((order) => ({ custName: order["custName"] }));
  let unique = [...new Set(special.map((spec) => spec.custName))];
  unique = unique.map((uni) => ({ custName: uni }));
  sortAtoZDataByIndex(unique, "custName");
  return unique;
};

export const createRouteList = (customers) => {
  let routesArray = [...customers];
  routesArray = routesArray.map((cust) => cust[3]);
  const uniqueRoutesSet = new Set(routesArray);
  const newRoutesArray = Array.from(uniqueRoutesSet);
  return newRoutesArray;
};

export const findNewRoute = (
  chosen,
  delivDate,
  standing,
  orders,
  customers
) => {
  let newRoute;
  let cartList = buildCartList(chosen, delivDate, orders);
  let standList = buildStandList(chosen, delivDate, standing);
  let currentOrderList = compileOrderList(cartList, standList);
  let currentRoutes = currentOrderList.filter(
    (order) =>
      order[2] === chosen && order[7] === convertDatetoBPBDate(delivDate)
  );
  let custRoute = customers.find((element) => element[2] === chosen);
  custRoute ? (newRoute = custRoute[3]) : (newRoute = "atownpick");
  if (currentRoutes.length > 0) {
    newRoute = currentRoutes[0][4];
  }
  return newRoute;
};

export const findCurrentPonote = (chosen, delivDate, orders) => {
  let po;
  let currentOrders = orders.filter(
    (order) =>
      order[2] === chosen && order[7] === convertDatetoBPBDate(delivDate)
  );
  if (currentOrders.length > 0) {
    po = currentOrders[0][3];
  } else {
    po = "na";
  }
  return po;
};

export const findAvailableProducts = (
  products,
  orders,
  chosen,
  delivDate,
  customers,
  cartList
) => {
  let availableProducts = cloneDeep(products);
 
  try {
    let customProds =
      customers[customers.findIndex((custo) => chosen === custo.custName)]
        .customProd;
    for (let custo of customProds) {
      let ind = availableProducts.findIndex(
        (avail) => avail.prodName === custo
      );
      let prodToUpdate = cloneDeep(availableProducts[ind].defaultInclude);

      if (prodToUpdate === true) {
        availableProducts[ind].defaultInclude = false;
      } else {
        availableProducts[ind].defaultInclude = true;
      }
    }
  } catch {
    console.log("No chosen");
  }
  availableProducts = availableProducts.filter(
    (prod) => prod.defaultInclude === true
  );

  let today = DateTime.now().setZone("America/Los_Angeles");

  let ddate = DateTime.fromISO(delivDate).setZone("America/Los_Angeles");

  const diff = Math.ceil(Interval.fromDateTimes(today, ddate).length("days"));

  if (cartList) {
    for (let avail of availableProducts) {
      if (Number(avail.leadTime) > Number(diff)) {
        avail.prodName = avail.prodName + " (IN PRODUCTION)";
      }
    }
  }

  return availableProducts;
};

export const decideWhetherToAddOrModify = (orders, newOrder, delivDate) => {
  let newOrderList = [...orders];
  let chosen = newOrder["custName"];
  let prodToAdd = newOrder["prodName"];
  let qty = newOrder["qty"];
  let prodIndex = newOrderList.findIndex(
    (order) =>
      order["prodName"] === prodToAdd &&
      order["custName"] === chosen &&
      order["delivDate"] === convertDatetoBPBDate(delivDate)
  );
  if (prodIndex >= 0) {
    newOrderList[prodIndex]["qty"] = qty;
  } else {
    newOrderList.push(newOrder);
  }
  return newOrderList;
};

export const createOrderUpdatesClip = (orders, originalOrders) => {
  let orderData = cloneDeep(orders);
  let originalOrderData = cloneDeep(originalOrders);

  for (let i = 0; i < orderData.length; ++i) {
    for (let j = 0; j < originalOrderData.length; ++j) {
      if (
        orderData[i]["qty"] === originalOrderData[j]["qty"] &&
        orderData[i]["prodName"] === originalOrderData[j]["prodName"] &&
        orderData[i]["custName"] === originalOrderData[j]["custName"] &&
        orderData[i]["PONote"] === originalOrderData[j]["PONote"] &&
        orderData[i]["route"] === originalOrderData[j]["route"] &&
        orderData[i]["delivDate"] === originalOrderData[j]["delivDate"]
      ) {
        orderData.splice(i, 1);
      }
    }
  }

  let timeStamp = new Date();
  let timeStampedData = orderData.map((order) => ({
    qty: order["SO"],
    prodName: order["prodName"],
    custName: order["custName"],
    PONote: order["PONote"],
    route: order["route"],
    SO: order["SO"],
    isWhole: order["isWhole"],
    delivDate: order["delivDate"],
    timeStamp: timeStamp,
  }));
  return timeStampedData;
};

export const createStandHoldClip = (orders, originalOrders) => {
  let orderData = cloneDeep(orders);
  let originalOrderData = cloneDeep(originalOrders);

  for (let i = 0; i < orderData.length; ++i) {
    for (let j = 0; j < originalOrderData.length; ++j) {
      if (
        orderData[i]["dayNum"] === originalOrderData[j]["dayNum"] &&
        orderData[i]["qty"] === originalOrderData[j]["qty"] &&
        orderData[i]["prodName"] === originalOrderData[j]["prodName"] &&
        orderData[i]["custName"] === originalOrderData[j]["custName"]
      ) {
        orderData.splice(i, 1);
      }
    }
  }

  let timeStamp = new Date();
  let timeStampedData = orderData.map((order) => ({
    dayNum: Number(order["dayNum"]),
    qty: Number(order["qty"]),
    SO: Number(order["qty"]),
    timeStamp: timeStamp,
    prodName: order["prodName"],
    custName: order["custName"],
  }));
  return timeStampedData;
};

export const addTwoGrids = (gr1,gr2) => {

  let gr = gr1.concat(gr2)
  let att1set = Array.from(new Set(gr.map(g => g[Object.keys(g)[0]])))
  let newArray = []
  for (let a of att1set){
    let num = 0
    let item
    for (let g of gr){
      if (a === g[Object.keys(g)[0]]){
        num += Number(g[Object.keys(g)[1]])
      }
      item = {
        [Object.keys(g)[0]]:a,
        [Object.keys(g)[1]]:num
      }
    }
    newArray.push(item)
  }
  
  return newArray

}

export const subtractGridFromGrid = (gr1, gr2) => {
  let newArray = [];
  for (let gra of gr1) {
    let attr1 = gra[Object.keys(gra)[0]];
    
    for (let grb of gr2) {
      let attr2 = grb[Object.keys(grb)[0]];
      if (attr1 === attr2) {
        let num =
          Number(grb[Object.keys(grb)[1]]) - Number(gra[Object.keys(gra)[1]]);
       
        let item = {
          [Object.keys(gra)[0]]: attr1,
          [Object.keys(gra)[1]]: num,
        };
        newArray.push(item);
      }
    }
  }
  return newArray;
};


export const combineTwoGrids = (grid1, grid2, att1, att2) => {
  // console.log("grid1",grid1)
  // console.log("grid2",grid2)

  // console.log("keys",Object.keys(grid1[0]))
  let finalArray = []
  let prodsgr1 = grid1.map(gr => gr[Object.keys(grid1[0])[0]])
  let prodsgr2 = grid1.map(gr => gr[Object.keys(grid1[0])[0]])
  let allprods = Array.from(new Set(prodsgr1.concat(prodsgr2)))
  // console.log("allprods",allprods)
  for (let all of allprods){
    // console.log("all",all)
    let num1 = grid1[grid1.findIndex(gr => gr[Object.keys(grid1[0])[0]] === all)].qty
    let num2 = grid2[grid2.findIndex(gr => gr[Object.keys(grid2[0])[0]] === all)].qty
    let item = {
      [Object.keys(grid1[0])[0]]:all,
      [att1]: num1,
      [att2]: num2
    }
    finalArray.push(item)

  }
  return finalArray
}
