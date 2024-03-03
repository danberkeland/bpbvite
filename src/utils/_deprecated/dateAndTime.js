import { DateTime } from "luxon";
import { CUTOFF_TIME_HOURS } from "../../constants/constants";

export const getWorkingDateTime = (isoDateTimeString) => {
  const bpbTime = isoDateTimeString === 'NOW' ?
    DateTime.now().setZone('America/Los_Angeles') :
    DateTime.fromISO(isoDateTimeString).setZone('America/Los_Angeles')

  const bpbHour = bpbTime.hour
  const workingDate = bpbHour >= CUTOFF_TIME_HOURS 
    ? bpbTime.startOf('day').plus({ days: 1 }) 
    : bpbTime.startOf('day')

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