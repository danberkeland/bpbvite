import React, { useRef } from "react";

import { Button } from "primereact/button";
import { Menu } from "primereact/menu";

import { useSettingsStore } from "../Contexts/SettingsZustand";
import { authSignOut } from "./Auth/AuthHelpers";

import { useUserDetails } from "../data/users";
import {
  useLocationDetails,
  useLocationListSimple,
} from "../data/locationData";

import getNestedObject from "../functions/getNestedObject";

import TopNav from "./Auth/TopNav";

export const UserHeaderMenu = () => {
  //const settings = useSettingsStore()
  const user = {
    name: useSettingsStore((state) => state.user),
    sub: useSettingsStore((state) => state.userObject.username),
    authClass: useSettingsStore((state) => state.authClass),
    locNick: useSettingsStore((state) => state.currentLoc),
  };
  console.log('user', user)
  const setCurrentLoc = useSettingsStore((state) => state.setCurrentLoc);
  const setFormType = useSettingsStore((state) => state.setFormType);

  const { data: userDetails } = useUserDetails(user.sub, !!user.sub);
  const { data: currentLocDetails } = useLocationDetails(
    user.locNick,
    !!user.locNick
  );
  const { data: locationList } = useLocationListSimple(true);
  console.log('userDetails', userDetails)

  const userMenu = useRef(null);
  const locationMenu = useRef(null);

  const userMenuItems = [
    {
      label: user.name,
      icon: "pi pi-fw pi-user",
      items: [
        {
          label: "Sign Out",
          icon: "pi pi-fw pi-sign-out",
          command: () => authSignOut(setFormType),
        },
      ],
    },
  ];

  const userLocations = getNestedObject(userDetails, ["locs", "items"]) || [];
  const locationItems = locationList
    ? userLocations
        .filter((i) => i.locNick !== user.locNick)
        .map((i) => ({
          label: locationList.find((loc) => loc.locNick === i.locNick).locName,
          command: () => {
            setCurrentLoc(i.locNick);
          },
        }))
    : [];

  const locationMenuItems = [
    {
      label: "Change Location...",
      items: locationItems,
    },
  ];

  return (
    <React.Fragment>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: ".25rem",
        backgroundColor: "hsl(37, 100%, 80%)",
      }}
    >
      {locationItems.length === 0 && (
        <div className="read-only-button">
          <Button
            onClick={(e) => locationMenu.current.toggle(e)}
            className="p-button-text"
            style={{ width: "fit-content" }}
            disabled={true}
          >
            <i className="pi pi-fw pi-map-marker" />
            <span style={{ marginRight: ".5rem" }}>
              {currentLocDetails?.locName}
            </span>
          </Button>
        </div>
      )}
      {locationItems.length > 0 && (
        <div>
          <Menu model={locationMenuItems} popup ref={locationMenu} />
          <Button
            onClick={(e) => locationMenu.current.toggle(e)}
            className="p-button-text"
            style={{ width: "fit-content" }}
          >
            <i className="pi pi-fw pi-map-marker" />
            <span style={{ marginRight: ".5rem" }}>
              {currentLocDetails?.locName}
            </span>{" "}
            <i className="pi pi-chevron-down" />
          </Button>
        </div>
      )}
      <div>
        <Menu model={userMenuItems} popup ref={userMenu} />
        <Button
          onClick={(e) => userMenu.current.toggle(e)}
          className="p-button-text"
          style={{ width: "fit-content" }}
        >
          <i className="pi pi-fw pi-user" />
          <span style={{ marginRight: ".5rem" }}>
            {user.name
              .split(" ")
              .map((w) => w.substring(0, 1).toUpperCase())
              .join("")}
          </span>{" "}
          <i className="pi pi-chevron-down" />
        </Button>
      </div>
    </div>
    {userDetails?.authClass === "bpbfull" && <TopNav />}
    </React.Fragment>
  );
};
