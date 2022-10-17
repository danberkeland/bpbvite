import { Auth } from "aws-amplify";
import axios from "axios";

const API_bpbrouterAuth =
  "https://8gw70qn5eb.execute-api.us-east-2.amazonaws.com/auth";

// NEW STUFF

async function signUp(event) {
  const { email, custName, authClass, phone, locNick } = event;

  try {
    const data = await Auth.signUp({
      username: email,
      password: "admin123!",
      attributes: {
        "custom:name": custName,
        "custom:authType": authClass,
      },
    });
    let newEvent = {
      sub: data.userSub,
      name: custName,
      authClass: authClass,
      email: email,
      phone: phone,
      locNick: locNick,
    };
    return newEvent
  } catch (error) {
    console.log("error signing up", error);
  }
}

export const fetcher = async (event, path) => {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;
  console.log("token", token);

  console.log("event", event);

  let obj;
  try {
    obj = await axios.post(API_bpbrouterAuth + path, event, {
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
    });
  } catch (err) {
    console.log(`Error creating ${path}`, err);
  }
  console.log(`${path} Response:`, obj);
  return obj.data.body;
};

export const createProduct = (event) => {
  return fetcher(event, "/products/createProduct");
};

export const deleteProduct = (event) => {
  return fetcher(event.values, "/products/deleteProduct");
};

export const updateProduct = (event) => {
  return fetcher(event, "/products/updateProduct");
};

export const createLocation = (event) => {
  return fetcher(event, "/locations/createLocation");
};

export const deleteLocation = (event) => {
  return fetcher(event.values, "/locations/deleteLocation");
};

export const updateLocation = (event) => {
  return fetcher(event, "/locations/updateLocation");
};

export const createUser = async (event) => {
  let newEvent = await signUp(event);
  return fetcher(newEvent, "/users/createUser")
};

export const deleteUser = (event) => {
  return fetcher(event.values, "/users/deleteUser");
};

export const updateUser = (event) => {
  return fetcher(event, "/users/updateUser");
};

export const getOrder = (event) => {
  return fetcher(event, "/orders/getOrder");
};

export const createLocationUser = (event) => {
  return fetcher(event, "/locationUsers/createLocationUser");
};

// OLD STUFF

const API_testingGrQL =
  "https://dltjjr5aja.execute-api.us-east-2.amazonaws.com/dev/testingGrQL";
const API_grabLocList =
  "https://lkho363aq2.execute-api.us-east-2.amazonaws.com/dev/grabloclist";
const API_grabStandOrder =
  "https://ab83b5yb6c.execute-api.us-east-2.amazonaws.com/auth/grabStandOrder";

const API_bpbadmin2 =
  "https://7el0c3e6wi.execute-api.us-east-2.amazonaws.com/auth/";

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
