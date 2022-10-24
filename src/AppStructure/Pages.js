import React, { useEffect } from "react";

import AnimatedRoutes from "./AnimatedRoutes";
import { useSettingsStore } from "../Contexts/SettingsZustand";

const itemsAuth2 = [
  
  {
    label: "Ordering",
    icon: "pi pi-fw pi-shopping-cart",
    command: () => {
      window.location = "/Ordering";
    },
  }
];

const itemsAuth1 = itemsAuth2.concat([
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
    items: [
      {
        label: "Manage Customers",
        icon: "pi pi-fw pi-home",
        command: () => {
          window.location = "/Settings/ManageCustomers";
        },
      },
    ],
  },
]);

function Pages(props) {
  const setItems = useSettingsStore((state) => state.setItems);
  const authClass = useSettingsStore((state) => state.authClass);
  useEffect(() => {
    if (authClass === "customer"){
      setItems(itemsAuth2);
    } else {
      setItems(itemsAuth1)
    }
   
  }, [authClass]);

  return (
    <AnimatedRoutes
      Routes={props.Routes}
      Route={props.Route}
      useLocation={props.useLocation}
    />
  );
}

export default Pages;
