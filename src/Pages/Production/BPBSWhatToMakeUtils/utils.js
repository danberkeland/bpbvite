const clonedeep = require("lodash.clonedeep");

export const addProdAttr = (fullOrder, database) => {
  const [products, customers, routes, standing, orders] = database;
  let fullToFix = clonedeep(fullOrder);

  fullToFix = fullToFix.map((full) => ({
    custName: full.custName,
    delivDate: full.delivDate,
    prodName: full.prodName,
    route: full.route,
    qty: full.qty,
  }));
  fullToFix.forEach((full) =>
    Object.assign(full, update(full, products, customers))
  );

  console.log("fullToFix", fullToFix);

  return fullToFix;
};

export const addFresh = (
  make,
  fullOrders,
  fullOrdersTomorrow,
  products,
  routes
) => {
  make.qty = 0;
  console.log("make", make);

  let qtyAccToday = 0;
  let qtyAccTomorrow = 0;
  let dutchDelivToday = 0;

  const prodInd = products.findIndex((prod) => prod.forBake === make.forBake);
  const guaranteeTimeToday = Number(products[prodInd].readyTime);

  const availableRoutesToday = routes.filter(
    (rt) =>
      (rt.RouteDepart === "Prado" &&
        Number(rt.routeStart) > guaranteeTimeToday) ||
      rt.routeName === "Pick up SLO"
  );

  const availableRoutesTomorrow = routes.filter(
    (rt) => rt.RouteDepart === "Carlton"
  );

  const qtyToday = fullOrders
    .filter((full) => {
      const isProductMatch = make.forBake === full.forBake;
      const isAvailableRoute = checkZone(full, availableRoutesToday);
      const isDutch = make.forBake === "Dutch";
      const isAtownPick = full.atownPick || full.route === "atownpick";
      const isRetailCustomer = full.custName.includes("__");

      const condition1 = isProductMatch && !isAtownPick && isAvailableRoute;
      const condition2 =
        isProductMatch && isDutch// && (isAvailableRoute || isRetailCustomer);

      return condition1 || condition2;
    })
    .map((ord) => ord.qty * ord.packSize);

  const dutchDeliv = fullOrders
    .filter((full) => {
      const isProductMatch = make.forBake === full.forBake;
      const isAtownPick = full.atownPick || full.route === "atownpick";
      const isAvailableRoute = checkZone(full, availableRoutesToday);
      const isDutch = make.forBake === "Dutch";

      const condition1 = isProductMatch && !isAtownPick && isAvailableRoute;
      const condition2 = isProductMatch && isDutch;

      return condition1 || condition2;
    })
    .map((ord) => ord.qty * ord.packSize);

  const qtyTomorrow = fullOrdersTomorrow
    .filter((full) => {
      const isProductMatch = make.forBake === full.forBake;
      const isAtownPick = full.atownPick || full.route === "atownpick";
      const isAvailableRoute = checkZone(full, availableRoutesTomorrow);
      const isDutch = full.prodName === "Dutch Stick";
      const isFicelle = full.prodName === "Ficelle";

      const condition1 = (!isAtownPick && !isFicelle) || isDutch;

      return isProductMatch && isAvailableRoute && condition1;
    })
    .map((ord) => ord.qty * ord.packSize);

  dutchDelivToday =
    dutchDeliv.length > 0 ? dutchDeliv.reduce((acc, val) => acc + val) : 0;
  qtyAccToday =
    qtyToday.length > 0 ? qtyToday.reduce((acc, val) => acc + val) : 0;
  qtyAccTomorrow =
    qtyTomorrow.length > 0 ? qtyTomorrow.reduce((acc, val) => acc + val) : 0;

  make.qty = make.forBake === "Dutch" ? dutchDelivToday : qtyAccToday;
  make.makeTotal = qtyAccToday + qtyAccTomorrow;
  make.bagEOD = qtyAccTomorrow;
};

