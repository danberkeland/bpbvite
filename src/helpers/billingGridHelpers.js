import { daysOfBillingWeek } from "../helpers/dateTimeHelpers";

import { API, graphqlOperation } from "aws-amplify";

import { sortAtoZDataByIndex } from "../helpers/sortDataHelpers";
import {
  buildCartList,
  buildStandList,
  compileFullOrderList,
} from "../helpers/CartBuildingHelpers";

export const buildCustList = (fullOrder) => {
  let custList = fullOrder.filter((ord) => ord["isWhole"] === true);
  custList = custList.map((ord) => ord["custName"]);
  let custListSet = new Set(custList);
  let custListArray = Array.from(custListSet);
  return custListArray;
};

export const buildInvList = (custListArray, customers, delivDate) => {
  let dateSplit = delivDate.split("-");
  let newDate = dateSplit[1] + dateSplit[2] + dateSplit[0];
  console.log("made it here");
 
  custListArray = custListArray.map((cust) => ({
    custName: cust,
    qbID: customers[customers.findIndex((ind) => ind.custName === cust)].qbID,
    nickName:
      customers[customers.findIndex((ind) => ind.custName === cust)].nickName,
  }));
  console.log("made it here now");
  console.log(custListArray);
  let invList = custListArray.map((cust) => ({
    custName: cust.custName,
    qbID: cust.qbID,
    invNum: newDate + cust.nickName.slice(0, 13),
    orders: [],
  }));

  return invList;
};

export const getRate = (products, order, altPricing) => {
  
  let checkInd = altPricing.findIndex(
    (alt) => alt.custName === order.custName && alt.prodName === order.prodName
  );
  if (checkInd > -1) {
    return altPricing[checkInd].wholePrice;
  }
  let ind = products.findIndex((prod) => prod.prodName === order.prodName);
  let price;
  if (order.rate >= 0) {
    price = order.rate;
  } else {
    try{price = products[ind].wholePrice;}catch{price=0}
    
  }

  if (!price){
    price =0
  }

  return price;
};

export const attachInvoiceOrders = (
  invList,
  fullOrder,
  products,
  altPricing,
  customers,
  zones,
  invFilter
) => {
  for (let inv of invList) {
    let rateTotal = 0;
    let orderClip = fullOrder.filter(
      (ord) => ord["custName"] === inv["custName"]
    );
    for (let ord of orderClip) {
      let ratePull = getRate(products, ord, altPricing);
      rateTotal = rateTotal + ratePull * Number(ord["qty"]);

      let pushBit = {
        prodName: ord["prodName"],
        
        qty: Number(ord["qty"]),
        rate: ratePull,
      };
      if (pushBit.qty > 0) {
        inv.orders.push(pushBit);
      }
    }

    if (
      (!orderClip[0]["route"] || orderClip[0]["route"] === "deliv") &&
      orderClip.filter((ord) => Number(ord["qty"]) > 0).length > 0
    ) {
      let zone =
        customers[
          customers.findIndex(
            (cust) => cust["custName"] === orderClip[0]["custName"]
          )
        ]["zoneName"];
      let rate = zones[zones.findIndex((zn) => zn["zoneName"] === zone)].zoneFee;
      if (Number(rate) > 0 && rateTotal > 0) {
        inv.orders.push({
          prodName: "DELIVERY",
          qty: 1,
          rate: rate,
        });
      }
      
    }
  }

  invList = invList.filter((inv) => inv.orders.length > 0);

  sortAtoZDataByIndex(invList, "custName");
  return invList;
};

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const fetchInfo = async (operation, opString, limit) => {
  const [Sun, Mon, Tues, Wed, Thurs, Fri, Sat] = daysOfBillingWeek();

  try {
    let filter = {
      or: [
        { delivDate: { eq: Sun } },
        { delivDate: { eq: Mon } },
        { delivDate: { eq: Tues } },
        { delivDate: { eq: Wed } },
        { delivDate: { eq: Thurs } },
        { delivDate: { eq: Fri } },
        { delivDate: { eq: Sat } },
      ],
    };
    let info = await API.graphql(
      graphqlOperation(operation, {
        limit: limit,
        filter: filter,
      })
    );
    let list = info.data[opString].items;

    let noDelete = list.filter((li) => li["_deleted"] !== true);
    sortAtoZDataByIndex(noDelete, "delivDate");
    return noDelete;
  } catch {
    return [];
  }
};

export const createDailyInvoices = async (delivDate,orders,standing,customers,products,altPricing,zones) => {
  
  let buildOrders = buildCartList("*", delivDate, orders);
  let buildStand = buildStandList("*", delivDate, standing);
  let fullOrder = compileFullOrderList(buildOrders, buildStand);

  let custListArray = buildCustList(fullOrder);
  let invList = buildInvList(custListArray, customers, delivDate);

  let invOrders = attachInvoiceOrders(
    invList,
    fullOrder,
    products,
    altPricing,
    customers,
    zones,
    "daily"
  );

  return invOrders;
};
