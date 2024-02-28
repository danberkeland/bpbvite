import React from "react";

import { Menubar } from "primereact/menubar";
// import { useNavigate } from "react-router-dom";

function TopNav() {
  // const navigate = useNavigate()
  const navigate = path => window.location = path

  const items = [
    {
      label: "Production",
      icon: "pi pi-fw pi-chart-bar",
      items: [
        {
          label: "BPBN",
          items: [
            { label: "BPBN Baker 1", command: () => navigate("/Production/BPBNBaker1") },
            { label: "BPBN Baker 2", command: () => navigate("/Production/BPBNBaker2") },
            { label: "BPBN Set Out", command: () => navigate("/Production/BPBNSetOut") },
            { label: "BPBN Buckets", command: () => navigate("/Production/BPBNBuckets") },
            { label: "Who Bake", command: () => navigate("/Production/WhoBake") },
            { label: "WhoShape", command: () => navigate("/Production/WhoShape") },
          ],
        },
        {
          label: "BPBS",
          items: [
            { label: "BPBS What To Make", command: () => navigate("/Production/BPBSWhatToMake") },
            { label: "BPBS Mix/Pocket",   command: () => navigate("/Production/BPBSMixPocket") },
            { label: "BPBS Set Out",      command: () => navigate("/Production/BPBSSetOut") },
            { label: "BPBS Buckets",      command: () => navigate("/Production/BPBSBuckets") },
            { label: "Special Packing",   command: () => navigate("/Production/BPBSPacking") },
          ],
        },
        {
          label: "Croix",
          items: [
            { label: "What Croix to shape", command: () => navigate("/Production/CroixToMake") },
            { label: "Croix EOD Count",     command: () => navigate("/Production/CroixCount") },
          ],
        },
      ],
    },
    {
      label: "Logistics",
      icon: "pi pi-fw pi-map",
      items: [
        { label: "By Route",           command: () => navigate("/logistics/byRoute") },
        { label: "By Filter",          command: () => navigate("/logistics/byProduct") },
        { label: "North Driver Lists", command: () => navigate("/logistics/NorthLists") },
        { label: "AM Pastry Pack",     command: () => navigate("/logistics/AMPastry") },
        { label: "Retail Bags",        command: () => navigate("/logistics/RetailBags") },
        { label: "Special Orders",     command: () => navigate("/logistics/SpecialOrders") },
        { label: "Freezer Thaw",       command: () => navigate("/logistics/FreezerThaw") },
      ],
    },
    {
      label: "EOD Counts",
      icon: "pi pi-fw pi-map",
      items: [
        { label: "BPBS", command: () => navigate("/EODCounts") },
      ],
    },
    /* { label: "Dough Calc", icon: "pi pi-fw pi-map", command: () => window.location = "/doughCalc/doughCalc" }, */
    { label: "Ordering",  icon: "pi pi-fw pi-shopping-cart", command: () => navigate("/Ordering") },
    { label: "Locations", icon: "pi pi-fw pi-users",         command: () => navigate("/Locations") },
    { label: "Products",  icon: "pi pi-fw pi-tags",          command: () => navigate("/Products") },
    { label: "Billing",   icon: "pi pi-fw pi-money-bill",    command: () => navigate("/Billing") },
    { 
      label: "Settings",  
      icon: "pi pi-fw pi-cog",
      items: [
        { label: "Edit Zones",             command: () => navigate("/Settings/editZones") },
        { label: "Edit Routes",            command: () => navigate("/Settings/editRoutes") },
        { label: "Edit Doughs",            command: () => navigate("/Settings/editDough") },
        { label: "Notes",                  command: () => navigate("/Settings/Notes") },
        { label: "Delivery Order",         command: () => navigate("/settings/DelivOrder") },
        { label: "Customer Product Setup", command: () => navigate("/Settings/custProds") },
        { label: "Manage Users",           command: () => navigate("/Settings/ManageCustomers") },
        {
          label: "Tomorrow Backups",
          items: [
            { label: "BPBN Baker 1",      command: () => navigate("/BPBNProd/BPBNBaker1Backup") },
            { label: "BPBS What To Make", command: () => navigate("/BPBSProd/BPBSWhatToMakeBackup") },
            // { label: "BPBN Baker 2",      command: () => navigate("/BPBNProd/BPBNBaker2Backup") }
          ],
        }
        
      ],
    },
  ];

  return <Menubar model={items} style={{borderRadius: "0px", height: "4rem"}} />
}

export default TopNav;
