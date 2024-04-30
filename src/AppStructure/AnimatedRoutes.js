import React, { Suspense, lazy, useEffect } from "react";
import TopNav from "./TopNav";
import { NavSide } from "./Nav";
import { AnimatePresence } from "framer-motion";
import { useSettingsStore } from "../Contexts/SettingsZustand";
import { Routes, Route, useLocation } from "react-router-dom"; 

// import Ordering from "../Pages/Ordering/Ordering";
import { CustomerProducts } from "../Pages/CustomerProducts/CustomerProducts";

import { useUser2sByEmail } from "../data/user2/useUser2s";

import { UserHeaderMenu } from "./UserHeaderMenu";

import Ordering2 from "../Pages/Ordering/Ordering2";
import CustomerNews from "../Pages/CustomerNews/CustomerNews";
import CustomerBilling from "../Pages/CustomerBilling/CustomerBilling";
import CustomerSettings from "../Pages/CustomerSettings/CustomerSettings";


// Load simultaneously:
import{ default as SetoutV3 } from "../Pages/Production/PageSetout";

import Baker1 from "../Pages/Production/PageBPBNBaker1";
import Baker2 from "../Pages/Production/PageBPBNBaker2";
import { default as PageBuckets } from "../Pages/Production/PageBuckets";
import Production from "../Pages/Production/PageProduction";

import OrdersPage from "../Pages/Ordering/v2/Ordering"; // group with lazy loaders while in testing
import ProductsV1 from "../Pages/Products/Products";
import { default as BillingV1 } from "../Pages/Billing/Billing";
import BillingV2 from "../Pages/Billing/v2/Billing";
import EODCounts from "../Pages/EODCounts/EODCounts";
import Locations from "../Pages/Locations/Locations";
import LocationsNew from "../Pages/Locations/NewPage/Locations";
import ManageCustomers from "../Pages/Settings/ManageCustomers/ManageCustomers";
import ManageTraining from "../Pages/Settings/ManageTraining/ManageTraining";
import { default as CustProds } from "../Pages/Settings/custProds/custProds";
import LocationProductOverrides from "../Pages/Settings/custProds/v2/LocationProductOverrides";

import { default as WhatToMakeV3 } from "../Pages/Production/PageBPBSWhatToMake";

import BPBSMixPocket from "../Pages/Production/Legacy/BPBSMixPocket";
import MixPocket from "../Pages/Production/PageBPBSMixPocket";

import Logistics from "../Pages/Logistics/Logistics"; 
import PageRouteGrid from "../Pages/Logistics/PageRouteGrid";
import NorthListV2 from "../Pages/Logistics/PageNorthLists"
import PageAMPastry from "../Pages/Logistics/PageAMPastry";
import PageFreezerThaw from "../Pages/Logistics/PageFreezerThaw";
import PageRetailBags from "../Pages/Logistics/PageRetailBags";
import PageSpecialOrders from "../Pages/Logistics/PageSpecialOrders";

import DelivOrder from "../Pages/Settings/delivOrder/delivOrder";
import EditDoughs from "../Pages/Settings/editDough/editDough";
import EditZones2 from "../Pages/Settings/editZones/editZones2";
import EditRoutes from "../Pages/Settings/editRoutes/editRoutes";
import { default as PageNotes } from "../Pages/Settings/PageNotes";
import Settings from "../Pages/Settings/Settings";

import Remap from "../Pages/EODCounts/EODCountsRempas";
import Products from "../Pages/Products/NewPage/Products";
import PageSpecialPacking from "../Pages/Production/PageSpecialPacking";
import { PageCroissantProduction } from "../Pages/Production/PageCroissantProduction";
import PageCroissantEodCounts from "../Pages/Production/PageCroissantEodCounts";
import PageOrderDashboard from "../Pages/Logistics/PageOrderDashboard";

// Lazy Load:

// const BPBNBaker1 = React.lazy(() => import('../Pages/Production/BPBNBaker1'))
// const BPBNBaker1Backup = React.lazy(() => import('../Pages/Production/BPBNBaker1Backup')) 
// const BPBNBaker2 = React.lazy(() => import('../Pages/Production/BPBNBaker2'))
// const BPBNBuckets = React.lazy(() => import('../Pages/Production/BPBNBuckets'))
// const SetOutV1 = React.lazy(() => import('../Pages/Production/BPBNSetout'))
// const BPBNSetout = React.lazy(() => import('../Pages/Production/NewPages/Setout/BPBNSetout'))
// const BPBSSetout = React.lazy(() => import('../Pages/Production/NewPages/Setout/BPBSSetout'))
// const BpbnBuckets = React.lazy(() => import('../Pages/Production/NewPages/BPBN/Buckets/BpbnBuckets'))

// const Bpbn1 = React.lazy(() => import('../Pages/Production/NewPages/BPBN/Baker1/BpbnBaker1'))
// const Bpbn2 = React.lazy(() => import('../Pages/Production/NewPages/BPBN/Baker2/BpbnBaker2'))

