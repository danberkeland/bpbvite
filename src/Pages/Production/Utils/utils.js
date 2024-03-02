import { whatToMakeFilter } from "./filters";
import { getOrdersList } from "../../../core/production/getOrdersList";

const clonedeep = require("lodash.clonedeep");

const { DateTime } = require("luxon");

export const DayOneFilter = (ord, loc) => {
  return (
    ord.where.includes("Carlton") &&
    (ord.packGroup === "rustic breads" || ord.packGroup === "retail") &&
    ((ord.routeStart >= 8 && ord.routeDepart === "Prado") ||
      ord.routeDepart === "Carlton" ||
      ord.route === "Pick up Carlton" ||
      ord.route === "Pick up SLO")
  );
};

export const DayTwoFilter = (ord, loc) => {
  return (
    ord.where.includes("Carlton") &&
    (ord.packGroup === "rustic breads" || ord.packGroup === "retail") &&
    ord.routeStart < 8 &&
    ord.routeDepart === "Prado"
  );
};

export const addProdAttr = (fullOrder, database) => {
  // const [products, customers, routes, standing, orders] = database;
  const [products, customers] = database;
  let fullToFix = clonedeep(fullOrder);

  fullToFix = fullToFix.map((full) => ({
    custName: full.custName,
    delivDate: full.delivDate,
    prodName: full.prodName,
    qty: full.qty,
  }));
  fullToFix.forEach((full) =>
    Object.assign(full, update(full, products, customers))
  );

  return fullToFix;
};

export const addSetOut = (
  make,
  fullTwoDay,
  fullOrdersTomorrow,
  routes,
  loc
) => {
  make.qty = 0;

  let qtyAccTomorrow = 0;

  let availableRoutes = routes.filter((rt) => rt.RouteDepart === loc);

  let qtyTomorrow = fullOrdersTomorrow
    .filter(
      (full) =>
        make.forBake === full.forBake &&
        checkZone(full, availableRoutes) === true
    )
    .map((ord) => ord.qty);
  if (qtyTomorrow.length > 0) {
    qtyAccTomorrow = qtyTomorrow.reduce(addUp);

    make.qty = qtyAccTomorrow;
  }
};

export const addUp = (acc, val) => {
  return acc + val;
};

const checkZone = (full, availableRoutes) => {
  for (let av of availableRoutes) {
    if (av.RouteServe.includes(full.zone)) {
      return true;
    }
  }
  return false;
};

const update = (order, products, customers) => {
  let atownPick = "atownpick";
  let ind =
    products[products.findIndex((prod) => prod.prodName === order.prodName)];
  try {
    let custInd =
      customers[
        customers.findIndex((cust) => cust.custName === order.custName)
      ];
    atownPick = custInd.zoneName;
  } catch {
    atownPick = "atownpick";
  }

  let pick = false;
  if (atownPick === "atownpick" || atownPick === "Carlton Retail") {
    pick = true;
  }

  let toAdd = {
    forBake: ind.forBake,
    freezerNorth: ind.freezerNorth,
    freezerNorthCLosing: ind.freezerNorthClosing,
    packSize: ind.packSize,
    currentStock: ind.currentStock,
    batchSize: ind.batchSize,
    bakeExtra: ind.bakeExtra,
    readyTime: ind.readyTime,
    zone: atownPick,
    atownPick: pick,
  };

  return toAdd;
};

export const makePocketQty = (bakedTomorrow) => {
  let makeList2 = Array.from(
    new Set(bakedTomorrow.map((prod) => prod.weight))
  ).map((mk) => ({
    pocketSize: mk,
    qty: 0,
  }));
  for (let make of makeList2) {
    make.qty = 1;

    let qtyAccToday = 0;

    let qtyToday = bakedTomorrow
      .filter((frz) => make.pocketSize === frz.weight)
      .map((ord) => ord.qty * ord.packSize);

    if (qtyToday.length > 0) {
      qtyAccToday = qtyToday.reduce(addUp);
    }
    make.qty = qtyAccToday;
  }
  return makeList2;
};

export const whatToMakeList = (database, delivDate) => {
  // let [products, customers, routes, standing, orders] = database;
  let whatToMakeList = getOrdersList(delivDate, database, true);
  return whatToMakeList.filter((set) => whatToMakeFilter(set));
};

export const qtyCalc = (whatToMake) => {
  let qty = 0;
  for (let make of whatToMake) {
    qty += Number(make.qty);
  }
  return qty;
};

