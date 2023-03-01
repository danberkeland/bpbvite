import { DateTime } from "luxon";

const CUTOFF_TIME = 20 // 20 === 8:00pm

/**
 * Access BPB's local time on any system.
 * BPB time follows 'America/Los_Angeles' locale rules.*/
export const getBpbTime = () => DateTime.now().setZone('America/Los_Angeles')

/**
 * Apply 6pm cutoff rules to the current BPB time
 * to determine the submission date. Depreciated; use getWorkingDate instead.
 */
export const getOrderSubmitDate = () => {
  const bpbTime = getBpbTime()
  const bpbHour = bpbTime.hour
  const orderSubmitDate = bpbHour >= CUTOFF_TIME ? 
    bpbTime.startOf('day').plus({ days: 1 }) : 
    bpbTime.startOf('day')
  
  return orderSubmitDate
}

/**
 * Apply BPB locale and 6pm cutoff rules to the given iso 
 * datetime to determine the equivalent working date.
 * 
 * Returns a Luxon DateTime object
 *
 * Also accepts the input 'NOW' to return the current working date.
 */
export const getWorkingDateTime = (isoDateTimeString) => {
  const bpbTime = isoDateTimeString === 'NOW' ?
    DateTime.now().setZone('America/Los_Angeles') :
    DateTime.fromISO(isoDateTimeString).setZone('America/Los_Angeles')

  const bpbHour = bpbTime.hour
  const workingDate = bpbHour >= CUTOFF_TIME ? 
    bpbTime.startOf('day').plus({ days: 1 }) : 
    bpbTime.startOf('day')

  return workingDate
}

/**
 * Simple conversion from getWorkingDateTime's DateTime output to ISO yyyy-mm-dd string.
 * 
 * Also accepts the input 'NOW' to return the current working date.
 */
export const getWorkingDate = (isoDateTimeString) => {
  return getWorkingDateTime(isoDateTimeString).toISODate()
}

export const getWorkingDateJS = (isoDateTimeString) => {
  return getWorkingDateTime(isoDateTimeString).toJSDate()
}

/**
 * Returns an array of ISO strings starting from the current working date (T +0)
 * to three days ahead (T +3). Default format is yyyy-mm-dd string; use format parameter
 * value 'isoDateTime' to return full UTC date + time strings.
 */
export const getTransitionDates = (format) => {
  const T0 = getWorkingDateTime('NOW')
  
  if (format === 'isoDate' || !format) return([T0.toISODate(), T0.plus({ days: 1}).toISODate(), T0.plus({ days: 2}).toISODate(), T0.plus({ days: 3}).toISODate()])
  if (format === 'UTCString') return([T0.toISO(), T0.plus({ days: 1}).toISO(), T0.plus({ days: 2}).toISO(), T0.plus({ days: 3}).toISO()])

}

/**
 * Takes a JS Date object and returns a mm/dd/yyyy string.
 */
export function dateToMmddyyyy(date) {
  if (!date) return null

  const mm = ('0' + (date.getMonth() + 1)).slice(-2) 
  const dd = ('0' + date.getDate()).slice(-2)
  const yyyy = date.getFullYear()

  return (mm + '/' + dd + '/' + yyyy)
}

/**
 * Takes a JS Date object and returns an IS0 yyyy-mm-dd string.
 */
export function dateToYyyymmdd(date) {
  if (!date) return null
  return date.toISOString().split('T')[0]
}

/**
 * Convert JS date into capitalized 3 letter weekday,
 * compatible with database entries.
 */

export function getWeekday(date) {
  if (!date) return null
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return (weekdays[date.getDay()])
}


/**
 * Takes a js Date object and returns a ttl unix timestamp in seconds.
 * Calculates ttl as the end of the work date after the given deliv date.
 * 
 * Ex: delivDate = 2023-01-28
 * 
 * Then we want the ttl to represent 2023-01-29 at 6:00pm in our locale ('America/Los_Angeles').
 * 
 */
export function getTtl(delivDate) {
  return getWorkingDateTime(delivDate.toISOString()).plus({ days: 1}).plus({ hours: CUTOFF_TIME}).toSeconds()
}