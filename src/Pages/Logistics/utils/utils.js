// const clonedeep = require("lodash.clonedeep");

// export const addProdAttr = (fullOrder, database) => {
//   const [products, customers, routes, standing, orders] = database;
//   let fullToFix = clonedeep(fullOrder);

//   fullToFix = fullToFix.map((full) => ({
//     custName: full.custName,
//     delivDate: full.delivDate,
//     prodName: full.prodName,
//     qty: full.qty,
//   }));
//   fullToFix = fullToFix.filter((full) => full.qty !== 0);
//   fullToFix.forEach((full) => Object.assign(full, update(full, database)));

//   return fullToFix;
// };



// const update = (order, database) => {
//   const [products, customers, routes, standing, orders] = database;
//   let atownPick;
//   let routeDepart = "";
//   let route = "";
//   let rtcheckNorthRun =
//     routes[routes.findIndex((rt) => rt.routeName === "AM North")].RouteServe;
//   let rtcheckCarltonToPrado =
//     routes[routes.findIndex((rt) => rt.routeName === "Carlton to Prado")]
//       .RouteServe;
//   if (
//     rtcheckNorthRun.includes(order.zone) ||
//     rtcheckCarltonToPrado.includes(order.zone)
//   ) {
//     routeDepart = "Carlton";
//   }
//   if (rtcheckCarltonToPrado.includes(order.zone)) {
//     route = "Carlton to Prado";
//   }

//   let routeStart = 5.5;
//   let ind =
//     products[products.findIndex((prod) => prod.prodName === order.prodName)];
//   try {
//     let custInd =
//       customers[
//         customers.findIndex((cust) => cust.custName === order.custName)
//       ];
//     atownPick = custInd.zoneName;
//   } catch {
//     atownPick = "atownpick";
//   }

//   let pick = false;
//   if (atownPick === "atownpick" || atownPick === "Carlton Retail") {
//     pick = true;
//   }

//   let toAdd = {
//     forBake: ind.forBake,
//     packSize: ind.packSize,
//     currentStock: ind.currentStock,
//     batchSize: ind.batchSize,
//     bakeExtra: ind.bakeExtra,
//     readyTime: ind.readyTime,
//     zone: atownPick,
//     atownPick: pick,
//     bakedWhere: ind.bakedWhere,
//     packGroup: ind.packGroup,
//     routeDepart: routeDepart,
//     route: route,
//     routeStart: routeStart,
//   };

//   return toAdd;
// };

// const addUp = (acc, val) => {
//   return acc + val;
// };

// export const addDelivQty = (make, fullOrders) => {
//   make.qty = 0;
//   make.needEarly = 0;
//   let qty = fullOrders
//     .filter((full) => make.forBake === full.forBake)
//     .map((ord) => ord.qty * ord.packSize);
//   if (qty.length > 0) {
//     let qtyAcc = qty.reduce(addUp);
//     make.qty = qtyAcc;
//     make.needEarly = qtyAcc;
//     make.makeTotal = qtyAcc;
//   }
// };

// export const addPocketsQty = (make, fullOrders) => {
//   make.qty = 0;
//   make.needEarly = 0;
//   let qty = fullOrders
//     .filter((full) => make.forBake === full.forBake && (full.atownPick === true || full.route === "atownpick"))
//     .map((ord) => ord.qty * ord.packSize);
//   if (qty.length > 0) {
//     let qtyAcc = qty.reduce(addUp);
//     make.qty = qtyAcc;
//     make.needEarly = qtyAcc;
//     make.makeTotal = qtyAcc;
//   }
// };

// export const addCroixBakedAndFrozen = (croix, fullOrdersTomorrow) => {
//   return;
// };
