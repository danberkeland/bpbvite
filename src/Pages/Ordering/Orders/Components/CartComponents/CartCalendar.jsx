import React from "react";
import { Calendar } from "primereact/calendar";
import { 
  // dateToMmddyyy_y,  
  getWorkingDateTime, 
} from "../../../../../utils/_deprecated/dateAndTime";
import { useOrderCalendarSummary } from "../../data/orderHooks";
import { InputLabel } from "../InputLabel";
import { DateTime } from "luxon";
import { IsoDate } from "../../../../../utils/dateTimeFns";

const minDate = getWorkingDateTime('NOW')
  .minus({ days: 1 }).toJSDate()
const maxDate = getWorkingDateTime('NOW').plus({ months: 2 }).endOf('month')
  .minus({ days: 1 }).toJSDate()



const xmasStyle = { 
  background: "repeating-linear-gradient(45deg,#ea3746 0px,#ea3746 6px,#ffffff 6px,#ffffff 10px, #ea3746 10px, #ea3746 11px, #ffffff 11px, #ffffff 13px, #ea3746 13px, #ea3746 14px,#ffffff 14px,#ffffff 19px", 
  opacity: "0.6"
}
const backgroundDeleteStyle = { background: "rgba(255, 0, 0, .25)" }
  
export const CartCalendar = ({ 
  locNick, 
  delivDateJS, 
  setDelivDateJS, 
  ORDER_DATE_DT,
  dateUpdated,
  todayDT,
  inline,
  showHolidays,
  // handleSelectionUpdate,
}) => {
  const { data:orderSummary } = useOrderCalendarSummary({ 
    locNick, shouldFetch: !!locNick 
  })

  //console.log(orderSummary)

  const dateTemplate = (date) => {
    const dateJS = new Date(date.year, date.month, date.day)
    const isCustomToday = dateJS.getTime() === ORDER_DATE_DT.toMillis()
    const isToday = dateJS.getTime() === todayDT.toMillis()

    //console.log(date)

    const calendarDate = `${date.year}-` 
      + `${('0' + String(date.month + 1)).slice(-2)}-`
      + `${('0' + String(date.day)).slice(-2)}`
    const dayOfWeek = IsoDate.toWeekdayEEE(calendarDate)
    const hasCart = orderSummary?.byDate?.[calendarDate]?.hasCart
    const hasStanding = orderSummary?.byDay?.[dayOfWeek]?.hasStanding
      || orderSummary?.byDate?.[calendarDate]?.hasStanding // for placeholders

    const isXmas = date.month + 1 === 12 && date.day === 25
    const isRecentDelete = orderSummary?.byDate?.[calendarDate]?.isRecentDelete

    const fulfillment = orderSummary?.byDate?.[calendarDate]?.fulfillment
    

    return (
      <div 
        // id={isCustomToday && date.selectable
        id={isToday
          ? "bpb-date-cell-custom-today"
          : hasCart && date.selectable
            ? "bpb-date-cell-cart"
            : hasStanding && date.selectable 
              ? "bpb-date-cell-standing" 
              : "bpb-date-cell-none"
        }
        style={
          (showHolidays && isXmas) ? xmasStyle 
            : isRecentDelete ? backgroundDeleteStyle 
            : {}
        }
        onClick={() => console.log(calendarDate, hasCart, hasStanding)}
      >
        {date.day}
      </div>
    )
  }

  return (
    <InputLabel label="Date" 
      htmlFor="bpb-order-calendar"
      hidden={inline}
    >
      <Calendar
        id="bpb-order-calendar"
        className="bpb-order-calendar"
        value={delivDateJS}
        inline={inline}
        touchUI={!inline}
        //viewDate={delivDateJS}
        placeholder={DateTime.fromJSDate(delivDateJS).toFormat('MM/dd/yyyy')}   //dateToMmddyyy_y(delivDateJS)} // ***1.
        readOnlyInput={!inline}
        minDate={minDate}
        maxDate={maxDate}
        showOtherMonths={false}
        //showMinMaxRange={!inline}
        dateTemplate={dateTemplate}
        onChange={(e) => {
          dateUpdated.current = true

          // force calendar to produce dates in the bpb local time zone
          const dateObj = { 
            year: e.value.getFullYear(),
            month: e.value.getMonth() + 1,
            day: e.value.getDate(),
          }
          const opts = { zone: 'America/Los_Angeles' }

          const bpbDate = DateTime.fromObject(dateObj, opts).toJSDate()

          setDelivDateJS(bpbDate)

          // handleSelectionUpdate(e.value)
        }}
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