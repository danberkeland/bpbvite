import React, { useEffect } from "react";

import { Amplify } from "aws-amplify";
import awsmobile from "./aws-exports";

import { Splash } from "./Auth/Splash";
import { UserApplyForm } from "./Auth/UserApplyForm";
import { UserResetPassword } from "./Auth/UserResetPassword";
import { UserApplyThanks } from "./Auth/UserApplyThanks";

import { NavBottom } from "./Nav";

import Pages from "./Pages";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./index.css";

import {
  checkUser,
  fetchUserDetails,
  grabAuth,
  grabLocationUsers,
  setAuthListener,
} from "./Auth/AuthHelpers";
import Loader from "./Loader";
import { useSettingsStore } from "./Contexts/SettingsZustand";

Amplify.configure(awsmobile);

export function App() {
  
  const userDetails = useSettingsStore((state) => state.userDetails)
  const setUserDetails = useSettingsStore((state) => state.setUserDetails)
  const setFormType = useSettingsStore((state) => state.setFormType)
  const formType = useSettingsStore((state) => state.formType)
  const authType = useSettingsStore((state) => state.authType)
  const setAuthType = useSettingsStore((state) => state.setAuthType)
  const setUser = useSettingsStore((state) => state.setUser)
  const setUserList = useSettingsStore((state) => state.setUserList)
  const user = useSettingsStore((state) => state.user)
  const chosen = useSettingsStore((state) => state.chosen)
  const setChosen = useSettingsStore((state) => state.setChosen)
  const isLoading = useSettingsStore((state) => state.isLoading)
  const setIsLoading = useSettingsStore((state) => state.setIsLoading)

 
  useEffect(() => {
    fetchCustomers();
  }, [userDetails.sub]);

  const fetchCustomers = async () => {
    try {
      grabLocationUsers().then((userList) => {
        console.log("userStuff", userList.data.listLocationUsers.items);
        let userArray = userList.data.listLocationUsers.items.map((use) => ({
          userName: use.user.name,
          sub: use.user.sub,
          locName: use.location.locName,
          locNick: use.location.locNick,
          authType: use.authType,
        }));
        userArray = userArray.filter((use) => use.sub === userDetails.sub);

        setUserList(userArray);
      });
    } catch (error) {
      console.log("error on fetching Cust List", error);
    }
  };

  useEffect(() => {
    setAuthListener(setFormType, setUser, setUserDetails);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    checkUser().then((use) => {
      console.log("checkUser",use)
      setUser(use);
      setFormType(use ? "signedIn" : "onNoUser");
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    console.log("user", user);
    setIsLoading(true);
    user &&
      fetchUserDetails(user.username).then((info) => {
        console.log("userDetails", info);
        console.log("defaultLoc", info.defaultLoc);
        info.defaultLoc && setChosen(info.defaultLoc);
        setUserDetails({
          ...userDetails,
          userName: info.name,
          sub: info.sub,
        });
        setIsLoading(false);
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
      <h2>Welcome, {userDetails.userName}.</h2>
      <h3>Location: {chosen.locName}</h3>
      <h4>AuthType: {authType}</h4>

      {formType === "signedIn" && (
        <React.Fragment>
          <NavBottom />
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
