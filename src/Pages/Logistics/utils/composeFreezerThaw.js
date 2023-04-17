import { todayPlus } from "../../../helpers/dateTimeHelpers";
import { getFullOrders } from "../../../helpers/CartBuildingHelpers";
import { addProdAttr } from "./utils";

let today = todayPlus()[0];

const getFreezer = (delivDate, database) => {
  let fullOrder = getFullOrders(delivDate, database);
  fullOrder = addProdAttr(fullOrder, database); // adds forBake, packSize, currentStock
  return fullOrder;
};

export default class ComposeFreezerThaw {
  returnFreezerThaw = (database) => {
    let freezerThaw,allProds = this.getFreezerThaw(database);
   

    // [freshProds, shelfProds] = handleFrenchConundrum(freshProds, shelfProds);

    return {
      freezerThaw: freezerThaw,
      allProds: allProds
    };
  };

  getFreezerThaw(database) {
    const [products, customers, routes, standing, orders] = database;
    let fullOrdersToday = getFreezer(today, database);
    for (let ord of fullOrdersToday){
        let ind = products.findIndex(prod => prod.prodName===ord.prodName)
        if (products[ind].freezerThaw===true){
            ord.freezerThaw=true
        } else {
            ord.freezerThaw=false
        }

    }
    let freezeFilter = fullOrdersToday.filter(full => full.freezerThaw === true)
    console.log("full", freezeFilter);
    let allProds = Array.from(new Set(freezeFilter.map(freeze => freeze.prodName)))
    console.log("allProds",allProds)
    return [freezeFilter, allProds]
  }


  

}
