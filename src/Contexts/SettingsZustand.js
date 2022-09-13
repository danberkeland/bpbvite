import React, { useState, createContext, useEffect } from "react";
import { grabLocationUsers } from "../Auth/AuthHelpers";
import create from "zustand";
import { devtools } from "zustand/middleware";

const store = (set) => ({
  user: "",
  setUser: () => set((state) => ({ user: state })),
  formType: "",
  setFormType: () => set((state) => ({ formType: state })),
  authType: 0,
  setAuthType: () => set((state) => ({ authType: state })),
  isLoading: false,
  setIsLoading: () => set((state) => ({ isLoading: state })),
  formData: {
    username: "",
    password: "",
    newPassword: "",
    email: "",
    location: "",
  },
  setFormData: () => set((state) => ({ formData: state })),
  chosen: {
    userName: "",
    sub: "",
    locName: "",
    locNick: "",
  },
  setChosen: () => set((state) => ({ chosen: state })),
  userList: {
    userName: "",
    locName: "",
    locNick: "",
    sub: "",
  },
  setUserList: () => set((state) => ({ userList: state })),
  userDetails: {
    userName: "",
    sub: "",
    locName: "",
    locNick: "",
    authType: "",
  },
  setUserDetails: () => set((state) => ({ userDetails: state })),
});

export const useSettingsStore = create(devtools(store));

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
    subs: [],
    locName: "",
    locNick: "",
    authType: "",
  });

  const [authType, setAuthType] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
          subs: use.location.subs.items.map((use) => use.user.sub),
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
        setIsLoading,
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
};
