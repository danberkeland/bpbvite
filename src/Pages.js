import React, { useEffect } from "react";

import AnimatedRoutes from "./AnimatedRoutes";
import { useSettingsStore } from "./Contexts/SettingsZustand";

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
    items: [
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
    ],
  },
  {
    label: "Settings",
    icon: "pi pi-fw pi-cog",
    command: () => {
      window.location = "/Settings";
    },
  },
]);

function Pages(props) {
  const setItems = useSettingsStore((state) => state.setItems);

  useEffect(() => {
    setItems(itemsAuth1);
  }, []);

  return (
    <AnimatedRoutes
      Routes={props.Routes}
      Route={props.Route}
      useLocation={props.useLocation}
    />
  );
}

export default Pages;
