
import { Auth } from "aws-amplify";
import axios from "axios";

const API_bpbrouterAuth =
  "https://8gw70qn5eb.execute-api.us-east-2.amazonaws.com/auth";

const API_cognitoUser =
  "https://wj4mb7q3xi.execute-api.us-east-2.amazonaws.com/auth";

// NEW STUFF


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
  let newEvent = await createCognitoUser(event);

  let newerEvent = {
    sub: newEvent.data.User.Username,
    name: event.custName,
    authClass: event.authClass,
    email: event.email,
    phone: event.phone,
    locNick: event.defLoc,
  };

  const newLocUser = {
    authType: 3,
    locNick: event.defLoc,
    sub: newEvent.data.User.Username,
    Type: "LocationUser",
  };

  console.log("newLocUser", newLocUser);

  return fetcher(newerEvent, "/users/createUser").then((result) =>
    fetcher(newLocUser, "/locationUsers/createLocationUser")
  );
};

export const deleteUser = (event) => {
  deleteCognitoUser(event);
  return fetcher(event, "/users/deleteUser");
};

export const updateUser = async (event) => {
  let newEvent = await updateCognitoUser(event);
  console.log('Userevent', event)

  let newerEvent = {
    sub: event.sub,
    name: event.custName,
    authClass: event.authClass,
    email: event.email,
    phone: event.phone,
    locNick: event.defLoc,
  };
  for (let loc of event.locations) {
    const newLocUser = {
      authType: loc.authType,
      locNick: loc.locNick,
      locName: loc.locName,
      sub: event.sub,
      id: loc.id,
      Type: "LocationUser",
    };
    console.log('newLocUser', newLocUser)
    await fetcher(newLocUser, "/locationUsers/updateLocationUser");
  }
  console.log('newerEvent', newerEvent)
  return fetcher(newerEvent, "/users/updateUser");
};

export const getOrder = (event) => {
  return fetcher(event, "/orders/getOrder");
};

export const createLocationUser = (event) => {
  return fetcher(event, "/locationUsers/createLocationUser");
};

export const deleteLocationUser = (event) => {
  console.log("deleteLocUser event", event)
  return fetcher(event, "/locationUsers/deleteLocationUser");
};

const deleteCognitoUser = async (event) => {
  let prod;
  try {
    prod = await axios.post(API_cognitoUser + "/deletecognitouser", {
      sub: event.sub,
    });
  } catch (err) {
    console.log("Error deleting User", err);
  }
  console.log("deleteCognitoUser:", prod.status);
  return prod.data.body;
};

const createCognitoUser = async (event) => {
  let prod;
  try {
    prod = await axios.post(API_cognitoUser + "/createcognitouser", event);
  } catch (err) {
    console.log("Error creating User", err);
  }
  console.log("createCognitoUser:", prod.status);
  return prod;
};

const updateCognitoUser = async (event) => {
  let prod;
  try {
    prod = await axios.post(API_cognitoUser + "/updatecognitouser", event);
  } catch (err) {
    console.log("Error updating User", err);
  }
  console.log("updateCognitoUser:", prod.status);
  return prod;
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
