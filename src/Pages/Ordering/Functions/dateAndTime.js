import { DateTime } from "luxon";

// Access BPB's local time on any system
// BPB time follows 'America/Los_Angeles' locale rules
export const getBpbTime = () => DateTime.now().setZone('America/Los_Angeles')


export const getOrderSubmitDate = () => {
  const bpbTime = getBpbTime()
  const bpbHour = bpbTime.hour
  const orderSubmitDate = bpbHour >= 18 ? 
    bpbTime.startOf('day').plus({ days: 1 }) : 
    bpbTime.startOf('day')
  
  return orderSubmitDate
}

// Accepts a JS Date object
// returns mm/dd/yyyy string
export function dateToMmddyyyy(date) {
  const mm = ('0' + (date.getMonth() + 1)).slice(-2) 
  const dd = ('0' + date.getDate()).slice(-2)
  const yyyy = date.getFullYear()

  return (mm + '/' + dd + '/' + yyyy)
}

export function getWeekday(date) {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return (weekdays[date.getDay()])
}