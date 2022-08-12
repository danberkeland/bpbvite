import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import React, { useContext } from "react";

import { SettingsContext } from "./Contexts/SettingsContext";

import { authSignOut } from "./Auth/AuthHelpers";

import styled from "styled-components";

const TopBar = styled.div`
  display: grid;
  grid-template-columns: 10fr 1fr;
  background-color: white;
`;

const items = [
  {
    label: "Customer News",
    icon: "pi pi-fw pi-home",
    command: () => {
      window.location = "/CustomerNews";
    },
  },
  {
    label: "Ordering",
    icon: "pi pi-fw pi-calendar",
    command: () => {
      window.location = "/Ordering";
    },
  },
  {
    label: "Products",
    icon: "pi pi-fw pi-pencil",
    command: () => {
      window.location = "/Products";
    },
  },
  {
    label: "Settings",
    icon: "pi pi-fw pi-cog",
    command: () => {
      window.location = "/Settings";
    },
  },
];

function Nav() {
  const { setFormType, chosen } = useContext(SettingsContext);

  const signOut = () => {
    authSignOut(setFormType);
  };
  return (
    <TopBar>
      <Menubar model={items} />
      <Button onClick={signOut} label={"Sign Out"}></Button>
    </TopBar>
  );
}

export default Nav;
