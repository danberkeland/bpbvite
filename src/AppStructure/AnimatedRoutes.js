import React from "react";

// import Ordering from "../Pages/Ordering/Ordering";
import Ordering2 from "../Pages/Ordering/Ordering2";
import CustomerNews from "../Pages/CustomerNews/CustomerNews";
import CustomerBilling from "../Pages/CustomerBilling/CustomerBilling";
import CustomerSettings from "../Pages/CustomerSettings/CustomerSettings";
import CustomerProducts from "../Pages/CustomerProducts/CustomerProducts";
import BPBNBaker1 from "../Pages/Production/BPBNBaker1";
import BPBNBaker2 from "../Pages/Production/BPBNBaker2";
import WhoBake from "../Pages/Production/WhoBake";
import WhoShape from "../Pages/Production/WhoShape";
import BPBNSetout from "../Pages/Production/BPBNSetout";
import Production from "../Pages/Production/Production";
import Products from "../Pages/Products/Products";
import Settings from "../Pages/Settings/Settings";
import Billing from "../Pages/Billing/Billing";
import EODCounts from "../Pages/EODCounts/EODCounts";
import Logistics from "../Pages/Logistics/Logistics";
import ByRoute from "../Pages/Logistics/ByRoute/ByRoute";
import Locations from "../Pages/Locations/Locations";
import ManageCustomers from "../Pages/Settings/ManageCustomers/ManageCustomers";
import ManageTraining from "../Pages/Settings/ManageTraining/ManageTraining";
import CustProds from "../Pages/Settings/custProds/custProds";
import { NavSide } from "./Nav";

import { AnimatePresence } from "framer-motion";
import { useSettingsStore } from "../Contexts/SettingsZustand";
import { UserHeaderMenu } from "./UserHeaderMenu";

function AnimatedRoutes({ Routes, Route, useLocation }) {
  const authClass = useSettingsStore((state) => state.authClass);
  const location = useLocation();

  return (
    <AnimatePresence>
      <UserHeaderMenu />
      <Routes location={location} key={location.pathname}>
        <Route path="/Ordering" element={<Ordering2 />} />
        <Route path="/CustomerNews" element={<CustomerNews />} />
        <Route path="/CustomerBilling" element={<CustomerBilling />} />
        <Route path="/CustomerSettings" element={<CustomerSettings />} />
        <Route path="/CustomerProducts" element={<CustomerProducts />} />
        {authClass !== "customer" && (
          <React.Fragment>
            <Route path="/Production/BPBNBaker1" element={<BPBNBaker1 />} />
            <Route path="/Production/BPBNBaker2" element={<BPBNBaker2 />} />
            <Route path="/Production/Production" element={<Production />} />
            <Route path="/Production/WhoBake" element={<WhoBake />} />
            <Route path="/Production/WhoShape" element={<WhoShape />} />
            <Route path="/Production/BPBNSetout" element={<BPBNSetout />} />
            <Route path="/Products" element={<Products />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/Billing" element={<Billing />} />
            <Route path="/EODCounts" element={<EODCounts />} />
            <Route path="/Logistics" element={<Logistics />} />
            <Route path="/Logistics/ByRoute" element={<ByRoute />} />
            <Route path="/Locations" element={<Locations />} />
            <Route
              path="/Settings/ManageCustomers"
              element={<ManageCustomers />}
            />
            <Route
              path="/Settings/ManageTrainings"
              element={<ManageTraining />}
            />
            <Route
              path="/Settings/custProds"
              element={<CustProds />}
            />
          </React.Fragment>
        )}

        <Route path="/" element={<NavSide />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;




