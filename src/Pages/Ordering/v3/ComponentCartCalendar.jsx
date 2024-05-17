import React from "react"
import { Calendar } from "primereact/calendar"

import { DT } from "../../../utils/dateTimeFns"
import "./componentCartCalendar.css"
import { DateTime } from "luxon"

const relDateToText = relDate => 
  relDate < -1 ? `Today -${relDate * -1}`
  : relDate === -1 ? "Yesterday"
  : relDate === 0 ? "Today"
  : relDate === 1 ? "Tomorrow"
  : `Today +${relDate}`

const displayModeProps = {
  mobile: {
    id: "cart-header-date-input", 
    inline: false, 
    touchUI: true, 
    showIcon: true, 
    displayTextOnly: false, 
    style: {marginBottom: ".5rem", width: "100%"}, 
    inputStyle: {
      width: "100%", 
      display: "block", 
      background: "var(--bpb-orange-vibrant-100)", 
      fontSize: "1.25rem", 
      fontWeight: "bold", 
      color: "var(--bpb-text-color)", 
      padding: ".125rem, .5rem"
    }
  },
  inline: {
    id: "cart-header-date-input", 
    inline: true, 
    touchUI: false, 
    showIcon: true, 
    displayTextOnly: false, 
    style: {marginBottom: ".5rem", width: "100%"}, 
    inputStyle: {
      width: "100%", 
      display: "block", 
      background: "var(--bpb-orange-vibrant-100)", 
      fontSize: "1.25rem", 
      fontWeight: "bold", 
      color: "var(--bpb-text-color)", 
      padding: ".125rem, .5rem"
    }
  },
  text: {
    id: "cart-header-date-input", 
    showIcon: false, 
    displayTextOnly: true, 
  }
}

/**
 * 
 * @param {Object} props
 * @param {DateTime} props.todayDT
 * @param {DateTime} props.delivDT
 * @param {function} props.handleDateChange
 * @param {any} props.calendarSummary
 * @param {'mobile'|'inline'|'text'} props.displayMode 
 */
const CartCalendar = ({
  todayDT,
  delivDT,
  handleDateChange,
  calendarSummary,
  displayMode,
  // id,
  // inline,
  // touchUI,
  // showIcon,
  // displayTextOnly=false,
  // style,
  // inputStyle,
}) => {
  const { id, inline, touchUI, showIcon, displayTextOnly, style, inputStyle } = displayModeProps[displayMode]

  const relDate = delivDT.diff(todayDT, 'days').days 
  const relDateText = relDateToText(relDate)
  
  const formatToken = `'${delivDT.toFormat('EEEE')}', M d '(${relDateText})'`
  const displayText = `${delivDT.toFormat('EEEE, MMM d')} (${relDateText})`

  const minDate = todayDT
    .minus({ days: 1 })
    .toJSDate()

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

    const templateId = isToday ? "bpb-date-cell-custom-today" 
      : hasCartEdit && date.selectable ? "bpb-date-cell-cart" 
      : hasStanding && date.selectable ? "bpb-date-cell-standing" 
      : "bpb-date-cell-none"
      
    // let templateId = "bpb-date-cell-none"
    // if (isToday) templateId = "bpb-date-cell-custom-today"
    // else if (hasCartEdit && date.selectable) templateId = "bpb-date-cell-cart"
    // else if (hasStanding && date.selectable) templateId = "bpb-date-cell-standing"

    return (
      <div id={templateId}>
        {date.day}
      </div>
    )
  }


  return displayTextOnly 
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
          value={delivDT.toJSDate()}
          minDate={minDate}
          maxDate={maxDate}
          showOtherMonths={false}
          onChange={e => handleDateChange(e.value)}
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

