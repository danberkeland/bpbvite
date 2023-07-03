
//      THE FRENCH PRODUCTION CONUNDRUM
//
//      High St French are made fresh daily but all other french are made
//      one day ahead of time.  By system default, "High French" numbers
//      would appear in Fresh Bake and all other "French" would appear in
//      shelf bake.  This Conundrum solver groups all french in Shelf Bake.

import { getFullProdOrders } from "../../../helpers/CartBuildingHelpers";
import { tomBasedOnDelivDate } from "../../../helpers/dateTimeHelpers";

const addUp = (acc, val) => {
    return acc + val;
  };

export const handleFrenchConundrum = (freshProds, shelfProds,database,delivDate) => {
    const [products, customers, routes, standing, orders] = database;

    // get all tomorrows french orders
    //let fullTomOrders = getFullProdOrders(tomBasedOnDelivDate(delivDate),database)

    let fullTomOrders = getFullProdOrders(tomBasedOnDelivDate(delivDate),database)
    //console.log("fullTomOrders",fullTomOrders)
    fullTomOrders = fullTomOrders.filter(fu => fu.prodName==="French Stick" || fu.prodName==="French Stick (Retail)").map(f => f.qty)
    
    let fullTom = fullTomOrders.reduce(addUp)

    let highInd = freshProds.findIndex(fresh => fresh.forBake==="High French") 
    let frenchInd = shelfProds.findIndex(fr => fr.forBake==="French")
    let highqty = freshProds[highInd].qty
    let other = shelfProds[frenchInd].qty
    let current = products[products.findIndex(pr => pr.forBake === "French")].currentStock

    // console.log("High",highqty)
    // console.log("Other", other)
    // console.log("fullTomOrders",fullTom)
    // console.log("currentStock",current)

    if (current > other){
        current = other
        shelfProds[frenchInd].needEarly = highqty;
    } else {
        shelfProds[frenchInd].needEarly = highqty+other-current;
    }
    shelfProds[frenchInd].qty = highqty+other;
    shelfProds[frenchInd].makeTotal = highqty+other-current+fullTom;
    freshProds = freshProds.filter(prod => prod.forBake !== "High French")
    
    
    return [ freshProds, shelfProds ]
}