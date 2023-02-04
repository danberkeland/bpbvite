import React from "react";

import { Calendar } from "primereact/calendar";

export const OrderSelection = ({ selection }) => {
  const { delivDate, setDelivDate } = selection;

  return (
    <div className="bpbCalendar">
      <div className="fulfillStyle">CARLTON PICKUP (DEFAULT)</div>
      <span className="p-float-label p-fluid" style={{ marginTop: "0px" }}>
        
        <Calendar
          id="calendar"
          touchUI={true}
          style={{ width: "100px" }}
          value={delivDate}
          onChange={(e) => {
            setDelivDate(e.value);
          }}
        />
        {/* <label htmlFor="calendar">{"Delivery Date"}</label> */}
      </span>
    </div>
  );
};
