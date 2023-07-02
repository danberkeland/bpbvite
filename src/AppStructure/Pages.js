import React, { useEffect } from "react";

import AnimatedRoutes from "./AnimatedRoutes";

import { Amplify } from "aws-amplify";
import { Authenticator, Image, View, useTheme } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "../aws-exports";
import { I18n } from "aws-amplify";

import { useSettingsStore } from "../Contexts/SettingsZustand";

I18n.putVocabulariesForLanguage("en", {
  "Sign In": "Login", // Tab header
  "Sign in": "Log in", // Button label
  "Sign in to your account": "Welcome Back!",
  Username: "Enter your username (Might be your email)", // Username label
  Password: "Enter your password", // Password label
  "Forgot your password?": "Reset Password",
  "Create Account": "Create Account", // Tab header
  "Create a new account": "New User", // Header text
  "Confirm Password": "Confirm your password", // Confirm Password label
  Email: "Enter your email",
  "Phone Number": "Enter your phone number",
  "Code *": "Verification code has been sent to your email"
});

const components = {
  Header() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Image
          alt="Amplify logo"
          src="https://docs.amplify.aws/assets/logo-dark.svg"
        />
      </View>
    );
  },
};

Amplify.configure(awsExports);

const bpbmgrItems = [
  {
    label: "Logistics",
    icon: "pi pi-fw pi-map",
    command: () => {
      window.location = "/Logistics";
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

const itemsAuth2 = [
  {
    label: "Ordering",
    icon: "pi pi-fw pi-shopping-cart",
    command: () => {
      window.location = "/Ordering";
    },
  },
  /*
  {
    label: "Products",
    icon: "pi pi-fw pi-tags",
    
  },
  {
    label: "Billing",
    icon: "pi pi-fw pi-dollar",
    
  },
  {
    label: "Settings",
    icon: "pi pi-fw pi-cog",
   
  },
  */
];

const itemsAuth2b = [
  {
    label: "Ordering",
    icon: "pi pi-fw pi-shopping-cart",
    command: () => {
      window.location = "/Ordering";
    },
  },
];

const itemsAuth1 = itemsAuth2b.concat([
  {
    label: "Legacy Production",
    icon: "pi pi-fw pi-chart-bar",
    items: [
      {
        label: "BPBN",
        icon: "pi pi-fw pi-home",
        items: [
          {
            label: "Baker 1",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/BPBNBaker1";
            },
          },
          {
            label: "Baker 2",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/BPBNBaker2";
            },
          },
          {
            label: "BPBN Setout",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/BPBNSetOut";
            },
          },
          {
            label: "BPBN Buckets",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/BPBNBuckets";
            },
          },
          {
            label: "Who Bake",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/WhoBake";
            },
          },
          {
            label: "Who Shape",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/WhoShape";
            },
          },
        ],
      },

      {
        label: "BPBS",
        icon: "pi pi-fw pi-home",
        items: [
          {
            label: "What To Make",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/BPBSWhatToMake";
            },
          },
          {
            label: "Mix Pocket",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/BPBSMixPocket";
            },
          },
          {
            label: "BPBS Setout",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/BPBSSetOut";
            },
          },
          {
            label: "Croix Count",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/CroixCount";
            },
          },
          {
            label: "Croix To Make",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/CroixToMake";
            },
          },
        ],
      },

      {
        label: "Test New Production Pages",
        //icon: "pi pi-fw pi-wrench",
        command: () => {
          window.location = "/Production/Production";
        },
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
        command: () => {
          window.location = "/Logistics/ByRoute";
        },
      },
    ],
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
      {
        label: "Manage Training",
        icon: "pi pi-fw pi-home",
        command: () => {
          window.location = "/Settings/ManageTrainings";
        },
      },
      {
        label: "Customer Products",
        icon: "pi pi-fw pi-home",
        command: () => {
          window.location = "/Settings/custProds";
        },
      },
    ],
  },
]);

function Pages({ Routes, Route, useLocation }) {
  const setItems = useSettingsStore((state) => state.setItems);
  const authClass = useSettingsStore((state) => state.authClass);
  useEffect(() => {
    if (authClass === "customer") {
      setItems(itemsAuth2);
    } else if (authClass === "bpbmgr") {
      setItems(bpbmgrItems);
    } else {
      setItems(itemsAuth1);
    }
  }, [authClass]);

  return (
    <Authenticator
      components={components}
      signUpAttributes={["email", "name", "phone_number"]}
    >
      {({ signOut, user }) => {
        return (
          <>
            <AnimatedRoutes
              signOut={signOut}
              user={user}
              Routes={Routes}
              Route={Route}
              useLocation={useLocation}
            />
          </>
        );
      }}
    </Authenticator>
  );
}

export default Pages;
