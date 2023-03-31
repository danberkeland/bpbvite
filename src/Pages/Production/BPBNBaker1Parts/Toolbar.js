import React from "react";
import { Calendar } from "primereact/calendar";
import { convertDatetoBPBDate } from "../../../helpers/dateTimeHelpers";

const { DateTime } = require("luxon");

const ToolBar = ({ delivDate, setDelivDate }) => {

  const setDate = (date) => {
    const dt2 = DateTime.fromJSDate(date);
    setDelivDate(dt2.toFormat("yyyy-MM-dd"));
  };

  return (
    <React.Fragment>
      <div className="p-field p-col-12 p-md-4"
        style={{display: "flex", flexWrap: "wrap", alignItems: "center", gap: ".5rem"}}
      >
        <label htmlFor="delivDate">Pick Delivery Date: </label>
        <Calendar
          style={{maxWidth: "10rem"}}
          id="delivDate"
          placeholder={convertDatetoBPBDate(delivDate)}
          dateFormat="mm/dd/yy"
          onChange={(e) => setDate(e.value)}
        />
      </div>
    </React.Fragment>
  );
};

export default ToolBar;
