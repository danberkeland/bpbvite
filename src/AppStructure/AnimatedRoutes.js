import React from "react";

// import Ordering from "../Pages/Ordering/Ordering";
import Ordering2 from "../Pages/Ordering/Ordering2";
import CustomerNews from "../Pages/CustomerNews/CustomerNews";
import CustomerBilling from "../Pages/CustomerBilling/CustomerBilling";
import CustomerSettings from "../Pages/CustomerSettings/CustomerSettings";
import { CustomerProducts } from "../Pages/CustomerProducts/CustomerProducts";
import BPBNBaker1 from "../Pages/Production/BPBNBaker1";
import BPBNBaker1Backup from "../Pages/Production/BPBNBaker1Backup";
import BPBNBaker2 from "../Pages/Production/BPBNBaker2";
import WhoBake from "../Pages/Production/WhoBake";
import WhoShape from "../Pages/Production/WhoShape";
import BPBNSetOut from "../Pages/Production/BPBNSetout";
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
import BPBSWhatToMake from "../Pages/Production/BPBSWhatToMake";
import BPBSWhatToMakeBackup from "../Pages/Production/BPBSWhatToMakeBackup";
import BPBSMixPocket from "../Pages/Production/BPBSMixPocket";
import CroixCount from "../Pages/Production/CroixCount";
import CroixToMake from "../Pages/Production/CroixToMake";
import BPBNBuckets from "../Pages/Production/BPBNBuckets";
import ByProduct from "../Pages/Logistics/ByProduct/ByProduct";
import NorthList from "../Pages/Logistics/NorthLists";
import AMPastry from "../Pages/Logistics/AMPastry";
import RetailBags from "../Pages/Logistics/RetailBags";
import SpecialOrders from "../Pages/Logistics/SpecialOrders";
import FreezerThaw from "../Pages/Logistics/FreezerThaw";
import DelivOrder from "../Pages/Settings/delivOrder/delivOrder";
import EditDoughs from "../Pages/Settings/editDough/editDough";
import EditZones2 from "../Pages/Settings/editZones/editZones2";
import EditRoutes from "../Pages/Settings/editRoutes/editRoutes";
import Notes2 from "../Pages/Settings/notes/Notes2";
import Remap from "../Pages/EODCounts/EODCountsRempas";
import TopNav from "./Auth/TopNav";
import { SpecialPacking } from "../Pages/Production/NewPages/SpecialPacking";

function AnimatedRoutes({ Routes, Route, useLocation }) {
  const authClass = useSettingsStore((state) => state.authClass);
  const location = useLocation();

  return (
    <AnimatePresence>
      <UserHeaderMenu />
      {authClass !== "customer" && <TopNav />}
      <Routes location={location} key={location.pathname}>
        <Route path="/Ordering" element={<Ordering2 />} />
        <Route path="/CustomerNews" element={<CustomerNews />} />
        <Route path="/CustomerBilling" element={<CustomerBilling />} />
        <Route path="/CustomerSettings" element={<CustomerSettings />} />
        <Route path="/CustomerProducts" element={<CustomerProducts />} />
        <Route path="/remap" element={<Remap />} />
        {authClass !== "customer" && (
          <React.Fragment>
            <Route path="/Production/BPBNBaker1" element={<BPBNBaker1 />} />
            <Route path="/BPBNProd/BPBNBaker1Backup" element={<BPBNBaker1Backup />} />
            <Route path="/Production/BPBNBaker2" element={<BPBNBaker2 />} />
            <Route path="/Production/Production" element={<Production />} />
            <Route path="/Production/WhoBake" element={<WhoBake />} />
            <Route path="/Production/WhoShape" element={<WhoShape />} />
            <Route
              path="/Production/BPBNBuckets"
              element={<BPBNBuckets loc={"Carlton"} />}
            />
            <Route
              path="/Production/BPBSBuckets"
              element={<BPBNBuckets loc={"Prado"} />}
            />
            <Route
              path="/Production/BPBNSetOut"
              element={<BPBNSetOut loc={"Carlton"} />}
            />
            <Route
              path="/Production/BPBSSetOut"
              element={<BPBNSetOut loc={"Prado"} />}
            />
            <Route
              path="/Production/BPBSWhatToMake"
              element={<BPBSWhatToMake />}
            />
            <Route
              path="/BPBSProd/BPBSWhatToMakeBackup"
              element={<BPBSWhatToMakeBackup />}
            />
            <Route
              path="/Production/BPBSMixPocket"
              element={<BPBSMixPocket />}
            />
            <Route
              path="/Production/BPBSPacking"
              element={<SpecialPacking />}
            />
            <Route path="/Production/CroixCount" element={<CroixCount />} />
            <Route path="/Production/CroixToMake" element={<CroixToMake />} />
            <Route path="/Products" element={<Products />} />
            <Route path="/Settings" element={<Settings />} />

            <Route path="/Billing" element={<Billing />} />
            <Route path="/EODCounts" element={<EODCounts />} />
            <Route path="/Logistics" element={<Logistics />} />
            <Route path="/Logistics/ByRoute" element={<ByRoute />} />
            <Route path="/Logistics/ByProduct" element={<ByProduct />} />
            <Route path="/Logistics/NorthLists" element={<NorthList />} />
            <Route path="/Logistics/AMPastry" element={<AMPastry />} />
            <Route path="/Logistics/RetailBags" element={<RetailBags />} />
            <Route
              path="/Logistics/SpecialOrders"
              element={<SpecialOrders />}
            />
            <Route path="/Logistics/FreezerThaw" element={<FreezerThaw />} />
            <Route path="/Locations" element={<Locations />} />
            <Route
              path="/Settings/ManageCustomers"
              element={<ManageCustomers />}
            />
            <Route
              path="/Settings/ManageTrainings"
              element={<ManageTraining />}
            />
            <Route path="/Settings/custProds" element={<CustProds />} />
            <Route path="/Settings/DelivOrder" element={<DelivOrder />} />
            <Route path="/Settings/editDough" element={<EditDoughs />} />
            <Route path="/Settings/editRoutes" element={<EditRoutes />} />
            <Route path="/Settings/editZones" element={<EditZones2 />} />
            <Route path="/Settings/Notes" element={<Notes2 />} />
          </React.Fragment>
        )}

        <Route path="/" element={<NavSide />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
