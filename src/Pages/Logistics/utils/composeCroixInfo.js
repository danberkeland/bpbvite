// import { sortAtoZDataByIndex } from "../../../utils/_deprecated/utils";

// import { getOrdersList, addUp } from "../../Production/Utils/utils"

// import {
//   todayPlus,
//   tomBasedOnDelivDate,
//   TwodayBasedOnDelivDate,
//   ThreedayBasedOnDelivDate,
// } from "../../../helpers/dateTimeHelpers";

// import { getFullProdOrder_s } from "../../../helpers/CartBuildingHelper_s";

// import {
//   setOutFilter,
//   twoDayFrozenFilter,
//   threeDayAlFilter,
//   setOutPlainsForAlmondsFilter,
// } from "../../Production/Utils/filters"

// import ComposePastryPrep from "../../Production/Utils/composePastryPrep"

// import { ceil } from "lodash";
// const { DateTime } = require("luxon");

// const compose = new ComposePastryPrep();

// let today = todayPlus()[0];
// let tom = todayPlus()[1];
// let twoDay = todayPlus()[2];
// let threeDay = todayPlus()[3];
// let fourDay = todayPlus()[12];

// const makeAddQty = (bakedTomorrow, products) => {
//   let makeList2 = Array.from(
//     new Set(bakedTomorrow.map((prod) => prod.prodNick))
//   ).map((mk) => ({
//     prodNick: mk,
//     qty: 0,
//   }));

//   for (let make of makeList2) {
//     make.qty = 1;

//     let qtyAccToday = 0;

//     let qtyToday = bakedTomorrow
//       .filter((frz) => make.prodNick === frz.prodNick)
//       .map((ord) => ord.qty);

//     if (qtyToday.length > 0) {
//       qtyAccToday = qtyToday.reduce(addUp);
//     }
//     make.qty = qtyAccToday;
//     make.id =
//       products[
//         products.findIndex((prod) => prod.nickName === make.prodNick)
//       ].id;
//   }
//   return makeList2;
// };

// const returnSetOut = (database, loc, delivDate) => {
//   let tom = tomBasedOnDelivDate(delivDate);
//   let twoday = TwodayBasedOnDelivDate(delivDate);
//   let threeday = ThreedayBasedOnDelivDate(delivDate);
//   const products = database[0];
//   let setOutList = getOrdersList(tom, database, true);
//   let setOutForAlmonds = getOrdersList(twoday, database, true);
//   let twoDayList = getOrdersList(twoday, database, true);
//   let threeDayList = getOrdersList(threeday, database, true);

//   let setOutToday = setOutList.filter((set) => setOutFilter(set, loc));

//   let almondSetOut = setOutForAlmonds.filter((set) =>
//     setOutPlainsForAlmondsFilter(set, loc)
//   );

//   let twoDayToday = twoDayList.filter((set) => twoDayFrozenFilter(set, loc));
//   let threeDayToday = threeDayList.filter((set) => threeDayAlFilter(set, loc));

//   for (let setout of setOutToday) {
//     if (setout.custName === "Back Porch Bakery") {
//       setout.qty = ceil(setout.qty / 2);
//     }
//   }
//   for (let setout of twoDayToday) {
//     if (setout.custName === "Back Porch Bakery") {
//       setout.qty = ceil(setout.qty / 2);
//     }
//   }
//   for (let setout of almondSetOut) {
//     if (setout.custName === "Back Porch Bakery") {
//       setout.qty = ceil(setout.qty / 2);
//     }
//   }
//   for (let setout of threeDayToday) {
//     if (setout.custName === "Back Porch Bakery") {
//       setout.qty = ceil(setout.qty / 2);
//     }
//   }
//   setOutToday = makeAddQty(setOutToday, products);
//   almondSetOut = makeAddQty(almondSetOut, products);
//   let twoDayPlains = makeAddQty(twoDayToday, products);
//   let threeDayPlains = makeAddQty(threeDayToday, products);
//   let twoDayFreeze = 0;
//   let threeDayFreeze = 0;
//   let almondSet = 0;
//   try {
//     twoDayFreeze = twoDayPlains[0].qty;
//   } catch {
//     twoDayFreeze = 0;
//   }
//   try {
//     threeDayFreeze = threeDayPlains[0].qty;
//   } catch {
//     threeDayFreeze = 0;
//   }

