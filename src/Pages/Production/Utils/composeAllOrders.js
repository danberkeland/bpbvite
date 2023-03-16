import { todayPlus } from "../../../helpers/dateTimeHelpers";

import { getOrdersList } from "./utils";

import { DayOneFilter, DayTwoFilter, allOrdersFilter } from "./filters";

let today = todayPlus()[0];
let tomorrow = todayPlus()[1];
let twoDay = todayPlus()[2];

export default class ComposeAllOrders {
  returnAllOrdersBreakDown = (delivDate, database, loc, prod) => {
    let allOrders = this.returnAllOrders(delivDate, database, loc, prod);
    let whoBake = this.returnWhoBake(database, loc, prod);
    let whoShape = this.returnWhoShape(database, loc, prod);

    return {
      allOrders: allOrders,
      whoBake: whoBake,
      whoShape: whoShape,
    };
  };

  returnAllOrders = (delivDate, database, loc, prod) => {
    let allOrdersList = getOrdersList(delivDate, database, prod);
    let allOrdersToday = allOrdersList.filter((set) =>
      allOrdersFilter(set, loc)
    );
    for (let ord of allOrdersToday) {
      ord.qty = ord.qty * ord.packSize;
    }
    return allOrdersToday;
  };

  returnWhoBake = (database, loc, prod) => {
    let whoBakeTodayList = getOrdersList(today, database, prod);
    let whoBakeToday = whoBakeTodayList.filter((set) => DayOneFilter(set, loc));
    let whoBakeTomorrowList = getOrdersList(tomorrow, database, prod);
    let whoBakeTomorrow = whoBakeTomorrowList.filter((set) =>
      DayTwoFilter(set, loc)
    );

    let whoBakeAll = whoBakeToday.concat(whoBakeTomorrow);

    for (let ord of whoBakeAll) {
      ord.qty = ord.qty * ord.packSize;
    }
    return whoBakeAll;
  };

  returnWhoShape = (database, loc, prod) => {
    let whoShapeTodayList = getOrdersList(tomorrow, database, prod);
    let whoShapeToday = whoShapeTodayList.filter((set) =>
      DayOneFilter(set, loc)
    );
    let whoShapeTomorrowList = getOrdersList(twoDay, database, prod);
    let whoShapeTomorrow = whoShapeTomorrowList.filter((set) =>
      DayTwoFilter(set, loc)
    );

    let whoShapeAll = whoShapeToday.concat(whoShapeTomorrow);

    for (let ord of whoShapeAll) {
      ord.qty = ord.qty * ord.packSize;
    }
    return whoShapeAll;
  };
}
