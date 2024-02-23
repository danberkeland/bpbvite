import React, { useState } from "react";

import { BPBTerminal } from "./NewPages/TestPages/BPBTerminal2";
import { WhoBake } from "./NewPages/TestPages/WhoBakeNew";
import { WhoShape } from "./NewPages/TestPages/WhoShapeNew";
import { CroixToMake } from "./NewPages/Croix/CroixToMake/CroixToMake";
// import { CroixCount } from "./NewPages/Croix/CroixEOD/CroixCount";
import { SevenDayList } from "./NewPages/TestPages/SevenDayList";
import { Database } from "./NewPages/TestPages/Database";
import { BPBNBuckets } from "./NewPages/TestPages/BPBNBucketsNew";
// import { Routing } from "./NewPages/TestPages/Routing";
import { Sandbox } from "./NewPages/TestPages/_Sandbox";
import { BriocheCalc } from "./NewPages/TestPages/BriocheCalc";
import { OrderReview } from "./NewPages/TestPages/OrderReview";
import { OrderDomain } from "./NewPages/TestPages/OrderDomain";
// import { BPBNBaker1 } from "./NewPages/TestPages/BPBNBaker1New";
// import { BPBNBaker2 } from "./NewPages/TestPages/BPBNBaker2New";
// import { BPBNSetout } from "./NewPages/TestPages/BPBNSetoutNew";
// import { SpecialPacking } from "./NewPages/BPBS/SpecialPacking/SpecialPacking";
// import { BPBSWhatToMake } from "./NewPages/BPBS/WhatToMake/WhatToMake";
// import { BPBSSetout } from "./NewPages/Setout/Setout";
// import { RouteGrid } from "../Logistics/NewPages/RouteGrid/RouteGrid";

const bpbnPages = [
  {name: "Sandbox", component: <Sandbox />},
  {name: "Order Domain", component: <OrderDomain />},
  {name: "BPBNBuckets", component: <BPBNBuckets />},
  {name: "WhoBake", component: <WhoBake />},
  {name: "WhoShape", component: <WhoShape />},
  {name: "Croix To Make", component: <CroixToMake />},
  // {name: "Croix Count", component: <CroixCount />},
  {name: "Terminal", component: <BPBTerminal />},
  {name: "Database", component: <Database />},
  {name: "Seven Day List", component: <SevenDayList />},
  // {name: "Order Routing", component: <Routing />},
  {name: "Brioche Calculator", component: <BriocheCalc />},
  {name: "Order Review", component: <OrderReview />},
  // {name: "BPBNBaker1", component: <BPBNBaker1 />},
  // {name: "BPBNBaker2", component: <BPBNBaker2 />},
  // {name: "BPBNSetout", component: <BPBNSetout />},
  // {name: "BPBSWhatToMake", component: <BPBSWhatToMake />},
  // {name: "BPBSSetout", component: <BPBSSetout />},
  // {name: "Special Pack Lists", component: <SpecialPacking />},
  // {name: "Route Grid", component: <RouteGrid />},
]

const Production = () => {
  const [pageIndex, setPageIndex] = useState(null)

  return(
    <div className="production-page-container"
      style={{
        maxWidth: "70rem",
        margin: "auto",
        marginBottom: "5rem"
      }}
    >
      <h1>BPBN Pages</h1>
      {bpbnPages.map((item, idx) => <button key={idx}
          style={{
            display: "block",
            width: "10rem",
            margin: ".5rem 0 .5rem 0",
            borderRadius: "3px",
            backgroundColor: idx === pageIndex ? "hsl(240, 18%, 34%)" : "",
          }} 
          onClick={() => setPageIndex(idx)} 
        >
          {item.name}
        </button>
      )}

      <div className="production-report-container" 
        style={{
          margin: "auto",
          padding: "2rem",
          maxWidth: "65rem",
          //border: "solid 1px black"
        }}
      >
        {pageIndex !== null && bpbnPages[pageIndex].component}
      </div>
    </div>
  )
  
  
}

export default Production;
