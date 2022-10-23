import React, { useEffect } from "react";

import { Amplify } from "aws-amplify";
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

import { NavBottom } from "./AppStructure/Nav";

import Pages from "./AppStructure/Pages";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./index.css";

import { checkUser, setAuthListener } from "./AppStructure/Auth/AuthHelpers";
import Loader from "./AppStructure/Loader";
import { useSettingsStore } from "./Contexts/SettingsZustand";

Amplify.configure(awsmobile);

export function App() {
  const setFormType = useSettingsStore((state) => state.setFormType);
  const setAuthClass = useSettingsStore((state) => state.setAuthClass);
  const setAccess = useSettingsStore((state) => state.setAccess);
  const setUser = useSettingsStore((state) => state.setUser);

  const formType = useSettingsStore((state) => state.formType);
  const isLoading = useSettingsStore((state) => state.isLoading);
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);

  useEffect(() => {
    setAuthListener(setFormType, setAccess, setUser, setAuthClass);
  }, [setFormType, setAccess, setUser, setAuthClass]);

  useEffect(() => {
    setIsLoading(true);
    checkUser().then((use) => {
      use && setAccess(use.signInUserSession.accessToken.jwtToken);
      use && setUser(use.attributes["custom:name"]);
      use && setAuthClass(use.attributes["custom:authType"]);
      setFormType(use ? "signedIn" : "onNoUser");
      setIsLoading(false);
    });
  }, []);

  return (
    <React.Fragment>
      {isLoading && <Loader />}

      <h1>Back Porch Bakery</h1>

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
        {formType === "Thankyou" && <UserApplyThanks />}
      </Router>
    </React.Fragment>
  );
}

export default App;
