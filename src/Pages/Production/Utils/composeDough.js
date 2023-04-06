import { todayPlus, tomBasedOnDelivDate, TwodayBasedOnDelivDate } from "../../../helpers/dateTimeHelpers";

import {
  getOrdersList,
  makePocketQty,
  addUp,
  whatToMakeList,
  qtyCalc,
  doughListComp,
} from "./utils";

import {
  pocketFilterToday,
  pocketFilterTwoDay,
  baker1PocketFilter,
  baguette,
  noBaguette,
  bag
} from "./filters";
import { sortAtoZDataByIndex } from "../../../helpers/sortDataHelpers";


const clonedeep = require("lodash.clonedeep");


export default class ComposeDough {
  returnDoughBreakDown = (database, loc,deliv) => {
    let twoDay = TwodayBasedOnDelivDate(deliv)
    let oneDay = tomBasedOnDelivDate(deliv)
    let tomorrow = tomBasedOnDelivDate(deliv)
    console.log("delivtomorrow",tomorrow)
    let today = deliv
    console.log("delivToday",today)
    let doughs = this.returnDoughs(bag, database, loc, tomorrow, twoDay);
    let doughComponents = this.returnDoughComponents(database);
    let pockets = this.returnPockets(database, loc,today, tomorrow,twoDay);
    let Baker1Dough = this.returnDoughs(baguette, database, loc, tomorrow, twoDay);
    let Baker1Pockets = this.returnBaker1Pockets(database, loc, tomorrow);
    let bagAndEpiCount = this.returnbagAndEpiCount(tomorrow, database, loc);
    let oliveCount = this.returnoliveCount(tomorrow, database, loc);
    let bcCount = this.returnbcCount(tomorrow, database, loc);
    let bagDoughTwoDays = this.returnBagDoughTwoDays(twoDay, database, loc);
    return {
      doughs: doughs,
      doughComponents: doughComponents,
      pockets: pockets,
      Baker1Dough: Baker1Dough,
      Baker1DoughComponents: doughComponents,
      Baker1Pockets: Baker1Pockets,
      bagAndEpiCount: bagAndEpiCount,
      oliveCount: oliveCount,
      bcCount: bcCount,
      bagDoughTwoDays: bagDoughTwoDays,
    };
  };

  returnbagAndEpiCount = (delivDate, database) => {
    let whatToMakeToday = whatToMakeList(database, delivDate).filter(
      (bag) => bag.forBake === "Baguette" || bag.forBake === "Epi"
    );
    let whatToMake = this.makeAddQty(whatToMakeToday);
    return qtyCalc(whatToMake)//-54;
  };

  returnoliveCount = (delivDate, database) => {
    let whatToMakeToday = whatToMakeList(database, delivDate).filter(
      (bag) => bag.forBake === "Olive Herb"
    );
    let whatToMake = this.makeAddQty(whatToMakeToday);
    return qtyCalc(whatToMake);
  };

  returnbcCount = (delivDate, database) => {
    let whatToMakeToday = whatToMakeList(database, delivDate).filter(
      (bag) => bag.forBake === "Blue Cheese Walnut"
    );
    let whatToMake = this.makeAddQty(whatToMakeToday);
    return qtyCalc(whatToMake);
  };

  returnBagDoughTwoDays = (delivDate, database) => {
    let whatToMakeToday = whatToMakeList(database, delivDate).filter(
      (bag) => bag.doughType === "Baguette"
    );
    let qty = 0;
    for (let make of whatToMakeToday) {
      qty += Number(make.qty * make.weight);
    }
    console.log("bagDoughQty", qty);
    return Math.round(qty / 82);
  };

  returnPockets = (database, loc,today, tomorrow, twoDay) => {
    let pocketsTodayPrep = getOrdersList(tomorrow, database, true).filter(
      (set) => pocketFilterToday(set, loc)
    );

    let pocketsToday = makePocketQty(pocketsTodayPrep);
    let pocketsTomPrep = getOrdersList(twoDay, database, true).filter((set) =>
      pocketFilterTwoDay(set, loc)
    );

    let pocketsTom = makePocketQty(pocketsTomPrep);

    for (let item of pocketsToday) {
      for (let otherItem of pocketsTom) {
        if (item.pocketSize === otherItem.pocketSize) {
          item.qty = item.qty + otherItem.qty;
        }
      }
    }
    let clone1 = clonedeep(pocketsToday)
    console.log("pocketsTodayClone1", clone1)

    let pocketsTodayLate = getOrdersList(today, database, false).filter((set) =>
      pocketFilterToday(set, loc)
    );
  
    let pocketsLateToday = makePocketQty(pocketsTodayLate);
    let pocketsTomLate = getOrdersList(tomorrow, database, true).filter((set) =>
      pocketFilterTwoDay(set, loc)
    );

    let pocketsLateTom = makePocketQty(pocketsTomLate);

    for (let item of pocketsLateToday) {
      for (let otherItem of pocketsLateTom) {
        if (item.pocketSize === otherItem.pocketSize) {
          item.qty = item.qty + otherItem.qty;
        }
      }
    }
    let clone2 = clonedeep(pocketsLateToday)
    console.log("pocketsLateTodayClone2",clone2)

    for (let item of pocketsToday) {
      console.log("item",item)
      for (let otherItem of pocketsLateToday) {
        console.log("otherItem",otherItem)
        if (item.pocketSize === otherItem.pocketSize) {
          item.late = otherItem.qty;
        }
      }
    }

    let clone3 = clonedeep(pocketsToday)
    console.log("clone3",clone3)

    for (let item of pocketsToday) {
      for (let otherItem of pocketsTodayLate) {
        if (item.pocketSize === otherItem.weight) {
          item.prepped = otherItem.preshaped;
        }
      }
    }

    for (let item of pocketsToday) {
      for (let otherItem of pocketsLateToday){
        if(item.pocketSize === otherItem.pocketSize){
          item.late = Number(otherItem.qty) - Number(item.prepped);
          if (item.late < 0) {
            item.late = 0;
          }
          
        }
      }
     
    }

    for (let item of pocketsToday){
      item.qtyFixed = item.qty
      item.carryPocket = 0
    }

    pocketsToday = sortAtoZDataByIndex(pocketsToday,"pocketSize")
    return pocketsToday;
  };

