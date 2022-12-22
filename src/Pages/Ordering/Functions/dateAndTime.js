import { DateTime } from "luxon";

/**
 * Access BPB's local time on any system.
 * BPB time follows 'America/Los_Angeles' locale rules.*/
export const getBpbTime = () => DateTime.now().setZone('America/Los_Angeles')

/**
 * Apply 6pm cutoff rules to the current BPB time
 * to determine the submission date.
 */
export const getOrderSubmitDate = () => {
  const bpbTime = getBpbTime()
  const bpbHour = bpbTime.hour
  const orderSubmitDate = bpbHour >= 18 ? 
    bpbTime.startOf('day').plus({ days: 1 }) : 
    bpbTime.startOf('day')
  
  return orderSubmitDate
}


export function dateToMmddyyyy(date) {
  //if (!date) return null

  const mm = ('0' + (date.getMonth() + 1)).slice(-2) 
  const dd = ('0' + date.getDate()).slice(-2)
  const yyyy = date.getFullYear()

  return (mm + '/' + dd + '/' + yyyy)
}

/**
 * Convert JS date into capitalized 3 letter weekday,
 * compatible with database entries.
 */
export function getWeekday(date) {
  //if (!date) return null

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return (weekdays[date.getDay()])
}