import { convertDatetoBPBDate } from "./dateTimeHelpers";
import { sortZtoADataByIndex, sortAtoZDataByIndex } from "../utils/_deprecated/utils";

const { DateTime } = require("luxon");

export const removeDoubles = (orderList) => {
  for (let i = 0; i < orderList.length; ++i) {
    for (let j = i + 1; j < orderList.length; ++j) {
      if (
        orderList[i]["prodName"] === orderList[j]["prodName"] &&
        orderList[i]["custName"] === orderList[j]["custName"]
      ) {
        orderList.splice(j, 1);
      }
    }
  }
  return orderList;
};

export const zerosDelivFilter = (orderList, delivDate, database) => {
  // const [products, customers, routes, standing, orders] = database;
  const customers = database[1]
  let noZeroDelivDateOrderList = orderList.filter(
    (ord) =>
      Number(ord["qty"]) !== 0 &&
      ord["delivDate"] === convertDatetoBPBDate(delivDate)
  );
  for (let ord of noZeroDelivDateOrderList) {
    if (ord["route"] === undefined || ord["route"] === "deliv") {
      let ind = customers.findIndex(
        (cust) => cust["custName"] === ord["custName"]
      );
      if (ind > -1) {
        let custZone = customers[ind]["zoneName"];
        ord["zoneName"] = custZone;
      }
    } else {
      let ind = customers.findIndex(
        (cust) => cust["custName"] === ord["custName"]
      );
      if (ind > -1) {
        ord["zoneName"] = ord["route"];
      }
    }
  }
  return noZeroDelivDateOrderList;
};

export const filterForZoneService = (
  noZeroDelivDateOrderList,
  route,
  routes
) => {
  let filterServe;
  if (routes) {
    let rtInd = routes.findIndex((rt) => rt["routeName"] === route);
    filterServe = noZeroDelivDateOrderList.filter((ord) =>
      routes[rtInd]["RouteServe"].includes(ord["route"])
    );
  }
  return filterServe;
};

// const buildCustName = (ord, customers) => {
//   try {
//     return customers[
//       customers.findIndex((cust) => cust["custName"] === ord["custName"])
//     ].nickName;
//   } catch {
//     return;
//   }
// };

export const buildGridOrderArray = (filterServe, database) => {

  const [products, customers] = database;

  const gridOrderArray2 = filterServe.map(order => {

    const { prodName, custName, zoneName, route, qty } = order
    const product = products.find(P => P.prodName === prodName) ?? {}
    const customer = customers.find(C => C.custName === custName) ?? {}
    const {
      doughType,
      bakedWhere,
      readyTime,
      forBake,
      preshaped,
      prepreshaped,
      updatePreDate,
      id,
      packSize,
      weight,
      currentStock,
      batchSize,
      bakeExtra,
      packGroup,
      freezerNorth,
      freezerNorthClosing,
      freezerNorthFlag,
      freezerCount,
      freezerClosing,
    } = product

    return {
      prodName,
      delivOrder: customer.delivOrder ?? 0,
      prodNick: product.nickName,
      custName,
      custNick: customer.nickName,
      zone: zoneName,
      route,
      qty,
      doughType,
      where: bakedWhere,
      when: readyTime,
      forBake,
      preshaped,
      prepreshaped,
      updatePreDate,
      prodID: id,
      packSize,
      weight,
      currentStock,
      batchSize,
      bakeExtra,
      packGroup,
      freezerNorth,
      freezerNorthClosing,
      freezerNorthFlag,
      freezerCount,
      freezerClosing,
    }
  })

  return gridOrderArray2

  // let gridOrderArray;
  // gridOrderArray = filterServe.map((ord) => ({
  //   prodName: ord["prodName"],
  //   delivOrder:
  //     customers.findIndex((cust) => cust.custName === ord.custName) > -1
  //       ? customers[
  //           customers.findIndex((cust) => cust.custName === ord.custName)
  //         ].delivOrder
  //       : 0,
  //   prodNick:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ].nickName,
  //   custName: ord["custName"],
  //   custNick: buildCustName(ord, customers),
  //   zone: ord["zoneName"],
  //   //  Lincoln Market french exception
  //   route: ord["route"],
  //   qty: ord["qty"],
  //   doughType:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ]["doughType"],
  //   where:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ]["bakedWhere"],
  //   when: products[
  //     products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //   ]["readyTime"],
  //   forBake:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ].forBake,
  //   preshaped:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ].preshaped,
  //   prepreshaped:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ].prepreshaped,
  //   updatePreDate:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ].updatePreDate,
  //   prodID:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ].id,
  //   packSize:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ].packSize,
  //   weight:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ].weight,
  //   currentStock:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ].currentStock,
  //   batchSize:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ].batchSize,
  //   bakeExtra:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ].bakeExtra,
  //   packGroup:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ].packGroup,
  //     freezerNorth:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ].freezerNorth,
  //     freezerNorthClosing:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ].freezerNorthClosing,
  //     freezerNorthFlag:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ].freezerNorthFlag,
  //     freezerCount:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ].freezerCount,
  //     freezerClosing:
  //     products[
  //       products.findIndex((prod) => prod["prodName"] === ord["prodName"])
  //     ].freezerClosing,
      
  // }));
  
  // return gridOrderArray;
};