  returnDoughs = (filt, database, loc, tomorrow, twoDay) => {
    const doughs = database[5];
    let twoDayOrderList = getOrdersList(twoDay, database, true);
    let oneDayOrderList = getOrdersList(tomorrow, database, true);

    let doughList = doughListComp(doughs, filt, loc);
    let dglist = clonedeep(doughList)
    console.log("doughList",dglist)

    for (let dgh of doughList) {
      let doughInd =
        doughs[doughs.findIndex((d) => d.doughName === dgh.doughName)];
      dgh.id = doughInd.id;
      dgh.bucketSets = doughInd.bucketSets;
      dgh.mixedWhere = doughInd.mixedWhere;
      dgh.preBucketSets = doughInd.preBucketSets
      dgh.updatePreBucket = doughInd.updatePreBucket
      dgh.saltInDry = doughInd.saltInDry
      dgh.hydration = doughInd.hydration;
      dgh.oldDough = doughInd.oldDough;
      dgh.buffer = doughInd.buffer;
      dgh.batchSize = doughInd.batchSize;
      if (dgh.isBakeReady === true) {
        console.log(dgh.doughName+"using one Day")
        dgh.needed = this.getDoughAmt(dgh.doughName, oneDayOrderList).toFixed(
          2
        );
      } else {
        console.log(dgh.doughName+"using 2 day")
        dgh.needed = this.getDoughAmt(dgh.doughName, twoDayOrderList).toFixed(
          2
        );
      }
      let preshaped;
      if (dgh.isBakeReady === true) {
        preshaped = this.getPreshapedDoughAmt(
          dgh.doughName,
          oneDayOrderList
        ).toFixed(2);
      } else {
        preshaped = this.getPreshapedDoughAmt(
          dgh.doughName,
          twoDayOrderList
        ).toFixed(2);
      }

      if (Number(dgh.needed) - Number(preshaped) > 0) {
        dgh.short = (Number(preshaped) - Number(dgh.needed)).toFixed(2);
      } else {
        dgh.short = 0;
      }
    }

    return doughList;
  };

  returnDoughComponents = (database) => {
    const doughComponents = database[6];
    let doughComponentInfo = doughComponents;
    return doughComponentInfo;
  };

  getDoughAmt = (doughName, orders) => {
   
    let qtyAccToday = 0;
    let qtyArray = orders
      .filter((ord) => ord.doughType === doughName)
      .map((ord) => ord.qty * ord.weight * ord.packSize);
    console.log("qtyArray",qtyArray)
    if (qtyArray.length > 0) {
      qtyAccToday = qtyArray.reduce(addUp);
    }
    return qtyAccToday//-61;
  };

  getPreshapedDoughAmt = (doughName, orders) => {
    let qtyAccToday = 0;
    let qtyArray = orders
      .filter((ord) => ord.doughType === doughName)
      .map((ord) => Number(ord.preshaped) * ord.weight * ord.packSize);
    if (qtyArray.length > 0) {
      qtyAccToday = qtyArray.reduce(addUp);
    }
    return qtyAccToday;
  };

  returnBaker1Pockets = (database, loc, tomorrow) => {
    let pocketList = getOrdersList(tomorrow, database, true);
    let pocketsToday = pocketList.filter((set) => baker1PocketFilter(set, loc));
    pocketsToday = makePocketQty(pocketsToday);

    return pocketsToday//-54;
  };

  makeAddQty = (bakedTomorrow) => {
    let makeList2 = Array.from(
      new Set(bakedTomorrow.map((prod) => prod.forBake))
    ).map((mk) => ({
      forBake: mk,
      qty: 0,
      short: 0,
      needEarly: 0,
    }));
    for (let make of makeList2) {
      make.qty = 1;

      let qtyAccToday = 0;

      let qtyToday = bakedTomorrow
        .filter((frz) => make.forBake === frz.forBake)
        .map((ord) => ord.qty);

      if (qtyToday.length > 0) {
        qtyAccToday = qtyToday.reduce(addUp);
      }

      let pocketsAccToday = 0;

      let pocketsToday = bakedTomorrow
        .filter((frz) => make.forBake === frz.forBake)
        .map((ord) => ord.preshaped);

      if (pocketsToday.length > 0) {
        pocketsAccToday = qtyAccToday - pocketsToday[0];
      }

      if (pocketsAccToday > 0) {
        make.short = "Short " + pocketsAccToday;
      } else if (pocketsAccToday < 0) {
        pocketsAccToday = -pocketsAccToday;
        make.short = "Over " + pocketsAccToday;
      } else {
        make.short = "";
      }

      let needEarlyAccToday = 0;

      let needEarlyToday = bakedTomorrow
        .filter(
          (frz) =>
            make.forBake === frz.forBake &&
            frz.routeDepart === "Carlton" &&
            frz.zone !== "Carlton Retail"
        )
        .map((ord) => ord.qty);

      if (needEarlyToday.length > 0) {
        needEarlyAccToday = needEarlyToday.reduce(addUp);
      }

      if (needEarlyAccToday > 0) {
        make.needEarly = needEarlyAccToday;
      } else {
        make.needEarly = "";
      }

      make.qty = qtyAccToday;
    }
    return makeList2;
  };
}
