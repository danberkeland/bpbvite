import { Auth } from "aws-amplify";
import axios from "axios";
import { checkUser } from "./AppStructure/Auth/AuthHelpers";

const API_bpbrouterAuth =
  "https://8gw70qn5eb.execute-api.us-east-2.amazonaws.com/auth";

const API_cognitoUser =
  "https://wj4mb7q3xi.execute-api.us-east-2.amazonaws.com/auth";

// NEW STUFF

export const fetcher = async (event, path, fetchType) => {
  let root;
  let user;
  let token;
  let headers;
  if (fetchType === "route") {
    root = API_bpbrouterAuth;
    user = await Auth.currentAuthenticatedUser();
    token = user.signInUserSession.idToken.jwtToken;
    headers = {
      "content-type": "application/json",
      Authorization: token,
    };
  } else if (fetchType === "cognito") {
    root = API_cognitoUser;
    headers = {
      "content-type": "application/json",
    };
  }

  let obj;
  try {
    obj = await axios.post(root + path, event, {
      headers: headers
    });
  } catch (err) {
    console.log(`Error creating ${path}`, err);
  }
  console.log(`${path} Response:`, obj);
  return obj.data.body;
};

export const createProduct = (event) => {
  return fetcher(event, "/products/createProduct", "route");
};

export const updateProduct = (event) => {
  return fetcher(event, "/products/updateProduct", "route");
};

export const deleteProduct = (event) => {
  return fetcher(event.values, "/products/deleteProduct", "route");
};

export const createLocation = (event) => {
  return fetcher(event, "/locations/createLocation", "route");
};

export const updateLocation = (event) => {
  return fetcher(event, "/locations/updateLocation", "route");
};

export const deleteLocation = (event) => {
  return fetcher(event.values, "/locations/deleteLocation", "route");
};

export const createUser = async (event) => {
  console.log('eventCreateUser', event)
  await createCognitoUser(event)
    .then((newEvent) => {
      console.log('newEvent', newEvent)
      fetcher(newEvent.newerEvent, "/users/createUser", "route");
      return newEvent.newLocUser;
    })
    .then((newLocUser) => {
      return createLocationUser(newLocUser);
    });
};

export const updateUser = async (event) => {
  console.log('Entryevent', event)
  await updateCognitoUser(event)
    .then((newEvent) => {
      console.log('newEvent', newEvent)
      fetcher(newEvent.newerEvent, "/users/updateUser", "route");
      return newEvent.newLocUser;
    })
    .then(() => {
      console.log('newLocUsers', event.locations)
      return updateLocationUsers(event.locations);
    });
};


export const deleteUser = (event) => {
  deleteCognitoUser(event);
  return fetcher(event, "/users/deleteUser", "route");
};

export const createLocationUser = (event) => {
  return fetcher(event, "/locationUsers/createLocationUser", "route");
};

export const updateLocationUsers = (event) => {
  return fetcher(event, "/locationUsers/updateLocationUsers", "route");
};

export const deleteLocationUser = (event) => {
  return fetcher(event, "/locationUsers/deleteLocationUser", "route");
};

export const createCognitoUser = (event) => {
  return fetcher(event, "/createcognitouser", "cognito");
};

export const updateCognitoUser = (event) => {
  return fetcher(event, "/updatecognitouser", "cognito");
};

export const deleteCognitoUser = (event) => {
  return fetcher(event, "/deletecognitouser", "cognito");
};

export const getOrder = (event) => {
  return fetcher(event, "/orders/getOrder", "route");
};

// Auth calls

// export const submitAuth = async (props) => {
// const {email, password, setIsLoading, setFormType, setShowMessage, setUserObject} = props;
export const submitAuth = async (props, fns) => {
  
  const { email, password } = props
  const { setIsLoading, setFormType, setShowMessage, setUserObject, setResetPassword } = fns

  
  const emailCheck = [
    "danberkeland@gmail.com",
    "eat@highstdeli.com",
    "osos@highstdeli.com",
    "slo@highstdeli.com",
    "kreuzberg.mgr@poorbutsexy.biz",
    "kraken.avila.mgr@poorbutsexy.biz",
    "kraken.bonetti.mgr@poorbutsexy.biz",
    "kraken.pismo.mgr@poorbutsexy.biz",
    "loshel@live.com",
    "reneerose11@gmail.com",
    "tara@scoutcoffeeco.com",
    "ryan@scoutcoffeeco.com",
    "peter@sloprovisions.com",
    "trixybliss@att.net",
    "james@poorbutsexy.biz",
  ];

  console.log("submitProps", props);

  setIsLoading(true);
  await Auth.signIn(email, password)
    .then((use) => {
      setUserObject(use);
  
      if (use.challengeName === "NEW_PASSWORD_REQUIRED") {
        setIsLoading(false);
        setFormType("resetPassword");
        return;
      } else if (use.attributes.email_verified === false) {
        setIsLoading(false);
        setFormType("verifyEmail");
        return;
      } else {
        setIsLoading(false);
        setFormType("signedIn");
      }
    })
    .catch((error) => {
      if (error) {
        /*
        if (emailCheck.includes(email)){
          setResetPassword(true)
          return
        }
        setShowMessage(true);
        */
        setIsLoading(false);
      }
    });
};

export const submitConfirm = async (props) => {
  checkUser()
    .then((user) => {
      let event = {
        token: user.signInUserSession.accessToken.jwtToken,
        code: props.confirm,
      };
      try {
        axios.post(API_cognitoUser + "/confirmcognitoemail", event);
      } catch (err) {
        console.log("Error confirming code", err);
      }
    })
    .then((prod) => {
      console.log("code confirm", prod);
      return prod;
    });
};

export const setNewPassword = async (props, fns) => {
  const { setIsLoading, setFormType, userObject } = fns;
  const { passwordConfirm } = props
  setIsLoading(true);
  await Auth.completeNewPassword(userObject, passwordConfirm).then((use) => {
    setFormType("onNoUser");
    setIsLoading(false);
  });
};

export const sendForgottenPasswordEmail = async (email) => {
  Auth.forgotPassword(email)
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};

export const resetPassword = async (props, fns) => {
  const { email, code, passwordNew } = props;
  const { setIsLoading, setFormType, userObject } = fns;
  console.log('fns', fns)
  console.log('props', props)
  console.log('code', code)
  console.log('email', email)
  console.log('passwordNew', passwordNew)
  Auth.forgotPasswordSubmit(email, code, passwordNew)
    .then((data) => console.log(data))
    .catch((err) => console.log(err))
    .then((use) => {
      setFormType("onNoUser");
      setIsLoading(false);
    });
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
