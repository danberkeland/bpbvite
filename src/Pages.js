import React from "react";

import AnimatedRoutes from "./AnimatedRoutes";

function Pages(props) {
  return (
   
      <AnimatedRoutes Routes={props.Routes} Route={props.Route} useLocation={props.useLocation} />
  
  );
}

export default Pages;