//   try {
//     almondSet = almondSetOut[0].qty;
//   } catch {
//     almondSet = 0;
//   }

//   if (loc === "Prado") {
//     setOutToday[setOutToday.findIndex((set) => set.prodNick === "pl")].qty +=
//       twoDayFreeze + threeDayFreeze + almondSet;
//   }

//   // Find index of 'mb'
//   let mbInd = setOutToday.findIndex((ind) => ind.prodNick === "mb");

//   // Find index of 'unmb'
//   try {
//     let unmbInd = setOutToday.findIndex((ind) => ind.prodNick === "unmb");

//     // Add unmb.qty to mb.qty
//     setOutToday[mbInd].qty += setOutToday[unmbInd].qty;

//     // Remove 'unmb'
//     setOutToday = setOutToday.filter((ind) => ind.prodNick !== "unmb");
//   } catch {}

//   return setOutToday;
// };

// const returnFreezerDelivs = (database, delivDate) => {
//   let orderList = getOrdersList(delivDate, database, true);
//   orderList = orderList.filter(
//     (ord) =>
//       ord.packGroup === "frozen pastries" && ord.doughType === "Croissant"
//   );
//   let frozens = [];
//   let prodList = Array.from(new Set(orderList.map((pr) => pr.prodNick)));
//   for (let pr of prodList) {
//     let acc = 0;

//     for (let or of orderList) {
//       if (or.prodNick === pr) {
//         acc = acc + or.qty;
//       }
//     }
//     let newItem = { prodNick: pr, qty: acc };
//     frozens.push(newItem);
//   }
  
//   return frozens;
// };

// export default class ComposeCroixInfo {
//   returnCroixBreakDown = (database, delivDate) => {
//     let openingCount = this.getOpeningCount(database, delivDate);
//     let openingNorthCount = this.getOpeningNorthCount(database, delivDate);
//     let makeCount = this.getMakeCount(database, delivDate);
//     let closingCount = this.getClosingCount(database, delivDate);
//     let closingNorthCount = this.getClosingNorthCount(database, delivDate);
//     let projectionCount = this.getProjectionCount(database, delivDate);
//     let products = this.getProducts(database);

//     return {
//       openingCount: openingCount,
//       openingNorthCount: openingNorthCount,
//       makeCount: makeCount,
//       closingCount: closingCount,
//       closingNorthCount: closingNorthCount,
//       projectionCount: projectionCount,
//       products: products,
//     };
//   };

//   getProducts = (database) => {
//     return database[0];
//   };

//   getOpeningCount(database, delivDate) {
//     const [products, customers, routes, standing, orders] = database;
//     let count = products.filter(
//       (prod) =>
//         prod.doughType === "Croissant" && prod.packGroup === "baked pastries"
//     );
//     let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(
//       (item) => item !== "Almond"
//     );

//     let prodArray = [];
//     for (let prod of prods) {
//       let ind = products.findIndex((pro) => pro.forBake === prod);
//       let newItem = {
//         prod: prod,
//         fixed: products[ind].freezerCount ? products[ind].freezerCount : 0,
//         qty: products[ind].freezerCount ? products[ind].freezerCount : 0,
//       };
//       prodArray.push(newItem);
//     }
//     let frozenDelivs = (prodArray = sortAtoZDataByIndex(prodArray, "prod"));
//     console.log("openingCount",prodArray)
//     return prodArray;
//   }

