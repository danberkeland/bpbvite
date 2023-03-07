import React from "react";
import { Calendar } from "primereact/calendar";
import { dateToYyyymmdd, getWorkingDateTime, yyyymmddToWeekday } from "../../../../../functions/dateAndTime";
import { useOrderSummary } from "../../../../../data/orderData";


export const CartCalendar = ({ delivDate, setDelivDate, locNick }) => {
  const { data:orderSummary } = useOrderSummary(locNick, !!locNick)
  console.log("order Summary", orderSummary)

  const dateTemplate = (date) => {
    const calendarDate = `${date.year}-${('0' + String(date.month + 1).slice(-2))}-${('0' + String(date.day)).slice(-2)}`
    const dayOfWeek = yyyymmddToWeekday(calendarDate)
    const hasCart = orderSummary?.dates[calendarDate]?.hasCart ? 'C' : ''
    const hasStanding = orderSummary?.dates[calendarDate]?.hasStanding || orderSummary?.days[dayOfWeek] ? 'S' : ''

    let backgroundColor
    if (hasStanding && !date.today && date.selectable && calendarDate !== dateToYyyymmdd(delivDate)) backgroundColor = 'lightGray'
    if (hasCart && !date.today && calendarDate !== dateToYyyymmdd(delivDate)) backgroundColor = 'gray'

    const style = {
      padding: "2rem",
      backgroundColor: backgroundColor
    }

    
    return <div style={style} onClick={() => {console.log(date, calendarDate, dayOfWeek, hasCart, hasStanding)}}>{date.day}</div>
    //return <div>{displayText ? displayText : date.day}</div>
  }

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
      dateTemplate={dateTemplate}
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