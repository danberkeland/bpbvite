


import React, { useEffect, useContext } from "react";

import { Amplify } from "aws-amplify";
import awsmobile from "./aws-exports";

import { SettingsContext } from "./Contexts/SettingsContext";

import { Splash } from "./Auth/Splash";
import { UserApplyForm } from "./Auth/UserApplyForm";
import { UserResetPassword } from "./Auth/UserResetPassword";
import { UserApplyThanks } from "./Auth/UserApplyThanks";

import Nav from "./Nav";

import Pages from "./Pages";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./index.css";

import {
  checkUser,
  fetchUserDetails,
  grabAuth,
  setAuthListener,
} from "./Auth/AuthHelpers";
import Loader from "./Loader";

Amplify.configure(awsmobile);

export function App() {
  const {
    userDetails,
    setUserDetails,
    setFormType,
    formType,
    authType,
    setAuthType,
    setUser,
    user,
    chosen,
    setChosen,
    isLoading,
    setIsLoading
  } = useContext(SettingsContext);

  useEffect(() => {
    setAuthListener(setFormType, setUser, setUserDetails);
  }, []);

  useEffect(() => {
    setIsLoading(true)
    checkUser().then((use) => {
      setUser(use);
      setFormType(use ? "signedIn" : "onNoUser");
      setIsLoading(false)
    });
  }, []);

  useEffect(() => {
    console.log("user",user)
    setIsLoading(true)
    user &&
      fetchUserDetails(user.username).then((info) => {
        console.log("userDetails",info)
        console.log("defaultLoc",info.defaultLoc)
        info.defaultLoc && setChosen(info.defaultLoc)
        setUserDetails({
          ...userDetails,
          userName: info.name,
          sub: info.sub,
        });
        setIsLoading(false)
      });
  }, [user]);

  useEffect(() => {
    try {
      grabAuth(chosen.locNick, userDetails.sub)
        .then((sub) => {
          setAuthType(sub);
        })
        .catch((err) => setAuthType(0));
    } catch (err) {
      console.log(err);
    }
  }, [chosen]);

  return (
    <React.Fragment>
      {isLoading && <Loader />}
      <h1>Back Porch Bakery</h1>
      <h2>Welcome {userDetails.userName}.</h2>
      <h3>Location: {chosen.locName}</h3>
      <h4>AuthType: {authType}</h4>
    
      {formType === "signedIn" && (
        <React.Fragment>
          <Nav />
          <Pages />
        </React.Fragment>
      )}
      {formType === "onNoUser" && <Splash />}
      {formType === "Apply" && <UserApplyForm />}
      {formType === "resetPassword" && <UserResetPassword />}
      {formType === "Thankyou" && <UserApplyThanks />}
    </React.Fragment>
  );
}

export default App;

