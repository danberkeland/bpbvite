// import React from "react";

// // import Ordering from "../Pages/Ordering/Ordering";
// import Ordering2 from "../Pages/Ordering/Ordering2";
// import CustomerNews from "../Pages/CustomerNews/CustomerNews";
// import CustomerBilling from "../Pages/CustomerBilling/CustomerBilling";
// import CustomerSettings from "../Pages/CustomerSettings/CustomerSettings";
// import CustomerProducts from "../Pages/CustomerProducts/CustomerProducts";
// import BPBNBaker1 from "../Pages/Production/BPBNBaker1";
// import BPBNBaker2 from "../Pages/Production/BPBNBaker2";
// import WhoBake from "../Pages/Production/WhoBake";
// import WhoShape from "../Pages/Production/WhoShape";

// import Production from "../Pages/Production/Production";
// import Products from "../Pages/Products/Products";
// import Settings from "../Pages/Settings/Settings";
// import Billing from "../Pages/Billing/Billing";
// import EODCounts from "../Pages/EODCounts/EODCounts";
// import Logistics from "../Pages/Logistics/Logistics";
// import ByRoute from "../Pages/Logistics/ByRoute/ByRoute";
// import Locations from "../Pages/Locations/Locations";
// import ManageCustomers from "../Pages/Settings/ManageCustomers/ManageCustomers";
// import ManageTraining from "../Pages/Settings/ManageTraining/ManageTraining";
// import CustProds from "../Pages/Settings/custProds/custProds";

// import NavSide from "./FixWarn";

// import { AnimatePresence } from "framer-motion";
// import { useSettingsStore } from "../Contexts/SettingsZustand";
// import { UserHeaderMenu } from "./UserHeaderMenu";

// function AnimatedRoutes({ Routes, Route, useLocation }) {
//   const authClass = useSettingsStore((state) => state.authClass);
//   const location = useLocation();

//   return (
//     <AnimatePresence>
//       <UserHeaderMenu />
//       <Routes location={location} key={location.pathname}>
//         <Route path="/cogFix/Ordering" element={<Ordering2 />} />

//         <Route path="/cogFix/CustomerSettings" element={<CustomerSettings />} />

//         <Route
//           path="/cogFix/Settings/ManageCustomers"
//           element={<ManageCustomers />}
//         />

//         <Route path="/" element={<NavSide />} />
//       </Routes>
//     </AnimatePresence>
//   );
// }

// export default AnimatedRoutes;
