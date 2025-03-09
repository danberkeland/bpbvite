import React from "react";
import { useSettingsStore } from "../Contexts/SettingsZustand";

import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";


import { PanelMenu } from "primereact/panelmenu";

import { DateTime } from "luxon";

export function NavSide() {
  const user = useSettingsStore((state) => state.user);
  const authClass = useSettingsStore((state) => state.authClass);

  const navigate = (path) => window.location = path

  const itemsAuth2 = [
    { label: "Ordering", icon: "pi pi-shopping-cart", command: () => navigate("/Ordering") },
    { label: "Products", icon: "pi pi-fw pi-tags",          command: () => navigate("/CustomerProducts") },
    // { label: "Billing", icon: "pi pi-fw pi-dollar" },
    // { label: "Settings", icon: "pi pi-fw pi-cog" },
  ];

  const bpbmgrItems = [
    { label: "Logistics", icon: "pi pi-fw pi-map",        command: () => navigate("/Logistics") },
    { label: "Locations", icon: "pi pi-fw pi-map-marker", command: () => navigate("/Locations") },
    { label: "Products",  icon: "pi pi-fw pi-tags",       command: () => navigate("/Products") },
  ];
  
  const itemsAuth1 = [
    { 
      label: "Ordering", 
      icon: "pi pi-shopping-cart", 
      command: () => navigate("/Ordering") 
    },
    {
      label: "Legacy Production",
      icon: "pi pi-fw pi-chart-bar",
      items: [
        { 
          label: "BPBN", 
          icon: "pi pi-fw pi-home",
          items: [
            { label: "Baker 1",      icon: "pi pi-fw pi-home", command: () => navigate("/Production/BPBNBaker1") },
            { label: "Baker 2",      icon: "pi pi-fw pi-home", command: () => navigate("/Production/BPBNBaker2") },
            { label: "BPBN Setout",  icon: "pi pi-fw pi-home", command: () => navigate("/Production/BPBNSetOut") },
            { label: "BPBN Buckets", icon: "pi pi-fw pi-home", command: () => navigate("/Production/BPBNBuckets") },
            { label: "Who Bake",     icon: "pi pi-fw pi-home", command: () => navigate("/Production/WhoBake") },
            { label: "Who Shape",    icon: "pi pi-fw pi-home", command: () => navigate("/Production/WhoShape") }
          ],
        },
        {
          label: "BPBS",
          icon: "pi pi-fw pi-home",
          items: [
            { label: "What To Make",  icon: "pi pi-fw pi-home", command: () => navigate("/Production/BPBSWhatToMake") },
            { label: "Mix Pocket",    icon: "pi pi-fw pi-home", command: () => navigate("/Production/BPBSMixPocket") },
            { label: "BPBS Setout",   icon: "pi pi-fw pi-home", command: () => navigate("/Production/BPBSSetOut") },
            { label: "Croix Count",   icon: "pi pi-fw pi-home", command: () => navigate("/Production/CroixCount") },
            { label: "Croix To Make", icon: "pi pi-fw pi-home", command: () => navigate("/Production/CroixToMake") },
          ],
        },
        { 
          label: "Test New Production Pages", 
          command: () => navigate("/Production/Production") 
        },
      ],
    },
    {
      label: "Logistics",
      icon: "pi pi-fw pi-map",
      items: [
        {
          label: "By Route (Legacy)",
          icon: "pi pi-fw pi-home",
          command: () => navigate("/Logistics/ByRoute")
        },
      ],
    },
    { label: "EOD Counts", icon: "pi pi-fw pi-sliders-v",  command: () => navigate("/EODCounts") },
    { label: "Locations",  icon: "pi pi-fw pi-map-marker", command: () => navigate("/Locations") },
    { label: "Products",   icon: "pi pi-fw pi-tags",       command: () => navigate("/Products") },
    { label: "Billing",    icon: "pi pi-fw pi-dollar",     command: () => navigate("/Billing") },
    { 
      label: "Settings", 
      icon: "pi pi-fw pi-cog",
      items: [
        { label: "Manage Customers",  icon: "pi pi-fw pi-home", command: () => navigate("/Settings/ManageCustomers") },
        { label: "Manage Training",   icon: "pi pi-fw pi-home", command: () => navigate("/Settings/ManageTrainings") },
        { label: "Customer Products", icon: "pi pi-fw pi-home", command: () => navigate("/Settings/custProds") },
      ],
    },
  ]

  const items = authClass === "customer" ? itemsAuth2
    : authClass === "bpbmgr" ? bpbmgrItems
    : ["bpbfull"].includes(authClass) ? itemsAuth1
    : []
  

  return (
    // <motion.div
    //   initial={{ opacity: 0 }}
    //   animate={{ opacity: 1 }}
    //   exit={{ opacity: 0 }}
    // >
    <>
      <div className="panelMenu">

        <div className="currentCustomer">
          <div className="cust">
            {DateTime.now().setZone('America/Los_Angeles').toLocaleString(DateTime.DATE_MED)}
          </div>
        </div>

        <div className="cartStanding">
          <div className="cartStand">
            Welcome, {user}!
          </div>
        </div>

        <PanelMenu
          className="mypanel"
          model={items}
          style={{ width: "100%" }}
        />
      </div>

      <div className="bottomSpace" />
    </>
    // </motion.div>
  );
}

// export function NavBottom() {
//   // const setFormType = useSettingsStore((state) => state.setFormType);
//   const authClass = useSettingsStore((state) => state.authClass);
 

//   // const signOut = () => {
//   //   authSignOut(setFormType);
//   // };
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       {/* <div className="greyBar"></div> */}
//       <div className="tabContainer">
//         <TabMenu className="tabMenu" model={authClass === "bpbfull" ? itemsAuth4min : onlyHome} />
//         {/* <button className="signOutButton" onClick={signOut}>
//           Sign Out
//         </button> */}
//       </div>
//     </motion.div>
//   );
// }
