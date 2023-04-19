import React, { useEffect } from "react";
import { Calendar } from "primereact/calendar";
import {
  dateToMmddyyyy,
  dateToYyyymmdd,
  getWorkingDateTime,
  yyyymmddToWeekday,
} from "../../../../functions/dateAndTime";

export const NotesCalendar = ({ delivDate, setDelivDate }) => {
  //console.log("order Summary", orderSummary)

  const dateTemplate = (date) => {
    const calendarDate = `${date.year}-${
      "0" + String(date.month + 1).slice(-2)
    }-${("0" + String(date.day)).slice(-2)}`;
    const dayOfWeek = yyyymmddToWeekday(calendarDate);

    const style = { padding: "2rem", backgroundColor: "white", color: "black" };

    return <div style={style}>{date.day}</div>;
  };

  return (
    <Calendar
      id="calendar"
      //touchUI={true}
      //value={delivDate}
      //viewDate={delivDate}
      //placeholder={dateToMmddyyyy(delivDate)} // hacky workaround for buggy behavior when toggling inline property
      readOnlyInput={false} // prevent keyboard input of invalid date string
      minDate={getWorkingDateTime("NOW").minus({ days: 1 }).toJSDate()}
      maxDate={getWorkingDateTime("NOW")
        .plus({ months: 2 })
        .endOf("month")
        .minus({ hours: 1 })
        .toJSDate()}
      //showOtherMonths={false}
      //showMinMaxRange={true}
      //dateTemplate={dateTemplate}
      //onChange={(e) => setDelivDate(e.value)}
      inline={true}
    />
  );
};
