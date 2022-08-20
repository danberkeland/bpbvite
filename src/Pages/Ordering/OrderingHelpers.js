

import { API, graphqlOperation } from "aws-amplify";

import { listOrderBackups, getOrder } from "../../graphql/queries";
import { updateOrder, createOrder } from "../../graphql/mutations";


export const grabOldOrd = async () => {
    const loc = await API.graphql(
      graphqlOperation(listOrderBackups, {
        limit: "1000",
      })
    );
    return loc.data.listOrderBackups.items;
  };
  
  export const checkExistsNewOrd = async (old) => {
    try {
      let ord = await API.graphql(graphqlOperation(getOrder, { id: old }));
      console.log("ord", ord.data.getOrder);
      
      return ord.data.getOrder ? true : false;
    } catch (error) {
      console.log("Order Does not exist", error);
      return false;
    }
  };
  
  export const updateNewOrd = async (old, prods, locs) => {

    
    let prodInd = prods.findIndex(prod => prod.prodName === old.prodName)
    let prodNick = prods[prodInd].nickName
    old.prodNick = prodNick

    let locInd = locs.findIndex(loc => loc.custName === old.custName)
    let locNick = locs[locInd].nickName
    old.locNick = locNick
    old.locName = old.custName
    old.ItemNote = old.PONote
    old.createdOn = Date.now()

    delete old.custName
    delete old.prodName
    delete old.locName
    delete old.PONote
    delete old.route
    delete old.timeStamp
    delete old.createdAt
    delete old.updatedAt


    try {
      await API.graphql(graphqlOperation(updateOrder, { input: { ...old } }));
    } catch (error) {
      console.log("error on updating order", error);
    }
    
  };
  
  export const createNewOrd = async (old, prods, locs) => {
 
    let prodInd = prods.findIndex(prod => prod.prodName === old.prodName)
    let prodNick = prods[prodInd].nickName
    old.prodNick = prodNick

    let locInd = locs.findIndex(loc => loc.custName === old.custName)
    let locNick = locs[locInd].nickName
    old.locNick = locNick
    old.locName = old.custName
    old.ItemNote = old.PONote
    delete old.timeStamp
    delete old.createdAt
    delete old.updatedAt

    delete old.custName
    delete old.prodName
    delete old.locName
    delete old.PONote
    delete old.route
    
    try {
      await API.graphql(graphqlOperation(createOrder, { input: { ...old } }));
    } catch (error) {
      console.log("error on creating order", error);
    }
    
  };