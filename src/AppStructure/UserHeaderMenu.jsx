import React, { useRef } from "react";

import { Button } from "primereact/button";
import { Menu } from "primereact/menu";

import { useSettingsStore } from "../Contexts/SettingsZustand";
import { authSignOut } from "./Auth/AuthHelpers";

import { useUserDetails } from "../data/users";

export const UserHeaderMenu = () => {
  // const settings = useSettingsStore()
  const user = {
    name: useSettingsStore((state) => state.user),
    authClass: useSettingsStore((state) => state.authClass),
    locNick: useSettingsStore((state) => state.currentLoc),
    userObject: useSettingsStore((state) => state.userObject)
  }
  const setCurrentLoc = useSettingsStore((state) => state.setCurrentLoc);
  const setFormType = useSettingsStore((state) => state.setFormType);

  const userAttributes = user?.userObject?.attributes
  const sub = userAttributes
    ? user.userObject?.username + '_' + userAttributes['email']
    : null

  console.log("user", user)
  console.log("sub", sub)

  const { data: userDetails } = useUserDetails(sub, !!sub);
  console.log("userDetails", userDetails)

  const userMenuRef = useRef(null);
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

  const locationMenuRef = useRef(null);
  const locUserItems = userDetails?.locs?.items ?? []

  const currentLocUser = locUserItems
    .find(luItem => luItem.locNick === user.locNick)

  const locationMenuItems = locUserItems
    .filter(luItem => luItem.locNick !== user.locNick)
    .map(luItem => ({
      label: luItem.location.locName,
      command: () => setCurrentLoc(luItem.locNick)
    }))

  const locationMenuModel = [
    {
      label: "Change Location...",
      items: locationMenuItems,
    },
  ];

  return (
    <div className="user-header-menu">
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: ".25rem",
        backgroundColor: "hsl(37, 100%, 80%)",
      }}>
        {locationMenuItems.length === 0
          ? <div className="read-only-button">
              <Button
                onClick={e => locationMenuRef.current.toggle(e)}
                className="p-button-text"
                disabled={true}
              >
                <i className="pi pi-fw pi-map-marker" />
                <span style={{ marginRight: ".5rem" }}>
                  {currentLocUser?.location?.locName}
                </span>
              </Button>
            </div>
          : <div>
              <Menu model={locationMenuModel} popup ref={locationMenuRef} />

              <Button
                onClick={(e) => locationMenuRef.current.toggle(e)}
                className="p-button-text"
                
                style={{ 
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textAlign: "left",
                  display: "block",
                }}
              >
                <i className="pi pi-fw pi-map-marker" />
                <span style={{ marginRight: ".5rem" }}>
                  {currentLocUser?.location?.locName}
                </span>{" "}
                <i className="pi pi-chevron-down" />
              </Button>
            </div>
        }
        <div>
          {/* <Button 
            className="p-button-text" 
            icon="pi pi-home"
            onClick={() => {window.location = "/"}}
            style={{marginRight: ".25rem"}}
          /> */}
          <Menu model={userMenuItems} popup ref={userMenuRef} />
          <Button
            onClick={(e) => userMenuRef.current.toggle(e)}
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
    </div>
  );
};
