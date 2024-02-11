import React, { useEffect } from "react";

import { Amplify, Hub } from "aws-amplify";
import awsmobile from "./aws-exports";

import { BrowserRouter as Router } from "react-router-dom";

// import { Splash } from "./AppStructure/Auth/Splash2";
// import { UserApplyForm } from "./AppStructure/Auth/UserApplyForm";
// import { UserResetPassword } from "./AppStructure/Auth/UserResetPassword2";
// import { UserApplyThanks } from "./AppStructure/Auth/UserApplyThanks";
// import { VerifyEmail } from "./AppStructure/Auth/VerifyEmail";
// import { ForgotPassword } from "./AppStructure/Auth/ForgotPassword";

// import { NavBottom } from "./AppStructure/Nav";

import Pages from "./AppStructure/Pages";

import "./index.css";
// import "primereact/resources/themes/saga-blue/theme.css";
import "./bpbTheme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { checkUser } from "./AppStructure/Auth/AuthHelpers";
import Loader from "./AppStructure/Loader";
import { useSettingsStore } from "./Contexts/SettingsZustand";
import { UserHeaderMenu } from "./AppStructure/UserHeaderMenu";

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
  //const user = useSettingsStore((state) => state.user);
  const authClass = useSettingsStore((state) => state.authClass);
  const currentLoc = useSettingsStore((state) => state.currentLoc);
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);

  Hub.listen("auth", (data) => {
    console.log("HUB:", data)
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
    console.log("check user useEffect");
    setIsLoading(true);
    checkUser().then((use) => {
      console.log('user', use)
      use && setAccess(use.signInUserSession.accessToken.jwtToken);
      use && setUser(use.attributes["custom:name"]);
      use && !authClass && setAuthClass(use.attributes["custom:authType"]);
      use && !currentLoc && setCurrentLoc(use.attributes["custom:defLoc"]);
      use && setUserObject(use);
      setFormType(use ? "signedIn" : "onNoUser");
      setIsLoading(false);
    });
  }, [
    setAccess,
    setAuthClass,
    setCurrentLoc,
    setFormType,
    setIsLoading,
    setUser,
    setUserObject,
  ]);

  return (
    <React.Fragment>
      {isLoading && <Loader />}
      <div className="headerBlockContainer">
        <div 
          className="headerBlock" 
          onClick={() => window.location = "/"}
          style={{cursor: "pointer"}}
        />
      </div>
      <UserHeaderMenu />

      <Router>
      
          <React.Fragment>
            {/* {authClass === "customer" && <NavBottom />} */}
            <Pages />
          </React.Fragment>
       
      </Router>
    </React.Fragment>
  );
}

export default App;