export const isZoneIncludedInRoute = (
  gridOrderArray,
  routes,
  delivDate,
  customers
) => {
  sortZtoADataByIndex(routes, "routeStart");
  for (let rte of routes) {
    for (let grd of gridOrderArray) {
      let day = DateTime.fromSQL(delivDate);
      let dayNum = day.weekday;
      if (dayNum === 7) {
        dayNum = 0;
      }
      dayNum = dayNum + 1;

      if (!rte["RouteServe"].includes(grd["zone"])) {
        continue;
      } else {
        if (rte["RouteSched"].includes(dayNum.toString())) {
          grd["route"] = rte["routeName"];
        } else {
          grd["route"] = "Pick up Carlton";
        }
      }
    }
  }

  return gridOrderArray;
};

export const buildProductArray = (gridToEdit, products) => {
  let listOfProducts;

  listOfProducts = gridToEdit.map((order) => order["prodName"]);
  listOfProducts = new Set(listOfProducts);
  listOfProducts = Array.from(listOfProducts);
  let prodArray = [];
  for (let prod of listOfProducts) {
    for (let item of products) {
      if (prod === item["prodName"]) {
        let newItem = [
          prod,
          item["nickName"],
          item["packGroup"],
          item["packSize"],
        ];
        prodArray.push(newItem);
      }
    }
  }
  return prodArray;
};

export const createColumns = (listOfProducts) => {
  sortAtoZDataByIndex(listOfProducts, 2);
  let columns = [
    {
      field: "customerShort",
      header: "customer",
      dataKey: "customerShort",
      width: { width: "70px" },
    },
  ];
  for (let prod of listOfProducts) {
    let newCol = {
      field: prod,
      header: prod,
      dataKey: prod,
      width: { width: "30px" },
    };
    columns.push(newCol);
  }
  return columns;
};

export const createRouteGridColumns = (listOfProducts) => {
  sortAtoZDataByIndex(listOfProducts, 2);
  let columns = [
    {
      field: "customerShort",
      header: "customer",
      dataKey: "customerShort",
      width: { width: "10%" },
    },
  ];
  for (let prod of listOfProducts) {
    let newCol = {
      field: prod[0],
      header: prod[1],
      dataKey: prod[1],
      width: { width: "30px" },
    };
    columns.push(newCol);
  }
  return columns;
};

export const createListOfCustomers = (orderList) => {

  let listOfCustomers = orderList.filter(ord => ord.custNick).map((order) => order["custName"]);
  listOfCustomers = Array.from(new Set(listOfCustomers));
  return listOfCustomers;
};

export const createQtyGrid = (listOfCustomers, orderList) => {
 
  let data = [];
  for (let cust of listOfCustomers) {
    let newData = {
      customer: cust,
      customerShort: cust.length>10 ? cust.substring(0,13)+"..." : cust
    };
    for (let order of orderList) {
      if (order["custName"] === cust) {
        newData["delivOrder"] = order.delivOrder;
        newData[order["prodName"]] = order["qty"];
      }
    }
    data.push(newData);
  }
  
  sortAtoZDataByIndex(data, "delivOrder");
  return data;
};
