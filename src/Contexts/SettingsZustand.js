import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";


const { DateTime } = require("luxon");

let today = DateTime.now()
  .setZone("America/Los_Angeles")
  .toString()
  .split("T")[0];

// const store = (set) => ({
//   userObject: {},
//   setUserObject: (userObject) => set(() => ({ userObject: userObject })),
//   user: "",
//   setUser: (user) => set(() => ({ user: user })),
//   access: "",
//   setAccess: (access) => set(() => ({ access: access })),
//   formType: "",
//   setFormType: (formType) => set(() => ({ formType: formType })),
//   authClass: "",
//   setAuthClass: (authClass) => set(() => ({ authClass: authClass })),
//   isLoading: false,
//   setIsLoading: (isLoading) => set(() => ({ isLoading: isLoading })),
//   delivDate: today,
//   setDelivDate: (delivDate) => set(() => ({ delivDate: delivDate })),
//   items: [],
//   setItems: (items) => set(() => ({ items: items })),
//   currentOrder: [],
//   setCurrentOrder: (currentOrder) =>
//     set(() => ({ currentOrder: currentOrder })),
//   isEdit: false,
//   setIsEdit: (isEdit) => set(() => ({ isEdit: isEdit })),
//   isCreate: false,
//   setIsCreate: (isCreate) => set(() => ({ isCreate: isCreate })),
//   isChange: false,
//   setIsChange: (isChange) => set(() => ({ isChange: isChange })),
//   currentLoc: "",
//   setCurrentLoc: (currentLoc) => set(() => ({ currentLoc: currentLoc })),
//   chosen: "",
//   setChosen: (chosen) => set(() => ({ chosen: chosen })),
// });

// export const useSettingsStore = create(devtools(store));

const store = persist(
  (set) => ({
    userObject: {},
    setUserObject: (userObject) => set(() => ({ userObject: userObject })),
    user: "",
    setUser: (user) => set(() => ({ user: user })),
    access: "",
    setAccess: (access) => set(() => ({ access: access })),
    formType: "",
    setFormType: (formType) => set(() => ({ formType: formType })),
    isLoading: false,
    setIsLoading: (isLoading) => set(() => ({ isLoading: isLoading })),
    ordersHasBeenChanged: true,
    setOrdersHasBeenChanged: (setOrdersHasBeenChanged) => set(() => ({ setOrdersHasBeenChanged: setOrdersHasBeenChanged })),
    delivDate: today,
    setDelivDate: (delivDate) => set(() => ({ delivDate: delivDate })),
    items: [],
    setItems: (items) => set(() => ({ items: items })),
    currentOrder: [],
    setCurrentOrder: (currentOrder) =>
    set(() => ({ currentOrder: currentOrder })),
    isEdit: false,
    setIsEdit: (isEdit) => set(() => ({ isEdit: isEdit })),
    isCreate: false,
    setIsCreate: (isCreate) => set(() => ({ isCreate: isCreate })),
    isChange: false,
    setIsChange: (isChange) => set(() => ({ isChange: isChange })),
    chosen: "",
    setChosen: (chosen) => set(() => ({ chosen: chosen })),
    currentLoc: "",
    setCurrentLoc: (currentLoc) => set(() => ({ currentLoc: currentLoc })),
    authClass: "",
    setAuthClass: (authClass) => set(() => ({ authClass: authClass })),
  }),
  {
    name: 'settings-store', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    partialize: (state) => ({
      currentLoc: state.currentLoc,
      authClass: state.authClass
    }) // Declare fields to be stored in local storage; others are stored in memory
  }
)

export const useSettingsStore = create(devtools(store));