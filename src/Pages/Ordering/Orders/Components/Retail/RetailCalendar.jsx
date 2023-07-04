import { Calendar } from "primereact/calendar"
import { useRetailOrders } from "../../data/orderHooks"


export const RetailCalendar = ({
  todayDT, delivDateJS, handleDateChange, calendarStyle
}) => {
  const { data:retail } = useRetailOrders({ shouldFetch: true })
  const { orderDates = [] } = retail ?? {}

  
  const dateTemplate = (date) => {
    const dateJS = new Date(date.year, date.month, date.day)
    const isCustomToday = dateJS.getTime() === todayDT.toMillis()

    const calendarDate = `${date.year}-` 
      + `${('0' + String(date.month + 1).slice(-2))}-`
      + `${('0' + String(date.day)).slice(-2)}`
    const hasCart = orderDates.includes(calendarDate)

    return (
      <div 
        id={isCustomToday && date.selectable
          ? "bpb-date-cell-custom-today"
          : hasCart && date.selectable
            ? "bpb-date-cell-cart"
            : "bpb-date-cell-none"
        }
      >
        {date.day}
      </div>
    )
  }

  return (
    <Calendar 
      inline
      value={delivDateJS}
      dateTemplate={dateTemplate}
      onChange={e => handleDateChange(e)}
      style={calendarStyle}
    />
  )
    
}

