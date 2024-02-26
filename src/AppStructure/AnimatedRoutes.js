import React, { Suspense, lazy, useEffect } from "react";
import TopNav from "./Auth/TopNav";
import { NavSide } from "./Nav";
import { AnimatePresence } from "framer-motion";
import { useSettingsStore } from "../Contexts/SettingsZustand";
import { Routes, Route, useLocation } from "react-router-dom";

// import Ordering from "../Pages/Ordering/Ordering";
import { CustomerProducts } from "../Pages/CustomerProducts/CustomerProducts";

import { useUser2sByEmail } from "../data/user2/useUser2s";

import { UserHeaderMenu } from "./UserHeaderMenu";
// import { useUserDetails } from "../data/users";

import Ordering2 from "../Pages/Ordering/Ordering2";
import CustomerNews from "../Pages/CustomerNews/CustomerNews";
import CustomerBilling from "../Pages/CustomerBilling/CustomerBilling";
import CustomerSettings from "../Pages/CustomerSettings/CustomerSettings";

// Load simultaneously:
// import OrdersPage from "../Pages/Ordering/v2/Ordering"; // group with lazy loaders while in testing
// import BPBNBaker1 from "../Pages/Production/BPBNBaker1";
// import BPBNBaker1Backup from "../Pages/Production/BPBNBaker1Backup";
// import BPBNBaker2 from "../Pages/Production/BPBNBaker2";
// import WhoBake from "../Pages/Production/WhoBake";
// import WhoShape from "../Pages/Production/WhoShape";
// import BPBNSetOut, { default as SetOutV1 } from "../Pages/Production/BPBNSetout";
// import Production from "../Pages/Production/Production";
// import ProductsV1 from "../Pages/Products/Products";
// import { default as BillingV1} from "../Pages/Billing/Billing";
// import BillingV2 from "../Pages/Billing/v2/Billing";
// import EODCounts from "../Pages/EODCounts/EODCounts";
// import Logistics from "../Pages/Logistics/Logistics";
// import ByRoute from "../Pages/Logistics/ByRoute/ByRoute";
// import Locations from "../Pages/Locations/Locations";
// import LocationsNew from "../Pages/Locations/NewPage/Locations";
// import ManageCustomers from "../Pages/Settings/ManageCustomers/ManageCustomers";
// import ManageTraining from "../Pages/Settings/ManageTraining/ManageTraining";
// import { default as CustProds } from "../Pages/Settings/custProds/custProds";
// import LocationProductOverrides from "../Pages/Settings/custProds/v2/LocationProductOverrides";

// import { default as BPBSWhatToMakeV1 } from "../Pages/Production/BPBSWhatToMake";
// import BPBSWhatToMakeBackup from "../Pages/Production/BPBSWhatToMakeBackup";
// import BPBSMixPocket from "../Pages/Production/BPBSMixPocket";
// import CroixCountV1 from "../Pages/Production/CroixCount";
// import CroixToMake from "../Pages/Production/CroixToMake";
// import BPBNBuckets from "../Pages/Production/BPBNBuckets";
// import ByProduct from "../Pages/Logistics/ByProduct/ByProduct";
// import NorthList from "../Pages/Logistics/NorthLists";
// import NorthListV2 from "../Pages/Logistics/NorthLists/v2/NorthLists"
// import AMPastry from "../Pages/Logistics/AMPastry";
// import RetailBags from "../Pages/Logistics/RetailBags";
// import { default as SpecialOrdersV1} from "../Pages/Logistics/SpecialOrders";
// import FreezerThaw from "../Pages/Logistics/FreezerThaw";
// import DelivOrder from "../Pages/Settings/delivOrder/delivOrder";
// import EditDoughs from "../Pages/Settings/editDough/editDough";
// import EditZones2 from "../Pages/Settings/editZones/editZones2";
// import EditRoutes from "../Pages/Settings/editRoutes/editRoutes";
// import { default as NotesV2} from "../Pages/Settings/notes/Notes2";
// import { default as NotesV3 } from "../Pages/Settings/notes/v3/Notes";
// import Settings from "../Pages/Settings/Settings";
// import Remap from "../Pages/EODCounts/EODCountsRempas";
// import SpecialPacking from "../Pages/Production/NewPages/BPBS/SpecialPacking/SpecialPacking";
// import RouteGrid from "../Pages/Logistics/NewPages/RouteGrid/RouteGrid";
// import BPBSWhatToMake from "../Pages/Production/NewPages/BPBS/WhatToMake/WhatToMake";
// import CroixCount from "../Pages/Production/NewPages/Croix/CroixEOD/CroixCount";
// import SpecialOrders from "../Pages/Logistics/NewPages/SpecialOrders/SpecialOrders";
// import Products from "../Pages/Products/NewPage/Products";
// import Bpbn1 from "../Pages/Production/NewPages/BPBN/Baker1/BpbnBaker1";
// import Bpbn2 from "../Pages/Production/NewPages/BPBN/Baker2/BpbnBaker2";
// import BPBNSetout from "../Pages/Production/NewPages/Setout/BPBNSetout";
// import BPBSSetout from "../Pages/Production/NewPages/Setout/BPBSSetout";
// import BpbnBuckets from "../Pages/Production/NewPages/BPBN/Buckets/BpbnBuckets";