//   getOpeningNorthCount(database, delivDate) {
//     const [products, customers, routes, standing, orders] = database;
//     let count = products.filter(
//       (prod) =>
//         prod.doughType === "Croissant" && prod.packGroup === "baked pastries"
//     );
//     let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(
//       (item) => item !== "Almond"
//     );

//     let prodArray = [];
//     for (let prod of prods) {
//       let ind = products.findIndex((pro) => pro.forBake === prod);
//       let newItem = {
//         prod: prod,
//         fixed: products[ind].freezerNorth ? products[ind].freezerNorth : 0,
//         qty: products[ind].freezerNorth ? products[ind].freezerNorth : 0,
//       };
//       prodArray.push(newItem);
//     }
//     prodArray = sortAtoZDataByIndex(prodArray, "prod");
   
//     return prodArray;
//   }

//   getMakeCount(database, delivDate) {
//     const [products, customers, routes, standing, orders] = database;
//     let count = products.filter(
//       (prod) =>
//         prod.doughType === "Croissant" && prod.packGroup === "baked pastries"
//     );

//     let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(
//       (item) => item !== "Almond"
//     );

//     let prodArray = [];
//     for (let prod of prods) {
//       let ind = products.findIndex((pro) => pro.forBake === prod);

//       let sheetCount = 0;
//       if (products[ind].sheetMake > 0) {
//         sheetCount = products[ind].sheetMake;
//       }
//       let newItem = {
//         prod: prod,
//         qty: sheetCount,
//         fixed: sheetCount,
//         total: products[ind].sheetMake * products[ind].batchSize,
//       };
//       prodArray.push(newItem);
//     }
//     prodArray = sortAtoZDataByIndex(prodArray, "prod");
//     return prodArray;
//   }

//   getClosingCount = (database, delivDate, setOut, setOutNorthTom) => {
//     const [products, customers, routes, standing, orders] = database;
//     let freezerDelivs = returnFreezerDelivs(database, todayPlus()[0]);

//     let count = products.filter(
//       (prod) =>
//         prod.doughType === "Croissant" && prod.packGroup === "baked pastries"
//     );
//     let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(
//       (item) => item !== "Almond"
//     );
//     console.log("prods",prods)
//     let prodArray = [];

//     for (let prod of prods) {
//       let goingOut = 0;
//       // calcGoing out
//       let setOut = returnSetOut(database, "Prado", todayPlus()[0]);
//       let setOutNorthTom = returnSetOut(database, "Carlton", todayPlus()[1]);

//       //     total frozen deliveries today

//       let setOutInd;
//       let setOutNorthInd;
      
//       let ind = products.findIndex((pro) => pro.forBake === prod);
//       if (setOut) {
//         setOutInd = setOut.findIndex(
//           (set) => set.prodNick === products[ind].nickName
//         );
        
//         try{
//           goingOut = setOut[setOutInd].qty
//         }catch{}
        
//       }

//       if (setOutNorthTom) {
//         try {
//           setOutNorthInd = setOutNorthTom.findIndex(
//             (set) => set.prodNick === products[ind].nickName
//           );
//           goingOut = goingOut + setOutNorthTom[setOutNorthInd].qty;
//         } catch {}
//       }

//       let newItem = {
//         prod: prod,
//         fixed: products[ind].freezerCount
//           ? products[ind].freezerCount -
//             goingOut +
//             products[ind].sheetMake * products[ind].batchSize
//           : 0,
//         qty: products[ind].freezerCount
//           ? products[ind].freezerCount -
//             goingOut +
//             products[ind].sheetMake * products[ind].batchSize
//           : 0,
//       };
//       prodArray.push(newItem);
//     }

//     prodArray = sortAtoZDataByIndex(prodArray, "prod");

//     for (let fr of freezerDelivs) {
//       fr.prodNick = fr.prodNick.substring(2);
//     }

