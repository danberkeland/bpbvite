import React from "react"

import { DateTime } from "luxon"
import { WhatToMake } from "./BPBNBaker1Components/WhatToMake"
import { WhatToPrep } from "./BPBNBaker1Components/WhatToPrep"
import { BaguetteMix } from "./BPBNBaker1Components/BaguetteMix"
import { Button } from "primereact/button"


const dateDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
const displayDate = dateDT.toLocaleString({
  month: '2-digit', day: '2-digit', year: 'numeric'
})

// *************
// * COMPONENT *
// *************

// Todo: set DateDT with Calendar Component
// PrintPDF button
export const BPBNBaker1 = () => {

  return (<>
    <h1>BPBN Baker 1</h1>

    <Button label="Print AM Bake List" />

    <WhatToMake dateDT={dateDT} displayDate={displayDate} />
    <WhatToPrep 
      dateDT={dateDT} 
      displayDate={displayDate} 
      doobieStuff={doobieStuff}
    />
    
    <BaguetteMix dateDT={dateDT} displayDate={displayDate} />

  </>)
}


let yes = DateTime.now()
  .setZone("America/Los_Angeles")
  .ordinal % 2 === 0

const doobieStuff = [
  {
    Prod: "Doobie Buns",
    Bucket: "YES",
    Mix: yes ? "YES" : "YES",
    Bake: yes ? "NO" : "NO",
  },
  {
    Prod: "Siciliano",
    Bucket: "YES",
    Mix: yes ? "NO" : "NO",
    Bake: yes ? "YES" : "YES",
  },
]

// const doobieStuffx = [
//   {
//     Prod: "Doobie Buns",
//     Bucket: "YES",
//     Mix: yes ? "NO" : "NO",
//     Bake: yes ? "YES" : "YES",
//   },
//   {
//     Prod: "Siciliano",
//     Bucket: "YES",
//     Mix: yes ? "YES" : "YES",
//     Bake: yes ? "NO" : "NO",
//   },
// ]