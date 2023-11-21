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
import BPBNSetOut, { default as SetOutV1 } from "../Pages/Production/BPBNSetout";
import Production from "../Pages/Production/Production";
import { default as ProductsV1 } from "../Pages/Products/Products";
import Settings from "../Pages/Settings/Settings";
import { default as BillingV1} from "../Pages/Billing/Billing";
import { Billing as BillingV2 } from "../Pages/Billing/v2/Billing";
import EODCounts from "../Pages/EODCounts/EODCounts";
import Logistics from "../Pages/Logistics/Logistics";
import ByRoute from "../Pages/Logistics/ByRoute/ByRoute";
import Locations from "../Pages/Locations/Locations";
import { Locations as LocationsNew } from "../Pages/Locations/NewPage/Locations";
import ManageCustomers from "../Pages/Settings/ManageCustomers/ManageCustomers";
import ManageTraining from "../Pages/Settings/ManageTraining/ManageTraining";
import CustProds from "../Pages/Settings/custProds/custProds";
import { NavSide } from "./Nav";

import { AnimatePresence } from "framer-motion";
import { useSettingsStore } from "../Contexts/SettingsZustand";
import { UserHeaderMenu } from "./UserHeaderMenu";
import { default as BPBSWhatToMakeV1 } from "../Pages/Production/BPBSWhatToMake";
import BPBSWhatToMakeBackup from "../Pages/Production/BPBSWhatToMakeBackup";
import BPBSMixPocket from "../Pages/Production/BPBSMixPocket";
import { default as CroixCountV1 } from "../Pages/Production/CroixCount";
import CroixToMake from "../Pages/Production/CroixToMake";
import BPBNBuckets from "../Pages/Production/BPBNBuckets";
import ByProduct from "../Pages/Logistics/ByProduct/ByProduct";
import NorthList from "../Pages/Logistics/NorthLists";
import AMPastry from "../Pages/Logistics/AMPastry";
import RetailBags from "../Pages/Logistics/RetailBags";
import { default as SpecialOrdersV1} from "../Pages/Logistics/SpecialOrders";
import FreezerThaw from "../Pages/Logistics/FreezerThaw";
import DelivOrder from "../Pages/Settings/delivOrder/delivOrder";
import EditDoughs from "../Pages/Settings/editDough/editDough";
import EditZones2 from "../Pages/Settings/editZones/editZones2";
import EditRoutes from "../Pages/Settings/editRoutes/editRoutes";
import { default as NotesV2} from "../Pages/Settings/notes/Notes2";
import { Notes as NotesV3 } from "../Pages/Settings/notes/v3/Notes";
import Remap from "../Pages/EODCounts/EODCountsRempas";
import TopNav from "./Auth/TopNav";
import { SpecialPacking } from "../Pages/Production/NewPages/BPBS/SpecialPacking/SpecialPacking";
import { RouteGrid } from "../Pages/Logistics/NewPages/RouteGrid/RouteGrid";
import { BPBSWhatToMake } from "../Pages/Production/NewPages/BPBS/WhatToMake/WhatToMake";
import { CroixCount } from "../Pages/Production/NewPages/Croix/CroixEOD/CroixCount";
import { SpecialOrders } from "../Pages/Logistics/NewPages/SpecialOrders/SpecialOrders";
import { Products } from "../Pages/Products/NewPage/Products";
import { Bpbn1 } from "../Pages/Production/NewPages/BPBN/Baker1/BpbnBaker1";
import { Bpbn2 } from "../Pages/Production/NewPages/BPBN/Baker2/BpbnBaker2";
import { BPBNSetout, BPBSSetout } from "../Pages/Production/NewPages/Setout/Setout";
import { BpbnBuckets } from "../Pages/Production/NewPages/BPBN/Buckets/BpbnBuckets";



