import React, { useState } from "react";
import { Calendar } from "primereact/calendar";

const { DateTime } = require("luxon");

const ToolBar = ({ delivDate, setDelivDate }) => {
  const [calendarDate, setCalendarDate] = useState(new Date())

  return (
    <React.Fragment>
      <div className="p-field p-col-12 p-md-4"
        style={{display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem"}}
      >
        <label htmlFor="delivDate">Pick Delivery Date: </label>
        <Calendar
          style={{maxWidth: "10rem"}}
          id="delivDate"
          value={calendarDate}
          dateFormat="mm/dd/yy"
          onChange={(e) => {
            console.log(e.value)
            setCalendarDate(e.value)
            setDelivDate(DateTime.fromJSDate(e.value).toFormat("yyyy-MM-dd"))
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default ToolBar;
