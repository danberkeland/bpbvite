

import { API, graphqlOperation } from "aws-amplify";

import { listProductBackups, getProduct } from "../../graphql/queries";
import { updateProduct, createProduct } from "../../graphql/mutations";


export const grabOldProd = async () => {
    const loc = await API.graphql(
      graphqlOperation(listProductBackups, {
        limit: "1000",
      })
    );
    return loc.data.listProductBackups.items;
  };
  
  export const checkExistsNewProd = async (old) => {
    try {
      let prod = await API.graphql(graphqlOperation(getProduct, { prodNick: old }));
      console.log("prod", prod.data.getProduct);
      
      return prod.data.getProduct ? true : false;
    } catch (error) {
      console.log("Product Does not exist", error);
      return false;
    }
  };
  
  export const updateNewProd = async (old) => {
    delete old.createdAt;
    delete old.updatedAt;
  
    console.log("updateOld", old);
    try {
      await API.graphql(graphqlOperation(updateProduct, { input: { ...old } }));
    } catch (error) {
      console.log("error on updating products", error);
    }
  };
  
  export const createNewProd = async (old) => {
    delete old.createdAt;
    delete old.updatedAt;
  
    console.log("createOld", old);
    try {
      await API.graphql(graphqlOperation(createProduct, { input: { ...old } }));
    } catch (error) {
      console.log("error on creating products", error);
    }
  };