export const doughListComp = (doughs, filt, loc) => {
  console.log('doughsDougList', doughs)
  return Array.from(
    new Set(doughs.filter((set) => filt(set, loc)).map((dgh) => dgh.doughName))
  ).map((dgh) => ({
    doughName: dgh,
    isBakeReady:
      doughs[doughs.findIndex((dg) => dg.doughName === dgh)].isBakeReady,
    oldDough: 0,
    buffer: 0,
    needed: 0,
    batchSize: 0,
    short: 0,
    bucketSets: 0,
  }));
};

let pageMargin = 20;
let tableToNextTitle = 12;
let titleToNextTable = tableToNextTitle + 4;
let tableFont = 11;
let titleFont = 14;

export const buildTable = (title, doc, body, col, finalY) => {
  doc.setFontSize(titleFont);
  doc.text(pageMargin, finalY + tableToNextTitle, title);
  doc.autoTable({
    theme: "grid",
    body: body,
    margin: pageMargin,
    columns: col,
    startY: finalY + titleToNextTable,
    styles: { fontSize: tableFont },
  });
};

export const addAttr = (fullOrder, database) => {
  // const [products, customers, routes, standing, orders] = database;
  let fullToFix = clonedeep(fullOrder);

  fullToFix = fullToFix.map((full) => ({
    custName: full.custName,
    delivDate: full.delivDate,
    prodName: full.prodName,
    qty: full.qty,
  }));
  fullToFix = fullToFix.filter((full) => full.qty !== 0);
  fullToFix.forEach((full) => Object.assign(full, update(full, database)));

  return fullToFix;
};

export const addQty = (
  make,
  fullOrders,
  fullOrdersTomorrow,
  products,
  routes
) => {
  make.qty = 0;

  let qtyAccToday = 0;

  let qtyToday = fullOrders
    .filter((full) => make.prodName === full.prodName)
    .map((ord) => ord.qty);

  if (qtyToday.length > 0) {
    qtyAccToday = qtyToday.reduce(addUp);
  }
  make.qty = qtyAccToday;
};

export const calcDayNum = (delivDate) => {
  let day = DateTime.fromSQL(delivDate);
  let dayNum = day.weekday;
  if (dayNum === 7) {
    dayNum = 0;
  }
  dayNum = dayNum + 1;
  return dayNum;
};

export const routeRunsThatDay = (rte, dayNum) => {
  if (rte["RouteSched"].includes(dayNum.toString())) {
    return true;
  } else {
    return false;
  }
};

export const productCanBeInPlace = (grd, routes, customers, rte) => {
  if (
    grd["where"].includes("Mixed") ||
    grd["where"].includes(
      routes[
        routes.findIndex((route) => route["routeName"] === rte["routeName"])
      ]["RouteDepart"]
    )
  ) {
    return true;
  } else {
    if (productCanMakeIt(grd, routes, customers, rte)) {
      return true;
    } else {
      return false;
    }
  }
};

const productCanMakeIt = (grd, routes, customers, rte) => {
  for (let testRte of routes) {
    if (
      grd["where"].includes(testRte["RouteDepart"]) &&
      testRte["RouteArrive"] === rte["RouteDepart"] &&
      (Number(testRte["routeStart"] + testRte["routeTime"]) <
        Number(rte["routeStart"]) ||
        Number(testRte["routeStart"] + testRte["routeTime"]) >
          customers[
            customers.findIndex((cust) => cust["custName"] === grd["custName"])
          ]["latestFinalDeliv"])
    ) {
      return true;
    }
  }

  return false;
};

export const productReadyBeforeRouteStarts = (
  products,
  customers,
  routes,
  grd,
  rte
) => {
  if (
    products[
      products.findIndex((prod) => prod["prodName"] === grd["prodName"])
    ]["readyTime"] <
      routes[routes.findIndex((rt) => rt["routeName"] === rte["routeName"])][
        "routeStart"
      ] ||
    products[
      products.findIndex((prod) => prod["prodName"] === grd["prodName"])
    ]["readyTime"] >
      customers[
        customers.findIndex((cust) => cust["custName"] === grd["custName"])
      ]["latestFinalDeliv"]
  ) {
    return true;
  } else {
    return false;
  }
};

export const customerIsOpen = (customers, grd, routes, rte) => {
  if (
    customers[
      customers.findIndex((cust) => cust["custName"] === grd["custName"])
    ]["latestFirstDeliv"] <
    Number(
      routes[routes.findIndex((rt) => rt["routeName"] === rte["routeName"])][
        "routeStart"
      ]
    ) +
      Number(
        routes[routes.findIndex((rt) => rt["routeName"] === rte["routeName"])][
          "routeTime"
        ]
      )
  ) {
    return true;
  } else {
    return false;
  }
};