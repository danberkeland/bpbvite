import React from "react";
import { Calendar } from "primereact/calendar";
import { getWorkingDateTime } from "../../../../../functions/dateAndTime";


export const CartCalendar = ({ delivDate, setDelivDate }) => {
  return (
    <Calendar
      id="calendar"
      //style={{ width: "115px" }}
      touchUI={true}
      value={delivDate}
      minDate={getWorkingDateTime('NOW').minus({ days: 1}).toJSDate()}
      maxDate={getWorkingDateTime('NOW').plus({ months: 2}).endOf('month').toJSDate()}
      monthNavigatorTemplate={(e) => <div>Foo</div>}
      showOtherMonths={false}
      showMinMaxRange={true}
      onChange={(e) => {
        setDelivDate(e.value);
      }}
    />
  )
}