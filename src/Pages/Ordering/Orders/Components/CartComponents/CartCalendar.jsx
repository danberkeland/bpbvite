import React from "react";
import { Calendar } from "primereact/calendar";
import { 
  dateToMmddyyyy,  
  getWorkingDateTime, 
  yyyymmddToWeekday 
} from "../../../../../functions/dateAndTime";
import { useOrderCalendarSummary } from "../../data/orderHooks";
import { InputLabel } from "../InputLabel";

const minDate = getWorkingDateTime('NOW')
  .minus({ days: 1 }).toJSDate()
const maxDate = getWorkingDateTime('NOW').plus({ months: 2 }).endOf('month')
  .minus({ days: 1 }).toJSDate()
  
export const CartCalendar = ({ 
  delivDate, 
  setDelivDate, 
  ORDER_DATE_DT,
  locNick, 
  inline,
  disabled
}) => {
  const { data:orderSummary } = useOrderCalendarSummary({ 
    locNick, shouldFetch: !!locNick 
  })
  //console.log("orderSummary", orderSummary)

  const dateTemplate = (date) => {
    const dateJS = new Date(date.year, date.month, date.day)
    const isCustomToday = dateJS.getTime() === ORDER_DATE_DT.toMillis()

    //const isSelectedDate = dateJS.getTime() === delivDate.getTime()
    const calendarDate = `${date.year}-` 
      + `${('0' + String(date.month + 1).slice(-2))}-`
      + `${('0' + String(date.day)).slice(-2)}`
    const dayOfWeek = yyyymmddToWeekday(calendarDate)
    const hasCart = orderSummary?.byDate?.[calendarDate]?.hasCart
    const hasStanding = orderSummary?.byDay?.[dayOfWeek]?.hasStanding

    const isRecentDelete = orderSummary?.byDate?.[calendarDate]?.isRecentDelete

    // let background = ''
    // if (hasStanding && !date.today && date.selectable ) {
    //   background = 'rgba(200, 200, 200, .85)'
    // }
    // if (hasCart && !date.today && date.selectable ) {
    //   background = 'rgba(150, 150, 150, .85)'
    // }
    //if (isCustomToday) console.log(calendarDate)
    // if (isCustomToday) background = '#484f56'
    return (
      <div 
        id={isCustomToday && date.selectable
          ? "bpb-date-cell-custom-today"
          : hasCart && date.selectable
            ? "bpb-date-cell-cart"
            : hasStanding && date.selectable 
              ? "bpb-date-cell-standing" 
              : "bpb-date-cell-none"
        }
        style={{background: isRecentDelete ? "rgba(255, 0, 0, .25)" : ""}}
      >
        {date.day}
      </div>
    )
  }

  return (
    <InputLabel label="Date" 
      htmlFor="bpb-order-calendar"
      disabled={disabled}
      hidden={inline}
    >
      <Calendar
        id="bpb-order-calendar"
        className="bpb-order-calendar"
        value={delivDate}
        inline={inline}
        touchUI={!inline}
        //viewDate={delivDate}
        placeholder={dateToMmddyyyy(delivDate)} // ***1.
        readOnlyInput={!inline}
        minDate={minDate}
        maxDate={maxDate}
        showOtherMonths={false}
        //showMinMaxRange={!inline}
        dateTemplate={dateTemplate}
        onChange={(e) => setDelivDate(e.value)}
        style={!inline
          ? {
            width:"6.5rem",
          }
          : undefined //{width: "25.5rem"}
        }
        inputStyle={!inline
          ? {
            border: "0 none",
            boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2),"
              + " 0 1px 1px 0 rgba(0, 0, 0, 0.14),"
              + " 0 1px 3px 0 rgba(0, 0, 0, 0.12)",
          }
          : undefined
        }
      />
    </InputLabel>
  )
}

// ***1. Solves buggy behavior when toggling inline property