import React from "react"
import { Calendar } from "primereact/calendar"

import { DT } from "../../../../../utils/dateTimeFns"
// import { useOrderingPageCalendarSummmary } from "../../stores"

import "./cartCalendar.css"

const relDateToText = relDate => 
  relDate < -1 ? `Today -${relDate * -1}`
  : relDate === -1 ? "Yesterday"
  : relDate === 0 ? "Today"
  : relDate === 1 ? "Tomorrow"
  : `Today +${relDate}`

const CartCalendar = ({
  todayDT,
  delivDTList,
  calendarDateRange, 
  changeDelivDate,
  locNick,
  calendarSummary,

  id,
  inline,
  touchUI,
  showIcon,
  displayTextOnly=false,
  style,
  inputStyle,
}) => {
  // console.log("calendar summary", calendarSummary)

  const relDates = delivDTList.map(dt => 
    dt.diff(todayDT, 'days').days 
    || todayDT.diff(dt, 'days').days
  )

  const relDateText = relDateToText(relDates[0])
  const formatToken = 
    `'${delivDTList[0].toFormat('EEEE')}', M d '(${relDateText})'`
  const displayText = 
    `${delivDTList[0].toFormat('EEEE, MMM d')} (${relDateText})`

  const minDate = todayDT.minus({ days: 1 }).toJSDate()
  const maxDate = todayDT
    .plus({ months: 2 }).endOf('month')
    .minus({ days: 1 })
    .toJSDate()

  const dateTemplate = date => {
    const yyyy = `${date.year}`
    const MM = `0${date.month + 1}`.slice(-2)
    const dd = `0${date.day}`.slice(-2)
    const isoDate = yyyy + '-' + MM + '-' + dd
    const calendarDT = DT.fromIso(isoDate)
    const dayOfWeek = calendarDT.toFormat('EEE')

    const isToday = calendarDT.toMillis() === todayDT.toMillis()

    const hasCartEdit = calendarSummary?.dates?.[isoDate]?.hasCartEdit
    const hasStanding = calendarSummary?.days?.[dayOfWeek] === true

    let templateId = "bpb-date-cell-none"
    if (isToday) templateId = "bpb-date-cell-custom-today"
    else if (hasCartEdit && date.selectable) templateId = "bpb-date-cell-cart"
    else if (hasStanding && date.selectable) templateId = "bpb-date-cell-standing"

    return (
      <div id={templateId}>
        {date.day}
      </div>
    )
  }


  return delivDTList.length === 1 && 
    displayTextOnly 
      ? <div id={id}
          style={{
            fontSize: "1.25rem", 
            fontWeight: "bold", 
            padding: ".5rem", 
            background: "var(--bpb-orange-vibrant-100)",
            border: "solid 1px var(--bpb-border-input)",
            borderRadius: "3px",
            marginBottom: ".5rem",
            width: "100%",
          }}
        >
          {displayText}
        </div>
      : <Calendar 
          id={id}
          className="bpb-order-calendar"
          dateFormat={formatToken}
          value={calendarDateRange?.[0]}
          minDate={minDate}
          maxDate={maxDate}
          showOtherMonths={false}
          onChange={e => changeDelivDate(e.value)}
          touchUI={touchUI}
          inline={inline}
          showIcon={showIcon}
          style={style}
          readOnlyInput
          inputStyle={inputStyle}
          dateTemplate={dateTemplate}
        />
}

export {
  CartCalendar
}