// Lazy Load:
const BPBNBaker1 = React.lazy(() => import('../Pages/Production/BPBNBaker1'))
const BPBNBaker1Backup = React.lazy(() => import('../Pages/Production/BPBNBaker1Backup')) 
const BPBNBaker2 = React.lazy(() => import('../Pages/Production/BPBNBaker2'))
const BPBNBuckets = React.lazy(() => import('../Pages/Production/BPBNBuckets'))
const SetOutV1 = React.lazy(() => import('../Pages/Production/BPBNSetout'))
const BPBNSetout = React.lazy(() => import('../Pages/Production/NewPages/Setout/BPBNSetout'))
const BPBSSetout = React.lazy(() => import('../Pages/Production/NewPages/Setout/BPBSSetout'))
const BpbnBuckets = React.lazy(() => import('../Pages/Production/NewPages/BPBN/Buckets/BpbnBuckets'))

const Bpbn1 = React.lazy(() => import('../Pages/Production/NewPages/BPBN/Baker1/BpbnBaker1'))
const Bpbn2 = React.lazy(() => import('../Pages/Production/NewPages/BPBN/Baker2/BpbnBaker2'))

const BPBSWhatToMakeV1 = React.lazy(() => import('../Pages/Production/BPBSWhatToMake'))
const BPBSMixPocket = React.lazy(() => import('../Pages/Production/BPBSMixPocket'))
const SpecialPacking = React.lazy(() => import('../Pages/Production/NewPages/BPBS/SpecialPacking/SpecialPacking'))

const WhoBake = React.lazy(() => import('../Pages/Production/WhoBake'))
const WhoShape = React.lazy(() => import('../Pages/Production/WhoShape'))

const EODCounts = React.lazy(() => import('../Pages/EODCounts/EODCounts'))

const Logistics = React.lazy(() => import('../Pages/Logistics/Logistics'))
const RetailBags = React.lazy(() => import('../Pages/Logistics/RetailBags'))
const SpecialOrdersV1 = React.lazy(() => import('../Pages/Logistics/SpecialOrders'))
const FreezerThaw = React.lazy(() => import('../Pages/Logistics/FreezerThaw'))

const RouteGrid = React.lazy(() => import('../Pages/Logistics/NewPages/RouteGrid/RouteGrid'))
const ByRoute = React.lazy(() => import('../Pages/Logistics/ByRoute/ByRoute'))
const ByProduct = React.lazy(() => import('../Pages/Logistics/ByProduct/ByProduct'))
const NorthList = React.lazy(() => import('../Pages/Logistics/NorthLists'))
const NorthListV2 = React.lazy(() => import('../Pages/Logistics/NorthLists/v2/NorthLists'))
const AMPastry = React.lazy(() => import('../Pages/Logistics/AMPastry'))
const SpecialOrders = React.lazy(() => import('../Pages/Logistics/NewPages/SpecialOrders/SpecialOrders'))

const Locations = React.lazy(() => import('../Pages/Locations/Locations'))
const LocationsNew = React.lazy(() => import('../Pages/Locations/NewPage/Locations'))
const Products = React.lazy(() => import('../Pages/Products/NewPage/Products'))
const ProductsV1 = React.lazy(() => import('../Pages/Products/Products'))

const ManageCustomers = React.lazy(() => import('../Pages/Settings/ManageCustomers/ManageCustomers'))
const ManageTraining = React.lazy(() => import('../Pages/Settings/ManageTraining/ManageTraining'))
const DelivOrder = React.lazy(() => import('../Pages/Settings/delivOrder/delivOrder'))
const EditDoughs = React.lazy(() => import('../Pages/Settings/editDough/editDough'))
const EditZones2 = React.lazy(() => import('../Pages/Settings/editZones/editZones2'))
const EditRoutes = React.lazy(() => import('../Pages/Settings/editRoutes/editRoutes'))
const NotesV2 = React.lazy(() => import('../Pages/Settings/notes/Notes2'))
const NotesV3 = React.lazy(() => import('../Pages/Settings/notes/v3/Notes'))

const Remap = React.lazy(() => import('../Pages/EODCounts/EODCountsRempas'))
const Settings = React.lazy(() => import('../Pages/Settings/Settings'))
const CustProds = React.lazy(() => import('../Pages/Settings/custProds/custProds'))
const LocationProductOverrides = React.lazy(() => import('../Pages/Settings/custProds/v2/LocationProductOverrides'))

