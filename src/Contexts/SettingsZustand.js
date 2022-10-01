
import create from "zustand";
import { devtools } from "zustand/middleware";


const { DateTime } = require("luxon");

let today = DateTime.now().setZone("America/Los_Angeles").toString().split("T")[0]


const store = (set) => ({
  user: "",
  setUser: (user) => set(() => ({ user: user })),
  formType: "",
  setFormType: (formType) => set(() => ({ formType: formType })),
  authType: 1,
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
  ponote: "",
  setPonote: (ponote) => set(() => ({ ponote: ponote })),
  isModified: false,
  setIsModified: (isModified) => set(() => ({ isModified: isModified })),
  locList: [],
  setLocList: (locList) => set(() => ({ locList: locList })),
  delivDate: today,
  setDelivDate: (delivDate) => set(() => ({ delivDate: delivDate })),
  route: 'deliv',
  setRoute: (route) => set(() => ({ route: route })),
  
});

export const useSettingsStore = create(devtools(store));
