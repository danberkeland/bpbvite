import { getFullOrders } from "../helpers/CartBuildingHelpers"
import {
  zerosDelivFilter,
  buildGridOrderArray,
} from "../helpers/delivGridHelpers";
import { sortAtoZDataByIndex, sortZtoADataByIndex } from "../../../utils/_deprecated/utils";
import {
  calcDayNum,
  routeRunsThatDay,
  productCanBeInPlace,
  productReadyBeforeRouteStarts,
  customerIsOpen,
} from "./utils";



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
              }

              // Lincoln Market French exception
              if (
                (grd.prodName === "French Stick" || grd.prodName === "Dutch Stick")  && grd.custName === "Lincoln Market"
              ){
                grd.route = "Lunch";
                grd.routeDepart = "Prado";
                grd.routeStart = 9.5;
                grd.routeServe = ['Downtown SLO', 'Foothill'];
              }


            }
          }
        }
        for (let grd of prodGrid) {
          if (grd.zone==="slopick" || grd.zone==="Prado Retail"){
            grd.route="Pick up SLO"
          }
          if (grd.zone==="atownpick" || grd.zone==="Carlton Retail"){
            grd.route="Pick up Carlton"
          }
          if (grd.route==="slopick" || grd.route==="Prado Retail"){
            grd.route="Pick up SLO"
          }
          if (grd.route==="atownpick" || grd.route==="Carlton Retail"){
            grd.route="Pick up Carlton"
          }
          if (grd.route==="deliv"){
            grd.route="NOT ASSIGNED"
          }
        }

   
    return prodGrid
}



export default class ComposeProductGrid {
  returnProdGrid = (database, delivDate) => {
    let prodGrid = this.getProdGrid(database, delivDate);
   
    // [freshProds, shelfProds] = handleFrenchConundrum(freshProds, shelfProds);

    return {
      prodGrid: prodGrid,     
    };
  };

  getProdGrid(database, delivDate) {
    const [products, customers, routes, standing, orders] = database;
    let prodGrid = getFullOrders(delivDate, database);
   
    prodGrid = zerosDelivFilter(prodGrid, delivDate, database);
    
    prodGrid = buildGridOrderArray(prodGrid, database);
    
    prodGrid = addRoutes(delivDate, prodGrid, database);
    
    //prodGrid = addAttr(database, prodGrid);
    for (let grd of prodGrid) {
      
      try{grd["delivOrder"] = customers[customers.findIndex(cust => cust.custName === grd.custName)].delivOrder
      
      
    } catch {
      console.log("must be retail")
    }
    sortAtoZDataByIndex(prodGrid,"delivOrder")
    
      
    }
    
    return prodGrid;
  }

}