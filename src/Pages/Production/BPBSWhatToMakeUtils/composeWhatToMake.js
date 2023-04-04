import {
    convertDatetoBPBDate,
    todayPlus,
    tomBasedOnDelivDate,
    TwodayBasedOnDelivDate,
  } from "../../../helpers/dateTimeHelpers";
  import { getFullOrders } from "../../../helpers/CartBuildingHelpers";
  import { getFullProdOrders } from "../../../helpers/CartBuildingHelpers";
  import {
    addProdAttr,
    addFresh,
    addNeedEarly,
    addShelf,
    addPretzel,
    addPocketsQty,
  } from "./utils";
  import { handleFrenchConundrum } from "./conundrums.js";
  import { cloneDeep } from "lodash";
  const { DateTime } = require("luxon");
  
  let tomorrow = todayPlus()[1];
  let today = todayPlus()[0];
  
  const makeProds = (products, filt) => {
    let make = Array.from(
      new Set(
        products
          .filter((prod) => filt(prod))
          .map(
            (prod) =>
              prod.forBake + "_" + prod.weight.toString() + "_" + prod.doughType
          )
      )
    ).map((make) => ({
      forBake: make.split("_")[0],
      weight: Number(make.split("_")[1]),
      doughType: make.split("_")[2],
      qty: 0,
      makeTotal: 0,
      bagEOD: 0,
    }));
    console.log('make1', make)
    return make;
  };
  
  const getFullMakeOrders = (delivDate, database) => {
    console.log("getFullMakeOrder", delivDate);
    let fullOrder = getFullOrders(delivDate, database);
    fullOrder = addProdAttr(fullOrder, database); // adds forBake, packSize, currentStock
    return fullOrder;
  };
  
  const getFullProdMakeOrders = (delivDate, database) => {
    let fullOrder = getFullProdOrders(delivDate, database);
  
    fullOrder = addProdAttr(fullOrder, database); // adds forBake, packSize, currentStock
    return fullOrder;
  };
  
  export default class ComposeWhatToMake {
    returnMakeBreakDown = (database, delivDate) => {
      let pocketsNorth = this.getPocketsNorth(database, delivDate);
      let freshProds = this.getFreshProds(database, delivDate);
      let shelfProds = this.getShelfProds(database, delivDate);
      let pretzels = this.getPretzels(database, delivDate);
      let freezerProds = this.getFreezerProds(database, delivDate);
      let youllBeShort = this.getYoullBeShort(database, delivDate);
      let baguetteStuff = this.getBaguetteStuff(database, delivDate);
  
      [freshProds, shelfProds] = handleFrenchConundrum(
        freshProds,
        shelfProds,
        database,
        delivDate
      );
  
      return {
        pocketsNorth: pocketsNorth,
        freshProds: freshProds,
        shelfProds: shelfProds,
        pretzels: pretzels,
        freezerProds: freezerProds,
        youllBeShort: youllBeShort,
        baguetteStuff: baguetteStuff,
      };
    };
  
    getPocketsNorth(database, delivDate) {
      const [products, customers, routes, standing, orders] = database;
      let makePocketsNorth = makeProds(products, this.pocketsNorthFilter);
      console.log("getPocketsNorth", delivDate);
      let fullOrdersToday = getFullMakeOrders(delivDate, database);
      for (let make of makePocketsNorth) {
        addPocketsQty(make, fullOrdersToday);
      }
      return makePocketsNorth;
    }
  
    pocketsNorthFilter = (prod) => {
      let fil =
        prod.bakedWhere.includes("Mixed") &&
        Number(prod.readyTime) < 15 &&
        prod.packGroup !== "frozen pastries" &&
        prod.packGroup !== "baked pastries" &&
        prod.freezerThaw !== true;
      return fil;
    };
  
    getFreshProds = (database, delivDate) => {
      const [products, customers, routes, standing, orders] = database;
      console.log("delivDate", delivDate);
      let makeFreshProds = makeProds(products, this.freshProdFilter);
  
      let tom = tomBasedOnDelivDate(delivDate);
      if (delivDate === "2022-12-24") {
        tom = TwodayBasedOnDelivDate(delivDate);
      }
      let fullOrdersToday = getFullMakeOrders(delivDate, database);
      console.log('getFullOrdersTodayFresh', fullOrdersToday)
      let fullOrdersTomorrow = getFullMakeOrders(tom, database);
      console.log("fullOrdersTomorrow", fullOrdersTomorrow);
      for (let make of makeFreshProds) {
        
        addFresh(make, fullOrdersToday, fullOrdersTomorrow, products, routes);
        addNeedEarly(make, products);
      }
      console.log("makeFreshProds", makeFreshProds);
      return makeFreshProds;
    };
  
    freshProdFilter = (prod) => {
      let fil =
        !prod.bakedWhere.includes("Carlton") &&
        Number(prod.readyTime) < 15 &&
        prod.packGroup !== "frozen pastries" &&
        prod.packGroup !== "baked pastries";
      return fil;
    };
  
    getShelfProds(database, delivDate) {
      const [products, customers, routes, standing, orders] = database;
      let makeShelfProds = makeProds(products, this.shelfProdsFilter);
      console.log('makeShelfProds1', makeShelfProds)
      let tom = tomBasedOnDelivDate(delivDate);
      if (delivDate === "2022-12-24") {
        tom = TwodayBasedOnDelivDate(delivDate);
      }
      let fullOrdersToday = getFullMakeOrders(delivDate, database);
      let fullOrdersTomorrow = getFullProdMakeOrders(tom, database);
  
      for (let make of makeShelfProds) {
        addShelf(make, fullOrdersToday, fullOrdersTomorrow, products, routes);
        addNeedEarly(make, products);
      }
  
      console.log("makeShelfProds2", makeShelfProds);
      makeShelfProds = makeShelfProds.filter(
        (make) => make.makeTotal + make.needEarly + make.qty > 0
      );
  
      return makeShelfProds;
    }
  
    getBaguetteStuff(database) {
      let delivDate2Day = todayPlus()[2];
      let tomorrow = todayPlus()[1];
      let today = todayPlus()[0];
  
      console.log('delivDate2Day', delivDate2Day)
      
      let ord2day = getFullOrders(delivDate2Day, database);
      let bagOrder2Day =
        ord2day[
          ord2day.findIndex(
            (ord) =>
              ord.delivDate === convertDatetoBPBDate(delivDate2Day) &&
              ord.custName === "BPB Extras" &&
              ord.prodName === "Baguette"
          )
        ].qty;
  
      let ordtom = getFullOrders(tomorrow, database);
      let bagOrdertomorrow =
        ordtom[
          ordtom.findIndex(
            (ord) =>
              ord.delivDate === convertDatetoBPBDate(tomorrow) &&
              ord.custName === "BPB Extras" &&
              ord.prodName === "Baguette"
          )
        ].qty;
  
      let ordtoday = getFullOrders(today, database);
      let bagOrderToday =
        ordtoday[
          ordtoday.findIndex(
            (ord) =>
              ord.delivDate === convertDatetoBPBDate(today) &&
              ord.custName === "BPB Extras" &&
              ord.prodName === "Baguette"
          )
        ].qty;
  
      const bucket = bagOrder2Day < 0 ? true : false;
      const mix = bagOrdertomorrow < 0 ? true : false;
      const bake = bagOrderToday < 0 ? true : false;
  
      const baguetteStuff = [
        {
          Prod: "Baguette (54 ea.)",
          Bucket: bucket ? "YES" : "NO",
          Mix: mix ? "YES" : "NO",
          Bake: bake ? "YES" : "NO",
        },
      ];
      return baguetteStuff;
    }
  
    shelfProdsFilter = (prod) => {
      let fil =
        !prod.bakedWhere.includes("Carlton") &&
        Number(prod.readyTime) >= 15 &&
        prod.packGroup !== "frozen pastries" &&
        prod.packGroup !== "baked pastries" &&
        prod.doughType !== "Pretzel Bun" &&
        prod.freezerThaw !== true;
      return fil;
    };
  
    getPretzels(database, delivDate) {
      const [products, customers, routes, standing, orders] = database;
      let makeShelfProds = makeProds(products, this.pretzelsFilter);
      let tom = tomBasedOnDelivDate(delivDate);
      if (delivDate === "2022-12-24") {
        tom = TwodayBasedOnDelivDate(delivDate);
      }
      let fullOrdersToday = getFullMakeOrders(delivDate, database);
      let fullOrdersTomorrow = getFullProdMakeOrders(tom, database);
  
      for (let make of makeShelfProds) {
        addPretzel(make, fullOrdersToday, fullOrdersTomorrow, products, routes);
        addNeedEarly(make, products);
      }
  
      console.log("makeShelfProds", makeShelfProds);
      makeShelfProds = makeShelfProds.filter(
        (make) => make.makeTotal + make.needEarly + make.qty > 0
      );
  
      return makeShelfProds;
    }
  
    pretzelsFilter = (prod) => {
      let fil =
        !prod.bakedWhere.includes("Carlton") &&
        Number(prod.readyTime) >= 15 &&
        prod.packGroup !== "frozen pastries" &&
        prod.packGroup !== "baked pastries" &&
        prod.doughType === "Pretzel Bun" &&
        prod.freezerThaw !== true;
      return fil;
    };
  
    getFreezerProds(database, delivDate) {
      const [products, customers, routes, standing, orders] = database;
      let makeFreezerProds = makeProds(products, this.freezerProdsFilter);
      let tom = tomBasedOnDelivDate(delivDate);
      if (delivDate === "2022-12-24") {
        tom = TwodayBasedOnDelivDate(delivDate);
      }
      let fullOrdersToday = getFullMakeOrders(delivDate, database);
      let fullOrdersTomorrow = getFullProdMakeOrders(tom, database);
      for (let make of makeFreezerProds) {
        addShelf(make, fullOrdersToday, fullOrdersTomorrow, products, routes);
        addNeedEarly(make, products);
      }
      return makeFreezerProds;
    }
  
    freezerProdsFilter = (prod) => {
      let fil =
        !prod.bakedWhere.includes("Carlton") &&
        Number(prod.readyTime) >= 15 &&
        prod.packGroup !== "frozen pastries" &&
        prod.packGroup !== "baked pastries" &&
        prod.freezerThaw === true;
      return fil;
    };
  
    getYoullBeShort = (database, delivDate) => {
      console.log("youllBeShort", delivDate);
      const [products, customers, routes, standing, orders] = database;
      let pocketsNorth = this.getPocketsNorth(database, delivDate)
        .filter((item) => item.doughType === "French")
        .map((item) => ({
          pocketWeight: item.weight,
          makeTotal: item.makeTotal,
        }));
      let shelfProds = this.getShelfProds(database, delivDate)
        .filter((item) => item.doughType === "French")
        .map((item) => ({
          pocketWeight: item.weight,
          makeTotal: item.makeTotal,
        }));
      let freshProds = this.getFreshProds(database, delivDate)
        .filter((item) => item.doughType === "French")
        .map((item) => ({
          pocketWeight: item.weight,
          makeTotal: item.makeTotal,
        }));
      let freezerProds = this.getFreezerProds(database, delivDate)
        .filter((item) => item.doughType === "French")
        .map((item) => ({
          pocketWeight: item.weight,
          makeTotal: item.makeTotal,
        }));
  
      let weightStr = pocketsNorth.concat(shelfProds, freshProds, freezerProds);
  
      let weightList = Array.from(
        new Set(weightStr.map((weight) => weight.pocketWeight))
      ).map((pock) => ({ pocketWeight: pock, makeTotal: 0 }));
  
      for (let weight of weightList) {
        for (let pocket of weightStr) {
          if (pocket.pocketWeight === weight.pocketWeight) {
            weight.makeTotal = weight.makeTotal + pocket.makeTotal;
          }
        }
      }
  
      for (let weight of weightList) {
        let availablePockets =
          products[
            products.findIndex(
              (prod) =>
                prod.weight === weight.pocketWeight && prod.doughType === "French"
            )
          ].preshaped;
        let preAvailablePockets =
          products[
            products.findIndex(
              (prod) =>
                prod.weight === weight.pocketWeight && prod.doughType === "French"
            )
          ].prepreshaped;
        weight.need = weight.makeTotal;
        weight.preshaped = availablePockets;
        weight.prepreshaped = preAvailablePockets;
        weight.short = Number(weight.makeTotal) - Number(availablePockets);
        weight.makeTotal = -(Number(weight.makeTotal) - Number(availablePockets));
        weight.preMakeTotal = -(
          Number(weight.makeTotal) - Number(preAvailablePockets)
        );
      }
  
      weightList = weightList.filter((weight) => weight.makeTotal !== "");
      return weightList;
    };
  }
  