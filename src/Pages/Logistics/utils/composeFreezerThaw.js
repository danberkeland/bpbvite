import { todayPlus } from "../../../helpers/dateTimeHelpers";
import { getFullOrders } from "../../../helpers/CartBuildingHelpers";
import { addProdAttr } from "./utils";
import { getOrdersList } from "../../../core/production/getOrdersList";
import { DT } from "../../../utils/dateTimeFns";
import { uniqBy } from "../../../utils/collectionFns/uniqBy";

let today = todayPlus()[0];

const getFreezer = (delivDate, database) => {
  let fullOrder = getFullOrders(delivDate, database);
  fullOrder = addProdAttr(fullOrder, database); // adds forBake, packSize, currentStock
  return fullOrder;
};

export default class ComposeFreezerThaw {

  returnFreezerThaw = (database) => {
    let [freezerThaw, allProds] = this.getFreezerThaw(database);
   
    let [freezerThaw2, allProds2] = this.getFreezerThaw2(database);

    console.log("freezerThaw", freezerThaw)
    console.log("freezerThaw2", freezerThaw2)
    console.log("allProds", allProds)
    console.log("allProds2", allProds2)

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

  getFreezerThaw2(database) {
    const products = database[0]
    const todayIso = DT.today().toFormat('yyyy-MM-dd')
    const freezerThawOrders = getOrdersList(todayIso, database)
      .filter(order => 
        products.find(P => P.prodName === order.prodName)?.freezerThaw === true
      )

    const prodNames = uniqBy(freezerThawOrders, order => order.prodName)
      .map(order => order.prodName)
      .sort()

    return [freezerThawOrders, prodNames]
  }


  

}