// const BPBSWhatToMakeV1 = React.lazy(() => import('../Pages/Production/BPBSWhatToMake'))
// const BPBSMixPocket = React.lazy(() => import('../Pages/Production/BPBSMixPocket'))
// const SpecialPacking = React.lazy(() => import('../Pages/Production/NewPages/BPBS/SpecialPacking/SpecialPacking'))

// const WhoBake = React.lazy(() => import('../Pages/Production/WhoBake'))
// const WhoShape = React.lazy(() => import('../Pages/Production/WhoShape'))

// const EODCounts = React.lazy(() => import('../Pages/EODCounts/EODCounts'))

// const Logistics = React.lazy(() => import('../Pages/Logistics/Logistics'))
// const RetailBags = React.lazy(() => import('../Pages/Logistics/RetailBags'))
// const SpecialOrdersV1 = React.lazy(() => import('../Pages/Logistics/SpecialOrders'))
// const FreezerThaw = React.lazy(() => import('../Pages/Logistics/FreezerThaw'))

// const RouteGrid = React.lazy(() => import('../Pages/Logistics/NewPages/RouteGrid/RouteGrid'))
// const ByRoute = React.lazy(() => import('../Pages/Logistics/ByRoute/ByRoute'))
// const ByProduct = React.lazy(() => import('../Pages/Logistics/ByProduct/ByProduct'))
// const NorthList = React.lazy(() => import('../Pages/Logistics/NorthLists'))
// const NorthListV2 = React.lazy(() => import('../Pages/Logistics/NorthLists/v2/NorthLists'))
// const AMPastry = React.lazy(() => import('../Pages/Logistics/AMPastry'))
// const SpecialOrders = React.lazy(() => import('../Pages/Logistics/NewPages/SpecialOrders/SpecialOrders'))

// const Locations = React.lazy(() => import('../Pages/Locations/Locations'))
// const LocationsNew = React.lazy(() => import('../Pages/Locations/NewPage/Locations'))
// const Products = React.lazy(() => import('../Pages/Products/NewPage/Products'))
// const ProductsV1 = React.lazy(() => import('../Pages/Products/Products'))

// const ManageCustomers = React.lazy(() => import('../Pages/Settings/ManageCustomers/ManageCustomers'))
// const ManageTraining = React.lazy(() => import('../Pages/Settings/ManageTraining/ManageTraining'))
// const DelivOrder = React.lazy(() => import('../Pages/Settings/delivOrder/delivOrder'))
// const EditDoughs = React.lazy(() => import('../Pages/Settings/editDough/editDough'))
// const EditZones2 = React.lazy(() => import('../Pages/Settings/editZones/editZones2'))
// const EditRoutes = React.lazy(() => import('../Pages/Settings/editRoutes/editRoutes'))
// const NotesV2 = React.lazy(() => import('../Pages/Settings/notes/Notes2'))
// const NotesV3 = React.lazy(() => import('../Pages/Settings/notes/v3/Notes'))

// const Remap = React.lazy(() => import('../Pages/EODCounts/EODCountsRempas'))
// const Settings = React.lazy(() => import('../Pages/Settings/Settings'))
// const CustProds = React.lazy(() => import('../Pages/Settings/custProds/custProds'))
// const LocationProductOverrides = React.lazy(() => import('../Pages/Settings/custProds/v2/LocationProductOverrides'))

// const BPBSWhatToMake = React.lazy(() => import('../Pages/Production/NewPages/BPBS/WhatToMake/WhatToMake'))
// const BPBSWhatToMakeBackup = React.lazy(() => import('../Pages/Production/BPBSWhatToMakeBackup'))

// const Production = React.lazy(() => import('../Pages/Production/Production'))
// const CroixToMake = React.lazy(() => import('../Pages/Production/CroixToMake'))
// const CroixCount = React.lazy(() => import('../Pages/Production/NewPages/Croix/CroixEOD/CroixCount'))
// const CroixCountV1 = React.lazy(() => import('../Pages/Production/CroixCount'))

// const BillingV1 = React.lazy(() => import('../Pages/Billing/Billing'))
// const BillingV2 = React.lazy(() => import('../Pages/Billing/v2/Billing'))

// const OrdersPage = React.lazy(() => import('../Pages/Ordering/v2/Ordering'))


