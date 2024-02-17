const clonedeep = require("lodash.clonedeep");

export const addAttr = (fullOrder, database) => {
  const [products, customers, routes, standing, orders] = database;
  let fullToFix = clonedeep(fullOrder);

  fullToFix = fullToFix.map((full) => ({
    custName: full.custName,
    delivDate: full.delivDate,
    prodName: full.prodName,
    qty: full.qty,
  }));
  fullToFix = fullToFix.filter(full => full.qty !== 0)
  fullToFix.forEach((full) =>
    Object.assign(full, update(full, database))
  );

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
    .filter(
      (full) =>
        make.prodName === full.prodName 
    )
    .map((ord) => ord.qty);

  if (qtyToday.length > 0) {
    qtyAccToday = qtyToday.reduce(addUp);
  }
  make.qty = qtyAccToday;

};





const update = (order, database) => {
  const [products, customers, routes, standing, orders] = database;
  let atownPick
  let routeDepart = "";
  let route = "";
  let rtcheckNorthRun = routes[routes.findIndex(rt => rt.routeName === "AM North")].RouteServe
  let rtcheckCarltonToPrado = routes[routes.findIndex(rt => rt.routeName === "Carlton to Prado")].RouteServe
  if (rtcheckNorthRun.includes(order.zone) || rtcheckCarltonToPrado.includes(order.zone)){
    routeDepart = "Carlton"
  }
  if (rtcheckCarltonToPrado.includes(order.zone)){
    route = "Carlton to Prado"
  }
  
 

  let routeStart = 5.5
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
    packSize: ind.packSize,
    currentStock: ind.currentStock,
    batchSize: ind.batchSize,
    bakeExtra: ind.bakeExtra,
    readyTime: ind.readyTime,
    zone: atownPick,
    atownPick: pick,
    bakedWhere: ind.bakedWhere,
    packGroup: ind.packGroup,
    routeDepart: routeDepart,
    route: route,
    routeStart: routeStart
  };

  return toAdd;
};


const addUp = (acc, val) => {
  return acc + val;
};


const { DateTime } = require("luxon");

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

  const PRETZEL_EXCEPTIONS = ["Pretzel", "Unsalted Pretzel"]

  export const productReadyBeforeRouteStarts = (
    products,
    customers,
    routes,
    grd,
    rte
  ) => {
    const product = products.find(P => P.prodName === grd.prodName)
    const customer = customers.find(C => C.custName === grd.custName)
    const route = routes.find(R => R.routeName === rte.routeName)
    
    return product.readyTime < route.routeStart
      || product.readyTime > customer.latestFinalDeliv
      || PRETZEL_EXCEPTIONS.includes(product.prodName)
    // if (
    //   products[
    //     products.findIndex((prod) => prod["prodName"] === grd["prodName"])
    //   ]["readyTime"] <
    //     routes[routes.findIndex((rt) => rt["routeName"] === rte["routeName"])][
    //       "routeStart"
    //     ] ||
    //   products[
    //     products.findIndex((prod) => prod["prodName"] === grd["prodName"])
    //   ]["readyTime"] >
    //     customers[
    //       customers.findIndex((cust) => cust["custName"] === grd["custName"])
    //     ]["latestFinalDeliv"]
    // ) {
    //   return true;
    // } else {
    //   return false;
    // }
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