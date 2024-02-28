import { DateTime } from "luxon"
import { compareBy } from "../../utils/collectionFns/compareBy";


export const addRoutes = (delivDate, prodGrid, database) => {
  const [products, customers, routes] = database;
  const sortedRoutes = routes.sort(compareBy(R => R.routeStart, 'desc'))
  
  for (let rte of sortedRoutes) {
    for (let grd of prodGrid) {
      let dayNum = calcDayNum(delivDate);

      if (!rte["RouteServe"].includes(grd["zone"])) {
        continue;
      } else {
        if (
          routeRunsThatDay(rte, dayNum) &&
          productCanBeInPlace(grd, routes, customers, rte) &&
          productReadyBeforeRouteStarts(
            products,
            customers,
            routes,
            grd,
            rte
          ) &&
          customerIsOpen(customers, grd, routes, rte)
        ) {
          grd.route = rte.routeName;
          grd.routeDepart = rte.RouteDepart;
          grd.routeStart = rte.routeStart;
          grd.routeServe = rte.RouteServe;
          grd.routeArrive = rte.RouteArrive;
        }
      }
    }
  }
  for (let grd of prodGrid) {
    if (grd.zone === "slopick" || grd.zone === "Prado Retail") {
      grd.route = "Pick up SLO";
    }
    if (grd.zone === "atownpick" || grd.zone === "Carlton Retail") {
      grd.route = "Pick up Carlton";
    }
    if (grd.route === "slopick" || grd.route === "Prado Retail") {
      grd.route = "Pick up SLO";
    }
    if (grd.route === "atownpick" || grd.route === "Carlton Retail") {
      grd.route = "Pick up Carlton";
    }
    if (grd.route === "deliv") {
      grd.route = "NOT ASSIGNED";
    }
  }

  return prodGrid;
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