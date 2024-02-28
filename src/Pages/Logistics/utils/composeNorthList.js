import {
  convertDatetoBPBDate,
  tomBasedOnDelivDate,
} from "../../../helpers/dateTimeHelpers";

import { createColumns } from "../../../helpers/delivGridHelpers";

import { sumBy } from "../../../utils/collectionFns/sumBy";
import { objProject } from "../../../utils/objectFns/objProject";
import { compareBy } from "../../../utils/collectionFns/compareBy";
import { tablePivot, tablePivotFlatten } from "../../../utils/tablePivot";
// import { addRoutes } from "../../../core/logistics/addRoutes";
import { getOrdersList as _getOrdersList } from "../../../core/production/getOrdersList";
  
// New add routes fn might as well include driver attribute...
const getOrdersList = (delivDate, database, includeHolding) => {
  const routes = database[2]

  return _getOrdersList(delivDate, database, includeHolding).map(order =>  {
    const driver = routes.find(R => R.routeName === order.route)?.driver ?? null
    return {
      ...order,
      driver
    }
  })
}

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
  al:    "al",
  fral:  "al",
  ch:    "ch",
  frch:  "ch",
  pg:    "pg",
  frpg:  "frpg",
  mb:    "mb",
  unmb:  "mb",
  frmb:  "mb",
  pl:    "pl",
  frpl:  "pl",
  sf:    "sf",
  frsf:  "sf",
  mini:  "mini",
  frmni: "mini",
}

const summaryAttributes = ['prodNick', 'custNick', 'delivDate', 'qty', 'route']



// *************************************************************************
// Main
// *************************************************************************

export default class ComposeNorthList {
  returnNorthBreakDown = (delivDate, database) => {
    let croixNorth = this.returnCroixNorth(delivDate, database);
    // console.log("croixNorth", croixNorth)

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

      // Baked tomorrow
      const bakedOrderItems = T1NorthBakedOrders.filter(order =>
        prodNickToShapeTypeMap[order.prodNick] === row.prodNick

      ).map(order => order.custName === "Back Porch Bakery"
        ? { ...order, qty: Math.ceil(order.qty / 2) }
        : order

      ).map(order => objProject(order, summaryAttributes))

      const bakedOrderQty = sumBy(bakedOrderItems, order => order.qty)

      row.frozen.bakedOrderItems = bakedOrderItems
      row.frozen.bakedOrderQty   = bakedOrderQty // << equal to the old getBakedTomorrowAtCarlton qty
        
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

  };


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

  // *************************************************************
  // * DEPRECATED
  // *************************************************************

  getFrozensLeavingCarlton = (delivDate, database) => {
    let frozenToday = getOrdersList(delivDate, database);
    // let fr = clonedeep(frozenToday);
    
    frozenToday = Array.from(
      new Set(frozenToday.filter((frz) => this.#frzNorthFilter(frz)))
    );
    frozenToday = this.#makeAddFrozenQty(frozenToday);
    frozenToday = convertFrozenAttrToPlainAttr(frozenToday);
    return frozenToday;
  };


  #frzNorthFilter = (ord) => {
    return (
      ord.packGroup === "frozen pastries" &&
      ord.doughType === "Croissant" &&
      (ord.route === "Pick up Carlton" || ord.routeDepart === "Carlton")
    );
  };

  #makeAddFrozenQty = (frozenToday) => {
    let makeList = frozenToday.map((mk) => ({
      prod: mk.forBake,
      nick: mk.prodNick,
      qty: 0,
    }));

    for (let make of makeList) {
      // console.log("frozenToday", frozenToday);
      // console.log("make", make);
      let qtyAccToday = 0;
      let qtyToday = frozenToday
        .filter((frz) => make.prod === frz.forBake)
        .map((ord) => ord.qty);

      if (qtyToday.length > 0) {
        qtyAccToday = qtyToday.reduce(addUp);
      }
      make.qty = qtyAccToday;
    }

    for (let make of makeList) {
      make.prod = make.nick;
      if (make.nick.substring(0, 2) === "fr") {
        make.nick = make.nick.substring(2);
      }
      delete make.nick;
    }

    return makeList;
  };

  getBakedTomorrowAtCarlton = (delivDate, database) => {
    let bakedOrdersList = getOrdersList(
      tomBasedOnDelivDate(delivDate),
      database
    );
    
    let bakedTomorrow = bakedOrdersList.filter((frz) =>
      this.#NorthCroixBakeFilter(frz)
    );

    for (let baked of bakedTomorrow){
      if (baked.custName === "Back Porch Bakery"){
        baked.qty = Math.ceil(baked.qty/2)
      }
    }
   
    bakedTomorrow = this.#makeAddQty(bakedTomorrow);

    return bakedTomorrow;
  };

  #makeAddQty = (bake) => {
    let makeList2 = Array.from(new Set(bake.map((prod) => prod.prodNick))).map(
      (mk) => ({
        prod: mk,
        qty: 0,
      })
    );
    for (let make of makeList2) {
      make.qty = 1;

      let qtyAccToday = 0;

      let qtyToday = bake
        .filter((frz) => make.prod === frz.prodNick)
        .map((ord) => ord.qty);

      if (qtyToday.length > 0) {
        qtyAccToday = qtyToday.reduce(addUp);
      }
      make.qty = qtyAccToday;
    }
    return makeList2;
  };

  #NorthCroixBakeFilter = (ord) => {
    return (
      ord.where.includes("Mixed") &&
      ord.packGroup === "baked pastries" &&
      ord.doughType === "Croissant" &&
      (ord.route === "Pick up Carlton" || ord.routeDepart === "Carlton")
    );
  };

}



// *****************************************
// * DEPRECATED
// *****************************************

const addUp = (acc, val) => {
  return acc + val;
};

const convertFrozenAttrToPlainAttr = (data) => {
  try {
    for (let d of data) {
      d.prod = d.prod.substring(2);
    }
  } catch {
    for (let d of data) {
      d = d.substring(2);
    }
  }

  return data;
};