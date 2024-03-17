import { round } from "lodash"
import { DateTime } from "luxon"

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