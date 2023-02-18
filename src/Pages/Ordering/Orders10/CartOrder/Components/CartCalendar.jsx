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
      readOnlyInput
      minDate={getWorkingDateTime('NOW').minus({ days: 1}).toJSDate()}
      maxDate={getWorkingDateTime('NOW').plus({ months: 2}).endOf('month').minus({ hours: 1}).toJSDate()}
      showOtherMonths={false}
      showMinMaxRange={true}
      // headerTemplate={() => <div>FOOOOO</div>}
      // monthNavigator
      // monthNavigatorTemplate={e => {
  
      //   return(
      //     <div>{e.options.find(m => m.value === e.value).label.slice(0,3)}</div>
      //   )
      // }}
      onChange={(e) => {
        setDelivDate(e.value);
      }}
    />
  )
}


// readOnlyInput prevents keyboard input. Typing dates will
// cause an invalid date state, causing fatal errors with
// date-handling functions.