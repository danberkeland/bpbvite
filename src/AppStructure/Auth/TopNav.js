import React, { useState } from "react";

import { Menubar } from "primereact/menubar";
import { TabMenu } from "primereact/tabmenu";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import styled from "styled-components";

const BackGround = styled.div`
  display: flex;
  width: 100%;
  background-color: white;
`;

const TopBar = styled.div`
  display: grid;
  grid-template-columns: 10fr 1fr;
  background-color: var(--bpb-background-5);
`;

function TopNav() {
  const [selectedMenu, setSelectedMenu] = useState("");

  const items = [
    {
      label: "Production",
      icon: "pi pi-fw pi-chart-bar",
      items: [
        {
          label: "BPBN",
          items: [
            {
              label: "BPBN Baker 1",
              command: () => {
                window.location = "/Production/BPBNBaker1";
              },
            },
            {
              label: "BPBN Baker 2",
              command: () => {
                window.location = "/Production/BPBNBaker2";
              },
            },
            {
              label: "BPBN Set Out",
              command: () => {
                window.location = "/Production/BPBNSetOut";
              },
            },
            {
              label: "BPBN Buckets",
              command: () => {
                window.location = "/Production/Buckets";
              },
            },
            {
              label: "Who Bake",
              command: () => {
                window.location = "/Production/WhoBake";
              },
            },
            {
              label: "WhoShape",
              command: () => {
                window.location = "/Production/WhoShape";
              },
            },
          ],
        },
        {
          label: "BPBS",
          items: [
            {
              label: "BPBS What To Make",
              command: () => {
                window.location = "/Production/BPBSWhatToMake";
              },
            },
            {
              label: "BPBS Mix/Pocket",
              command: () => {
                window.location = "/Production/BPBSMixPocket";
              },
            },
            {
              label: "BPBS Set Out",
              command: () => {
                window.location = "/Prodution/BPBNSetOut";
              },
            },
            {
              label: "BPBS Buckets",
              command: () => {
                window.location = "/Production/Buckets";
              },
            },
            {
              label: "Croix To Make",
              command: () => {
                window.location = "/Production/CroixToMake";
              },
            },
            {
              label: "BPBS EOD Count",
              command: () => {
                window.location = "/EODCounts/EODCounts";
              },
            },
            
          ],
        },
        {
          label: "Croix",
          items: [
            {
              label: "What Croix to shape",
              command: () => {
                window.location = "/Production/CroixToMake";
              },
            },
            {
              label: "Croix EOD Count",
              command: () => {
                window.location = "/Production/CroixCount";
              },
            },
          ],
        },
      ],
    },
    {
      label: "Logistics",
      icon: "pi pi-fw pi-map",
      items: [
        {
          label: "By Route",
          command: () => {
            window.location = "/logistics/byRoute";
          },
        },
        {
          label: "By Filter",
          command: () => {
            window.location = "/logistics/byProduct";
          },
        },
        {
          label: "North Driver Lists",
          command: () => {
            window.location = "/logistics/NorthLists";
          },
        },
        {
          label: "AM Pastry Pack",
          command: () => {
            window.location = "/logistics/AMPastry";
          },
        },
        {
          label: "Retail Bags",
          command: () => {
            window.location = "/logistics/RetailBags";
          },
        },
        {
          label: "Special Orders",
          command: () => {
            window.location = "/logistics/SpecialOrders";
          },
        },
        {
          label: "Freezer Thaw",
          command: () => {
            window.location = "/logistics/FreezerThaw";
          },
        },
        /*
        {
          label: "Voice",
          command: () => {
            window.location = "/settings/voice";
          },
        },
        */
      ],
    },
    {
      label: "EOD Counts",
      icon: "pi pi-fw pi-map",
      items: [
        {
          label: "BPBN",
          command: () => {
            window.location = "/EODCounts/BPBNCounts";
          },
        },
        {
          label: "BPBS",
          command: () => {
            window.location = "/EODCounts/BPBSCounts";
          },
        },
      ],
    },
    /*
    {
      label: "Dough Calc",
      icon: "pi pi-fw pi-map",
      command: () => {
        window.location = "/doughCalc/doughCalc";
      },
    },
    */
    {
      label: "Ordering",
      icon: "pi pi-fw pi-shopping-cart",
      command: () => {
        window.location = "/Ordering";
      },
    },
    {
      label: "Locations",
      icon: "pi pi-fw pi-users",
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
      icon: "pi pi-fw pi-money-bill",
      command: () => {
        window.location = "/Billing";
      },
    },
    {
      label: "Settings",
      icon: "pi pi-fw pi-cog",
      items: [
        {
          label: "Edit Zones",
          command: () => {
            window.location = "/settings/editZones";
          },
        },
        {
          label: "Edit Routes",
          command: () => {
            window.location = "/settings/editRoutes";
          },
        },
        {
          label: "Edit Doughs",
          command: () => {
            window.location = "/settings/editDough";
          },
        },
        {
          label: "Notes",
          command: () => {
            window.location = "/settings/Notes";
          },
        },
        {
          label: "Delivery Order",
          command: () => {
            window.location = "/settings/DelivOrder";
          },
        },
        {
          label: "Customer Product Setup",
          command: () => {
            window.location = "/settings/CustProd";
          },
        },
        {
          label: "Manage Users",
          command: () => {
            window.location = "/settings/manageUsers";
          },
        },
        {
          label: "Tomorrow Backups",
          items: [
            {
              label: "BPBN Baker 1",
              command: () => {
                window.location = "/BPBNProd/BPBNBaker1Backup";
              },
            },
            {
              label: "BPBN Baker 2",
              command: () => {
                window.location = "/BPBNProd/BPBNBaker2Backup";
              },
            },
            {
              label: "BPBS What To Make",
              command: () => {
                window.location = "/BPBSProd/BPBSWhatToMakeBackup";
              },
            },
            
            
          ],
        }
        
      ],
    },
  ];

  return (
    <div className="card">
      <TopBar>
        <Menubar model={items} />
        
      </TopBar>
    </div>
  );
}

export default TopNav;
