import { useMemo, useState } from "react"
import { DT } from "../../../utils/dateTimeFns"



const useCalendarProps = (
  initSelectionMode="single",
  initCalendarValue=DT.today().plus({ days: 1 }).toJSDate(),
  todayDT
) => {

  const [selectionMode, setSelectionMode] = useState(initSelectionMode)
  const [calendarValue, setCalendarValue] = useState(initCalendarValue)

  function handleCalendarChange(event) {
    setCalendarValue(event.value)
  }

  const minDate = todayDT.minus({ days: 1 }).toJSDate()
  const maxDate = todayDT
    .plus({ months: 2 }).endOf('month')
    .minus({ days: 1 })
    .toJSDate()

  return {
    setSelectionMode,

    calendarProps: {
      value: calendarValue,
      selectionMode,
      onChange: handleCalendarChange,
      minDate,
      maxDate,
    }

  }

}






// explicit list of date objects that contain various date formats
const selectedDates = useMemo(
  () => calcSelectedDates(calendarValue, selectionMode), 
  [calendarValue, selectionMode]
)

const dtToDateObj = (DT, todayDT, orderDT) => ({
  DT,
  JS: DT.toJSDate(),
  iso: DT.toFormat('yyyy-MM-dd'),
  wdEEE: DT.toFormat('EEE'),
  wdNum: DT.weekday % 7,
  relDate: DT.diff(todayDT, 'days').days || todayDT.diff(DT, 'days').days * -1,
  orderDelDate: DT.diff(orderDT, 'days').days || orderDT.diff(DT, 'days').days * -1
})

function calcSelectedDates (calendarValue, selectionMode) {
  const todayDT = DT.today()
  const orderDT = todayDT.plus({ hours: 4 }).startOf('day')
  const toDateObj = DT => dtToDateObj(DT, todayDT, orderDT)

  let selectedDates
  switch (selectionMode) {
    case "single":
      selectedDates = [toDateObj(DT.fromJs(calendarValue).startOf('day'))]
      break

    case "range":
      const startDT = 
        DT.fromJs(calendarValue[0]).startOf('day')
      const endDT = 
        DT.fromJs(calendarValue[1] ?? calendarValue[0]).startOf('day')
      const nDays = endDT.diff(startDT, 'days').days

      selectedDates = [...Array(nDays).keys()].map(daysAhead => 
        toDateObj(startDT.plus({ days: daysAhead }))  
      )
      break
    
    default:
      console.warn("Invalid calendar selection mode; use 'single' or 'range'.")
      selectedDates = []
  }
  return selectedDates
}





export { useCalendarModel }