//     for (let prod of prodArray) {
//       for (let fr of freezerDelivs) {
//         console.log("prodNick",fr.prodNick)
//         console.log("prod",prod.prod)
//         let pro = prod.prod
//         if(pro==="choc"){
//           pro="ch"
//         }
//         if (fr.prodNick === pro) {
//           prod.qty = prod.qty - fr.qty;
//           prod.fixed = prod.fixed - fr.qty;
//         }
//       }
//     }

//     return prodArray;
//   };

//   NorthCroixBakeFilter = (ord) => {
//     return (
//       ord.where.includes("Mixed") &&
//       ord.packGroup === "baked pastries" &&
//       ord.doughType === "Croissant" &&
//       (ord.route === "Pick up Carlton" || ord.routeDepart === "Carlton")
//     );
//   };

//   getClosingNorthCount = (database, delivDate) => {
//     const [products, customers, routes, standing, orders] = database;
//     let count = products.filter(
//       (prod) =>
//         prod.doughType === "Croissant" && prod.packGroup === "baked pastries"
//     );
//     let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(
//       (item) => item !== "Almond"
//     );

//     let prodArray = [];
//     for (let prod of prods) {
//       let ind = products.findIndex((pro) => pro.forBake === prod);
//       let newItem = {
//         prod: prod,
//         fixed: products[ind].freezerNorthClosing
//           ? products[ind].freezerNorthClosing
//           : 0,
//         qty: products[ind].freezerNorthClosing
//           ? products[ind].freezerNorthClosing
//           : 0,
//       };
//       prodArray.push(newItem);
//     }
//     prodArray = sortAtoZDataByIndex(prodArray, "prod");
   
//     return prodArray;

//     /*
//     const [products, customers, routes, standing, orders] = database;
//     let count = products.filter(
//       (prod) =>
//         prod.doughType === "Croissant" && prod.packGroup === "baked pastries"
//     );
//     let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(
//       (item) => item !== "Almond"
//     );

//     let prodArray = [];

//     for (let prod of prods) {
//       let goingOut = 0;

//       let setOut = returnSetOut(database, "Carlton", todayPlus()[0]);

//       let setOutInd;
//       let ind = products.findIndex((pro) => pro.forBake === prod);
//       if (setOut) {
//         try {
//           setOutInd = setOut.findIndex(
//             (set) => set.prodNick === products[ind].nickName
//           );
//           goingOut = setOut[setOutInd].qty;
//         } catch {}
//       }

//       let ind2 = products.findIndex((pro) => pro.forBake === prod);
//       let newItem = {
//         prod: prod,
//         fixed: products
//         ? products[ind2].freezerNorth - goingOut
//         : 0,
//         qty: products
//           ? products[ind2].freezerNorth - goingOut
//           : 0,
//       };
//       prodArray.push(newItem);
//     }
//     prodArray = sortAtoZDataByIndex(prodArray, "prod");
//     console.log("closing",prodArray)
//     // get takeNorthArray
//     // apply to prodArray
//     return prodArray;
//     */
//   };

//   getProjectionCount(database, delivDate) {
//     const [products, customers, routes, standing, orders] = database;
//     let openingCount = this.getOpeningCount(database,delivDate)
//     let makeCount = this.getMakeCount(database,delivDate)
    
//     let count = products.filter(
//       (prod) =>
//         prod.doughType === "Croissant" && prod.packGroup === "baked pastries"
//     );
//     let prods = Array.from(new Set(count.map((co) => co.forBake))).filter(
//       (item) => item !== "Almond"
//     );

//     let prodArray = [];
    
//     for (let prod of prods) {
//       let newItem = {
//         prod: prod,
//         today: 0,
//         tom: 0,
//         "2day": 0,
//         "3day": 0,
//         "4day": 0,
//         todaybase: 0,
//         tombase: 0,
//         "2daybase": 0,
//         "3daybase": 0,
//         "4daybase": 0,
//       };
//       prodArray.push(newItem);
//     }
//     prodArray = sortAtoZDataByIndex(prodArray, "prod");
    
