import {
  convertDatetoBPBDate,
  tomBasedOnDelivDate,
  // todayPlus,
  // TwodayBasedOnDelivDate,
  // ThreedayBasedOnDelivDate,
} from "../../../helpers/dateTimeHelpers";

import {
  createColumns,
  zerosDelivFilter,
  buildGridOrderArray,
} from "../../../helpers/delivGridHelpers";

import { getFullOrders } from "../../../helpers/CartBuildingHelpers";

// import {
//   sortZtoADataByIndex,
//   addTwoGrids,
//   subtractGridFromGrid,
//   combineTwoGrids,
// } from "../../../helpers/sortDataHelpers";
  
import {
  calcDayNum,
  routeRunsThatDay,
  productCanBeInPlace,
  productReadyBeforeRouteStarts,
  customerIsOpen,
} from "../ByRoute/Parts/utils/utils";
// import { DateTime } from "luxon";
// import { flow, map, orderBy } from "lodash/fp";
import { sumBy } from "../../../utils/collectionFns/sumBy";
import { objProject } from "../../../utils/objectFns/objProject";
import { compareBy } from "../../../utils/collectionFns/compareBy";
import { tablePivot, tablePivotFlatten } from "../../../utils/tablePivot";
  
// const incrementDate = (isoDate, nDays) => DateTime
//   .fromISO(isoDate, { zone: 'America/Los_Angeles' })
//   .startOf('day')
//   .plus({ days: nDays })
//   .toFormat('yyyy-MM-dd')

// const clonedeep = require("lodash.clonedeep");

// let tomorrow = todayPlus()[1];
// const todayDT = DateTime.now().setZone("America/Los_Angeles");
// const today = todayDT.toFormat('yyyy-MM-dd')
// const tomorrow = todayDT.plus({ days: 1 }).toFormat('yyyy-MM-dd')

// let convertedToday = convertDatetoBPBDate(today);
// let convertedTomorrow = convertDatetoBPBDate(tomorrow);
  
