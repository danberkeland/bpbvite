import React from "react"

// import { Column } from "primereact/column"
// import { DataTable } from "primereact/datatable"

// import { useOrderReportByDate } from "../../../data/productionData"

// import { groupBy } from "../../../functions/groupBy"
// import { sumBy } from "lodash"
import { DateTime } from "luxon"
import { WhatToMake } from "./BPBNBaker1Components/WhatToMake"
import { WhatToPrep } from "./BPBNBaker1Components/WhatToPrep"
import { BaguetteMix } from "./BPBNBaker1Components/BaguetteMix"

const REPORT_DATE = DateTime.now().setZone('America/Los_Angeles').startOf('day')

// *************
// * COMPONENT *
// *************

export const BPBNBaker1 = () => {

  return (<>
    <h1>(BPBN Baker 1)</h1>

    <div style={{marginTop: "2rem"}}>
    <WhatToMake reportDate={REPORT_DATE} />
    </div>

    <div style={{marginTop: "2rem"}}>
    <WhatToPrep reportDate={REPORT_DATE} />
    </div>

    <div style={{marginTop: "2rem"}}>
    <BaguetteMix reportDate={REPORT_DATE} />
    </div>

  </>)
}