//     prodArray = addToCroix(prodArray, database, today, "today")
//     prodArray = addToCroix(prodArray, database, tom, "tom");
//     prodArray = addToCroix(prodArray, database, twoDay, "2day");
//     prodArray = addToCroix(prodArray, database, threeDay, "3day");
//     prodArray = addToCroix(prodArray, database, fourDay, "4day");
    
    
//     for (let prod of prodArray){
//       prod.todaybase = prod.today
//       prod.tom = prod.tom+prod.today
//       prod.tombase = prod.tom
//       prod["2day"] = prod["2day"]+prod.tom
//       prod["2daybase"] = prod["2day"]
//       prod["3day"] = prod["3day"]+prod["2day"]
//       prod["3daybase"] = prod["3day"]
//       prod["4day"] = prod["4day"]+prod["3day"]
//       prod["4daybase"] = prod["4day"]
      
//     }

//     for (let prod of prodArray){
//       for (let open of openingCount){
//         if (prod.prod === open.prod){
//           prod.today = open.qty-prod.today
//           prod.tom = open.qty-prod.tom
//           prod["2day"] = open.qty-prod["2day"]
//           prod["3day"] = open.qty-prod["3day"]
//           prod["4day"] = open.qty-prod["4day"]

//         }
//       }
//     }
    
//     for (let prod of prodArray){
//       for (let make of makeCount){
//         if (prod.prod === make.prod){
//           prod.today = prod.today+Number(make.total)
//           prod.tom = prod.tom+Number(make.total)
//           prod["2day"] = prod["2day"]+Number(make.total)
//           prod["3day"] = prod["3day"]+Number(make.total)
//           prod["4day"] = prod["4day"]+Number(make.total)
//         }
//       }
//     }
    
//     return prodArray;
//   }
// }

// const addToCroix = (prodArray, database, delivDate,col) => {
//   const [products, customers, routes, standing, orders] = database;
//   let pastryPrepData = compose.returnPastryPrepBreakDown(
//     delivDate,
//     database,
//     "Prado"
//   );
//   let pastryPrepDataSouth = compose.returnPastryPrepBreakDown(
//     delivDate,
//     database,
//     "Carlton"
//   );
//   let ords = getFullProdOrders(delivDate, database);
  
//   for (let ord of ords){
//     let ind = products.findIndex(pro => pro.prodName === ord.prodName)
//     ord.forBake = products[ind].forBake
//     try{
//       ord.forBake = ord.forBake.substring(2)
//     }catch{}
//     ord.packGroup = products[ind].packGroup
   
//   }

//   ords = ords.filter(or => or.packGroup === "frozen pastries")
  

//   for (let prod of prodArray) {
//     let ind, setOut;
//     try {
//       ind = pastryPrepData.setOut.findIndex(
//         (past) => past.forBake === prod.prod
//       );
//       setOut = pastryPrepData.setOut[ind].qty;
//     } catch {}

//     prod[col+"base"] = Number(setOut);
//   }

//   for (let prod of prodArray) {
//     let ind2, goingNorth;
//     try {
//       ind2 = pastryPrepDataSouth.setOut.findIndex(
//         (past) => past.forBake === prod.prod
//       );
//       goingNorth = ind2>-1 ? Number(pastryPrepDataSouth.setOut[ind2].qty) : 0
//     } catch {}

//     prod[col+"base"] = prod[col+"base"] + goingNorth;
//     prod[col] = prod[col+"base"]
//   }

//   for (let prod of prodArray){
//     let count = 0
//     for (let ord of ords){
//       if (prod.prod === ord.forBake){
//         count += Number(ord.qty)
//       }
//     }
   
//     prod[col+"base"] = prod[col+"base"] + count;
//     prod[col] = prod[col+"base"]
//   }

//   return prodArray;
// };
