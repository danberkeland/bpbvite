import {
    convertDatetoBPBDate,
    todayPlus,
    tomBasedOnDelivDate,
    TwodayBasedOnDelivDate,
    ThreedayBasedOnDelivDate,
  } from "../../../helpers/dateTimeHelpers";
  
  import {
    createColumns,
    zerosDelivFilter,
    buildGridOrderArray,
  } from "../../../helpers/delivGridHelpers";
  
  import { getFullOrders } from "../../../helpers/CartBuildingHelpers";
  
  import {
    sortZtoADataByIndex,
    addTwoGrids,
    subtractGridFromGrid,
    combineTwoGrids,
  } from "../../../helpers/sortDataHelpers";
  
  import {
    calcDayNum,
    routeRunsThatDay,
    productCanBeInPlace,
    productReadyBeforeRouteStarts,
    customerIsOpen,
  } from "../ByRoute/Parts/utils/utils";
import { DateTime } from "luxon";
import { flow, map, orderBy, sortBy } from "lodash/fp";
  
  const incrementDate = (isoDate, nDays) => DateTime
    .fromISO(isoDate, { zone: 'America/Los_Angeles' })
    .startOf('day')
    .plus({ days: nDays })
    .toFormat('yyyy-MM-dd')

  const clonedeep = require("lodash.clonedeep");
  let tomorrow = todayPlus()[1];
  let today = todayPlus()[0];
  let convertedToday = convertDatetoBPBDate(today);
  let convertedTomorrow = convertDatetoBPBDate(tomorrow);
  
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
  
  const getProdNickNames = (delivDate, database, filter) => {
    const [products, customers, routes, standing, orders] = database;
    let fullOrder = getFullOrders(delivDate, database);
    fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
    fullOrder = buildGridOrderArray(fullOrder, database);
    fullOrder = addRoutes(delivDate, fullOrder, database);
  
    let fullNames = Array.from(
      new Set(fullOrder.filter((fu) => filter(fu)).map((fil) => fil.prodName))
    );
    let nickNames = fullNames.map(
      (fil) =>
        products[products.findIndex((prod) => fil === prod.prodName)].nickName
    );
    return nickNames;
  };
  
  const getCustNames = (delivDate, database, filter) => {
    const [products, customers, routes, standing, orders] = database;
    let fullOrder = getFullOrders(delivDate, database);
    fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
    fullOrder = buildGridOrderArray(fullOrder, database);
    fullOrder = addRoutes(delivDate, fullOrder, database);
  
    return Array.from(
      new Set(fullOrder.filter((fu) => filter(fu)).map((fil) => fil.custName))
    );
  };
  
  const getOrdersList = (delivDate, database) => {
    let fullOrder = getFullOrders(delivDate, database);
    fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
    fullOrder = buildGridOrderArray(fullOrder, database);
    fullOrder = addRoutes(delivDate, fullOrder, database);
    return fullOrder;
  };
  
  const makeOrders = (delivDate, database, filter) => {
    const [products, customers, routes, standing, orders] = database;
    let prodNames = getProdNickNames(delivDate, database, filter);
    let custNames = getCustNames(delivDate, database, filter);
    let fullOrder = getFullOrders(delivDate, database);
    fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
    fullOrder = buildGridOrderArray(fullOrder, database);
    fullOrder = addRoutes(delivDate, fullOrder, database);
    console.log("FULL:", fullOrder)
    
    let orderArray = [];
    for (let cust of custNames) {
      const orderMatch = fullOrder.find(order => order.custName === cust)
      const route = routes.find(R => R.routeName === orderMatch.route)
      const isLongDriver = route.driver === 'Long Driver'

      let custItem = {};
      custItem = {
        customer: cust,
        customerShort: cust.length>10 ? cust.substring(0,15)+"..." : cust,
        routeName: orderMatch.route,
        isLongDriver,
      };
      for (let prod of prodNames) {
        let pro = products[products.findIndex((pr) => pr.nickName === prod)]
        let prodFullName =
          pro.prodName;
        try {
          custItem[prod] =
            fullOrder[
              fullOrder.findIndex(
                (ord) => ord.prodName === prodFullName && ord.custName === cust
              )
            ].qty * pro.packSize;
        } catch {
          custItem[prod] = null;
        }
      }
      orderArray.push(custItem);
    }
    return orderArray;
  };
  
  const makeOrdersShelf = (delivDate, database, filter) => {
    const [products, customers, routes, standing, orders] = database;
    let prodNames = getProdNickNames(delivDate, database, filter);
    let custNames = getCustNames(delivDate, database, filter);
    let fullOrder = getFullOrders(delivDate, database);
    fullOrder = zerosDelivFilter(fullOrder, delivDate, database);
    fullOrder = buildGridOrderArray(fullOrder, database);
    fullOrder = addRoutes(delivDate, fullOrder, database);
    
    let orderArray = [];
    for (let cust of custNames) {
      let custItem = {};
      custItem = {
        customer: cust,
        customerShort: cust.length>10 ? cust.substring(0,15)+"..." : cust
      };
      for (let prod of prodNames) {
        let pro = products[products.findIndex((pr) => pr.nickName === prod)]
        let prodFullName =
          pro.prodName;
        try {
          custItem[prod] =
            fullOrder[
              fullOrder.findIndex(
                (ord) => ord.prodName === prodFullName && ord.custName === cust && (ord.prodNick === "fic" ? ord.route !== "Pick up Carlton" : true)
              )
            ].qty * pro.packSize;
        } catch {
          custItem[prod] = null;
        }
      }
      orderArray.push(custItem);
    }
    return orderArray;
  };
  
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
  
  export default class ComposeNorthList {
    returnNorthBreakDown = (delivDate, database) => {
      let croixNorth = this.returnCroixNorth(delivDate, database);
      let shelfProdsNorth = this.returnShelfProdsNorth(delivDate, database);
      let pocketsNorth = this.returnPocketsNorth(delivDate, database);
      let CarltonToPrado = this.returnCarltonToPrado(delivDate, database);
      let Baguettes = this.returnBaguettes(delivDate, database);
      let otherRustics = this.returnOtherRustics(delivDate, database);
      let retailStuff = this.returnRetailStuff(delivDate, database);
      let earlyDeliveries = this.returnEarlyDeliveries(delivDate, database);
      let columnsShelfProdsNorth = this.returnColumnsShelfProdsNorth(
        delivDate,
        database
      );
      let columnsPocketsNorth = this.returnColumnsPocketsNorth(
        delivDate,
        database
      );
      let columnsCarltonToPrado = this.returnColumnsCarltonToPrado(
        delivDate,
        database
      );
      let columnsBaguettes = this.returnColumnsBaguettes(delivDate, database);
      let columnsOtherRustics = this.returnColumnsOtherRustics(
        delivDate,
        database
      );
      let columnsRetailStuff = this.returnColumnsRetailStuff(delivDate, database);
      let columnsEarlyDeliveries = this.returnColumnsEarlyDeliveries(
        delivDate,
        database
      );
  
      return {
        croixNorth: croixNorth,
        shelfProdsNorth: shelfProdsNorth,
        pocketsNorth: pocketsNorth,
        CarltonToPrado: CarltonToPrado,
        Baguettes: Baguettes,
        otherRustics: otherRustics,
        retailStuff: retailStuff,
        earlyDeliveries: earlyDeliveries,
        columnsShelfProdsNorth: columnsShelfProdsNorth,
        columnsPocketsNorth: columnsPocketsNorth,
        columnsCarltonToPrado: columnsCarltonToPrado,
        columnsBaguettes: columnsBaguettes,
        columnsOtherRustics: columnsOtherRustics,
        columnsRetailStuff: columnsRetailStuff,
        columnsEarlyDeliveries: columnsEarlyDeliveries,
      };
    };
  
    returnCroixNorth = (delivDate, database) => {
      
      // Create Frozens needed North { prod, qty }
      let currentFreezerNumbers = this.getCurrentFreezerNumbers(
        delivDate,
        database
      );
      console.log("currentFreezerNumbers", currentFreezerNumbers);
      let frozensLeavingCarlton = this.getFrozensLeavingCarlton(
        delivDate,
        database
      );
      console.log("frozensLeavingCarlton", frozensLeavingCarlton);
      let bakedTomorrowAtCarlton = this.getBakedTomorrowAtCarlton(
        delivDate,
        database
      );
      console.log("bakedTomorrowAtCarlton", bakedTomorrowAtCarlton);
      let currentFrozenNeed = addTwoGrids(
        frozensLeavingCarlton,
        bakedTomorrowAtCarlton
      );
      console.log("bakedTodayAtCarlton", bakedTomorrowAtCarlton);
      let clone = clonedeep(currentFrozenNeed);
      console.log("currentFrozenNeedFirst", clone);
      let almondQty = 0;
      try {
        almondQty = clone[clone.findIndex((cl) => cl.prod === "al")].qty;
      } catch {}
  
      currentFrozenNeed = subtractGridFromGrid(
        currentFreezerNumbers,
        currentFrozenNeed
      );
      let clone2 = clonedeep(currentFrozenNeed);
      console.log("currentFrozenNeedSecond", clone2);
  
      currentFrozenNeed = this.adjustForPackSize(currentFrozenNeed);
      try {
        let almondInd = currentFrozenNeed.findIndex((cu) => cu.prod === "al");
        currentFrozenNeed[almondInd].qty = almondQty;
       
      } catch {}
  
     
  
      // Create Baked needed North { prod, qty }
      let ordersPlacedAfterDeadline = this.getOrdersPlacedAfterDeadline(
        delivDate,
        database
      );
      let backPorchBakeryOrders = this.getBackPorchBakeryOrders(
        delivDate,
        database
      );
      let bpbExtraOrders = this.getBpbExtraOrders(delivDate, database);
  
      let bakedGoingNorth = this.createBakedGoingNorth(
        backPorchBakeryOrders,
        bpbExtraOrders,
        ordersPlacedAfterDeadline
      );
  
      console.log("bakedGoingNorth",bakedGoingNorth)
  
      // Combine Frozens and Baked { prod, bakedQty, frozenQty }
      let combo = combineTwoGrids(
        bakedGoingNorth,
        currentFrozenNeed,
        "bakedQty",
        "frozenQty"
      );
  
      return combo;
    };
  
    getCurrentFreezerNumbers = (delivDate, database) => {
      const products = database[0];
  
      // create Product List of tomorrow's croissant Bake at Carlton
      let bakedOrdersList = getOrdersList(
        tomBasedOnDelivDate(delivDate),
        database
      );
      bakedOrdersList = Array.from(
        new Set(
          bakedOrdersList
            .filter((frz) => this.NorthCroixBakeFilter(frz))
            .map((pr) => pr.forBake)
        )
      );
  
      // create Product List of frozen croissant deliveries leaving Carlton
      let frozenToday = getOrdersList(delivDate, database);
      frozenToday = Array.from(
        new Set(
          frozenToday
            .filter((frz) => this.frzNorthFilter(frz))
            .map((pr) => pr.forBake)
        )
      );
  
      // need to remove the 'fr' so that it matches bakedOrder attribute
      frozenToday = convertFrozenAttrToPlainAttr(frozenToday);
      console.log("frozen today:", frozenToday)
  
      // combine product lists
      frozenToday = frozenToday.concat(bakedOrdersList);
  
      console.log("frozenToday",frozenToday)
  
      // create array { prod, qty }
      let frozenArray = [];
      for (let fr of frozenToday) {
        let ind = products.findIndex((prod) => prod.forBake === fr);
        let qty = products[ind].freezerNorth;
        let prod = products[ind].nickName;
        let item = {
          prod: prod,
          qty: qty ? qty : 0,
        };
        frozenArray.push(item);
      }
  
      console.log("frozenArray",frozenArray)
  
      return frozenArray;
    };
  
    NorthCroixBakeFilter = (ord) => {
      return (
        ord.where.includes("Mixed") &&
        ord.packGroup === "baked pastries" &&
        ord.doughType === "Croissant" &&
        (ord.route === "Pick up Carlton" || ord.routeDepart === "Carlton")
      );
    };
  
    getFrozensLeavingCarlton = (delivDate, database) => {
      let frozenToday = getOrdersList(delivDate, database);
      let fr = clonedeep(frozenToday);
      
      frozenToday = Array.from(
        new Set(frozenToday.filter((frz) => this.frzNorthFilter(frz)))
      );
      frozenToday = this.makeAddFrozenQty(frozenToday);
      frozenToday = convertFrozenAttrToPlainAttr(frozenToday);
      return frozenToday;
    };
  
    frzNorthFilter = (ord) => {
      return (
        ord.packGroup === "frozen pastries" &&
        ord.doughType === "Croissant" &&
        (ord.route === "Pick up Carlton" || ord.routeDepart === "Carlton")
      );
    };
  
    makeAddFrozenQty = (frozenToday) => {
      let makeList = frozenToday.map((mk) => ({
        prod: mk.forBake,
        nick: mk.prodNick,
        qty: 0,
      }));
  
      for (let make of makeList) {
        console.log("frozenToday", frozenToday);
        console.log("make", make);
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
        this.NorthCroixBakeFilter(frz)
      );
  
      for (let baked of bakedTomorrow){
        if (baked.custName === "Back Porch Bakery"){
          baked.qty = Math.ceil(baked.qty/2)
        }
      }
     
      bakedTomorrow = this.makeAddQty(bakedTomorrow);
  
      return bakedTomorrow;
    };
  
    makeAddQty = (bake) => {
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
  
    adjustForPackSize = (data) => {
      console.log("data", data);
      for (let d of data) {
        d.qty = Math.ceil(d.qty / 12) * 12 + 12;
        if (d.qty < 0) {
          d.qty = 0;
        }
      }
  
      return data;
    };
  
    getOrdersPlacedAfterDeadline = (delivDate, database) => {
      const [products, customers, routes, standing, orders, d, dd, alt, QBInfo] =
        database;
      console.log("QBInfo", QBInfo);
      let qbidS = tomBasedOnDelivDate(delivDate) + "PradosetoutTime";
      let qbidN = tomBasedOnDelivDate(delivDate) + "CarltonsetoutTime";
      let southCompare = new Date();
      let northCompare = new Date();
      try {
        southCompare = new Date(
          QBInfo[QBInfo.findIndex((qb) => qb.id === qbidS)].updatedAt
        );
      } catch {}
      try {
        northCompare = new Date(
          QBInfo[QBInfo.findIndex((qb) => qb.id === qbidN)].updatedAt
        );
      } catch {}
  
      let todayOrders = orders.filter(
        (ord) =>
          (ord.route === "slopick" &&
            ord.delivDate === convertDatetoBPBDate(delivDate) &&
            new Date(ord.updatedAt) > southCompare &&
            ord.isWhole === false) ||
          (ord.route === "atownpick" &&
            ord.delivDate === convertDatetoBPBDate(delivDate) &&
            new Date(ord.updatedAt) > northCompare &&
            ord.isWhole === false)
      );
      return todayOrders;
    };
  
    getBackPorchBakeryOrders = (delivDate, database) => {
      let BackPorchOrders = getOrdersList(today, database).filter(
        (ord) =>
          ord.custName === "Back Porch Bakery" && ord.doughType === "Croissant"
      );
      return BackPorchOrders;
    };
  
    getBpbExtraOrders = (delivDate, database) => {
      let BPBExtraOrders = getOrdersList(today, database).filter(
        (ord) => ord.custName === "BPB Extras" && ord.doughType === "Croissant"
      );
      return BPBExtraOrders;
    };
  
    createBakedGoingNorth = (
      backPorchBakeryOrders,
      bpbExtraOrders,
      ordersPlacedAfterDeadline
    ) => {
      let bakedGoingNorth = [];
      for (let back of backPorchBakeryOrders) {
        let qtyback = back.qty;
        let extraInd = bpbExtraOrders.findIndex(
          (bpb) => bpb.prodName === back.prodName
        );
        let ordersInd = ordersPlacedAfterDeadline.findIndex(
          (ord) => ord.prodName === back.prodName
        );
        let qtyex, qtyord;
        try {
          qtyex = Number(bpbExtraOrders[extraInd].qty);
        } catch {
          qtyex = 0;
        }
        try {
          qtyord = Number(ordersPlacedAfterDeadline[ordersInd].qty);
        } catch {
          qtyord = 0;
        }
  
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
  
    combineGrids = (obj1, obj2) => {
      let firstObject = clonedeep(obj1);
      let secondObject = clonedeep(obj2);
      for (let first of firstObject) {
        for (let sec of secondObject) {
          if (first.prodNick === sec.prodNick) {
            first.qty += sec.qty;
          }
        }
      }
  
      for (let sec of secondObject) {
        for (let first of firstObject) {
          if (sec.prodNick === first.prodNick) {
            sec.qty = first.qty;
            continue;
          }
        }
        sec.prodNick = "fr" + sec.prodNick;
      }
  
      return secondObject;
    };
  
    subtractCurrentStock = (products, grid) => {
      for (let gr of grid) {
        let short = gr.prodNick.substring(2);
        let subQty =
          products[products.findIndex((prod) => prod.nickName === short)]
            .freezerNorth;
  
        gr.qty -= subQty;
        if (gr.qty < 0) {
          gr.qty = 0;
        }
      }
      return grid;
    };
  
    returnPocketsNorth = (delivDate, database) => {
      // let shelfProds = makeOrders(today, database, this.pocketsNorthFilter);
      let shelfProds = makeOrders(delivDate, database, this.pocketsNorthFilter);
      return shelfProds;
    };
  
    pocketsNorthFilter = (ord) => {
      return (
        ord.where.includes("Mixed") &&
        ord.packGroup !== "baked pastries" &&
        ord.route === "Pick up Carlton"
      );
    };
  
    returnShelfProdsNorth = (delivDate, database) => {
      // let shelfProds = makeOrdersShelf(today, database, this.shelfProdsFilter);
      let shelfProds = makeOrdersShelf(delivDate, database, this.shelfProdsFilter);
      console.log('shelfProds', shelfProds)
      return shelfProds;
      // const T0Orders = getFullOrders(delivDate, database)
      // console.log("T0Orders", T0Orders)
      // return []
    };
  
    shelfProdsFilter = (ord) => {
      return (
        (ord.where.includes("Prado") || (ord.prodNick === "fic")) &&
        
        ord.packGroup !== "frozen pastries" &&
        (ord.routeDepart === "Carlton" || ord.route === "Pick up Carlton")
      );
    };
  
    returnCarltonToPrado = (delivDate, database) => {
      // let shelfProds = makeOrders(today, database, this.CarltonToPradoFilter);
      let shelfProds = makeOrders(delivDate, database, this.CarltonToPradoFilter);
      return shelfProds;
    };
  
    CarltonToPradoFilter = (ord) => {
      let fil =
        ord.delivDate === convertedToday && ord.route === "Carlton to Prado";
  
      return fil;
    };
  
    returnBaguettes = (delivDate, database) => {
      // let shelfProds = makeOrders(today, database, this.BaguettesFilter);
      let shelfProds = makeOrders(delivDate, database, this.BaguettesFilter);
      return flow(
        orderBy(['isLongDriver', 'routeName'], ['desc', 'asc']),
        map(row => ({ 
          ...row, 
          customerShort: row.isLongDriver 
            ? row.customerShort
            : "* " + row.customerShort
        }))
      )(shelfProds);
    };
  
    BaguettesFilter = (ord) => {
      return (
        ord.prodName === "Baguette" &&
        ((ord.routeDepart === "Prado" && ord.routeStart > 8) ||
          (ord.routeDepart === "Carlton" && ord.routeArrive === "Prado") ||
          ord.route === "Pick up SLO")
      );
    };
  
    returnOtherRustics = (delivDate, database) => {
      // let shelfProds = makeOrders(today, database, this.otherRusticsFilter);
      let shelfProds = makeOrders(delivDate, database, this.otherRusticsFilter);
      return flow(
        orderBy(['isLongDriver', 'routeName'], ['desc', 'asc']),
        map(row => ({ 
          ...row, 
          customerShort: row.isLongDriver 
            ? row.customerShort
            : "* " + row.customerShort
        }))
      )(shelfProds);
    };
  
    otherRusticsFilter = (ord) => {
      return (
        (ord.prodName !== "Baguette" &&
        ord.packGroup !== "retail" &&
        ord.where.includes("Carlton") &&
        ((ord.routeDepart === "Prado" && ord.routeStart > 8) ||
          (ord.routeDepart === "Carlton" && ord.routeArrive === "Prado") ||
          ord.route === "Pick up SLO"))
      );
    };
  
    returnRetailStuff = (delivDate, database) => {
      // let shelfProds = makeOrders(today, database, this.retailStuffFilter);
      let shelfProds = makeOrders(delivDate, database, this.retailStuffFilter);
      return flow(
        orderBy(['isLongDriver', 'routeName'], ['desc', 'asc']),
        map(row => ({ 
          ...row, 
          customerShort: row.isLongDriver 
            ? row.customerShort
            : "* " + row.customerShort
        }))
      )(shelfProds);
    };
  
    retailStuffFilter = (ord) => {
      return ord.packGroup === "retail"  &&
      ((ord.routeDepart === "Prado" && ord.routeStart > 8) ||
        (ord.routeDepart === "Carlton" && ord.routeArrive === "Prado") ||
        ord.route === "Pick up SLO");
    };
  
    returnEarlyDeliveries = (delivDate, database) => {
      // let shelfProds = makeOrders(tomorrow, database, this.earlyDeliveriesFilter);
      let shelfProds = makeOrders(delivDate, database, this.earlyDeliveriesFilter);
      return flow(
        orderBy(['isLongDriver', 'routeName'], ['desc', 'asc']),
        map(row => ({ 
          ...row, 
          customerShort: row.isLongDriver 
            ? row.customerShort
            : "* " + row.customerShort
        }))
      )(shelfProds);
    };
  
    earlyDeliveriesFilter = (ord) => {
      return (
        ord.routeDepart === "Prado" &&
        ord.where.includes("Carlton") &&
        ord.routeStart < 8
      );
    };
  
    returnColumnsShelfProdsNorth = (delivDate, database) => {
      let filteredOrders = getProdNickNames(
        delivDate,
        database,
        this.shelfProdsFilter
      );
      if (filteredOrders.length > 0) {
        return createColumns(filteredOrders);
      } else {
        return [];
      }
    };
  
    returnColumnsPocketsNorth = (delivDate, database) => {
      let filteredOrders = getProdNickNames(
        delivDate,
        database,
        this.pocketsNorthFilter
      );
      if (filteredOrders.length > 0) {
        return createColumns(filteredOrders);
      } else {
        return [];
      }
    };
  
    returnColumnsCarltonToPrado = (delivDate, database) => {
      let filteredOrders = getProdNickNames(
        delivDate,
        database,
        this.CarltonToPradoFilter
      );
      if (filteredOrders.length > 0) {
        return createColumns(filteredOrders);
      } else {
        return [];
      }
    };
  
    returnColumnsBaguettes = (delivDate, database) => {
      let filteredOrders = getProdNickNames(
        delivDate,
        database,
        this.BaguettesFilter
      );
      if (filteredOrders.length > 0) {
        return createColumns(filteredOrders);
      } else {
        return [];
      }
    };
  
    returnColumnsOtherRustics = (delivDate, database) => {
      let filteredOrders = getProdNickNames(
        delivDate,
        database,
        this.otherRusticsFilter
      );
      if (filteredOrders.length > 0) {
        return createColumns(filteredOrders);
      } else {
        return [];
      }
    };
  
    returnColumnsRetailStuff = (delivDate, database) => {
      let filteredOrders = getProdNickNames(
        delivDate,
        database,
        this.retailStuffFilter
      );
      if (filteredOrders.length > 0) {
        return createColumns(filteredOrders);
      } else {
        return [];
      }
    };
  
    returnColumnsEarlyDeliveries = (delivDate, database) => {
      let filteredOrders = getProdNickNames(
        tomorrow,
        database,
        this.earlyDeliveriesFilter
      );
      if (filteredOrders.length > 0) {
        return createColumns(filteredOrders);
      } else {
        return [];
      }
    };
  }
  