function AnimatedRoutes({ user, signOut }) {
  const setFormType   = useSettingsStore((state) => state.setFormType);
  const setAuthClass  = useSettingsStore((state) => state.setAuthClass);
  const setAccess     = useSettingsStore((state) => state.setAccess);
  const setUser       = useSettingsStore((state) => state.setUser);
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
      user2Items.find(item => item.username === user.username) ?? user2Items[0]

    if (!!matchUser) {
      const adjustedAttributes = !!matchUser
        ? {
            "custom:name":     matchUser.name,
            "custom:authType": matchUser.authClass,
            "custom:defLoc":   matchUser.locNick,
            "username":        matchUser.username,
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

  }, [user2Items, user, authClass, currentLoc])

  const location = useLocation();

  return (
    <AnimatePresence><>
      <UserHeaderMenu signOut={signOut} />
      {(authClass === 'bpbfull' || authClass === 'bpbcrew') && 
        <div className="top-nav-container">
          <TopNav />
        </div>
      }
      <Suspense fallback={<div>Loading...</div>}>
      <Routes location={location} key={`route-location.pathname`}>
        <Route path="/" element={<NavSide />} />

        <Route path="/Ordering"         element={<Ordering2 />} />
        <Route path="/Ordering/v2"      element={<OrdersPage />} />

        <Route path="/CustomerNews"     element={<CustomerNews />} />
        <Route path="/CustomerBilling"  element={<CustomerBilling />} />
        <Route path="/CustomerSettings" element={<CustomerSettings />} />
        <Route path="/CustomerProducts" element={<CustomerProducts />} />

        <Route path="/remap" element={<Remap />} />

        {(authClass === 'bpbfull' || authClass === 'bpbcrew') && <>

          {/* Production::BPBN */}
  
          <Route path="/Production/BPBNBaker1"     element={<Baker1 reportDay="today" />} />
          <Route path="/BPBNProd/BPBNBaker1Backup" element={<Baker1 reportDay="tomorrow" />} />
          <Route path="/Production/BPBNBaker2"     element={<Baker2 />} />
          <Route path="/Production/BPBNBuckets"    element={<PageBuckets mixedWhere="Carlton" />} />
          <Route path="/Production/BPBNSetOut"     element={<SetoutV3 reportLocation="Carlton" />} />

          {/* Production::BPBS */}

          <Route path="/Production/BPBSWhatToMake"        element={<WhatToMakeV3 reportDay="today" />} />
          <Route path="/BPBSProd/BPBSWhatToMakeBackup"    element={<WhatToMakeV3 reportDay="tomorrow" />}/>

          <Route path="/Production/BPBSMixPocket/v2"      element={<MixPocket />} />
          <Route path="/Production/BPBSMixPocket"         element={<BPBSMixPocket />} />
          
          <Route path="/Production/BPBSSetOut"            element={<SetoutV3 reportLocation="Prado" />} />
          <Route path="/Production/BPBSBuckets"           element={<PageBuckets mixedWhere="Prado" />} />
          <Route path="/Production/BPBSPacking"           element={<PageSpecialPacking />} />

          {/* Production::Croix */}
          
          <Route path="/Production/CroixCount"  element={<PageCroissantEodCounts />} />
          <Route path="/Production/CroixToMake" element={<PageCroissantProduction />} />

          {/* Production::Other */}

          <Route path="/Production/Production" element={<Production />} />

          {/* Logistics */}

          <Route path="/Logistics"               element={<Logistics />} />
          <Route path="/Logistics/ByRoute"       element={<PageRouteGrid />} />
          <Route path="/Logistics/ByProduct"     element={<PageOrderDashboard />} />
          <Route path="/Logistics/NorthLists"    element={<NorthListV2 />} />
          <Route path="/Logistics/AMPastry"      element={<PageAMPastry />} />
          <Route path="/Logistics/RetailBags"    element={<PageRetailBags />} />
          <Route path="/Logistics/SpecialOrders" element={<PageSpecialOrders />} />
          <Route path="/Logistics/FreezerThaw"   element={<PageFreezerThaw />} />

          <Route path="/EODCounts" element={<EODCounts />} />

          <Route path="/Locations"    element={<LocationsNew />} />
          <Route path="/Locations/v2" element={<LocationsNew />} />
          <Route path="/Locations/v1" element={<Locations />} />

          <Route path="/Products"    element={<Products />} />
          <Route path="/Products/v2" element={<Products />} />
          <Route path="/Products/v1" element={<ProductsV1 />} />

          <Route path="/Billing"    element={<BillingV1 />} />
          <Route path="/Billing/v2" element={<BillingV2 />} />
          <Route path="/Billing/v1" element={<BillingV1 />} />

          {/* Settings */}

          <Route path="/Settings" element={<Settings />} />

          <Route path="/Settings/ManageCustomers" element={<ManageCustomers />} />
          <Route path="/Settings/ManageTrainings" element={<ManageTraining />} />
          <Route path="/Settings/custProds"       element={<CustProds />} />
          <Route path="/Settings/custProds/v2"    element={<LocationProductOverrides />} />
          <Route path="/Settings/DelivOrder"      element={<DelivOrder />} />
          <Route path="/Settings/editDough"       element={<EditDoughs />} />
          <Route path="/Settings/editRoutes"      element={<EditRoutes />} />
          <Route path="/Settings/editZones"       element={<EditZones2 />} />
          <Route path="/Settings/Notes"           element={<PageNotes />} />
        </>}
      </Routes>
      </Suspense>
    </></AnimatePresence>
  );
}

export default AnimatedRoutes;
