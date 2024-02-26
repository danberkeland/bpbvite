import {
  createColumns,
  zerosDelivFilter,
  buildGridOrderArray,
} from "../../../helpers/delivGridHelpers";

import { getFullOrders } from "../../../helpers/CartBuildingHelpers";

import { sortZtoADataByIndex } from "../../../utils/_deprecated/utils";
import {
  calcDayNum,
  routeRunsThatDay,
  productCanBeInPlace,
  productReadyBeforeRouteStarts,
  customerIsOpen,
} from "../ByRoute/Parts/utils/utils";
import { tablePivot, tablePivotFlatten } from "../../../utils/tablePivot";
import { sumBy } from "../../../utils/collectionFns/sumBy";
import { compareBy } from "../../../utils/collectionFns/compareBy";
   
const addRoutes = (delivDate, prodGrid, database) => {
  const [products, customers, routes, standing, orders] = database;
  sortZtoADataByIndex(routes, "routeStart");
  for (let rte of routes) {
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
  
const makePivotTableAndColumns = (delivDate, database, filter) => {
  let fullOrder 
  fullOrder = getFullOrders(delivDate, database);
  fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
  fullOrder = buildGridOrderArray(fullOrder, database);
  fullOrder = addRoutes(delivDate, fullOrder, database);
  fullOrder = fullOrder.filter(filter)

  const pivotTable = tablePivot(
    fullOrder,
    {
      customer: row => row.custName,
      delivOrder: row => row.delivOrder,
      route: row => row.route,
    },
    "prodNick",
    cellItems => sumBy(cellItems, item => item.qty * item.packSize)
  )

  const flattenedTable = tablePivotFlatten(pivotTable)
    .map(row => ({
      ...row,
      customerShort: row.customer.length>10 
        ? row.customer.substring(0,13) + "..." 
        : row.customer
    }))
    .sort(compareBy(order => order.delivOrder, "desc"))
    .sort(compareBy(order => order.route))

  const prodNicks = Object.keys(pivotTable[0].colProps)
  const columnTemplate = createColumns(prodNicks)

  return [flattenedTable, columnTemplate]
}

export default class ComposeAMPastry {
  returnAMPastryBreakDown = (delivDate, database) => {

    const [AMPastry, columnsAMPastry] = 
      makePivotTableAndColumns(delivDate, database, this.AMPastryFilter)

    const AMOthers = []
    const columnsAMOthers = []

    return {
      AMPastry: AMPastry,
      columnsAMPastry: columnsAMPastry,
      AMOthers: AMOthers,
      columnsAMOthers: columnsAMOthers
    };
  };

  AMPastryFilter = (ord) => {
    return (
      (ord.where.includes("Mixed") || ord.where.includes("Prado")) &&
      ord.packGroup === "baked pastries" &&
      ord.routeDepart === "Prado"
    );
  };

}
