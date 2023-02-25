import React, { useEffect } from "react";

import { Amplify, Hub } from "aws-amplify";
import awsmobile from "./aws-exports";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { Splash } from "./AppStructure/Auth/Splash2";
import { UserApplyForm } from "./AppStructure/Auth/UserApplyForm";
import { UserResetPassword } from "./AppStructure/Auth/UserResetPassword2";
import { UserApplyThanks } from "./AppStructure/Auth/UserApplyThanks";
import { VerifyEmail } from "./AppStructure/Auth/VerifyEmail";
import { ForgotPassword } from "./AppStructure/Auth/ForgotPassword";

import { NavBottom } from "./AppStructure/Nav";

import Pages from "./AppStructure/Pages";

import "./index.css";
// import "primereact/resources/themes/saga-blue/theme.css";
import './bpbTheme.css'
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { checkUser } from "./AppStructure/Auth/AuthHelpers";
import Loader from "./AppStructure/Loader";
import { useSettingsStore } from "./Contexts/SettingsZustand";

Amplify.configure(awsmobile);

export function App() {
  const setFormType = useSettingsStore((state) => state.setFormType);
  const setAuthClass = useSettingsStore((state) => state.setAuthClass);
  const setAccess = useSettingsStore((state) => state.setAccess);
  const setUser = useSettingsStore((state) => state.setUser);
  const setUserObject = useSettingsStore((state) => state.setUserObject);
  const setCurrentLoc = useSettingsStore((state) => state.setCurrentLoc);

  const formType = useSettingsStore((state) => state.formType);
  const isLoading = useSettingsStore((state) => state.isLoading);
  const user = useSettingsStore((state) => state.user);
  const authClass = useSettingsStore((state) => state.authClass);
  const currentLoc = useSettingsStore((state) => state.currentLoc);
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);

  Hub.listen("auth", (data) => {
    switch (data.payload.event) {
      case "signIn":
        console.log("New User Signed in");
        checkUser().then((use) => {
          setUserObject(use);
          setAccess(use.signInUserSession.accessToken.jwtToken);
          setUser(use.attributes["custom:name"]);
          setAuthClass(use.attributes["custom:authType"]);
          setCurrentLoc(use.attributes["custom:defLoc"]);
          setFormType("signedIn");
          window.location = "/";
        });

        break;
      case "signOut":
        console.log("User Signed Out");

        setAccess("");
        setUserObject({});
        setUser("");
        setAuthClass("");
        setFormType("onNoUser");
        setCurrentLoc("");
        break;

      default:
        break;
    }
  });
  
  useEffect(() => {
    setIsLoading(true);
    checkUser().then((use) => {
      use && setAccess(use.signInUserSession.accessToken.jwtToken);
      use && setUser(use.attributes["custom:name"]);
      use && setAuthClass(use.attributes["custom:authType"]);
      console.log('currentLoc', currentLoc)
      use && setCurrentLoc(currentLoc !== "" ? currentLoc : use.attributes["custom:defLoc"]);
      use && setUserObject(use);
      setFormType(use ? "signedIn" : "onNoUser");
      setIsLoading(false);
    });
  }, []);



  return (
    <React.Fragment>
      {isLoading && <Loader />}
      <div className="headerBlock">
      </div>
      
      {/*{user && (
        <React.Fragment>
          <h4>
            Welcome {user}. Auth Class: {authClass}{" "}
          </h4>
          <h4>Current Location: {currentLoc}</h4>
        </React.Fragment>
      )}*/}
      <Router>
        {formType === "signedIn" && (
          <React.Fragment>
            <NavBottom />
            <Pages Routes={Routes} Route={Route} useLocation={useLocation} />
          </React.Fragment>
        )}
        {formType === "onNoUser" && <Splash />}
        {formType === "verifyEmail" && <VerifyEmail />}
        {formType === "Apply" && <UserApplyForm />}
        {formType === "resetPassword" && <UserResetPassword />}
        {formType === "forgotPassword" && <ForgotPassword />}
        {formType === "Thankyou" && <UserApplyThanks />}
      </Router>
    </React.Fragment>
  );
}

export default App;
