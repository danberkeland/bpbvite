import { TabMenu } from "primereact/tabmenu";
import { PanelMenu } from "primereact/panelmenu";

import React, { useContext, useEffect, useState } from "react";

import { SettingsContext } from "./Contexts/SettingsContext";

import { authSignOut } from "./Auth/AuthHelpers";

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
];

const itemsAuth4 = [
  {
    label: "Customer News",
    icon: "pi pi-fw pi-home",
    command: () => {
      window.location = "/CustomerNews";
    },
  },
  {
    label: "Ordering",
    icon: "pi pi-fw pi-shopping-cart",
    command: () => {
      window.location = "/Ordering";
    },
  },
  {
    label: "Products",
    icon: "pi pi-fw pi-tags",
    command: () => {
      window.location = "/CustomerOrdering";
    },
  },
];

const itemsAuth3 = itemsAuth4.concat([
  {
    label: "Settings",
    icon: "pi pi-fw pi-cog",
    command: () => {
      window.location = "/CustomerSettings";
    },
  },
]);

const itemsAuth2 = [
  {
    label: "Production",
    icon: "pi pi-fw pi-chart-bar",
    command: () => {
      window.location = "/Production";
    },
  },
  {
    label: "Logistics",
    icon: "pi pi-fw pi-map",
    command: () => {
      window.location = "/Logistics";
    },
  },
  {
    label: "EOD Counts",
    icon: "pi pi-fw pi-sliders-v",
    command: () => {
      window.location = "/EODCounts";
    },
  },
  {
    label: "Ordering",
    icon: "pi pi-fw pi-shopping-cart",
    command: () => {
      window.location = "/Ordering";
    },
  },
  {
    label: "Locations",
    icon: "pi pi-fw pi-map-marker",
    command: () => {
      window.location = "/Locations";
    },
  },
  {
    label: "Products",
    icon: "pi pi-fw pi-tags",
    command: () => {
      window.location = "/Products";
    },
  },
];

const itemsAuth1 = itemsAuth2.concat([
  {
    label: "Billing",
    icon: "pi pi-fw pi-dollar",
    command: () => {
      window.location = "/Billing";
    },
  },
  {
    label: "Settings",
    icon: "pi pi-fw pi-cog",
    command: () => {
      window.location = "/Settings";
    },
  },
]);

function Nav() {
  const { setFormType, chosen, authType } = useContext(SettingsContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    switch (authType) {
      case 1:
        setItems(itemsAuth1);
        break;
      case 2:
        setItems(itemsAuth2);
        break;
      case 3:
        setItems(itemsAuth3);
        break;
      case 4:
        setItems(itemsAuth4);
        break;
      default:
        setItems([]);
    }
  }, [authType]);

  const signOut = () => {
    authSignOut(setFormType);
  };
  return (
    <React.Fragment>
      <div className="greyBar"></div>
      <div className="tabContainer">
        <TabMenu className="tabMenu" model={itemsAuth4min} />
        <button onClick={signOut}>Sign Out</button>
      </div>
      <div className="panelMenu">
        <PanelMenu
          className="mypanel"
          model={items}
          style={{ width: "100%", height: "550px" }}
        />
      </div>

      
    </React.Fragment>
  );
}

export default Nav;
