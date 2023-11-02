import { DateTime } from "luxon"
import { useBillingDataByDate } from "./data"

import { Calendar } from "primereact/calendar"
import { useState } from "react"


export const Billing = () => {
  const todayDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
  const todayISO = todayDT.toFormat('yyyy-MM-dd')

  const [selectedDateJS, setSelectedDateJS] = useState(new Date())
  const selectedDateDT = DateTime.fromJSDate(selectedDateJS).setZone('America/Los_Angeles')
  const reportDate = selectedDateDT.toFormat('yyyy-MM-dd')
  console.log("reportDate", reportDate)

  const { data:invoicesByLocNick={} } = useBillingDataByDate({ 
    reportDate, 
    shouldFetch: true 
  })
  const invoiceData = invoicesByLocNick['aaatest']

  console.log(invoicesByLocNick)
  return (
    <div>
      <h1>Billing</h1>

      <Calendar 
        value={selectedDateJS}
        onChange={e => setSelectedDateJS(e.value)}
        readOnlyInput
      />

      <h2>Invoice for Aaa Test:</h2>
      <pre>{JSON.stringify(invoiceData, null, 2)}</pre>


    </div>
  )

}