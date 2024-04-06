import {
  convertDatetoBPBDate,
  todayPlus,
  tomBasedOnDelivDate,
  TwodayBasedOnDelivDate,
} from "../../../../utils/_deprecated/dateTimeHelpers";
import { getFullOrders, getFullProdOrders } from "../../../../core/production/getOrdersList";
import {
  addProdAttr,
  addFresh,
  addNeedEarly,
  addShelf,
  addPretzel,
  addPocketsQty,
} from "./utils";

const { DateTime } = require("luxon");

const PRODUCTS = 0
const CUSTOMERS = 1
const ROUTES = 2
const STANDING = 3
const ORDERS = 4
  
  let today = todayPlus()[0];
  let tomorrow = todayPlus()[1];
  
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
    //console.log('make1', make)
    return make;
  };
  
  const getFullMakeOrders = (delivDate, database) => {
    //console.log("getFullMakeOrder", delivDate);
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
      const [products, customers, routes, standing, orders] = database

      let T1 = delivDate !== "2023-12-24"
        ? tomBasedOnDelivDate(delivDate)
        : TwodayBasedOnDelivDate(delivDate)
      let T2 = TwodayBasedOnDelivDate(delivDate)

      let fullOrdersT0 = getFullMakeOrders(delivDate, database);
      let fullProdT1 = getFullProdMakeOrders(T1, database)
      let fullOrdersT1 = fullProdT1.filter(order => order.isStand !== false)
      //let fullOrdersT1 = getFullMakeOrders(T1, database)
      let fullOrdersT2 = getFullProdMakeOrders(T2, database)

      let pocketsNorth = this.#getPocketsNorth(products, fullOrdersT0);
      let freshProds = this.#getFreshProds(products, routes, fullOrdersT0, fullOrdersT1);
      let shelfProds = this.#getShelfProds(products, routes, fullOrdersT0, fullProdT1);
      let freezerProds = this.#getFreezerProds(products, routes, fullOrdersT0, fullOrdersT1);
      
      let youllBeShort = this.getYoullBeShort(
        database, // uses products only 
        delivDate, 
        pocketsNorth, freshProds, shelfProds, freezerProds
      )

      let pretzels = this.#getPretzels(products, routes, delivDate, fullOrdersT0, fullOrdersT1, fullOrdersT2);
      let baguetteStuff = this.#getBaguetteStuff(database, delivDate);

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

    returnOnlyPretzel = (database, delivDate) => {
      const products = database[PRODUCTS]
      const routes = database[ROUTES]

      let T1 = delivDate !== "2023-12-24"
        ? tomBasedOnDelivDate(delivDate)
        : TwodayBasedOnDelivDate(delivDate)
      let T2 = TwodayBasedOnDelivDate(delivDate)

      let fullOrdersT0 = getFullMakeOrders(delivDate, database);
      let fullOrdersT1 = getFullMakeOrders(T1, database);
      let fullOrdersT2 = getFullProdMakeOrders(T2, database)

      return { 
        pretzels: this.#getPretzels(
          products, routes, delivDate, fullOrdersT0, fullOrdersT1, fullOrdersT2
        )
      }
    }

    #getPocketsNorth(products, fullOrdersToday) {
      let makePocketsNorth = makeProds(products, this.pocketsNorthFilter);
      //console.log("getPocketsNorth", delivDate);
      // let fullOrdersToday = getFullMakeOrders(delivDate, database);
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

    #getFreshProds = (products, routes, fullOrdersToday, fullOrdersTomorrow) => {
      //console.log("delivDate", delivDate);
      
      // let tom = tomBasedOnDelivDate(delivDate);
      // if (delivDate === "2022-12-24") {
      //   tom = TwodayBasedOnDelivDate(delivDate);
      // }
      // let fullOrdersToday = getFullMakeOrders(delivDate, database);
      // console.log('getFullOrdersTodayFresh', fullOrdersToday)
      // let fullOrdersTomorrow = getFullMakeOrders(tom, database);
      // console.log("fullOrdersTomorrow", fullOrdersTomorrow);

      let makeFreshProds = makeProds(products, this.freshProdFilter);
      for (let make of makeFreshProds) {
        
        addFresh(make, fullOrdersToday, fullOrdersTomorrow, products, routes);
        addNeedEarly(make, products);
      }
      //console.log("makeFreshProds", makeFreshProds);
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
  
    #getShelfProds(products, routes, fullOrdersToday, fullOrdersTomorrow) {
      // let tom = tomBasedOnDelivDate(delivDate);
      // if (delivDate === "2022-12-24") {
      //   tom = TwodayBasedOnDelivDate(delivDate);
      // }
      // let fullOrdersToday = getFullMakeOrders(delivDate, database);
      // let fullOrdersTomorrow = getFullProdMakeOrders(tom, database);

      //console.log('makeShelfProds1', makeShelfProds)
      let makeShelfProds = makeProds(products, this.shelfProdsFilter);
  
      for (let make of makeShelfProds) {
        addShelf(make, fullOrdersToday, fullOrdersTomorrow, products, routes);
        addNeedEarly(make, products);
      }
  
      //console.log("makeShelfProds2", makeShelfProds);
      makeShelfProds = makeShelfProds.filter(
        (make) => make.makeTotal + make.needEarly + make.qty > 0
      );
  
      return makeShelfProds;
    }
  
    #getBaguetteStuff(database) {
      let delivDate2Day = todayPlus()[2];
      let tomorrow = todayPlus()[1];
      let today = todayPlus()[0];
  
      
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
  
    #getPretzels(products, routes, delivDate, fullOrdersT0, fullOrdersT1, fullOrdersT2) {
      // const [products, customers, routes, standing, orders] = database;
      // console.log('delivDate', delivDate)
      // let tom = tomBasedOnDelivDate(delivDate);
      // if (delivDate === "2022-12-24") {
      //   tom = TwodayBasedOnDelivDate(delivDate);
      // }
      // let fullOrdersToday = getFullMakeOrders(delivDate, database);
      // let fullOrdersTomorrow = getFullProdMakeOrders(tom, database);
      // let fullOrders2Day = getFullProdMakeOrders(TwodayBasedOnDelivDate(delivDate), database)

      let makeShelfProds = makeProds(products, this.pretzelsFilter);
  
      for (let make of makeShelfProds) {
        addPretzel(make, fullOrdersT0, fullOrdersT1, fullOrdersT2, products, routes, delivDate);
        addNeedEarly(make, products);
      }
  
      makeShelfProds = makeShelfProds.filter(
        (make) => make.makeTotal + make.needEarly + make.qty > 0
      );
  
      return makeShelfProds;
    }
  
    pretzelsFilter = (prod) => {
      if (prod.bakedWhere === undefined) console.error(prod)
      let fil =
        !prod.bakedWhere.includes("Carlton") &&
        //Number(prod.readyTime) >= 15 &&
        prod.doughType === "Pretzel Bun" 
      return fil;
    };
  
    #getFreezerProds(products, routes, fullOrdersToday, fullOrdersTomorrow) {
      // let tom = tomBasedOnDelivDate(delivDate);
      // if (delivDate === "2022-12-24") {
      //   tom = TwodayBasedOnDelivDate(delivDate);
      // }
      // let fullOrdersToday = getFullMakeOrders(delivDate, database);
      // let fullOrdersTomorrow = getFullProdMakeOrders(tom, database);

      let makeFreezerProds = makeProds(products, this.freezerProdsFilter);
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
  
    getYoullBeShort = (
      database, delivDate,
      pocketsNorth, shelfProds, freshProds, freezerProds
    ) => {
      const products = database[PRODUCTS]
      const routes = database[ROUTES]

      let orderItems   
      if (!!pocketsNorth && !!shelfProds && !!freshProds && !!freezerProds) {
        orderItems = 
          [...pocketsNorth, ...shelfProds, ...freshProds, ...freezerProds]

      } else {
        let tom = delivDate !== "2023-12-24" 
          ? tomBasedOnDelivDate(delivDate)
          : TwodayBasedOnDelivDate(delivDate)
        let fullOrdersT0 = getFullMakeOrders(delivDate, database)
        let fullOrdersT1 = getFullMakeOrders(tom, database)

        const PN = this.#getPocketsNorth(products, fullOrdersT0)
        const SP = this.#getShelfProds(products, routes, fullOrdersT0, fullOrdersT1)
        const FP = this.#getFreshProds(products, routes, fullOrdersT0, fullOrdersT1)
        const FrzP = this.#getFreezerProds(products, routes, fullOrdersT0, fullOrdersT1)

        orderItems = [...PN, ...SP, ...FP, ...FrzP]

      }

      let weightStr = orderItems
          .filter((item) => item.doughType === "French")
          .map((item) => ({
            pocketWeight: item.weight,
            makeTotal: item.makeTotal,
          }))
  
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

      // const weightTotals =  mapValues(
      //   groupBy(orderItems, "weight"),
      //   group => sumBy(group, "makeTotal")
      // )
  
      for (let weight of weightList) {
        // let availablePockets =
        //   products[
        //     products.findIndex(
        //       (prod) =>
        //         prod.weight === weight.pocketWeight && prod.doughType === "French"
        //     )
        //   ].preshaped;
        // let preAvailablePockets =
        //   products[
        //     products.findIndex(
        //       (prod) =>
        //         prod.weight === weight.pocketWeight && prod.doughType === "French"
        //     )
        //   ].prepreshaped;

        let { 
          preshaped: availablePockets, 
          prepreshaped: preAvailablePockets
        } = products.find(P => 
          P.weight === weight.pocketWeight && P.doughType === "French"
        ) ?? {}

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
  