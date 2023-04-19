import React, { useEffect } from "react";
import { Calendar } from "primereact/calendar";
import {
  dateToMmddyyyy,
  dateToYyyymmdd,
  getWorkingDateTime,
  yyyymmddToWeekday,
} from "../../../../functions/dateAndTime";

export const NotesCalendar = ({ delivDate, setDelivDate, notes }) => {
  const dateTemplate = (date) => {
    const calendarDate = `${date.year}-${
      "0" + String(date.month + 1).slice(-2)
    }-${("0" + String(date.day)).slice(-2)}`;
    const dayOfWeek = yyyymmddToWeekday(calendarDate);

    const style = { padding: "2rem", backgroundColor: "white", color: "black" };
    
    if (notes && notes.some((note) => note.when === calendarDate)) {
      style.backgroundColor = "gray";
      style.color = "white";
    }
   

    return <div style={style}>{date.day}</div>;
  };

  return (
    <Calendar
      id="calendar"
      value={delivDate}
      viewDate={delivDate}
      placeholder={dateToMmddyyyy(delivDate)}
      readOnlyInput={false}
      minDate={getWorkingDateTime("NOW").minus({ days: 1 }).toJSDate()}
      maxDate={getWorkingDateTime("NOW")
        .plus({ months: 2 })
        .endOf("month")
        .minus({ hours: 1 })
        .toJSDate()}
      dateTemplate={dateTemplate}
      onChange={(e) => setDelivDate(e.value)}
      inline={true}
    />
  );
};
