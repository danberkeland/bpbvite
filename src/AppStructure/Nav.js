import { TabMenu } from "primereact/tabmenu";
import { PanelMenu } from "primereact/panelmenu";

import React from "react";

import { useSettingsStore } from "../Contexts/SettingsZustand";

import { authSignOut } from "./Auth/AuthHelpers";
import { motion } from "framer-motion";

const itemsAuth4min = [
  {
    icon: "pi pi-fw pi-home",
    command: () => {
      window.location = "/CustomerNews";
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

export function NavSide() {
  const items = useSettingsStore((state) => state.items);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="panelMenu">
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

  const signOut = () => {
    authSignOut(setFormType);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="greyBar"></div>
      <div className="tabContainer">
        <TabMenu className="tabMenu" model={itemsAuth4min} />
        <button onClick={signOut}>Sign Out</button>
      </div>
    </motion.div>
  );
}