const addRoutes = (delivDate, prodGrid, database) => {
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

// const getProdNickNames = (delivDate, database, filter) => {
//   const [products, customers, routes, standing, orders] = database;
//   let fullOrder = getFullOrders(delivDate, database);
//   fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
//   fullOrder = buildGridOrderArray(fullOrder, database);
//   fullOrder = addRoutes(delivDate, fullOrder, database);

//   let fullNames = Array.from(
//     new Set(fullOrder.filter((fu) => filter(fu)).map((fil) => fil.prodName))
//   );
//   let nickNames = fullNames.map(
//     (fil) =>
//       products[products.findIndex((prod) => fil === prod.prodName)].nickName
//   );
//   return nickNames;
// };

// const getCustNames = (delivDate, database, filter) => {
//   const [products, customers, routes, standing, orders] = database;
//   let fullOrder = getFullOrders(delivDate, database);
//   fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
//   fullOrder = buildGridOrderArray(fullOrder, database);
//   fullOrder = addRoutes(delivDate, fullOrder, database);

//   return Array.from(
//     new Set(fullOrder.filter((fu) => filter(fu)).map((fil) => fil.custName))
//   );
// };
  
const getOrdersList = (delivDate, database) => {
  const routes = database[2]
  let fullOrder = getFullOrders(delivDate, database);
  fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
  fullOrder = buildGridOrderArray(fullOrder, database);
  fullOrder = addRoutes(delivDate, fullOrder, database);
  fullOrder = fullOrder.map(order => {
    const driver = routes.find(R => R.routeName === order.route)?.driver ?? null
    return {
      ...order,
      driver
    }
  })
  return fullOrder;
};
  
// const makeOrders = (delivDate, database, filter) => {
//   // const [products, customers, routes, standing, orders] = database;
//   const products = database[0]
//   const routes = database[2]
//   // let prodNames = getProdNickNames(delivDate, database, filter);
//   // let custNames = getCustNames(delivDate, database, filter);
//   // let fullOrder = getFullOrders(delivDate, database);
//   // fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
//   // fullOrder = buildGridOrderArray(fullOrder, database);
//   // fullOrder = addRoutes(delivDate, fullOrder, database);
//   let fullOrder = getOrdersList(delivDate, database)
//   // console.log("FULL:", fullOrder)

//   let custNames = Array.from(new Set(
//     fullOrder.filter((fu) => filter(fu)).map((fil) => fil.custName)
//   ));

//   let prodNames = Array.from(new Set(
//     fullOrder.filter((fu) => filter(fu)).map((fil) => fil.prodName)
//   )).map((fil) => 
//     products[products.findIndex((prod) => fil === prod.prodName)].nickName
//   );
  
//   let orderArray = [];
//   for (let cust of custNames) {
//     const orderMatch = fullOrder.find(order => order.custName === cust)
//     const route = routes.find(R => R.routeName === orderMatch.route)
//     const isLongDriver = route.driver === 'Long Driver'

//     let custItem = {};
//     custItem = {
//       customer: cust,
//       customerShort: cust.length>10 ? cust.substring(0,15)+"..." : cust,
//       routeName: orderMatch.route,
//       isLongDriver,
//     };
//     for (let prod of prodNames) {
//       let pro = products[products.findIndex((pr) => pr.nickName === prod)]
//       let prodFullName =
//         pro.prodName;
//       try {
//         custItem[prod] =
//           fullOrder[
//             fullOrder.findIndex(
//               (ord) => ord.prodName === prodFullName && ord.custName === cust
//             )
//           ].qty * pro.packSize;
//       } catch {
//         custItem[prod] = null;
//       }
//     }
//     orderArray.push(custItem);
//   }
//   return orderArray;
// };


// const makeOrdersShelf = (delivDate, database, filter) => {
//   const [products, customers, routes, standing, orders] = database;
//   let prodNames = getProdNickNames(delivDate, database, filter);
//   let custNames = getCustNames(delivDate, database, filter);

//   // let fullOrder = getFullOrders(delivDate, database);
//   // fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
//   // fullOrder = buildGridOrderArray(fullOrder, database);
//   // fullOrder = addRoutes(delivDate, fullOrder, database);

//   const T0Orders = getOrdersList(delivDate, database)
  
//   let orderArray = [];
//   for (let cust of custNames) {
//     let custItem = {};
//     custItem = {
//       customer: cust,
//       customerShort: cust.length>10 ? cust.substring(0,15)+"..." : cust
//     };
//     for (let prod of prodNames) {
//       let pro = products[products.findIndex((pr) => pr.nickName === prod)]
//       let prodFullName =
//         pro.prodName;
//       try {
//         custItem[prod] =
//           T0Orders[
//             T0Orders.findIndex(
//               (ord) => ord.prodName === prodFullName && ord.custName === cust && (ord.prodNick === "fic" ? ord.route !== "Pick up Carlton" : true)
//             )
//           ].qty * pro.packSize;
//       } catch {
//         custItem[prod] = null;
//       }
//     }
//     orderArray.push(custItem);
//   }
//   return orderArray;
// };

// const addUp = (acc, val) => {
//   return acc + val;
// };

// const convertFrozenAttrToPlainAttr = (data) => {
//   try {
//     for (let d of data) {
//       d.prod = d.prod.substring(2);
//     }
//   } catch {
//     for (let d of data) {
//       d = d.substring(2);
//     }
//   }

//   return data;
// };

/**
 * orderList should be pre-filtered. 
 * Applies "*" formatting for items to be delivered on Long Driver Routes
 */
const generateBasicPivotAndColumns = (orderList) => {
  if (!orderList.length) return [[], []]

  const pivotTable = tablePivot(
    orderList,
    { customer: row => row.custName, driver: row => row.driver, route: row => row.route },
    "prodNick",
    cellData => sumBy(cellData, order => order.qty * order.packSize)
  )

  const flattenedPivotTable = tablePivotFlatten (pivotTable)
    .map(row => ({
      ...row,
      customerShort: (row.driver === "Long Driver" ? "": "* ") 
        + (row.customer.length > 10 ? row.customer.substring(0,15) + "..." : row.customer) //+ truncate(row.customer, { length: 18 })
    }))
    .sort(compareBy(item => item.route))
    .sort(compareBy(order => order.driver === 'Long Driver', 'desc'))

  const tableProdNicks = Object.keys(pivotTable[0].colProps).sort()
  const columnTemplate = tableProdNicks.length
    ? createColumns(tableProdNicks)
    : []
  
  return [flattenedPivotTable, columnTemplate]
}

/** 
 * shapeType is the prodNick of some representative product.
 * Products with the same shapeType consume the same croissant item
 * from freezer inventory. They are labelled using baked croix prodNicks 
 * despite being frozen items themselves.
 */
const prodNickToShapeTypeMap = {
  al: "al",
  fral: "al",
  ch: "ch",
  frch: "ch",
  pg: "pg",
  frpg: "frpg",
  mb: "mb",
  unmb: "mb",
  frmb: "mb",
  pl: "pl",
  frpl: "pl",
  sf: "sf",
  frsf: "sf",
  mini: "mini",
  frmni: "mini",
}

const summaryAttributes = ['prodNick', 'custNick', 'delivDate', 'qty', 'route']



// *************************************************************************
// Main
// *************************************************************************

export default class ComposeNorthList {
  returnNorthBreakDown = (delivDate, database) => {
    let croixNorth = this.returnCroixNorth(delivDate, database);

    // let [shelfProdsNorth, columnsShelfProdsNorth] = this.returnShelfProdsNorth(delivDate, database);
    // let [pocketsNorth,    columnsPocketsNorth]    = this.returnPocketsNorth(delivDate, database);
    // let [CarltonToPrado,  columnsCarltonToPrado]  = this.returnCarltonToPrado(delivDate, database);
    // let [Baguettes,       columnsBaguettes]       = this.returnBaguettes(delivDate, database);
    // let [otherRustics,    columnsOtherRustics]    = this.returnOtherRustics(delivDate, database);
    // let [retailStuff,     columnsRetailStuff]     = this.returnRetailStuff(delivDate, database);
    // let [earlyDeliveries, columnsEarlyDeliveries] = this.returnEarlyDeliveries(delivDate, database);

    const todayOrders = getOrdersList(delivDate, database)

    const [
      [shelfProdsNorth, columnsShelfProdsNorth],
      [pocketsNorth,    columnsPocketsNorth],
      // [CarltonToPrado,  columnsCarltonToPrado],
      [Baguettes,       columnsBaguettes],
      [otherRustics,    columnsOtherRustics],
      [retailStuff,     columnsRetailStuff],
      [earlyDeliveries, columnsEarlyDeliveries],
    ] = [
      this.shelfProdsFilter,
      this.pocketsNorthFilter,
      // this.CarltonToPradoFilter,
      this.BaguettesFilter,
      this.otherRusticsFilter,
      this.retailStuffFilter,
      this.earlyDeliveriesFilter
    ].map(orderFilter => 
      generateBasicPivotAndColumns(todayOrders.filter(orderFilter))
    )
    // let columnsShelfProdsNorth = this.returnColumnsShelfProdsNorth(
    //   delivDate,
    //   database
    // );
    // let columnsPocketsNorth = this.returnColumnsPocketsNorth(
    //   delivDate,
    //   database
    // );
    // let columnsCarltonToPrado = this.returnColumnsCarltonToPrado(
    //   delivDate,
    //   database
    // );
    // let columnsBaguettes = this.returnColumnsBaguettes(delivDate, database);
    // let columnsOtherRustics = this.returnColumnsOtherRustics(
    //   delivDate,
    //   database
    // );
    // let columnsRetailStuff = this.returnColumnsRetailStuff(delivDate, database);
    // let columnsEarlyDeliveries = this.returnColumnsEarlyDeliveries(
    //   delivDate,
    //   database
    // );

    return {
      croixNorth: croixNorth,
      shelfProdsNorth: shelfProdsNorth,
      pocketsNorth: pocketsNorth,
      CarltonToPrado: [], //CarltonToPrado,
      Baguettes: Baguettes,
      otherRustics: otherRustics,
      retailStuff: retailStuff,
      earlyDeliveries: earlyDeliveries,
      columnsShelfProdsNorth: columnsShelfProdsNorth,
      columnsPocketsNorth: columnsPocketsNorth,
      columnsCarltonToPrado: [], //columnsCarltonToPrado,
      columnsBaguettes: columnsBaguettes,
      columnsOtherRustics: columnsOtherRustics,
      columnsRetailStuff: columnsRetailStuff,
      columnsEarlyDeliveries: columnsEarlyDeliveries,
    };
  };

  // "original" -- may have been accidentally changed. seems to give incorrect results
  // shelfProdsFilter = (ord) => (1
  //   && (ord.where.includes("Prado")   || ord.prodNick === "fic")
  //   && (ord.routeDepart === "Carlton" || ord.route === "Pick up Carlton")
  //   && ord.packGroup !== "frozen pastries"
  // )

  shelfProdsFilter = (order) => 1
    && order.packGroup !== "frozen pastries"
    && order.where.includes("Prado") // <<< removing the ficelle allowance
    // && (order.where.includes("Prado") || (order.prodNick === "fic"))
    && (order.routeDepart === "Carlton" || order.route === "Pick up Carlton")
    && order.prodNick !== "fic"
    && order.prodNick !== "mdch"

  pocketsNorthFilter = (ord) => 1
    && ord.where.includes("Mixed")
    && ord.packGroup !== "baked pastries"
    && ord.route === "Pick up Carlton"

  // Not in use? the filter is bunk as is -- always returns an empty array
  // CarltonToPradoFilter = ord => 1
  //   && ord.delivDate === convertedToday 
  //   && ord.route     === "Carlton to Prado"

  BaguettesFilter = (ord) => 1
    && ord.prodName === "Baguette" 
    && (0
      || (ord.routeDepart === "Prado" && ord.routeStart > 8) 
      || (ord.routeDepart === "Carlton" && ord.routeArrive === "Prado") 
      || ord.route === "Pick up SLO"
    )

  otherRusticsFilter = (ord) => (1
    && ord.prodName  !== "Baguette"
    && ord.packGroup !== "retail"
    && ord.where.includes("Carlton") 
    && (0
      || (ord.routeDepart === "Prado"   && ord.routeStart > 8)
      || (ord.routeDepart === "Carlton" && ord.routeArrive === "Prado")
      || (ord.route === "Pick up SLO")
    )
  )

  retailStuffFilter = ord => (1
    && ord.packGroup === "retail"
    && (0
      || (ord.routeDepart === "Prado"   && ord.routeStart > 8)
      || (ord.routeDepart === "Carlton" && ord.routeArrive === "Prado")
      || (ord.route       === "Pick up SLO")
    )
  )
    
  earlyDeliveriesFilter = ord => 1
    && ord.routeDepart === "Prado"
    && ord.where.includes("Carlton")
    && ord.routeStart < 8



  returnCroixNorth = (delivDate, database) => {
    // const [products, customers, routes, standing, orders, d, dd, alt, QBInfo] = database;
    const products = database[0]
    const orders = database[4]
    const QBInfo = database[8]

    const T0Orders = getOrdersList(delivDate, database)
      .map(order => ({...order, delivDate }))

    const T1Orders = getOrdersList(tomBasedOnDelivDate(delivDate), database)
      .map(order => ({ ...order, delivDate: tomBasedOnDelivDate(delivDate)}))

    console.log(T0Orders)
    
    let croixRows = [
      { forBake: "Almond", prodNick: "al",   prod: "al",   frozenQty: 0, frozen: {}, bakedQty: 0, baked: {} },
      { forBake: "ch",     prodNick: "ch",   prod: "ch",   frozenQty: 0, frozen: {}, bakedQty: 0, baked: {} },
      { forBake: "pg",     prodNick: "pg",   prod: "pg",   frozenQty: 0, frozen: {}, bakedQty: 0, baked: {} },
      { forBake: "mb",     prodNick: "mb",   prod: "mb",   frozenQty: 0, frozen: {}, bakedQty: 0, baked: {} },
      { forBake: "pl",     prodNick: "pl",   prod: "pl",   frozenQty: 0, frozen: {}, bakedQty: 0, baked: {} },
      { forBake: "sf",     prodNick: "sf",   prod: "sf",   frozenQty: 0, frozen: {}, bakedQty: 0, baked: {} },
      { forBake: "mini",   prodNick: "mini", prod: "mini", frozenQty: 0, frozen: {}, bakedQty: 0, baked: {} },
    ]

    const T0NorthFrozenOrders = T0Orders.filter(order => 1
      && order.packGroup === "frozen pastries"
      && order.doughType === "Croissant"
      && (0
        || order.route === "Pick up Carlton" 
        || order.routeDepart === "Carlton"
      )
    )
    const T0BakedOrders = T0Orders.filter(order => 1
      && order.where.includes("Mixed")
      && order.packGroup === "baked pastries"
      && order.doughType === "Croissant"
    )
    const T1NorthBakedOrders = T1Orders.filter(order => 1
      && order.where.includes("Mixed")
      && order.packGroup === "baked pastries"
      && order.doughType === "Croissant"
      && (0 
        || order.route === "Pick up Carlton" 
        || order.routeDepart === "Carlton"
      )
    )

    for (let row of croixRows) {
      // Frozen Column
      const freezerNorth = 
        products.find(P => P.forBake === row.forBake).freezerNorth ?? 0
      row.frozen.freezerNorth = freezerNorth

      const frozenOrderItems = T0NorthFrozenOrders.filter(order => 
        prodNickToShapeTypeMap[order.prodNick] === row.prodNick
      )
      .map(order => objProject(order, summaryAttributes))

      const frozenOrderQty = sumBy(frozenOrderItems, order => order.qty)
      row.frozen.frozenOrderItems = frozenOrderItems
      row.frozen.frozenOrderQty   = frozenOrderQty

      const bakedOrderItems = T1NorthBakedOrders.filter(order =>
        prodNickToShapeTypeMap[order.prodNick] === row.prodNick
      )
      .map(order => 
        order.custName === "Back Porch Bakery"
          ? { ...order, qty: Math.ceil(order.qty / 2) }
          : order
      )
      .map(order => objProject(order, summaryAttributes))

      const bakedOrderQty = sumBy(bakedOrderItems, order => order.qty)

      row.frozen.bakedOrderItems = bakedOrderItems
      row.frozen.bakedOrderQty =   bakedOrderQty
        
      const qtyNeeded = frozenOrderQty + bakedOrderQty - freezerNorth
      const adjustedQtyNeeded = row.prodNick === "al"
        ? Math.max(0, qtyNeeded)
        : row.prodNick === "mini" 
          ? Math.max(0, Math.ceil(qtyNeeded / 12) * 12)
          : Math.max(0, Math.ceil(qtyNeeded / 12) * 12 + 12)
          
      row.frozenQty = adjustedQtyNeeded

      // Baked Column

      const backporchOrders = T0BakedOrders.filter(order => 1
        && order.custNick === "backporch"
        && prodNickToShapeTypeMap[order.prodNick] === row.prodNick  
      ).map(order => 
        objProject(order, summaryAttributes)
      )
      const backporchQty = sumBy(backporchOrders, order => order.qty) // vulnerable to duplicate items
      row.baked.backporchOrders = backporchOrders
      row.baked.backporchQty    = backporchQty

      const bpbextrasOrders = T0BakedOrders.filter(order => 1
        && order.custNick === "bpbextras"
        && prodNickToShapeTypeMap[order.prodNick] === row.prodNick  
      ).map(order => 
        objProject(order, summaryAttributes)
      )
      const bpbextrasQty = sumBy(bpbextrasOrders, order => order.qty) // vulnerable to duplicate items
      row.baked.bpbextrasOrders = bpbextrasOrders
      row.baked.bpbextrasQty    = bpbextrasQty

      // Just applies a fancy filter to retail orders
      const afterDeadlineOrders = this
        .getOrdersPlacedAfterDeadline(delivDate, orders, QBInfo)
        .filter(order => order.prodNick === row.prodNick)
        .map(order => objProject(order, summaryAttributes))
      const afterDeadlineQty = sumBy(afterDeadlineOrders, order => order.qty)
      row.baked.afterDeadlineOrders = afterDeadlineOrders
      row.baked.afterDeadlineQty    = afterDeadlineQty

      // not the original usage; here we feed the method only orders for the
      // given product instead of filling out the full grid. should return
      // just 1 row.
      const bakedQty = this.createBakedGoingNorth(
        backporchOrders,
        bpbextrasOrders,
        afterDeadlineOrders,  
      )
      row.bakedQty = bakedQty?.[0]?.qty ?? 0

    }

    return croixRows.filter(row => 0
      || row.prodNick !== "mini"
      || row.bakedQty  !== 0
      || row.frozenQty !== 0  
    )

    // // Create Frozens needed North { prod, qty }
    // let currentFreezerNumbers = this.getCurrentFreezerNumbers(products);

    // // console.log("currentFreezerNumbers", currentFreezerNumbers);
    // let frozensLeavingCarlton = this.getFrozensLeavingCarlton(
    //   T0Orders
    // );
    // // console.log("frozensLeavingCarlton", frozensLeavingCarlton);
    // let bakedTomorrowAtCarlton = this.getBakedTomorrowAtCarlton(
    //   delivDate,
    //   database,
    //   T1Orders
    // );
    // // console.log("bakedTomorrowAtCarlton", bakedTomorrowAtCarlton);
    // let currentFrozenNeed = addTwoGrids(
    //   frozensLeavingCarlton,
    //   bakedTomorrowAtCarlton
    // );
    // // console.log("bakedTodayAtCarlton", bakedTomorrowAtCarlton);

    // // If almond, just use the needed amt w/o subtracting inventory
    // // otherwise, subtract inventory and 'adjust' that amount

    // let clone = clonedeep(currentFrozenNeed);
    // // console.log("currentFrozenNeedFirst", clone);
    // let almondQty = 0;
    // try {
    //   almondQty = clone[clone.findIndex((cl) => cl.prod === "al")].qty;
    // } catch {}

    // currentFrozenNeed = subtractGridFromGrid(
    //   currentFreezerNumbers,
    //   currentFrozenNeed
    // );
    // let clone2 = clonedeep(currentFrozenNeed);
    // // console.log("currentFrozenNeedSecond", clone2);

    // currentFrozenNeed = this.adjustForPackSize(currentFrozenNeed);
    // try {
    //   let almondInd = currentFrozenNeed.findIndex((cu) => cu.prod === "al");
    //   currentFrozenNeed[almondInd].qty = almondQty;
      
    // } catch {}

    

    // // Create Baked needed North { prod, qty }
    // let ordersPlacedAfterDeadline = 
    //   this.getOrdersPlacedAfterDeadline(delivDate, orders, QBInfo);
    // let backPorchBakeryOrders = this.getBackPorchBakeryOrders(
    //   delivDate,
    //   database
    // );
    // let bpbExtraOrders = this.getBpbExtraOrders(delivDate, database);

    // let bakedGoingNorth = this.createBakedGoingNorth(
    //   backPorchBakeryOrders,
    //   bpbExtraOrders,
    //   ordersPlacedAfterDeadline
    // );

    // // console.log("bakedGoingNorth",bakedGoingNorth)

    // // Combine Frozens and Baked { prod, bakedQty, frozenQty }
    // let combo = combineTwoGrids(
    //   bakedGoingNorth,
    //   currentFrozenNeed,
    //   "bakedQty",
    //   "frozenQty"
    // );

    // return croixRows.filter(row => 0
    //   || row.prodNick !== "mini"
    //   || row.bakedQty  !== 0
    //   || row.frozenQty !== 0  
    // )
    // return combo;
  };

  // getCurrentFreezerNumbers = (products) => {  
  //   // // create Product List of tomorrow's croissant Bake at Carlton
  //   // let bakedOrdersList = getOrdersList(
  //   //   tomBasedOnDelivDate(delivDate),
  //   //   database
  //   // );
  //   // bakedOrdersList = Array.from(
  //   //   new Set(
  //   //     bakedOrdersList
  //   //       .filter((frz) => this.NorthCroixBakeFilter(frz))
  //   //       .map((pr) => pr.forBake)
  //   //   )
  //   // );

  //   // // create Product List of frozen croissant deliveries leaving Carlton
  //   // let frozenToday = getOrdersList(delivDate, database);
  //   // frozenToday = Array.from(
  //   //   new Set(
  //   //     frozenToday
  //   //       .filter((frz) => this.frzNorthFilter(frz))
  //   //       .map((pr) => pr.forBake)
  //   //   )
  //   // );

  //   // // need to remove the 'fr' so that it matches bakedOrder attribute
  //   // frozenToday = convertFrozenAttrToPlainAttr(frozenToday);
  //   // // console.log("frozen today:", frozenToday)

  //   // // combine product lists
  //   // frozenToday = frozenToday.concat(bakedOrdersList);

  //   // console.log("frozenToday",frozenToday)

  //   // // create array { prod, qty }
  //   // let frozenArray = [];
  //   // for (let fr of frozenToday) {
  //   //   let ind = products.findIndex((prod) => prod.forBake === fr);
  //   //   let qty = products[ind].freezerNorth;
  //   //   let prod = products[ind].nickName;
  //   //   let item = {
  //   //     prod: prod,
  //   //     qty: qty ? qty : 0,
  //   //   };
  //   //   frozenArray.push(item);
  //   // }

  //   // frozen stock counts are held in the baked croissant's Product record.
  //   // search by the products forBake, but make sure the product list is
  //   // sorted by prodName (ascending) first. The product list called from
  //   // 'database' is already sorted this way.
  //   const croissantProducts = products.filter(P => (1
  //     && P.packGroup === "baked pastries"
  //     && P.doughType === "Croissant"
  //   ))

  //   const inventoryKeys = listUniq(croissantProducts.map(P => P.forBake))
  //   const frozenArray2 = inventoryKeys.map(forBakeKey => {
  //     const productRepresentative = products.find(P => P.forBake === forBakeKey)
  //     const { nickName, freezerNorth } = productRepresentative ?? {}

  //     return {
  //       prod: nickName,
  //       qty: freezerNorth ?? 0
  //     }
  //   })


  //   // console.log("frozenArray",frozenArray)
  //   console.log("frozenArray2",frozenArray2)

  //   return frozenArray2;
  // };

  // NorthCroixBakeFilter = (ord) => {
  //   return (
  //     ord.where.includes("Mixed") &&
  //     ord.packGroup === "baked pastries" &&
  //     ord.doughType === "Croissant" &&
  //     (ord.route === "Pick up Carlton" || ord.routeDepart === "Carlton")
  //   );
  // };

  // getFrozensLeavingCarlton = (T0Orders) => {
  //   // let frozenToday = getOrdersList(delivDate, database);
  //   // let fr = clonedeep(frozenToday);
    
  //   // frozenToday = Array.from(
  //   //   new Set(frozenToday.filter((frz) => this.frzNorthFilter(frz)))
  //   // );
  //   // frozenToday = this.makeAddFrozenQty(frozenToday);
  //   // frozenToday = convertFrozenAttrToPlainAttr(frozenToday);
  //   // return frozenToday;

  //   const T0FrozenOrders = T0Orders.filter(order => 1
  //     && order.packGroup === "frozen pastries"
  //     && order.doughType === "Croissant"
  //     && (0
  //       || order.route === "Pick up Carlton" 
  //       || order.routeDepart === "Carlton"
  //     )
  //   )
    
  //   const frozenGrid = 
  //     groupByArray(T0FrozenOrders, order => order.forBake)
  //       .map(forBakeGroup => ({
  //         prod: forBakeGroup[0].forBake,
  //         nick: forBakeGroup[0].prodNick,
  //         qty: sumBy(forBakeGroup, order => order.qty),
  //         items: forBakeGroup.map(order => ({
  //           custNick: order.custNick,
  //           prodNick: order.prodNick,
  //           qty: order.qty
  //         }))
  //       }))

  //   return frozenGrid

  // };

  // frzNorthFilter = (ord) => {
  //   return (
  //     ord.packGroup === "frozen pastries" &&
  //     ord.doughType === "Croissant" &&
  //     (ord.route === "Pick up Carlton" || ord.routeDepart === "Carlton")
  //   );
  // };

  // makeAddFrozenQty = (frozenToday) => {
  //   let makeList = frozenToday.map((mk) => ({
  //     prod: mk.forBake,
  //     nick: mk.prodNick,
  //     qty: 0,
  //   }));

  //   for (let make of makeList) {
  //     // console.log("frozenToday", frozenToday);
  //     // console.log("make", make);
  //     let qtyAccToday = 0;
  //     let qtyToday = frozenToday
  //       .filter((frz) => make.prod === frz.forBake)
  //       .map((ord) => ord.qty);

  //     if (qtyToday.length > 0) {
  //       qtyAccToday = qtyToday.reduce(addUp);
  //     }
  //     make.qty = qtyAccToday;
  //   }

  //   for (let make of makeList) {
  //     make.prod = make.nick;
  //     if (make.nick.substring(0, 2) === "fr") {
  //       make.nick = make.nick.substring(2);
  //     }
  //     delete make.nick;
  //   }
  //   // console.log("MAKELIST ASEIKHGFWSIEKHGTWE", makeList)

  //   return makeList;
  // };

  // getBakedTomorrowAtCarlton = (delivDate, database, T1Orders) => {
  //   // let bakedOrdersList = getOrdersList(
  //   //   tomBasedOnDelivDate(delivDate),
  //   //   database
  //   // );
    
  //   // let bakedTomorrow = bakedOrdersList.filter((frz) =>
  //   //   this.NorthCroixBakeFilter(frz)
  //   // );

  //   // for (let baked of bakedTomorrow){
  //   //   if (baked.custName === "Back Porch Bakery"){
  //   //     baked.qty = Math.ceil(baked.qty/2)
  //   //   }
  //   // }

  //   // bakedTomorrow = this.makeAddQty(bakedTomorrow);

  //   const bakedTomorrowOrders = T1Orders.filter(order => (1
  //     && order.where.includes("Mixed")
  //     && order.packGroup === "baked pastries"
  //     && order.doughType === "Croissant"
  //     && (0 
  //       || order.route === "Pick up Carlton" 
  //       || order.routeDepart === "Carlton"
  //     )
  //   )).map(order => order.custName === "Back Porch Bakery"
  //     ? { ...order, qty: Math.ceil(order.qty / 2) }
  //     : order
  //   )

  //   const bakedTomorrow = this.makeAddQty(bakedTomorrowOrders);

  //   return bakedTomorrow;
  // };

  // makeAddQty = (bake) => {
  //   let makeList2 = Array.from(new Set(bake.map((prod) => prod.prodNick))).map(
  //     (mk) => ({
  //       prod: mk,
  //       qty: 0,
  //     })
  //   );
  //   for (let make of makeList2) {
  //     make.qty = 1;

  //     let qtyAccToday = 0;

  //     let qtyToday = bake
  //       .filter((frz) => make.prod === frz.prodNick)
  //       .map((ord) => ord.qty);

  //     if (qtyToday.length > 0) {
  //       qtyAccToday = qtyToday.reduce(addUp);
  //     }
  //     make.qty = qtyAccToday;
  //   }
  //   return makeList2;
  // };

  // adjustForPackSize = (data) => {
  //   // console.log("data", data);
  //   for (let d of data) {
  //     d.qty = Math.ceil(d.qty / 12) * 12 + 12;
  //     if (d.qty < 0) {
  //       d.qty = 0;
  //     }
  //   }

  //   return data;
  // };

  getOrdersPlacedAfterDeadline = (delivDate, orders, QBInfo) => {
    // console.log("QBInfo", QBInfo);
    const tomorrow = tomBasedOnDelivDate(delivDate)

    const southSetoutRecord = QBInfo.find(item =>
      item.id === tomorrow + "PradosetoutTime"
    )
    const southSetoutTime = !!southSetoutRecord 
      ? new Date(southSetoutRecord.updatedAt) 
      : new Date()

    const northSetoutRecord = QBInfo.find(item =>
      item.id === tomorrow + "PradosetoutTime"
    )
    const northSetoutTime = !!northSetoutRecord 
      ? new Date(northSetoutRecord.updatedAt) 
      : new Date()

    return orders.filter(ord => 1
      && ord.isWhole   === false
      && ord.delivDate === convertDatetoBPBDate(delivDate) 
      && (0
        || (ord.route === "slopick"   && new Date(ord.updatedAt) > southSetoutTime)
        || (ord.route === "atownpick" && new Date(ord.updatedAt) > northSetoutTime)
      )
    )
  };

  // getBackPorchBakeryOrders = (delivDate, database) => {
  //   let BackPorchOrders = getOrdersList(today, database).filter(
  //     (ord) =>
  //       ord.custName === "Back Porch Bakery" && ord.doughType === "Croissant"
  //   );
  //   return BackPorchOrders;
  // };

  // getBpbExtraOrders = (delivDate, database) => {
  //   let BPBExtraOrders = getOrdersList(today, database).filter(
  //     (ord) => ord.custName === "BPB Extras" && ord.doughType === "Croissant"
  //   );
  //   return BPBExtraOrders;
  // };

  createBakedGoingNorth = (
    backPorchBakeryOrders,
    bpbExtraOrders,
    ordersPlacedAfterDeadline
  ) => {
    let bakedGoingNorth = [];
    for (let back of backPorchBakeryOrders) {

      // backporch qty
      let qtyback = back.qty;

      // bpbextras qty
      let qtyex = bpbExtraOrders.find(item => 
        item.prodName === back.prodName
      )?.qty ?? 0

      // retail-after-deadline qty
      let qtyord = ordersPlacedAfterDeadline.find(item => 
        item.prodName === back.prodName
      )?.qty ?? 0

      let factor = 1 - qtyex / qtyback;
      let start = qtyback - qtyord;
      let qty = start * factor;
      let qtyFinal = Math.round(qty - qtyback / 2);

      let item = {
        prod: back.prodNick,
        qty: qtyFinal,
      };

      bakedGoingNorth.push(item);
    }

    return bakedGoingNorth;

  };

  // combineGrids = (obj1, obj2) => {
  //   let firstObject = clonedeep(obj1);
  //   let secondObject = clonedeep(obj2);
  //   for (let first of firstObject) {
  //     for (let sec of secondObject) {
  //       if (first.prodNick === sec.prodNick) {
  //         first.qty += sec.qty;
  //       }
  //     }
  //   }

  //   for (let sec of secondObject) {
  //     for (let first of firstObject) {
  //       if (sec.prodNick === first.prodNick) {
  //         sec.qty = first.qty;
  //         continue;
  //       }
  //     }
  //     sec.prodNick = "fr" + sec.prodNick;
  //   }

  //   return secondObject;
  // };

  // subtractCurrentStock = (products, grid) => {
  //   for (let gr of grid) {
  //     let short = gr.prodNick.substring(2);
  //     let subQty =
  //       products[products.findIndex((prod) => prod.nickName === short)]
  //         .freezerNorth;

  //     gr.qty -= subQty;
  //     if (gr.qty < 0) {
  //       gr.qty = 0;
  //     }
  //   }
  //   return grid;
  // };

  // returnPocketsNorth = (delivDate, database) => {
  //   const pocketNorthOrders = getOrdersList(delivDate, database).filter(order => 1
  //     && order.where.includes("Mixed")
  //     && order.packGroup !== "baked pastries"
  //     && order.route === "Pick up Carlton"
  //   )
  //   return this.generateBasicPivotAndColumns(pocketNorthOrders)
  //   // let shelfProds = makeOrders(today, database, this.pocketsNorthFilter);
  //   // let shelfProds = makeOrders(delivDate, database, this.pocketsNorthFilter);
  //   // return shelfProds;
  // };

  // pocketsNorthFilter = (ord) => 1
  //   && ord.where.includes("Mixed")
  //   && ord.packGroup !== "baked pastries"
  //   && ord.route === "Pick up Carlton"

  // returnShelfProdsNorth = (delivDate, database) => {
  //   const shelfOrders = getOrdersList(delivDate, database)
  //     .filter(order => 1
  //       && order.packGroup !== "frozen pastries"
  //       && order.where.includes("Prado") // <<< removing the ficelle allowance
  //       // && (order.where.includes("Prado") || (order.prodNick === "fic"))
  //       && (order.routeDepart === "Carlton" || order.route === "Pick up Carlton")
  //       && order.prodNick !== "fic"
  //       && order.prodNick !== "mdch"
  //     )
  //   console.log("shelfOrders", shelfOrders)

    
  //   const pivotTable = tablePivot(
  //     shelfOrders, 
  //     { customer: row => row.custName },
  //     "prodNick",
  //     dataCell => sumBy(dataCell, order => (order.qty * order.packSize))
  //   )

  //   const flattenedPivotTable = tablePivotFlatten(pivotTable).map(row => {
  //     const { rowKey, ...otherProps } = row
  //     return otherProps
  //   }).map(row => ({
  //     ...row,
  //     customerShort: row.customer.length > 10 
  //       ? row.customer.substring(0,15) + "..." 
  //       : row.customer
  //     // customerShort: truncate(row.customer, { length: 18 })
  //   }))

  //   const shelfProdNicks = Object.keys(pivotTable[0].rowProps).sort()
  //   const columnTemplate = shelfProdNicks.length > 0
  //     ? createColumns(shelfProdNicks)
  //     : []

  //   // console.log("SHELF pivotTable", pivotTable)
  //   // console.log("flattenedPivotTable", flattenedPivotTable)

  //   // const shelfProdNicks = 
  //   //   uniqBy(shelfOrders, order => order.prodNick).map(order => order.prodNick)

  //   // const shelfProductColumnTemplate = 
  //   //   Object.fromEntries(shelfProdNicks.map(pn => [pn, null]))

  //   // console.log("shelfProductColumnTemplate", shelfProductColumnTemplate)

  //   // const shelfOrderRows = 
  //   //   groupByArray(shelfOrders, order => order.custNick).map(row => {
  //   //     const pivotedRow = groupByObject(row, order => order.prodNick)

  //   //     return {
  //   //       customer: row[0].custName,
  //   //       customerShort: truncate(row[0].custName, { length: 18 }),
  //   //       ...shelfProductColumnTemplate,
  //   //       ...mapValues(pivotedRow, prodNickGroup => prodNickGroup[0].qty * prodNickGroup[0].packSize)
  //   //     }
  //   //   })
  //   // console.log("shelfOrderRows", shelfOrderRows)
  //   // console.log("pivotTable", pivotTable)
  //   // console.log("pivotTableFlat", flattenedPivotTable)
  
  //   // return shelfOrderRows
  //   // return makeOrdersShelf(delivDate, database, this.shelfProdsFilter);

  //   return [flattenedPivotTable, columnTemplate]

  // };

  // may have been unintentionally altered?
  // shelfProdsFilter = (ord) => (1
  //   && (ord.where.includes("Prado")   || ord.prodNick === "fic")
  //   && (ord.routeDepart === "Carlton" || ord.route === "Pick up Carlton")
  //   && ord.packGroup !== "frozen pastries"
  // )

  // shelfProdsFilter2 = (order) => 1
  //   && order.packGroup !== "frozen pastries"
  //   && order.where.includes("Prado") // <<< removing the ficelle allowance
  //   // && (order.where.includes("Prado") || (order.prodNick === "fic"))
  //   && (order.routeDepart === "Carlton" || order.route === "Pick up Carlton")
  //   && order.prodNick !== "fic"
  //   && order.prodNick !== "mdch"

  // returnBaguettes = (delivDate, database) => {
  //   const baguetteOrders = getOrdersList(delivDate, database).filter(order => 1
  //     && order.prodName === "Baguette" 
  //     && (0
  //       || (order.routeDepart === "Prado"   && order.routeStart > 8) 
  //       || (order.routeDepart === "Carlton" && order.routeArrive === "Prado") 
  //       || order.route === "Pick up SLO"
  //     )
  //   )
  //   return this.generateBasicPivotAndColumns(baguetteOrders)
  //   // return = makeOrders(delivDate, database, this.BaguettesFilter)
  //   //   .sort(compareBy(item => item.routeName))
  //   //   .sort(compareBy(item => item.isLongDriver, 'desc'))
  //   //   .map(row => ({ 
  //   //     ...row, 
  //   //     customerShort: row.isLongDriver 
  //   //       ? row.customerShort
  //   //       : "* " + row.customerShort
  //   //   }))

  // };

  // BaguettesFilter = (ord) => 1
  //   && ord.prodName === "Baguette" 
  //   && (0
  //     || (ord.routeDepart === "Prado" && ord.routeStart > 8) 
  //     || (ord.routeDepart === "Carlton" && ord.routeArrive === "Prado") 
  //     || ord.route === "Pick up SLO"
  //   )

  // returnOtherRustics = (delivDate, database) => {
  //   return makeOrders(delivDate, database, this.otherRusticsFilter)
  //     .sort(compareBy(item => item.routeName))
  //     .sort(compareBy(item => item.isLongDriver, 'desc'))
  //     .map(row => ({ 
  //       ...row, 
  //       customerShort: row.isLongDriver 
  //         ? row.customerShort
  //         : "* " + row.customerShort
  //     }))
  // };

  // otherRusticsFilter = (ord) => (1
  //   && ord.prodName  !== "Baguette"
  //   && ord.packGroup !== "retail"
  //   && ord.where.includes("Carlton") 
  //   && (0
  //     || (ord.routeDepart === "Prado"   && ord.routeStart > 8)
  //     || (ord.routeDepart === "Carlton" && ord.routeArrive === "Prado")
  //     || (ord.route === "Pick up SLO")
  //   )
  // )

  // returnRetailStuff = (delivDate, database) => {
  //   return makeOrders(delivDate, database, this.retailStuffFilter)
  //     .sort(compareBy(item => item.routeName))
  //     .sort(compareBy(item => item.isLongDriver, 'desc'))
  //     .map(row => ({ 
  //       ...row, 
  //       customerShort: row.isLongDriver 
  //         ? row.customerShort
  //         : "* " + row.customerShort
  //     }))
  // };

  // retailStuffFilter = ord => (1
  //   && ord.packGroup === "retail"
  //   && (0
  //     || (ord.routeDepart === "Prado"   && ord.routeStart > 8)
  //     || (ord.routeDepart === "Carlton" && ord.routeArrive === "Prado")
  //     || (ord.route       === "Pick up SLO")
  //   )
  // )

  // returnEarlyDeliveries = (delivDate, database) => {
  //   return makeOrders(delivDate, database, this.earlyDeliveriesFilter)
  //     .sort(compareBy(item => item.routeName))
  //     .sort(compareBy(item => item.isLongDriver, 'desc'))
  //     .map(row => ({ 
  //       ...row, 
  //       customerShort: row.isLongDriver 
  //         ? row.customerShort
  //         : "* " + row.customerShort
  //     }))
  // };

  // earlyDeliveriesFilter = ord => (1
  //   && ord.routeDepart === "Prado"
  //   && ord.where.includes("Carlton")
  //   && ord.routeStart < 8
  // )

  // returnColumnsShelfProdsNorth = (delivDate, database) => {
  //   let filteredOrders = getProdNickNames(
  //     delivDate,
  //     database,
  //     this.shelfProdsFilter
  //   );
  //   if (filteredOrders.length > 0) {
  //     return createColumns(filteredOrders);
  //   } else {
  //     return [];
  //   }
  // };

  // returnColumnsPocketsNorth = (delivDate, database) => {
  //   let filteredOrders = getProdNickNames(
  //     delivDate,
  //     database,
  //     this.pocketsNorthFilter
  //   );
  //   if (filteredOrders.length > 0) {
  //     return createColumns(filteredOrders);
  //   } else {
  //     return [];
  //   }
  // };

  // CarltonToPradoFilter = (ord) => 
  //   ord.delivDate === convertedToday && ord.route === "Carlton to Prado"

  // returnCarltonToPrado = (delivDate, database) => {
  //   let shelfProds = makeOrders(delivDate, database, this.CarltonToPradoFilter);
  //   return shelfProds;
  // };

  // returnColumnsCarltonToPrado = (delivDate, database) => {
  //   let filteredOrders = getProdNickNames(
  //     delivDate,
  //     database,
  //     this.CarltonToPradoFilter
  //   );
  //   if (filteredOrders.length > 0) {
  //     return createColumns(filteredOrders);
  //   } else {
  //     return [];
  //   }
  // };

  // returnColumnsBaguettes = (delivDate, database) => {
  //   let filteredOrders = getProdNickNames(
  //     delivDate,
  //     database,
  //     this.BaguettesFilter
  //   );
  //   if (filteredOrders.length > 0) {
  //     return createColumns(filteredOrders);
  //   } else {
  //     return [];
  //   }
  // };

  // returnColumnsOtherRustics = (delivDate, database) => {
  //   let filteredOrders = getProdNickNames(
  //     delivDate,
  //     database,
  //     this.otherRusticsFilter
  //   );
  //   if (filteredOrders.length > 0) {
  //     return createColumns(filteredOrders);
  //   } else {
  //     return [];
  //   }
  // };

  // returnColumnsRetailStuff = (delivDate, database) => {
  //   let filteredOrders = getProdNickNames(
  //     delivDate,
  //     database,
  //     this.retailStuffFilter
  //   );
  //   if (filteredOrders.length > 0) {
  //     return createColumns(filteredOrders);
  //   } else {
  //     return [];
  //   }
  // };

  // returnColumnsEarlyDeliveries = (delivDate, database) => {
  //   let filteredOrders = getProdNickNames(
  //     tomorrow,
  //     database,
  //     this.earlyDeliveriesFilter
  //   );
  //   if (filteredOrders.length > 0) {
  //     return createColumns(filteredOrders);
  //   } else {
  //     return [];
  //   }
  // };

}