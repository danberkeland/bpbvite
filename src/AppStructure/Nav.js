import { TabMenu } from "primereact/tabmenu";
import { PanelMenu } from "primereact/panelmenu";

import React from "react";
import { DateTime } from "luxon";

import { useSettingsStore } from "../Contexts/SettingsZustand";

import { authSignOut } from "./Auth/AuthHelpers";
import { motion } from "framer-motion";
// import { dateToMmddyyyy, getBpbTime, getWorkingDateTime } from "../functions/dateAndTime";

const itemsAuth4min = [
  {
    icon: "pi pi-fw pi-home",
    command: () => {
      window.location = "/";
    },
  },
  {
    icon: "pi pi-fw pi-shopping-cart",
    command: () => {
      window.location = "/Ordering";
    },
  },
  {
    icon: "pi pi-fw pi-tags",
    command: () => {
      window.location = "/CustomerOrdering";
    },
  },
  {
    label: "More",
    icon: "pi pi-fw pi-bars",
    command: () => {
      window.location = "/";
    },
  },
];

const onlyHome = [
  {
    icon: "pi pi-fw pi-home",
    command: () => {
      window.location = "/";
    },
  }
];

export function NavSide() {
  const items = useSettingsStore((state) => state.items);
  const user = useSettingsStore((state) => state.user);
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="panelMenu">
      <div className="currentCustomer">
        <div className="cust">{DateTime.now().setZone('America/Los_Angeles').toLocaleString(DateTime.DATE_MED)}</div>
      </div>
      <div className="cartStanding">
        <div className="cartStand">Welcome, {user}!</div>
      </div>
        <PanelMenu
          className="mypanel"
          model={items}
          style={{ width: "100%" }}
        />
      </div>
      <div className="bottomSpace"></div>
    </motion.div>
  );
}

export function NavBottom() {
  const setFormType = useSettingsStore((state) => state.setFormType);
  const authClass = useSettingsStore((state) => state.authClass);
 

  const signOut = () => {
    authSignOut(setFormType);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* <div className="greyBar"></div> */}
      <div className="tabContainer">
        <TabMenu className="tabMenu" model={authClass === "bpbfull" ? itemsAuth4min : onlyHome} />
        <button className="signOutButton" onClick={signOut}>
          Sign Out
        </button>
      </div>
    </motion.div>
  );
}
