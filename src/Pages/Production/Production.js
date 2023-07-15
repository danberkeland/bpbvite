import React, { useState } from "react";

import { BPBNBaker1 } from "./NewPages/BPBNBaker1New";
import { BPBNBaker2 } from "./NewPages/BPBNBaker2New";
import { BPBNSetout } from "./NewPages/BPBNSetoutNew";
import { BPBTerminal } from "./NewPages/BPBTerminal2";
import { WhoBake } from "./NewPages/WhoBakeNew";
import { WhoShape } from "./NewPages/WhoShapeNew";
import { CroixToMake } from "./NewPages/CroixToMake";
import { SevenDayList } from "./NewPages/SevenDayList";
import { Database } from "./NewPages/Database";
import { BPBNBuckets } from "./NewPages/BPBNBucketsNew";
import { Routing } from "./NewPages/Routing";
import { Sandbox } from "./NewPages/_Sandbox";

const bpbnPages = [
  {name: "Sandbox", component: <Sandbox />},
  {name: "BPBNBaker1", component: <BPBNBaker1 />},
  {name: "BPBNBaker2", component: <BPBNBaker2 />},
  {name: "BPBNSetout", component: <BPBNSetout />},
  {name: "BPBNBuckets", component: <BPBNBuckets />},
  {name: "WhoBake", component: <WhoBake />},
  {name: "WhoShape", component: <WhoShape />},
  {name: "Croix To Make", component: <CroixToMake />},
  {name: "Terminal", component: <BPBTerminal />},
  {name: "Database", component: <Database />},
  {name: "Seven Day List", component: <SevenDayList />},
  {name: "Order Routing", component: <Routing />},
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
