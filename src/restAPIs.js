import axios from "axios";

const API_testingGrQL =
  "https://dltjjr5aja.execute-api.us-east-2.amazonaws.com/dev/testingGrQL";
const API_grabLocList =
  "https://lkho363aq2.execute-api.us-east-2.amazonaws.com/dev/grabloclist";
const API_grabStandOrder =
  "https://ab83b5yb6c.execute-api.us-east-2.amazonaws.com/auth/grabStandOrder";

const API_bpbadmin2 =
  "https://7el0c3e6wi.execute-api.us-east-2.amazonaws.com/auth/";

const API_bpbrouterAuth =
  "https://8gw70qn5eb.execute-api.us-east-2.amazonaws.com/auth";

export const testingGrQL = async (locNick, delivDate) => {
  console.log("delivDate", delivDate);
  let testOrder;
  try {
    testOrder = await axios.post(API_testingGrQL, {
      locNick: locNick,
      delivDate: delivDate,
    });
  } catch (err) {
    console.log("Error grabbing testingGrQL", err);
  }
  console.log("testOrder", testOrder);
  return testOrder.data.body;
};

export const grabLocList = async () => {
  let locList;
  try {
    locList = await axios.post(API_grabLocList, {});
  } catch (err) {
    console.log("Error grabbing locList", err);
  }
  console.log("grabLocList Response:", locList.status);
  return locList.data.body;
};

export const grabStandOrder = async (locNick) => {
  let testOrder;
  try {
    testOrder = await axios.post(API_grabStandOrder, {
      locNick: locNick,
    });
  } catch (err) {
    console.log("Error grabbing testingGrQL", err);
  }
  console.log("testOrder", testOrder);
  return testOrder.data.body;
};

export const grabSimpleProductList = async () => {
  let prodList;
  try {
    prodList = await axios.post(
      API_bpbadmin2 + "product/grabsimpleproductlist",
      {}
    );
  } catch (err) {
    console.log("Error grabbing prodList", err);
  }
  console.log("grabSimpleProductList Response:", prodList.status);
  return prodList.data.body;
};

export const grabProductById = async (prodNick) => {
  let prod;
  try {
    prod = await axios.post(API_bpbadmin2 + "product/grabproductbyid", {
      prodNick: prodNick,
    });
  } catch (err) {
    console.log("Error grabbing Product", err);
  }
  console.log("grabProductById Response:", prod.status);
  return prod.data.body;
};

// Product


export const grabDetailedProductList = async () => {
  let prodList;
  try {
    prodList = await axios.post(
      API_bpbrouterAuth + "/products/grabDetailedProductList",
      {}
    );
  } catch (err) {
    console.log("Error grabbing prodList", err);
  }
  console.log("grabDetailedProductList Response:", prodList.status);
  console.log("prodList", prodList.data.body.items);
  return prodList.data.body.items;
};

export const createProduct = async (event) => {
  console.log("event", event);
  let prod;
  try {
    prod = await axios.post(
      API_bpbrouterAuth + "/products/createProduct",
      event
    );
  } catch (err) {
    console.log("Error creating Product", err);
  }
  console.log("createProduct Response:", prod);
  return prod.data.body;
};

export const deleteProduct = async (event) => {
  console.log("event", event);
  let prod;
  try {
    prod = await axios.post(
      API_bpbrouterAuth + "/products/deleteProduct",
      event
    );
  } catch (err) {
    console.log("Error deleting Product", err);
  }
  console.log("deleteProduct Response:", prod);
  return prod.data.body;
};

export const updateProduct = async (event) => {
  console.log("event", event);
  let prod;
  try {
    prod = await axios.post(API_bpbrouterAuth + "/products/updateProduct", event);
  } catch (err) {
    console.log("Error updating Product", err);
  }
  console.log("updateProduct Response:", prod);
  return prod.data.body;
};



// Location

export const grabDetailedLocationList = async () => {
  let locList;
  try {
    locList = await axios.post(
      API_bpbrouterAuth + "/locations/grabDetailedLocationList",
      {}
    );
  } catch (err) {
    console.log("Error grabbing locList", err);
  }
  console.log("grabDetailedLocationList Response:", locList);
  
  return locList.data.body.items;
};

export const createLocation = async (event) => {
  console.log("event", event);
  let loc;
  try {
    loc = await axios.post(
      API_bpbrouterAuth + "/locations/createLocation",
      event
    );
  } catch (err) {
    console.log("Error creating Location", err);
  }
  console.log("createLocation Response:", loc);
  return loc.data.body;
};

export const deleteLocation = async (event) => {
  console.log("event", event);
  let loc;
  try {
    loc = await axios.post(
      API_bpbrouterAuth + "/locations/deleteLocation",
      event
    );
  } catch (err) {
    console.log("Error deleting Location", err);
  }
  console.log("deleteLocation Response:", loc);
  return loc.data.body;
};

export const updateLocation = async (event) => {
  console.log("event", event);
  let loc;
  try {
    loc = await axios.post(API_bpbrouterAuth + "/locations/updateLocation", event);
  } catch (err) {
    console.log("Error updating Location", err);
  }
  console.log("updateLocation Response:", loc);
  return loc.data.body;
};


export const getOrder = async (event) => {
  console.log("event", event);
  let loc;
  try {
    loc = await axios.post(API_bpbrouterAuth + "/orders/getOrder", event);
  } catch (err) {
    console.log("Error getOrder", err);
  }
  console.log("getOrder Response:", loc);
  return loc.data.body;
};

