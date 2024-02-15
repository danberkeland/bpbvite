import React from "react";
import { Amplify, Hub } from "aws-amplify";
import awsmobile from "./aws-exports";

import { BrowserRouter as Router } from "react-router-dom";

import Pages from "./AppStructure/Pages";
import Loader from "./AppStructure/Loader";
import { useSettingsStore } from "./Contexts/SettingsZustand";

import "./index.css";
import "./bpbTheme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { checkUser } from "./AppStructure/Auth/AuthHelpers";


Amplify.configure(awsmobile);


export function App() {
  const isLoading = useSettingsStore((state) => state.isLoading);
  const setFormType = useSettingsStore((state) => state.setFormType);
  const setAuthClass = useSettingsStore((state) => state.setAuthClass);
  const setAccess = useSettingsStore((state) => state.setAccess);
  const setUser = useSettingsStore((state) => state.setUser);
  const setUserObject = useSettingsStore((state) => state.setUserObject);
  const setCurrentLoc = useSettingsStore((state) => state.setCurrentLoc);

  Hub.listen("auth", (hubCapsule) => {
    console.log("HUB:", JSON.stringify(hubCapsule, null, 2))
    switch (hubCapsule.payload.event) {
      case "signIn":
        console.log("New User Signed in");

        // "payload": {
        //   "data": {
        //     "signInUserSession": {
        //       "idToken": {
        //         "payload": {
        //           "sub": "12d9eef6-ab20-4787-a19a-4fa4635b3f4a",
        //           "email": "backporchbakeryslo@gmail.com"
        //         }
        //       },

        const username = hubCapsule.payload.data.username
        const { sub, email } = hubCapsule.payload.data.signInUserSession.idToken.payload
        console.log("PAYLOAD INFO:", username, sub, email)
        
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

  return (
    <div style={{backgroundColor: "hsl(37, 52%, 53%)"}}>

      {isLoading && <Loader />}

      <div className="headerBlockContainer">
      <div 
        className="headerBlock" 
        onClick={() => window.location = "/"}
        style={{cursor: "pointer"}}
      />
      </div>

      <Router>
        <Pages />
      </Router>
    </div>
  );
}

export default App;


