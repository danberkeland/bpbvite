import { DateTime } from "luxon"
import { CUTOFF_TIME_HOURS } from "../../constants/constants"

/**
 * More convenient way to calculate standard TTL, 
 * using a yyyy-MM-dd formatted date string.
 */
export const getTimeToLive = (delivDateISO_8601) => {
  return (
    DateTime.fromFormat(
      delivDateISO_8601, 
      'yyyy-MM-dd', 
      { zone: 'America/Los_Angeles' }
    ).plus({ days: 1 }).plus({ hours: CUTOFF_TIME_HOURS }).toSeconds()
  )
}