const BPBSWhatToMake = React.lazy(() => import('../Pages/Production/NewPages/BPBS/WhatToMake/WhatToMake'))
const BPBSWhatToMakeBackup = React.lazy(() => import('../Pages/Production/BPBSWhatToMakeBackup'))

const Production = React.lazy(() => import('../Pages/Production/Production'))
const CroixToMake = React.lazy(() => import('../Pages/Production/CroixToMake'))
const CroixCount = React.lazy(() => import('../Pages/Production/NewPages/Croix/CroixEOD/CroixCount'))
const CroixCountV1 = React.lazy(() => import('../Pages/Production/CroixCount'))

const BillingV1 = React.lazy(() => import('../Pages/Billing/Billing'))
const BillingV2 = React.lazy(() => import('../Pages/Billing/v2/Billing'))

const OrdersPage = React.lazy(() => import('../Pages/Ordering/v2/Ordering'))


function AnimatedRoutes({ user, signOut }) {
  const setFormType = useSettingsStore((state) => state.setFormType);
  const setAuthClass = useSettingsStore((state) => state.setAuthClass);
  const setAccess = useSettingsStore((state) => state.setAccess);
  const setUser = useSettingsStore((state) => state.setUser);
  const setUserObject = useSettingsStore((state) => state.setUserObject);
  const setCurrentLoc = useSettingsStore((state) => state.setCurrentLoc);

  const authClass = useSettingsStore((state) => state.authClass);
  const currentLoc = useSettingsStore((state) => state.currentLoc);

  const { data: user2Items } = 
    useUser2sByEmail({ shouldFetch: true, email: user.attributes.email })

  // console.log("user2Items", user2Items)

  useEffect(() => {
    if (!user2Items) return 
    const matchUser = 
      user2Items.find(item => item.username == user.username) ?? user2Items[0]

    if (!!matchUser) {
      const adjustedAttributes = !!matchUser
        ? {
            ["custom:name"]: matchUser.name,
            ["custom:authType"]: matchUser.authClass,
            ["custom:defLoc"]: matchUser.locNick,
            username: matchUser.username,
          }
        : {}
      
      const adjustedUser = { ...user, ...adjustedAttributes }
      console.log("adjustedUser", adjustedUser)
      setUserObject(adjustedUser)
      setAccess(user.signInUserSession.accessToken.jwtToken)
      setFormType(!!user ? "signedIn" : "onNoUser")
        
      setUser(matchUser.name)
      !authClass && setAuthClass(matchUser.authClass)
      !currentLoc && setCurrentLoc(matchUser.locNick)
    }

  }, [user2Items])

  const location = useLocation();

  return (
    <AnimatePresence>
      <React.Fragment>
      <UserHeaderMenu signOut={signOut} />
      {(authClass === 'bpbfull' || authClass === 'bpbcrew') && 
        <div className="top-nav-container">
          <TopNav />
        </div>
      }
      <Suspense fallback={<div>Loading...</div>}>
      <Routes location={location} key={location.pathname}>
        <Route path="/Ordering" element={<Ordering2 />} />
        <Route path="/Ordering/v2" element={<OrdersPage />} />
        <Route path="/CustomerNews" element={<CustomerNews />} />
        <Route path="/CustomerBilling" element={<CustomerBilling />} />
        <Route path="/CustomerSettings" element={<CustomerSettings />} />
        <Route path="/CustomerProducts" element={<CustomerProducts />} />
        <Route path="/remap" element={<Remap />} />
        {/* {authClass !== "customer" && */}
        {(authClass === 'bpbfull' || authClass === 'bpbcrew') &&
          <React.Fragment>
            {/* <Route path="/Ordering/v2" element={<OrdersPage />} /> */}
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
            <Route path="/Logistics/NorthLists/v2" element={<NorthListV2 />} />
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
            <Route 
              path="/Settings/custProds/v2" 
              element={<LocationProductOverrides />} 
            />
            <Route path="/Settings/DelivOrder" element={<DelivOrder />} />
            <Route path="/Settings/editDough" element={<EditDoughs />} />
            <Route path="/Settings/editRoutes" element={<EditRoutes />} />
            <Route path="/Settings/editZones" element={<EditZones2 />} />
            <Route path="/Settings/Notes" element={<NotesV3 />} />
            <Route path="/Settings/Notes/v3" element={<NotesV3 />} />
            <Route path="/Settings/Notes/v2" element={<NotesV2 />} />
          
          </React.Fragment>
        }

        <Route path="/" element={<NavSide />} />
      </Routes>
      </Suspense>
      </React.Fragment>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
