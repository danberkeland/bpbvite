import React, { useState, createContext, useEffect } from "react";

import { grabLocationUsers } from "../Auth/AuthHelpers";

export const SettingsContext = createContext();

const initialFormState = {
  username: "",
  password: "",
  newPassword: "",
  email: "",
  location: "",
};

export const SettingsProvider = (props) => {
  const [user, setUser] = useState();

  const [chosen, setChosen] = useState({
    userName: "",
    sub: "",
    locName: "",
    locNick: "",
  });
  const [formData, setFormData] = useState(initialFormState);
  const [formType, setFormType] = useState();

  const [userList, setUserList] = useState([
    {
      userName: "",
      locName: "",
      locNick: "",
      sub: "",
    },
  ]);
  const [userDetails, setUserDetails] = useState({
    userName: "",
    sub: "",
    locName: "",
    locNick: "",
    authType: "",
  });

  const [authType, setAuthType] = useState(0);
  const [ isLoading, setIsLoading ] = useState(false)

  useEffect(() => {
    fetchCustomers();
  }, [userDetails.sub]);

  const fetchCustomers = async () => {
    try {
      grabLocationUsers().then((userList) => {
        let userArray = userList.data.listLocationUsers.items.map((use) => ({
          userName: use.user.name,
          sub: use.user.sub,
          subs: use.location.subs.items.map((loc) => loc.userID),
          locName: use.location.locName,
          locNick: use.location.locNick,
          authType: use.authType,
        }));
        userArray = userArray.filter((use) =>
          use.subs.includes(userDetails.sub)
        );
       
        setUserList(userArray);
      });
    } catch (error) {
      console.log("error on fetching Cust List", error);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        userList,
        setUserList,
        userDetails,
        setUserDetails,
        user,
        setUser,
        chosen,
        setChosen,
        formData,
        setFormData,
        formType,
        setFormType,
        authType,
        setAuthType,
        isLoading,
        setIsLoading
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
};