export const addNeedEarly = (make, products) => {
  let curr = products
    .filter((full) => make.forBake === full.forBake)
    .map((ord) => ord.currentStock * ord.packSize);

  if (curr.length > 0) {
    let currAcc = curr.reduce(addUp);
    make.needEarly -= currAcc;
    make.makeTotal -= currAcc;
  }
  if (make.needEarly < 0) {
    make.needEarly = 0;
  }
  if (make.makeTotal < 0) {
    make.makeTotal = 0;
  }
  let batchSize =
    products[products.findIndex((prod) => prod.forBake === make.forBake)]
      .batchSize;

  if (batchSize > 0) {
    let num = Math.ceil(Number(make.makeTotal) / Number(batchSize));
    make.makeTotal = num * Number(batchSize);
  }
};

export const addShelf = (
  make,
  fullOrders,
  fullOrdersTomorrow,
  products,
  routes
) => {
  make.qty = 0;
  make.needEarly = 0;

  let qtyAccToday = 0;
  let qtyAccTomorrow = 0;

  let filt = products.filter((prod) => prod.forBake === make.forBake);
  let qtyMakeExtra = 0;
  for (let fi of filt) {
    qtyMakeExtra = qtyMakeExtra + fi.bakeExtra;
  }

  let qtyToday = fullOrders
    .filter((full) => make.forBake === full.forBake)
    .map((ord) => ord.qty * ord.packSize);
  if (qtyToday.length > 0) {
    qtyAccToday = qtyToday.reduce(addUp);
  }
  let qtyTomorrow = fullOrdersTomorrow
    .filter((full) => make.forBake === full.forBake)
    .map((ord) => ord.qty * ord.packSize);

  if (qtyTomorrow.length > 0) {
    qtyAccTomorrow = qtyTomorrow.reduce(addUp);
  }

  make.qty = qtyAccToday;
  make.needEarly = qtyAccToday;
  make.makeTotal = qtyAccTomorrow + qtyAccToday + qtyMakeExtra;
};

