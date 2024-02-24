// import React, { useEffect } from "react";
// import { Calendar } from "primereact/calendar";
// import { dateToMmddyyyy, dateToYyyymmdd, getWorkingDateTime, yyyymmddToWeekday } from "../../../../../functions/dateAndTime";
// import { useOrderSummary } from "../../../../../data/orderData";


// export const CartCalendar = ({ delivDate, setDelivDate, locNick, inline }) => {
//   const { data:orderSummary } = useOrderSummary(locNick, !!locNick)
//   //console.log("order Summary", orderSummary)

//   const dateTemplate = (date) => {
//     //console.log(date)
//     const calendarDate = `${date.year}-${('0' + String(date.month + 1).slice(-2))}-${('0' + String(date.day)).slice(-2)}`
//     const dayOfWeek = yyyymmddToWeekday(calendarDate)
//     const hasCart = orderSummary?.dates[calendarDate]?.hasCart ? 'C' : ''
//     const hasStanding = orderSummary?.dates[calendarDate]?.hasStanding || orderSummary?.days[dayOfWeek] ? 'S' : ''

//     let backgroundColor
//     if (
//       hasStanding 
//       && !date.today 
//       && date.selectable 
//       //&& calendarDate !== dateToYyyymmdd(delivDate)
//     ) backgroundColor = 'lightGray'
//     if (
//       hasCart 
//       && !date.today 
//       //&& calendarDate !== dateToYyyymmdd(delivDate)
//     ) backgroundColor = 'gray'

//     const style = { padding: "2rem", background: backgroundColor }


//     return (
//       <div 
//         style={style}
//         // onClick={() => {
//         //   console.log(date, calendarDate, dayOfWeek, hasCart, hasStanding)}
//         // }
//       >
//         {date.day}
//       </div>
      
//       )
//   }


//   return (
//     <Calendar
//       id="calendar"
//       touchUI={!inline}
//       value={delivDate}
//       //viewDate={delivDate}
//       placeholder={dateToMmddyyyy(delivDate)} // hacky workaround for buggy behavior when toggling inline property
//       readOnlyInput={!inline} // prevent keyboard input of invalid date string
//       minDate={getWorkingDateTime('NOW').minus({ days: 1}).toJSDate()}
//       maxDate={getWorkingDateTime('NOW').plus({ months: 2}).endOf('month').minus({ hours: 1}).toJSDate()}
//       showOtherMonths={false}
//       //showMinMaxRange={!inline}
//       dateTemplate={dateTemplate}
//       onChange={(e) => setDelivDate(e.value)}
//       inline={inline}
//     />
//   )
// }