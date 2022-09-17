import React from "react";

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";


import AnimatedRoutes from "./AnimatedRoutes";

function Pages() {
  return (
    <Router>
      <AnimatedRoutes Routes={Routes} Route={Route} useLocation={useLocation} />
    </Router>
  );
}

export default Pages;
