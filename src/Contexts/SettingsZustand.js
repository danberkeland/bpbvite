
import create from "zustand";
import { devtools } from "zustand/middleware";

const store = (set) => ({
  user: "",
  setUser: (user) => set(() => ({ user: user })),
  formType: "",
  setFormType: (formType) => set(() => ({ formType: formType })),
  authType: 0,
  setAuthType: authType => set(() => ({ authType: authType })),
  isLoading: false,
  setIsLoading: (isLoading) => set(() => ({ isLoading: isLoading })),
  formData: {
    username: "",
    password: "",
    newPassword: "",
    email: "",
    location: "",
  },
  setFormData: (formData) => set(() => ({ formData: formData })),
  chosen: {
    userName: "",
    sub: "",
    locName: "",
    locNick: "",
  },
  setChosen: (chosen) => set(() => ({ chosen: chosen })),
  userList: {
    userName: "",
    locName: "",
    locNick: "",
    sub: "",
  },
  setUserList: (userList) => set(() => ({ userList: userList })),
  userDetails: {
    userName: "",
    sub: "",
    locName: "",
    locNick: "",
    authType: "",
  },
  setUserDetails: (userDetails) => set(() => ({ userDetails: userDetails })),
});

export const useSettingsStore = create(devtools(store));
