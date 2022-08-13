import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Ordering from "./Pages/Ordering/Ordering";
import CustomerNews from "./Pages/CustomerNews/CustomerNews";
import CustomerBilling from "./Pages/CustomerBilling/CustomerBilling";
import CustomerSettings from "./Pages/CustomerSettings/CustomerSettings";
import CustomerProducts from "./Pages/CustomerProducts/CustomerProducts";
import Production from "./Pages/Production/Production"
import Products from "./Pages/Products/Products"
import Settings from "./Pages/Settings/Settings"
import Billing from "./Pages/Billing/Billing"
import EODCounts from "./Pages/EODCounts/EODCounts"
import Logistics from "./Pages/Logistics/Logistics"

function Pages() {
  return (
    <Router>
      <Routes>
        <Route path="/Ordering" element={<Ordering />} />
        <Route path="/CustomerNews" element={<CustomerNews />} />
        <Route path="/CustomerBilling" element={<CustomerBilling />} />
        <Route path="/CustomerSettings" element={<CustomerSettings />} />
        <Route path="/CustomerProducts" element={<CustomerProducts />} />
        <Route path="/Production" element={<Production />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/Billing" element={<Billing />} />
        <Route path="/EODCounts" element={<EODCounts />} />
        <Route path="/Logistics" element={<Logistics />} />


      </Routes>
    </Router>
  );
}

export default Pages;