export const addPretzel = (
  make,
  fullOrders,
  fullOrdersTomorrow,
  fullOrders2Day,
  products,
  routes,
  delivDate
) => {
  function getDayOfWeek(dateString) {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    return dayOfWeek;
  }

  const today = (getDayOfWeek(delivDate)+1).toString();
  const tomorrow = ((getDayOfWeek(delivDate) + 2) % 7).toString();
  const yesterday = ((getDayOfWeek(delivDate)) % 7).toString();

  const availableRoutesToday = (checkDay) => {
    return routes.filter(
      (rt) =>
        (rt.RouteDepart === "Prado" &&
          Number(rt.routeStart) > 8.2 &&
          rt.RouteSched.includes(checkDay)) ||
        rt.routeName === "Pick up SLO"
    );
  };

  make.qty = 0;
  make.needEarly = 0;

  let qtyToday = fullOrders
    .filter((full) => make.forBake === full.forBake)
    .map((ord) => ord.qty * ord.packSize);
  let qtyAccToday = qtyToday.length > 0 ? qtyToday.reduce((a, b) => a + b) : 0;

  let noRouteToday = fullOrders
    .filter((full) => {
      const bakeCantMakeRoute = !checkZone(
        full,
        availableRoutesToday(yesterday)
      );
      const isProductMatch = make.forBake === full.forBake;
      const isAtownPick = full.atownPick || full.route === "atownpick";

      return isProductMatch && (bakeCantMakeRoute || isAtownPick);
    })
    .map((ord) => ord.qty * ord.packSize);

  let noRoute = fullOrdersTomorrow
    .filter((full) => {
      const bakeCantMakeRoute = !checkZone(
        full,
        availableRoutesToday(today)
      );
      const isProductMatch = make.forBake === full.forBake;
      const isAtownPick = full.atownPick || full.route === "atownpick";

      return isProductMatch && (bakeCantMakeRoute || isAtownPick);
    })
    .map((ord) => ord.qty * ord.packSize);

  let noRoute2Day = fullOrders2Day
    .filter((full) => {
      const bakeCantMakeRoute = !checkZone(full, availableRoutesToday(tomorrow));
      const isProductMatch = make.forBake === full.forBake;
      const isAtownPick = full.atownPick || full.route === "atownpick";

      return isProductMatch && (bakeCantMakeRoute || isAtownPick);
    })
    .map((ord) => ord.qty * ord.packSize);

  let qtyTomorrow = fullOrdersTomorrow
    .filter((full) => make.forBake === full.forBake)
    .map((ord) => ord.qty * ord.packSize);

  let qtyAccTomorrow =
    qtyTomorrow.length > 0 ? qtyTomorrow.reduce((a, b) => a + b) : 0;
  let noRouteAcc = noRoute.length > 0 ? noRoute.reduce((a, b) => a + b) : 0;
  let noRoute2DayAcc =
    noRoute2Day.length > 0 ? noRoute2Day.reduce((a, b) => a + b) : 0;
    let noRouteTodayAcc =
    noRouteToday.length > 0 ? noRouteToday.reduce((a, b) => a + b) : 0;


  make.forBake === "Unsalted Pretzel" && console.log('qtyAccToday Pretzel', qtyAccToday)
  make.forBake === "Unsalted Pretzel" && console.log('noRouteAcc Pretzel', noRouteAcc)
  make.forBake === "Unsalted Pretzel" && console.log('noRoute2DayAcc Pretzel', noRoute2DayAcc)
  make.forBake === "Unsalted Pretzel" && console.log('qtyAccTomorrow Pretzel', qtyAccTomorrow)
  make.forBake === "Unsalted Pretzel" && console.log('noRouteTodayAcc Pretzel', noRouteTodayAcc)

  make.qty = qtyAccToday + noRouteAcc - noRouteTodayAcc;
  make.needEarly = qtyAccToday;
  make.makeTotal = qtyAccTomorrow + noRoute2DayAcc - noRouteAcc;
  make.bagEOD = noRouteAcc;
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

const freshProdFilter = (prod) => {
  let fil =
    !prod.bakedWhere.includes("Carlton") &&
    Number(prod.readyTime) < 15 &&
    prod.packGroup !== "frozen pastries" &&
    prod.packGroup !== "baked pastries";
  return fil;
};

const makeProds = (products, filt) => {
  let make = Array.from(
    new Set(products.filter((prod) => filt(prod)).map((prod) => prod.forBake))
  ).map((make) => ({
    forBake: make,
    qty: 0,
    makeTotal: 0,
    bagEOD: 0,
  }));
  return make;
};

export const buildMakeFreshProdTemplate = (products) => {
  let makeFreshProds;
  makeFreshProds = makeProds(products, freshProdFilter);

  return makeFreshProds;
};

const addUp = (acc, val) => {
  return acc + val;
};

export const addDelivQty = (make, fullOrders) => {
  make.qty = 0;
  make.needEarly = 0;
  let qty = fullOrders
    .filter((full) => make.forBake === full.forBake)
    .map((ord) => ord.qty * ord.packSize);
  if (qty.length > 0) {
    let qtyAcc = qty.reduce(addUp);
    make.qty = qtyAcc;
    make.needEarly = qtyAcc;
    make.makeTotal = qtyAcc;
  }
};

const checkZone = (full, availableRoutes) => {
  for (let av of availableRoutes) {
    if (av.RouteServe.includes(full.zone)) {
      return true;
    }
  }
  return false;
};

export const addPocketsQty = (make, fullOrders) => {
  make.qty = 0;
  make.needEarly = 0;
  let qty = fullOrders
    .filter(
      (full) =>
        make.forBake === full.forBake &&
        (full.atownPick === true || full.route === "atownpick")
    )
    .map((ord) => ord.qty * ord.packSize);
  if (qty.length > 0) {
    let qtyAcc = qty.reduce(addUp);
    make.qty = qtyAcc;
    make.needEarly = qtyAcc;
    make.makeTotal = qtyAcc;
  }
};
