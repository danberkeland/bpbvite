import React, { useEffect } from "react";

import AnimatedRoutes from "./AnimatedRoutes";

import { Amplify } from "aws-amplify";
import { Authenticator, Image, View, useTheme } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "../aws-exports";
import { I18n } from "aws-amplify";

import { useSettingsStore } from "../Contexts/SettingsZustand";

// import { useNavigate } from "react-router-dom";


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



function Pages() {
  // const navigate = useNavigate()
  // const navigate = (path) => window.location = path

  // const itemsAuth2 = [
  //   { label: "Ordering", icon: "pi pi-fw pi-shopping-cart", command: () => navigate("/Ordering") },
  //   { label: "Products", icon: "pi pi-fw pi-tags",          command: () => navigate("/CustomerProducts") },
  //   // { label: "Billing", icon: "pi pi-fw pi-dollar" },
  //   // { label: "Settings", icon: "pi pi-fw pi-cog" },
  // ];

  // const bpbmgrItems = [
  //   { label: "Logistics", icon: "pi pi-fw pi-map",        command: () => navigate("/Logistics") },
  //   { label: "Locations", icon: "pi pi-fw pi-map-marker", command: () => navigate("/Locations") },
  //   { label: "Products",  icon: "pi pi-fw pi-tags",       command: () => navigate("/Products") },
  // ];
  
  // const itemsAuth1 = [
  //   { 
  //     label: "Ordering", 
  //     icon: "pi pi-fw pi-shopping-cart", 
  //     command: () => navigate("/Ordering") 
  //   },
  //   {
  //     label: "Legacy Production",
  //     icon: "pi pi-fw pi-chart-bar",
  //     items: [
  //       { 
  //         label: "BPBN", 
  //         icon: "pi pi-fw pi-home",
  //         items: [
  //           { label: "Baker 1",      icon: "pi pi-fw pi-home", command: () => navigate("/Production/BPBNBaker1") },
  //           { label: "Baker 2",      icon: "pi pi-fw pi-home", command: () => navigate("/Production/BPBNBaker2") },
  //           { label: "BPBN Setout",  icon: "pi pi-fw pi-home", command: () => navigate("/Production/BPBNSetOut") },
  //           { label: "BPBN Buckets", icon: "pi pi-fw pi-home", command: () => navigate("/Production/BPBNBuckets") },
  //           { label: "Who Bake",     icon: "pi pi-fw pi-home", command: () => navigate("/Production/WhoBake") },
  //           { label: "Who Shape",    icon: "pi pi-fw pi-home", command: () => navigate("/Production/WhoShape") }
  //         ],
  //       },
  //       {
  //         label: "BPBS",
  //         icon: "pi pi-fw pi-home",
  //         items: [
  //           { label: "What To Make",  icon: "pi pi-fw pi-home", command: () => navigate("/Production/BPBSWhatToMake") },
  //           { label: "Mix Pocket",    icon: "pi pi-fw pi-home", command: () => navigate("/Production/BPBSMixPocket") },
  //           { label: "BPBS Setout",   icon: "pi pi-fw pi-home", command: () => navigate("/Production/BPBSSetOut") },
  //           { label: "Croix Count",   icon: "pi pi-fw pi-home", command: () => navigate("/Production/CroixCount") },
  //           { label: "Croix To Make", icon: "pi pi-fw pi-home", command: () => navigate("/Production/CroixToMake") },
  //         ],
  //       },
  //       { 
  //         label: "Test New Production Pages", 
  //         command: () => navigate("/Production/Production") 
  //       },
  //     ],
  //   },
  //   {
  //     label: "Logistics",
  //     icon: "pi pi-fw pi-map",
  //     items: [
  //       {
  //         label: "By Route (Legacy)",
  //         icon: "pi pi-fw pi-home",
  //         command: () => navigate("/Logistics/ByRoute")
  //       },
  //     ],
  //   },
  //   { label: "EOD Counts", icon: "pi pi-fw pi-sliders-v", command: () => navigate("/EODCounts") },
  //   { label: "Locations", icon: "pi pi-fw pi-map-marker", command: () => navigate("/Locations") },
  //   { label: "Products", icon: "pi pi-fw pi-tags", command: () => navigate("/Products") },
  //   { label: "Billing", icon: "pi pi-fw pi-dollar", command: () => navigate("/Billing") },
  //   { 
  //     label: "Settings", 
  //     icon: "pi pi-fw pi-cog",
  //     items: [
  //       { label: "Manage Customers", icon: "pi pi-fw pi-home", command: () => navigate("/Settings/ManageCustomers") },
  //       { label: "Manage Training", icon: "pi pi-fw pi-home", command: () => navigate("/Settings/ManageTrainings") },
  //       { label: "Customer Products", icon: "pi pi-fw pi-home", command: () => navigate("/Settings/custProds") },
  //     ],
  //   },
  // ]

  // const setItems = useSettingsStore((state) => state.setItems);
  // const authClass = useSettingsStore((state) => state.authClass);
  
  // useEffect(() => {
  //   setItems(
  //     authClass === "customer" ? itemsAuth2
  //     : authClass === "bpbmgr" ? bpbmgrItems
  //     : itemsAuth1
  //   )
  // }, [authClass])

  return (
    <Authenticator
      components={components}
      signUpAttributes={["email", "name", "phone_number"]}
      hideSignUp={true}
    >
      {({ signOut, user }) => {
        return (
          <div className='main-block'>
            <AnimatedRoutes
              signOut={signOut}
              user={user}
            />
          </div>
        );
      }}
    </Authenticator>
  );
}

export default Pages;
