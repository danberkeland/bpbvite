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
    const today = new Date().toISOString().slice(0, 10);
    console.log('today', today)
    
    const calendarDate = `${date.year}-${
      "0" + String(date.month + 1).slice(-2)
    }-${("0" + String(date.day)).slice(-2)}`;
    const dayOfWeek = yyyymmddToWeekday(calendarDate);
    console.log('calendarDate', calendarDate)
    const style = { padding: "2rem", backgroundColor: "white", color: "black" };
    const isToday = today === calendarDate
    if (notes && notes.some((note) => note.when === calendarDate)) {
      style.backgroundColor = "gray";
      style.color = "white";
    }
   
  if (isToday) {
    style.border = "10px solid blue";
    style.backgroundColor = "skyblue";
    style.borderRadius = "50%";
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
