import { todayPlus } from "../../../helpers/dateTimeHelpers";
import { getFullOrders } from "../../../helpers/CartBuildingHelpers";
import { addProdAttr, addRetailBagQty, addRetailBagQtyTomorrow } from "./utils";

let tomorrow = todayPlus()[1];
let today = todayPlus()[0];

const makeRetailBags = (products, filt) => {
  let make = Array.from(
    new Set(products.filter((prod) => filt(prod)).map((prod) => prod.prodName))
  ).map((make) => ({
    prodName: make,
    qty: 0,
    tomQty: 0,
  }));
  return make;
};

const getRetailBags = (delivDate, database) => {
  let fullOrder = getFullOrders(delivDate, database);
  fullOrder = addProdAttr(fullOrder, database); // adds forBake, packSize, currentStock
  return fullOrder;
};

export default class ComposeRetailBags {
  returnRetailBags = (database) => {
    let retailBags = this.getRetailBags(database);

    // [freshProds, shelfProds] = handleFrenchConundrum(freshProds, shelfProds);

    return {
      retailBags: retailBags,
    };
  };

  getRetailBags(database) {
    const [products, customers, routes, standing, orders] = database;
    let retailBags = makeRetailBags(products, this.retailBagsFilter);
    let fullOrdersToday = getRetailBags(today, database);
    let fullOrdersTomorrow = getRetailBags(tomorrow, database);
    for (let ret of retailBags) {
      addRetailBagQty(ret, fullOrdersToday);
      addRetailBagQtyTomorrow(ret, fullOrdersTomorrow);
    }
    console.log("retail", retailBags);

    return retailBags;
  }

  retailBagsFilter = (prod) => {
    let fil = prod.packGroup === "retail";
    return fil;
  };
}
