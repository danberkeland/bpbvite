import React, { useState } from "react";

import { BPBTerminal } from "./TestPages/BPBTerminal2";
import { Sandbox } from "./TestPages/_Sandbox";
import { BriocheCalc } from "./TestPages/BriocheCalc";
import { OrderReview } from "./TestPages/OrderReview";

const bpbnPages = [
  {name: "Sandbox", component: <Sandbox />},
  {name: "Terminal", component: <BPBTerminal />},
  {name: "Brioche Calculator", component: <BriocheCalc />},
  {name: "Order Review", component: <OrderReview />},

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
