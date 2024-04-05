import { tomBasedOnDelivDate } from "../../../utils/_deprecated/dateTimeHelpers";

// import { getOrdersList, addUp } from "./utils";
import { getOrdersList } from "../../../core/production/getOrdersList"

import { whatToPrepFilter, whatToPrepTomFilter } from "./filters";



export default class ComposeWhatToMake {
  returnWhatToPrepBreakDown = (delivDate, database) => {
    let whatToPrep = this.returnWhatToPrep(delivDate, database);

    return {
      whatToPrep: whatToPrep,
    };
  };

  returnWhatToPrep = (delivDate, database) => {
    let whatToPrepList = getOrdersList(delivDate, database);
    console.log('whatToPrepList', whatToPrepList)
    let tomorrow = tomBasedOnDelivDate(delivDate)
  
    let whatToPrepListTom = getOrdersList(tomorrow, database);
    let whatToMakeToday = whatToPrepList.filter((set) => whatToPrepFilter(set));
    let whatToMakeTomorrow = whatToPrepListTom.filter((set) =>
      whatToPrepTomFilter(set)
    );

    let whatToMake = this.makeAddQty(whatToMakeToday);
    let whatToMakeTom = this.makeAddQty(whatToMakeTomorrow);

    whatToMake = whatToMake.concat(whatToMakeTom);
    whatToMake = whatToMake.filter(wh => wh.qty>0)
    return whatToMake;
  };

  makeAddQty = (bakedTomorrow) => {
    let makeList2 = Array.from(
      new Set(bakedTomorrow.map((prod) => prod.prodName))
    ).map((mk) => ({
      prodName: mk,
      qty: 0,
      shaped: 0,
      short: 0,
      needEarly: 0,
    }));
    for (let make of makeList2) {
      make.qty = 1;

      let qtyAccToday = 0;

      let qtyToday = bakedTomorrow
        .filter((frz) => make.prodName === frz.prodName)
        .map((ord) => ord.qty * ord.packSize);

      if (qtyToday.length > 0) {
        qtyAccToday = qtyToday.reduce((x,y)=>x+y, 0);
      }

      make.qty = qtyAccToday;
    }
    return makeList2;
  };
}
