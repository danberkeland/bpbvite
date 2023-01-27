import React from "react"

import { Card } from "primereact/card"
import { Calendar } from "primereact/calendar"

export const OrderSelection = ({selection}) => {
  const { delivDate, setDelivDate } = selection

  return(
    <Card 
      title="Order Selection"
    >
      <div>
        <span className="p-float-label p-fluid" style={{marginTop: "30px"}}>
          <Calendar 
            id="calendar"
            touchUI={true}
            style={{width: "100%"}}
            value={delivDate}
            onChange={e => {
              setDelivDate(e.value)
            }}
          />
          <label htmlFor="calendar">{"Delivery Date"}</label>
        </span>
      </div> 
    </Card>
    
  )
}