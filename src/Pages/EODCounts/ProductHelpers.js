import { API, graphqlOperation } from "aws-amplify";

import {
  listProductBackups,
  getProduct,
  listProducts,
} from "../../graphql/queries";
import { updateProduct, createProduct } from "../../graphql/mutations";
import { customCreateProduct } from "../../customGraphQL/mutations";

// *********************************
// Helpers for current Products Page
// *********************************

// ***********
// Old GraphQL
// ***********

export const grabOldProd = async () => {
  const loc = await API.graphql(
    graphqlOperation(listProductBackups, {
      limit: "1000",
    })
  );
  return loc.data.listProductBackups.items;
};

export const checkExistsNewProd = async (old) => {
  console.log("prodNick", old);
  try {
    let prod = await API.graphql(
      graphqlOperation(getProduct, { prodNick: old })
    );
    console.log("prod", prod.data.getProduct);

    return prod.data.getProduct ? true : false;
  } catch (error) {
    console.log("Product Does not exist", error);
    return false;
  }
};

export const updateNewProd = async (old) => {
  delete old.id;
  delete old.createdAt;
  delete old.updatedAt;
  delete old.eodCount;
  delete old.depends;
  delete old.currentStock;
  delete old.whoCountedLast;
  delete old.preshaped;
  delete old.prepreshaped;
  delete old.updatePreDate;
  delete old.updateFreezerDate;
  delete old.backporchbakerypre;
  delete old.backporchbakery;
  delete old.bpbextrapre;
  delete old.bpbextra;
  delete old.bpbssetoutpre;
  delete old.bpbssetout;
  delete old.freezerCount;
  delete old.freezerClosing;
  delete old.sheetMake;
  delete old.freezerNorth;
  delete old.freezerNorthClosing;
  delete old.freezerNorthFlag;

  old.prodNick = old.nickName;
  delete old.nickName;

  old.doughNick = old.doughType;
  delete old.doughType;

  if (old.bakedWhere.includes("Mixed")) {
    old.bakedWhere = ["Prado", "Carlton"];
  }
  console.log("updateOld", old);
  try {
    await API.graphql(graphqlOperation(updateProduct, { input: { ...old } }));
  } catch (error) {
    console.log("error on updating products", error);
  }
};

export const createNewProd = async (old) => {
  console.log("old1", old);
  delete old.id;
  delete old.createdAt;
  delete old.updatedAt;
  delete old.eodCount;
  delete old.depends;
  delete old.currentStock;
  delete old.whoCountedLast;
  delete old.preshaped;
  delete old.prepreshaped;
  delete old.updatePreDate;
  delete old.updateFreezerDate;
  delete old.backporchbakerypre;
  delete old.backporchbakery;
  delete old.bpbextrapre;
  delete old.bpbextra;
  delete old.bpbssetoutpre;
  delete old.bpbssetout;
  delete old.freezerCount;
  delete old.freezerClosing;
  delete old.sheetMake;
  delete old.freezerNorth;
  delete old.freezerNorthClosing;
  delete old.freezerNorthFlag;

  old.prodNick = old.nickName;
  delete old.nickName;

  old.doughNick = old.doughType;
  delete old.doughType;

  
  if (old.bakedWhere.includes("Mixed")) {
    old.bakedWhere = ["Prado", "Carlton"];
  }

  console.log("createOld", old);
  try {
    await API.graphql(graphqlOperation(createProduct, { input: { ...old } }));
  } catch (error) {
    console.log("error on creating products", error);
  }
};
