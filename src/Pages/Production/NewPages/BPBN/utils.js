import { round } from "lodash"
import { DateTime } from "luxon"

export const getTodayDT = () => DateTime.now()
  .setZone('America/Los_Angeles')
  .startOf('day')
  
export const isoToDT = (isoDate) => DateTime
  .fromFormat(isoDate, 'yyyy-MM-dd', { zone: 'America/Los_Angeles' })
  .startOf('day')

/**
 * Takes a decimal number representation of time and formats as a string
 * 
 * @example formatHours(8.25) // "8:15am"
 */
 export const formatHours = (timeFloat) => {
   const hour = Math.floor(Number(timeFloat)) || 0
   const minute = round((Number(timeFloat) - hour) * 60) || 0
   return DateTime.fromObject({ hour, minute }).toFormat('h:mm')
 }