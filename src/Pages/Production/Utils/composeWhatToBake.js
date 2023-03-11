import {
  todayPlus,
  tomBasedOnDelivDate,
} from "../../../helpers/dateTimeHelpers";

import { DayOneFilter, DayTwoFilter, getOrdersList, addUp } from "./utils";

let tomorrow = todayPlus()[1];

export default class ComposeWhatToMake {
  returnWhatToMakeBreakDown = (delivDate, database, loc) => {
    console.log("delivDate", delivDate);

    let whatToMake = this.returnWhatToMake(delivDate, database, loc);

    return {
      whatToMake: whatToMake,
    };
  };

  returnWhatToMake = (delivDate, database) => {
    let whatToMakeList = database.filter((set) => set.delivDate === delivDate);
    let whatToMakeToday = whatToMakeList.filter((set) => DayOneFilter(set));

    let whatToMakeTomList = database.filter(
      (set) => set.delivDate === tomBasedOnDelivDate(delivDate)
    );
    let whatToMakeTomorrow = whatToMakeTomList.filter((set) =>
      DayTwoFilter(set)
    );

    let MakeList = whatToMakeToday.concat(whatToMakeTomorrow);

    let whatToMake = this.makeAddQty(MakeList);

    return whatToMake;
  };

  makeAddQty = (bakedTomorrow) => {
    let makeList2 = Array.from(
      new Set(bakedTomorrow.map((prod) => prod.forBake))
    ).map((mk) => ({
      forBake: mk,
      qty: 0,
      shaped: 0,
      short: 0,
      needEarly: 0,
    }));
    for (let make of makeList2) {
      make.qty = 1;

      let qtyAccToday = 0;
      let bakeInd = bakedTomorrow.filter((frz) => make.forBake === frz.forBake);
      let qtyToday = bakeInd.map((ord) => ord.qty * ord.packSize);

      if (qtyToday.length > 0) {
        qtyAccToday = qtyToday.reduce(addUp);
      }

      let pocketsAccToday = 0;

      let pocketsToday = bakeInd.map((ord) => ord.preshaped);

      if (pocketsToday.length > 0) {
        pocketsAccToday = qtyAccToday - pocketsToday[0];
      }

      let shapedSum = bakeInd.map((ord) => ord.preshaped);

      if (shapedSum.length > 0) {
        make.shaped = shapedSum[0];
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
            frz.routeArrive === "Carlton" &&
            frz.zone !== "Carlton Retail" &&
            frz.zone !== "atownpick"
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

    //makeList2[0].qty -= 54
    return makeList2;
  };
}
