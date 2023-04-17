import {
    convertDatetoBPBDate,
    todayPlus,
  } from "../../../helpers/dateTimeHelpers";
  import { createColumns } from "../../../helpers/delivGridHelpers";
  
  let tomorrow = todayPlus()[1];
  let today = todayPlus()[0];
  
  const getProdNickNames = (database, loc,delivDate) => {
    const [products, customers, routes, standing, orders] = database;
    
    let fullNames = Array.from(
      new Set(
        orders
          .filter(
            (ord) =>
              !customers.map((cust) => cust.custName).includes(ord.custName) &&
              ord.delivDate === convertDatetoBPBDate(delivDate) &&
              ord.route === loc
          )
          .map((fil) => fil.prodName)
      )
    );
    let nickNames = fullNames.map(
      (fil) =>
        products[products.findIndex((prod) => fil === prod.prodName)].nickName
    );
    return nickNames;
  };
  
  const getCustNames = (database, loc,delivDate) => {
    const [products, customers, routes, standing, orders] = database;
    return Array.from(
      new Set(
        orders
          .filter(
            (ord) =>
              !customers.map((cust) => cust.custName).includes(ord.custName) &&
              ord.delivDate === convertDatetoBPBDate(delivDate) &&
              ord.route === loc
          )
          .map((fil) => fil.custName)
      )
    );
  };
  
  const makeSpecialColumns = (database, loc,delivDate) => {
    const [products, customers, routes, standing, orders] = database;
    let filteredOrders = getProdNickNames(database, loc,delivDate);
    filteredOrders = createColumns(filteredOrders);
    return filteredOrders;
  };
  
  const makeSpecialOrders = (database, loc,delivDate) => {
    const [products, customers, routes, standing, orders] = database;
    let prodNames = getProdNickNames(database, loc,delivDate);
    let custNames = getCustNames(database, loc,delivDate);
    let orderArray = [];
    for (let cust of custNames) {
      let custItem = {};
      custItem = {
        customer: cust,
        customerShort: cust.length>10 ? cust.substring(0,13)+"..." : cust
      };
      for (let prod of prodNames) {
        let prodFullName =
          products[products.findIndex((pr) => pr.nickName === prod)].prodName;
       
        try {
          custItem[prod] =
            orders[
              orders.findIndex(
                (ord) =>
                  ord.custName === cust &&
                  ord.prodName === prodFullName &&
                  ord.delivDate === convertDatetoBPBDate(delivDate) &&
                  ord.route === loc
              )
            ].qty;
        } catch {
          custItem[prod] = '';
        }
      }
      orderArray.push(custItem);
    }
    console.log("specialOrders", orderArray)
    return orderArray;
  };
  
  export default class ComposeSpecialOrders {
    returnSpecialNorthColumns = (database,delivDate) => {
      let columns = this.getSpecialNorthColumns(database,delivDate);
      return {
        columns: columns,
      };
    };
  
    getSpecialNorthColumns(database,delivDate) {
      let specialNorthColumns = makeSpecialColumns(database, "atownpick",delivDate);
      return specialNorthColumns;
    }
  
    returnSpecialSouthColumns = (database,delivDate) => {
      let columns = this.getSpecialSouthColumns(database,delivDate);
      return {
        columns: columns,
      };
    };
  
    getSpecialSouthColumns(database,delivDate) {
      let specialSouthColumns = makeSpecialColumns(database, "slopick",delivDate);
      return specialSouthColumns;
    }
  
    returnBPBNSpecialOrders = (database,delivDate) => {
      let specialOrders = this.getBPBNSpecialOrders(database, delivDate);
      return {
        specialOrders: specialOrders,
      };
    };
  
    getBPBNSpecialOrders(database,delivDate) {
      const [products, customers, routes, standing, orders] = database;
      let BPBNSpecialOrders = makeSpecialOrders(database, "atownpick",delivDate);
      return BPBNSpecialOrders;
    }
  
    returnBPBSSpecialOrders = (database,delivDate) => {
      let specialOrders = this.getBPBSSpecialOrders(database,delivDate);
      return {
        specialOrders: specialOrders,
      };
    };
  
    getBPBSSpecialOrders(database,delivDate) {
      const [products, customers, routes, standing, orders] = database;
      let BPBSSpecialOrders = makeSpecialOrders(database, "slopick",delivDate);
      return BPBSSpecialOrders;
    }
  }
  