function AnimatedRoutes({ Routes, Route, useLocation }) {
  const authClass = useSettingsStore((state) => state.authClass);
  const location = useLocation();

  return (
    <AnimatePresence>
      <React.Fragment>
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
            <Route path="/Production/BPBNBaker1" element={<Bpbn1 />} />
            <Route path="/Production/BPBNBaker1/v2" element={<Bpbn1 />} />
            <Route path="/Production/BPBNBaker1/v1" element={<BPBNBaker1 />} />

            <Route path="/BPBNProd/BPBNBaker1Backup" 
              element={<Bpbn1 initialDateOption="tomorrow" />}
            />
            <Route path="/BPBNProd/BPBNBaker1Backup/v1" element={<BPBNBaker1Backup />} />

            <Route path="/Production/BPBNBaker2" element={<Bpbn2 />} />
            <Route path="/Production/BPBNBaker2/v2" element={<Bpbn2 />} />
            <Route path="/Production/BPBNBaker2/v1" element={<BPBNBaker2 />} />

            <Route path="/Production/Production" element={<Production />} />
            <Route path="/Production/WhoBake" element={<WhoBake />} />
            <Route path="/Production/WhoShape" element={<WhoShape />} />
            <Route
              path="/Production/BPBNBuckets"
              element={<BPBNBuckets loc={"Carlton"} />}
            />
            <Route path="/Production/BPBNBuckets/v2" element={<BpbnBuckets />} />
            <Route
              path="/Production/BPBSBuckets"
              element={<BPBNBuckets loc={"Prado"} />}
            />
            <Route path="/Production/BPBNSetOut" element={<BPBNSetout />} />
            <Route path="/Production/BPBNSetOut/v2" element={<BPBNSetout />} />
            <Route path="/Production/BPBNSetOut/v1" element={<SetOutV1 loc={"Carlton"} />} />

            <Route path="/Production/BPBSSetOut" element={<BPBSSetout />} />
            <Route path="/Production/BPBSSetOut/v2" element={<BPBSSetout />} />
            <Route path="/Production/BPBSSetOut/v1" element={<SetOutV1 loc={"Prado"} />} />

            <Route path="/Production/BPBSWhatToMake" element={<BPBSWhatToMake />} />
            <Route path="/Production/BPBSWhatToMake/v2" element={<BPBSWhatToMake />} />
            <Route path="/Production/BPBSWhatToMake/v1" element={<BPBSWhatToMakeV1 />} />

            <Route path="/BPBSProd/BPBSWhatToMakeBackup"
              element={<BPBSWhatToMake initialDateOption="tomorrow" />}
            />
            <Route path="/BPBSProd/BPBSWhatToMakeBackup/v2"
              element={<BPBSWhatToMake initialDateOption="tomorrow" />}
            />
            <Route path="/BPBSProd/BPBSWhatToMakeBackup/v1"
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

            <Route path="/Production/CroixCount" element={<CroixCountV1 />} />
            <Route path="/Production/CroixCount/v2" element={<CroixCount />} />
            <Route path="/Production/CroixCount/v1" element={<CroixCountV1 />} />
            
            <Route path="/Production/CroixToMake" element={<CroixToMake />} />
            <Route path="/Settings" element={<Settings />} />

            <Route path="/Billing" element={<BillingV1 />} />
            <Route path="/Billing/v2" element={<BillingV2 />} />
            <Route path="/Billing/v1" element={<BillingV1 />} />

            <Route path="/EODCounts" element={<EODCounts />} />
            <Route path="/Logistics" element={<Logistics />} />

            <Route path="/Logistics/ByRoute" element={<RouteGrid />} />
            <Route path="/Logistics/ByRoute/v2" element={<RouteGrid />} />
            <Route path="/Logistics/ByRoute/v1" element={<ByRoute />} />

            <Route path="/Logistics/ByProduct" element={<ByProduct />} />
            <Route path="/Logistics/NorthLists" element={<NorthList />} />
            <Route path="/Logistics/AMPastry" element={<AMPastry />} />
            <Route path="/Logistics/RetailBags" element={<RetailBags />} />

            <Route path="/Logistics/SpecialOrders" element={<SpecialOrders />} />
            <Route path="/Logistics/SpecialOrders/v2" element={<SpecialOrders />} />
            <Route path="/Logistics/SpecialOrders/v1" element={<SpecialOrdersV1 />} />

            <Route path="/Logistics/FreezerThaw" element={<FreezerThaw />} />
            <Route path="/Locations" element={<LocationsNew />} />
            <Route path="/Locations/v2" element={<LocationsNew />} />
            <Route path="/Locations/v1" element={<Locations />} />

            <Route path="/Products" element={<Products />} />
            <Route path="/Products/v2" element={<Products />} />
            <Route path="/Products/v1" element={<ProductsV1 />} />

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
            <Route path="/Settings/Notes" element={<NotesV3 />} />
            <Route path="/Settings/Notes/v3" element={<NotesV3 />} />
            <Route path="/Settings/Notes/v2" element={<NotesV2 />} />
          </React.Fragment>
        )}

        <Route path="/" element={<NavSide />} />
      </Routes>
      </React.Fragment>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
