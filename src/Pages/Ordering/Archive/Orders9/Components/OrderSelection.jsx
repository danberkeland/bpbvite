import React from "react";

import { Calendar } from "primereact/calendar";
import { FullfillmentOptions } from "./OrderDisplayComponents/FulfillmentOptions";

export const OrderSelection = ({ selection, orderHeaderState }) => {
  const { delivDate, setDelivDate } = selection;

  return (
    <div className="fulfillBox">
      <div className="fulDrop">
      <FullfillmentOptions orderHeaderState={orderHeaderState} />
      </div>
     
      <div className="bpbCalendar">
        <span className="p-float-label p-fluid" style={{ marginTop: "0px" }}>
          <Calendar
            id="calendar"
            touchUI={true}
            style={{ width: "115px" }}
            value={delivDate}
            onChange={(e) => {
              setDelivDate(e.value);
            }}
          />
          {/* <label htmlFor="calendar">{"Delivery Date"}</label> */}
        </span>
      </div>
    </div>
  );
};
